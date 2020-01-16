import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'premier-cmp',
    moduleId: module.id,
    templateUrl: 'premier.component.html'
})

export class PremierComponent implements OnInit{
    public leagueTable: TableData;
    public leagueMatches: TableData;
    public season;
    public visibleLegend = false;

    constructor(private appService: AppService){
        this.appService.getPlayers();
        this.appService.getActions();
        this.appService.getTournaments();
        this.appService.getTeams();
    }

    ngOnInit() {
        this.appService.getMatchesObservable().subscribe( (response2) => {
            this.appService.data.matches = response2.json().matches;
            this.appService.getStandingsObservable().subscribe( (response) => {
                if(response.json().success) {
                    this.appService.data.standings = response.json().standings;
                    const leagueLastEdition = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.primera.name);
                    this.season = parseInt(leagueLastEdition.edition);
                    const mappedTable = this.appService.data.standings.filter( (filteredStanding) => {
                        return filteredStanding.tournamentID == leagueLastEdition.id;
                    })
                    .map( (value) => {
                        return {
                            position: 0,
                            team: this.appService.getTeamById(parseInt(value.team)).name,
                            round: parseInt(value.round),
                            won: parseInt(value.won),
                            draw: parseInt(value.draw),
                            lost: parseInt(value.lost),
                            nonPlayed: parseInt(value.nonPlayed),
                            goalsFor: parseInt(value.goalsFor),
                            goalsAgainst: parseInt(value.goalsAgainst),
                            goalDifference: parseInt(value.goalsFor) - parseInt(value.goalsAgainst),
                            points: parseInt(value.points)
                        };
                    });
                    let pStands = [];
                    while (mappedTable.length != 0) {
                        let indexToInsert = -1;
                        let maxPoints = -1;
                        mappedTable.forEach( (value, key) => {
                            if (value.points > maxPoints) {
                                indexToInsert = key;
                                maxPoints = value.points;
                            }
                        });
                        let teamToInsert = mappedTable.splice(indexToInsert, 1);
                        pStands.push(teamToInsert[0]);
                    }
                    let aux = null;
                    for (let i = 0; i < pStands.length; i++) {
                        for (let j = 0; j < pStands.length - 1 - i; j++) {
                            if (pStands[j].points == pStands[j+1].points && pStands[j].goalDifference < pStands[j+1].goalDifference) {
                                pStands[j][0]++;
                                pStands[j+1][0]--;
                                aux = pStands[j];
                                pStands[j] = pStands[j+1];
                                pStands[j+1] = aux;
                            }
                            if (pStands[j].points == pStands[j+1].points && pStands[j].goalDifference == pStands[j+1].goalDifference && pStands[j].goalsFor == pStands[j+1].goalsFor) {
                                pStands[j][0]++;
                                pStands[j+1][0]--;
                                aux = pStands[j];
                                pStands[j] = pStands[j+1];
                                pStands[j+1] = aux;
                            }
                        }
                    }
                    pStands.forEach( (value, key) => {
                        value.position = key + 1;
                    });
                    this.leagueTable = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueTable, pStands);
                    const mappedMatches = this.appService.data.matches.filter( (filteredMatch) => {
                        return filteredMatch.tournament == leagueLastEdition.id;
                    });
                    this.leagueMatches = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueMatches, mappedMatches);
                }
            });
        });
    }

    public showResume(match) {
        this.appService.showResume(match, this.appService.data.actions.filter( (filteredAction) => {
            return filteredAction.matchID == match.id;
        }));
    }
}

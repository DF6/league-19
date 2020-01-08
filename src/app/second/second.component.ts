import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'second-cmp',
    moduleId: module.id,
    templateUrl: 'second.component.html'
})

export class SecondComponent implements OnInit{
    public leagueTable: TableData;
    public leagueMatches: TableData;
    public season;
    public visibleLegend = false;

    constructor(private appService: AppService){
        this.appService.getTeams();
        this.appService.getTournaments();
    }

    ngOnInit() {
        this.appService.getMatchesObservable().subscribe( (response2) => {
            this.appService.data.matches = response2.json().matches;
            this.appService.getStandingsObservable().subscribe( (response) => {
                if(response.json().success) {
                    this.appService.data.standings = response.json().standings;
                    const leagueLastEdition = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.segunda.name);
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
                    let sStands = [];
                    let position = 1;
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
                        teamToInsert[0].position = position;
                        sStands.push(teamToInsert[0]);
                        position++;
                    }
                    let aux = null;
                    for (let i = 0; i < sStands.length; i++) {
                        for (let j = 0; j < sStands.length - 1 - i; j++) {
                            if (sStands[j].points == sStands[j+1].points && sStands[j].goalDifference < sStands[j+1].goalDifference) {
                                sStands[j][0]++;
                                sStands[j+1][0]--;
                                aux = sStands[j];
                                sStands[j] = sStands[j+1];
                                sStands[j+1] = aux;
                            }
                            if (sStands[j].points == sStands[j+1].points && sStands[j].goalDifference == sStands[j+1].goalDifference && sStands[j].goalsFor == sStands[j+1].goalsFor) {
                                sStands[j][0]++;
                                sStands[j+1][0]--;
                                aux = sStands[j];
                                sStands[j] = sStands[j+1];
                                sStands[j+1] = aux;
                            }
                        }
                    }
                    this.leagueTable = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueTable, sStands);
                    const mappedMatches = this.appService.data.matches.filter( (filteredMatch) => {
                        return filteredMatch.tournament == leagueLastEdition.id;
                    });
                    this.leagueMatches = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueMatches, mappedMatches);
                }
            });
        });
    }

    public showSummary(match) {
        let matchSummary = this.appService.getMatchById(match);
        let message = this.appService.getTeamById(matchSummary.local).name + ' ' + matchSummary.localGoals + ' - ';
        message += this.appService.getTeamById(matchSummary.away).name + ' ' + matchSummary.awayGoals;
        $.notify({
        	icon: "ti-gift",
        	message: message
        },{
            type: 'success',
            timer: 4000,
            placement: {
                from: 'top',
                align: 'center'
            }
        });
    }
}
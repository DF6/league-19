import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'nations-cmp',
    moduleId: module.id,
    templateUrl: 'nations.component.html'
})

export class NationsComponent implements OnInit{
    public groupTables;
    public allMatches;
    public KOMatches;
    public champion;
    public season;
    public visibleLegend = false;

    constructor(private appService: AppService){
        this.appService.getTournaments();
        this.appService.getTeams();
    }

    ngOnInit() {
        this.appService.getStandingsObservable().subscribe( (response) => {
            this.appService.data.standings = response.json().standings;
            this.appService.getMatchesObservable().subscribe( (response2) => {
                this.appService.data.matches = response2.json().matches;
                const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.nationsLeague.name);
                this.season = tournament.edition;
                let groupAStandings = [];
                let groupBStandings = [];
                let groupCStandings = [];
                let groupDStandings = [];
                const tournamentStandings = this.appService.data.standings.filter( (filteredStanding) => {
                    return filteredStanding.tournamentID == tournament.id;
                });
                groupAStandings = tournamentStandings.filter( (filteredStanding) => {
                    return filteredStanding.tournamentGroup == '1';
                })
                .map( (value) => {
                    return {
                        position: 0,
                        team: this.appService.getTeamById(parseInt(value.team)),
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
                groupBStandings = tournamentStandings.filter( (filteredStanding) => {
                    return filteredStanding.tournamentGroup == '2';
                })
                .map( (value) => {
                    return {
                        position: 0,
                        team: this.appService.getTeamById(parseInt(value.team)),
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
                groupCStandings = tournamentStandings.filter( (filteredStanding) => {
                    return filteredStanding.tournamentGroup == '3';
                })
                .map( (value) => {
                    return {
                        position: 0,
                        team: this.appService.getTeamById(parseInt(value.team)),
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
                groupDStandings = tournamentStandings.filter( (filteredStanding) => {
                    return filteredStanding.tournamentGroup == '4';
                })
                .map( (value) => {
                    return {
                        position: 0,
                        team: this.appService.getTeamById(parseInt(value.team)),
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
                const groupA = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueTable, this.getOrdenatedStanding(groupAStandings));
                const groupB = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueTable, this.getOrdenatedStanding(groupBStandings));
                const groupC = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueTable, this.getOrdenatedStanding(groupCStandings));
                const groupD = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueTable, this.getOrdenatedStanding(groupDStandings));
                this.groupTables = [groupA, groupB, groupC, groupD];
                const finalTableMatches = this.appService.data.matches.filter( (filteredMatch) => {
                    return filteredMatch.tournament == tournament.id;
                });
                this.allMatches = this.appService.getTableConfig(this.appService.config.tableHeaders.leagueMatches, finalTableMatches);
                let finalMatches = [];
                for(let i = this.appService.config.tournamentGeneralInfo.nationsLeague.KORound; i <= this.appService.config.tournamentGeneralInfo.nationsLeague.finalRound; i=i) {
                    const filteredRound1 = finalTableMatches.filter( (filteredMatch) => {
                        return filteredMatch.round == i;
                    });
                    const filteredMatches = filteredRound1.map( (match, key) => {
                        return this.appService.getMatchConfiguration(match, this.appService.getClassNames(this.appService.config.classNameSizes.medium), key == 0 ? true : false);
                    });
                    if(filteredMatches.length > 0) { 
                        let valid = true;
                        filteredMatches.forEach( (value) => {
                            if(value == null) { valid = false; }
                        });
                        if(valid) { finalMatches.push(filteredMatches); }
                    }
                }
                this.KOMatches = finalMatches;
                this.champion = this.appService.whoWon(this.appService.data.matches.filter( (filteredMatch) => {
                    return filteredMatch.tournament == tournament.id && filteredMatch.round == this.appService.config.tournamentGeneralInfo.nationsLeague.finalRound;
                })[0]);
            });
        });
    }

    private getOrdenatedStanding(groupStandings) {
        let pStands = [];
        while (groupStandings.length != 0) {
            let indexToInsert = -1;
            let maxPoints = -1;
            groupStandings.forEach( (value, key) => {
                if (value.points > maxPoints) {
                    indexToInsert = key;
                    maxPoints = value.points;
                }
            });
            let teamToInsert = groupStandings.splice(indexToInsert, 1);
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
        return pStands;
    }

    public showResume(match) {
        this.appService.showResume(match, this.appService.data.actions.filter( (filteredAction) => {
            return filteredAction.matchID == match.id;
        }));
    }
}

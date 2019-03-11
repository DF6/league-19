import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'champions-cmp',
    moduleId: module.id,
    templateUrl: 'champions.component.html'
})

export class ChampionsComponent implements OnInit{
    public groupA: TableData;
    public groupB: TableData;
    public groupC: TableData;
    public groupD: TableData;
    public tournaments: any[];
    public teams: any[];
    public standingsArray;
    public season;
    public matches;

    constructor(private http: Http){}

    ngOnInit() {
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.setTableConfig();
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'ST'}).subscribe( (response) => {
            this.standingsArray = response.json().standings;
            const championsLastEdition = this.getLastEdition('Champions', this.standingsArray[16].tournamentID).toString();
            this.season = championsLastEdition;
            let groupAStandings = [];
            let groupBStandings = [];
            let groupCStandings = [];
            let groupDStandings = [];
            let aStands = [];
            let bStands = [];
            let cStands = [];
            let dStands = [];
            for (let i = 16; i < 32; i++) {
                if (this.standingsArray[i].tournamentID == championsLastEdition) {
                    switch(i) {
                        case 16:
                        case 17:
                        case 18:
                        case 19:
                            groupAStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).name,
                                parseInt(this.standingsArray[i].round),
                                parseInt(this.standingsArray[i].won),
                                parseInt(this.standingsArray[i].draw),
                                parseInt(this.standingsArray[i].lost),
                                parseInt(this.standingsArray[i].goalsFor),
                                parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].goalsFor) - parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].points)
                            ]);
                            break;
                        case 20:
                        case 21:
                        case 22:
                        case 23:
                            groupBStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).name,
                                parseInt(this.standingsArray[i].round),
                                parseInt(this.standingsArray[i].won),
                                parseInt(this.standingsArray[i].draw),
                                parseInt(this.standingsArray[i].lost),
                                parseInt(this.standingsArray[i].goalsFor),
                                parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].goalsFor) - parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].points)
                            ]);
                            break;
                        case 24:
                        case 25:
                        case 26:
                        case 27:
                            groupCStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).name,
                                parseInt(this.standingsArray[i].round),
                                parseInt(this.standingsArray[i].won),
                                parseInt(this.standingsArray[i].draw),
                                parseInt(this.standingsArray[i].lost),
                                parseInt(this.standingsArray[i].goalsFor),
                                parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].goalsFor) - parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].points)
                            ]);
                        break;
                        case 28:
                        case 29:
                        case 30:
                        case 31:
                            groupDStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).name,
                                parseInt(this.standingsArray[i].round),
                                parseInt(this.standingsArray[i].won),
                                parseInt(this.standingsArray[i].draw),
                                parseInt(this.standingsArray[i].lost),
                                parseInt(this.standingsArray[i].goalsFor),
                                parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].goalsFor) - parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].points)
                            ]);
                            break;
                    }
                    
                }
            }

            let position = 1;
            while(groupAStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupAStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = groupAStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                aStands.push(teamToInsert[0]);
                position++;
            }
            position = 1;
            while(groupBStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupBStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = groupBStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                bStands.push(teamToInsert[0]);
                position++;
            }
            while(groupCStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupCStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = groupCStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                bStands.push(teamToInsert[0]);
                position++;
            }
            while(groupDStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupDStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = groupDStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                bStands.push(teamToInsert[0]);
                position++;
            }
            this.groupA.dataRows = aStands;
            this.groupB.dataRows = bStands;
            this.groupC.dataRows = cStands;
            this.groupD.dataRows = dStands;
        });
        /*this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            this.matches = response.json() ? response.json().matches : null;
            sessionStorage.setItem('matches', JSON.stringify({matches: this.matches}));
            let premierMatches = [];
            let secondMatches = [];
            const championsLastEdition = this.getLastEdition('Primera', this.standingsArray[0].tournamentID).toString();
            const secondLastEdition = this.getLastEdition('Segunda', this.standingsArray[8].tournamentID).toString();
            this.matches.forEach( (value) => {
                if(value.tournament == championsLastEdition) {
                    premierMatches.push(value);
                }else if(value.tournament == secondLastEdition) {
                    secondMatches.push(value);
                }
            });
            this.tableData3.dataRows = premierMatches;
            this.tableData4.dataRows = secondMatches;
        });*/
    }

    private getLastEdition(league, tournament_id) {
        let lastEdition = -1;
        for (let i = 0; i < this.tournaments.length; i++) {
            if (this.tournaments[i].name == league && tournament_id == this.tournaments[i].id) {
                lastEdition = tournament_id;
            }
        }
        return lastEdition;
    }

    public getMatchById(match) {
        let matchToReturn = null;
        this.matches.forEach( (value) => {
            if (value.id == match) {
                matchToReturn = value;
            }
        });
        return matchToReturn;
    }

    public getTeamById(team) {
        let teamToReturn = null;
        this.teams.forEach( (value) => {
            if (value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    public showSummary(match) {
        let matchSummary = this.getMatchById(match);
        let message = this.getTeamById(matchSummary.local).name + ' ' + matchSummary.localGoals + ' - ';
        message += this.getTeamById(matchSummary.away).name + ' ' + matchSummary.awayGoals;
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

    private setTableConfig() {
        this.groupA = {
            headerRow: [ 'position', 'team', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.groupB = {
            headerRow: [ 'position', 'team', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.groupC = {
            headerRow: [ 'round', 'local', 'result', 'away', 'summary'],
            dataRows: []
        };
        this.groupD = {
            headerRow: [ 'round', 'local', 'result', 'away', 'summary'],
            dataRows: []
        };
    }
}

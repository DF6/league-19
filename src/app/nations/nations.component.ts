import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

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
    public groupA: TableData;
    public groupB: TableData;
    public groupC: TableData;
    public groupD: TableData;
    public nationsMatches: TableData;
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
            const nationsLastEdition = this.getLastEdition('Nations', this.standingsArray[32].tournamentID).toString();
            this.season = nationsLastEdition;
            let groupAStandings = [];
            let groupBStandings = [];
            let groupCStandings = [];
            let groupDStandings = [];
            let aStands = [];
            let bStands = [];
            let cStands = [];
            let dStands = [];
            for (let i = 32; i < 48; i++) {
                if (this.standingsArray[i].tournamentID == nationsLastEdition) {
                    switch(i) {
                        case 32:
                        case 33:
                        case 34:
                        case 35:
                            groupAStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).nation,
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
                        case 36:
                        case 37:
                        case 38:
                        case 39:
                            groupBStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).nation,
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
                        case 40:
                        case 41:
                        case 42:
                        case 43:
                            groupCStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).nation,
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
                        case 44:
                        case 45:
                        case 46:
                        case 47:
                            groupDStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).nation,
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
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            this.matches = response.json() ? response.json().matches : null;
            sessionStorage.setItem('matches', JSON.stringify({matches: this.matches}));
            let nlMatches = [];
            const nationsLastEdition = this.getLastEdition('Nations', this.standingsArray[32].tournamentID).toString();
            this.matches.forEach( (value) => {
                if(value.tournament == nationsLastEdition) {
                    nlMatches.push(value);
                }
            });
            this.nationsMatches.dataRows = nlMatches;
        });
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
            headerRow: [ 'position', 'nation', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.groupB = {
            headerRow: [ 'position', 'nation', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.groupC = {
            headerRow: [ 'position', 'nation', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.groupD = {
            headerRow: [ 'position', 'nation', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.nationsMatches = {
            headerRow: [ 'round', 'local', 'result', 'away', 'summary'],
            dataRows: []
        };
    }
}

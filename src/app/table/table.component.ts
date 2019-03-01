import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'table.component.html'
})

export class TableComponent implements OnInit{
    public tableData1: TableData;
    public tableData2: TableData;
    public tableData3: TableData;
    public tableData4: TableData;
    public tournaments: any[];
    public teams: any[];
    public standingsArray;
    public season;

    constructor(private http: Http){}

    ngOnInit() {
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.setTableConfig();
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'ST'}).subscribe( (response) => {
            this.standingsArray = response.json().standings;
            const premierLastEdition = this.getLastEdition('Primera', this.standingsArray[0].tournamentID).toString();
            this.season = premierLastEdition;
            const secondLastEdition = this.getLastEdition('Segunda', this.standingsArray[8].tournamentID).toString();
            let premierStandings = [];
            let secondStandings = [];
            let pStands = [];
            let sStands = [];
            for (let i = 0; i < this.standingsArray.length; i++) {
                if (this.standingsArray[i].tournamentID == premierLastEdition) {
                    premierStandings.push([
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
                }else if (this.standingsArray[i].tournamentID == secondLastEdition) {
                    secondStandings.push([
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
                }
            }

            let position = 1;
            while(premierStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                premierStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = premierStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                pStands.push(teamToInsert[0]);
                position++;
            }
            position = 1;
            while(secondStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                secondStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = secondStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                sStands.push(teamToInsert[0]);
                position++;
            }
            this.tableData1.dataRows = pStands;
            this.tableData2.dataRows = sStands;
        });
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            const matches = response.json() ? response.json().matches : null;
            sessionStorage.setItem('matches', JSON.stringify({matches: matches}));
            let premierMatches = [];
            let secondMatches = [];
            const premierLastEdition = this.getLastEdition('Primera', this.standingsArray[0].tournamentID).toString();
            const secondLastEdition = this.getLastEdition('Segunda', this.standingsArray[8].tournamentID).toString();
            matches.forEach( (value) => {
                if(value.tournament == premierLastEdition) {
                    premierMatches.push(value);
                }else if(value.tournament == secondLastEdition) {
                    secondMatches.push(value);
                }
            });
            this.tableData3.dataRows = premierMatches;
            this.tableData4.dataRows = secondMatches;
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

    public getTeamById(team) {
        let teamToReturn = null;
        this.teams.forEach( (value) => {
            if(value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    private setTableConfig() {
        this.tableData1 = {
            headerRow: [ 'position', 'team', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.tableData2 = {
            headerRow: [ 'position', 'team', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.tableData3 = {
            headerRow: [ 'round', 'local', 'result', 'away', 'summary'],
            dataRows: []
        };
        this.tableData4 = {
            headerRow: [ 'round', 'local', 'result', 'away', 'summary'],
            dataRows: []
        };
    }
}

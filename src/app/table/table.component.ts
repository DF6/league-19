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
    public tournaments: any[];
    public teams: any[];

    constructor(private http: Http){}

    ngOnInit() {
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.setTableConfig();
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'ST'}).subscribe( (response) => {
            let standingsArray = response.json().standings;
            const premierLastEdition = this.getLastEdition('Primera', standingsArray[0].tournamentID).toString();
            const secondLastEdition = this.getLastEdition('Segunda', standingsArray[8].tournamentID).toString();
            let premierStandings = [];
            let secondStandings = [];
            let pStands = [];
            let sStands = [];
            for (let i = 0; i < standingsArray.length; i++) {
                if (standingsArray[i].tournamentID == premierLastEdition) {
                    premierStandings.push([
                        0,
                        this.getTeamById(parseInt(standingsArray[i].team)).name,
                        parseInt(standingsArray[i].round),
                        parseInt(standingsArray[i].won),
                        parseInt(standingsArray[i].draw),
                        parseInt(standingsArray[i].lost),
                        parseInt(standingsArray[i].goalsFor),
                        parseInt(standingsArray[i].goalsAgainst),
                        parseInt(standingsArray[i].goalsFor) - parseInt(standingsArray[i].goalsAgainst),
                        parseInt(standingsArray[i].points)
                    ]);
                }else if (standingsArray[i].tournamentID == secondLastEdition) {
                    secondStandings.push([
                        0,
                        this.getTeamById(parseInt(standingsArray[i].team)).name,
                        parseInt(standingsArray[i].round),
                        parseInt(standingsArray[i].won),
                        parseInt(standingsArray[i].draw),
                        parseInt(standingsArray[i].lost),
                        parseInt(standingsArray[i].goalsFor),
                        parseInt(standingsArray[i].goalsAgainst),
                        parseInt(standingsArray[i].goalsFor) - parseInt(standingsArray[i].goalsAgainst),
                        parseInt(standingsArray[i].points)
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
    }
}

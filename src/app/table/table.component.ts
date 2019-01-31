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
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments'));
        this.teams = JSON.parse(sessionStorage.getItem('teams'));
        this.setTableConfig();
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'ST'}).subscribe( (response) => {
            let standingsArray = response.json().standings;
            const premierLastEdition = this.getLastEdition('Primera', standingsArray[0].tournamentID).toString();
            const secondLastEdition = this.getLastEdition('Segunda', standingsArray[8].tournamentID).toString();
            let premierStandings = [];
            let secondStandings = [];
            for (let i = 0; i < standingsArray.length; i++) {
                if (standingsArray[i].tournamentID == premierLastEdition) {
                    premierStandings.push([
                        0,
                        parseInt(standingsArray[i].team),
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
                        parseInt(standingsArray[i].team),
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

            for (let p = 1; p < premierStandings.length; p++) {
                let p2 = p
                while (p2 > 0) {
                    if (parseInt(premierStandings[p2][9]) > parseInt(premierStandings[p2 - 1][9])){
                        premierStandings.splice(p2 - 1, 0, premierStandings.splice(p, 1)[0]);
                        p2 = 0;
                    }
                    p2--;
                }
            }
            for ( let p = 1; p < secondStandings.length; p++) {
                for (let p2 = p; p2 > 0 && parseInt(secondStandings[p2][9]) > parseInt(secondStandings[p2 - 1][9]); p2--) {
                    secondStandings.splice(p2 - 1, 0, secondStandings.splice(p, 1)[0]);
                }
            }
            this.tableData1.dataRows = premierStandings;
            this.tableData2.dataRows = secondStandings;
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

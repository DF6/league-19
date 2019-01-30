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

    constructor(private http: Http){}

    ngOnInit(){
        this.setTableConfig();
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'ST'}).subscribe( (response) => {
            /*let premierLastEdition = this.getLastEdition('Primera', response);
            let secondLastEdition = this.getLastEdition('Segunda', response);
            let premierStandings = [];
            let secondStandings = [];
            for(let i = 0; i < response; i++) {
                if(response[i].tournament_id == premierLastEdition) {
                    premierStandings.push([
                        response[i].team,
                        response[i].round,
                        response[i].won,
                        response[i].draw,
                        response[i].lost,
                        response[i].goalsFor,
                        response[i].goalsAgainst,
                        response[i].goalsFor - response[i].goalsAgainst,
                        response[i].points
                    ]);
                }else if (response[i].tournament_id == secondLastEdition) {
                    secondStandings.push([
                        response[i].team,
                        response[i].round,
                        response[i].won,
                        response[i].draw,
                        response[i].lost,
                        response[i].goalsFor,
                        response[i].goalsAgainst,
                        response[i].goalsFor - response[i].goalsAgainst,
                        response[i].points
                    ]);
                }
            }

            for(let p = 1; p < premierStandings.length; p++) {
                for(let p2 = p; p2 > 0 && premierStandings[p2].points > premierStandings[p2-1].points; p2--) {
                    premierStandings.splice(p2-1, 0, premierStandings.splice(p, 1)[0]);
                }
            }
            for(let p = 1; p < secondStandings.length; p++) {
                for(let p2 = p; p2 > 0 && secondStandings[p2].points > secondStandings[p2-1].points; p2--) {
                    secondStandings.splice(p2-1, 0, secondStandings.splice(p, 1)[0]);
                }
            }*/
            console.log(response);
        });
    }

    private getLastEdition(league, tournament_id) {
        let tournaments = window.sessionStorage.getItem('tournaments');
        let lastEdition = -1;
        for (let i = 0; i < tournaments.length; i++) {
            /*if(tournaments[i].name == league && tournament_id == tournaments[i].id) {
                lastEdition = tournament_id;
            }*/
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

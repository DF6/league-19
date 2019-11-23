import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { constants } from 'os';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'market-cmp',
    moduleId: module.id,
    templateUrl: 'market.component.html'
})

export class MarketComponent implements OnInit{
    public tableData1: TableData;
    public players;
    public signins;
    public user;
    public teams;
    public constants;
    public edition;

    constructor(private http: Http){}

    ngOnInit() {
        this.http.post('./test_CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.constants = response.json().constants[0];
            this.edition = this.constants.marketEdition;
            this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
            this.setTableConfig();
            this.setTable();
        });
    }

    public setTable() {
        this.tableData1.dataRows = [];
        this.http.post('./test_CMDataRequesting.php', {type: 'recDat', dataType: 'S'}).subscribe( (response) => {
            this.signins = response.json().signins;
            this.http.post('./test_CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
                this.players = response.json().players;
                let marketResume = [];
                this.signins.forEach( (value) => {
                    if (value.market == this.constants.marketEdition && value.accepted == '1') {
                        let player = this.getPlayerById(value.player);
                        let type = '';
                        let oldTeam = '-';
                        switch(value.signinType) {
                            case 'A': type = 'Subasta'; oldTeam = 'Subasta'; break;
                            case 'G': type = 'Acuerdo'; oldTeam = this.getTeamById(value.oldTeam).name; break;
                            case 'C': type = 'Cesión'; oldTeam = this.getTeamById(value.oldTeam).name; break;
                            case 'F': type = 'Cláusula'; oldTeam = this.getTeamById(value.oldTeam).name; break;
                            case 'W': type = 'Libre'; oldTeam = 'Libre'; break;
                            case 'D': type = 'Descarte'; oldTeam = this.getTeamById(value.oldTeam).name; break;
                        }
                        let auction = { id: value.id, 
                            name: player.name,
                            position: player.position,
                            overage: player.overage,
                            type: type,
                            amount: value.amount + 'M€',
                            oldTeam: oldTeam,
                            newTeam: this.getTeamById(value.buyerTeam).name};
                        marketResume.push(auction);
                    }
                });
                this.tableData1.dataRows = marketResume;
            });
        });
    }

    public getPlayerById(player) {
        let playerToReturn = null;
        this.players.forEach( (value) => {
            if (value.id == player) {
                playerToReturn = value;
            }
        });
        return playerToReturn;
    }

    public getTeamById(team) {
        let teamToReturn = null;
        if(team == 0) 
        {
            teamToReturn = {
                name: 'Libre'
            }
        } else if(team == -1) {
            teamToReturn = {
                name: 'N/D'
            }
        } else {
            this.teams.forEach( (value) => {
                if (value.id == team) {
                    teamToReturn = value;
                }
            });
        }
        return teamToReturn;
    }

    private setTableConfig() {
        this.tableData1 = {
            headerRow: [ 'name', 'position', 'overage', 'type', 'amount', 'oldTeam', 'newTeam'],
            dataRows: []
        };
    }
}

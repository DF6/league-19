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
    selector: 'freeplayers-cmp',
    moduleId: module.id,
    templateUrl: 'freeplayers.component.html'
})

export class FreePlayersComponent implements OnInit{
    public tableData1: TableData;
    public players;
    public user;
    public constants;

    constructor(private http: Http){}

    ngOnInit() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.constants = response.json().constants[0];
            this.user = JSON.parse(sessionStorage.getItem('user'));
            this.setTableConfig();
            this.setTable();
        });
    }

    public setTable() {
        this.tableData1.dataRows = [];
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
            this.players = response.json().players;
            let freeplayers = [];
            this.players.forEach( (value) => {
                if (value.teamID == 0) {
                    freeplayers.push(value);
                }
            });
            this.tableData1.dataRows = freeplayers;
        });
    }

    public hireFreePlayer(player) {
        this.http.post('./CMDataRequesting.php', {type: 'conLib', team: this.user.teamID, player: player, market: this.constants.marketEdition}).subscribe( (response) => {
            if(response.json().success) {
                this.setTable();
            }
            alert(response.json().message);
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

    private setTableConfig() {
        this.tableData1 = {
            headerRow: [ 'name', 'position', 'overage', 'hire'],
            dataRows: []
        };
    }
}

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
    selector: 'auctions-cmp',
    moduleId: module.id,
    templateUrl: 'auctions.component.html'
})

export class AuctionsComponent implements OnInit{
    public tableData1: TableData;
    public players;
    public signins;
    public user;
    public teams;
    public constants;
    public amountsRaised = [];

    constructor(private http: Http){}

    ngOnInit() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.constants = response.json().constants[0];
            this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
            this.user = JSON.parse(sessionStorage.getItem('user'));
            this.setTableConfig();
            this.setTable();
        });
    }

    public setTable() {
        this.tableData1.dataRows = [];
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'S'}).subscribe( (response) => {
            this.signins = response.json().signins;
            this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
                this.players = response.json().players;
                let auctionedPlayers = [];
                this.signins.forEach( (value) => {
                    if (value.signinType == 'A' && value.market == this.constants.marketEdition) {
                        let player = this.getPlayerById(value.player);
                        let auction = { id: value.id, 
                            name: player.name,
                            position: player.position,
                            overage: player.overage,
                            team: value.buyerTeam,
                            amount: value.amount,
                            state: value.accepted,
                            time: this.getFormattedTime(value.limitDate)};
                        this.amountsRaised.push(auction.amount);
                        auctionedPlayers.push(auction);
                    }
                });
                this.tableData1.dataRows = auctionedPlayers;
            });
        });
    }

    public raiseAuction(auctionID, index) {
        this.http.post('./CMDataRequesting.php', {type: 'conLib', newTeam: this.user.teamID, id: auctionID, amount: this.amountsRaised[index]}).subscribe( (response) => {
            if(response.json().success) {
                this.setTable();
            } else {
                alert(response.json().message);
            }
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

    public getFormattedTime(date) {

    }

    public updateTime(time) {

    }

    private setTableConfig() {
        this.tableData1 = {
            headerRow: [ 'name', 'position', 'overage', 'team', 'amount', 'state', 'time', 'raise'],
            dataRows: []
        };
    }
}

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
    public new = false;
    public newPlayer = {
        name: '',
        position: '',
        overage: 40,
        amount: 0
    };

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
                            time: value.limitDate};
                        this.amountsRaised.push(auction.amount);
                        auctionedPlayers.push(auction);
                        auctionedPlayers[auctionedPlayers.length - 1].time = this.getFormattedTime(auctionedPlayers[auctionedPlayers.length - 1]);
                    }
                });
                this.tableData1.dataRows = auctionedPlayers;
            });
        });
    }

    public raiseAuction(auctionID, index) {
        this.http.post('./CMDataRequesting.php', {type: 'pujSub', newTeam: this.user.teamID, id: auctionID, amount: this.amountsRaised[index]}).subscribe( (response) => {
            if(response.json().success) {
                this.setTable();
            } else {
                alert(response.json().message);
            }
        });
    }

    public addPlayerToAuction() {
        if(confirm("¿Seguro?")) {
            let date = new Date();
            date.setHours(date.getHours() + 12);
            let formattedDate = this.addZero(date.getDate()) + "/" + (this.addZero(date.getMonth()+1)) + "/" + this.addZero(date.getFullYear()) + " " + this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes()) + ":" + this.addZero(date.getSeconds());
            this.http.post('./CMDataRequesting.php', {type: 'nueSub', playerName: this.newPlayer.name, position: this.newPlayer.position.toUpperCase(), amount: this.newPlayer.amount, overage: this.newPlayer.overage, buyerTeam: this.user.teamID, market: this.constants.marketEdition, limitDate: formattedDate}).subscribe( (response) => {
                if(response.json().success) {
                    this.setTable();
                    this.new = false;
                    this.newPlayer = {
                        name: '',
                        position: '',
                        overage: 40,
                        amount: 0
                    };
                }
                alert(response.json().message);
            });
        }
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
        this.teams.forEach( (value) => {
            if (value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    public setAmount() {
        if(!this.newPlayer.overage || this.newPlayer.overage == null || this.newPlayer.overage == undefined) {
            this.newPlayer.amount = 0;
        } else {
            if(this.newPlayer.overage < 71) {
                this.newPlayer.amount = 2;
            } else if(this.newPlayer.overage >= 71 && this.newPlayer.overage < 76) {
                this.newPlayer.amount = 3;
            } else if(this.newPlayer.overage >= 76 && this.newPlayer.overage < 80) {
                this.newPlayer.amount = 5;
            } else if(this.newPlayer.overage >= 81 && this.newPlayer.overage < 86) {
                this.newPlayer.amount = 10;
            } else if(this.newPlayer.overage >= 86) {
                this.newPlayer.amount = 15;
            }
        }
    }

    public getFormattedTime(auction) {
        const countDownDate = new Date(auction.time).getTime();

        let x = setInterval(() => {
          const distance = countDownDate - new Date().getTime();
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          auction.time = this.addZero(hours) + ':' + this.addZero(minutes) + ':' + this.addZero(seconds);

          if (distance < 0) {
            clearInterval(x);
            auction.state = 1;
          }
        }, 1000);
    }

    private addZero(number) {
        if(number<10){number="0"+number;}
        return number;
    }

    private setTableConfig() {
        this.tableData1 = {
            headerRow: [ 'name', 'position', 'overage', 'team', 'amount', 'state', 'time', 'raise'],
            dataRows: []
        };
    }
}

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppService, TableData } from 'app/app.service';

declare var $:any;

@Component({
    selector: 'auctions-cmp',
    moduleId: module.id,
    templateUrl: 'auctions.component.html'
})

export class AuctionsComponent {
    public tableData1: TableData;
    public amountsRaised = [];
    public new = false;
    public newPlayer = {
        name: '',
        position: '',
        overage: this.appService.config.auctionDefaultOverage,
        amount: 0
    };

    constructor(private http: Http, private appService: AppService) {
        this.tableData1 = this.appService.getTableConfig(this.appService.config.tableHeaders.auctions);
        this.appService.getConstants();
        this.appService.getTeams();
        this.appService.getPlayers();
        this.appService.getSigninsObservable().subscribe( (response) => {
            this.appService.setSignins(response.json().signins);
            this.setTable();
        });
    }

    public setTable() {
        this.tableData1.dataRows = [];
        const dataRows = this.appService.data.signins
        .filter( (signin) => {
            return signin.signinType == this.appService.config.signinTypes.auction && signin.market == this.appService.data.constants.marketEdition;
        })
        .map( (filteredSignins) => {
            const player = this.appService.getPlayerById(filteredSignins.player);
            const auction = {
                id: filteredSignins.id, 
                name: player.name,
                position: player.position,
                overage: player.overage,
                team: filteredSignins.buyerTeam,
                amount: filteredSignins.amount,
                state: filteredSignins.accepted,
                time: filteredSignins.limitDate
            };
            this.amountsRaised.push(auction.amount);
            auction.time = this.getFormattedTime(auction);
            return auction;
        });
        this.tableData1.dataRows = dataRows;
    }

    public raiseAuction(auctionID, index) {
        this.http.post('./test_CMDataRequesting.php', {type: 'pujSub', newTeam: this.appService.data.user.teamID, id: auctionID, amount: this.amountsRaised[index]}).subscribe( (response) => {
            if(response.json().success) {
                this.appService.insertLog({logType: this.appService.config.logTypes.auctionRaised, logInfo: 'Sobrepuja: ' + this.appService.getPlayerById(this.appService.data.signins.filter( (signin) => { return signin.id == auctionID })[0].player).name + ' por ' + this.amountsRaised[index] + 'M€ (ID ' + auctionID + ')'});
                this.setTable();
                alert('Nueva puja completada');
            } else {
                alert(response.json().message);
            }
        });
    }

    public addPlayerToAuction() {
        if(confirm("¿Seguro?")) {
            let date = new Date();
            date.setHours(date.getHours() + this.appService.config.auctionLimit);
            let formattedDate = this.appService.addZero(date.getDate()) + "/" + 
                                (this.appService.addZero(date.getMonth()+1)) + "/" + 
                                this.appService.addZero(date.getFullYear()) + " " + 
                                this.appService.addZero(date.getHours()) + ":" + 
                                this.appService.addZero(date.getMinutes()) + ":" + 
                                this.appService.addZero(date.getSeconds());
            this.http.post('./test_CMDataRequesting.php', {type: 'nueSub', playerName: this.appService.removeAccents(this.newPlayer.name), position: this.newPlayer.position.toUpperCase(), amount: this.newPlayer.amount, overage: this.newPlayer.overage, buyerTeam: this.appService.data.user.teamID, market: this.appService.data.constants.marketEdition, limitDate: formattedDate}).subscribe( (response) => {
                if(response.json().success) {
                    this.setTable();
                    this.new = false;
                    this.newPlayer = {
                        name: '',
                        position: '',
                        overage: this.appService.config.auctionDefaultOverage,
                        amount: 0
                    };
                    this.appService.insertLog({logType: this.appService.config.logTypes.playerAddedInAuction, logInfo: 'Nuevo jugador en subasta: ' + this.appService.getPlayerById(response.json().newID).name + ' por ' + this.newPlayer.amount + 'M€ (ID ' + response.json().newID + ')'});
                }
                alert(response.json().message);
            });
        }
    }

    public setAmount() {
        if(!this.newPlayer.overage || this.newPlayer.overage == null || this.newPlayer.overage == undefined) {
            this.newPlayer.amount = 0;
        } else {
            this.appService.config.auctionInitialAmounts
            .filter( (amount) => {
                return this.newPlayer.overage >= amount.min && this.newPlayer.overage < amount.max;
            })
            .map( (value) => {
                this.newPlayer.amount = value.amount;
            });
        }
    }

    public getFormattedTime(auction) {
        const countDownDate = new Date(auction.time).getTime();

        let x = setInterval(() => {
          const distance = countDownDate - new Date().getTime();
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          auction.time = this.appService.addZero(hours) + ':' + 
                         this.appService.addZero(minutes) + ':' + 
                         this.appService.addZero(seconds);

          if (distance < 0) {
            clearInterval(x);
            auction.state = 1;
          }
        }, 1000);
    }
}

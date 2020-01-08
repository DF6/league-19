import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppService, TableData } from 'app/app.service';

declare var $:any;

@Component({
    selector: 'auctions-cmp',
    moduleId: module.id,
    templateUrl: 'auctions.component.html'
})

export class AuctionsComponent implements OnInit{
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
        
    }

    ngOnInit() {
        this.appService.getPlayersObservable().subscribe( (response2) => {
            this.appService.data.players = response2.json().players;
            this.appService.getSigninsObservable().subscribe( (response) => {
                this.appService.setSignins(response.json().signins);
                this.setTable();
            });
        });
    }

    public setTable() {
        for(let i = 0; i < 10000; i++) { window.clearInterval(i); }
        this.tableData1.dataRows = [];
        const dataRows = this.appService.data.signins
        .filter( (signin) => {
            return (signin.signinType == this.appService.config.signinTypes.auction || signin.signinType == this.appService.config.signinTypes.freeAuction) && signin.market == this.appService.data.constants.marketEdition;
        })
        .map( (filteredSignins) => {
            const player = this.appService.getPlayerById(filteredSignins.player);
            const auction = {
                id: filteredSignins.id, 
                name: player.name,
                position: player.position,
                overage: player.overage,
                firstTeam: filteredSignins.firstTeam,
                oldTeam: filteredSignins.signinType == this.appService.config.signinTypes.auction ? undefined : player.teamID,
                team: filteredSignins.buyerTeam,
                amount: filteredSignins.amount,
                type: filteredSignins.signinType,
                state: filteredSignins.accepted,
                amplifiedState: filteredSignins.amplifiedState,
                time: filteredSignins.limitDate
            };
            this.amountsRaised.push(auction.amount);
            auction.time = this.getFormattedTime(auction);
            return auction;
        });
        this.tableData1.dataRows = dataRows;
    }

    public raiseAuction(auctionID, index) {
        this.http.post('./test_CMDataRequesting.php', {type: 'pujSub', firstTeam: this.appService.getSigninById(auctionID).firstTeam, newTeam: this.appService.data.user.teamID, id: auctionID, amount: this.amountsRaised[index]}).subscribe( (response) => {
            if(response.json().success) {
                this.appService.insertLog({logType: this.appService.config.logTypes.auctionRaised, logInfo: 'Sobrepuja: ' + this.appService.getPlayerById(this.appService.data.signins.filter( (signin) => { return signin.id == auctionID })[0].player).name + ' por ' + this.amountsRaised[index] + 'M€ (ID ' + auctionID + ')'});
                this.appService.getSigninsObservable().subscribe( (response) => {
                    this.appService.setSignins(response.json().signins);
                    this.setTable();
                });
                alert('Nueva puja completada');
            } else {
                this.appService.getSigninsObservable().subscribe( (response) => {
                    this.appService.setSignins(response.json().signins);
                    alert(response.json().message);
                    this.setTable();
                });
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
            this.http.post('./test_CMDataRequesting.php', {type: 'nueSub', auctionType: this.appService.config.signinTypes.auction, playerName: this.appService.removeAccents(this.newPlayer.name), position: this.newPlayer.position.toUpperCase(), amount: this.newPlayer.amount, overage: this.newPlayer.overage, firstTeam: this.appService.data.user.teamID, buyerTeam: this.appService.data.user.teamID, market: this.appService.data.constants.marketEdition, limitDate: formattedDate}).subscribe( (response) => {
                if(response.json().success) {
                    this.appService.getPlayersObservable().subscribe( (response2) => {
                        this.appService.setPlayers(response2.json().players);
                        this.setTable();
                        this.new = false;
                        this.appService.insertLog({logType: this.appService.config.logTypes.playerAddedInAuction, logInfo: 'Nuevo jugador en subasta: ' + this.appService.getPlayerById(response.json().newID).name + ' por ' + this.newPlayer.amount + 'M€ (ID ' + response.json().newID + ')'});
                        this.newPlayer = {
                            name: '',
                            position: '',
                            overage: this.appService.config.auctionDefaultOverage,
                            amount: 0
                        };
                    })
                }
                alert(response.json().message);
            });
        }
    }

    public setAmount() {
        if(!this.newPlayer.overage || this.newPlayer.overage == null || this.newPlayer.overage == undefined) {
            this.newPlayer.amount = 0;
        } else {
            this.newPlayer = this.appService.getAuctionInitialAmount(this.newPlayer);
        }
    }

    public getFormattedTime(auction) {
        const countDownDate = new Date(auction.time).getTime();

        let x = setInterval(() => {
          const distance = countDownDate - new Date().getTime();
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          if((Math.floor(distance/1000/60/60)) > 24) { hours = hours + 24;}
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

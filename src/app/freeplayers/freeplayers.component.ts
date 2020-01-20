import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { constants } from 'os';
import { AppService } from 'app/app.service';

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
    public freePlayersTable: TableData;
    public players;
    public user;
    public constants;

    constructor(private http: Http, private appService: AppService){
        this.appService.getConstants();
    }

    ngOnInit() {
        this.setTable();
    }

    public setTable() {
        this.appService.getSigninsObservable().subscribe( (response2) => {
            this.appService.data.signins = response2.json().signins;
            this.appService.getPlayersObservable().subscribe( (response) => {
                this.appService.data.players = response.json().players;
                let freeplayers = this.appService.data.players.filter( (filteredPlayer) => {
                    return filteredPlayer.teamID == 0 && !this.appService.isThePlayerInAuction(filteredPlayer);
                })
                .sort( (a, b) => {
                    return parseInt(b.overage) - parseInt(a.overage);
                });
                this.freePlayersTable = this.appService.getTableConfig(this.appService.config.tableHeaders.freePlayers, freeplayers);
            });
        });
    }

    public hireFreePlayer(player) {
        this.http.post('./test_CMDataRequesting.php', {type: 'nueSub', player: player.id, auctionType: this.appService.config.signinTypes.freeAuction, firstTeam: 0, amount: this.appService.getAuctionInitialAmount({overage: parseInt(player.overage), amount: undefined}).amount, market: this.appService.data.constants.marketEdition}).subscribe( (response) => {
            if(response.json().success) { this.setTable(); }
            alert(response.json().message);
        });
    }
}

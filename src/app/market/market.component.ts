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
    selector: 'market-cmp',
    moduleId: module.id,
    templateUrl: 'market.component.html'
})

export class MarketComponent implements OnInit{
    public marketTable: TableData;
    public edition;

    constructor(private http: Http, private appService: AppService){
        this.appService.getTeams();
        this.appService.getConstants();
    }

    ngOnInit() {
        this.appService.getSigninsObservable().subscribe( (response) => {
            this.appService.data.signins = response.json().signins;
            this.appService.getPlayersObservable().subscribe( (response2) => {
                this.appService.data.players = response2.json().players;
                this.appService.data.players.forEach( (value) => {
                    value.name = this.appService.convertNToÑ(value.name);
                });
                this.setTable();
                this.edition = this.appService.data.constants.marketEdition;
            });
        });
    }

    public setTable() {
        if(this.marketTable) { this.marketTable.dataRows = []; }
        const marketRows = this.appService.data.signins.filter( (filteredSignin) => {
            return filteredSignin.market == this.appService.data.constants.marketEdition && filteredSignin.accepted == '1';
        })
        .map( (value) => {
                let player = this.appService.getPlayerById(value.player);
                let type = '';
                let oldTeam = '-';
                switch(value.signinType) {
                    case this.appService.config.signinTypes.auction: type = 'Subasta nueva'; oldTeam = 'NUEVO'; break;
                    case this.appService.config.signinTypes.agreement: type = 'Acuerdo'; oldTeam = this.getTeamById(value.oldTeam).name; break;
                    case this.appService.config.signinTypes.loanAgreement: type = 'Cesión'; oldTeam = this.getTeamById(value.oldTeam).name; break;
                    case this.appService.config.signinTypes.forcedSign: type = 'Cláusula'; oldTeam = this.getTeamById(value.oldTeam).name; break;
                    case this.appService.config.signinTypes.freeAuction: type = 'Subasta de jugador libre'; oldTeam = this.getTeamById(value.firstTeam).name; break;
                }
                let auction = { id: value.id, 
                    name: player.name,
                    position: player.position,
                    overage: player.overage,
                    type: type,
                    amount: value.amount + 'M€',
                    oldTeam: oldTeam,
                    newTeam: this.getTeamById(value.buyerTeam).name};
                return auction;
        });
        this.marketTable = this.appService.getTableConfig(this.appService.config.tableHeaders.marketResume, marketRows);
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
            teamToReturn = this.appService.getTeamById(team);
        }
        return teamToReturn;
    }

}

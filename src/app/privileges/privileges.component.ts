import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

const PHPFILENAME = './CMDataRequesting.php';

@Component({
    selector: 'privileges',
    moduleId: module.id,
    templateUrl: 'privileges.component.html'
})

export class PrivilegesComponent implements OnInit{

    public newBadgeAndClothing;

    public prizes;
    public targetsTable: TableData;
    public playerToUntouchable;
    public showModule;

    constructor(private http: Http, private appService: AppService) {
        this.resetView();
        this.appService.getPlayers();
        this.appService.getTeams();
        this.appService.getTournaments();
        this.appService.getSignins();
    }

    ngOnInit() {
        this.appService.getSigninsObservable().subscribe( (response2) => {
            this.appService.data.signins = response2.json().signins;
            this.appService.getMatchesObservable().subscribe( (response) => {
                this.appService.data.matches = response.json().matches;
            });
        });
    }

    public buy30MinutesNextMarket() {
        if (confirm('¿Comprar adelanto de 30 minutos en cláusulas el próximo mercado?')) {
            this.http.post(PHPFILENAME, {type: 'buyThi', team: this.appService.data.user.teamID, price: this.appService.config.privilegePrices.thirtyMinutes}).subscribe( (response) => {
                alert(response.json().message);
            });
        }
    }

    public buyExtraForcedSignin() {
        if (confirm('¿Comprar cláusula extra?')) {
            this.http.post(PHPFILENAME, {type: 'extFor', team: this.appService.data.user.teamID, price: this.appService.config.privilegePrices.extraForcedSignin}).subscribe( (response) => {
                alert(response.json().message);
            });
        }
    }

    public buyExtraAuction() {
        if (confirm('¿Comprar subasta extra?')) {
            this.http.post(PHPFILENAME, {type: 'extAuc', team: this.appService.data.user.teamID, price: this.appService.config.privilegePrices.extraAuction}).subscribe( (response) => {
                alert(response.json().message);
            });
        }
    }

    public buyInstantAuctionWin() {
        
    }

    public buy30PointsToMyTeamCupTeam() {
        
    }

    public buyUntouchable() {
        if (confirm('¿Hacer intocable?')) {
            this.http.post(PHPFILENAME, {type: 'setUnt', team: this.appService.data.user.teamID, player: this.playerToUntouchable, price: this.appService.config.privilegePrices.untouchable}).subscribe( (response) => {
                alert(response.json().message);
            });
        }
    }

    public buyChampionsLeagueVacancy() {
        
    }

    public changeBadgeAndClothing() {
        if (confirm('¿Cambiar escudo y equipación?')) {
            this.http.post(PHPFILENAME, {type: 'chaBad', team: this.appService.data.user.teamID, newBadge: this.newBadgeAndClothing, price: this.appService.config.privilegePrices.changeBadgeAndClothing}).subscribe( (response) => {
                alert(response.json().message);
                this.newBadgeAndClothing = '';
            });
        }
    }

    public buyPartnerTargetProtection() {
        
    }

    public sellMyTeam() {
        if (confirm('Esta acción supondrá desprenderte de todos tus jugadores por encima de media 80 y recibir instantáneamente el pago íntegro de su cláusula, sin subastarlos ¿Realizar?')) {
            this.http.post(PHPFILENAME, {type: 'venEqu', team: this.appService.data.user.teamID, price: this.appService.config.privilegePrices.sellTeam}).subscribe( (response) => {
                alert(response.json().message);
                this.newBadgeAndClothing = '';
            });
        } 
    }

    public resetView() {
        this.showModule = {
            changeBadgeAndClothing: false,
            protectPartnerTarget: false,
            untouchable: false
        };
    }

}

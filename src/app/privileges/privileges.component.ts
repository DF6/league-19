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
    public auctionToWin;
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
        if (confirm('¿Comprar adelanto de 30 minutos en cláusulas el próximo mercado?') && this.appService.getTeamById(this.appService.data.user.teamID).nextMarketPrivilege == '0') {
            this.http.post(PHPFILENAME, {type: 'buyThi', team: this.appService.data.user.teamID, price: this.appService.config.privilegePrices.thirtyMinutes}).subscribe( (response) => {
                this.appService.insertLog({logType: this.appService.config.logTypes.buyedPrivilege, logInfo: 'Privilegio comprado: ' + this.appService.getTeamById(this.appService.data.user.teamID).name + ' compra 30 minutos extra en el próximo mercado para cláusulas'});
                alert(response.json().message);
                let team = this.appService.getTeamById(this.appService.data.user.teamID);
                team.nextMarketPrivilege = '1';
                this.appService.setTeamById(team);
            });
        }else if(this.appService.getTeamById(this.appService.data.user.teamID).nextMarketPrivilege == '1'){
            alert('Ya tienes este privilegio');
        }
    }

    public buyExtraForcedSignin() {
        if (confirm('¿Comprar cláusula extra?')) {
            this.http.post(PHPFILENAME, {type: 'extFor', team: this.appService.data.user.teamID, price: this.appService.config.privilegePrices.extraForcedSignin}).subscribe( (response) => {
                this.appService.insertLog({logType: this.appService.config.logTypes.buyedPrivilege, logInfo: 'Privilegio comprado: ' + this.appService.getTeamById(this.appService.data.user.teamID).name + ' compra una cláusula extra'});
                alert(response.json().message);
                let team = this.appService.getTeamById(this.appService.data.user.teamID);
                team.forcedSigninsAvailable = parseInt(team.forcedSigninsAvailable) + 1;
                team.forcedSigninsAvailable = team.forcedSigninsAvailable.toString();
                this.appService.setTeamById(team);
            });
        }
    }

    public buyExtraAuction() {
        if (confirm('¿Comprar subasta extra?')) {
            this.http.post(PHPFILENAME, {type: 'extAuc', team: this.appService.data.user.teamID, price: this.appService.config.privilegePrices.extraAuction}).subscribe( (response) => {
                this.appService.insertLog({logType: this.appService.config.logTypes.buyedPrivilege, logInfo: 'Privilegio comprado: ' + this.appService.getTeamById(this.appService.data.user.teamID).name + ' compra una subasta extra'});
                alert(response.json().message);
                let team = this.appService.getTeamById(this.appService.data.user.teamID);
                team.auctionsLeft = parseInt(team.auctionsLeft) + 1;
                team.auctionsLeft = team.auctionsLeft.toString();
                this.appService.setTeamById(team);
            });
        }
    }

    public buyInstantAuctionWin() {
        if (confirm('¿Cerrar subasta por ' + this.appService.getPlayerById(this.auctionToWin.player).name + '?')) {
            this.http.post(PHPFILENAME, {type: 'cloAuc', signin: this.auctionToWin.id, myTeam: parseInt(this.appService.data.user.id), price: this.appService.config.privilegePrices.instantAuctionWin}).subscribe( (response) => {
                this.appService.insertLog({logType: this.appService.config.logTypes.buyedPrivilege, logInfo: 'Privilegio comprado: ' + this.appService.getTeamById(this.appService.data.user.teamID).name + ' cierra subasta de ' + this.appService.getPlayerById(this.auctionToWin.player).name + ' por ' + this.auctionToWin.amount + 'M€ y un recargo por cierre de ' + this.appService.config.privilegePrices.instantAuctionWin + 'M€'});
                alert(response.json().message);
            });
        }
    }

    // public buy30PointsToMyTeamCupTeam() {}

    public buyUntouchable() {
        if (confirm('¿Hacer intocable?')) {
            this.http.post(PHPFILENAME, {type: 'setUnt', team: this.appService.data.user.teamID, player: this.playerToUntouchable.id, price: this.appService.config.privilegePrices.untouchable}).subscribe( (response) => {
                if(response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.buyedPrivilege, logInfo: 'Privilegio comprado: ' + this.appService.getTeamById(this.appService.data.user.teamID).name + ' hace intocable a ' + this.playerToUntouchable.name + ' el próximo mercado'});
                }
                alert(response.json().message);
            });
        }
    }

    public buyChampionsLeagueVacancy() {}

    public changeBadgeAndClothing() {
        if (confirm('¿Cambiar escudo y equipación?')) {
            this.http.post(PHPFILENAME, {type: 'chaBad', team: this.appService.data.user.teamID, newBadge: this.appService.removeAccents(this.newBadgeAndClothing), price: this.appService.config.privilegePrices.changeBadgeAndClothing}).subscribe( (response) => {
                this.appService.insertLog({logType: this.appService.config.logTypes.buyedPrivilege, logInfo: 'Privilegio comprado: ' + this.appService.getTeamById(this.appService.data.user.teamID).name + ' se cambia de nombre a ' + this.newBadgeAndClothing});
                alert(response.json().message);
                this.newBadgeAndClothing = '';
                this.resetView();
            });
        }
    }

    public buyPartnerTargetProtection() {}

    public sellMyTeam() {
        if (confirm('Esta acción supondrá desprenderte de todos tus jugadores por encima de media 80 y recibir instantáneamente el pago íntegro de su cláusula, sin subastarlos ¿Realizar?')) {
            this.http.post(PHPFILENAME, {type: 'venEqu', team: this.appService.data.user.teamID, price: this.appService.config.privilegePrices.sellTeam}).subscribe( (response) => {
                this.appService.insertLog({logType: this.appService.config.logTypes.buyedPrivilege, logInfo: 'Privilegio comprado: ' + this.appService.getTeamById(this.appService.data.user.teamID).name + ' vende su equipo a un jeque'});
                alert(response.json().message);
            });
        } 
    }

    public resetView() {
        this.showModule = {
            changeBadgeAndClothing: false,
            instantAuctionWin: false,
            protectPartnerTarget: false,
            untouchable: false
        };
    }

}

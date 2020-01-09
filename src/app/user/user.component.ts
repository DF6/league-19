import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { RouterLinkWithHref, Router } from '@angular/router';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent{

    public usersTable: TableData;
    public offersTable: TableData;
    public user;
    public oldUser;
    public playersOfMyTeam;
    public pass;
    public pass2;
    public holidaysMessage;
    public totalSalaries;
    public totalNextSalaries;
    public salaryMode = false;
    public signins;
    public playerChangeSignins;
    public showPlayersTable = false;
    public showMyPlayerTable = false;

    constructor(private http: Http, private router: Router, private appService: AppService) {
        this.appService.getConstants();
        this.appService.getTeams();
        this.appService.getUsers();
        this.appService.getSigninsObservable().subscribe( (response2) => {
            this.appService.data.signins = response2.json().signins;
            this.appService.getPlayersObservable().subscribe( (response) => {
                this.appService.setPlayers(response.json().players);
                this.showMyPlayerTable = true;
                this.playersOfMyTeam = this.appService.getPlayersByTeam(this.appService.data.user.teamID);
                this.getAdditionalPlayerInfo();
                this.usersTable = this.appService.getTableConfig(this.appService.config.tableHeaders.userInfo, this.appService.getActiveUsers());
                this.setOffersOfMyTeam();
            });
        });
    }

    public setSalary(player) {
        this.http.post('./CMDataRequesting.php', {type: 'guaSal', player: player.id, salary: (player.newSalary/10), team: player.teamID}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success) {
                player.salaryMode = false;
                this.showPlayersTable = false;
                this.playersOfMyTeam = this.appService.getPlayersByTeam(this.appService.data.user.teamID);
                this.showPlayersTable = true;
                this.totalSalaries = this.appService.getTotalSalariesByTeam(this.playersOfMyTeam);
                this.totalNextSalaries = this.appService.getTotalEstimatedSalariesByTeam(this.playersOfMyTeam);
            }
        });
    }

    public setEmblem(player) {
        this.http.post('./CMDataRequesting.php', {type: 'hacEmb', player: player, team: this.appService.data.user.teamID}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success) {
                this.showPlayersTable = false;
                this.playersOfMyTeam = this.appService.getPlayersByTeam(this.appService.data.user.teamID);
                this.showPlayersTable = true;
            }
        });
    }

    public setOffersOfMyTeam() {
        if (this.offersTable) { this.offersTable.dataRows = []; }
        this.appService.getPlayerChangeSigninsObservable().subscribe( (response) => {
            this.appService.data.playerChangeSignins = response.json().playerChangeSignins;
            const myOffers = this.appService.data.signins.filter( (filteredSignins) => {
                return filteredSignins.market == this.appService.data.constants.marketEdition &&
                (filteredSignins.signinType == this.appService.config.signinTypes.agreement ||
                filteredSignins.signinType == this.appService.config.signinTypes.loanAgreement) &&
                filteredSignins.accepted == 0 && filteredSignins.oldTeam == this.appService.data.user.teamID;
            })
            .map( (value) => {
                value.playersOffered = [];
                value.playersOffered = this.appService.data.playerChangeSignins.filter( (filteredPCS) => {
                    return filteredPCS.signinID == value.id;
                });
                return value;
            });
            if (myOffers.length != 0) {
                this.offersTable = this.appService.getTableConfig(this.appService.config.tableHeaders.offers, myOffers);
            }
        });
    }

    public resolveOffer(offer, result) {
        if (result) {
            if (confirm('¿Aceptar?')) {
                this.http.post('./CMDataRequesting.php', {type: 'aceOfe', id: offer.id, player: offer.player, newTeam: offer.buyerTeam, oldTeam: offer.oldTeam, amount: offer.amount, signinType: offer.signinType, cedido: this.appService.getPlayerById(offer.player).cedido}).subscribe( (response) => {
                    alert(response.json().message) 
                    if (response.json().success) {
                        offer.playersOffered.forEach( (value) => {
                            this.http.post('./CMDataRequesting.php', {type: 'traJug', player: value.player, oldTeam: value.originTeam, newTeam: value.newTeam, market: this.appService.data.constants.marketEdition, signinType: offer.signinType, cedido: this.appService.getPlayerById(offer.player).cedido}).subscribe( (response) => {
                                alert(response.json().message);
                            });
                        });
                        this.appService.getSigninsObservable().subscribe( (response) => {
                            this.appService.data.signins = response.json().signins;
                            this.showPlayersTable = false;
                            this.setOffersOfMyTeam();
                            this.playersOfMyTeam = this.appService.getPlayersByTeam(this.appService.data.user.teamID);
                            this.showPlayersTable = true;
                        });
                    } else {
                        this.router.navigateByUrl('plantillas');
                    }
                });
            }
        } else {
            if (confirm('¿Rechazar?')) {
                this.http.post('./CMDataRequesting.php', {type: 'recOfe', id: offer.id}).subscribe( (response) => {
                    alert(response.json().message);
                    if (response.json().success) {
                        this.appService.getSigninsObservable().subscribe( (response) => {
                            this.appService.data.signins = response.json().signins;
                            this.setOffersOfMyTeam();
                        });
                    }
                });
            }
        }
    }

    public getAdditionalPlayerInfo() {
        this.playersOfMyTeam.forEach( (value) => {
            value.newSalary = value.salary*10;
            value.salaryMode = false;
        });
        if (!this.totalSalaries) { this.totalSalaries = this.appService.getTotalSalariesByTeam(this.playersOfMyTeam); }
        if (!this.totalNextSalaries) { this.totalNextSalaries = this.appService.getTotalEstimatedSalariesByTeam(this.playersOfMyTeam); }
        this.showPlayersTable = true;
    }

    public changePass() {
        if (this.pass != this.pass2) {
            alert('Las contraseñas no coinciden');
        }else {
            this.http.post('./CMDataRequesting.php', {type: 'updUsu', teamID: this.appService.data.user.teamID, pass: this.pass, email: this.appService.data.user.email, id: this.appService.data.user.id, user: this.appService.data.user.user}).subscribe( (response) => {
                alert('Contraseña cambiada');
              });
        }
    }

    public giveWildCard(player) {
        if (confirm('¿Liberar a ' + this.appService.getPlayerById(player).name + '? Saldrá a subasta las próximas 36 horas')) {
            this.http.post('./CMDataRequesting.php', {type: 'nueSub', player: player, auctionType: this.appService.config.signinTypes.freeAuction, firstTeam: this.appService.getPlayerById(player).teamID, amount: this.appService.getAuctionInitialAmount({overage: parseInt(this.appService.getPlayerById(player).overage), amount: undefined}).amount, market: this.appService.data.constants.marketEdition}).subscribe( (response) => {
                if (response.json().success) {
                    this.showPlayersTable = false;
                    this.playersOfMyTeam = this.appService.getPlayersByTeam(this.appService.data.user.teamID);
                    this.showPlayersTable = true;
                }
                alert(response.json().message);
            });
        }
    }

    public getType(type) {
        switch (type) {
            case this.appService.config.signinTypes.agreement: return 'Compra';
            case this.appService.config.signinTypes.loanAgreement: return 'Cesión';
        }
    }

    public changeHolidaysMode(result) {
        this.http.post('./CMDataRequesting.php', {type: 'setHol', user: this.appService.data.user.id, holidaysMode: result, holidaysMessage: result ? this.holidaysMessage : '' }).subscribe( (response) => {
            if(response.json().success) {
                result ? alert('Modo vacaciones activado') : alert('Modo vacaciones desactivado');
                this.appService.data.user.holidaysMode = result;
            }
        });
    }
}

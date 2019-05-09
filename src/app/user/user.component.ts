import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { RouterLinkWithHref, Router } from '@angular/router';

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
    public teams;
    public players;
    public users;
    public playersOfMyTeam;
    public pass;
    public pass2;
    public constants;
    public totalSalaries;
    public salaryMode = false;
    public signins;
    public playerChangeSignins;

    constructor(private http: Http, private router: Router) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.users = JSON.parse(sessionStorage.getItem('users')).users;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
                this.constants = response.json().constants[0];
                this.getPlayersByTeam(this.user.teamID);
                this.setTableConfig();
                this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'S'}).subscribe( (response) => {
                    this.signins = response.json().signins;
                    this.setOffersOfMyTeam();
                });
        });
    }

    public setSalary(player) {
        this.http.post('./CMDataRequesting.php', {type: 'guaSal', player: player.id, salary: (player.newSalary/10), team: player.teamID}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success) {
                player.salaryMode = false;
                this.getPlayersByTeam(this.user.teamID);
                this.getTotalSalariesByTeam();
            }
        });
    }

    public setEmblem(player) {
        this.http.post('./CMDataRequesting.php', {type: 'hacEmb', player: player, team: this.user.teamID}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success) {
                this.getPlayersByTeam(this.user.teamID);
            }
        });
    }

    public setOffersOfMyTeam() {
        if(this.offersTable) { this.offersTable.dataRows = []; }
        let myOffers = [];
        this.signins.forEach( (value) => {
            if (value.market == this.constants.marketEdition &&
                (value.signinType == 'G' || value.signinType == 'C') && value.accepted == 0 &&
                value.oldTeam == this.user.teamID) {
                value.playersOffered = [];
                this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'PCS'}).subscribe( (response) => {
                    this.playerChangeSignins = response.json().playerChangeSignins;
                    this.playerChangeSignins.forEach( (value2) => {
                        if(value2.signinID == value.id) {
                            value.playersOffered.push(value2);
                        }
                    });
                    myOffers.push(value);
                    if(myOffers.length != 0) {
                        this.setOffersTable(myOffers);
                    }
                });
            }
        });
    }

    public resolveOffer(offer, result) {
        if(result) {
            if(confirm('¿Aceptar?')) {
                this.http.post('./CMDataRequesting.php', {type: 'aceOfe', id: offer.id, player: offer.player, newTeam: offer.buyerTeam, oldTeam: offer.oldTeam, amount: offer.amount, signinType: offer.signinType, cedido: this.getPlayerById(offer.player).cedido}).subscribe( (response) => {
                    alert(response.json().message) 
                    if(response.json().success) {
                        offer.playersOffered.forEach( (value) => {
                            this.http.post('./CMDataRequesting.php', {type: 'traJug', player: value.player, oldTeam: value.originTeam, newTeam: value.newTeam, market: this.constants.marketEdition, signinType: offer.signinType, cedido: this.getPlayerById(offer.player).cedido}).subscribe( (response) => {
                                alert(response.json().message);
                                if(response.json().success) {
                                    this.getPlayersByTeam(this.user.teamID);
                                    this.setOffersOfMyTeam();
                                }
                            });
                        });
                        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'S'}).subscribe( (response) => {
                            this.signins = response.json().signins;
                            this.setOffersOfMyTeam();
                            this.getPlayersByTeam(this.user.teamID);
                        });
                    } else {
                        this.router.navigateByUrl('plantillas');
                    }
                });
            }
        } else {
            if(confirm('¿Rechazar?')) {
                this.http.post('./CMDataRequesting.php', {type: 'recOfe', id: offer.id}).subscribe( (response) => {
                    alert(response.json().message);
                    if(response.json().success) {
                        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'S'}).subscribe( (response) => {
                            this.signins = response.json().signins;
                            this.setOffersOfMyTeam();
                        });
                    }
                });
            }
        }
    }

    public getPlayersByTeam(team): any {
        let playersOfTheTeam = [];
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
            this.players = response.json().players;
            this.players.forEach( (value) => {
                while (value.name.indexOf('/n') != -1) {
                  value.name = value.name.replace('/n', 'ñ');
                }
            });
            this.players.forEach( (value) =>{
                if(value.teamID == team) {
                    // this.salaries.push(value.salary);
                    value.newSalary = value.salary*10;
                    value.salaryMode = false;
                    playersOfTheTeam.push(value);
                }
            });
            this.playersOfMyTeam = playersOfTheTeam;
            if(!this.totalSalaries) {
                this.getTotalSalariesByTeam();
            }
        });
    }

    public getTeamById(team) {
        let teamToReturn = null;
        this.teams.forEach( (value) => {
            if(value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    public getPlayerById(player) {
        let playerToReturn = null;
        this.players.forEach( (value) => {
            if(value.id == player) {
                playerToReturn = value;
            }
        });
        return playerToReturn;
    }

    public changePass() {
        if(this.pass != this.pass2) {
            alert('Las contraseñas no coinciden');
        }else{
            this.http.post('./CMDataRequesting.php', {type: 'updUsu', teamID: this.user.teamID, pass: this.pass, email: this.user.email, id: this.user.id, user: this.user.user}).subscribe( (response) => {
                alert('Contraseña cambiada');
              });
        }
    }
    
    public getTotalSalariesByTeam() {
        let playerToBe = this.playersOfMyTeam;
        let total = 0;
        playerToBe.forEach( (value) => {
            if(value.cedido == 0) {
                total += parseFloat(value.salary);
            }
        });
        this.totalSalaries = Math.round(total * 100) / 100;
    }

    private giveActiveUsers() {
        let finalUsers = [];
        this.users.forEach( (value) => {
            if(value.teamID != 0 && value.teamID != -1 && finalUsers.length < 16) {
                finalUsers.push(value);
            }
        });
        return finalUsers;
    }

    public giveWildCard(player) {
        if(confirm('¿Liberar a ' + this.getPlayerById(player).name + '?')) {
            this.http.post('./CMDataRequesting.php', {type: 'disPla', player: player, market: this.constants.marketEdition}).subscribe( (response) => {
                if(response.json().success) {
                    this.playersOfMyTeam = this.getPlayersByTeam(this.user.teamID);
                }
                alert(response.json().message);
            });
        }
    }
    
    public getType(type) {
        switch(type) {
            case 'G': return 'Compra';
            case 'C': return 'Cesión';
        }
    }

    private setTableConfig() {
        this.usersTable = {
            headerRow: [ 'name', 'team', 'nation', 'psnID', 'twitch'],
            dataRows: this.giveActiveUsers()
        };
    }

    private setOffersTable(data) {
        this.offersTable = {
            headerRow: [ 'type', 'player', 'team', 'amount', 'players', 'actions'],
            dataRows: data
        };
    }
}

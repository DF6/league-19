import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

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
    public user;
    public teams;
    public players;
    public users;
    public playersOfMyTeam;
    public pass;
    public pass2;

    constructor(private http: Http) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.users = JSON.parse(sessionStorage.getItem('users')).users;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.players = JSON.parse(sessionStorage.getItem('players')).players;
        this.playersOfMyTeam = this.getPlayersByTeam(this.user.teamID);
        this.setTableConfig();
    }

    public getPlayersByTeam(team) {
        let playersOfTheTeam = [];
        this.players.forEach( (value, key) =>{
            if(value.teamID == team) {
                playersOfTheTeam.push(value);
            }
        });
        return playersOfTheTeam;
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

    public changePass() {
        if(this.pass != this.pass2) {
            alert('Las contraseñas no coinciden');
        }else{
            this.http.post('./CMDataRequesting.php', {type: 'updUsu', teamID: this.user.teamID, pass: this.pass, email: this.user.email, id: this.user.id, user: this.user.user}).subscribe( (response) => {
                alert('Contraseña cambiada');
              });
        }
    }
    
    public getTotalSalariesByTeam(team) {
        let playerToBe = this.getPlayersByTeam(team);
        let total = 0;
        playerToBe.forEach( (value) => {
            total += parseFloat(value.salary);
        });
        return total;
    }

    private giveActiveUsers() {
        let finalUsers = [];
        this.users.forEach( (value) => {
            if(value.user != 'admin' && value.user != 'prueba') {
                finalUsers.push(value);
            }
        });
        return finalUsers;
    }

    private setTableConfig() {
        this.usersTable = {
            headerRow: [ 'name', 'team', 'nation', 'psnID', 'twitch'],
            dataRows: this.giveActiveUsers()
        };
    }
}

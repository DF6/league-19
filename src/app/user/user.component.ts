import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html'
})

export class UserComponent{

    public user;
    public teams;
    public players;
    public playersOfMyTeam;
    public pass;
    public pass2;

    constructor(private http: Http) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.players = JSON.parse(sessionStorage.getItem('players')).players;
        this.playersOfMyTeam = this.getPlayersByTeam(this.user.teamID);
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
}

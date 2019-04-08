import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

@Component({
    selector: 'icons-cmp',
    moduleId: module.id,
    templateUrl: 'icons.component.html'
})

export class IconsComponent{

    public teams;
    public players;
    public filters;
    public constants;
    public user;

    constructor(private http: Http, private router: Router) {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.constants = response.json().constants[0];
            this.user = JSON.parse(sessionStorage.getItem('user'));
            this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
                this.players = response.json().players;
                this.players.forEach( (value) => {
                    while (value.name.indexOf('/n') != -1) {
                    value.name = value.name.replace('/n', 'ñ');
                    }
                });
                sessionStorage.setItem('players', JSON.stringify({players: this.players}));
                this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
                this.filters = {
                    name: '',
                    position: '',
                    overageMin: 0,
                    overageMax: 99,
                    loan: false,
                    emblem: false
                };
            });
        });
    }

    public forceSignin(player) {
        this.http.post('./CMDataRequesting.php', {type: 'claJug', player: player.id, oldTeam: player.teamID, buyerTeam: this.user.teamID, amount: (player.salary*10), market: this.constants.marketEdition}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success) {
                this.router.navigateByUrl('usuario');
            }
        });
    }

    public isThereAnyPlayer(team) {
        let isThere = false;
        this.players.forEach( (value, key) =>{
            if(value.teamID == team && !isThere) {
                isThere = true;
            }
        });
        return isThere;
    }

    public getPlayersByTeam(team) {
        let playersOfTheTeam = [];
        this.players.forEach( (value, key) =>{
            if(value.teamID == team) {
                value.salary = parseInt(value.salary);
                playersOfTheTeam.push(value);
            }
        });
        return playersOfTheTeam;
    }

}

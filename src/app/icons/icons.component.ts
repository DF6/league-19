import { Component } from '@angular/core';

@Component({
    selector: 'icons-cmp',
    moduleId: module.id,
    templateUrl: 'icons.component.html'
})

export class IconsComponent{

    public teams;
    public players;

    constructor() {
        this.teams = JSON.parse(sessionStorage.getItem('teams'));
        this.players = JSON.parse(sessionStorage.getItem('players'));
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
            if(value.teamID == team && !playersOfTheTeam) {
                playersOfTheTeam.push(value);
            }
        });
        return playersOfTheTeam;
    }

}

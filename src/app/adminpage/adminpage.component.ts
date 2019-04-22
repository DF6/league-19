import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

export interface OfferData {
    player: any;
    oldTeam: any;
    buyerTeam: any;
    amount: any;
    signinType: any;
    players: PlayerOfferedData[];
}

export interface PlayerOfferedData {
    player: any;
    originTeam: any;
    newTeam: any;
}

@Component({
    selector: 'adminpage',
    moduleId: module.id,
    templateUrl: 'adminpage.component.html'
})

export class AdminPageComponent implements OnInit{

    public offer: OfferData;
    public teams;
    public players;
    public tournaments;
    public matchToAdd;
    public prizes;

    constructor(private http: Http){
    }

    ngOnInit() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
            this.players = response.json().players;
            this.players.forEach( (value) => {
                while (value.name.indexOf('/n') != -1) {
                value.name = value.name.replace('/n', 'ñ');
                }
            });
            this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
            this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
            this.matchToAdd = {
                local: -1,
                away: -1,
                tournament: -1,
                round: -1
            };
            this.prizes = {
                first: -1,
                second: -1,
                third: -1,
                fourth: -1,
                fifth: -1,
                sixth: -1,
                seventh: -1,
                eight: -1
            };
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
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

export interface OfferData {
    player: any;
    oldTeam: any;
    buyerTeam: any;
    amount: any;
    players: PlayerOfferedData[];
}

export interface PlayerOfferedData {
    player: any;
    originTeam: any;
    newTeam: any;
}

@Component({
    selector: 'offer-filler',
    moduleId: module.id,
    templateUrl: 'offer-filler.component.html'
})

export class OfferFillerComponent implements OnInit{

    @Input() player: any;
    @Output() offered = new EventEmitter<boolean>();
    public offer: OfferData;
    public teams;
    public players;
    public playerSelected;
    public amount;

    constructor(private http: Http){
    }

    ngOnInit() {
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
            this.players = response.json().players;
            this.players.forEach( (value) => {
                while (value.name.indexOf('/n') != -1) {
                  value.name = value.name.replace('/n', 'ñ');
                }
            });
        });
    }

    public sendMatchInfo() {
        this.http.post('./CMDataRequesting.php', {type: 'setRes', localGoals: this.local.score, awayGoals: this.away.score, matchID: this.data.id}).subscribe( () => {
            // this.http.post('./CMDataRequesting.php', {type: 'updSta', points: local.points, won: local.won, draw: local.draw, lost: local.lost, goalsFor: this.local.score, goalsAgainst: this.away.score, tournamentID: this.data.tournament, team: this.data.local}).subscribe( () => {});
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

    public getPlayersByTeam(team) {
        let playersToReturn = [];
        this.players.forEach( (value) => {
            if (value.teamID == team) {
                playersToReturn.push(value);
            }
        });
        return playersToReturn;
    }
}

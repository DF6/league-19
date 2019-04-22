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
    public constants;
    public matchToAdd;
    public prizes;

    constructor(private http: Http){
    }

    ngOnInit() {
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
    }

    public sendOffer() {
        this.http.post('./CMDataRequesting.php', {type: 'hacOfe', signinType: this.signType, player: this.offer.player, oldTeam: this.offer.oldTeam, newTeam: this.offer.buyerTeam, amount: this.offer.amount, market: this.constants.marketEdition}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success && this.offer.players.length > 0) {
                this.offer.players.forEach( (value) => {
                    this.http.post('./CMDataRequesting.php', {type: 'ofeJug', player: value.player, offerTeam: value.newTeam, originTeam: value.originTeam, signin: response.json().id}).subscribe( (response) => {
                        alert(response.json().message);
                    });
                });
            }
        });
    }

    public addPCS() {
        this.offer.players.push({
            player: this.pcsToAdd,
            originTeam: this.offer.buyerTeam,
            newTeam: this.offer.oldTeam
        });
    }

    public removePCS(position) {
        this.offer.players.splice(position, 1);
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
            if (value.teamID == team && value.cedido == 0) {
                playersToReturn.push(value);
            }
        });
        this.playersOfMyTeam = playersToReturn;
    }
}

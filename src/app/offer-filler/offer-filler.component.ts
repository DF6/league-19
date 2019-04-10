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
    public user;
    public constants;

    constructor(private http: Http){
    }

    ngOnInit() {
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.constants = response.json().constants[0];
            this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
                this.players = response.json().players;
                this.players.forEach( (value) => {
                    while (value.name.indexOf('/n') != -1) {
                    value.name = value.name.replace('/n', 'ñ');
                    }
                });
            });
        });
    }

    public sendOffer() {
        this.http.post('./CMDataRequesting.php', {type: 'hacOfe', player: this.player.id, oldTeam: this.player.teamID, newTeam: this.user.teamID, amount: this.amount, market: this.constants.marketEdition}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success && this.offer.players.length > 0) {
                this.offer.players.forEach( (value) => {
                    // Llamada múltiple
                });
            }
            this.offered.emit(response.json().success);
        });
    }

    // Métodos para manejar el formulario

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

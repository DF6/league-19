import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppService } from 'app/app.service';

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
    selector: 'offer-filler',
    moduleId: module.id,
    templateUrl: 'offer-filler.component.html'
})

export class OfferFillerComponent implements OnInit{

    @Input() player: any;
    @Output() offered = new EventEmitter<boolean>();
    public offer: OfferData;
    public playersOfMyTeam;
    public pcsToAdd;
    public signType;

    constructor(private http: Http, private appService: AppService){
        this.appService.getTeams();
        this.appService.getConstants();
    }

    ngOnInit() {
        this.appService.getPlayersObservable().subscribe( (response) => {
            this.appService.data.players = response.json().players;
            this.appService.data.players.forEach( (value) => {
                value.name = this.appService.convertNToÑ(value.name);
            });
            this.offer = {
                player: this.player.id,
                oldTeam: this.player.teamID,
                buyerTeam: this.appService.data.user.teamID,
                signinType: this.appService.config.signinTypes.agreement,
                amount: 1,
                players: []
            };
            this.getPlayersByTeam(this.appService.data.user.teamID);
        });
    }

    public sendOffer() {
        if(!this.signType) { this.signType = this.offer.signinType; }
        this.http.post('./test_CMDataRequesting.php', {type: 'hacOfe', signinType: this.signType, player: this.offer.player, oldTeam: this.offer.oldTeam, newTeam: this.offer.buyerTeam, amount: this.offer.amount, market: this.appService.data.constants.marketEdition}).subscribe( (response) => {
            this.appService.insertLog({logType: this.appService.config.logTypes.offerSent, logInfo: 'Oferta realizada: ' + this.player.name + ' por ' + this.offer.amount + 'M€'});
            alert(response.json().message);
            if(response.json().success && this.offer.players.length > 0) {
                this.offer.players.forEach( (value) => {
                    this.http.post('./test_CMDataRequesting.php', {type: 'ofeJug', player: value.player, offerTeam: value.newTeam, originTeam: value.originTeam, signin: response.json().id}).subscribe( (response) => {
                        this.appService.insertLog({logType: this.appService.config.logTypes.pcsAdded, logInfo: 'Jugador a intercambiar: ' + this.appService.getPlayerById(value.player).name});
                        alert(response.json().message);
                    });
                });
            }
            this.offered.emit(response.json().success);
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

    public getPlayersByTeam(team) {
        this.playersOfMyTeam = this.appService.getPlayersByTeam(team).filter( (value) => {
            return value.cedido == 0 && value.buyedThisMarket == 0;
        });
    }
}

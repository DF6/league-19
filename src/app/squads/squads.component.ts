import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';

@Component({
    selector: 'squads-cmp',
    moduleId: module.id,
    templateUrl: 'squads.component.html'
})

export class SquadsComponent{

    public filters;

    constructor(private http: Http, private router: Router, private appService: AppService) {
        this.appService.getConstants();
        this.appService.getTeams();
        this.appService.getPlayersObservable().subscribe( (response) => {
            this.appService.data.players = response.json().players.map( (player) => {
                player.filling = false;
                return player;
            });
            this.filters = {
                name: '',
                position: '',
                overageMin: 0,
                overageMax: 99,
                loan: false,
                emblem: false
            };
        });
    }

    public setOfferToRedirect(player) {
        sessionStorage.setItem('playerToOffer', JSON.stringify(player));
        this.router.navigateByUrl('offer');
    }
    
    public forceSignin(player) {
        this.http.post('./test_CMDataRequesting.php', {type: 'claJug', player: player.id, oldTeam: player.teamID, buyerTeam: this.appService.data.user.teamID, amount: parseInt(player.overage), market: this.appService.data.constants.marketEdition}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success) {
                this.router.navigateByUrl('usuario');
            }
        });
    }

    public isThereAnyPlayer(team) {
        return this.appService.data.players.some( (player) => { return player.teamID == team;});
    }

}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'offer-cmp',
    moduleId: module.id,
    templateUrl: 'offer.component.html'
})

export class OfferComponent{

    public player;

    constructor(private router: Router) {
        this.player = JSON.parse(sessionStorage.getItem('playerToOffer'));
        sessionStorage.removeItem('playerToOffer');
    }

    public setOffer(ev) {
        if(ev) {
            this.router.navigateByUrl('plantillas');
        }
    }
}

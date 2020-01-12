import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from 'app/app.service';

@Component({
    selector: 'rules-cmp',
    moduleId: module.id,
    templateUrl: 'rules.component.html'
})

export class RulesComponent{

    public showCard;
    public suggestion;

    constructor(private appService: AppService) {
        this.resetView();
    }

    public resetView() {
        this.showCard = {
            matchRules: false,
            playerRules: false,
            marketRules: false,
            penaltyRules: false,
            prizes: false,
            polls: false
        }
    }

    public sendSuggestion() {
        this.appService.sendSuggestion(this.appService.removeAccents(this.suggestion));
        alert('Sugerencia enviada');
    }
}

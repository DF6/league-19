import { Component } from '@angular/core';

@Component({
    selector: 'rules-cmp',
    moduleId: module.id,
    templateUrl: 'rules.component.html'
})

export class RulesComponent{

    public showCard;

    constructor() {
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
}

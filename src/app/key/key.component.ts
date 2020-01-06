import { Component, Input } from '@angular/core';
import { AppService, KeyConfig } from 'app/app.service';

@Component({
    selector: 'tournament-key',
    moduleId: module.id,
    templateUrl: 'key.component.html'
})

export class KeyComponent {

    @Input() keyConfig: KeyConfig | null;
    @Input() shownRound: Boolean;
    public showElement = false;

    constructor(private appService: AppService) {
        this.appService.getTeams();
        this.appService.getMatchesObservable().subscribe( (response) => {
            this.appService.data.matches = response.json().matches;
            if (this.keyConfig) { this.showElement = true; }
        });
    }
}

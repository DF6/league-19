import { Component, Input } from '@angular/core';
import { AppService, KeyConfig } from 'app/app.service';

@Component({
    selector: 'roundkeys',
    moduleId: module.id,
    templateUrl: 'roundkeys.component.html'
})

export class RoundkeysComponent {

    @Input() config: KeyConfig | null;
    public showElement = false;

    constructor(private appService: AppService) {
        this.appService.getTeams();
        this.appService.getMatchesObservable().subscribe( (response) => {
            this.appService.setMatches = response.json().matches;
            if (this.config) { this.showElement = true; }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';

declare var $:any;

@Component({
    selector: 'europesupercup-cmp',
    moduleId: module.id,
    templateUrl: 'europesupercup.component.html'
})

export class EuropeSupercupComponent implements OnInit{

    public matchesConfig;
    public season;
    public champion;

    constructor(private appService: AppService) {
        this.appService.getTournaments();
        this.appService.getTeams();
    }

    ngOnInit() {
        this.getMatches();
    }

    private getMatches() {
        let finalTableMatches = [];
        this.appService.getMatchesObservable().subscribe( (response) => {
            let matchesArray = response.json().matches;
            const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.europeSupercup.name);
            this.season = tournament.edition;
            matchesArray.forEach( (value) => {
                if (value.tournament == tournament.id) {
                    value.filling = false;
                    if(this.appService.whoWon(value)) {
                        this.champion = this.appService.whoWon(value);
                    }
                    finalTableMatches.push(this.appService.getMatchConfiguration(value, this.appService.getClassNames(this.appService.config.classNameSizes.all), true));
                }
            });
            this.matchesConfig = finalTableMatches;
        });
    }
}

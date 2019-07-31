import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';

declare var $: any;

@Component({
    selector: 'intertoto-cmp',
    moduleId: module.id,
    templateUrl: 'intertoto.component.html'
})

export class IntertotoComponent implements OnInit {

    public matches;
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
            const matchesArray = response.json().matches;
            const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.intertoto.name);
            this.season = tournament.edition;
            matchesArray.forEach( (value) => {
                if (value.tournament == tournament.id) {
                    value.filling = false;
                    if (value.round == this.appService.config.tournamentGeneralInfo.intertoto.finalRound &&
                        this.appService.whoWon(value)) {
                        this.champion = this.appService.whoWon(value);
                    }
                    finalTableMatches.push(this.appService.getMatchConfiguration(value, this.appService.getClassNames(this.appService.config.classNameSizes.large), true));
                }
            });
            this.matches = this.appService.divideByRounds(finalTableMatches, this.appService.config.tournamentGeneralInfo.intertoto.finalRound, 2);
        });
    }
}

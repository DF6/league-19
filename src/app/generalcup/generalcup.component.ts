import { Component } from '@angular/core';
import { AppService } from 'app/app.service';

declare var $:any;

@Component({
    selector: 'generalcup-cmp',
    moduleId: module.id,
    templateUrl: 'generalcup.component.html'
})

export class GeneralCupComponent{

    public matches;
    public season;
    public champion;

    constructor(private appService: AppService) {
        this.appService.getTournaments();
        this.appService.getTeams();
        this.appService.getMatchesObservable().subscribe( (response) => {
            if(response.json().success) {
                this.appService.data.matches = response.json().matches;
                this.getMatches();
            }
        });
    }

    private getMatches() {
        let finalMatches = [];
        const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.copa.name);
        this.season = tournament.edition;
        const allMatches = this.appService.data.matches.filter( (filteredMatch) => {
            return filteredMatch.tournament == tournament.id;
        });
        for(let i = 1; i <= this.appService.config.tournamentGeneralInfo.copa.finalRound; i++) {
            const filteredRound = allMatches.filter( (filteredMatch) => {
                return filteredMatch.round == i;
            })
            .map( (match, key) => {
                return this.appService.getMatchConfiguration(match, this.appService.getClassNames(this.appService.config.classNameSizes.small), key == 0 ? true : false);
            });
            if(filteredRound.length > 0) { finalMatches.push(filteredRound); }
        }
        this.matches = finalMatches;
        this.champion = this.appService.whoWon(this.appService.data.matches.filter( (filteredMatch) => {
            return filteredMatch.tournament == tournament.id && filteredMatch.round == this.appService.config.tournamentGeneralInfo.copa.finalRound;
        })[0]);
    }
}

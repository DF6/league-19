  
import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';

declare var $:any;

@Component({
    selector: 'copamugre-cmp',
    moduleId: module.id,
    templateUrl: 'copamugre.component.html'
})

export class CopaMugreComponent implements OnInit{

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
        this.appService.getMatchesObservable().subscribe( (response) => {
            let finalTableMatches = [];
            this.appService.data.matches = response.json().matches;
            const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.copaMugre.name);
            this.season = tournament.edition;
            const allMatches = this.appService.data.matches.filter( (filteredMatch) => {
                return filteredMatch.tournament == tournament.id;
            });
            for(let i = 1; i <= this.appService.config.tournamentGeneralInfo.copaMugre.finalRound; i++) {
                const filteredRound = allMatches.filter( (filteredMatch) => {
                    return filteredMatch.round == i;
                })
                .map( (match, key) => {
                    return this.appService.getMatchConfiguration(match, this.appService.getClassNames(this.appService.config.classNameSizes.large), key == 0 ? true : false);
                });
                if(filteredRound.length > 0) { finalTableMatches.push(filteredRound); }
            }
            this.matches = finalTableMatches;
            this.champion = this.appService.whoWon(this.appService.data.matches.filter( (filteredMatch) => {
                return filteredMatch.tournament == tournament.id && filteredMatch.round == this.appService.config.tournamentGeneralInfo.copaMugre.finalRound;
            })[0]);
        });
    }
}
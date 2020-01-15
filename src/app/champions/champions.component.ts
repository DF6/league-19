import { Component, OnInit } from '@angular/core';
import { Http} from '@angular/http';
import { AppService } from 'app/app.service';

declare var $: any;

@Component({
    selector: 'champions-cmp',
    moduleId: module.id,
    templateUrl: 'champions.component.html'
})

export class ChampionsComponent implements OnInit {
    public standingsArray;
    public season;
    public uclMatches;
    public champion;
    public visibleLegend = false;

    constructor(private appService: AppService) {
        this.appService.getTournaments();
        this.appService.getTeams();
    }

    ngOnInit() {
        this.appService.getStandingsObservable().subscribe( (response2) => {
            this.appService.data.standings = response2.json().standings;
            this.appService.getMatchesObservable().subscribe( (response) => {
                this.appService.data.matches = response.json() ? response.json().matches : null;
                let finalMatches = [];
                const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.copa.name);
                this.season = tournament.edition;
                const allMatches = this.appService.data.matches.filter( (filteredMatch) => {
                    return filteredMatch.tournament == tournament.id;
                });
                for(let i = 1; i <= this.appService.config.tournamentGeneralInfo.championsLeague.finalRound; i+=2) {
                    const filteredRound = allMatches.filter( (filteredMatch) => {
                        return filteredMatch.round == i || filteredMatch.round == i+1;
                    })
                    .map( (match, key) => {
                        if (parseInt(match.round) < this.appService.config.tournamentGeneralInfo.championsLeague.KORound - 1) {
                            return this.appService.getMatchConfiguration(this.appService.getAnotherMatchOfRound([match], filteredRound), this.appService.getClassNames(this.appService.config.classNameSizes.medium), key == 0 ? true : false, this.appService.getMatchConfiguration(match, this.appService.getClassNames(this.appService.config.classNameSizes.medium), key == 0 ? true : false));
                        } else {
                            return this.appService.getMatchConfiguration(match, this.appService.getClassNames(this.appService.config.classNameSizes.medium), key == 0 ? true : false);
                        }
                    });
                    if(filteredRound != null && filteredRound.length > 0) { finalMatches.push(filteredRound); }
                }
                this.uclMatches = finalMatches;
                this.champion = this.appService.whoWon(this.appService.data.matches.filter( (filteredMatch) => {
                    return filteredMatch.tournament == tournament.id && filteredMatch.round == this.appService.config.tournamentGeneralInfo.championsLeague.finalRound;
                })[0]);
            });
        });
    }
}

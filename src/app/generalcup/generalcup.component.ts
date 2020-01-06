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
            }else{
                alert('Error fatal, recarga la página');
            }
        });
    }

    private getMatches() {
        let finalMatches = [];
        const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.generalCup.name);
        this.season = tournament.edition;
        const allMatches = this.appService.data.matches.filter( (filteredMatch) => {
            return filteredMatch.tournament == tournament.id;
        });
        for(let i = 1; i <= this.appService.config.tournamentGeneralInfo.generalCup.finalRound; i++) {
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
            return filteredMatch.tournament == tournament.id && filteredMatch.round == this.appService.config.tournamentGeneralInfo.generalCup.finalRound;
        })[0]);
    }

    showNotification(from, align){
        var type = ['','info','success','warning','danger'];

        var color = Math.floor((Math.random() * 4) + 1);

    	$.notify({
        	icon: "ti-gift",
        	message: "Welcome to <b>Paper Dashboard</b> - a beautiful freebie for every web developer."
        },{
            type: type[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    }
}

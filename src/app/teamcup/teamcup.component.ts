  
import { Component, OnInit } from '@angular/core';
import { AppService, TableData } from 'app/app.service';

declare var $:any;

@Component({
    selector: 'teamcup-cmp',
    moduleId: module.id,
    templateUrl: 'teamcup.component.html'
})

export class TeamCupComponent implements OnInit{

    public matches;
    public season;
    public champion;
    public myClub;
    public myClubMatchesTable: TableData;

    constructor(private appService: AppService) {
        this.appService.getTournaments();
        this.appService.getTeams();
        this.appService.getTeamCupTeams();
    }

    ngOnInit() {
        this.getMatches();
    }

    private getMatches() {
        this.appService.getMatchesObservable().subscribe( (response) => {
            let finalTableMatches = [];
            this.appService.data.matches = response.json().matches;
            const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.teamCup.name);
            this.season = tournament.edition;
            const allMatches = this.appService.data.matches.filter( (filteredMatch) => {
                return filteredMatch.tournament == tournament.id;
            });
            this.myClub = this.appService.getClubByTeam(this.appService.getTeamById(this.appService.data.user.teamID));
            const myClubMatches = allMatches.filter( (filteredMatch) => {
                return this.myClub.find( (myClubTeam) => { return myClubTeam.team == filteredMatch.local || myClubTeam.team == filteredMatch.away; }) != undefined;
            });
            this.myClubMatchesTable = this.appService.getTableConfig(this.appService.config.tableHeaders.myClubMatches, myClubMatches);
            /*for(let i = 1; i <= this.appService.config.tournamentGeneralInfo.teamCup.finalRound; i++) {
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
            })[0]);*/
        });
    }
}
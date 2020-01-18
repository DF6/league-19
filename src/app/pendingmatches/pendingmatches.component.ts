import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'pendingmatches-cmp',
    moduleId: module.id,
    templateUrl: 'pendingmatches.component.html'
})

export class PendingMatchesComponent implements OnInit{

    public pendingMatchesTable: TableData;

    constructor(private appService: AppService) {
        this.appService.getTournaments();
        this.appService.getTeams();
        this.appService.getConstants();
    }

    ngOnInit() {
        this.refreshMatches();
    }

    public refreshMatches() {
        this.appService.getMatchesObservable().subscribe( (response) => {
            this.appService.data.matches = response.json().matches;
            this.setUndisputedMatches(this.appService.getMatchesByTeam(this.appService.data.user.teamID));
        });
    }

    private isCalendarMatch(match) {
        switch(this.appService.getTournamentById(match.tournament).name) {
            case this.appService.config.tournamentGeneralInfo.copa.name: return parseInt(match.round) <= this.appService.config.validRounds.copa;
            case this.appService.config.tournamentGeneralInfo.primera.name:return parseInt(match.round) <= this.appService.config.validRounds.primera;
            case this.appService.config.tournamentGeneralInfo.segunda.name: return parseInt(match.round) <= this.appService.config.validRounds.segunda;
            case this.appService.config.tournamentGeneralInfo.supercopaDeClubes.name: return parseInt(match.round) <= this.appService.config.validRounds.supercopaDeClubes;
            case this.appService.config.tournamentGeneralInfo.supercopaEuropea.name: return parseInt(match.round) <= this.appService.config.validRounds.supercopaEuropea;
        }
    }

    private setUndisputedMatches(teamMatches) {
        let finalTableMatches = teamMatches.filter( (filteredMatch) => {
            return filteredMatch.localGoals == '-1' && filteredMatch.awayGoals == '-1' && this.isCalendarMatch(filteredMatch);
        })
        .map( (value) => {
            value.filling = false;
            return value;
        });
        this.pendingMatchesTable = this.appService.getTableConfig(this.appService.config.tableHeaders.pendingMatches, finalTableMatches);
    }
}

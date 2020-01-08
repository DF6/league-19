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

    private setUndisputedMatches(teamMatches) {
        let finalTableMatches = teamMatches.filter( (filteredMatch) => {
            return filteredMatch.localGoals == '-1' && filteredMatch.awayGoals == '-1';
        })
        .map( (value) => {
            value.filling = false;
            return value;
        });
        /*for (let i = 0; i < finalTableMatches.length; i++) {
            if ((this.appService.getTournamentById(finalTableMatches[i].tournament).name == this.appService.config.tournamentGeneralInfo.primera.name ||
               this.appService.getTournamentById(finalTableMatches[i].tournament).name == this.appService.config.tournamentGeneralInfo.segunda.name) && finalTableMatches[i].round > parseInt(this.appService.data.constants.intervalActual)) {
                 finalTableMatches.splice(i, 1);
                 i--;
            }
        }*/
        this.pendingMatchesTable = this.appService.getTableConfig(this.appService.config.tableHeaders.pendingMatches, finalTableMatches);
    }
}

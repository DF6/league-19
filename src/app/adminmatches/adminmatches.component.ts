import { Component } from '@angular/core';
import { AppService, TableData } from 'app/app.service';

@Component({
    selector: 'adminmatches-cmp',
    moduleId: module.id,
    templateUrl: 'adminmatches.component.html'
})

export class AdminMatchesComponent{

    public tableData1: TableData;
    public tournaments;
    public teams;
    public matches = [];

    constructor(private appService: AppService) {
        this.tableData1 = this.appService.getTableConfig(this.appService.config.tableHeaders.adminmatches);
        this.appService.getConstants();
        this.appService.getTournaments();
        this.appService.getTeams();
        this.appService.getMatchesObservable().subscribe( (response) => {
            this.appService.setMatches(response.json().matches);
            this.setUndisputedMatches();
        });
    }

    private setUndisputedMatches() {
        let finalTableMatches = [];
        this.appService.data.matches.forEach( (value) => {
            if (value.localGoals == "-1" && value.awayGoals == "-1") {
                value.filling = false;
                finalTableMatches.push(value);
            }
        });
        for (let i = 0; i < finalTableMatches.length; i++) {
            if (!this.appService.isThisInterval(finalTableMatches[i].tournament, finalTableMatches[i].round)) {
                 finalTableMatches.splice(i, 1);
                 i--;
            }
        }
        this.tableData1.dataRows = finalTableMatches;
    }
}

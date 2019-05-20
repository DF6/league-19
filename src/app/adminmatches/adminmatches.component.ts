import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

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

    constructor(private http: Http, private appService: AppService) {
        this.appService.setUser(JSON.parse(sessionStorage.getItem('user')));
        const tableFields = [ 'tournament', 'round', 'local', '', 'away' ];
        this.tableData1 = this.appService.getTableConfig(tableFields);
        this.appService.getMatches().subscribe( (response) => {
            this.matches = response;
            this.setUndisputedMatches();
        });
    }

    private setUndisputedMatches() {
        let finalTableMatches = [];
        this.matches.forEach( (value) => {
            if (value.localGoals == "-1" && value.awayGoals == "-1") {
                value.filling = false;
                finalTableMatches.push(value);
            }
        });
        for (let i = 0; i < finalTableMatches.length; i++) {
            if (this.appService.isThisInterval(finalTableMatches[i].tournament, finalTableMatches[i].round)) {
                 finalTableMatches.splice(i, 1);
                 i--;
            }
        }
        this.matches = finalTableMatches;
        this.tableData1.dataRows = this.matches;
    }
}

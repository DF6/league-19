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
            this.pendingMatchesTable = this.appService.getTableConfig(this.appService.config.tableHeaders.pendingMatches, 
                this.appService.getUndisputedMatches(this.appService.getMatchesByTeam(this.appService.data.user.teamID)));
        });
    }
}

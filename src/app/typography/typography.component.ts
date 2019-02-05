import { Component } from '@angular/core';
import { Http } from '@angular/http';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'typography-cmp',
    moduleId: module.id,
    templateUrl: 'typography.component.html'
})

export class TypographyComponent{

    public tableData1: TableData;
    public user;
    public tournaments;
    public matches = [];

    constructor(private http: Http) {
        /*this.user = JSON.parse(sessionStorage.getItem('user'));
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments'));
        this.setTableConfig();
        this.getMatchesByTeam(this.user.teamID);
        this.setUndisputedMatches();*/
    }

    private getMatchesByTeam(team) {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            let matchesArray = response.json().matches;
            matchesArray.forEach( (value, key) => {
                if (value.local == team || value.away == team) {
                    this.matches.push(value);
                }
            });
        });
    }

    private setUndisputedMatches() {
        this.matches.forEach( (value, key) => {
            if (!value.localGoals.isNumber() && !value.awayGoals.isNumber()) {
                this.matches.splice(key, 1);
            }
        });
        this.tableData1.dataRows = this.matches;
    }

    private setTableConfig() {
        this.tableData1 = {
            headerRow: [ 'tournament', 'round', 'local', '', 'away', 'fill'],
            dataRows: []
        };
    }

    public getTournamentById(id) {
        let tournament = {};
        this.tournaments.forEach( (value, key) => {
            if (value.id == id) {
                tournament = value;
            }
        });
        return tournament;
    }
}

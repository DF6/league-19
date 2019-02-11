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
    public teams;
    public matches = [];

    constructor(private http: Http) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.setTableConfig();
        this.getMatchesByTeam(this.user.teamID);
    }

    private getMatchesByTeam(team) {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            let matchesArray = response.json().matches;
            matchesArray.forEach( (value, key) => {
                if (value.local == team || value.away == team) {
                    this.matches.push(value);
                }
            });
            this.setUndisputedMatches();
        });
    }

    private setUndisputedMatches() {
        let finalTableMatches = []
        this.matches.forEach( (value, key) => {
            if (value.localGoals == "-1" && value.awayGoals == "-1") {
                finalTableMatches.push(value);
            }
        });
        this.matches = finalTableMatches;
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
        id = parseInt(id);
        this.tournaments.forEach( (value) => {
            if (value.id == id) {
                tournament = value;
            }
        });
        return tournament;
    }

    public getTeamById(team) {
        let teamToReturn = null;
        this.teams.forEach( (value) => {
            if(value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }
}

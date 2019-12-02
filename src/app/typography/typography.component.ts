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
    public constants;
    public matches = [];

    constructor(private http: Http) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.constants = response.json().constants[0];
            this.setTableConfig();
            this.getMatchesByTeam(this.user.teamID);
        });
    }

    private getMatchesByTeam(team) {
        this.matches = [];
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
        let finalTableMatches = [];
        this.matches.forEach( (value, key) => {
            if (value.localGoals == "-1" && value.awayGoals == "-1") {
                value.filling = false;
                finalTableMatches.push(value);
            }
        });
        for (let i = 0; i < finalTableMatches.length; i++) {
            if ((this.getTournamentById(finalTableMatches[i].tournament).name == 'Primera' ||
               this.getTournamentById(finalTableMatches[i].tournament).name == 'Segunda') && finalTableMatches[i].round > parseInt(this.constants.intervalActual)) {
                 finalTableMatches.splice(i, 1);
                 i--;
            }
        }
        this.matches = finalTableMatches;
        this.tableData1.dataRows = this.matches;
    }

    private setTableConfig() {
        this.tableData1 = {
            headerRow: [ 'tournament', 'round', 'local', '', 'away', 'fill'],
            dataRows: []
        };
    }

    public getTournamentById(id):any {
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
            if (value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    public getRoundName(match) {
        switch (this.getTournamentById(match.tournament).name) {
            case 'Copa':
                if (match.round < 3) { return 'Octavos de Final'; }
                else if (match.round >= 3 && match.round < 5) { return 'Cuartos de Final'; }
                else if (match.round >= 5 && match.round < 7) { return 'Semifinales'; }
                else if (match.round == 8) { return 'Tercer y Cuarto Puesto'; }
                else if (match.round == 7) { return 'Final'; }
                break;
            case 'Champions League':
                if (match.round < 7) { return 'Fase de Grupos'; }
                else if (match.round >= 7 && match.round < 9) { return 'Cuartos de Final'; }
                else if (match.round >= 9 && match.round < 11) { return 'Semifinales'; }
                else if (match.round == 12) { return 'Tercer y Cuarto Puesto'; }
                else if (match.round == 11) { return 'Final'; }
                break;
            case 'Europa League':
                if (match.round < 3) { return 'Cuartos de Final'; }
                else if (match.round >= 3 && match.round < 5) { return 'Semifinales'; }
                else if (match.round == 6) { return 'Tercer y Cuarto Puesto'; }
                else if (match.round == 5) { return 'Final'; }
                break;
            case 'Intertoto':
                if (match.round < 3) { return 'Semifinales'; }
                else if (match.round == 4) { return 'Tercer y Cuarto Puesto'; }
                else if (match.round == 3) { return 'Final'; }
                break;
            case 'Supercopa de Clubes':
            case 'Supercopa Europea': 
                if (match.round == 1) { return 'Final'; } break;
        }
    }
}

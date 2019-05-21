import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Injectable()

export class AppService {

    public data = {
        user: undefined,
        users: undefined,
        teams: undefined,
        tournaments: undefined,
        constants: undefined,
        matches: undefined
    };
    public config;

    constructor(private http: Http) {
        this.http.post('config.json', null).subscribe( (response) => {
            this.config = response.json();
        });
    }

    public setUser(user) {
        this.data.user = user;
    }

    public setMatches(matches) {
        this.data.matches = matches;
    }

    public getConstants(): any {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.data.constants = response.json() ? response.json().constants[0] : {};
        });
    }

    public getUsers() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
            this.data.users = response.json() ? response.json().users : [];
        });
    }

    public getMatches(): Observable<any> {
        return this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'});
    }

    public getTeams() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'T'}).subscribe( (response) => {
            this.data.teams = response.json() ? response.json().teams : [];
            this.data.teams.forEach( (value) => {
                while (value.nation.indexOf('/n') != -1) {
                  value.nation = value.nation.replace('/n', 'ñ');
                }
            });
        });
    }

    public getTournaments() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'TO'}).subscribe( (response) => {
            this.data.tournaments = response.json() ? response.json().tournaments : [];
        });
    }

    public getTeamById(team) {
        let teamToReturn = null;
        this.data.teams.forEach( (value) => {
            if (value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    public getTournamentById(id): any { 
        let tournament = {};
        id = parseInt(id);
        this.data.tournaments.forEach( (value) => {
            if (value.id == id) {
                tournament = value;
            }
        });
        return tournament;
    }

    public getTableConfig(tableFields, rows?) {
        return {
            headerRow: tableFields,
            dataRows: rows ? rows : []
        };
    }

    public getRoundName(match) {
        switch (this.getTournamentById(match.tournament).name) {
            case 'Copa':
                if (match.round < 3) { return 'Octavos de Final'; }
                else if (match.round >= 3 && match.round < 5) { return 'Cuartos de Final'; }
                else if (match.round >= 5 && match.round < 7) { return 'Semifinales'; }
                else if (match.round == 9) { return 'Tercer y Cuarto Puesto'; }
                else if (match.round == 8) { return 'Final'; }
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

    public isThisInterval(tournament, round) {
        let ret = false;
        this.config.leagues.forEach( (value) => {
            if(value == this.getTournamentById(tournament).name) {
                ret = true;
            }
        });
        if(!ret || round > this.data.constants.intervalActual) {
            ret = false;
        }
        return ret;
    }
}

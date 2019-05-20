import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class AppService {

    public data = {
        user: undefined,
        teams: undefined,
        tournaments: undefined
    };
    public config;
    private subject = new Subject<any>();

    constructor(private http: Http) {
        this.http.post('config.json', null).subscribe( (response) => {
            this.config = response;
        });
    }

    public setUser(user) {
        this.data.user = user;
    }

    public getConstants(): any {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            let constants = response.json() ? response.json().constants[0]: {};
            this.subject.asObservable();
            this.subject.next({constants: constants});
        }, () => {
            return null;
        });
    }

    public getUsers(): any {
        return this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
            const users = response.json() ? response.json().users : [];
            return users;
        }, () => {
            return [];
        });
    }

    public getMatches(): any {
        return this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            const matches = response.json() ? response.json().matches : [];
            return matches;
        }, () => {
            return [];
        });
    }

    public getTeamById(team) {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'T'}).subscribe( (response) => {
            this.data.teams = response.json() ? response.json().teams : [];
            this.data.teams.forEach( (value) => {
                while (value.nation.indexOf('/n') != -1) {
                  value.nation = value.nation.replace('/n', 'ñ');
                }
            });
            let teamToReturn = null;
            this.data.teams.forEach( (value) => {
                if (value.id == team) {
                    teamToReturn = value;
                }
            });
            return teamToReturn;
        }, () => {
            return null;
        });
    }

    public getTournamentById(id): any { 
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'TO'}).subscribe( (response) => {
            this.data.tournaments = response.json() ? response.json().tournaments: [];
            let tournament = {};
            id = parseInt(id);
            this.data.tournaments.forEach( (value) => {
                if (value.id == id) {
                    tournament = value;
                }
            });
            return tournament;
        }, () => {
            return null;
        });
    }

    public getRoundRobinTournaments() {
        return this.config.roundRobinTournaments;
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
        if(ret && round <= this.getConstants().intervalActual) {
            ret = false;
        }
        return ret;
    }
}

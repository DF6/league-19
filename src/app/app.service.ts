import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

export interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

export interface KeyConfig {
    round: number;
    matches: any[];
    local: number;
    away: number;
    classNames: Object;
    showTitle: boolean;
}

@Injectable()

export class AppService {

    public data = {
        constants: undefined,
        matches: undefined,
        players: undefined,
        signins: undefined,
        teams: undefined,
        tournaments: undefined,
        user: undefined,
        users: undefined
    };
    public config;

    constructor(private http: Http, private router: Router) {
        this.refreshUser();
        this.refreshConfig();
    }

    public refreshUser() {
        if(sessionStorage.getItem('user') != null) {
            this.setUser(JSON.parse(sessionStorage.getItem('user')));
        }
    }

    public refreshConfig() {
        this.http.post('config.json', null).subscribe( (response) => {
            this.config = response.json();
        });
    }

    public goTo(url){
        this.router.navigateByUrl(url);
    }

    public setConfig(config) {
        this.config = config;
    }

    public setMatches(matches) {
        this.data.matches = matches;
    }

    public setSignins(signins) {
        this.data.signins = signins;
    }

    public setUser(user) {
        this.data.user = user;
    }

    public getConfigObservable(): Observable<any> {
        return this.http.post('config.json', null);
    }

    public getConstants(): any {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.data.constants = response.json() ? response.json().constants[0] : {};
        });
    }

    public getMatchesObservable(): Observable<any> {
        return this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'});
    }

    public getPlayers() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
            this.data.players = response.json() ? response.json().players : [];
        });
    }

    public getSignins() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'S'}).subscribe( (response) => {
            this.data.signins = response.json() ? response.json().signins: [];
        });
    }

    public getSigninsObservable(): Observable<any> {
        return this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'S'});
    }

    public getTeams() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'T'}).subscribe( (response) => {
            this.data.teams = response.json() ? response.json().teams : [];
            this.data.teams.forEach( (value) => {
                value.nation = this.convertNToÑ(value.nation);
            });
        });
    }

    public getTournaments() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'TO'}).subscribe( (response) => {
            this.data.tournaments = response.json() ? response.json().tournaments : [];
        });
    }

    public getUsers() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
            this.data.users = response.json() ? response.json().users : [];
        });
    }

    public getClassNames(size) {
        return {
            small: this.config.classNameSizes.all,
            medium: size,
            large: size == this.config.classNameSizes.all ? 12: size + 1
        }
    }

    public getLastEdition(name) {
        let lastEdition = null;
        for (let i = 0; i < this.data.tournaments.length; i++) {
            if (this.data.tournaments[i].name == name && lastEdition < this.data.tournaments[i].edition) {
                lastEdition = this.data.tournaments[i];
            }
        }
        return lastEdition;
    }

    public getPlayerById(player) {
        let playerToReturn = null;
        this.data.players.forEach( (value) => {
            if (value.id == player) {
                playerToReturn = value;
            }
        });
        return playerToReturn;
    }

    public getMatchConfiguration(match, classNames, showTitle, previousConfig?: KeyConfig): KeyConfig {
        if (previousConfig) {
            previousConfig.matches.push(match);
        }
        return {
            round: previousConfig ? previousConfig.round : match.round,
            matches: previousConfig ? previousConfig.matches : [match],
            local: previousConfig ? previousConfig.local: match.local,
            away: previousConfig ? previousConfig.away : match.away,
            classNames: previousConfig ? previousConfig.classNames : classNames,
            showTitle: previousConfig ? previousConfig.showTitle : showTitle
        };
    }

    public getTableConfig(tableFields, rows?) {
        return {
            headerRow: tableFields,
            dataRows: rows ? rows : []
        };
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

    private getTournamentByNameAndEdition(name, edition) {
        let tournament = -1;
        for (let i = 0; i < this.data.tournaments.length; i++) {
            if (this.data.tournaments[i].name == name && edition == this.data.tournaments[i].edition) {
                tournament = this.data.tournaments[i].id;
            }
        }
        return tournament;
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
        if(ret && parseInt(round) > parseInt(this.data.constants.intervalActual)) {
            ret = false;
        } else if (!ret) {
            ret = true
        }
        return ret;
    }

    public whoWon(match) {
        if (match.localGoals == -1 || match.awayGoals == -1) {
            return null;
        } else {
            if (match.localGoals > match.awayGoals) {
                return match.local;
            }else if (match.localGoals < match.awayGoals) {
                return match.away;
            }else if (match. localGoals == match.awayGoals) {
                return null;
            }
        }
    }

    public removeAccents(name) {
        let chars = {
            "á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u",
            "à":"a", "è":"e", "ì":"i", "ò":"o", "ù":"u", "ñ":"/n",
            "ä":"a", "ë":"e", "ï":"i", "ö":"o", "ü":"u",
            "Á":"A", "É":"E", "Í":"I", "Ó":"O", "Ú":"U",
            "À":"A", "È":"E", "Ì":"I", "Ò":"O", "Ù":"U", "Ñ":"/n",
            "Ä":"A", "Ë":"E", "Ï":"I", "Ö":"O", "Ü":"U"}
        let expr = /[áàéèíìóòúùäëïöüñ]/ig;
        let res = name.replace(expr,function(e){return chars[e]});
        return res;
    }

    public convertNToÑ(name) {
        while (name.indexOf('/n') != -1) {
          name = name.replace('/n', 'ñ');
        }
        while (name.indexOf('/N') != -1) {
          name = name.replace('/N', 'Ñ');
        }
        return name;
    }

    public addZero(number) {
        if(number<10){number="0"+number;}
        return number;
    }
}

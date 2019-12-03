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

const PHPFILENAME = './CMDataRequesting.php';

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

    public addZero(number) {
        return number < 10 ? '0' + number : number;
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

    public divideByRounds(matches, finalRound, matchesPerRound) {
        let roundArray = [];
        for (let round = 1; round < finalRound; round += matchesPerRound) {
            roundArray.push({ rounds: this.getMatchNumbers(round, matchesPerRound), matches: []});
        }
        roundArray.push({ rounds: [finalRound], matches: []});
        roundArray.push({ rounds: [finalRound + 1], matches: []});

        matches.forEach( (value) => {
            roundArray.forEach( (value2) => {
                if (value2.rounds.includes(parseInt(value.round))) {
                    value2.matches.push(value);
                }
            });
        });

        let ret = [];
        roundArray.forEach( (value) => {
            ret.push(value.matches);
        });
        return ret;
    }

    public getClassNames(size) {
        return {
            small: this.config.classNameSizes.all,
            medium: size,
            large: size == this.config.classNameSizes.all ? 12 : size + 1
        }
    }

    public getConfigObservable(): Observable<any> {
        return this.http.post('config.json', null);
    }

    public getConstants(): any {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'CONSTANTS'}).subscribe( (response) => {
            this.data.constants = response.json() ? response.json().constants[0] : {};
        });
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

    public getMatchById(match) {
        return this.data.matches.filter( (filteredMatch) => { return filteredMatch.id == match })[0];
        /*let matchToReturn = null;
        this.data.matches.forEach( (value) => {
            if (value.id == match) {
                matchToReturn = value;
            }
        });
        return matchToReturn;*/
    }

    public getMatchConfiguration(match, classNames, showTitle, previousConfig?: KeyConfig): KeyConfig {
        if (previousConfig) {
            previousConfig.matches.push(match);
        }
        return {
            round: previousConfig ? previousConfig.round : match.round,
            matches: previousConfig ? previousConfig.matches : [match],
            local: previousConfig ? previousConfig.local : match.local,
            away: previousConfig ? previousConfig.away : match.away,
            classNames: previousConfig ? previousConfig.classNames : classNames,
            showTitle: previousConfig ? previousConfig.showTitle : showTitle
        };
    }

    private getMatchNumbers(round, matchesPerRound) {
        let ret = [];
        for (let cont = 0; cont < matchesPerRound; cont++) {
            ret.push(round + cont);
        }
        return ret;
    }

    public getMatchesObservable(): Observable<any> {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'M'});
    }

    public getPlayerById(player) {
        return this.data.players.filter( (filteredPlayer) => { return filteredPlayer.id == player })[0];
        /*let playerToReturn = null;
        this.data.players.forEach( (value) => {
            if (value.id == player) {
                playerToReturn = value;
            }
        });
        return playerToReturn;*/
    }

    public getPlayers() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
            this.data.players = response.json() ? response.json().players : [];
            this.data.players.forEach( (value) => {
                value.name = this.convertNToÑ(value.name);
            });
        });
    }

    public getPlayersByTeam(team) {
        return this.data.players.filter( (filteredPlayer) => { return filteredPlayer.teamID == team });
        /*let playersToReturn = [];
        this.data.players.forEach( (value) => {
            if (value.teamID == team) {
                playersToReturn.push(value);
            }
        });
        return playersToReturn;*/
    }

    public getRoundName(match) {
        switch (this.getTournamentById(match.tournament).name) {
            case this.config.tournamentGeneralInfo.generalCup.name:
                if (match.round < 3) { return this.config.roundNames.outOf16;
                }else if (match.round >= 3 && match.round < 5) { return this.config.roundNames.quarterFinals;
                }else if (match.round >= 5 && match.round < 7) { return this.config.roundNames.semifinals;
                }else if (match.round == 9) { return this.config.roundNames.thirdAndFourthPlace;
                }else if (match.round == 8) { return this.config.roundNames.final; }
                break;
            case this.config.tournamentGeneralInfo.championsLeague.name:
                if (match.round < 7) { return this.config.roundNames.groupStage;
                }else if (match.round >= 7 && match.round < 9) { return this.config.roundNames.quarterFinals;
                }else if (match.round >= 9 && match.round < 11) { return this.config.roundNames.semifinals;
                }else if (match.round == 12) { return this.config.roundNames.thirdAndFourthPlace;
                }else if (match.round == 11) { return this.config.roundNames.final;
                }
                break;
            case this.config.tournamentGeneralInfo.europaLeague.name:
                if (match.round < 3) { return this.config.roundNames.quarterFinals;
                }else if (match.round >= 3 && match.round < 5) { return this.config.roundNames.semifinals;
                }else if (match.round == 6) { return this.config.roundNames.thirdAndFourthPlace;
                }else if (match.round == 5) { return this.config.roundNames.final; }
                break;
            case this.config.tournamentGeneralInfo.intertoto.name:
                if (match.round < 3) { return this.config.roundNames.semifinals;
                }else if (match.round == 4) { return this.config.roundNames.thirdAndFourthPlace;
                }else if (match.round == 3) { return this.config.roundNames.final; }
                break;
            case this.config.tournamentGeneralInfo.clubSupercup.name:
            case this.config.tournamentGeneralInfo.europeSupercup.name:
                if (match.round == 1) { return this.config.roundNames.final; } break;
        }
    }

    public getSignins() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'S'}).subscribe( (response) => {
            this.data.signins = response.json() ? response.json().signins : [];
        });
    }

    public getSigninsObservable(): Observable<any> {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'S'});
    }

    public getTableConfig(tableFields, rows?) {
        return {
            headerRow: tableFields,
            dataRows: rows ? rows : []
        };
    }

    public getTeamById(team) {
        return this.data.teams.filter( (filteredTeam) => { return filteredTeam.id == team })[0];
        /*let teamToReturn = null;
        this.data.teams.forEach( (value) => {
            if (value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;*/
    }

    public getTeams() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'T'}).subscribe( (response) => {
            this.data.teams = response.json() ? response.json().teams : [];
            this.data.teams.forEach( (value) => {
                value.nation = this.convertNToÑ(value.nation);
            });
        });
    }

    public getTournamentById(id): any {
        id = parseInt(id);
        return this.data.tournaments.filter( (filteredTournament) => { return filteredTournament.id == id })[0];
        /*let tournament = {};
        id = parseInt(id);
        this.data.tournaments.forEach( (value) => {
            if (value.id == id) {
                tournament = value;
            }
        });
        return tournament;*/
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

    public getTournaments() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'TO'}).subscribe( (response) => {
            this.data.tournaments = response.json() ? response.json().tournaments : [];
        });
    }

    public getUsers() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
            this.data.users = response.json() ? response.json().users : [];
        });
    }

    public goTo(url){
        this.router.navigateByUrl(url);
    }

    public hasPreviousMatch(match, matchesToSearch) {
        switch (this.getTournamentById(match.tournament).name) {
            case this.config.tournamentGeneralInfo.generalCup.name:
            case this.config.tournamentGeneralInfo.europaLeague.name:
            case this.config.tournamentGeneralInfo.intertoto.name:
                if (match.round % 2 == 0) {
                    matchesToSearch.forEach( (value) => {
                        if (value.local == match.away && value.away == match.local && value.round == match.round - 1) {
                            return [value, match];
                        }
                    });
                }
                return null;
            case this.config.tournamentGeneralInfo.championsLeague.name:
                if (match.round % 2 == 0 && match.round > 6) {
                    matchesToSearch.forEach( (value) => {
                        if (value.local == match.away && value.away == match.local && value.round == match.round - 1) {
                            return [value, match];
                        }
                    });
                }
                return null;
            case this.config.tournamentGeneralInfo.clubSupercup.name:
            case this.config.tournamentGeneralInfo.europeSupercup.name:
                return null;
        }
    }

    public isUpdatableStanding(match) {
        return this.config.tournamentGeneralInfo[this.toCamelCase(this.getTournamentById(match.tournament).name)].KORound >= match.round;
    }

    public isThisInterval(tournament, round) {
        let ret = false;
        this.config.leagues.forEach( (value) => {
            if (value == this.getTournamentById(tournament).name) {
                ret = true;
            }
        });
        if (ret && parseInt(round) > parseInt(this.data.constants.intervalActual)) {
            ret = false;
        } else if (!ret) {
            ret = true;
        }
        return ret;
    }

    public refreshConfig() {
        this.http.post('config.json', null).subscribe( (response) => { this.config = response.json(); });
    }

    public refreshUser() {
        sessionStorage.getItem('user') != null ? this.setUser(JSON.parse(sessionStorage.getItem('user'))) : null;
    }

    public removeAccents(name) {
        const chars = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u', 'ñ': '/n',
            'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
            'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
            'À': 'A', 'È': 'E', 'Ì': 'I', 'Ò': 'O', 'Ù': 'U', 'Ñ': '/n',
            'Ä': 'A', 'Ë': 'E', 'Ï': 'I', 'Ö': 'O', 'Ü': 'U'};
        const expr = /[áàéèíìóòúùäëïöüñ]/ig;
        const res = name.replace(expr, function(e){return chars[e]; });
        return res;
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

    private toCamelCase(param) {
        return param
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? 
        ltr.toLowerCase() : 
        ltr.toUpperCase()).replace(/\s+/g, '');
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
}

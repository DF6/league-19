import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

export interface TableData {
    headerRow: string[];
    dataRows: string[][];
    collapsed?: Boolean;
}

export interface KeyConfig {
    tournament: number,
    round: number;
    matches: any[];
    local: number;
    away: number;
    classNames: Object;
    showTitle: boolean;
}

declare var $: any;

const PHPFILENAME = './test_CMDataRequesting.php';

@Injectable()

export class AppService {

    public data = {
        actions: undefined,
        adminData: {
            suggestions: undefined
        },
        constants: undefined,
        matches: undefined,
        partners: undefined,
        playerChangeSignins: undefined,
        players: undefined,
        signins: undefined,
        standings: undefined,
        teamCupTeams: undefined,
        teams: undefined,
        tournaments: undefined,
        user: undefined,
        users: undefined
    };
    public config;

    constructor(private http: Http, private router: Router) {
        if(sessionStorage.getItem('user')) { this.refreshUser(); }
        this.refreshConfig();
    }

    public addZero(number) {
        return number < 10 ? '0' + number : number;
    }

    private concatMessage(arr) {
        let message = '';
        arr.forEach( (value, key) => {
            message += this.getPlayerById(value.player).name;
            if(key != arr.length - 1) { message += ', '; }
        });
        return message == '' ? 'Ninguno' : message;
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

    public getActions() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'A'}).subscribe( (response) => {
            this.data.actions = response.json() ? response.json().actions : [];
        });
    }

    public getActionsObservable(): Observable<any> {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'A'});
    }

    public getActiveUsers() {
        return this.data.users.filter( (user) => { return user.teamID != 0 && user.teamID != -1 });
    }

    public getAllTournamentEditions() {
        let allEditions = [];
        this.data.tournaments.forEach( (tournament) => {
            if(!allEditions.includes(tournament.edition)) { allEditions.push(tournament.edition); }
        });
        return allEditions;
    }

    public getAnotherMatchOfRound(currentMatches, roundMatches) {
        const anotherMatch = roundMatches.filter( (filteredMatch) => {
            return filteredMatch.tournament == currentMatches[0].tournament &&
                (currentMatches.filter( (curr) => { return filteredMatch.local == curr.local || filteredMatch.local == curr.away; }).length > 0) &&
                (currentMatches.filter( (curr) => { return filteredMatch.away == curr.local || filteredMatch.away == curr.away; }).length > 0) &&
                (currentMatches.filter( (curr) => { return parseInt(filteredMatch.round) == parseInt(curr.round) + 1 || parseInt(filteredMatch.round) == parseInt(curr.round) + 2; }).length > 0);
        });
        return anotherMatch.length > 0 ? anotherMatch[0] : undefined;
    }

    public getAuctionInitialAmount(player) {
        this.config.auctionInitialAmounts
            .filter( (amount) => {
                return player.overage >= amount.min && player.overage < amount.max;
            })
            .map( (value) => {
                player.amount = value.amount;
            });
        return player;
    }

    public getClassNames(size) {
        return {
            small: this.config.classNameSizes.all,
            medium: size,
            large: size
        }
    }

    public getClubByTeam(team) {
        const myClub = this.data.teamCupTeams.filter( (filteredClub) => {
            return filteredClub.team == team.id;
        })[0];
        return this.data.teamCupTeams.filter( (filteredClub) => {
            return filteredClub.club == myClub.club;
        })
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
        let lastEdition = 0;
        let tournamentToReturn = undefined;
        this.data.tournaments.filter( (filteredTournament) => {
            return filteredTournament.name == name;
        })
        .forEach( (value) => {
            if(parseInt(value.edition) > lastEdition) {
                lastEdition = parseInt(value.edition);
                tournamentToReturn = value;
            }
        });
        return tournamentToReturn;
    }

    public getMatchById(match) {
        return this.data.matches.filter( (filteredMatch) => { return filteredMatch.id == match })[0];
    }

    public getMatchConfiguration(match, classNames, showTitle, previousConfig?: KeyConfig): KeyConfig {
        if(!match) { return null; }
        if (previousConfig) {
            previousConfig.matches.push(match);
        }
        return {
            tournament: previousConfig ? previousConfig.tournament : match.tournament,
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

    public getMatches() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            this.data.matches = response.json() ? response.json().matches : [];
        });
    }

    public getMatchesByTeam(team) {
        return this.data.matches.filter( (filteredMatch) => {
            return filteredMatch.local == team || filteredMatch.away == team;
        });
    }

    public getMatchesByTeamToThisMoment(team) {
        return this.data.matches.filter( (filteredMatch) => {
            return (filteredMatch.local == team || filteredMatch.away == team) && this.isCalendarMatch(filteredMatch);
        });
    }

    public getMatchesByTournament(tournament) {
        return this.data.matches.filter( (filteredMatch) => {
            return filteredMatch.tournament == tournament;
        });
    }

    public getMatchesObservable(): Observable<any> {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'M'});
    }

    public getPartnersObservable(): Observable<any> {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'PARTNERS'});
    }

    public getPlayerById(player) {
        return this.data.players.filter( (filteredPlayer) => { return filteredPlayer.id == player })[0];
    }

    public getPlayerChangeSigninsObservable() {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'PCS'});
    }

    public getPlayerWithMaximumOverage(players) {
        let maxOverage = -1;
        let playerToReturn = null;
        players.forEach( (player) => {
            if (parseInt(player.overage) > maxOverage) {
                maxOverage = parseInt(player.overage);
                playerToReturn = player;
            }
        });
        return playerToReturn;
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
        return this.data.players.filter( (filteredPlayer) => { return filteredPlayer.teamID == team && !this.data.signins.some((filteredSignin) => { return filteredSignin.player == filteredPlayer.id && filteredSignin.market == this.data.constants.marketEdition && filteredSignin.signinType == 'L'; }) });
    }

    public getPlayersObservable() {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'P'});
    }

    public getRoundName(match) {
        switch (this.getTournamentById(match.tournament).name) {
            case this.config.tournamentGeneralInfo.copa.name:
                switch(parseInt(match.round)) {
                    case 1: return this.config.roundNames.previousRound;
                    case 2: return this.config.roundNames.outOf16;
                    case 3: return this.config.roundNames.quarterFinals;
                    case 4: return this.config.roundNames.semifinals;
                    case 5: return this.config.roundNames.thirdAndFourthPlace;
                    case 6: return this.config.roundNames.final;
                }
                break;
            case this.config.tournamentGeneralInfo.championsLeague.name:
                switch(parseInt(match.round)) {
                    case 1:
                    case 2: return this.config.roundNames.quarterFinals;
                    case 3:
                    case 4: return this.config.roundNames.semifinals;
                    case 5: return this.config.roundNames.thirdAndFourthPlace;
                    case 6: return this.config.roundNames.final;
                }
                break;
            case this.config.tournamentGeneralInfo.europaLeague.name:
                switch(parseInt(match.round)) {
                    case 1:
                    case 2:
                    case 3: return this.config.roundNames.groupStage;
                    case 4:
                    case 5: return this.config.roundNames.quarterFinals;
                    case 6:
                    case 7: return this.config.roundNames.semifinals;
                    case 8: return this.config.roundNames.thirdAndFourthPlace;
                    case 9: return this.config.roundNames.final;
                }
                break;
            case this.config.tournamentGeneralInfo.copaMugre.name:
                switch(parseInt(match.round)) {
                    case 1:
                    case 2: return this.config.roundNames.semifinals;
                    case 3: return this.config.roundNames.thirdAndFourthPlace;
                    case 4: return this.config.roundNames.final;
                }
                break;
            case this.config.tournamentGeneralInfo.supercopaDeClubes.name:
            case this.config.tournamentGeneralInfo.supercopaEuropea.name:
                return this.config.roundNames.final;
            case this.config.tournamentGeneralInfo.primera.name:
            case this.config.tournamentGeneralInfo.segunda.name:
                switch(parseInt(match.round)) {
                    case 10: 
                    case 11: return this.config.roundNames.semifinals;
                    case 12: 
                    case 13: return this.config.roundNames.final;
                    default: return match.round;
                }
            case this.config.tournamentGeneralInfo.teamCup.name:
                switch(parseInt(match.round)) {
                    case 1: return this.config.roundNames.semifinals; 
                    case 2: return this.config.roundNames.thirdAndFourthPlace; 
                    case 3: return this.config.roundNames.final;
                }
            case this.config.tournamentGeneralInfo.goldenTrophy.name: return match.round;
            case this.config.tournamentGeneralInfo.nationsLeague.name:
                switch(parseInt(match.round)) {
                    case 6: return this.config.roundNames.semifinals;
                    case 7: return this.config.roundNames.thirdAndFourthPlace;
                    case 8: return this.config.roundNames.final;
                    default: return match.round;
                }
        }
    }

    public getSigninById(signin) {
        return this.data.signins.filter( (filteredSignin) => { return filteredSignin.id == signin })[0];
    }

    public getSignins() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'S'}).subscribe( (response) => {
            this.data.signins = response.json() ? response.json().signins : [];
        });
    }

    public getSigninsObservable(): Observable<any> {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'S'});
    }

    public getStandings() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'ST'}).subscribe( (response) => {
            this.data.standings = response.json() ? response.json().standings : [];
        });
    }

    public getStandingsObservable(): Observable<any> {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'ST'});
    }

    public getSuggestions() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'SUG'}).subscribe( (response) => {
            this.data.adminData.suggestions = response.json() ? response.json().suggestions : [];
        });
    }

    public getTableConfig(tableFields, rows?, extraField?) {
        return extraField ? {
            headerRow: tableFields,
            dataRows: rows ? rows : [],
            collapsed: true
        } : 
        {
            headerRow: tableFields,
            dataRows: rows ? rows : []
        };
    }

    public getTeamById(team) {
        const filteredTeams = this.data.teams.filter( (filteredTeam) => { return filteredTeam.id == team });
        if(filteredTeams.length == 0) {
            return { name: '-', nation: '-', imageRoute: '-'};
        }else {
            return filteredTeams[0];
        }
    }

    public getTeams() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'T'}).subscribe( (response) => {
            this.data.teams = response.json() ? response.json().teams : [];
            this.data.teams.forEach( (value) => {
                value.nation = this.convertNToÑ(value.nation);
            });
        });
    }

    public getTeamCupTeams() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'TCT'}).subscribe( (response) => {
            this.data.teamCupTeams = response.json() ? response.json().teamCupTeams : [];
        });
    }

    public getTotalSalariesByTeam(playersOfTheTeam) {
        let total = 0;
        playersOfTheTeam.forEach( (value) => {
            if(value.cedido == 0) {
                total += parseFloat(value.salary);
            }
        });
        return Math.round(total * 100) / 100;
    }

    public getTotalEstimatedSalariesByTeam(playersOfTheTeam) {
        let total = 0;
        playersOfTheTeam.forEach( (value) => {
            if(value.cedido == 0) {
                total += parseFloat(value.salary) + 0.5;
            }
        });
        return Math.round(total * 100) / 100;
    }

    public getTournamentById(id): any {
        id = parseInt(id);
        return this.data.tournaments.filter( (filteredTournament) => { return filteredTournament.id == id })[0];
    }

    public getTournamentByMatch(matchID) {
        return this.getTournamentById(this.data.matches.filter( (filteredMatch) => {
            return filteredMatch.id == matchID;
        })[0].tournament);
    }

    public getTournaments() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'TO'}).subscribe( (response) => {
            this.data.tournaments = response.json() ? response.json().tournaments : [];
        });
    }

    public getUndisputedMatches(teamMatches) {
        return teamMatches.filter( (filteredMatch) => {
            return filteredMatch.localGoals == '-1' && filteredMatch.awayGoals == '-1' && this.isCalendarMatch(filteredMatch);
        })
        .map( (value) => {
            value.filling = false;
            return value;
        });
    }

    public getUserById(id): any {
        return this.data.users.filter( (filteredUser) => { return filteredUser.id == id })[0];
    }

    public getUsers() {
        this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
            this.data.users = response.json() ? response.json().users : [];
        });
    }

    public getUsersObservable(): Observable<any> {
        return this.http.post(PHPFILENAME, {type: 'recDat', dataType: 'U'});
    }

    public getWonTournaments() {
        const tournamentsInFinalRound = this.data.tournaments.filter( (filteredTournament) => {
            const final = this.getMatchesByTournament(filteredTournament.id).filter( (filteredMatch) => {
                return filteredMatch.round == this.config.roundSetter.find( (tournament) => { return tournament.name == filteredTournament.name; }).round;
            });
            return final.length > 0;
        });
        let toReturn = [];
        tournamentsInFinalRound.map( (finalTournament) => {
            const resolvedFinal = this.getMatchesByTournament(finalTournament.id).filter( (filteredFinal) => {
                return filteredFinal.round == this.config.roundSetter.find( (tournament) => { return tournament.name == finalTournament.name; }).round && this.whoWon(filteredFinal) != undefined;
            });
            if(this.whoWon(resolvedFinal[0]) != undefined) {
                toReturn.push({ name: finalTournament.name, edition: finalTournament.edition, team: this.whoWon(resolvedFinal[0])});
            }
        });
        return toReturn;
    }

    public goTo(url){
        this.router.navigateByUrl(url);
    }

    public hasPreviousMatch(match, matchesToSearch) {
        switch (this.getTournamentById(match.tournament).name) {
            case this.config.tournamentGeneralInfo.copa.name:
            case this.config.tournamentGeneralInfo.europaLeague.name:
            case this.config.tournamentGeneralInfo.copaMugre.name:
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
            case this.config.tournamentGeneralInfo.supercopaDeClubes.name:
            case this.config.tournamentGeneralInfo.supercopaEuropea.name:
                return null;
        }
    }

    public increaseSalaries(match) {
        this.data.players.filter( (playerFiltered) => {
            return playerFiltered.teamID == match.local || playerFiltered.teamID == match.away;
        })
        .forEach( (value) => {
            this.http.post(PHPFILENAME, {type: 'guaSal', salary: parseFloat(value.salary) + this.config.salaryIncreaseRate, player: value.id, team: value.teamID}).subscribe( () => {});
        });
    }

    public insertLog(log) {
        this.http.post(PHPFILENAME, {type: 'log', user: this.data.user ? this.data.user.id : log.id, logType: log.logType, logInfo: log.logInfo}).subscribe(()=>{});
    }

    public isCalendarMatch(match) {
        switch(this.getTournamentById(match.tournament).name) {
            case this.config.tournamentGeneralInfo.copa.name: return parseInt(match.round) <= this.config.validRounds.copa;
            case this.config.tournamentGeneralInfo.primera.name:return parseInt(match.round) <= this.config.validRounds.primera;
            case this.config.tournamentGeneralInfo.segunda.name: return parseInt(match.round) <= this.config.validRounds.segunda;
            case this.config.tournamentGeneralInfo.supercopaDeClubes.name: return parseInt(match.round) <= this.config.validRounds.supercopaDeClubes;
            case this.config.tournamentGeneralInfo.supercopaEuropea.name: return parseInt(match.round) <= this.config.validRounds.supercopaEuropea;
            case this.config.tournamentGeneralInfo.teamCup.name: return parseInt(match.round) <= this.config.validRounds.teamCup;
            case this.config.tournamentGeneralInfo.goldenTrophy.name: return parseInt(match.round) <= this.config.validRounds.goldenTrophy;
            case this.config.tournamentGeneralInfo.nationsLeague.name: return parseInt(match.round) <= this.config.validRounds.nationsLeague;
        }
    }

    public isUpdatableStanding(match) {
        return this.config.tournamentGeneralInfo[this.toCamelCase(this.getTournamentById(match.tournament).name)].KORound >= match.round;
    }

    public isThePlayerInAuction(player) {
        return this.data.signins.filter( (filteredSignin) => {
            return filteredSignin.signinType == this.config.signinTypes.freeAuction && filteredSignin.market == this.data.constants.marketEdition && filteredSignin.player == player.id;
        }).length > 0;
    }

    public mountAction(match, type, player) {
        return 'INSERT INTO test_actions (match_id, type, player) values ('
         + match.id + ', \''
         + type + '\', '
         + player + ');';
    }

    public refreshConfig() {
        this.http.post('config.json', null).subscribe( (response) => { this.config = response.json(); });
    }

    public refreshUser() {
        this.getUsersObservable().subscribe( (response) => {
            if(response.json().success) {
                this.setUsers(response.json().users);
                this.setUser(this.data.users
                    .filter( (value) => {
                        return value.id == JSON.parse(sessionStorage.getItem('user')).id;
                    })
                    .map( (user) => {
                        return {
                            id: user.id,
                            teamID: user.teamID,
                            user: user.user,
                            email: user.email,
                            name: user.name,
                            psnID: user.psnID,
                            twitch: user.twitch,
                            adminRights: parseInt(user.adminRights),
                            holidaysMode: parseInt(user.holidaysMode),
                            holidaysMessage: user.holidaysMessage
                        }
                    })[0]);
                this.setSessionUser(this.data.user);
            }
        });
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

    public resetAllSalaries() {
        this.getPlayersObservable().subscribe( (response) => {
            this.data.players = response.json().players;
            this.data.players.forEach( (value) => {
                this.http.post(PHPFILENAME, {type: 'guaSal', salary: parseInt(value.overage)/100, player: value.id, team: value.teamID}).subscribe( () => {});
            });
            alert('Terminado');
        });
    }

    public resetSalary(player) {
        this.http.post(PHPFILENAME, {type: 'guaSal', salary: parseInt(player.overage)/100, player: player.id, team: player.teamID}).subscribe( (response) => {
            if(response.json().success) { alert('Reseteado'); }
        });
    }

    public sendActionsOfTheMatch(match, localInfo, awayInfo) {
        let query = '';
        localInfo.scorers.forEach( (value) => {
            query += this.mountAction(match, 'G', value);
        });
        localInfo.assistants.forEach( (value) => {
            query += this.mountAction(match, 'A', value);
        });
        localInfo.yellowCards.forEach( (value) => {
            query += this.mountAction(match, 'Y', value);
        });
        localInfo.redCards.forEach( (value) => {
            query += this.mountAction(match, 'R', value);
        });
        localInfo.injuries.forEach( (value) => {
            query += this.mountAction(match, 'I', value);
        });
        localInfo.mvp.forEach( (value) => {
            query += this.mountAction(match, 'M', value);
        });
        awayInfo.scorers.forEach( (value) => {
            query += this.mountAction(match, 'G', value);
        });
        awayInfo.assistants.forEach( (value) => {
            query += this.mountAction(match, 'A', value);
        });
        awayInfo.yellowCards.forEach( (value) => {
            query += this.mountAction(match, 'Y', value);
        });
        awayInfo.redCards.forEach( (value) => {
            query += this.mountAction(match, 'R', value);
        });
        awayInfo.injuries.forEach( (value) => {
            query += this.mountAction(match, 'I', value);
        });
        awayInfo.mvp.forEach( (value) => {
            query += this.mountAction(match, 'M', value);
        });
        if (query != '') {
            this.http.post(PHPFILENAME, {type: 'insAct', query: query}).subscribe( () => {}, () => { alert('Error al insertar acción');});
        }
        this.insertLog({logType: this.config.logTypes.matchFilled, logInfo: 'Partido insertado: ' + match.id + ''});
        alert('Partido insertado');
    }

    public sendMatchInfo(match, localInfo, awayInfo) {

        this.http.post(PHPFILENAME, {type: 'setRes', localGoals: localInfo.score, awayGoals: awayInfo.score, matchID: match.id}).subscribe( (response) => {
            if (response.json().success) {
                let local = {points: 0, won: 0, draw: 0, lost: 0, nonPlayed: 0};
                let away = {points: 0, won: 0, draw: 0, lost: 0, nonPlayed: 0};
                if ((localInfo.score > awayInfo.score) || (awayInfo.score == -2 && localInfo.score != -2)) {
                    local.points = 3;
                    local.won = 1;
                    if(awayInfo.score == -2) {
                        away.nonPlayed = 1;
                    }else {
                        away.lost = 1;
                    }
                }else if (localInfo.score < awayInfo.score || (localInfo.score == -2 && awayInfo.score != -2)) {
                    away.points = 3;
                    away.won = 1;
                    if(localInfo.score == -2) {
                        local.nonPlayed = 1;
                    }else {
                        local.lost = 1;
                    }
                } else if(localInfo.score == -2 && awayInfo.score == -2) {
                    local.nonPlayed = 1;
                    away.nonPlayed = 1;
                } else {
                    local.points = 1;
                    away.points = 1;
                    local.draw = 1;
                    away.draw = 1;
                }
                if(this.isUpdatableStanding(this.getMatchById(match.id))) {
                    if(localInfo.score == -2) { localInfo.score = 0; }
                    if(awayInfo.score == -2) { awayInfo.score = 0; }
                    this.http.post(PHPFILENAME, {type: 'updSta', points: local.points, won: local.won, draw: local.draw, lost: local.lost, nonPlayed: local.nonPlayed, goalsFor: localInfo.score, goalsAgainst: awayInfo.score, tournamentID: match.tournament, team: match.local}).subscribe( () => {});
                    this.http.post(PHPFILENAME, {type: 'updSta', points: away.points, won: away.won, draw: away.draw, lost: away.lost, nonPlayed: away.nonPlayed, goalsFor: awayInfo.score, goalsAgainst: localInfo.score, tournamentID: match.tournament, team: match.away}).subscribe( () => {});
                }
                this.increaseSalaries(match);
                this.sendActionsOfTheMatch(match, localInfo,awayInfo);
            } else {
                alert(response.json().message);
            }
        });
    }

    public sendSuggestion(suggestion): any {
        let userToSend = 0;
        if(this.data.user) {
            userToSend = this.data.user.id;
        }
        this.http.post(PHPFILENAME, {type: 'senSug', user: userToSend, suggestion: suggestion}).subscribe( (response) => {
            if (response.json().success) {
                this.insertLog({logType: this.config.logTypes.sendSuggestion, logInfo: 'Sugerencia enviada'});
                return true;
            } else {
                return false;
            }
        });
    }

    public setConfig(config) {
        this.config = config;
    }

    public setMatches(matches) {
        this.data.matches = matches;
    }

    public setPlayers(players) {
        this.data.players = players;
    }

    public setSessionUser(user) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    public setSignins(signins) {
        this.data.signins = signins;
    }

    public setUser(user) {
        this.data.user = user;
    }

    public setUsers(users) {
        this.data.users = users;
    }

    public showResume(match, matchActions) {
        let actions = {
            localGoals: [],
            awayGoals: [],
            localAssists: [],
            awayAssists: [],
            localYellowCards: [],
            awayYellowCards: [],
            localRedCards: [],
            awayRedCards: [],
            localInjuries: [],
            awayInjuries: [],
            localMVP: [],
            awayMVP: []
        };
        matchActions.forEach( (action) => {
            if(this.getTeamById(this.getPlayerById(action.player).teamID).id == match.local) {
                switch(action.type) {
                    case this.config.actionTypes.goal: actions.localGoals.push(action);
                        break;
                    case this.config.actionTypes.assist: actions.localAssists.push(action);
                        break;
                    case this.config.actionTypes.yellowCard: actions.localYellowCards.push(action);
                        break;
                    case this.config.actionTypes.redCard: actions.localRedCards.push(action);
                        break;
                    case this.config.actionTypes.injury: actions.localInjuries.push(action);
                        break;
                    case this.config.actionTypes.mvp: actions.localMVP.push(action);
                        break;
                }
            } else {
                switch(action.type) {
                    case this.config.actionTypes.goal: actions.awayGoals.push(action);
                        break;
                    case this.config.actionTypes.assist: actions.awayAssists.push(action);
                        break;
                    case this.config.actionTypes.yellowCard: actions.awayYellowCards.push(action);
                        break;
                    case this.config.actionTypes.redCard: actions.awayRedCards.push(action);
                        break;
                    case this.config.actionTypes.injury: actions.awayInjuries.push(action);
                        break;
                    case this.config.actionTypes.mvp: actions.awayMVP.push(action);
                        break;
                }
            }
        });
        const message = 'Goles ' + this.getTeamById(match.local).name + ': ' +
        this.concatMessage(actions.localGoals) + '<br/>' +
        'Goles ' + this.getTeamById(match.away).name + ': ' +
        this.concatMessage(actions.awayGoals) + '<br/>' +
        'Asistencias ' + this.getTeamById(match.local).name + ': ' +
        this.concatMessage(actions.localAssists) + '<br/>' +
        'Asistencias ' + this.getTeamById(match.away).name + ': ' +
        this.concatMessage(actions.awayAssists) + '<br/>' +
        'Amarillas ' + this.getTeamById(match.local).name + ': ' +
        this.concatMessage(actions.localYellowCards) + '<br/>' +
        'Amarillas ' + this.getTeamById(match.away).name + ': ' +
        this.concatMessage(actions.awayYellowCards) + '<br/>' +
        'Rojas ' + this.getTeamById(match.local).name + ': ' +
        this.concatMessage(actions.localRedCards) + '<br/>' +
        'Rojas ' + this.getTeamById(match.away).name + ': ' +
        this.concatMessage(actions.awayRedCards) + '<br/>' +
        'Lesiones ' + this.getTeamById(match.local).name + ': ' +
        this.concatMessage(actions.localInjuries) + '<br/>' +
        'Lesiones ' + this.getTeamById(match.away).name + ': ' +
        this.concatMessage(actions.awayInjuries) + '<br/>' +
        'MVP ' + this.getTeamById(match.local).name + ': ' +
        this.concatMessage(actions.localMVP) + '<br/>' +
        'MVP ' + this.getTeamById(match.away).name + ': ' +
        this.concatMessage(actions.awayMVP);
        $.notify({
            title: this.getTeamById(match.local).name + ' ' + match.localGoals + ' - ' + match.awayGoals + ' ' + this.getTeamById(match.away).name,
            message: message
        },{
            type: 'minimalist',
            delay: 0,
            template: '<div data-notify="container" class="col-xs-11 col-sm-11 col-lg-6 col-md-6 alert-{0}" role="alert" style="background-color: rgb(241, 242, 240);border-color: rgba(149, 149, 149, 0.3);border-radius: 3px;color: rgb(149, 149, 149);padding: 10px;">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="title" style="color: rgb(51, 51, 51);display: block;font-weight: bold;margin-bottom: 5px;">{1}</span>' +
                '<span data-notify="message" style="font-size: 80%;">{2}</span>' +
            '</div>'
        });
    }

    private toCamelCase(param) {
        return param
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? 
        ltr.toLowerCase() : 
        ltr.toUpperCase()).replace(/\s+/g, '');
    }

    public whoWon(match) {
        if (!match) { return undefined; }
        if (match.localGoals == -1 || match.awayGoals == -1) {
            return undefined;
        } else {
            if (match.localGoals > match.awayGoals) {
                return match.local;
            }else if (match.localGoals < match.awayGoals) {
                return match.away;
            }else if (match. localGoals == match.awayGoals) {
                return undefined;
            }
        }
    }
}

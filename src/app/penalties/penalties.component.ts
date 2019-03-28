import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'penalties-cmp',
    moduleId: module.id,
    templateUrl: 'penalties.component.html'
})

export class PenaltiesComponent implements OnInit{
    public tableData1: TableData;
    public tournaments: any[];
    public teams: any[];
    public players: any[];
    public actions;
    public penalties;
    public matches;
    public yellowCardsCount = [];

    constructor(private http: Http){}

    ngOnInit() {
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.players = JSON.parse(sessionStorage.getItem('players')).players;
        this.setTableConfig();
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'A'}).subscribe( (response) => {
            this.actions = response.json().actions;
            this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
                this.matches = response.json().matches;
                let penalties = [];

                this.actions.forEach( (value) => {
                    switch(value.type) {
                        case 'Y':
                                if(this.updateYellowCount(value)) {
                                    let penalty = this.getPenalty(value);
                                    penalty.forEach( (value) => {
                                        if (this.roundValid(value)) {
                                            penalties.push(value);
                                        }
                                    });
                                }
                                break;
                        case 'R':
                        case 'I':
                                let penalty = this.getPenalty(value);
                                penalty.forEach( (value) => {
                                    if (this.roundValid(value)) {
                                        penalties.push(value);
                                    }
                                });
                                break;
                    }
                });

                this.tableData1.dataRows = penalties;
            });
        });
    }

    private roundValid(penalty) {
        let ret = false;

        switch (penalty.tournament) {
                case 'Primera':
                case 'Segunda':
                    ret = (penalty.round > 3 && penalty.round < 8);
                    break;
                case 'Copa':
                    ret = (penalty.round > 2 && penalty.round < 5);
                    break;
                case 'Champions League':
                    ret = (penalty.round > 6 && penalty.round < 9);
                    break;
                case 'Europa League':
                    ret = (penalty.round > 0);
                    break;
                case 'Intertoto':
                    ret = (penalty.round > 0);
                    break;
                case 'Supercopa de Clubes':
                case 'Supercopa de Europa':
                    break;
        }

        return ret;
    }

    
    private updateYellowCount(action) {
        let updated = false;
        let isPenalty = false;
        this.yellowCardsCount.forEach( (value) => {
            if (value.tournament == this.getTournamentByMatch(action.matchID) && value.playerID == action.player && value.playerID > 0) {
                value.quantity += 1;
                updated = true;
                if (value.quantity % 2 == 0) {
                    isPenalty = true;
                }
            }
        });
        if (!updated && action.player > 0) {
            this.yellowCardsCount.push({playerID: action.player, tournament: this.getTournamentByMatch(action.matchID), quantity: 1});
        }
        return isPenalty;
    }

    private getPenalty(action) {
        switch (this.getTournamentById(this.getTournamentByMatch(action.matchID)).name) {
            case 'Primera':
            case 'Segunda':
                return this.getPenaltyAmount(action, this.getTournamentById(this.getTournamentByMatch(action.matchID)).name, 3);
            case 'Copa':
            case 'Champions League':
            case 'Europa League':
            case 'Intertoto':
                return this.getPenaltyAmount(action, this.getTournamentById(this.getTournamentByMatch(action.matchID)).name, 1);
            case 'Supercopa de Clubes':
            case 'Supercopa de Europa':
                return [{ teamFor: null, teamAgainst: null, player: null, round: 0, cause: '' }];
        }
        
        return action;
    }

    private getPenaltyAmount(action, tournamentName, amountTo) {
        let roundTo = 0;
        if ((tournamentName == 'Primera' || tournamentName == 'Segunda') && parseInt(this.getMatchById(action.matchID).round) == 4) {
            roundTo = 8;
        } else if (tournamentName == 'Champions League' && parseInt(this.getMatchById(action.matchID).round) < 7) {
            roundTo = 7;
        }else if (tournamentName != 'Primera' && tournamentName != 'Segunda' && parseInt(this.getMatchById(action.matchID).round) % 2 != 0) {
            roundTo = parseInt(this.getMatchById(action.matchID).round) + 2;
        } else {
            roundTo = parseInt(this.getMatchById(action.matchID).round) + amountTo;
        }
        switch (action.type) {
            case 'Y': 
                    return this.correctPenalty([{ tournament: tournamentName, teamFor: this.getPlayerById(action.player).teamID, teamAgainst: this.getRival(action, roundTo), player: action.player, round: roundTo, cause: 'Amarillas'}]);
            case 'R': 
                    return this.correctPenalty([{ tournament: tournamentName, teamFor: this.getPlayerById(action.player).teamID, teamAgainst: this.getRival(action, roundTo), player: action.player, round: roundTo, cause: 'Roja'},
                            { tournament: tournamentName, teamFor: this.getPlayerById(action.player).teamID, teamAgainst: this.getRival(action, roundTo + 1), player: action.player, round: roundTo + 1, cause: 'Roja'}]);
            case 'I': 
                    return this.correctPenalty([{ tournament: tournamentName, teamFor: this.getPlayerById(action.player).teamID, teamAgainst: this.getRival(action, roundTo), player: action.player, round: roundTo, cause: 'Lesión'}]);
        }
    }

    private getLowerTournament(tournament) {
        switch (tournament) {
            case 'Champions League': return 'Europa League';
            case 'Europa League': return 'Intertoto';
            case 'Intertoto':
            case 'Copa':
                return 'NO APLICA';
        }
    }

    private correctPenalty(actions) {
        for (let i = 0; i < actions.length; i++) {
            if (actions[i].teamAgainst == -1) {
                actions[i].tournament = this.getLowerTournament(actions[i].tournament);
                if (actions[i].tournament == 'NO APLICA') {
                    actions.splice(i, 1);
                    i--;
                } else {
                    actions[i].teamAgainst = this.getRival(actions[i], 1);
                    actions[i].round = 1;
                }
            }
        }
        return actions;
    }

    private getLastEdition(league) {
        let lastEdition = -1;
        for (let i = 0; i < this.tournaments.length; i++) {
            if (this.tournaments[i].name == league) {
                lastEdition = this.tournaments[i].id;
            }
        }
        return lastEdition;
    }

    private getRival(action, round) {
        let teamFor = this.getPlayerById(action.player).teamID;
        let tournament = this.getTournamentByMatch(action.matchID);
        if (tournament == null) {
            tournament = this.getLastEdition(action.tournament);
        }
        let teamToReturn = 0;
        let passRound = -1;
        this.matches.forEach( (value) => {
            if (value.tournament == tournament && value.round == round) {
                if (passRound == -1) { passRound = 0; }
                if (value.local == teamFor) {
                    teamToReturn = value.away;
                    passRound = 1;
                } else if(value.away == teamFor) {
                    teamToReturn = value.local;
                    passRound = 1;
                }
            }
        });
        if (passRound == 0) { teamToReturn = -1; }
        return teamToReturn;
    }

    public getTournamentByMatch(match) {
        let tournamentToReturn = null;
        this.matches.forEach( (value) => {
            if (value.id == match) {
                tournamentToReturn = value.tournament
            }
        });
        return tournamentToReturn;
    }

    public getMatchById(match) {
        let matchToReturn = null;
        this.matches.forEach( (value) => {
            if (value.id == match) {
                matchToReturn = value;
            }
        });
        return matchToReturn;
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

    public getTournamentById(tournament) {
        let tournamentToReturn = null;
        this.tournaments.forEach( (value) => {
            if (value.id == tournament) {
                tournamentToReturn = value;
            }
        });
        return tournamentToReturn;
    }

    public getPlayerById(player) {
        let playerToReturn = null;
        this.players.forEach( (value) => {
            if (value.id == player) {
                playerToReturn = value;
            }
        });
        return playerToReturn;
    }

    private setTableConfig() {
        this.tableData1 = {
            headerRow: [ 'teamFor', 'player', 'cause', 'round', 'teamAgainst'],
            dataRows: []
        };
    }

    public getRoundName(tournament, round) {
        switch (tournament) {
            case 'Primera':
            case 'Segunda':
                return round;
            case 'Copa':
                if (round < 3) { return 'Octavos de Final'; }
                else if (round >= 3 && round < 5) { return 'Cuartos de Final'; }
                else if (round >= 5 && round < 7) { return 'Semifinales'; }
                else if (round == 8) { return 'Tercer y Cuarto Puesto'; }
                else if (round == 9) { return 'Final'; }
                break;
            case 'Champions League':
                if (round < 7) { return 'Fase de Grupos'; }
                else if (round >= 7 && round < 9) { return 'Cuartos de Final'; }
                else if (round >= 9 && round < 11) { return 'Semifinales'; }
                else if (round == 11) { return 'Tercer y Cuarto Puesto'; }
                else if (round == 12) { return 'Final'; }
                break;
            case 'Europa League':
                if (round < 3) { return 'Cuartos de Final'; }
                else if (round >= 3 && round < 5) { return 'Semifinales'; }
                else if (round == 5) { return 'Tercer y Cuarto Puesto'; }
                else if (round == 6) { return 'Final'; }
                break;
            case 'Intertoto':
                if (round < 3) { return 'Semifinales'; }
                else if (round == 3) { return 'Tercer y Cuarto Puesto'; }
                else if (round == 4) { return 'Final'; }
                break;
            case 'Supercopa de Clubes':
            case 'Supercopa Europea': 
                if (round == 1) { return 'Final'; } break;
        }
    }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppService } from 'app/app.service';

export interface OfferData {
    player: any;
    oldTeam: any;
    buyerTeam: any;
    amount: any;
    signinType: any;
    players: PlayerOfferedData[];
}

export interface PlayerOfferedData {
    player: any;
    originTeam: any;
    newTeam: any;
}

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

const PHPFILENAME = './test_CMDataRequesting.php';

@Component({
    selector: 'adminpage',
    moduleId: module.id,
    templateUrl: 'adminpage.component.html'
})

export class AdminPageComponent implements OnInit{

    public offer: OfferData;
    public matchToAdd;
    public prizes;
    public teamSalaries: TableData;
    public salaryData;
    public tournamentToReset;
    public tournamentToCreate;
    public tournamentToRandomize;
    public matchToResolve;
    public showModule;
    public suggestionsTable;
    public adminMatchesTable;
    public insertMatch;
    public insertPlayer;
    public showNewRound = false;
    public showMatchToResolve;

    constructor(private http: Http, private appService: AppService) {
        this.resetView();
        this.appService.getPlayers();
        this.appService.getTeams();
        this.appService.getTournaments();
        this.appService.getSuggestions();
        this.appService.getSignins();
    }

    ngOnInit() {
        this.appService.getSigninsObservable().subscribe( (response2) => {
            this.appService.data.signins = response2.json().signins;    
            this.appService.getMatchesObservable().subscribe( (response) => {
                this.appService.data.matches = response.json().matches;
                this.matchToAdd = {
                    local: -1,
                    away: -1,
                    tournament: -1,
                    round: -1
                };
                this.prizes = {
                    first: -1,
                    second: -1,
                    third: -1,
                    fourth: -1,
                    fifth: -1,
                    sixth: -1,
                    seventh: -1,
                    eight: -1
                };
                this.getTotalSalaries();
                this.getSuggestions();
                this.setUndisputedMatches();
            });
        });
    }

    public addPlayer() {
        this.http.post(PHPFILENAME, {type: 'newPla', name: this.appService.removeAccents(this.insertPlayer.name), salary: (parseFloat(this.insertPlayer.overage)/100).toFixed(2), position: this.insertPlayer.position, overage: this.insertPlayer.overage, team: this.insertPlayer.team.id}).subscribe( (response) => {
            if(response.json().success) {
                this.appService.insertLog({logType: this.appService.config.logTypes.createPlayer, logInfo: 'Creado jugador ' + this.insertPlayer.name + ' (ID '+ response.json().newID + ')'});
                this.resetNewPlayer();
                alert(response.json().message);
            }
        });
    }

    public createTournament() {
        const edition = parseInt(this.appService.getLastEdition(this.tournamentToCreate).edition) + 1;
        this.http.post(PHPFILENAME, {type: 'insTou', name: this.tournamentToCreate, edition: edition}).subscribe( (response) => {
            if(response.json().success) { 
                this.appService.insertLog({logType: this.appService.config.logTypes.createTournament, logInfo: 'Creado ' + this.tournamentToCreate + ' edición ' + edition });
                this.appService.getTournaments();
                alert('Creado ' + this.tournamentToCreate + ' edición ' + edition);
            }
        });
    }

    public discountSalaries() {
        this.salaryData.forEach( (value) => {
            this.http.post(PHPFILENAME, {type: 'chaSal', amount: value.salaries, id: value.team}).subscribe( (response) => {
                if(response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.salariesDiscounted, logInfo: 'Salarios descontados de ' + this.appService.getTeamById(value.team).name });
                }
            });
        });
        alert('Salarios descontados');
    }

    public getSuggestions() {
        this.suggestionsTable = this.appService.getTableConfig(this.appService.config.tableHeaders.suggestions, this.appService.data.adminData.suggestions);
    }

    public getTotalSalaries() {
        this.salaryData = this.appService.data.teams.map( (value) => {
            return { team: value.id, salaries: this.getTotalSalariesByTeam(value.id) };
        });
        this.teamSalaries = this.appService.getTableConfig(this.appService.config.tableHeaders.adminSalaries, this.salaryData);
    }

    public getTotalSalariesByTeam(team) {
        let playerToBe = this.appService.getPlayersByTeam(team);
        let total = 0;
        playerToBe.forEach( (value) => {
            if(value.cedido == 0) {
                total += parseFloat(value.salary);
            }
        });
        return Math.round(total * 100) / 100;
    }

    public insertNewMatch() {
        if (!this.insertMatch) { return; }
        this.http.post(PHPFILENAME, {type: 'insMat', local: this.insertMatch.local.id, away: this.insertMatch.away.id, tournament: this.insertMatch.tournament.id, round: this.insertMatch.round}).subscribe( (response) => {
            if (response.json().success) {
                this.resetNewMatch();
                this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + this.insertMatch.tournament.name + ' - ' + this.insertMatch.local.name + ' - ' + this.insertMatch.away.name});
                alert('Partido creado');
            }
        });
    }

    private randomGeneralCupDraw(tournament) {
        let teamsSecond = this.appService.data.teams;
        let teamsFirst = [];
        while(teamsFirst.length < 8) {
            teamsFirst.push(teamsSecond.splice(Math.floor(Math.random() * teamsSecond.length), 1)[0]);
        }
        while(teamsFirst.length > 0) {
            const local = teamsFirst.splice(Math.floor(Math.random() * teamsFirst.length), 1);
            const away = teamsFirst.splice(Math.floor(Math.random() * teamsFirst.length), 1);
            this.http.post(PHPFILENAME, {type: 'insMat', local: local[0].id, away: away[0].id, tournament: tournament.id, round: 1}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                }
            });
        }
        while(teamsSecond.length > 0) {
            const local = teamsSecond.splice(Math.floor(Math.random() * teamsSecond.length), 1);
            const away = teamsSecond.length > 4  ? teamsSecond.splice(Math.floor(Math.random() * teamsSecond.length), 1) : [{id: 0}];
            this.http.post(PHPFILENAME, {type: 'insMat', local: local[0].id, away: away[0].id, tournament: tournament.id, round: 2}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                }
            });
        }
    }

    public randomDraw() {
        switch (this.tournamentToRandomize.name) {
            case this.appService.config.tournamentGeneralInfo.copa.name: this.randomGeneralCupDraw(this.tournamentToRandomize);
        }
    }

    public recalculateStandings() {
        this.http.post(PHPFILENAME, {type: 'resSta', tournament: this.tournamentToReset.id}).subscribe( (response) => {
            if(response.json().success) {
                this.appService.data.matches.forEach( (value) => {
                    if(value.tournament == this.tournamentToReset.id && value.localGoals != -1) {
                        let local = {points: 0, won: 0, draw: 0, lost: 0, nonPlayed: 0};
                        let away = {points: 0, won: 0, draw: 0, lost: 0, nonPlayed: 0};
                        if ((parseInt(value.localGoals) > parseInt(value.awayGoals)) || (parseInt(value.awayGoals) == -2 && parseInt(value.localGoals) != -2)) {
                            local.points = 3;
                            local.won = 1;
                            if(parseInt(value.awayGoals) == -2) {
                                away.nonPlayed = 1;
                            }else {
                                away.lost = 1;
                            }
                        }else if ((parseInt(value.localGoals) < parseInt(value.awayGoals)) || (parseInt(value.localGoals) == -2 && parseInt(value.awayGoals) != -2)) {
                            away.points = 3;
                            away.won = 1;
                            if(parseInt(value.localGoals) == -2) {
                                local.nonPlayed = 1;
                            }else {
                                local.lost = 1;
                            }
                        } else if(parseInt(value.localGoals) == -2 && parseInt(value.awayGoals) == -2) {
                            local.nonPlayed = 1;
                            away.nonPlayed = 1;
                        } else {
                            local.points = 1;
                            away.points = 1;
                            local.draw = 1;
                            away.draw = 1;
                        }
                        if(parseInt(value.localGoals) == -2) { value.localGoals = "0"; }
                        if(parseInt(value.awayGoals) == -2) { value.awayGoals = "0"; }
                        this.http.post(PHPFILENAME, {type: 'updSta', points: local.points, won: local.won, draw: local.draw, lost: local.lost, nonPlayed: local.nonPlayed, goalsFor: parseInt(value.localGoals), goalsAgainst: parseInt(value.awayGoals), tournamentID: value.tournament, team: value.local}).subscribe( () => {});
                        this.http.post(PHPFILENAME, {type: 'updSta', points: away.points, won: away.won, draw: away.draw, lost: away.lost, nonPlayed: away.nonPlayed, goalsFor: parseInt(value.awayGoals), goalsAgainst: parseInt(value.localGoals), tournamentID: value.tournament, team: value.away}).subscribe( () => {});
                    }
                });
                this.appService.insertLog({logType: this.appService.config.logTypes.resetStandings, logInfo: 'Clasificación reseteada en ' + this.tournamentToReset.name + ' (ID ' + this.tournamentToReset.id + ')'});
                alert('Reinicio realizado');
            }
        });
    }

    public resetAllSalaries() {
        if(confirm('¿Seguro que quieres resetear todos los salarios?')) {
            this.appService.resetAllSalaries();
            this.appService.insertLog({logType: this.appService.config.logTypes.resetAllSalaries, logInfo: 'Todos los salarios reseteados'});
        }
    }

    public resetMatchToResolve() {
        this.matchToResolve = undefined;
        this.showMatchToResolve = false;
    }

    public resetNewMatch() {
        this.insertMatch = {
            tournament: undefined,
            round: undefined,
            local: undefined,
            away: undefined
        };
        this.showNewRound = false;
    }

    public resetNewPlayer() {
        this.insertPlayer = {
            name: undefined,
            salary: undefined,
            position: undefined,
            overage: undefined,
            team: undefined
        };
    }

    public resetView() {
        this.showModule = {
            changeSeasonslot: false,
            createTournament: false,
            discountSalaries: false,
            editMatch: false,
            insertMatch: false,
            insertPlayer: false,
            nonPlayed: false,
            randomize: false,
            recalculateStandings: false,
            showPendingMatches: false,
            suggestions: false
        };
        this.resetNewMatch();
        this.resetNewPlayer();
        this.resetMatchToResolve();
    }

    public resolveMatchNonPlayed(resolution) {
        let local = {
            score: 0,
            scorers: [],
            assistants: [],
            yellowCards: [],
            redCards: [],
            injuries: [],
            mvp: []
        };
        let away = {
            score: 0,
            scorers: [],
            assistants: [],
            yellowCards: [],
            redCards: [],
            injuries: [],
            mvp: []
        };
        switch (resolution) {
            case 1: local.score = -2;
                break;
            case 2: local.score = -2;
                    away.score = -2;
                break;
            case 3: away.score = -2;
                break;
        }
        this.appService.sendMatchInfo(this.matchToResolve, local, away);
        this.resetView();
    }

    public setMatchToResolve() {
        this.showMatchToResolve = false;
        this.showMatchToResolve = true;
    }

    public setNewMatchRound() {
        this.showNewRound = false;
        this.showNewRound = true;
    }

    public setNewRound(tournament) {
        return this.appService.config.roundSetter.filter( (roundSet) => {
            return roundSet.name == tournament.name;
        })[0].round;
    }

    public setPendingEmblems() {
        this.appService.data.teams.forEach( (team) => {
            const playersOfTheTeam = this.appService.getPlayersByTeam(team.id);
            let lines = {
                goalkeeper: [],
                defense: [],
                midfield: [],
                striker: []
            };
            playersOfTheTeam.forEach( (player) => {
                if(this.appService.config.fieldLines.goalkeeper.find( (position) => { return player.position == position; }) != undefined) { lines.goalkeeper.push(player); }
                else if(this.appService.config.fieldLines.defense.find( (position) => { return player.position == position; }) != undefined) { lines.defense.push(player); }
                else if(this.appService.config.fieldLines.midfield.find( (position) => { return player.position == position; }) != undefined) { lines.midfield.push(player); }
                else if(this.appService.config.fieldLines.striker.find( (position) => { return player.position == position; }) != undefined) { lines.striker.push(player); }
            });
            let emblemSet = false;
            let maxPlayer = { id: undefined, overage: '0', name: '' };
            lines.goalkeeper.forEach( (player) => {
                if(parseInt(player.emblem) == 1) { emblemSet = true; }
                if(parseInt(player.overage) > parseInt(maxPlayer.overage)) {
                    maxPlayer = player;
                }
            });
            if(!emblemSet && maxPlayer.id != undefined) {
                this.http.post(PHPFILENAME, {type: 'hacEmb', player: maxPlayer.id}).subscribe( (response) => {
                    if(response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.setEmblem, logInfo: 'Nuevo emblema: ' + maxPlayer.name});
                    }
                });
            }
            emblemSet = false;
            maxPlayer = { id: undefined, overage: '0', name: '' };
            lines.defense.forEach( (player) => {
                if(parseInt(player.emblem) == 1) { emblemSet = true; }
                if(parseInt(player.overage) > parseInt(maxPlayer.overage)) {
                    maxPlayer = player;
                }
            });
            if(!emblemSet && maxPlayer.id != undefined) {
                this.http.post(PHPFILENAME, {type: 'hacEmb', player: maxPlayer.id}).subscribe( (response) => {
                    if(response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.setEmblem, logInfo: 'Nuevo emblema: ' + maxPlayer.name});
                    }
                });
            }
            emblemSet = false;
            maxPlayer = { id: undefined, overage: '0', name: '' };
            lines.midfield.forEach( (player) => {
                if(parseInt(player.emblem) == 1) { emblemSet = true; }
                if(parseInt(player.overage) > parseInt(maxPlayer.overage)) {
                    maxPlayer = player;
                }
            });
            if(!emblemSet && maxPlayer.id != undefined) {
                this.http.post(PHPFILENAME, {type: 'hacEmb', player: maxPlayer.id}).subscribe( (response) => {
                    if(response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.setEmblem, logInfo: 'Nuevo emblema: ' + maxPlayer.name});
                    }
                });
            }
            emblemSet = false;
            maxPlayer = { id: undefined, overage: '0', name: '' };
            lines.striker.forEach( (player) => {
                if(parseInt(player.emblem) == 1) { emblemSet = true; }
                if(parseInt(player.overage) > parseInt(maxPlayer.overage)) {
                    maxPlayer = player;
                }
            });
            if(!emblemSet && maxPlayer.id != undefined) {
                this.http.post(PHPFILENAME, {type: 'hacEmb', player: maxPlayer.id}).subscribe( (response) => {
                    if(response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.setEmblem, logInfo: 'Nuevo emblema: ' + maxPlayer.name});
                    }
                });
            }
        });
        alert('Hecho');
    }

    private setUndisputedMatches() {
        const finalTableMatches = this.appService.data.matches.filter( (filteredMatch) => {
            return filteredMatch.localGoals == "-1" && filteredMatch.awayGoals == "-1";
        })
        .map( (value) => {
            value.filling = false;
            return value;
        });
        this.adminMatchesTable = this.appService.getTableConfig(this.appService.config.tableHeaders.adminmatches, finalTableMatches);
    }
}

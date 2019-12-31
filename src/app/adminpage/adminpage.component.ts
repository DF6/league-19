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
    public matches;
    public tournamentToReset;
    public tournamentToCreate;
    public showModule;
    public suggestionsTable;
    public insertMatch;
    public showNewRound = false;

    constructor(private http: Http, private appService: AppService) {
        this.resetView();
        this.appService.getPlayers();
        this.appService.getTeams();
        this.appService.getTournaments();
        this.appService.getSuggestions();
    }

    ngOnInit() {
        this.appService.getMatchesObservable().subscribe( (response) => {
            this.matches = response.json().matches;
            this.tournamentToReset = this.appService.getLastEdition(this.appService.data.tournaments[0].name).id;
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
            this.http.post(PHPFILENAME, {type: 'chaSal', amount: value.salaries, id: value.team}).subscribe( () => {}, (error) => {
                alert('Error al descontar salarios de ' + this.appService.getTeamById(value.team) + ': ' + error);
            });
        });
        alert('Terminado');
    }

    public getSuggestions() {
        this.suggestionsTable = this.appService.getTableConfig(this.appService.config.tableHeaders.suggestions, this.appService.data.adminData.suggestions);
    }

    public getTotalSalaries() {
        this.salaryData = this.appService.data.teams.map( (value) => {
            return { team: value.id, salaries: this.getTotalSalariesByTeam(value.id) };
        });
        this.appService.getTableConfig(this.appService.config.tableHeaders.adminSalaries, this.salaryData);
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
                this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado'});
                alert('Partido creado');
            }
        });
    }

    public recalculateStandings() {
        this.http.post(PHPFILENAME, {type: 'resSta', tournament: this.tournamentToReset.id}).subscribe( (response) => {
            if(response.json().success) {
                this.matches.forEach( (value) => {
                    if(value.tournament == this.tournamentToReset.id && value.localGoals != -1) {
                        let local = {points: 0, won: 0, draw: 0, lost: 0};
                        let away = {points: 0, won: 0, draw: 0, lost: 0};
                        if (parseInt(value.localGoals) > parseInt(value.awayGoals)) {
                            local.points = 3;
                            local.won = 1;
                            away.lost = 1;
                        }else if (parseInt(value.localGoals) < parseInt(value.awayGoals)) {
                            away.points = 3;
                            away.won = 1;
                            local.lost = 1;
                        } else {
                            local.points = 1;
                            away.points = 1;
                            local.draw = 1;
                            away.draw = 1;
                        }
                        this.http.post(PHPFILENAME, {type: 'updSta', points: local.points, won: local.won, draw: local.draw, lost: local.lost, goalsFor: parseInt(value.localGoals), goalsAgainst: parseInt(value.awayGoals), tournamentID: value.tournament, team: value.local}).subscribe( () => {});
                        this.http.post(PHPFILENAME, {type: 'updSta', points: away.points, won: away.won, draw: away.draw, lost: away.lost, goalsFor: parseInt(value.awayGoals), goalsAgainst: parseInt(value.localGoals), tournamentID: value.tournament, team: value.away}).subscribe( () => {});
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

    public resetNewMatch() {
        this.insertMatch = {
            tournament: undefined,
            round: undefined,
            local: undefined,
            away: undefined
        };
        this.showNewRound = false;
    }

    public resetView() {
        this.showModule = {
            changeSeasonslot: false,
            createTournament: false,
            discountSalaries: false,
            editMatch: false,
            insertMatch: false,
            recalculateStandings: false,
            suggestions: false
        };
        this.resetNewMatch();
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
}

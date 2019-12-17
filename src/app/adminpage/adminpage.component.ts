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

    constructor(private http: Http, private appService: AppService){
        this.appService.getPlayers();
        this.appService.getTeams();
        this.appService.getTournaments();
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
        });
    }

    public discountSalaries() {
        this.salaryData.forEach( (value) => {
            this.http.post('./test_CMDataRequesting.php', {type: 'chaSal', amount: value.salaries, id: value.team}).subscribe( () => {}, (error) => {
                alert('Error al descontar salarios de ' + this.appService.getTeamById(value.team) + ': ' + error);
            });
        });
        alert('Terminado');
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

    public recalculateStandings() {
        this.http.post('./CMDataRequesting.php', {type: 'resSta', tournament: this.tournamentToReset.id}).subscribe( (response) => {
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
                        this.http.post('./CMDataRequesting.php', {type: 'updSta', points: local.points, won: local.won, draw: local.draw, lost: local.lost, goalsFor: parseInt(value.localGoals), goalsAgainst: parseInt(value.awayGoals), tournamentID: value.tournament, team: value.local}).subscribe( () => {});
                        this.http.post('./CMDataRequesting.php', {type: 'updSta', points: away.points, won: away.won, draw: away.draw, lost: away.lost, goalsFor: parseInt(value.awayGoals), goalsAgainst: parseInt(value.localGoals), tournamentID: value.tournament, team: value.away}).subscribe( () => {});
                    }
                });
                this.appService.insertLog({logType: this.appService.config.logTypes.resetStandings, logInfo: 'Clasificación reseteada en ' + this.tournamentToReset.name + ' (ID ' + this.tournamentToReset.id + ')'});
                alert('Reinicio realizado');
            }
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

const PHPFILENAME = './test_CMDataRequesting.php';

@Component({
    selector: 'privileges',
    moduleId: module.id,
    templateUrl: 'privileges.component.html'
})

export class PrivilegesComponent implements OnInit{

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
            });
        });
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
    }

}

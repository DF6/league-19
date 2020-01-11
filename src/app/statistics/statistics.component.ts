import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'statistics-cmp',
    moduleId: module.id,
    templateUrl: 'statistics.component.html'
})

export class StatisticsComponent implements OnInit{
    public scorers: TableData;
    public assistants: TableData;
    public yellowCards: TableData;
    public redCards: TableData;
    public injuries: TableData;
    public mvp: TableData;
    public actualTournament: any;

    constructor(private appService: AppService){
        this.appService.getTournaments();
        this.appService.getTeams();
        this.appService.getPlayers();
        this.appService.getMatches();
    }

    ngOnInit() {
        this.appService.getActionsObservable().subscribe( (response) => {
            this.appService.data.actions = response.json().actions;
            this.appService.data.tournaments = this.appService.data.tournaments.filter( (filteredTournament) => {
                return filteredTournament.edition == this.appService.getLastEdition(filteredTournament.name).edition && filteredTournament.name != this.appService.config.tournamentGeneralInfo.nationsLeague.name
            });
            this.actualTournament = this.appService.data.tournaments[0];
            this.fillTables();
        });
    }

    private fillTables(e?) {
        let tournamentToFill;
        e ? tournamentToFill = e : tournamentToFill = this.actualTournament;
        if(this.scorers) {this.scorers.dataRows = []; }
        if(this.assistants) {this.assistants.dataRows = []; }
        if(this.yellowCards) {this.yellowCards.dataRows = []; }
        if(this.redCards) {this.redCards.dataRows = []; }
        if(this.injuries) {this.injuries.dataRows = []; }
        if(this.mvp) {this.mvp.dataRows = []; }
        let data = {
            scorers: [],
            assistants: [],
            yellowCards: [],
            redCards: [],
            injuries: [],
            mvps: []
        };

        this.appService.data.actions.filter( (filteredAction) => {
            return this.appService.getMatchById(filteredAction.matchID).tournament == tournamentToFill.id;
        })
        .forEach( (value) => {
            switch (value.type) {
                case this.appService.config.actionTypes.goal: data.scorers = this.updateStandings(value, data.scorers);
                        break;
                case this.appService.config.actionTypes.assist: data.assistants = this.updateStandings(value, data.assistants);
                        break;
                case this.appService.config.actionTypes.yellowCard: data.yellowCards = this.updateStandings(value, data.yellowCards);
                        break;
                case this.appService.config.actionTypes.redCard: data.redCards = this.updateStandings(value, data.redCards);
                        break;
                case this.appService.config.actionTypes.injury: data.injuries = this.updateStandings(value, data.injuries);
                        break;
                case this.appService.config.actionTypes.mvp: data.mvps = this.updateStandings(value, data.mvps);
                        break;
            }
        });
        this.scorers = this.appService.getTableConfig(this.appService.config.tableHeaders.statistics.scorers, this.orderStandings(data.scorers));
        this.assistants = this.appService.getTableConfig(this.appService.config.tableHeaders.statistics.assistants, this.orderStandings(data.assistants));
        this.yellowCards = this.appService.getTableConfig(this.appService.config.tableHeaders.statistics.yellowCards, this.orderStandings(data.yellowCards));
        this.redCards = this.appService.getTableConfig(this.appService.config.tableHeaders.statistics.redCards, this.orderStandings(data.redCards));
        this.injuries = this.appService.getTableConfig(this.appService.config.tableHeaders.statistics.injuries, this.orderStandings(data.injuries));
        this.mvp = this.appService.getTableConfig(this.appService.config.tableHeaders.statistics.mvp, this.orderStandings(data.mvps));
    }

    private orderStandings(standing) {

        let position = 1;
        let pStands = [];
        while(standing.length != 0) {
            let indexToInsert = -1;
            let max = -1;
            standing.forEach( (value, key) => {
                if (value.quantity > max) {
                    indexToInsert = key;
                    max = value.quantity;
                }
            });
            let playerToInsert = standing.splice(indexToInsert, 1);
            if (pStands.length != 0 && pStands[pStands.length - 1].quantity == playerToInsert[0].quantity) {
                playerToInsert[0].position = pStands[pStands.length - 1].position;
            } else {
                playerToInsert[0].position = position;
                position++;
            }
            pStands.push(playerToInsert[0]);
        }
        return pStands;
    }

    private updateStandings(action, data) {
        data = data.filter( (filteredData) => {
            return filteredData.playerID == action.player && filteredData.playerID > 0; 
        })
        .map.forEach( (value) => {
            value.quantity += 1;
        });
        if (action.player > 0) {
            const teamShortName = this.appService.getPlayerById(action.player).teamID != 0 ? this.appService.getTeamById(this.appService.getPlayerById(action.player).teamID).shortName : 'LIB';
            data.push({position: -1, team: teamShortName, playerID: action.player, name: this.appService.getPlayerById(action.player).name, quantity: 1});
        }
        return data;
    }
}

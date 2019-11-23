import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

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
    public tournaments: any[];
    public teams: any[];
    public players: any[];
    public matches: any[];
    public actionsArray;
    public season;

    constructor(private http: Http){}

    ngOnInit() {
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        let finalTournaments = [];
        this.tournaments.forEach( (value) => {
            if(value.edition == this.getLastEdition(value.name) && value.name != 'Nations League') {
                finalTournaments.push(value);
            }
        });
        this.tournaments = finalTournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.http.post('./test_CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
            this.players = response.json().players;
            this.players.forEach( (value) => {
                while (value.name.indexOf('/n') != -1) {
                  value.name = value.name.replace('/n', 'ñ');
                }
            });
            this.actualTournament = this.tournaments[0];
            this.setTableConfig();
            this.http.post('./test_CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
                this.matches = response.json().matches;
                this.http.post('./test_CMDataRequesting.php', {type: 'recDat', dataType: 'A'}).subscribe( (response) => {
                    this.actionsArray = response.json().actions;
                    this.fillTables();
                });
            });
        });
        
    }

    private getLastEdition(league) {
        let lastEdition = -1;
        for (let i = 0; i < this.tournaments.length; i++) {
            if (this.tournaments[i].name == league) {
                lastEdition = this.tournaments[i].edition;
            }
        }
        return lastEdition;
    }

    private fillTables(e?) {
        let tournamentToFill;
        e ? tournamentToFill = e : tournamentToFill = this.actualTournament;
        this.scorers.dataRows = [];
        this.assistants.dataRows = [];
        this.yellowCards.dataRows = [];
        this.redCards.dataRows = [];
        this.injuries.dataRows = [];
        this.mvp.dataRows = [];
        let data = {
            scorers: [],
            assistants: [],
            yellowCards: [],
            redCards: [],
            injuries: [],
            mvps: []
        };

        this.actionsArray.forEach( (value) => {
            if (this.getMatchById(value.matchID).tournament == tournamentToFill.id) {
                switch (value.type) {
                    case 'G': data.scorers = this.updateStandings(value, data.scorers);
                            break;
                    case 'A': data.assistants = this.updateStandings(value, data.assistants);
                            break;
                    case 'Y': data.yellowCards = this.updateStandings(value, data.yellowCards);
                            break;
                    case 'R': data.redCards = this.updateStandings(value, data.redCards);
                            break;
                    case 'I': data.injuries = this.updateStandings(value, data.injuries);
                            break;
                    case 'M': data.mvps = this.updateStandings(value, data.mvps);
                            break;
                }
            }
        });
        this.scorers.dataRows = this.orderStandings(data.scorers);
        this.assistants.dataRows = this.orderStandings(data.assistants);
        this.yellowCards.dataRows = this.orderStandings(data.yellowCards);
        this.redCards.dataRows = this.orderStandings(data.redCards);
        this.injuries.dataRows = this.orderStandings(data.injuries);
        this.mvp.dataRows = this.orderStandings(data.mvps);
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
        let updated = false;
        data.forEach( (value) => {
            if (value.playerID == action.player && value.playerID > 0) {
                value.quantity += 1;
                updated = true;
            }
        });
        if (!updated && action.player > 0) {
            const tt = this.getPlayerById(action.player).teamID !=0 ? this.getTeamById(this.getPlayerById(action.player).teamID).shortName : 'LIB';
            data.push({position: -1, team: tt, playerID: action.player, name: this.getPlayerById(action.player).name, quantity: 1});
        }
        return data;
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

    public getMatchById(match) {
        let matchToReturn = null;
        this.matches.forEach( (value) => {
            if (value.id == match) {
                matchToReturn = value;
            }
        });
        return matchToReturn;
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
        this.scorers = {
            headerRow: [ 'position', 'name', 'goals'],
            dataRows: []
        };
        this.assistants = {
            headerRow: [ 'position', 'name', 'assistances'],
            dataRows: []
        };
        this.yellowCards = {
            headerRow: [ 'position', 'name', 'yellowCards'],
            dataRows: []
        };
        this.redCards = {
            headerRow: [ 'position', 'name', 'redCards'],
            dataRows: []
        };
        this.injuries = {
            headerRow: [ 'position', 'name', 'injuries'],
            dataRows: []
        };
        this.mvp = {
            headerRow: [ 'position', 'name', 'mvps'],
            dataRows: []
        };
    }
}

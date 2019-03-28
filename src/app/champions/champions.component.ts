import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'champions-cmp',
    moduleId: module.id,
    templateUrl: 'champions.component.html'
})

export class ChampionsComponent implements OnInit{
    public groupA: TableData;
    public groupB: TableData;
    public groupC: TableData;
    public groupD: TableData;
    public uclMatches: TableData;
    public tournaments: any[];
    public teams: any[];
    public standingsArray;
    public season;
    public matches;
    public KOMatches;

    constructor(private http: Http){}

    ngOnInit() {
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.setTableConfig();
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'ST'}).subscribe( (response) => {
            this.standingsArray = response.json().standings;
            const championsLastEdition = this.getLastEdition('Champions League', this.standingsArray[16].tournamentID).toString();
            this.season = this.getTournamentById(championsLastEdition).edition;
            let groupAStandings = [];
            let groupBStandings = [];
            let groupCStandings = [];
            let groupDStandings = [];
            let aStands = [];
            let bStands = [];
            let cStands = [];
            let dStands = [];
            for (let i = 16; i < 32; i++) {
                if (this.standingsArray[i].tournamentID == championsLastEdition) {
                    switch(i) {
                        case 16:
                        case 17:
                        case 18:
                        case 19:
                            groupAStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).name,
                                parseInt(this.standingsArray[i].round),
                                parseInt(this.standingsArray[i].won),
                                parseInt(this.standingsArray[i].draw),
                                parseInt(this.standingsArray[i].lost),
                                parseInt(this.standingsArray[i].goalsFor),
                                parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].goalsFor) - parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].points)
                            ]);
                            break;
                        case 20:
                        case 21:
                        case 22:
                        case 23:
                            groupBStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).name,
                                parseInt(this.standingsArray[i].round),
                                parseInt(this.standingsArray[i].won),
                                parseInt(this.standingsArray[i].draw),
                                parseInt(this.standingsArray[i].lost),
                                parseInt(this.standingsArray[i].goalsFor),
                                parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].goalsFor) - parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].points)
                            ]);
                            break;
                        case 24:
                        case 25:
                        case 26:
                        case 27:
                            groupCStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).name,
                                parseInt(this.standingsArray[i].round),
                                parseInt(this.standingsArray[i].won),
                                parseInt(this.standingsArray[i].draw),
                                parseInt(this.standingsArray[i].lost),
                                parseInt(this.standingsArray[i].goalsFor),
                                parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].goalsFor) - parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].points)
                            ]);
                        break;
                        case 28:
                        case 29:
                        case 30:
                        case 31:
                            groupDStandings.push([
                                0,
                                this.getTeamById(parseInt(this.standingsArray[i].team)).name,
                                parseInt(this.standingsArray[i].round),
                                parseInt(this.standingsArray[i].won),
                                parseInt(this.standingsArray[i].draw),
                                parseInt(this.standingsArray[i].lost),
                                parseInt(this.standingsArray[i].goalsFor),
                                parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].goalsFor) - parseInt(this.standingsArray[i].goalsAgainst),
                                parseInt(this.standingsArray[i].points)
                            ]);
                            break;
                    }
                    
                }
            }

            let position = 1;
            while(groupAStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupAStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = groupAStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                aStands.push(teamToInsert[0]);
                position++;
            }
            let aux = null;
            for (let i = 0; i < aStands.length; i++) {
                for (let j = 0; j < aStands.length - 1 - i; j++) {
                    if (aStands[j][9] == aStands[j+1][9] && aStands[j][8] < aStands[j+1][8]) {
                        aStands[j][0]++;
                        aStands[j+1][0]--;
                        aux = aStands[j];
                        aStands[j] = aStands[j+1];
                        aStands[j+1] = aux;
                    }
                }
            }
            position = 1;
            while(groupBStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupBStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = groupBStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                bStands.push(teamToInsert[0]);
                position++;
            }
            for (let i = 0; i < bStands.length; i++) {
                for (let j = 0; j < bStands.length - 1 - i; j++) {
                    if (bStands[j][9] == bStands[j+1][9] && bStands[j][8] < bStands[j+1][8]) {
                        bStands[j][0]++;
                        bStands[j+1][0]--;
                        aux = bStands[j];
                        bStands[j] = bStands[j+1];
                        bStands[j+1] = aux;
                    }
                }
            }
            position = 1;
            while(groupCStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupCStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = groupCStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                cStands.push(teamToInsert[0]);
                position++;
            }
            for (let i = 0; i < cStands.length; i++) {
                for (let j = 0; j < cStands.length - 1 - i; j++) {
                    if (cStands[j][9] == cStands[j+1][9] && cStands[j][8] < cStands[j+1][8]) {
                        cStands[j][0]++;
                        cStands[j+1][0]--;
                        aux = cStands[j];
                        cStands[j] = cStands[j+1];
                        cStands[j+1] = aux;
                    }
                }
            }
            position = 1;
            while(groupDStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupDStandings.forEach( (value, key) => {
                    if(value[9] > maxPoints) {
                        indexToInsert = key;
                        maxPoints = value[9];
                    }
                });
                let teamToInsert = groupDStandings.splice(indexToInsert, 1);
                teamToInsert[0][0] = position;
                dStands.push(teamToInsert[0]);
                position++;
            }
            for (let i = 0; i < dStands.length; i++) {
                for (let j = 0; j < dStands.length - 1 - i; j++) {
                    if (dStands[j][9] == dStands[j+1][9] && dStands[j][8] < dStands[j+1][8]) {
                        dStands[j][0]++;
                        dStands[j+1][0]--;
                        aux = dStands[j];
                        dStands[j] = dStands[j+1];
                        dStands[j+1] = aux;
                    }
                }
            }
            this.groupA.dataRows = aStands;
            this.groupB.dataRows = bStands;
            this.groupC.dataRows = cStands;
            this.groupD.dataRows = dStands;
            this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
                this.matches = response.json() ? response.json().matches : null;
                sessionStorage.setItem('matches', JSON.stringify({matches: this.matches}));
                let championsMatches = [];
                const championsLastEdition = this.getLastEdition('Champions League', this.standingsArray[16].tournamentID).toString();
                this.matches.forEach( (value) => {
                    if(value.tournament == championsLastEdition) {
                        championsMatches.push(value);
                    }
                });
                this.uclMatches.dataRows = championsMatches;
                this.KOMatches = championsMatches;
            });
        });
    }

    private getLastEdition(league, tournament_id) {
        let lastEdition = -1;
        for (let i = 0; i < this.tournaments.length; i++) {
            if (this.tournaments[i].name == league && tournament_id == this.tournaments[i].id) {
                lastEdition = tournament_id;
            }
        }
        return lastEdition;
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

    public showSummary(match) {
        let matchSummary = this.getMatchById(match);
        let message = this.getTeamById(matchSummary.local).name + ' ' + matchSummary.localGoals + ' - ';
        message += this.getTeamById(matchSummary.away).name + ' ' + matchSummary.awayGoals;
        $.notify({
        	icon: "ti-gift",
        	message: message
        },{
            type: 'success',
            timer: 4000,
            placement: {
                from: 'top',
                align: 'center'
            }
        });
    }

    private setTableConfig() {
        this.groupA = {
            headerRow: [ 'position', 'team', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.groupB = {
            headerRow: [ 'position', 'team', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.groupC = {
            headerRow: [ 'position', 'team', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.groupD = {
            headerRow: [ 'position', 'team', 'round', 'won', 'draw', 'lost', 'goalsFor', 'goalsAgainst', 'goalsDifference', 'points'],
            dataRows: []
        };
        this.uclMatches = {
            headerRow: [ 'round', 'local', 'result', 'away', 'summary'],
            dataRows: []
        };
    }
}

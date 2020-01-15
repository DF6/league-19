import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from 'app/app.service';

declare var $:any;

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'europaleague-cmp',
    moduleId: module.id,
    templateUrl: 'europaleague.component.html'
})

export class EuropaLeagueComponent implements OnInit{

    public groupA: TableData;
    public groupB: TableData;
    public groupC: TableData;
    public groupD: TableData;
    public allMatches: TableData;
    public season;

    constructor(private http: Http, private appService: AppService) {
        this.appService.getTournaments();
        this.appService.getTeams();
    }

    ngOnInit() {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            this.appService.data.matches = response.json().matches;
            this.getMatches();
        });
    }

    private getMatches() {
        let finalTableMatches = [];
        const tournament = this.appService.getLastEdition(this.appService.config.tournamentGeneralInfo.europaLeague.name);
        this.season = tournament.edition;
            
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
            while (groupAStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupAStandings.forEach( (value, key) => {
                    if (value[9] > maxPoints) {
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
                    if (aStands[j][9] == aStands[j + 1][9] && aStands[j][8] < aStands[j + 1][8]) {
                        aStands[j][0]++;
                        aStands[j + 1][0]--;
                        aux = aStands[j];
                        aStands[j] = aStands[j + 1];
                        aStands[j + 1] = aux;
                    }
                }
            }
            position = 1;
            while (groupBStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupBStandings.forEach( (value, key) => {
                    if (value[9] > maxPoints) {
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
                    if (bStands[j][9] == bStands[j + 1][9] && bStands[j][8] < bStands[j + 1][8]) {
                        bStands[j][0]++;
                        bStands[j + 1][0]--;
                        aux = bStands[j];
                        bStands[j] = bStands[j + 1];
                        bStands[j + 1] = aux;
                    }
                }
            }
            position = 1;
            while (groupCStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupCStandings.forEach( (value, key) => {
                    if (value[9] > maxPoints) {
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
                    if (cStands[j][9] == cStands[j + 1][9] && cStands[j][8] < cStands[j + 1][8]) {
                        cStands[j][0]++;
                        cStands[j + 1][0]--;
                        aux = cStands[j];
                        cStands[j] = cStands[j + 1];
                        cStands[j + 1] = aux;
                    }
                }
            }
            position = 1;
            while (groupDStandings.length != 0) {
                let indexToInsert = -1;
                let maxPoints = -1;
                groupDStandings.forEach( (value, key) => {
                    if (value[9] > maxPoints) {
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
                    if (dStands[j][9] == dStands[j + 1][9] && dStands[j][8] < dStands[j + 1][8]) {
                        dStands[j][0]++;
                        dStands[j + 1][0]--;
                        aux = dStands[j];
                        dStands[j] = dStands[j + 1];
                        dStands[j + 1] = aux;
                    }
                }
            }
            this.groupA.dataRows = aStands;
            this.groupB.dataRows = bStands;
            this.groupC.dataRows = cStands;
            this.groupD.dataRows = dStands;
            matchesArray.forEach( (value, key) => {
                if (value.tournament == tournament) {
                    value.filling = false;
                    finalTableMatches.push(value);
                }
            });
            this.matches = finalTableMatches;
    }

    private getLastEdition(league) {
        let lastEdition = -1;
        for (let i = 0; i < this.tournaments.length; i++) {
            if (this.tournaments[i].name == league && lastEdition < this.tournaments[i].edition) {
                lastEdition = this.tournaments[i].edition;
            }
        }
        return lastEdition;
    }

    private getTournamentByEdition(edition) {
        let tournament = -1;
        for (let i = 0; i < this.tournaments.length; i++) {
            if (this.tournaments[i].name == 'Europa League' && edition == this.tournaments[i].edition) {
                tournament = this.tournaments[i].id;
            }
        }
        return tournament;
    }
}

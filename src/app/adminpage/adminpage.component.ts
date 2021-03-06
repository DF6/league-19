import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppService } from 'app/app.service';
import { keyframes } from '@angular/core/src/animation/dsl';

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

const PHPFILENAME = './CMDataRequesting.php';

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
    public matchToEdit;
    public showModule;
    public suggestionsTable;
    public adminMatchesTable;
    public matchesResolvedTable;
    public insertMatch;
    public insertPlayer;
    public showNewRound = false;
    public showMatchToResolve;
    public showMatchToEdit;
    public showEditSection;
    public localEditScore;
    public awayEditScore;

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
                this.setDisputedMatches();
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
            const players = this.appService.getPlayersByTeam(value.team);
            while (value.salaries >= parseFloat(this.appService.getTeamById(value.team).budget)) {
                const maxPlayer = this.appService.getPlayerWithMaximumOverage(players);
                value.salaries -= parseFloat(maxPlayer.salary);
                this.http.post(PHPFILENAME, {type: 'nueSub', player: maxPlayer.id, auctionType: this.appService.config.signinTypes.freeAuction, firstTeam: this.appService.getPlayerById(maxPlayer.id).teamID, amount: this.appService.getAuctionInitialAmount({overage: parseInt(this.appService.getPlayerById(maxPlayer.id).overage), amount: undefined}).amount, market: this.appService.data.constants.marketEdition}).subscribe( (response) => {
                    if (response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.freePlayer, logInfo: 'Jugador liberado: ' + this.appService.getPlayerById(maxPlayer.id).name});
                    }
                });
                players.splice(players.findIndex( (player) => { return player.id == maxPlayer.id;}), 1);
            }
            this.http.post(PHPFILENAME, {type: 'chaSal', amount: value.salaries, id: value.team}).subscribe( (response) => {
                if (response.json().success) {
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
                this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + this.insertMatch.tournament.name + ' - ' + this.insertMatch.local.name + ' - ' + this.insertMatch.away.name});
                this.resetNewMatch();
                alert('Partido creado');
            }
        });
    }

    private randomRoundRobinDraw(tournament) {
        let teams = [];
        if(tournament.name == this.appService.config.tournamentGeneralInfo.primera.name) {
            teams = this.appService.config.tournamentGeneralInfo.primera.seedTeams;
        } else if(tournament.name == this.appService.config.tournamentGeneralInfo.segunda.name) {
            teams = this.appService.config.tournamentGeneralInfo.segunda.seedTeams;
        }

        teams.forEach( (team) => {
            this.http.post(PHPFILENAME, { type: 'insSta', team: team, group: 0, tournament: tournament.id}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertStanding, logInfo: 'Clasificación creada'});
                }
            });
        });

        for (let j = 0; j < teams.length - 1; j += 1) {
            for (let i = 0; i < teams.length / 2; i += 1) {
                if (teams[i] !== -1 && teams[teams.length - 1 - i] !== -1 && j % 2 !== 0) {
                    this.http.post(PHPFILENAME, {type: 'insMat', local: teams[i], away: teams[teams.length - 1 - i], tournament: tournament.id, round: j + 1}).subscribe( (response) => {
                        if (response.json().success) {
                            this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + this.appService.getTeamById(teams[i]).name + ' - ' + this.appService.getTeamById(teams[teams.length - 1 - i]).name});
                        }
                    });
                } else if (teams[i] !== -1 && teams[teams.length - 1 - i] !== -1 && j % 2 === 0) {
                    this.http.post(PHPFILENAME, {type: 'insMat', local: teams[teams.length - 1 -i], away: teams[i], tournament: tournament.id, round: j + 1}).subscribe( (response) => {
                        if (response.json().success) {
                            this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + this.appService.getTeamById(teams[teams.length - 1 - i]).name + ' - ' + this.appService.getTeamById(teams[i]).name});
                        }
                    });
                }
            }
            teams.splice(1, 0, teams.pop());
        }
        alert('Calendario creado');
    }

    private randomGeneralCupDraw(tournament) {
        const already = this.appService.data.matches.filter( (filteredMatch) => { return tournament.id == filteredMatch.tournament;}).length > 0;
        if(!already) {
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
            alert('Primera ronda creada');
        } else {
            let roundMatches = [];
            let roundToDraw = 0;
            for(let i = 1; i < this.appService.config.tournamentGeneralInfo.copa.finalRound - 1; i++) {
                roundMatches = this.appService.data.matches.filter( (filteredMatch) => {
                    return filteredMatch.tournament == tournament.id && filteredMatch.round == i;
                });
                if(roundMatches.length > 0) { roundToDraw = i; }
            }
            if(roundToDraw != 0 && roundToDraw < this.appService.config.tournamentGeneralInfo.copa.finalRound - 2) {
                const roundToDrawMatches = this.appService.data.matches.filter( (filteredMatch) => {
                    return filteredMatch.tournament == tournament.id && parseInt(filteredMatch.round) == roundToDraw;
                });
                let contendants = [];
                roundToDrawMatches.forEach( (match) => {
                    contendants.push(this.appService.whoWon(match));
                });
                while(contendants.length > 0) {
                    const local = contendants.splice(Math.floor(Math.random() * contendants.length), 1);
                    const away = contendants.splice(Math.floor(Math.random() * contendants.length), 1);
                    this.http.post(PHPFILENAME, {type: 'insMat', local: local[0], away: away[0], tournament: tournament.id, round: roundToDraw + 1}).subscribe( (response) => {
                        if (response.json().success) {
                            this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                        }
                    });
                }
            } else if(roundToDraw != 0 && roundToDraw == this.appService.config.tournamentGeneralInfo.copa.finalRound - 2) {
                const roundToDrawMatches = this.appService.data.matches.filter( (filteredMatch) => {
                    return filteredMatch.tournament == tournament.id && parseInt(filteredMatch.round) == roundToDraw;
                });
                let finalists = [];
                let losers = [];
                roundToDrawMatches.forEach( (match) => {
                    finalists.push(this.appService.whoWon(match));
                });
                roundToDrawMatches.forEach( (match2) => {
                    if(finalists.find( (finalist) => { return finalist == match2.local;})) {
                        losers.push(match2.away);
                    } else {
                        losers.push(match2.local);
                    }
                });
                while(losers.length > 0) {
                    const local = losers.splice(Math.floor(Math.random() * losers.length), 1);
                    const away = losers.splice(Math.floor(Math.random() * losers.length), 1);
                    this.http.post(PHPFILENAME, {type: 'insMat', local: local[0], away: away[0], tournament: tournament.id, round: roundToDraw + 1}).subscribe( (response) => {
                        if (response.json().success) {
                            this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                        }
                    });
                }
                while(finalists.length > 0) {
                    const local = finalists.splice(Math.floor(Math.random() * finalists.length), 1);
                    const away = finalists.splice(Math.floor(Math.random() * finalists.length), 1);
                    this.http.post(PHPFILENAME, {type: 'insMat', local: local[0], away: away[0], tournament: tournament.id, round: roundToDraw + 2}).subscribe( (response) => {
                        if (response.json().success) {
                            this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                        }
                    });
                }
            }
            alert('Ronda creada');
        }
    }

    private randomRawKOCupDraw(tournament) {
        /*let finalRound = 0;
        switch(tournament.name) {
            case this.appService.config.tournamentGeneralInfo.championsLeague.name: finalRound = this.appService.config.tournamentGeneralInfo.championsLeague.finalRound; break;
            case this.appService.config.tournamentGeneralInfo.copaMugre.name: finalRound = this.appService.config.tournamentGeneralInfo.copaMugre.finalRound; break;
        }
        let roundMatches = [];
        let roundToDraw = 0;
        for(let i = 1; i < finalRound - 1; i++) {
            roundMatches = this.appService.data.matches.filter( (filteredMatch) => {
                return filteredMatch.tournament == tournament.id && filteredMatch.round == i;
            });
            if(roundMatches.length > 0) { roundToDraw = i; }
        }
        if(roundToDraw != 0 && roundToDraw < finalRound - 3) {
            const roundToDrawMatches = this.appService.data.matches.filter( (filteredMatch) => {
                return filteredMatch.tournament == tournament.id && parseInt(filteredMatch.round) == roundToDraw;
            });
            let contendants = [];
            roundToDrawMatches.forEach( (match) => {
                contendants.push(this.appService.whoWon(match));
            });
            while(contendants.length > 0) {
                const local = contendants.splice(Math.floor(Math.random() * contendants.length), 1);
                const away = contendants.splice(Math.floor(Math.random() * contendants.length), 1);
                this.http.post(PHPFILENAME, {type: 'insMat', local: local[0], away: away[0], tournament: tournament.id, round: roundToDraw + 1}).subscribe( (response) => {
                    if (response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                    }
                });
            }
        } else if(roundToDraw != 0 && roundToDraw == this.appService.config.tournamentGeneralInfo.copa.finalRound - 2) {
            const roundToDrawMatches = this.appService.data.matches.filter( (filteredMatch) => {
                return filteredMatch.tournament == tournament.id && parseInt(filteredMatch.round) == roundToDraw;
            });
            let finalists = [];
            let losers = [];
            roundToDrawMatches.forEach( (match) => {
                finalists.push(this.appService.whoWon(match));
            });
            roundToDrawMatches.forEach( (match2) => {
                if(finalists.find( (finalist) => { return finalist == match2.local;})) {
                    losers.push(match2.away);
                } else {
                    losers.push(match2.local);
                }
            });
            while(losers.length > 0) {
                const local = losers.splice(Math.floor(Math.random() * losers.length), 1);
                const away = losers.splice(Math.floor(Math.random() * losers.length), 1);
                this.http.post(PHPFILENAME, {type: 'insMat', local: local[0], away: away[0], tournament: tournament.id, round: roundToDraw + 1}).subscribe( (response) => {
                    if (response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                    }
                });
            }
            while(finalists.length > 0) {
                const local = finalists.splice(Math.floor(Math.random() * finalists.length), 1);
                const away = finalists.splice(Math.floor(Math.random() * finalists.length), 1);
                this.http.post(PHPFILENAME, {type: 'insMat', local: local[0], away: away[0], tournament: tournament.id, round: roundToDraw + 2}).subscribe( (response) => {
                    if (response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                    }
                });
            }
        }*/

        let contendants = this.appService.config.tournamentGeneralInfo.copaMugre.seedTeams;
        while(contendants.length > 0) {
            const local = contendants.splice(Math.floor(Math.random() * contendants.length), 1);
            const away = contendants.splice(Math.floor(Math.random() * contendants.length), 1);
            this.http.post(PHPFILENAME, {type: 'insMat', local: local[0], away: away[0], tournament: tournament.id, round: 1}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + local + ' - ' + away});
                }
            });
            this.http.post(PHPFILENAME, {type: 'insMat', local: away[0], away: local[0], tournament: tournament.id, round: 2}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + away + ' - ' + local});
                }
            });
        }
    }

    public randomEuropaLeagueDraw(tournament) {
        let teams = this.appService.config.tournamentGeneralInfo.europaLeague.seedTeams;
        let groups = [[], [], [], []];
        let group = 0;
        let cont = 0;
        while(teams.length != 0) {
            if(cont == 3) { group++; cont = 0; }
            cont++;
            groups[group].push(teams.splice(Math.floor(Math.random() * teams.length), 1)[0]);
        }
        groups.forEach( (myGroup, key) => {
            this.http.post(PHPFILENAME, { type: 'insSta', team: myGroup[0], group: key + 1, tournament: tournament.id}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertStanding, logInfo: 'Clasificación creada'});
                }
            });
            this.http.post(PHPFILENAME, { type: 'insSta', team: myGroup[1], group: key + 1, tournament: tournament.id}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertStanding, logInfo: 'Clasificación creada'});
                }
            });
            this.http.post(PHPFILENAME, { type: 'insSta', team: myGroup[2], group: key + 1, tournament: tournament.id}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertStanding, logInfo: 'Clasificación creada'});
                }
            });
            this.http.post(PHPFILENAME, { type: 'insMat', local: myGroup[0], away: myGroup[1], tournament: tournament.id, round: 1 }).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertClub, logInfo: 'Partido creado: ' + myGroup[0] + ' - ' + myGroup[1] });
                }
            });
            this.http.post(PHPFILENAME, { type: 'insMat', local: myGroup[1], away: myGroup[2], tournament: tournament.id, round: 2 }).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertClub, logInfo: 'Partido creado: ' + myGroup[1] + ' - ' + myGroup[2] });
                }
            });
            this.http.post(PHPFILENAME, { type: 'insMat', local: myGroup[2], away: myGroup[0], tournament: tournament.id, round: 3 }).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertClub, logInfo: 'Partido creado: ' + myGroup[2] + ' - ' + myGroup[0] });
                }
            });
        });
    }

    public randomTeamCupDraw(tournament) {
        let teams = this.appService.data.teams;
        let clubs = [];
        while(teams.length > 0) {
            let newClub = [];
            while ( newClub.length < this.appService.config.tournamentGeneralInfo.teamCup.clubSize ) {
                newClub.push(teams.splice(Math.floor(Math.random() * teams.length), 1)[0]);
            }
            clubs.push(newClub);
        }
        clubs.forEach( (club, key) => {
            club.forEach( (team) => {
                this.http.post(PHPFILENAME, { type: 'insClu', club: key + 1, team: team.id, tournament: tournament.id }).subscribe( (response) => {
                    if (response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.insertClub, logInfo: 'Club de Team Cup creado: ' + (key + 1) + ' - ' + team.name });
                    }
                });
            });
        });
        while(clubs.length > 0) {
            const localClub = clubs.splice(Math.floor(Math.random() * clubs.length), 1)[0];
            const awayClub = clubs.splice(Math.floor(Math.random() * clubs.length), 1)[0];
            while(localClub.length > 0 && awayClub.length > 0) {
                const localTeam = localClub.splice(Math.floor(Math.random() * localClub.length), 1)[0];
                const awayTeam = awayClub.splice(Math.floor(Math.random() * awayClub.length), 1)[0];
                this.http.post(PHPFILENAME, {type: 'insMat', local: localTeam.id, away: awayTeam.id, tournament: tournament.id, round: 1}).subscribe( (response) => {
                    if (response.json().success) {
                        this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + tournament.name + ' - ' + localTeam.name + ' - ' + awayTeam.name});
                    }
                });
            }
        }
        alert('Sorteo de Team Cup creado');
    }

    public randomDraw() {
        switch (this.tournamentToRandomize.name) {
            case this.appService.config.tournamentGeneralInfo.copa.name: this.randomGeneralCupDraw(this.tournamentToRandomize); break;
            case this.appService.config.tournamentGeneralInfo.teamCup.name: this.randomTeamCupDraw(this.tournamentToRandomize); break;
            // case this.appService.config.tournamentGeneralInfo.championsLeague.name: 
            case this.appService.config.tournamentGeneralInfo.copaMugre.name: this.randomRawKOCupDraw(this.tournamentToRandomize); break;
            case this.appService.config.tournamentGeneralInfo.europaLeague.name: this.randomEuropaLeagueDraw(this.tournamentToRandomize); break;
            case this.appService.config.tournamentGeneralInfo.primera.name:
            case this.appService.config.tournamentGeneralInfo.segunda.name: this.randomRoundRobinDraw(this.tournamentToRandomize); break;
        }
    }

    public recalculateDefault() {
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
    }

    public recalculateGT() {
        this.appService.data.matches.forEach( (value) => {
            if(value.tournament == this.tournamentToReset.id && value.localGoals != -1) {
                let local = {points: 0, won: 0, draw: 0, lost: 0, nonPlayed: 0};
                let away = {points: 0, won: 0, draw: 0, lost: 0, nonPlayed: 0};
                if ((parseInt(value.localGoals) > parseInt(value.awayGoals)) || (parseInt(value.awayGoals) == -2 && parseInt(value.localGoals) != -2)) {
                    local.points = value.localGoals;
                    local.won = 1;
                    if(parseInt(value.awayGoals) == -2) {
                        away.nonPlayed = 1;
                        local.points = 45;
                    }
                }else if ((parseInt(value.localGoals) < parseInt(value.awayGoals)) || (parseInt(value.localGoals) == -2 && parseInt(value.awayGoals) != -2)) {
                    away.points = value.awayGoals;
                    away.won = 1;
                    if(parseInt(value.localGoals) == -2) {
                        local.nonPlayed = 1;
                        away.points = 45;
                    }
                } else if(parseInt(value.localGoals) == -2 && parseInt(value.awayGoals) == -2) {
                    local.nonPlayed = 1;
                    away.nonPlayed = 1;
                }
                if(parseInt(value.localGoals) == -2) { value.localGoals = "0"; }
                if(parseInt(value.awayGoals) == -2) { value.awayGoals = "0"; }
                this.http.post(PHPFILENAME, {type: 'updSta', points: local.points, won: local.won, draw: local.draw, lost: local.lost, nonPlayed: local.nonPlayed, goalsFor: parseInt(value.localGoals), goalsAgainst: parseInt(value.awayGoals), tournamentID: value.tournament, team: value.local}).subscribe( () => {});
                this.http.post(PHPFILENAME, {type: 'updSta', points: away.points, won: away.won, draw: away.draw, lost: away.lost, nonPlayed: away.nonPlayed, goalsFor: parseInt(value.awayGoals), goalsAgainst: parseInt(value.localGoals), tournamentID: value.tournament, team: value.away}).subscribe( () => {});
            }
        });
    }

    public recalculateStandings() {
        this.http.post(PHPFILENAME, {type: 'resSta', tournament: this.tournamentToReset.id}).subscribe( (response) => {
            if(response.json().success) {
                switch (this.tournamentToReset.name) {
                    case this.appService.config.tournamentGeneralInfo.goldenTrophy.name: this.recalculateGT(); break;
                    default: this.recalculateDefault(); break;
                }
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

    public resetMatch() {
        this.http.post('./CMDataRequesting.php', {type: 'forRes', localGoals: -1, awayGoals: -1, matchID: this.matchToEdit.id}).subscribe( (response) => {
            if (response.json().success) {
                this.appService.insertLog({logType: this.appService.config.logTypes.editMatch, logInfo: 'Partido reiniciado: ID ' + this.matchToEdit.id});
                alert('Partido reiniciado');
                this.resetView();
            }
        });
    }

    public editMatchResult() {
        this.http.post('./CMDataRequesting.php', {type: 'forRes', localGoals: this.localEditScore, awayGoals: this.awayEditScore, matchID: this.matchToEdit.id}).subscribe( (response) => {
            if (response.json().success) {
                this.appService.insertLog({logType: this.appService.config.logTypes.editMatch, logInfo: 'Partido editado: ID ' + this.matchToEdit.id});
                alert('Partido reiniciado');
                this.resetView();
            }
        });
    }

    public resetEditSection() {
        this.showEditSection = false;
    }

    public resetMatchToEdit() {
        this.matchToEdit = undefined;
        this.showMatchToEdit = false;
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
        this.resetMatchToEdit();
        this.resetEditSection();
        this.localEditScore = 0;
        this.awayEditScore = 0;
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
        let toPenalty = [];
        switch (resolution) {
            case 1: local.score = -2;
                    toPenalty.push(this.matchToResolve.local);
                break;
            case 2: local.score = -2;
                    away.score = -2;
                    toPenalty.push(this.matchToResolve.local);
                    toPenalty.push(this.matchToResolve.away);
                break;
            case 3: away.score = -2;
                    toPenalty.push(this.matchToResolve.away);
                break;
        }
        switch(this.appService.getTournamentById(this.matchToResolve.tournament).name) {
            case this.appService.config.tournamentGeneralInfo.goldenTrophy.name: this.resolveGoldenTrophyNonPlayed(resolution); this.appService.increaseSalaries(this.matchToResolve); break;
            case this.appService.config.tournamentGeneralInfo.teamCup.name: this.resolveTeamCupNonPlayed(resolution); this.appService.increaseSalaries(this.matchToResolve); break;
            default: this.appService.sendMatchInfo(this.matchToResolve, local, away); break;
        }
        toPenalty.forEach( (value) => {
            this.http.post(PHPFILENAME, {type: 'chaSal', amount: this.appService.config.nonPlayedPenalty, id: value}).subscribe( (response) => {
                if(response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.nonPlayedPenalty, logInfo: 'Penalizado por no presentado: ' + this.appService.getTeamById(value.team).name });
                }
            });
        });
        this.resetView();
    }

    public resolveGoldenTrophyNonPlayed(resolution) {
        let local = { score: 0, won: 0, nonPlayed: 0 };
        let away = { score: 0, won: 0, nonPlayed: 0 };
        switch (resolution) {
            case 1: local.score = -2;
                    away.score = 45;
                    away.won += 1;
                    local.nonPlayed +=1;
                break;
            case 2: local.score = -2;
                    away.score = -2;
                    local.nonPlayed +=1;
                    away.nonPlayed +=1;
                break;
            case 3: local.score = 45;
                    away.score = -2;
                    local.won += 1;
                    away.nonPlayed +=1;
                break;
        }
        this.http.post('./CMDataRequesting.php', {type: 'setRes', localGoals: local.score, awayGoals: away.score, matchID: this.matchToResolve.id}).subscribe( (response) => {
            if (response.json().success) {
                this.appService.increaseSalaries(this.matchToResolve);
            }
        });
        if(local.score == -2) { local.score = 0; }
        if(away.score == -2) { away.score = 0; }
        this.http.post(PHPFILENAME, {type: 'updSta', points: local.score, won: local.won, draw: 0, lost: 0, nonPlayed: local.nonPlayed, goalsFor: 0, goalsAgainst: 0, tournamentID: this.matchToResolve.tournament, team: this.matchToResolve.local}).subscribe( () => {});
        this.http.post(PHPFILENAME, {type: 'updSta', points: away.score, won: away.won, draw: 0, lost: 0, nonPlayed: away.nonPlayed, goalsFor: 0, goalsAgainst: 0, tournamentID: this.matchToResolve.tournament, team: this.matchToResolve.away}).subscribe( () => {});
    }

    public resolveTeamCupNonPlayed(resolution) {
        let local = { score: 0 };
        let away = { score: 0 };
        switch (resolution) {
            case 1: local.score = -2;
                    away.score = 300;
                break;
            case 2: local.score = -2;
                    away.score = -2;
                break;
            case 3: local.score = 300;
                    away.score = -2;
                break;
        }
        this.http.post('./CMDataRequesting.php', {type: 'setRes', localGoals: local.score, awayGoals: away.score, matchID: this.matchToResolve.id}).subscribe( (response) => {
            if (response.json().success) {
                this.appService.increaseSalaries(this.matchToResolve);
            }
        });
    }

    public setMatchToEdit() {
        this.showMatchToEdit = false;
        this.showMatchToEdit = true;
    }

    public setMatchToResolve() {
        this.showMatchToResolve = false;
        this.showMatchToResolve = true;
    }

    public setNewMatchRound() {
        this.showNewRound = false;
        this.showNewRound = true;
    }

    public setEditSection() {
        this.showEditSection = false;
        this.showEditSection = true;
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

    private setDisputedMatches() {
        const finalTableMatches = this.appService.data.matches.filter( (filteredMatch) => {
            return filteredMatch.localGoals != "-1" && filteredMatch.awayGoals != "-1";
        })
        .map( (value) => {
            value.filling = false;
            return value;
        });
        this.matchesResolvedTable = this.appService.getTableConfig(this.appService.config.tableHeaders.adminmatches, finalTableMatches);
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

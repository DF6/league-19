import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppService } from 'app/app.service';

export interface MatchData {
    id: String;
    local: String;
    away: String;
    tournament: String;
    round: String;
    localGoals: String;
    awayGoals: String;
    limitData: String;
    filling: boolean;
}

@Component({
    selector: 'match-filler',
    moduleId: module.id,
    templateUrl: 'match-filler.component.html'
})

export class MatchFillerComponent implements OnInit{

    @Input() data: MatchData;
    @Output() matchFilled = new EventEmitter<boolean>();
    public local: any;
    public away: any;
    public tournaments: any[];
    public teams: any[];
    public players: any[];
    public localPlayers: any[];
    public awayPlayers: any[];
    public models: any;
    public sent = false;

    constructor(private http: Http, private appService: AppService){
        this.appService.getPlayers();
        this.appService.getTournaments();
        this.appService.getTeams();
    }

    ngOnInit() {
        this.appService.getMatchesObservable().subscribe( (response) => {
            this.appService.setMatches(response.json().matches);
            this.local = {
                score: 0,
                scorers: [],
                assistants: [],
                yellowCards: [],
                redCards: [],
                injuries: [],
                mvp: []
            };
            this.away = {
                score: 0,
                scorers: [],
                assistants: [],
                yellowCards: [],
                redCards: [],
                injuries: [],
                mvp: []
            };
            this.models = {
                localScorer: null,
                awayScorer: null,
                localAssistant: null,
                awayAssistant: null,
                localYellowCard: null,
                awayYellowCard: null,
                localRedCard: null,
                awayRedCard: null,
                localinjury: null,
                awayinjury: null,
                localmvp: null,
                awaymvp: null
            };
            this.localPlayers = this.appService.getPlayersByTeam(this.data.local);
            this.awayPlayers = this.appService.getPlayersByTeam(this.data.away);
        });
    }

    public addScorer(team) {
        if (team == this.data.local) {
            this.local.scorers.push(this.models.localScorer);
            this.local.score++;
        } else if (team == this.data.away) {
            this.away.scorers.push(this.models.awayScorer);
            this.away.score++;
        }
    }

    public removeScorer(team, position) {
        if (team == this.data.local) {
            this.local.scorers.splice(position, 1);
            this.local.score--;
        } else if (team == this.data.away) {
            this.away.scorers.splice(position, 1);
            this.away.score--;
        }
    }

    public addAssistant(team) {
        if (team == this.data.local) {
            this.local.assistants.push(this.models.localAssistant);
        } else if (team == this.data.away) {
            this.away.assistants.push(this.models.awayAssistant);
        }
    }

    public removeAssistant(team, position) {
        if (team == this.data.local) {
            this.local.assistants.splice(position, 1);
        } else if (team == this.data.away) {
            this.away.assistants.splice(position, 1);
        }
    }

    public addYellowCard(team) {
        if (team == this.data.local) {
            this.local.yellowCards.push(this.models.localYellowCard);
        } else if (team == this.data.away) {
            this.away.yellowCards.push(this.models.awayYellowCard);
        }
    }

    public removeYellowCard(team, position) {
        if (team == this.data.local) {
            this.local.yellowCards.splice(position, 1);
        } else if (team == this.data.away) {
            this.away.yellowCards.splice(position, 1);
        }
    }

    public addRedCard(team) {
        if (team == this.data.local) {
            this.local.redCards.push(this.models.localRedCard);
        } else if (team == this.data.away) {
            this.away.redCards.push(this.models.awayRedCard);
        }
    }

    public removeRedCard(team, position) {
        if (team == this.data.local) {
            this.local.redCards.splice(position, 1);
        } else if (team == this.data.away) {
            this.away.redCards.splice(position, 1);
        }
    }

    public addInjury(team) {
        if (team == this.data.local) {
            this.local.injuries.push(this.models.localinjury);
        } else if (team == this.data.away) {
            this.away.injuries.push(this.models.awayinjury);
        }
    }

    public removeInjury(team, position) {
        if (team == this.data.local) {
            this.local.injuries.splice(position, 1);
        } else if (team == this.data.away) {
            this.away.injuries.splice(position, 1);
        }
    }

    public addMVP(team) {
        if (this.local.mvp.length == 0 && this.away.mvp.length == 0) {
            if (team == this.data.local) {
                this.local.mvp.push(this.models.localmvp);
            } else if (team == this.data.away) {
                this.away.mvp.push(this.models.awaymvp);
            }
        }else{
            alert('Ya tienes un MVP');
        }
    }

    public removeMVP() {
        this.local.mvp = [];
        this.away.mvp = [];
    }

    public sendMatchInfo() {
        if (!this.sent) {
            this.sent = true;
            this.http.post('./CMDataRequesting.php', {type: 'setRes', localGoals: this.local.score, awayGoals: this.away.score, matchID: this.data.id}).subscribe( (response) => {
                if (response.json().success) {
                    let local = {points: 0, won: 0, draw: 0, lost: 0};
                    let away = {points: 0, won: 0, draw: 0, lost: 0};
                    if (this.local.score > this.away.score) {
                        local.points = 3;
                        local.won = 1;
                        away.lost = 1;
                    }else if (this.local.score < this.away.score) {
                        away.points = 3;
                        away.won = 1;
                        local.lost = 1;
                    } else {
                        local.points = 1;
                        away.points = 1;
                        local.draw = 1;
                        away.draw = 1;
                    }
                    this.http.post('./CMDataRequesting.php', {type: 'updSta', points: local.points, won: local.won, draw: local.draw, lost: local.lost, goalsFor: this.local.score, goalsAgainst: this.away.score, tournamentID: this.data.tournament, team: this.data.local}).subscribe( () => {});
                    this.http.post('./CMDataRequesting.php', {type: 'updSta', points: away.points, won: away.won, draw: away.draw, lost: away.lost, goalsFor: this.away.score, goalsAgainst: this.local.score, tournamentID: this.data.tournament, team: this.data.away}).subscribe( () => {});
                    this.sendActionsOfTheMatch();
                } else {
                    alert(response.json().message);
                }
            });
        } else {
            alert('Resultado ya introducido');
        }
    }

    public sendActionsOfTheMatch() {
        let query = '';
        this.local.scorers.forEach( (value) => {
            query += this.mountAction('G', value);
        });
        this.local.assistants.forEach( (value) => {
            query += this.mountAction('A', value);
        });
        this.local.yellowCards.forEach( (value) => {
            query += this.mountAction('Y', value);
        });
        this.local.redCards.forEach( (value) => {
            query += this.mountAction('R', value);
        });
        this.local.injuries.forEach( (value) => {
            query += this.mountAction('I', value);
        });
        this.local.mvp.forEach( (value) => {
            query += this.mountAction('M', value);
        });
        this.away.scorers.forEach( (value) => {
            query += this.mountAction('G', value);
        });
        this.away.assistants.forEach( (value) => {
            query += this.mountAction('A', value);
        });
        this.away.yellowCards.forEach( (value) => {
            query += this.mountAction('Y', value);
        });
        this.away.redCards.forEach( (value) => {
            query += this.mountAction('R', value);
        });
        this.away.injuries.forEach( (value) => {
            query += this.mountAction('I', value);
        });
        this.away.mvp.forEach( (value) => {
            query += this.mountAction('M', value);
        });
        if (query != '') {
            this.http.post('./CMDataRequesting.php', {type: 'insAct', query: query}).subscribe( () => {
                this.matchFilled.emit();
            });
        } else {
            this.matchFilled.emit();
        }
        this.appService.insertLog({logType: this.appService.config.logTypes.matchFilled, logInfo: 'Partido insertado: ' + this.data.id + ''});
    }

    public mountAction(type, player) {
        return "INSERT INTO actions (match_id, type, player) values ("
         + this.data.id + ", '"
         + type + "', "
         + player + "); ";
    }

    public isNationsLeague(tournament) {
        return this.appService.getTournamentById(tournament).name == this.appService.config.tournamentGeneralInfo.nationsLeague.name;
    }
}

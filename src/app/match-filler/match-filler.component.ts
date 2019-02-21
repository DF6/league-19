import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

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

export class TableComponent implements OnInit{

    @Input() data: MatchData;
    @Output() matchFilled = new EventEmitter<boolean>();
    public local: any;
    public away: any;
    public tournaments: any[];
    public teams: any[];
    public players: any[];
    public localPlayers: any[];
    public awayPlayers: any[];

    constructor(private http: Http){
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
    }

    ngOnInit() {
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.players = JSON.parse(sessionStorage.getItem('players')).players;
        this.localPlayers = this.getPlayersByTeam(this.data.local);
        this.awayPlayers = this.getPlayersByTeam(this.data.away);
    }

    public addScorer(team) {
        if (team == this.data.local) {
            this.local.scorers.push();
            this.local.score++;
        } else if (team == this.data.away) {
            this.away.scorers.push();
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
            this.local.assistants.push();
        } else if (team == this.data.away) {
            this.away.assistants.push();
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
            this.local.yellowCards.push();
        } else if (team == this.data.away) {
            this.away.yellowCards.push();
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
            this.local.redCards.push();
        } else if (team == this.data.away) {
            this.away.redCards.push();
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
            this.local.injuries.push();
        } else if (team == this.data.away) {
            this.away.injuries.push();
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
                this.local.mvp.push();
            } else if (team == this.data.away) {
                this.away.mvp.push();
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
        this.http.post('./CMDataRequesting.php', {type: 'setRes', localGoals: this.local.score, awayGoals: this.away.score, matchID: this.data.id}).subscribe( () => {
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
            
        });
    }

    public getTeamById(team) {
        let teamToReturn = null;
        this.teams.forEach( (value) => {
            if(value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    public getPlayersByTeam(team) {
        let playersToReturn = [];
        this.players.forEach( (value) => {
            if (value.teamID == team) {
                playersToReturn.push(value);
            }
        });
        return playersToReturn;
    }
}

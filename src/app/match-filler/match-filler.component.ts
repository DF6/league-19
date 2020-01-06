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

    constructor(private appService: AppService){
        this.appService.getPlayers();
        this.appService.getTournaments();
        this.appService.getTeams();
        this.appService.getSignins();
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
            this.appService.sendMatchInfo(this.data, this.local, this.away);
            this.matchFilled.emit();
        } else {
            alert('Resultado ya introducido');
        }
    }

    public isNationsLeague(tournament) {
        return this.appService.getTournamentById(tournament).name == this.appService.config.tournamentGeneralInfo.nationsLeague.name;
    }
}

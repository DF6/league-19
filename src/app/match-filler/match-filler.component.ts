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
        this.appService.getTournaments();
        this.appService.getTeams();
        this.appService.getSignins();
    }

    ngOnInit() {
        this.appService.getPlayersObservable().subscribe( (response2) => {
            this.appService.data.players = response2.json().players;
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

    public addTeamCupScorer(team) {
        if (team == this.data.local) {
            this.local.scorers.push(this.models.localScorer);
            this.local.score += parseInt(this.appService.getPlayerById(this.models.localScorer).overage);
        } else if (team == this.data.away) {
            this.away.scorers.push(this.models.awayScorer);
            this.away.score += parseInt(this.appService.getPlayerById(this.models.awayScorer).overage);
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

    public removeTeamCupScorer(team, position) {
        if (team == this.data.local) {
            const scorer = this.local.scorers.splice(position, 1);
            this.local.score -= parseInt(this.appService.getPlayerById(scorer).overage);
        } else if (team == this.data.away) {
            const scorer = this.away.scorers.splice(position, 1);
            this.away.score -= parseInt(this.appService.getPlayerById(scorer).overage);
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

    private resolveKOCup(match, local, away) {
        const almostFilledMatches = this.appService.data.matches.filter( (filteredMatch) => {
            return filteredMatch.tournament == match.tournament && parseInt(filteredMatch.round) == parseInt(match.round) + 1 && filteredMatch.away == '0';
        })
        if(almostFilledMatches.length > 0) {
            const chosenMatch = almostFilledMatches.splice(Math.floor(Math.random() * almostFilledMatches.length), 1)[0];
            this.http.post('./CMDataRequesting.php', {type: 'ediMat', id: chosenMatch.id, local: chosenMatch.local, away: this.appService.whoWon({local: match.local, localGoals: local.score, away: match.away, awayGoals: away.score}), tournament: chosenMatch.tournament, round: chosenMatch.round}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.ediMatch, logInfo: 'Partido editado: ' + this.appService.getTournamentById(match.tournament).name + ' - ' + this.appService.getTeamById(match.local).name + ' - ' + this.appService.getTeamById(match.away).name});
                }
            });
        } else {
            this.http.post('./test_CMDataRequesting.php', {type: 'insMat', local: this.appService.whoWon(match), away: 0, tournament: match.tournament, round: match.round + 1}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.insertLog({logType: this.appService.config.logTypes.insertMatch, logInfo: 'Partido creado: ' + this.appService.getTournamentById(match.tournament).name + ' - ' + this.appService.getTeamById(match.local).name + ' - ' + this.appService.getTeamById(match.away).name});
                }
            });
        }
    }

    public sendMatchInfo() {
        if (!this.sent) {
            this.sent = true;
            this.appService.sendMatchInfo(this.data, this.local, this.away);
            if(this.appService.getTournamentById(this.data.tournament).name == this.appService.config.tournamentGeneralInfo.copa.name) { this.resolveKOCup(this.data, this.local, this.away); }
            this.matchFilled.emit();
        } else {
            alert('Resultado ya introducido');
        }
    }

    public sendTeamCupMatchInfo() {
        if (!this.sent) {
            this.sent = true;
            this.http.post('./test_CMDataRequesting.php', {type: 'setRes', localGoals: this.local.score, awayGoals: this.away.score, matchID: this.data.id}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.increaseSalaries(this.data);
                    this.matchFilled.emit();
                }
            });
        } else {
            alert('Resultado ya introducido');
        }
    }

    public getTournamentName(tournament) {
        return this.appService.getTournamentById(tournament).name;
    }
}

import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

declare var $:any;

@Component({
    selector: 'penalties-cmp',
    moduleId: module.id,
    templateUrl: 'penalties.component.html'
})

export class PenaltiesComponent implements OnInit{
    public penaltiesTable: TableData;
    public penalties;
    public yellowCardsCount = [];

    constructor(private appService: AppService){
        this.appService.getPlayers();
        this.appService.getTournaments();
        this.appService.getTeams();
    }

    ngOnInit() {
        this.appService.getActionsObservable().subscribe( (response2) => {
            this.appService.data.actions = response2.json().actions;
            this.appService.getMatchesObservable().subscribe( (response) => {
                this.appService.data.matches = response.json().matches;
                let penalties = [];
                this.appService.data.actions.forEach( (value) => {
                    switch(value.type) {
                        case this.appService.config.actionTypes.yellowCard:
                            if(this.updateYellowCount(value)) {
                                let penalty = this.getPenalty(value);
                                penalty ? penalty.filter( (filteredPenalty) => { return this.roundValid(filteredPenalty); })
                                .forEach( (value2) => {
                                    penalties.push(value2);
                                }) : null;
                            }
                            break;
                        case this.appService.config.actionTypes.injury:
                        case this.appService.config.actionTypes.redCard:
                            let penalty = this.getPenalty(value);
                            penalty ? penalty.filter( (filteredPenalty) => { return this.roundValid(filteredPenalty); })
                            .forEach( (value2) => {
                                penalties.push(value2);
                            }) : null;
                            break;
                    }
                });
                this.penaltiesTable = this.appService.getTableConfig(this.appService.config.tableHeaders.penaltiesTable, penalties);
            });
        });
    }

    private roundValid(penalty) {
        switch (penalty.tournament.name) {
            case this.appService.config.tournamentGeneralInfo.primera.name: return (penalty.round > this.appService.config.validRounds.primera);
            case this.appService.config.tournamentGeneralInfo.segunda.name: return (penalty.round > this.appService.config.validRounds.segunda);
            case this.appService.config.tournamentGeneralInfo.copa.name: return (penalty.round > this.appService.config.validRounds.copa);
            case this.appService.config.tournamentGeneralInfo.championsLeague.name: return (penalty.round > this.appService.config.validRounds.championsLeague);
            case this.appService.config.tournamentGeneralInfo.europaLeague.name: return (penalty.round > this.appService.config.validRounds.europaLeague);
            case this.appService.config.tournamentGeneralInfo.copaMugre.name: return (penalty.round > this.appService.config.validRounds.copaMugre);
            case this.appService.config.tournamentGeneralInfo.supercopaDeClubes.name:
            case this.appService.config.tournamentGeneralInfo.supercopaEuropea.name: return;
        }
    }

    private updateYellowCount(action) {
        let updated = false;
        let isPenalty = false;
        this.yellowCardsCount.forEach( (value) => {
            if (value.tournament == this.appService.getTournamentByMatch(action.matchID) && value.playerID == action.player && value.playerID > 0) {
                value.quantity += 1;
                updated = true;
                if (value.quantity % 2 == 0) {
                    isPenalty = true;
                }
            }
        });
        if (!updated && action.player > 0) {
            this.yellowCardsCount.push({playerID: action.player, tournament: this.appService.getTournamentByMatch(action.matchID), quantity: 1});
        }
        return isPenalty;
    }

    private getPenalty(action) {
        switch (this.appService.getTournamentByMatch(action.matchID).name) {
            case this.appService.config.tournamentGeneralInfo.primera.name:
            case this.appService.config.tournamentGeneralInfo.segunda.name:
                return this.getPenaltyAmount(action, this.appService.getTournamentByMatch(action.matchID), 3);
            case this.appService.config.tournamentGeneralInfo.copa.name:
            case this.appService.config.tournamentGeneralInfo.championsLeague.name:
            case this.appService.config.tournamentGeneralInfo.europaLeague.name:
            case this.appService.config.tournamentGeneralInfo.copaMugre.name:
                return this.getPenaltyAmount(action, this.appService.getTournamentByMatch(action.matchID), 1);
            case this.appService.config.tournamentGeneralInfo.supercopaDeClubes.name:
            case this.appService.config.tournamentGeneralInfo.supercopaEuropea.name:
                return [{ teamFor: null, teamAgainst: null, player: null, round: 0, cause: '' }];
        }
        return action;
    }

    private getPenaltyAmount(action, tournamentTo, amountTo) {
        let roundTo = parseInt(this.appService.getMatchById(action.matchID).round) + amountTo;
        switch (action.type) {
            case this.appService.config.actionTypes.yellowCard: 
                    return this.getRival(action, roundTo) != '-1' ? [{ tournament: tournamentTo, teamFor: this.appService.getPlayerById(action.player).teamID, teamAgainst: this.getRival(action, roundTo), player: action.player, round: roundTo, cause: 'Amarillas'}] : undefined;
            case this.appService.config.actionTypes.redCard: 
                    return this.getRival(action, roundTo) != '-1' ? [{ tournament: tournamentTo, teamFor: this.appService.getPlayerById(action.player).teamID, teamAgainst: this.getRival(action, roundTo), player: action.player, round: roundTo, cause: 'Roja'},
                            { tournament: tournamentTo, teamFor: this.appService.getPlayerById(action.player).teamID, teamAgainst: this.getRival(action, roundTo + 1), player: action.player, round: roundTo + 1, cause: 'Roja'}] : undefined;
            case this.appService.config.actionTypes.injury: 
                    return this.getRival(action, roundTo) != '-1' ? [{ tournament: tournamentTo, teamFor: this.appService.getPlayerById(action.player).teamID, teamAgainst: this.getRival(action, roundTo), player: action.player, round: roundTo, cause: 'Lesión'}] : undefined;
        }
    }

    /*private correctPenalty(actions) {
        for (let i = 0; i < actions.length; i++) {
            if (actions[i].teamAgainst == -1) {
                actions[i].tournament = this.getCorrectTournament(actions[i]);
                if (actions[i].tournament == 'NO APLICA') {
                    actions.splice(i, 1);
                    i--;
                } else {
                    actions[i].teamAgainst = this.getRival(actions[i], 1);
                    actions[i].round = 1;
                }
            }
        }
        return actions;
    }

    private getCorrectTournament(penaltyData) {
        switch(penaltyData.tournament) {
            case this.appService.config.tournamentGeneralInfo.primera.name:
            case this.appService.config.tournamentGeneralInfo.segunda.name:
                if(penaltyData.roundTo < 9) { return ''}
            case this.appService.config.tournamentGeneralInfo.copa.name:
            case this.appService.config.tournamentGeneralInfo.championsLeague.name:
            case this.appService.config.tournamentGeneralInfo.europaLeague.name:
            case this.appService.config.tournamentGeneralInfo.copaMugre.name:
                return null;
            case this.appService.config.tournamentGeneralInfo.supercopaDeClubes.name:
            case this.appService.config.tournamentGeneralInfo.supercopaEuropea.name:
                return [{ teamFor: null, teamAgainst: null, player: null, round: 0, cause: '' }];
        }
        return 'NO APLICA';
    }*/

    private getRival(action, round) {
        let teamFor = this.appService.getPlayerById(action.player).teamID;
        let tournament = this.appService.getTournamentByMatch(action.matchID);
        if (tournament == null) { tournament = this.appService.getLastEdition(action.tournament); }
        let teamToReturn: any = '-1';
        let passRound = -1;
        this.appService.data.matches.filter( (filteredMatch) => {
            return filteredMatch.tournament == tournament.id && filteredMatch.round == round;
        })
        .forEach( (value) => {
            if (passRound == -1) { passRound = 0; }
            if (value.local == teamFor) {
                teamToReturn = value.away;
                passRound = 1;
            } else if(value.away == teamFor) {
                teamToReturn = value.local;
                passRound = 1;
            }
        });
        if (passRound == 0) { teamToReturn = '-1'; }
        return teamToReturn;
    }
}

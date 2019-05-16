import { Injectable } from '@angular/core';

@Injectable()

export class AppService {

    public data;

    constructor() {}

    public setData(data) {
        this.data = data;
    }

    public getTeamById(team) {
        let teamToReturn = null;
        this.data.teams.forEach( (value) => {
            if (value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    public getTournamentById(id): any {
        let tournament = {};
        id = parseInt(id);
        this.data.tournaments.forEach( (value) => {
            if (value.id == id) {
                tournament = value;
            }
        });
        return tournament;
    }
}

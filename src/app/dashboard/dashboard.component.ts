import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { Http } from '@angular/http';

declare var $: any;

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    public tournaments;
    public teams;
    public user;
    public players;
    public matches;

    constructor(private http: Http) {}

    ngOnInit() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
      this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
      this.players = JSON.parse(sessionStorage.getItem('players')).players;
      this.user.team = this.getTeamById(this.user.teamID);
    }

    public getRemainingMatches(team) {
      let myTeamMatches = [];
      this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
        this.matches = response.json().matches;
        this.matches.forEach( (value, key) => {
            if ((value.local == team || value.away == team) && (value.localGoals == '-1' && value.awayGoals == '-1')) {
                myTeamMatches.push(value);
            }
        });
        return myTeamMatches.length;
      });
    }

    private getTeamById(team) {
      let returnedTeam = {};
      this.teams.forEach( (value, key) => {
        if (value.id === team) {
          returnedTeam = value;
        }
      });
      return returnedTeam;
    }

    public getPlayersByTeam(team) {
      let players = [];
      this.players.forEach( (value, key) => {
        if (value.teamID == team) {
          players.push(value);
        }
      });
      return players.length;
    }
}

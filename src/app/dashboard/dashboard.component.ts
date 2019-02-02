import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';

declare var $:any;

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

    public tournaments;
    public teams;
    public user;
    public players;

    ngOnInit(){
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.tournaments = JSON.parse(sessionStorage.getItem('tournaments'));
      this.teams = JSON.parse(sessionStorage.getItem('teams'));
      this.players = JSON.parse(sessionStorage.getItem('players'));
      this.user.team = this.getTeamById(this.user.team);
    }

    private getTeamById(team) {
      let returnedTeam = {};
      this.teams.forEach( (value, key) => {
        if(value.id === team) {
          returnedTeam = value;
        }
      });
      return returnedTeam;
    }

    public getPlayersByTeam(team) {
      let players = [];
      this.players.forEach( (value, key) => {
        if(value.team == team) {
          players.push(value);
        }
      });
      return players;
    }
}

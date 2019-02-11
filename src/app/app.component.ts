import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  constructor(private http: Http) {
    this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
      const users = response.json() ? response.json().users : null;
      sessionStorage.setItem('users', JSON.stringify({users: users}));
    });
    this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'TO'}).subscribe( (response) => {
      const tournaments = response.json() ? response.json().tournaments : null;
      sessionStorage.setItem('tournaments', JSON.stringify({tournaments: tournaments}));
    });
    this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'T'}).subscribe( (response) => {
      const teams = response.json() ? response.json().teams : null;
      sessionStorage.setItem('teams', JSON.stringify({teams: teams}));
    });
    this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'P'}).subscribe( (response) => {
      const players = response.json() ? response.json().players : null;
      sessionStorage.setItem('players', JSON.stringify({players: players}));
    });
  }
}

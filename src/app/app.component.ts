import { Component } from '@angular/core';
import { Http } from '@angular/http';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private http: Http) {
    this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
      const users = response.json() ? response.json().users : null;
      sessionStorage.setItem('users', JSON.stringify({users: users}));
    });
  }
}

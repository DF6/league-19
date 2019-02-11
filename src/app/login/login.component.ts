import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'login-cmp',
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent{

    public users;
    public user;
    public pass;
    public disableInputs = false;

    constructor(private http: Http) {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
            this.users = response.json() ? response.json().users : null;
            sessionStorage.setItem('users', JSON.stringify({users: this.users}));
          });
    }

    public login() {
        let userExists = false;
        let passMatch = false;
        this.users.forEach( (value) => {
            if(value.user == this.user) {
                if(value.pass == this.pass) {
                    sessionStorage.setItem('user', JSON.stringify({id: value.id, teamID: value.teamID, user: value.user, pass: value.pass, email: value.email}));
                    passMatch = true;
                    alert('Bienvenido ' + value.user);
                    this.disableInputs = true;
                } 
                userExists = true;
            }
        });
        if(userExists && !passMatch) {
            alert('La contraseña es incorrecta');
        }
        if(!userExists) {
            alert('El usuario no existe');
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

@Component({
    selector: 'registro-cmp',
    moduleId: module.id,
    templateUrl: 'registro.component.html'
})

export class RegistroComponent implements OnInit{

    public users;
    public user: String;
    public pass: String;
    public pass2: String;
    public email: String;
    public disable = false;

    constructor(private http: Http, private router: Router) {}

    ngOnInit(){
        this.users = JSON.parse(sessionStorage.getItem('users')).users;
    }

    public register() {
        let registering = true;
        if(this.pass != this.pass2) {
            alert('Las contraseñas no coinciden');
            registering = false;
        }
        this.users.forEach( (value, key) => {
            if(value.user == this.user) {
                alert('El usuario ya existe');
                registering = false;
            }
            if(value.email == this.email) {
                alert('El email ya existe');
                registering = false;
            }
        });
        if (registering) {
            this.http.post('./CMDataRequesting.php', {type: 'regUsu', user: this.user, pass: this.pass, email: this.email}).subscribe( (response) => {
                const users = response.json() ? response.json().users : null;
                sessionStorage.setItem('users', JSON.stringify({users: users}));
              });
            alert('¡Registrado!');
            this.disable = true;
        }
    }
}

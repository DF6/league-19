import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';

@Component({
    selector: 'registro-cmp',
    moduleId: module.id,
    templateUrl: 'registro.component.html'
})

export class RegistroComponent{

    public users;
    public user: String;
    public pass: String;
    public pass2: String;
    public email: String;
    public disable = false;

    constructor(private http: Http, private router: Router, private appService: AppService) {
        this.appService.getUsers();
    }

    public register() {
        let registering = true;
        if (this.pass != this.pass2) {
            alert('Las contraseñas no coinciden');
            registering = false;
        }
        this.appService.data.users.forEach( (value, key) => {
            if (value.user == this.user) {
                alert('El usuario ya existe');
                registering = false;
            }
            if (value.email == this.email) {
                alert('El email ya existe');
                registering = false;
            }
        });
        if (registering) {
            this.http.post('./test_CMDataRequesting.php', {type: 'regUsu', user: this.user, pass: this.pass, email: this.email}).subscribe( (response) => {
                if (response.json().success) {
                    this.appService.data.users = response.json().users;
                    alert('¡Registrado!');
                } else {
                    alert('Error en el registro');
                }
              });
            this.disable = true;
        }
    }
}

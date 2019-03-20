import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { SideBarService } from '../sidebar/sidebar.service';
import { Router, ActivatedRoute } from '@angular/router';

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

    constructor(private http: Http, private sidebarService: SideBarService, private router: Router) {
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'U'}).subscribe( (response) => {
            this.users = response.json() ? response.json().users : null;
            sessionStorage.setItem('users', JSON.stringify({users: this.users}));
          });
    }

    public login() {
        let userExists = false;
        let passMatch = false;
        this.users.forEach( (value) => {
            if (value.user.toLowerCase() == this.user.toLowerCase()) {
                if (value.pass.toLowerCase() == this.pass.toLowerCase()) {
                    sessionStorage.setItem('user', JSON.stringify({
                        id: value.id,
                        teamID: value.teamID,
                        user: value.user,
                        pass: value.pass,
                        email: value.email,
                        name: value.name,
                        psnID: value.psnID,
                        twitch: value.twitch
                    }));
                    passMatch = true;
                    this.sidebarService.logChange();
                    alert('Bienvenido ' + value.user);
                    this.disableInputs = true;
                    this.router.navigateByUrl('normas');
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

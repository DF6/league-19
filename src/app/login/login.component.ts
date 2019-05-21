import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { SideBarService } from '../sidebar/sidebar.service';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';

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

    constructor(private http: Http, private sidebarService: SideBarService, private router: Router, private appService: AppService) {
        this.appService.getUsers();
    }

    public login() {
        this.http.post('./CMDataRequesting.php', {type: 'login', user: this.user, pass: this.pass}).subscribe( (response) => {
            if (response.json().success) {
                this.appService.data.users.forEach( (value) => {
                    if (value.user.toLowerCase() == this.user.toLowerCase()) {
                        sessionStorage.setItem('user', JSON.stringify({
                            id: value.id,
                            teamID: value.teamID,
                            user: value.user,
                            email: value.email,
                            name: value.name,
                            psnID: value.psnID,
                            twitch: value.twitch
                        }));
                        this.sidebarService.logChange();
                        alert(response.json().message);
                        this.disableInputs = true;
                        this.router.navigateByUrl('normas');
                    }
                });
            } else {
                alert(response.json().message);
            }
        });
    }
}

import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { SideBarService } from '../sidebar/sidebar.service';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';
import { HostListener } from '@angular/core';

@Component({
    selector: 'login-cmp',
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent {

    public users;
    public user;
    public pass;
    public disableInputs = false;

    constructor(private http: Http, private sidebarService: SideBarService, private router: Router, private appService: AppService) {
        this.appService.getUsers();
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key == 'Enter') {
            this.login();
        }
    }

    public login() {
        this.http.post('./test_CMDataRequesting.php', {type: 'login', user: this.user, pass: this.pass}).subscribe( (response) => {
            if (response.json().success) {
                this.appService.data.users.forEach( (value) => {
                    if (value.user.toLowerCase() == this.user.toLowerCase()) {
                        this.appService.setSessionUser({
                            id: value.id,
                            teamID: value.teamID,
                            user: value.user,
                            email: value.email,
                            name: value.name,
                            psnID: value.psnID,
                            twitch: value.twitch,
                            adminRights: parseInt(value.adminRights),
                            holidaysMode: parseInt(value.holidaysMode),
                            holidaysMessage: value.holidaysMessage
                        });
                        this.sidebarService.logChange();
                        this.appService.insertLog({id: value.id, logType: this.appService.config.logTypes.login, logInfo: 'Login'});
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

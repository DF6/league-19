import { Component } from '@angular/core';
import { SideBarService } from '../sidebar/sidebar.service';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';

@Component({
    selector: 'logout-cmp',
    moduleId: module.id,
    templateUrl: 'logout.component.html'
})

export class LogoutComponent{

    constructor(private sidebarService: SideBarService, private router: Router, private appService: AppService) {
        this.appService.insertLog({logType: this.appService.config.logTypes.logout, logInfo: 'Logout'});
        sessionStorage.removeItem('user');
        this.sidebarService.logChange();
        this.router.navigateByUrl('login');
    }
}

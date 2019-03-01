import { Component } from '@angular/core';
import { SideBarService } from '../sidebar/sidebar.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'logout-cmp',
    moduleId: module.id,
    templateUrl: 'logout.component.html'
})

export class LogoutComponent{

    constructor(private sidebarService: SideBarService, private router: Router) {
        sessionStorage.removeItem('user');
        this.sidebarService.logChange();
        this.router.navigateByUrl('login');
    }
}

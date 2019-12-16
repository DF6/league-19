import { Component, OnInit } from '@angular/core';
import { SideBarService } from './sidebar.service';
import { AppService } from 'app/app.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    constructor(private sideBarService: SideBarService, private appService: AppService) {}

    ngOnInit() {
        this.appService.getConstants();
        this.appService.getConfigObservable().subscribe( (response) => {
            this.appService.setConfig(response.json());
            this.menuItems = this.appService.config.routes.notLogged.filter(menuItem => menuItem);
            this.sideBarService.logged.subscribe(isLogged => {
                this.appService.getUsersObservable().subscribe( (response) => {
                    if(response.json().success) {
                        if (isLogged) {
                            this.appService.setUsers(response.json().users);
                            this.appService.setUser(this.appService.data.users
                                .filter( (value) => {
                                    return value.id == JSON.parse(sessionStorage.getItem('user')).id;
                                })
                                .map( (user) => {
                                    return {
                                        id: user.id,
                                        teamID: user.teamID,
                                        user: user.user,
                                        email: user.email,
                                        name: user.name,
                                        psnID: user.psnID,
                                        twitch: user.twitch,
                                        adminRights: parseInt(user.adminRights),
                                        holidaysMode: parseInt(user.holidaysMode),
                                        holidaysMessage: user.holidaysMessage
                                    }
                                })[0]);
                            if (!this.appService.data.user.adminRights) {
                                if (this.appService.data.user.teamID == this.appService.config.notTeam) {
                                    this.menuItems = this.appService.config.routes.noTeam.filter(menuItem => menuItem);
                                } else {
                                    this.menuItems = this.appService.data.constants.marketOpened == '1' ?
                                        this.appService.config.routes.loggedInMarket.filter(menuItem => menuItem) :
                                        this.appService.config.routes.logged.filter(menuItem => menuItem);
                                }
                            } else {
                                this.menuItems = this.appService.config.routes.admin.filter(menuItem => menuItem);
                            }
                        } else {
                            this.menuItems = this.appService.config.routes.notLogged.filter(menuItem => menuItem);
                        }
                    }
                });
                
            });
        });
    }

    isNotMobileMenu(){
        if ($(window).width() > this.appService.config.notMobileMenuWidth) {
            return false;
        }
        return true;
    }

}

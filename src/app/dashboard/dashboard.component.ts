import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AppService } from 'app/app.service';

declare var $: any;

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    public showUser = false;

    constructor(private appService: AppService) {
        this.appService.getTournaments();
        this.appService.getTeams();
    }

    ngOnInit() {
        this.appService.getPlayersObservable().subscribe( (response) => {
            this.appService.data.players = response.json().players;
            this.appService.getMatchesObservable().subscribe( (response2) => {
                this.appService.data.matches = response2.json().matches;
                this.showUser = true;
            });
        });
    }
}

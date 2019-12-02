import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

declare var $:any;

@Component({
    selector: 'notifications-cmp',
    moduleId: module.id,
    templateUrl: 'notifications.component.html'
})

export class NotificationsComponent implements OnInit{

    public teams;
    public matches;
    public tournaments;
    public user;
    public season;

    constructor(private http: Http) {}

    ngOnInit() {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.tournaments = JSON.parse(sessionStorage.getItem('tournaments')).tournaments;
        this.teams = JSON.parse(sessionStorage.getItem('teams')).teams;
        this.getMatches();
    }

    private getMatches() {
        let finalTableMatches = [];
        this.http.post('./CMDataRequesting.php', {type: 'recDat', dataType: 'M'}).subscribe( (response) => {
            let matchesArray = response.json().matches;
            const cupLastEdition = this.getLastEdition('Copa');
            const tournament = this.getTournamentByEdition(cupLastEdition);
            this.season = cupLastEdition;
            matchesArray.forEach( (value, key) => {
                if (value.tournament == tournament) {
                    value.filling = false;
                    finalTableMatches.push(value);
                }
            });
            this.matches = finalTableMatches;
        });
    }

    private getLastEdition(league) {
        let lastEdition = -1;
        for (let i = 0; i < this.tournaments.length; i++) {
            if (this.tournaments[i].name == league && lastEdition < this.tournaments[i].edition) {
                lastEdition = this.tournaments[i].edition;
            }
        }
        return lastEdition;
    }

    private getTournamentByEdition(edition) {
        let tournament = -1;
        for (let i = 0; i < this.tournaments.length; i++) {
            if (this.tournaments[i].name == 'Copa' && edition == this.tournaments[i].edition) {
                tournament = this.tournaments[i].id;
            }
        }
        return tournament;
    }

    public getTeamById(team) {
        let teamToReturn = null;
        this.teams.forEach( (value) => {
            if(value.id == team) {
                teamToReturn = value;
            }
        });
        return teamToReturn;
    }

    showNotification(from, align){
        var type = ['','info','success','warning','danger'];

        var color = Math.floor((Math.random() * 4) + 1);

    	$.notify({
        	icon: "ti-gift",
        	message: "Welcome to <b>Paper Dashboard</b> - a beautiful freebie for every web developer."
        },{
            type: type[color],
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    }
}

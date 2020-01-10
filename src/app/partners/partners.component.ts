import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';

@Component({
    selector: 'partners-cmp',
    moduleId: module.id,
    templateUrl: 'partners.component.html'
})

export class PartnersComponent{

    public partners;
    public partnerChosen;

    constructor(private http: Http, private router: Router, private appService: AppService) {
        this.appService.getUsers();
        this.appService.getPartnersObservable().subscribe( (response) => {
                this.appService.data.partners = response.json().partners;
                this.appService.data.partners.forEach( (value) => {
                    if(value.team == this.appService.data.user.teamID) {
                        this.partnerChosen = (value.partner != 0);
                    }
                });
        });
    }

    public choosePartner(partner) {
        this.http.post('./CMDataRequesting.php', {type: 'firPat', team: this.appService.data.user.teamID, partner: partner}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success) {
                this.router.navigateByUrl('usuario');
            }
        });
    }
}

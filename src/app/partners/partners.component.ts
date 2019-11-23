import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

@Component({
    selector: 'partners-cmp',
    moduleId: module.id,
    templateUrl: 'partners.component.html'
})

export class PartnersComponent{

    public user;
    public users;
    public partners;
    public partnerChosen;

    constructor(private http: Http, private router: Router) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.users = JSON.parse(sessionStorage.getItem('users')).users;
        this.http.post('./test_CMDataRequesting.php', {type: 'recDat', dataType: 'PARTNERS'}).subscribe( (response) => {
                this.partners = response.json().partners;
                this.partners.forEach( (value) => {
                    if(value.team == this.user.teamID) {
                        this.partnerChosen = (value.partner != 0);
                    }
                });
        });
    }

    public choosePartner(partner) {
        this.http.post('./test_CMDataRequesting.php', {type: 'firPat', team: this.user.teamID, partner: partner}).subscribe( (response) => {
            alert(response.json().message);
            if(response.json().success) {
                this.router.navigateByUrl('usuario');
            }
        });
    }
}

import { Component } from '@angular/core';
import { AppService } from 'app/app.service';

@Component({
    selector: 'winnerslist-cmp',
    moduleId: module.id,
    templateUrl: 'winnerslist.component.html'
})

export class WinnersListComponent {

    public filters;

    constructor(private appService: AppService) {
        this.filters = {
            tournament: '',
            edition: ''
        };
    }
}

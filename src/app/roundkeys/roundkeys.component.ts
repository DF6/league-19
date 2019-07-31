import { Component, Input, OnInit } from '@angular/core';
import { KeyConfig } from 'app/app.service';

@Component({
    selector: 'roundkeys',
    moduleId: module.id,
    templateUrl: 'roundkeys.component.html'
})

export class RoundkeysComponent implements OnInit{

    @Input() config: KeyConfig[] | null;
    public showElement = false;

    constructor() {}

    ngOnInit() {
        this.showElement = true;
    }
}

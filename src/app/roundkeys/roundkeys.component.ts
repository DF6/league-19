import { Component, Input } from '@angular/core';
import { KeyConfig } from 'app/app.service';

@Component({
    selector: 'roundkeys',
    moduleId: module.id,
    templateUrl: 'roundkeys.component.html'
})

export class RoundkeysComponent {

    @Input() config: KeyConfig[] | null;

    constructor() {}
}

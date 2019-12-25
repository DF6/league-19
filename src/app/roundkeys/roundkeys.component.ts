import { Component, Input } from '@angular/core';
import { KeyConfig, AppService } from 'app/app.service';

@Component({
    selector: 'roundkeys',
    moduleId: module.id,
    templateUrl: 'roundkeys.component.html'
})

export class RoundkeysComponent {

    @Input() roundConfig: KeyConfig[] | null;

    constructor(private appService: AppService) {}
}

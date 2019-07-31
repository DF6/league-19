import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoundkeysComponent } from './roundkeys.component';
import { FormsModule } from '@angular/forms';
import { KeyModule } from 'app/key/key.module';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule, KeyModule ],
    declarations: [ RoundkeysComponent ],
    exports: [ RoundkeysComponent ]
})

export class RoundkeysModule {}

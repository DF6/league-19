import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchFillerComponent } from './match-filler.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule ],
    declarations: [ MatchFillerComponent ],
    exports: [ MatchFillerComponent ]
})

export class MatchFillerModule {}

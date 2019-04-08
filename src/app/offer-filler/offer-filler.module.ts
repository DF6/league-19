import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfferFillerComponent } from './offer-filler.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule ],
    declarations: [ OfferFillerComponent ],
    exports: [ OfferFillerComponent ]
})

export class OfferFillerModule {}

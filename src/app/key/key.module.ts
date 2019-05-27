import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeyComponent } from './key.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule ],
    declarations: [ KeyComponent ],
    exports: [ KeyComponent ]
})

export class KeyModule {}

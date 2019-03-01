import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { SideBarService } from './sidebar.service';

@NgModule({
    imports: [ RouterModule, CommonModule ],
    declarations: [ SidebarComponent ],
    exports: [ SidebarComponent ],
    providers: [ SideBarService ]
})

export class SidebarModule {}

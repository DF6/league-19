import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppService } from 'app/app.service';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private toggleButton;
    private sidebarVisible: boolean;

    @ViewChild("navbar-cmp") button;

    constructor(location: Location, private renderer: Renderer, private element: ElementRef, private appService: AppService) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        if(document.body.clientWidth <= 991) {
            document.getElementsByClassName('sidebar')[0].setAttribute('style', 'display: none');
        }
        this.appService.getConfigObservable().subscribe( (response) => {
            this.appService.setConfig(response.json());
            this.listTitles = this.appService.config.routes.all.filter(listTitle => listTitle);
            const navbar: HTMLElement = this.element.nativeElement;
            this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        });
    }

    getTitle() {
        const titlee = window.location.pathname.substring(1);
        for (let item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    sidebarToggle() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        let toggleButton = this.toggleButton;
        let body = document.getElementsByTagName('body')[0];

        if (this.sidebarVisible == false) {
            setTimeout(function(){
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
            if(document.body.clientWidth <= this.appService.config.mobileMenuLimit) {
                document.getElementsByClassName('sidebar')[0].setAttribute('style', 'display: block');
            }
        } else {
            this.toggleButton.classList.remove('toggled');
            body.classList.remove('nav-open');
            this.sidebarVisible = false;
            if(document.body.clientWidth <= this.appService.config.mobileMenuLimit) {
                document.getElementsByClassName('sidebar')[0].setAttribute('style', 'display: none');
            }
        }
    }
}

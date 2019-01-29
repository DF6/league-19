import { Component, OnInit } from '@angular/core';

declare var $:any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: 'dashboard', title: 'Panel de Control',  icon: 'ti-panel', class: '' },
    { path: 'user', title: 'Perfil',  icon:'ti-user', class: '' },
    { path: 'table', title: 'Liga',  icon:'ti-view-list-alt', class: '' },
    { path: 'typography', title: 'Partidos Pendientes',  icon:'ti-text', class: '' },
    { path: 'icons', title: 'Plantillas',  icon:'ti-pencil-alt2', class: '' },
    { path: 'maps', title: 'Mercado',  icon:'ti-map', class: '' },
    { path: 'notifications', title: 'Copa',  icon:'ti-bell', class: '' },
    { path: 'upgrade', title: 'Normas',  icon:'ti-view-list-alt', class: 'active-pro' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

}

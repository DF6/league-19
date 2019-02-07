import { Component, OnInit } from '@angular/core';

declare var $:any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    /*{ path: 'panelcontrol', title: 'Panel de Control',  icon: 'ti-panel', class: '' },
    { path: 'partidospendientes', title: 'Partidos Pendientes',  icon:'ti-text', class: '' },
    { path: 'mercado', title: 'Mercado',  icon:'ti-map', class: '' },
    { path: 'copa', title: 'Copa',  icon:'ti-bell', class: '' },*/
    { path: 'liga', title: 'Liga',  icon:'ti-view-list-alt', class: '' },
    { path: 'usuario', title: 'Perfil',  icon:'ti-user', class: '' },
    { path: 'plantillas', title: 'Plantillas',  icon:'ti-pencil-alt2', class: '' },
    { path: 'registro', title: 'Registro', icon: 'ti-user', class: ''},
    { path: 'normas', title: 'Normas',  icon:'ti-view-list-alt', class: 'active-pro' },
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

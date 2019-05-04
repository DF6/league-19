import { Component, OnInit } from '@angular/core';
import { SideBarService } from './sidebar.service';

declare var $:any;

export interface RouteInfo {
    path: string;
    title: string;
   icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: 'liga', title: 'Liga', icon: 'ti-calendar', class: '' },
    { path: 'copa', title: 'Copa', icon: 'ti-vector', class: '' },
    { path: 'champions', title: 'Champions', icon: 'ti-cup', class: '' },
    { path: 'el', title: 'Europa League', icon: 'ti-cup', class: '' },
    { path: 'intertoto', title: 'Intertoto', icon: 'ti-thumb-down', class: '' },
    { path: 'nations', title: 'Liga de Naciones', icon: 'ti-flag-alt-2', class: '' },
    { path: 'clubsupercup', title: 'Supercopa de Clubes', icon: 'ti-crown', class: '' },
    { path: 'europesupercup', title: 'Supercopa de Europa', icon: 'ti-crown', class: '' },
    { path: 'estadisticas', title: 'Estadisticas', icon: 'ti-bar-chart', class: '' },
    { path: 'sanciones', title: 'Sanciones', icon: 'ti-wheelchair', class: '' },
    { path: 'partidospendientes', title: 'Partidos Pendientes', icon:'ti-text', class: '' },
    // { path: 'jugadoreslibres', title: 'Libres', icon: 'ti-text', class: '' },
    // { path: 'subastas', title: 'Subastas', icon: 'ti-text', class: '' },
    // { path: 'mercado', title: 'Mercado', icon: 'ti-money', class: '' },
    // { path: 'patrocinadores', title: 'Patrocinadores', icon: 'ti-money', class: '' },
    { path: 'usuario', title: 'Perfil', icon: 'ti-user', class: '' },
    { path: 'plantillas', title: 'Plantillas', icon: 'ti-pencil-alt2', class: '' },
    { path: 'normas', title: 'Normas', icon: 'ti-view-list-alt', class: '' },
    { path: 'logout', title: 'Cerrar Sesion', icon: 'ti-user', class: ''},
];

export const NOTTEAMROUTES: RouteInfo[] = [
    // { path: 'panelcontrol', title: 'Panel de Control', icon: 'ti-panel', class: '' },
    // { path: 'mercado', title: 'Mercado', icon:'ti-map', class: '' },
    // { path: 'liga', title: 'Liga', icon: 'ti-calendar', class: '' },
    // { path: 'copa', title: 'Copa', icon: 'ti-vector', class: '' },
    // { path: 'champions', title: 'Champions', icon: 'ti-cup', class: '' },
    // { path: 'clubsupercup', title: 'Supercopa de Clubes', icon: 'ti-crown', class: '' },
    // { path: 'el', title: 'Europa League', icon: 'ti-bell', class: '' },
    // { path: 'intertoto', title: 'Intertoto', icon: 'ti-bell', class: '' },
    // { path: 'nations', title: 'Liga de Naciones', icon: 'ti-flag-alt-2', class: '' },
    // { path: 'estadisticas', title: 'Estadisticas', icon:'ti-text', class: '' },
    // { path: 'partidospendientes', title: 'Partidos Pendientes', icon:'ti-text', class: '' },
    // { path: 'usuario', title: 'Perfil', icon: 'ti-user', class: '' },
    { path: 'plantillas', title: 'Plantillas', icon: 'ti-pencil-alt2', class: '' },
    { path: 'normas', title: 'Normas', icon: 'ti-view-list-alt', class: '' },
    { path: 'logout', title: 'Cerrar Sesion', icon: 'ti-user', class: ''},
];

export const ADMINROUTES: RouteInfo[] = [
    // { path: 'panelcontrol', title: 'Panel de Control', icon: 'ti-panel', class: '' },
    { path: 'liga', title: 'Liga', icon: 'ti-calendar', class: '' },
    { path: 'copa', title: 'Copa', icon: 'ti-vector', class: '' },
    { path: 'champions', title: 'Champions', icon: 'ti-cup', class: '' },
    { path: 'el', title: 'Europa League', icon: 'ti-cup', class: '' },
    { path: 'intertoto', title: 'Intertoto', icon: 'ti-thumb-down', class: '' },
    { path: 'nations', title: 'Liga de Naciones', icon: 'ti-flag-alt-2', class: '' },
    { path: 'clubsupercup', title: 'Supercopa de Clubes', icon: 'ti-crown', class: '' },
    { path: 'europesupercup', title: 'Supercopa de Europa', icon: 'ti-crown', class: '' },
    { path: 'estadisticas', title: 'Estadisticas', icon: 'ti-bar-chart', class: '' },
    { path: 'sanciones', title: 'Sanciones', icon: 'ti-wheelchair', class: '' },
    { path: 'partidospendientestotales', title: 'Partidos Pendientes', icon: 'ti-text', class: '' },
    { path: 'adminpage', title: 'Administracion', icon: 'ti-text', class: '' },
    { path: 'jugadoreslibres', title: 'Libres', icon: 'ti-text', class: '' },
    { path: 'subastas', title: 'Subastas', icon: 'ti-text', class: '' },
    { path: 'mercado', title: 'Mercado', icon: 'ti-money', class: '' },
    { path: 'patrocinadores', title: 'Patrocinadores', icon: 'ti-money', class: '' },
    { path: 'usuario', title: 'Perfil', icon: 'ti-user', class: '' },
    { path: 'plantillas', title: 'Plantillas', icon: 'ti-pencil-alt2', class: '' },
    { path: 'normas', title: 'Normas', icon: 'ti-view-list-alt', class: '' },
    { path: 'logout', title: 'Cerrar Sesion', icon: 'ti-user', class: ''},
];

export const ROUTESNOTLOGGED: RouteInfo[] = [
    { path: 'registro', title: 'Registro', icon: 'ti-user', class: ''},
    { path: 'login', title: 'Entrar', icon: 'ti-user', class: ''},
    { path: 'normas', title: 'Normas', icon: 'ti-view-list-alt', class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    constructor(
        private sideBarService: SideBarService
      ) { }

    ngOnInit() {
        this.menuItems = ROUTESNOTLOGGED.filter(menuItem => menuItem);
        this.sideBarService.logged.subscribe(isLogged => {
            if (isLogged) {
                if (sessionStorage.getItem('user') != null && JSON.parse(sessionStorage.getItem('user')).user != 'admin') {
                    if(JSON.parse(sessionStorage.getItem('user')).teamID == 0) {
                        this.menuItems = NOTTEAMROUTES.filter(menuItem => menuItem);
                    } else {
                        this.menuItems = ROUTES.filter(menuItem => menuItem);
                    }
                } else {
                    this.menuItems = ADMINROUTES.filter(menuItem => menuItem);
                }
            } else {
                this.menuItems = ROUTESNOTLOGGED.filter(menuItem => menuItem);
            }
          });
    }
    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

}
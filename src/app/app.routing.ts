import { Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { UserComponent }   from './user/user.component';
import { TableComponent }   from './table/table.component';
import { TypographyComponent }   from './typography/typography.component';
import { IconsComponent }   from './icons/icons.component';
import { MapsComponent }   from './maps/maps.component';
import { NotificationsComponent }   from './notifications/notifications.component';
import { UpgradeComponent }   from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { LogoutComponent } from './logout/logout.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { EuropaLeagueComponent } from './europaleague/europaleague.component';
import { IntertotoComponent } from './intertoto/intertoto.component';
import { ChampionsComponent } from './champions/champions.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'registro',
        pathMatch: 'full',
    },
    {
        path: 'panelcontrol',
        component: DashboardComponent
    },
    {
        path: 'usuario',
        component: UserComponent
    },
    {
        path: 'liga',
        component: TableComponent
    },
    {
        path: 'partidospendientes',
        component: TypographyComponent
    },
    {
        path: 'plantillas',
        component: IconsComponent
    },
    {
        path: 'mercado',
        component: MapsComponent
    },
    {
        path: 'copa',
        component: NotificationsComponent
    },
    {
        path: 'normas',
        component: UpgradeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logout',
        component: LogoutComponent
    },
    {
        path: 'registro',
        component: RegistroComponent
    },
    {
        path: 'estadisticas',
        component: StatisticsComponent
    },
    {
        path: 'champions',
        component: ChampionsComponent
    },
    {
        path: 'el',
        component: EuropaLeagueComponent
    },
    {
        path: 'intertoto',
        component: IntertotoComponent
    },
    {
        path: 'nations',
        component: StatisticsComponent
    }
]

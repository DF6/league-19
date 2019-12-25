import { Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { UserComponent }   from './user/user.component';
import { TableComponent }   from './table/table.component';
import { TypographyComponent }   from './typography/typography.component';
import { IconsComponent }   from './icons/icons.component';
import { MapsComponent }   from './maps/maps.component';
import { GeneralCupComponent }   from './generalcup/generalcup.component';
import { RulesComponent }   from './rules/rules.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { LogoutComponent } from './logout/logout.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { EuropaLeagueComponent } from './europaleague/europaleague.component';
import { IntertotoComponent } from './intertoto/intertoto.component';
import { ChampionsComponent } from './champions/champions.component';
import { NationsComponent } from './nations/nations.component';
import { ClubSupercupComponent } from './clubsupercup/clubsupercup.component';
import { AdminMatchesComponent } from './adminmatches/adminmatches.component';
import { PenaltiesComponent } from './penalties/penalties.component';
import { FreePlayersComponent } from './freeplayers/freeplayers.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { MarketComponent } from './market/market.component';
import { PartnersComponent } from './partners/partners.component';
import { OfferComponent } from './offer/offer.component';
import { EuropeSupercupComponent } from './europesupercup/europesupercup.component';
import { AdminPageComponent } from './adminpage/adminpage.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'normas',
        pathMatch: 'full',
    },
    { path: 'panelcontrol', component: DashboardComponent },
    { path: 'usuario', component: UserComponent },
    { path: 'liga', component: TableComponent },
    { path: 'partidospendientes', component: TypographyComponent },
    { path: 'partidospendientestotales', component: AdminMatchesComponent },
    { path: 'plantillas', component: IconsComponent },
    { path: 'copa', component: GeneralCupComponent },
    { path: 'normas', component: RulesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'estadisticas', component: StatisticsComponent },
    { path: 'champions', component: ChampionsComponent },
    { path: 'el', component: EuropaLeagueComponent },
    { path: 'intertoto', component: IntertotoComponent },
    { path: 'nations', component: NationsComponent },
    { path: 'clubsupercup', component: ClubSupercupComponent },
    { path: 'sanciones', component: PenaltiesComponent },
    { path: 'jugadoreslibres', component: FreePlayersComponent },
    { path: 'subastas', component: AuctionsComponent },
    { path: 'mercado', component: MarketComponent },
    { path: 'patrocinadores', component: PartnersComponent },
    { path: 'offer', component: OfferComponent },
    { path: 'europesupercup', component: EuropeSupercupComponent },
    { path: 'adminpage', component: AdminPageComponent }
]

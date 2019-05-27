import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';
import { NguiMapModule} from '@ngui/map';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { UserComponent }   from './user/user.component';
import { TableComponent }   from './table/table.component';
import { TypographyComponent }   from './typography/typography.component';
import { IconsComponent }   from './icons/icons.component';
import { MapsComponent }   from './maps/maps.component';
import { NotificationsComponent }   from './notifications/notifications.component';
import { UpgradeComponent }   from './upgrade/upgrade.component';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { MatchFillerModule } from './match-filler/match-filler.module';
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
import { OfferFillerModule } from './offer-filler/offer-filler.module';
import { PartnersComponent } from './partners/partners.component';
import { OfferComponent } from './offer/offer.component';
import { EuropeSupercupComponent } from './europesupercup/europesupercup.component';
import { AdminPageComponent } from './adminpage/adminpage.component';
import { AppService } from './app.service';
import { KeyModule } from './key/key.module';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    TableComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    LoginComponent,
    RegistroComponent,
    LogoutComponent,
    StatisticsComponent,
    EuropaLeagueComponent,
    IntertotoComponent,
    ChampionsComponent,
    NationsComponent,
    ClubSupercupComponent,
    AdminMatchesComponent,
    PenaltiesComponent,
    FreePlayersComponent,
    AuctionsComponent,
    MarketComponent,
    PartnersComponent,
    OfferComponent,
    EuropeSupercupComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    SidebarModule,
    HttpModule,
    FormsModule,
    NavbarModule,
    FooterModule,
    FixedPluginModule,
    MatchFillerModule,
    OfferFillerModule,
    KeyModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'})

  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }

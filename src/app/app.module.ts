import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';
import { NguiMapModule} from '@ngui/map';

import { AdminPageComponent } from './adminpage/adminpage.component';
import { AppService } from './app.service';
import { AuctionsComponent } from './auctions/auctions.component';
import { ChampionsComponent } from './champions/champions.component';
import { ClubSupercupComponent } from './clubsupercup/clubsupercup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EuropaLeagueComponent } from './europaleague/europaleague.component';
import { EuropeSupercupComponent } from './europesupercup/europesupercup.component';
import { FreePlayersComponent } from './freeplayers/freeplayers.component';
import { SquadsComponent } from './squads/squads.component';
import { CopaMugreComponent } from './copamugre/copamugre.component';
import { KeyModule } from './key/key.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MapsComponent } from './maps/maps.component';
import { MarketComponent } from './market/market.component';
import { MatchFillerModule } from './match-filler/match-filler.module';
import { NationsComponent } from './nations/nations.component';
import { GeneralCupComponent } from './generalcup/generalcup.component';
import { OfferComponent } from './offer/offer.component';
import { OfferFillerModule } from './offer-filler/offer-filler.module';
import { PartnersComponent } from './partners/partners.component';
import { PenaltiesComponent } from './penalties/penalties.component';
import { RegistroComponent } from './registro/registro.component';
import { RoundkeysModule } from './roundkeys/roundkeys.module';
import { RulesComponent } from './rules/rules.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { PremierComponent } from './premier/premier.component';
import { PendingMatchesComponent } from './pendingmatches/pendingmatches.component';
import { UserComponent } from './user/user.component';
import { SecondComponent } from './second/second.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    PremierComponent,
    SecondComponent,
    PendingMatchesComponent,
    SquadsComponent,
    MapsComponent,
    GeneralCupComponent,
    RulesComponent,
    LoginComponent,
    RegistroComponent,
    LogoutComponent,
    StatisticsComponent,
    EuropaLeagueComponent,
    CopaMugreComponent,
    ChampionsComponent,
    NationsComponent,
    ClubSupercupComponent,
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
    RoundkeysModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE'})

  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }

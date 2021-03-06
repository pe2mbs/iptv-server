import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { GridsterModule } from 'angular-gridster2';
import { GenCrudModule } from './gencrud/gencrud.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExampleHttpDatabase } from './modules/demo/table-http-service';
import { TableHttpExample } from './modules/demo/table-http-example';
import localeNl from '@angular/common/locales/nl';
import { registerLocaleData } from '@angular/common';
import { DashboardComponent, TrackByItemComponent } from './modules/dashboard/dashboard.component';
import { LanguagesModule } from './backend/languages/module';
import { LanguageReferenceModule } from './backend/language_reference/module';
import { LanguageTranslationsModule } from './backend/language_translates/module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TrackingModule } from './backend/tracking/module';
import { RecordLocksModule } from './backend/locking/module';
import { UserModule } from './backend/user/module';
import { RoleModule } from './backend/role/module';
import { RoleAccessModule } from './backend/role_access/module';
import { ModuleAccessModule } from './backend/mod_access/module';
import { WidgetWrapperComponent } from './modules/widget-wrapper/widget-wrapper.component';
import { WeatherWidgetComponent } from './modules/widgets/weather-widget/weather-widget.component';
import { VelocityWidgetComponent } from './modules/widgets/velocity-widget/velocity-widget.component';
import { NewsModule } from './backend/news/module';
import { EpisodeModule } from './iptv/episode/module';
import { AliasModule } from './iptv/alias/module';
import { BougetModule } from './iptv/bouget/module';
import { ChannelModule } from './iptv/channel/module';
import { ConfigModule } from './iptv/config/module';
import { MovieModule } from './iptv/movie/module';
import { ReplaceModule } from './iptv/replace/module';
import { SerieModule } from './iptv/serie/module';


registerLocaleData(localeNl);

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    TableHttpExample,
    DashboardComponent,
    TrackByItemComponent,
    WidgetWrapperComponent,
    WeatherWidgetComponent,
    VelocityWidgetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GridsterModule,
    GenCrudModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    RoleModule,
    RecordLocksModule,
    TrackingModule,
    LanguagesModule,
    LanguageReferenceModule,
    LanguageTranslationsModule,
    RoleAccessModule,
    ModuleAccessModule,
    NewsModule,
    BougetModule,
    ChannelModule,
    EpisodeModule,
    AliasModule,
    ConfigModule,
    MovieModule,
    ReplaceModule,
    SerieModule,
    UserModule
  ],
  providers: [
    ExampleHttpDatabase,
    {
      provide: LOCALE_ID,
      useValue: 'nl'
    }
  ]
})
export class AppModule { }

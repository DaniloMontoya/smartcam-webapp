import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MapComponent } from './components/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EditComponent } from './components/edit/edit.component';
import { SpeedAlertComponent } from './components/speed-alert/speed-alert.component';
import { SosAlertComponent } from './components/sos-alert/sos-alert.component';
import { StatsComponent } from './components/stats/stats.component';
import { ChartsModule } from 'ng2-charts';
import { StreamingComponent } from './components/streaming/streaming.component';
import { AlertNotificationsComponent } from './components/alert-notifications/alert-notifications.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { ConfirmDialog } from './shared/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent,
    EditComponent,
    SpeedAlertComponent,
    SosAlertComponent,
    ConfirmDialog,
    StatsComponent,
    StreamingComponent,
    AlertNotificationsComponent,
    TranslatePipe,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    ChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ConfirmDialog
  ],
})
export class AppModule { }

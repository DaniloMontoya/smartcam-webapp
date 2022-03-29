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
import { VehiclesComponent, EditModal } from './components/vehicles/vehicles.component';
import { SpeedAlertComponent } from './components/speed-alert/speed-alert.component';
import { SosAlertComponent } from './components/sos-alert/sos-alert.component';
import { RoutesModal, StatsComponent } from './components/stats/stats.component';
import { ChartsModule } from 'ng2-charts';
import { StreamingComponent } from './components/streaming/streaming.component';
import { AlertNotificationsComponent } from './components/alert-notifications/alert-notifications.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { ConfirmDialog } from './shared/confirm-dialog.component';
import { AlertConfigComponent } from './components/alert-config/alert-config.component';
import { CamerasComponent, StreamModal } from './components/cameras/cameras.component';
import { SafePipe } from './pipes/safe.pipe';
import { AddModal, ClientConfigModal, ConfigComponent, DeleteUserModal, EditUserModal } from './components/config/config.component';
import { VideoComponent } from './components/video/video.component';
import { EventsComponent } from './components/events/events.component';
import {EditComponent } from './components/edit/edit.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapComponent,
    VehiclesComponent,
    SpeedAlertComponent,
    SosAlertComponent,
    ConfirmDialog,
    StatsComponent,
    StreamModal,
    StreamingComponent,
    AlertNotificationsComponent,
    TranslatePipe,
    SafePipe,
    AlertConfigComponent,
    CamerasComponent,
    RoutesModal,
    ConfigComponent,
    VideoComponent,
    EditModal,
    ClientConfigModal,
    AddModal,
    EditUserModal,
    DeleteUserModal,
    EventsComponent,
    EditComponent
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
    ConfirmDialog,
    EditModal,
    ClientConfigModal,
    AddModal,
    EditUserModal,
    DeleteUserModal
  ],
})
export class AppModule { }

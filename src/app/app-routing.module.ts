import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { EditComponent } from './components/edit/edit.component'
import { SpeedAlertComponent } from './components/speed-alert/speed-alert.component';
import { SosAlertComponent } from './components/sos-alert/sos-alert.component';
import { StatsComponent } from './components/stats/stats.component'
import { StreamingComponent } from './components/streaming/streaming.component';

const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full'  },
  { path: 'map', component: MapComponent },
  { path: 'map/:id', component: MapComponent },
  { path: 'edit', component: EditComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'speed-alert', component: SpeedAlertComponent },
  { path: 'sos-alert', component: SosAlertComponent },
  { path: 'stats/:id', component: StatsComponent },
  { path: 'streaming', component: StreamingComponent },
  { path: 'streaming/:id', component: StreamingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

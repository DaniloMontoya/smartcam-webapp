import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'moviint-client';

  isExpanded = false;

  year = new Date().getFullYear()

  navigations = [
    {icon: 'location_on', name: 'Mapa', route: '/map'},
    {icon: 'directions_car', name: 'Vehículos', route: '/edit'},
    {icon: 'video_library', name: 'Grabaciones', route: 'playback'},
    {icon: 'video_camera_back', name: 'Cámaras disponibles', route: '/cameras'},
    {icon: 'taxi_alert', name: 'Alertas de velocidad', route: '/speed-alert'},
    {icon: 'support', name: 'Alertas S.O.S', route: '/sos-alert'},
    {icon: 'settings', name: 'Control de alertas', route: '/alert-config'}]

  constructor(public auth: AuthService) {}
}

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

  navigations = [{icon: 'location_on', name: 'Mapa', route: 'map'}, {icon: 'videocam', name: 'Cámaras', route: 'streaming'}, {icon: 'video_library', name: 'Grabaciones', route: 'playback'}, {icon: 'edit_road', name: 'Edición', route: '/edit'}, {icon: 'taxi_alert', name: 'Alertas de velocidad', route: '/speed-alert'}, {icon: 'support', name: 'Alertas S.O.S', route: '/sos-alert'}]

  constructor(public auth: AuthService) {}
}

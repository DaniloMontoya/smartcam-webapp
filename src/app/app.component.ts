import { Component } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { RestService } from './services/rest.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'moviint-client';

  isExpanded = false;

  year = new Date().getFullYear()

  client: Client

  navigations = [
    {icon: 'location_on', name: 'Mapa', route: '/map'},
    {icon: 'directions_car', name: 'Vehículos', route: '/vehicles'},
    {icon: 'video_camera_back', name: 'Cámaras disponibles', route: '/cameras'},
    {icon: 'warning', name: 'Alertas', route: '/alerts'},
    //{icon: 'video_library', name: 'Grabaciones', route: '/video'},
    //{icon: 'warning_amber', name: 'Control de alertas', route: '/alert-config'},
    {icon: 'settings', name: 'Configuración', route: '/config'}]

  constructor(private rest:RestService, public user:UserService) { this.rest.getClient().subscribe((res: Client)=> this.client = res) }
}

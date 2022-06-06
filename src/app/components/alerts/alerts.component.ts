import { Component, OnInit } from '@angular/core';

interface Alert {
  value: number
  viewValue: string
  icon:string
}

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  selectedAlert : number = 0

  alerts: Alert[] = [
    {value: 0, viewValue: 'Eventos DMS', icon: 'notifications_paused'},
    {value: 1, viewValue: 'Alertas S.O.S', icon: 'support'},
    {value: 2, viewValue: 'Alertas De Velocidad', icon: 'taxi_alert'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

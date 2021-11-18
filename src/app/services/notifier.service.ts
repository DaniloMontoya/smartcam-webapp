import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlertNotificationsComponent } from '../components/alert-notifications/alert-notifications.component';
import { DeviceGps } from '../models/devicegps.model';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  notifications: any [] = []

  constructor(private snackBar:MatSnackBar, private router: Router) { }

  showNotification(message, title, imei, date) {
    this.notifications.push({message, title, imei, date})
    if(this.notifications.length>=3)
      this.notifications.shift()
    this.snackBar.openFromComponent(AlertNotificationsComponent, {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'snackbar'
    })
    return this.snackBar
  }

  clickAlert(imei:string) {
    this.deleteAlert(imei)
    if(this.router.url == '/map')
      this.router.navigate([`/map/${imei}`]).then(()=>{location.reload()})
    else
      this.router.navigate([`/map/${imei}`])
  }

  deleteAlert(imei:string) {
    let index = this.notifications.findIndex((notification:any) => notification.imei === imei)
    this.notifications.splice(index,1)
  }

}

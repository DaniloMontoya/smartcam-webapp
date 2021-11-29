import { Component, OnInit } from '@angular/core';
import { DeviceGps } from 'src/app/models/devicegps.model';
import { RestService } from 'src/app/services/rest.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialog } from 'src/app/shared/confirm-dialog.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public id
  public search: string
  public GPSData:any
  public length = 100;
  public pageSize = 13;
  public pageSizeOptions: number[] = [15, 30, 50, 100];

  constructor(public rest: RestService, private _snackBar: MatSnackBar, private _Activatedroute:ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.pageSize = this.id ? 100 :13
    this.rest.listAllAsPage(0,this.pageSize).subscribe((response:any) => {
      this.length = response.totalElements
      this.GPSData = response
      if(this.id) {
        this.search = this.id
        this.GPSData.content.sort((data)=>{ return data.imei == this.id ? -1 : data.imei == this.id ? 1 : 0; });
      }
    }, error => console.error(error));
  }

  updateDevice(device:DeviceGps) {
    this.rest.doUpdateVehicle(device).subscribe((response)=>{
      if(response) {
        this.rest.cameraToVehicle(device.imeiCamera, device.imei).subscribe()
        this._snackBar.open(`El dispositivo de ${device.vehicle} ${device.imei}, ha sido actualizado!`)
        setTimeout(() => {
          this._snackBar.dismiss()
        }, 2000);
      }
    }), error => this._snackBar.open(error.message)
  }

  loadNextPage(event) {
    this.rest.listAllAsPage(event.pageIndex, event.pageSize).subscribe((response:any) => {
      this.pageSize = event.pageSize
      this.length = response.totalElements
      this.GPSData = response
    }, error => console.error(error));
  }

  openTurnOffDialog(_vehicle: any): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '333px',
      data: {dialog: 'apagar', vehicle: _vehicle}
    });

    dialogRef.afterClosed().subscribe(result => {
      //If you wan't to do something here lol
    });
  }

  openUnlockDialog(vehicle: any): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '333px',
      data: {dialog: 'desbloquear', vehicle: vehicle}
    });

    dialogRef.afterClosed().subscribe(result => {
      //If you wan't to do something here lol
    });
  }

}

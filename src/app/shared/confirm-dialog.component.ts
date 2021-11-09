import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { RestService } from "../services/rest.service";

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {

  message:string

  constructor(public dialogRef: MatDialogRef<ConfirmDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private rest: RestService, private route: Router) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  shutdown(): void {
    this.rest.shutdownVehicle(this.data.vehicle.imei).subscribe((response:any) => {
      let snackBarRef = this._snackBar.open(`El dispositivo ${this.data.vehicle.licensePlate} se ha apagado!`, 'Ver Vehículo')
      snackBarRef.onAction().subscribe(() => { this.route.navigate([`/map/${this.data.vehicle.imei}`])});
    }, error => console.error(error));
    this.dialogRef.close();
  }

  unlock(): void {
    this.rest.unlockVehicle(this.data.vehicle.imei).subscribe((response:any) => {
      let snackBarRef = this._snackBar.open(`El dispositivo ${this.data.vehicle.licensePlate} se ha desbloqueado!`, 'Ver Vehículo')
      snackBarRef.onAction().subscribe(() => { this.route.navigate([`/map/${this.data.vehicle.imei}`])});
    }, error => console.error(error));
    this.dialogRef.close();
  }

}

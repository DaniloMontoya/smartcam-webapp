import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { DOMAIN_URL } from 'src/environments/domain.prod';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.scss']
})
export class CamerasComponent implements OnInit {

  camera_list: any;
  displayedColumns: string[] = ['imei', 'customer', 'lastStatus', 'licensePlate', 'lastUpdated', 'livestream'];

  constructor(private rest: RestService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.rest.listAllCameras().subscribe((response)=>{
      this.camera_list = response
    }), error => console.error(error)
  }

  openStream(camera:any) {
    this.dialog.open(StreamModal, { data: {imei:camera.imei, licensePlate:camera.licensePlate} });
  }

}

@Component({
  selector: 'steam-modal',
  templateUrl: 'stream.modal.html',
})
export class StreamModal {
  url:string
  response:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<StreamModal>, private rest: RestService) {
    this.rest.askStreamingCamera(data.imei).subscribe((res:any)=>{
      this.response = res
      this.url = `http://${DOMAIN_URL}/video.html?imei=${data.imei}`
    }), error => {
      this.dialogRef.close()
    };
  }
}

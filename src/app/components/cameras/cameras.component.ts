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
  displayedColumns: string[] = ['imei', 'customer', 'lastStatus', 'lastUpdated', 'livestream'];

  constructor(private rest: RestService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.rest.listAllCameras().subscribe((response)=>{
      this.camera_list = response
    }), error => console.error(error)
  }

  openStream(imei_camera:string) {
    this.dialog.open(StreamModal, { data: {imei:imei_camera} });
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
      if(res.isLive === false) {
        setTimeout(() => {
          this.dialogRef.close()
        }, 5000);
      }
      this.url = `http://${DOMAIN_URL}/video.html?imei=${data.imei}`
    });
  }
}

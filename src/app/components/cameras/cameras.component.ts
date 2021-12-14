import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.scss']
})
export class CamerasComponent implements OnInit {

  camera_list: any;
  displayedColumns: string[] = ['imei', 'customer', 'lastStatus', 'number', 'lastUpdated', 'livestream'];

  constructor(private rest: RestService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.rest.listAllCameras().subscribe((response)=>{
      this.camera_list = response
    }), error => console.error(error)
  }

  openStream(imei_camera:string) {
    this.rest.askStreamingCamera(imei_camera).subscribe((response)=>{ this.dialog.open(StreamModal, { data: {imei:imei_camera, response:response} }); })
  }

}

@Component({
  selector: 'steam-modal',
  templateUrl: 'stream.modal.html',
})
export class StreamModal {
  url:string
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.url = `http://${location.hostname}/video.html?imei=${data.imei}`
  }
}

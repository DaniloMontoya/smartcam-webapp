import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompatClient, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Streaming } from 'src/app/models/streaming.model';
import { RestService } from 'src/app/services/rest.service';
import { UserService } from 'src/app/services/user.service';
import { DOMAIN_URL } from 'src/environments/domain.prod';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.scss']
})
export class CamerasComponent implements OnInit, OnDestroy {

  camera_list: any;
  displayedColumns: string[] = ['imei', 'customer', 'lastStatus', 'licensePlate', 'lastUpdated', 'livestream'];
  public stompClient: CompatClient | undefined

  constructor(private rest: RestService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.rest.listAllCameras().subscribe((response)=>{
      this.camera_list = response
    }), error => console.error(error)
    this.initWebsocket()
  }

  ngOnDestroy(): void {
    this.stompClient.disconnect();
  }

  initWebsocket(){
    this.stompClient = Stomp.over(() => new SockJS(`${DOMAIN_URL}/gps-websocket`));
    this.stompClient.connect({}, this.connect_callback, this.error_callback)
    this.stompClient.reconnect_delay = 2500;
  }

  public connect_callback = () => {
    this._subcribeTopic('/topic/gps');
  }

  public error_callback = (error) => {
    console.error(error, "Reconnecting WS", `${DOMAIN_URL}/gps-websocket`);
    setTimeout(() => { this.initWebsocket(); }, 2500);
  };

  private _subcribeTopic(topic: string) {
    this.stompClient.subscribe(topic, (message:any) => {
      if(!message.body)
        return;

      let model: any = JSON.parse(message.body);
        switch (topic) {
          case '/topic/gps':
            this._updateWebSocketResponse(model);
            break;
        }
    });
  }

  private _updateWebSocketResponse (response:any) {
    this.camera_list.forEach((data)=>{
      if(response.licensePlate === data.licensePlate) {
        data.cameraStatus = response.cameraStatus
        data.lastStatus = response.cameraStatus
        data.ignition = response.ignition
        data.lastUpdated = new Date().toString();
      }
    })
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
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<StreamModal>, private rest: RestService, private user:UserService) {
    this.rest.askStreamingCamera(data.imei).subscribe((res:Streaming)=>{
      this.response = res
      this.url = `${DOMAIN_URL}:8091/streaming/video?imei=${data.imei}&access_token=${this.user.getToken()}`
    }), error => {
      this.dialogRef.close()
    };
  }
}

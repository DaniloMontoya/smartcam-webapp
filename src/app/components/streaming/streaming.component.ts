import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompatClient, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { DeviceGps } from 'src/app/models/devicegps.model';
import { RestService } from 'src/app/services/rest.service';
import { Streaming } from 'src/app/models/streaming.model';
import { DOMAIN_URL } from 'src/environments/domain.prod';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.scss']
})
export class StreamingComponent implements OnInit {

  public urlStreaming: string

  public id

  constructor(private _Activatedroute:ActivatedRoute, private user: UserService) { }

  ngOnInit() {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.urlStreaming = `${DOMAIN_URL}:8091/#/streaming/${this.id}?access_token=${this.user.getToken()}`
  }

}

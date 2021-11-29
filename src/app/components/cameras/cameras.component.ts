import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.scss']
})
export class CamerasComponent implements OnInit {

  camera_list: any;
  displayedColumns: string[] = ['imei', 'customer', 'lastStatus', 'lastUpdated'];

  constructor(private rest: RestService) { }

  ngOnInit(): void {
    this.rest.listAllCameras().subscribe((response)=>{
      this.camera_list = response
      console.log(response)
    }), error => console.error(error)
  }

}

import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-speed-alert',
  templateUrl: './speed-alert.component.html',
  styleUrls: ['./speed-alert.component.scss']
})
export class SpeedAlertComponent implements OnInit {

  public speed_alerts: any
  public length = 100;
  public pageSize = 13;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [13, 30, 50, 100];

  public search: string

  displayedColumns: string[] = ['id', 'licensePlate', 'vehicle', 'speed', 'exceeded', 'maxSpeed', 'created', 'location'];

  constructor(private rest: RestService) { }

  ngOnInit() {
    this.rest.listAllSpeedAlert(this.pageIndex,this.pageSize).subscribe((response:any)=>{
      this.speed_alerts = response
      this.length = response.totalElements
    }), error => console.error(error)
  }

  loadNextPage(event) {
    if(this.search) {
      this.rest.listAllSpeedAlertByLicensePlate(event.pageIndex, event.pageSize, this.search).subscribe((response:any) => {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.length = response.totalElements
        this.speed_alerts = response
      }, error => console.error(error));
    } else {
      this.rest.listAllSpeedAlert(event.pageIndex, event.pageSize).subscribe((response:any) => {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.length = response.totalElements
        this.speed_alerts = response
      }, error => console.error(error));
    }
  }

  searchPlate() {
    if(this.search) {
      this.rest.listAllSpeedAlertByLicensePlate(0,this.pageSize, this.search).subscribe((response:any)=>{
        this.speed_alerts = response
        this.length = response.totalElements
      }), error => console.error(error)
    } else {
      this.rest.listAllSpeedAlert(this.pageIndex,this.pageSize).subscribe((response:any)=>{
        this.speed_alerts = response
        this.length = response.totalElements
      }), error => console.error(error)
    }
  }

}

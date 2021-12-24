import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-sos-alert',
  templateUrl: './sos-alert.component.html',
  styleUrls: ['./sos-alert.component.scss']
})
export class SosAlertComponent implements OnInit {

  public sos_alerts: any
  public length = 100;
  public pageSize = 13;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [13, 30, 50, 100];

  public search: string

  displayedColumns: string[] = ['id', 'licensePlate', 'vehicle', 'description', 'created', 'location'];

  constructor(private rest: RestService) { }

  ngOnInit() {
    this.rest.listAllSosAlert(this.pageIndex,this.pageSize).subscribe((response:any)=>{
      this.sos_alerts = response
      this.length = response.totalElements
    }), error => console.error(error)
  }

  loadNextPage(event) {
    if(this.search) {
      this.rest.listAllSosAlertByLicensePlate(event.pageIndex, event.pageSize, this.search).subscribe((response:any) => {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.length = response.totalElements
        this.sos_alerts = response
      }, error => console.error(error));
    } else {
      this.rest.listAllSosAlert(event.pageIndex, event.pageSize).subscribe((response:any) => {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.length = response.totalElements
        this.sos_alerts = response
      }, error => console.error(error));
    }
  }

  onSearchPlate() {
    if(this.search) {
      this.rest.listAllSosAlertByLicensePlate(0,this.pageSize, this.search).subscribe((response:any)=>{
        this.sos_alerts = response.content
        this.length = response.totalElements
      }), error => console.log(error)
    } else {
      this.rest.listAllSosAlert(this.pageIndex,this.pageSize).subscribe((response:any)=>{
        this.sos_alerts = response
        this.length = response.totalElements
      }), error => console.error(error)
    }
  }


}

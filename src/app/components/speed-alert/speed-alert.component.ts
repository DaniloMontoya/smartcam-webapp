import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private rest: RestService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.rest.listAllSpeedAlert(this.pageIndex,this.pageSize).subscribe((response)=>{
      this.speed_alerts = response
    }), error => console.error(error)
  }

  loadNextPage(event) {
    this.rest.listAllSpeedAlert(event.pageIndex, event.pageSize).subscribe((response:any) => {
      this.pageIndex = event.pageIndex
      this.pageSize = event.pageSize
      this.length = response.totalElements
      this.speed_alerts = response
    }, error => console.error(error));
  }

  SearchPlate() {
    this.rest.listAllSpeedAlertByLicensePlate(this.pageIndex,this.pageSize, this.search).subscribe((response:any)=>{
      this.speed_alerts = response.content
      this.changeDetectorRefs.detectChanges();
    }), error => console.log(error)
  }

}

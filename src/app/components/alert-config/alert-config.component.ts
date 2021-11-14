import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-alert-config',
  templateUrl: './alert-config.component.html',
  styleUrls: ['./alert-config.component.scss']
})
export class AlertConfigComponent implements OnInit {

  public alerts = true

  public length = 100;
  public pageSize = 13;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [13, 30, 50, 100];

  public search: string

  displayedColumns: string[] = ['id', 'alert', 'sendAlert', 'sendMail'];

  constructor(private rest: RestService) { }

  ngOnInit(): void {
  }

  loadNextPage(event) {
    console.log(event)
  }

}

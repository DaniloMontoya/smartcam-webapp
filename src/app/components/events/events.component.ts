import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  event_list: any;
  displayedColumns: string[] = ['imei', 'event', 'licensePlate'];

  constructor(private rest: RestService) { }

  ngOnInit(): void {
  }

}

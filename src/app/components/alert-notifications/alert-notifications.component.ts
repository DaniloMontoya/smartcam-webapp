import { Component, Inject, OnInit } from '@angular/core';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-alert-notifications',
  templateUrl: './alert-notifications.component.html',
  styleUrls: ['./alert-notifications.component.scss']
})
export class AlertNotificationsComponent implements OnInit {

  constructor(public data: NotifierService) { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  id
  selectedRange: string = 'today'
  dateReportList: string [] = []
  distanceInKmList: number [] = []
  showDatepicker: boolean

  date = new Date();
  dd = String(this.date.getDate()).padStart(2, '0');
  ten_dd = String(this.date.getDate()-10).padStart(2, '0');
  mm = String(this.date.getMonth() + 1).padStart(2, '0'); //January is 0!
  yyyy = this.date.getFullYear();

  today = `${this.yyyy}-${this.mm}-${this.dd}`
  ten_days_ago = `${this.yyyy}-${this.mm}-${this.ten_dd}`

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(new Date())
  });

  public chartColors: Array<any> = [
    { // all colors in order
      backgroundColor: '#007dc7'
    }
  ]

  vehicle: string
  licensePlate: string

  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  }
  barChartType: ChartType = 'bar'
  barChartLegend = true
  barChartData: ChartDataSets[] = []
  barChartLabels: Label[] = []
  barChartPlugins = [];

  displayedColumns: string[] = ['date', 'distance'];
  reportList: any

  constructor(private _Activatedroute:ActivatedRoute, private rest:RestService) { }

  ngOnInit() {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.rest.dayReport(this.id).subscribe((response: any)=>{
      this.vehicle = response.vehicle
      this.licensePlate = response.licensePlate
      this.setGraph(response)
    })
  }

  setGraph(response:any) {
    this.reportList = response.report
    if(this.dateReportList.length>0) {
      this.dateReportList = []
      this.distanceInKmList = []
    }
    response.report.forEach(element => {
      this.dateReportList.push(element.dateReport)
      this.distanceInKmList.push(element.distanceInKm)
    });
    this.barChartData = [{ data: this.distanceInKmList, label: 'Kilometros' }]
    this.barChartLabels = [].concat(this.dateReportList)
  }

  updateGraph() {
    switch (this.selectedRange) {
      case 'today':
        this.rest.dayReport(this.id).subscribe((response: any)=>{ this.setGraph(response) })
        this.showDatepicker = false
        break;
      case 'week':
        this.rest.weekReport(this.id).subscribe((response: any)=>{ this.setGraph(response) })
        this.showDatepicker = false
        break;
      case 'custom':
        this.rest.customDateReport(this.id, this.ten_days_ago, this.today).subscribe((response: any)=>{ this.setGraph(response) })
        this.showDatepicker = true
        break;
    }
  }

  startChange(event:any) {
    this.rest.customDateReport(this.id, this.parseDate(event.value), this.parseDate(String(new Date()))).subscribe((response: any)=>{ this.setGraph(response) })
  }

  parseDate(date:string) {
    let a = new Date(Date.parse(date))
    let year = a.getFullYear()
    let month = String(a.getMonth()).length+1 === 1 ? `0${a.getMonth()+1}` : a.getMonth()+1
    let day = String(a.getDate()).length === 1 ? `0${a.getDate()}` : a.getDate()

    return `${year}-${month}-${day}`
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  showRangeDatepicker: boolean
  showDayDatepicker: boolean

  date = new Date()
  today = this.formatDate(this.date.toString())
  ten_days_ago = this.formatDate(new Date(this.date.getTime() - (10 * 24 * 60 * 60 * 1000)).toString())

  startDate: any
  endDate: any

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

  distanceColumns: string[] = ['date', 'distance'];
  routesColumns: string[] = ['id', 'start', 'end', 'display'];
  reportList: any
  routeList: any

  public routeList_length = 100;
  public routeList_pageSize = 15;
  public routeList_pageIndex = 0;
  public routeList_pageSizeOptions: number[] = [15, 30, 50, 100];
  public routeList_table:any

  constructor(private _Activatedroute:ActivatedRoute, private rest:RestService, private dialog: MatDialog) { }

  ngOnInit() {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.rest.dayReport(this.id).subscribe((response: any)=>{
      this.vehicle = response.vehicle
      this.licensePlate = response.licensePlate
      this.setGraph(response)
    })
    this.rest.listRouteByGps(this.id).subscribe((response:any)=> {
      this.routeList = response.reverse()
      this.routeList_length = this.routeList.length
      this.routeList_table = this.paginate(this.routeList,this.routeList_pageSize,this.routeList_pageIndex)
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
        this.showRangeDatepicker = false
        this.showDayDatepicker = false
        break;
      case 'week':
        this.rest.weekReport(this.id).subscribe((response: any)=>{ this.setGraph(response) })
        this.showRangeDatepicker = false
        this.showDayDatepicker = false
        break;
      case 'custom':
        this.rest.customDateReport(this.id, this.ten_days_ago, this.today).subscribe((response: any)=>{ this.setGraph(response) })
        this.showRangeDatepicker = true
        this.showDayDatepicker = false
        break;
      case 'day':
        this.rest.dayReport(this.id).subscribe((response: any)=>{ this.setGraph(response) })
        this.showRangeDatepicker = false
        this.showDayDatepicker = true
        break;
    }
  }

  startChange(event:any) {
    this.startDate = event.value
    this.endDate = this.endDate ? this.endDate : this.today
    this.rest.customDateReport(this.id, this.formatDate(this.startDate.toString()), this.formatDate(this.endDate.toString())).subscribe((response: any)=>{ this.setGraph(response) })
  }

  endChange(event:any) {
    this.endDate = event.value
    this.startDate = this.startDate ? this.startDate : this.ten_days_ago
    this.rest.customDateReport(this.id, this.formatDate(this.startDate.toString()), this.formatDate(this.endDate.toString())).subscribe((response: any)=>{ this.setGraph(response) })
  }

  loadDayReport(event:any) {
    this.rest.customDateReport(this.id, this.formatDate(event.value), this.formatDate(event.value)).subscribe((response: any)=>{ this.setGraph(response) })
  }

  formatDate(date:string) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
  }

  loadNextPage(event) {
    this.routeList_pageIndex = event.pageIndex
    this.routeList_pageSize = event.pageSize
    this.routeList_table = this.paginate(this.routeList,this.routeList_pageSize,this.routeList_pageIndex)
  }

  paginate(array, page_size, page_number) {
    return array.slice(page_number * page_size, page_number * page_size + page_size);
  }

  openRoute(route_id:string) { this.dialog.open(RoutesModal, { data: {id:route_id} }); }

}

import { Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { LatLon } from 'src/app/models/latlon.model';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

export const DEFAULT_ANCHOR = [0.5, 1];
export const DEFAULT_ICON_PATH = '../../../assets/';

@Component({
  selector: 'route-modal',
  templateUrl: './route.modal.html',
  styles: ['div { height: 512px; width: 512px; display: block; margin-left: auto; margin-right: auto; }']
})
export class RoutesModal implements OnInit {

  public anchor: number[] = DEFAULT_ANCHOR
  public map: Map
  public path: any
  public pathMarks: Feature<any>[] = []

  id:string
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private rest:RestService) {this.id = data.id}

  ngOnInit(): void {
    this.rest.listAllPositionByRoute(this.id).subscribe((response) => {
      this.path = response
      this.map = this.createOpenLayerMap()
      if(this.path) {
        this.pathMarks = this.createPathMarkers(this.path, this.id);
        this.addMarksInMap(this.pathMarks, 'pathMarks');
        //TODO: Arreglar estas lineas
        //this.addLinesInMap(this.pathData)
      }
    })
  }

  private createOpenLayerMap(): Map {
    let average_longitude:number = 0
    let average_latitude:number = 0
    this.path.forEach(element => {
      average_longitude += element.longitude
      average_latitude += element.latitude
    });
    average_longitude /= this.path.length
    average_latitude /= this.path.length
    let openLayerMap: Map = new Map({
      target: 'map',
      layers:[
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([average_longitude, average_latitude]),
        zoom: 16
      })
    });

    return openLayerMap;
  }

  private createPathMarkers(pathData:Array<LatLon>, pathId):Array<Feature<any>> {
    let pathMarks:Array<Feature<any>> = [];
    if(pathData){
      for (let i = 0; i < pathData.length; i++) {
        const pathPoint = pathData[i];
        let marker = this.createPathMark(pathPoint, pathId);
        pathMarks.push(marker);
      }
    }
    return pathMarks;
  }

  private addMarksInMap(marks: Array<Feature<any>>, name:string){
    const vectorSource = new VectorSource({
      features: marks
    });
    const vectorLayer = new VectorLayer({
        source: vectorSource,
        className: name
    });

    if(this.map){
      this.map.addLayer(vectorLayer);
    } else {
      setTimeout(() => {
        this.map.addLayer(vectorLayer);
      }, 10);
    }
  }

  private createPathMark(path: LatLon, path_id): Feature<any>{
    let icon_path = path.spd > 0 ? `${DEFAULT_ICON_PATH}track_move.svg` : `${DEFAULT_ICON_PATH}track_stopped.svg`

    let marker = new Feature({
      geometry: new Point(fromLonLat([path.longitude, path.latitude])),
      name: path_id
    });

    let icon = new Style({
      image: new Icon({
        anchor: [0.25, 1],
        src: icon_path
      })
    });

    marker.setStyle(icon);
    return marker;
  }

}

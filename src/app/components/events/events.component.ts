import { Component, Inject, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  event_list: any;
  camera_list: any
  displayedColumns: string[] = ['imei', 'event', 'licensePlate', 'created', 'position'];

  public length = 100;
  public pageSize = 13;
  public pageIndex = 0;
  public pageSizeOptions: number[] = [13, 30, 50, 100];

  private selectedImei: string

  constructor(private rest: RestService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.rest.getAllDMS(this.pageIndex, this.pageSize).subscribe((response:any)=>{
      this.pageIndex = this.pageIndex
      this.pageSize = this.pageSize
      this.length = response.totalElements
      this.event_list = response
    }, error => console.error(error));

    this.rest.listAllCameras().subscribe((response)=>{
      this.camera_list = response
    }), error => console.error(error)
  }

  loadNextPage(event) {
    if(this.selectedImei) {
      this.rest.getDMSByImei(event.pageIndex, event.pageSize, this.selectedImei.toUpperCase()).subscribe((response:any) => {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.length = response.totalElements
        this.event_list = response
      }, error => console.error(error));
    } else {
      this.rest.getAllDMS(event.pageIndex, event.pageSize).subscribe((response:any) => {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.length = response.totalElements
        this.event_list = response
      }, error => console.error(error));
    }
  }

  loadByImei() {
    this.rest.getDMSByImei(this.pageIndex, this.pageSize, this.selectedImei.toUpperCase()).subscribe((response:any) => {
      this.pageIndex = this.pageIndex
      this.pageSize = this.pageSize
      this.length = response.totalElements
      this.event_list = response
    }, error => console.error(error));
  }

  openModal(event:any) { this.dialog.open(EventsModal, { data: event }); }

}

import { Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Point } from 'ol/geom';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export const DEFAULT_ANCHOR = [0.5, 1];
export const DEFAULT_ICON_PATH = '../../../assets/';

@Component({
  selector: 'events-modal',
  templateUrl: './events.modal.html',
  styles: ['div { height: 512px; width: 512px; display: block; margin-left: auto; margin-right: auto; }']
})
export class EventsModal implements OnInit {

  public anchor: number[] = DEFAULT_ANCHOR
  public map: Map
  public path: any
  public pathMarks: Feature<any>[] = []

  model:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {this.model = data}

  ngOnInit(): void {
    this.map = this.createOpenLayerMap()
    this.pathMarks = this.createPathMarkers({lattiude: this.model.latitude, longitude: this.model.longitude}, this.model.id);
    this.addMarksInMap(this.pathMarks, 'pathMarks');
  }

  private createOpenLayerMap(): Map {
    let openLayerMap: Map = new Map({
      target: 'events_map',
      layers:[
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([this.model.longitude, this.model.latitude]),
        zoom: 16
      })
    });

    return openLayerMap;
  }

  private createPathMarkers(pathData:any, pathId):Array<Feature<any>> {
    let pathMarks:Array<Feature<any>> = [];
    let marker = this.createPathMark(pathData, pathId);
    pathMarks.push(marker);
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

  private createPathMark(path: any, path_id): Feature<any>{
    let icon_path = `${DEFAULT_ICON_PATH}track_move.svg`

    let marker = new Feature({
      geometry: new Point(fromLonLat([path.longitude, path.lattiude])),
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


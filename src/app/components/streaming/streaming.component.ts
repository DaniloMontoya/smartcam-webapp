import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import * as SockJS from 'sockjs-client';
import { DeviceGps } from 'src/app/models/devicegps.model';
import { LatLon } from 'src/app/models/latlon.model';
import { RestService } from 'src/app/services/rest.service';
import { DEFAULT_ANCHOR, DEFAULT_ICON_PATH } from '../map/map.component';
import { DOMAIN_URL } from 'src/environments/domain.prod';
import JSMpeg from '@cycjimmy/jsmpeg-player';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.scss']
})
export class StreamingComponent implements OnInit {

  @ViewChild('streaming', {static: true}) streamingcanvas: ElementRef

  public isChangedBlock = {};
  public anchor: number[] = DEFAULT_ANCHOR
  public map: Map;
  public search: string
  public GPSMarks: Feature<any>[] = []
  public pathMarks: Feature<any>[] = []
  public stompClient: CompatClient | undefined
  public GPSData: Array<DeviceGps> = []
  public pathData: Array<LatLon> = []
  public selectedDevice: DeviceGps
  public minimize_carlist: boolean = false
  public path_is_drawn: boolean = false
  public id

  public displayedColumns: string[] = ['imei', 'vehiculo', 'camara', 'placa'];

  constructor(private _Activatedroute:ActivatedRoute, public rest: RestService) { }

  ngOnInit() {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.map = this.createOpenLayerMap();
    this.makeCursorToDrag()
    this.loadGPSData();
    this.initWebsocket()
    new JSMpeg.VideoElement('#canvas', 'ws://localhost:9999', {canvas: this.streamingcanvas.nativeElement , autoplay: true, loop: true})
  }

  ngOnDestroy() {
    this.stompClient.disconnect()
  }

  initWebsocket(){
    let ws:WebSocket = new SockJS(`${DOMAIN_URL}/gps-websocket`);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, (frame:any) => {
      if(!that.stompClient){
        return;
      }

      this._subcribeTopic('/topic/gps');
    });
  }

  private _subcribeTopic(topic: string) {
    if(!this.stompClient){
      console.error("Error to configure mailbot websocket");
      return;
    }
    this.stompClient.subscribe(topic, (message:any) => {
      if (message.body) {
        let gpsModel: any = JSON.parse(message.body);
        this._updateWebSocketResponse(gpsModel);
      }
    });
  }

  private _updateWebSocketResponse (response:any) {
    this.GPSData.forEach((data)=>{
      if(data.imei === response.id) {
        data.alert = response.alert
        data.crs = response.crs
        data.imei = response.id
        data.ignition = response.ignition
        data.latitude = response.latitude
        data.licensePlate = response.licensePlate
        data.longitude = response.longitude
        data.spd = response.spd

        this.GPSMarks.forEach((mark)=>{
          let mark_id = mark.get("name")
          if(mark_id === data.imei) {
            mark.setStyle(this.setVehicleIcon(data))
            mark.getGeometry().setCoordinates(fromLonLat([data.longitude, data.latitude]))
            if(this.selectedDevice && data.imei === this.selectedDevice.imei)
              this.centerViewToDevice(this.selectedDevice)
          }
        })

        if(this.path_is_drawn) {
          this.pathMarks.forEach((mark)=>{
            let mark_id = mark.get("name")
            if(mark_id === data.activeIdRoute)
              this.addPathToData(mark_id, {created: data.created, crs: data.crs, latitude: data.latitude, longitude: data.longitude, spd: data.spd})
          })
        }
      }
    })
  }

  private loadGPSData(){
    this.rest.listAll().subscribe((response:Array<DeviceGps>) => {
      this.GPSData = response
      if(this.GPSData) {
        this.GPSMarks = this.createGPSMarkers(this.GPSData);
        this.addMarksInMap(this.GPSMarks, 'gpsMarks');
        if(this.id) {
          this.GPSData.forEach((data) => {
            if(this.id === data.imei)
              this.centerViewToDevice(data)
          })
        }
      }
    }, error => console.error(error));
  }

  public addPathToData(pathId, point: LatLon){
    this.removePath()
    this.pathData.push(point)
    this.pathMarks = this.createPathMarkers(this.pathData, pathId);
    this.addMarksInMap(this.pathMarks, 'pathMarks');
    this.path_is_drawn = true
  }

  private removeLayers(className:string) {
    let layersToRemove = [];
    this.map.getLayers().forEach((layer) => {
      if(layer['className_'] != undefined && layer['className_'] === className)
        layersToRemove.push(layer);
    });
    let len = layersToRemove.length;
    for(let i = 0; i < len; i++) {
      this.map.removeLayer(layersToRemove[i]);
    }
  }

  public centerViewToDevice(device: DeviceGps) {
    this.selectedDevice = device
    this.map.getView().setCenter(fromLonLat([device.longitude, device.latitude]));
    this.map.getView().setZoom(16);
  }

  public removePath() {
    this.removeLayers("line")
    this.removeLayers("pathMarks")
    this.path_is_drawn = false
  }

  private createGPSMarkers(GPSData:Array<DeviceGps>):Array<Feature<any>> {
    if (!GPSData) return
    let GPSMarks:Array<Feature<any>> = [];
    for (let i = 0; i < GPSData.length; i++) {
      const GPSDevice = GPSData[i];
      let marker = this.createGPSMark(GPSDevice);
      GPSMarks.push(marker);
    }
    return GPSMarks;
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

  private createOpenLayerMap(): Map {
    let openLayerMap: Map = new Map({
      target: 'map',
      layers:[
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([-74.297333, 4.570868]),
        zoom: 6
      })
    });

    return openLayerMap;
  }

  private makeCursorToDrag() {
    this.map.on("pointermove", (evt) => {
      var hit = this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => { return true; });

      this.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
  });
    /**
    this.map.getViewport().style.cursor = "-webkit-grab";
    this.map.on('pointerdrag', (evt) => {
      this.map.getViewport().style.cursor = "-webkit-grabbing";
    });

    this.map.on('pointermove', (evt) => {
      this.map.getViewport().style.cursor = "-webkit-grab";
    });
    */
  }

  private createGPSMark(GPSDevice: DeviceGps): Feature<any>{
    let marker = new Feature({
      geometry: new Point(fromLonLat([GPSDevice.longitude, GPSDevice.latitude])),
      name: GPSDevice.imei
    });

    let icon = this.setVehicleIcon(GPSDevice)

    marker.setStyle(icon);
    return marker;
  }

  setVehicleIcon(GPSDevice: DeviceGps) {
    let icon_path = `${DEFAULT_ICON_PATH+GPSDevice.vehicle+GPSDevice.ignition}.svg`
    let icon = new Style({
      image: new Icon({
        anchor: this.anchor,
        src: icon_path
      })
    });
    return icon
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

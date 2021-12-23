import { Component, OnInit } from '@angular/core';
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
import { Streaming } from 'src/app/models/streaming.model';
import FlvJs from 'flv.js';
import { DOMAIN_URL } from 'src/environments/domain.prod';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.scss']
})
export class StreamingComponent implements OnInit {

  public streamStatus: Streaming
  public urlStreaming: string

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
  public id

  public streaming_icon: string = "fullscreen"
  public isStreamingFullScreen: boolean = false
  public streaming_col_css: string = 'col-sm-8'

  public displayedColumns: string[] = ['imei', 'vehiculo', 'placa', 'camara', 'imeiCamara'];

  constructor(private _Activatedroute:ActivatedRoute, public rest: RestService) { }

  ngOnInit() {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.map = this.createOpenLayerMap()
    this.makeCursorToDrag()
    this.loadGPSData()
    this.initWebsocket()
  }

  ngOnDestroy() {
    this.stompClient.disconnect()
  }

  initWebsocket(){
    let ws:WebSocket = new SockJS(`/gps-websocket`);
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
      console.error("Error to configure websocket");
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
        let lastIgnition = data.ignition
        data.alert = response.alert
        data.crs = response.crs
        data.imei = response.id
        data.ignition = response.ignition
        data.latitude = response.latitude
        data.licensePlate = response.licensePlate
        data.longitude = response.longitude
        data.spd = response.spd
        this.centerViewToDevice(data)

        this.GPSMarks.forEach((mark)=>{
          let mark_id = mark.get("name")
          if(mark_id === data.imei) {
            if(lastIgnition !== data.ignition) mark.setStyle(this.setVehicleIcon(data))
            mark.getGeometry().setCoordinates(fromLonLat([data.longitude, data.latitude]))
          }
        })
      }
    })
  }

  private loadGPSData(){
    this.rest.listAll().subscribe((response:Array<DeviceGps>) => {
      this.GPSData = response
      if(this.GPSData) {
        this.GPSData.forEach((data) => {
          if(this.id === data.imei) {
            this.GPSMarks = this.createGPSMarkers([data]);
            this.addMarksInMap(this.GPSMarks, 'gpsMarks');
            this.centerViewToDevice(data)
          }
        })
      }
    }, error => console.error(error));
  }

  public centerViewToDevice(device: DeviceGps) {
    this.selectedDevice = device
    this.map.getView().setCenter(fromLonLat([device.longitude, device.latitude]))
    this.map.getView().setZoom(16)
    this.rest.askStreamingCamera(device?.imeiCamera).subscribe((response:Streaming)=>{
      this.streamStatus = response
      this.urlStreaming = `http://${DOMAIN_URL}/video.html?imei=${device.imeiCamera}`
    })
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
      target: 'minimap',
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

  goFullScreen() {
    this.isStreamingFullScreen = !this.isStreamingFullScreen
    this.streaming_icon = this.isStreamingFullScreen ? 'fullscreen' :  'fullscreen_exit'
    this.streaming_col_css = this.isStreamingFullScreen ? 'col-sm-12' :  'col-sm-8'
  }
}

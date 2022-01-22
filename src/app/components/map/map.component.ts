import { Component, OnInit, OnDestroy } from '@angular/core';
import { Map, View } from 'ol';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';
import Feature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import { RestService } from 'src/app/services/rest.service';
import { DeviceGps } from 'src/app/models/devicegps.model';
import { LineString, Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import { CompatClient, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { LatLon } from 'src/app/models/latlon.model';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'src/app/services/notifier.service';
import { ConfirmDialog } from 'src/app/shared/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DOMAIN_URL } from 'src/environments/domain.prod';

export const DEFAULT_ANCHOR = [0.5, 1];
export const DEFAULT_ICON_PATH = '../../../assets/';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

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
  public popDevice: DeviceGps
  public minimize_carlist: boolean = false
  public path_is_drawn: boolean = false
  public id

  constructor(public rest: RestService, private _Activatedroute:ActivatedRoute, private snackBar: NotifierService, public dialog: MatDialog) { }

  ngOnInit() {
    this.id = this._Activatedroute.snapshot.paramMap.get("id");
    this.map = this.createOpenLayerMap();
    this.loadGPSData();
    this.initWebsocket()
    this.makeCursorToDrag()
  }

  ngOnDestroy() {
    this.stompClient.disconnect()
    this.snackBar = undefined
  }

  initWebsocket(){
    this.stompClient = Stomp.over(() => new SockJS(`${DOMAIN_URL}/gps-websocket`));
    this.stompClient.connect({}, this.connect_callback, this.error_callback)
    this.stompClient.reconnect_delay = 2500;
  }

  public connect_callback = () => {
    this._subcribeTopic('/topic/gps');
  }

  public error_callback = (error) => {
    console.error(error, "Reconnecting WS", `${DOMAIN_URL}/gps-websocket`);
    setTimeout(() => { this.initWebsocket(); }, 2500);
  };

  private _subcribeTopic(topic: string) {
    this.stompClient.subscribe(topic, (message:any) => {
      if(!message.body)
        return;

      let model: any = JSON.parse(message.body);
        switch (topic) {
          case '/topic/gps':
            this._updateWebSocketResponse(model);
            break;
        }
    });
  }

  private _updateWebSocketResponse (response:any) {
    this.GPSData.forEach((data)=>{
      if(data.imei === response.id) {
        let lastIgnition = data.ignition
        data.alert = response.alert
        //data.crs = response.crs
        //data.imei = response.id
        data.ignition = response.ignition
        data.latitude = response.latitude
        //data.licensePlate = response.licensePlate
        data.longitude = response.longitude
        data.spd = response.spd
        data.cameraStatus = response.cameraStatus
        //data.imeiCamera = response.imeiCamera
        data.lastUpdate = new Date().toString();

        if(response.alert || response.alert.length !== 0 )
          this.showAlertVehicle(response.alert, data.imei)

        this.GPSMarks.forEach((mark)=>{
          let mark_id = mark.get("name")
          if(mark_id === data.imei) {
            if(lastIgnition !== data.ignition) {
              mark.setStyle(this.setVehicleIcon(data))
              this.reorderGPSDataByIgnition()
            }
            mark.getGeometry().setCoordinates(fromLonLat([data.longitude, data.latitude]))
            if(this.selectedDevice && data.imei === this.selectedDevice.imei)
              this.centerViewToDevice(this.selectedDevice)
          }
        })

        if(this.popDevice?.imei === response.id)
          this.popDevice = data

        if(this.path_is_drawn)
          this.addPathToData(data.activeIdRoute, {created: data.created, crs: data.crs, latitude: data.latitude, longitude: data.longitude, spd: data.spd})
      }
    })
  }

  private loadGPSData(){
    this.rest.listAll().subscribe((response:Array<DeviceGps>) => {
      this.GPSData = response
      if(this.GPSData) {
        this.GPSMarks = this.createGPSMarkers(this.GPSData);
        this.addMarksInMap(this.GPSMarks, 'gpsMarks');
        this.initPoupEvent(this.map);
        this.reorderGPSDataByIgnition()
        if(this.id) {
          this.GPSData.forEach((data) => {
            if(this.id === data.imei)
              this.centerViewToDevice(data)
          })
        } else {
          this.rest.getClientPosition().subscribe((res:any)=>{
            this.map.getView().setCenter(fromLonLat([res.longitude, res.latitude]));
          })
        }
      }
    }, error => console.error(error));
  }

  private showAlertVehicle(alert: string, imei:string) {
    if(alert !== '00;Not Message;00')
      this.snackBar.showNotification(alert, 'Revisar', imei, new Date())
  }

  public removePath() {
    this.removeLayers("line")
    this.removeLayers("pathMarks")
    this.path_is_drawn = false
  }

  public removeMarks() {
    this.removeLayers("gpsMarks")
  }

  public loadPathData(pathId){
    this.removePath()
    this.rest.listAllPositionByRoute(pathId).subscribe((response:Array<LatLon>) => {
      this.pathData = response
      if(this.pathData) {
        this.pathMarks = this.createPathMarkers(this.pathData, pathId);
        this.addMarksInMap(this.pathMarks, 'pathMarks');
        //TODO: Arreglar estas lineas
        //this.addLinesInMap(this.pathData)
        this.path_is_drawn = true
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
    this.removeMarks()
    this.GPSMarks = this.createGPSMarkers([device]);
    this.addMarksInMap(this.GPSMarks, 'gpsMarks');
    this.selectedDevice = device
    this.map.getView().setCenter(fromLonLat([device.longitude, device.latitude]));
    this.map.getView().setZoom(16);
  }

  public removeSelected() {
    this.removeMarks()
    this.selectedDevice=null
    this.GPSMarks = this.createGPSMarkers(this.GPSData);
    this.addMarksInMap(this.GPSMarks, 'gpsMarks');
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

  private reorderGPSDataByIgnition() {
    this.GPSData.sort((first) => {
      if(first.ignition === 'On') { return -1; }
      if(first.ignition === 'Off') { return 1; }
      return 0;
    })
  }

  private addLinesInMap(poinpathData:Array<LatLon>) {
    let featuresList: Feature<any>[] = []
    for (let i = 0; i < poinpathData.length-1; i++) {
      let lonlat =fromLonLat([poinpathData[i].longitude, poinpathData[i].latitude]);
      let lonlat2 = fromLonLat([poinpathData[i+1].longitude, poinpathData[i+1].latitude]);

      let vector = new LineString([lonlat, lonlat2])
      let feature = new Feature({
        geometry: vector,
      })
      featuresList.push(feature)
    }
    const vectorSource = new VectorSource({
      features: featuresList
    });
    const vectorLayer = new VectorLayer({
        source: vectorSource,
        className: "line"
    });
    this.map.addLayer(vectorLayer)
  }

  private makeCursorToDrag() {
    this.map.on("pointermove", (evt) => {
      var hit = this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => { return true; });
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : ''
  });
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
    let icon_path = `${DEFAULT_ICON_PATH}track_move.svg`

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

  private initPoupEvent(map:Map){

    let container: HTMLElement = document.getElementById('popup');
    container.hidden = false;

    var closer = document.getElementById('popup-closer');
    let overlay: Overlay = this.createOverlay(container);

    map.addOverlay(overlay);
    this.setupCloserButton(closer, overlay);

    //click Event
    map.on('singleclick', (event) => {
      this.hidePoup(closer, overlay);
      map.forEachFeatureAtPixel(event.pixel,(feature, layer) => {
        let car_imei = feature.get("name")
        this.GPSData.forEach((element) => { if(element.imei === car_imei) this.popDevice = element});
        let coordinate = event.coordinate;
        this.removePath()
        overlay.setPosition(coordinate);
      });
    });
  }

  private createOverlay(container: HTMLElement): Overlay{
    return new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
          duration: 250
      }
    });
  }

  private setupCloserButton(closerButton: HTMLElement, overlay:Overlay){
    closerButton.onclick = ()=> {
      this.hidePoup(closerButton, overlay);
      return false;
    };
  }

  private hidePoup(closerButton: HTMLElement, overlay:Overlay){
    overlay.setPosition(undefined);
    closerButton.blur();
  }

  openTurnOffDialog(_vehicle: any): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '333px',
      data: {dialog: 'apagar', vehicle: _vehicle}
    });

    dialogRef.afterClosed().subscribe(result => {
      //If you wan't to do something here lol
    });
  }

  openUnlockDialog(vehicle: any): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '333px',
      data: {dialog: 'desbloquear', vehicle: vehicle}
    });

    dialogRef.afterClosed().subscribe(result => {
      //If you wan't to do something here lol
    });
  }

  getCenterPosition(array: Array<DeviceGps>) {
    let positon_length = array.length

    let x = 0
    let y = 0
    let z = 0

    array.forEach((element: DeviceGps) => {
      let lat = element.latitude * Math.PI / 180
      let lon = element.longitude * Math.PI / 180

      let a = Math.cos(lat) * Math.cos(lon)
      let b = Math.cos(lat) * Math.sin(lon)
      let c = Math.sin(lat)

      x += a
      y += b
      z += c
    });

    x /= positon_length
    y /= positon_length
    z /= positon_length

    let lon = Math.atan2(y,x)
    let hyp = Math.sqrt(x * x + y * y)
    let lat = Math.atan2(z, hyp)

    return [lat * 180 / Math.PI, lon * 180 / Math.PI]
  }

}

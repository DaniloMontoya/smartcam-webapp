import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from 'src/environments/client.prod';
import { DeviceGps } from '../models/devicegps.model';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  listAll() {
    return this.http.get(`rest/v1/gps`)
  }

  doUpdateVehicle(device: DeviceGps) {
    return this.http.put(`rest/v1/gps/doUpdateVehicle?imei=${device.imei}&licensePlate=${device.licensePlate}&vehicle=${device.vehicle}`,{});
  }

  listAllAsPage(page, size) {
    return this.http.get(`rest/v1/gps/listAll/${page}/${size}`)
  }

  listAllByClientLicensePlate(page, size, licensePlate) {
    return this.http.get(`/rest/v1/gps/listAllBylicensePlate/${page}/${size}/${licensePlate}`)
  }

  listAllPositionByRoute(idRoute) {
    return this.http.get(`rest/v1/gps/routes/tracks/${idRoute}`)
  }

  listAllSosAlert(page, size) {
    return this.http.get(`rest/v1/gps/sosAlerts/${page}/${size}`)
  }

  listAllSpeedAlert(page, size) {
    return this.http.get(`rest/v1/gps/speedAlerts/${page}/${size}`)
  }

  shutdownVehicle(imei:string) {
    return this.http.post(`rest/v1/gps/ignition/off/${imei}`, {})
  }

  unlockVehicle(imei:string) {
    return this.http.post(`rest/v1/gps/ignition/on/${imei}`, {})
  }

  dayReport(imei:string) {
    return this.http.get(`rest/v1/gps/report/${imei}`)
  }

  weekReport(imei:string) {
    return this.http.get(`rest/v1/gps/report/lastWeek/${imei}`)
  }

  customDateReport(imei:string, startDate:string, endDate:string) {
    return this.http.get(`rest/v1/gps/report/${imei}/${startDate}/${endDate}`)
  }

  listAllSosAlertByLicensePlate(page, size, licensePlate) {
    return this.http.get(`rest/v1/gps/sosAlerts/${page}/${size}/${licensePlate}`)
  }

  listAllSpeedAlertByLicensePlate(page, size, licensePlate) {
    return this.http.get(`rest/v1/gps/speedAlerts/${page}/${size}/${licensePlate}`)
  }

  listAllCameras() {
    return this.http.get(`rest/cameras/v1/all`)
  }

  cameraToVehicle(imeiCamera:string, imeiVehicle:string) {
    return this.http.put(`rest/v1/gps/add/camera/${imeiCamera}/to/vehicle/${imeiVehicle}`, {})
  }

  askStreamingCamera(imeiCamera:string) {
    return this.http.get(`rest/cameras/v1/isLive/${imeiCamera}`)
  }

  listRouteByGps(imei:string) {
    return this.http.get(`rest/v1/gps/routes/${imei}`)
  }

  getClient() {
    return this.http.get('rest/client')
  }

  updateClient(client:Client) {
    return this.http.put('rest/client', client)
  }

  getClientPosition() {
    return this.http.get('rest/client/center')
  }

}

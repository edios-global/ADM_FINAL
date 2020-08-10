import { CafePayload, SearchCafeRequest, EditCafDetail, RemoveDocument } from './../../modals/payload';
import { LoginRequest, CafeCountRequest } from '../../modals/payload';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { UploadCafImageData } from 'src/app/modals/modal';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HTTP) {
    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    //  this.http.setHeader('*', 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type ,Accept');
    this.http.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.http.setHeader('*', 'Accept', 'application/json');
    this.http.setHeader('*', 'Content-type', 'application/json');
  }

  // baseUrl = "http://202.164.43.200:58080/Aerial_Mobiles_API/";
  // baseUrl = "http://192.168.5.113:58080/Aerial_Mobiles_API/";
   baseUrl = "http://admapi.edios.global:58080/Aerial_Mobiles_API/";


  login(payload: LoginRequest) {
    let apiUrl = this.baseUrl.concat("authenticateUser");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  cafCountDetails(payload: CafeCountRequest) {
    let apiUrl = this.baseUrl.concat("fetchCafcountdetails");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  uploadCaf(payload: CafePayload) {
    let apiUrl = this.baseUrl.concat("UploadCafdetails");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  SearchCaf(payload: SearchCafeRequest) {
    let apiUrl = this.baseUrl.concat("fetchCafDetails");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  uploadCafImage(file: any) {
    let apiUrl = this.baseUrl.concat("UploadCAFimage");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, file, {});
  }

  uploadCafImageData(data: UploadCafImageData) {
    let apiUrl = this.baseUrl.concat("UploadCafImagesData");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, data, {});
  }

  editCafData(payload: CafePayload) {
    let apiUrl = this.baseUrl.concat("UploadCafdetails");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  getImageByCafId(payload: EditCafDetail) {
    let apiUrl = this.baseUrl.concat("fetchCafImagesByCafID");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  removeDocumnet(payload: RemoveDocument) {
    let apiUrl = this.baseUrl.concat("deleteCafImage");
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }



}

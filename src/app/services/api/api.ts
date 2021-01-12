import { CafePayload, SearchCafeRequest, EditCafDetail, RemoveDocument, ResubmitCafPayload } from './../../modals/payload';
import { LoginRequest, CafeCountRequest } from '../../modals/payload';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { UploadCafImageData } from 'src/app/modals/modal';


@Injectable({
  providedIn: 'root'
})  
export class ApiService {
  // version = ""
  version = "V1"


  constructor(private http: HTTP) {
    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    //  this.http.setHeader('*', 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type ,Accept');
    this.http.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.http.setHeader('*', 'Accept', 'application/json');
    this.http.setHeader('*', 'Content-type', 'application/json');
  }
  // baseUrl = "http://202.164.43.200:58080/Aerial_Mobiles_API/";
  baseUrl = "http://192.168.5.129:58080/Aerial_Mobiles_API/"; // test server
  // baseUrl = "http://192.168.5.108:58080/Aerial_Mobiles_API/";
  // baseUrl = "http://192.168.5.113:58080/Aerial_Mobiles_API/";
  //  baseUrl = "http://admapi.edios.global:58080/Aerial_Mobiles_API/"; // production

   AdmAppVersion(payload: LoginRequest) {
    let apiUrl = this.baseUrl.concat("AdmAppVersion");
    this.http.setDataSerializer('json');  
    return this.http.post(apiUrl, payload, {});
  }
  login(payload: LoginRequest) {
    let apiUrl = this.baseUrl.concat("authenticateUser"+this.version);
    this.http.setDataSerializer('json');  
    return this.http.post(apiUrl, payload, {});
  }

  cafCountDetails(payload: CafeCountRequest) {
    let apiUrl = this.baseUrl.concat("fetchCafcountdetails"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  uploadCaf(payload: CafePayload) {
    let apiUrl = this.baseUrl.concat("UploadCafdetails"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  SearchCaf(payload: SearchCafeRequest) {
    let apiUrl = this.baseUrl.concat("fetchCafDetails"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  uploadCafImage(file: any) {
    let apiUrl = this.baseUrl.concat("UploadCAFimage"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, file, {});
  }

  uploadCafImageData(data: UploadCafImageData) {
    let apiUrl = this.baseUrl.concat("UploadCafImagesData"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, data, {});
  }

  editCafData(payload: CafePayload) {
    let apiUrl = this.baseUrl.concat("UploadCafdetails"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }
  reSubmitCafdetail(payload: ResubmitCafPayload) {
    let apiUrl = this.baseUrl.concat("reSubmitCafdetail"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }


  getImageByCafId(payload: EditCafDetail) {
    let apiUrl = this.baseUrl.concat("fetchCafImagesByCafID"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }

  removeDocumnet(payload: RemoveDocument) {
    let apiUrl = this.baseUrl.concat("deleteCafImage"+this.version);
    this.http.setDataSerializer('json');
    return this.http.post(apiUrl, payload, {});
  }



}

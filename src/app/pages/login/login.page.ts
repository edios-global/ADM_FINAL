import { LocalStorageService } from './../../services/storage/localStorage';

import { LoginService } from './../../services/loginService';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modals/modal';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Market } from '@ionic-native/market/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { LoginRequest, AppVersionResponse } from 'src/app/modals/payload';
import { AppConstants } from 'src/app/utils/AppConstants';
import { ApiService } from 'src/app/services/api/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordType = false;
  iconName = "eye-outline";
  user = new User();
  tag = "LoginPage"
  contactClass="hide";
  buildVersion = 1.0;
  appV = "";
  constructor(private loginService: LoginService,
    private localstorageService: LocalStorageService,
    private router: Router,
    private storage: NativeStorage,
    private market: Market,
    private appversion: AppVersion,
    private apiservice: ApiService,
    private platform: Platform) {
    
    // this.localstorageService.getDistributor()
    //   .then((distributor) => {
    //     console.log("Login Page" + JSON.stringify(distributor));
    //     if (distributor != null) {
    //       this.router.navigate(['/dashboard']);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("ADM" + JSON.stringify(err))
    //   })
  }


  ionViewDidEnter() {
    this.storage.setItem('getBack', "true");
    console.log("loginGetBack Stored");
  }

  ionViewWillLeave() {
    this.storage.remove("getBack");
    console.log("loginGetBack Removed");
  }

  ionViewWillEnter() {
    this.appversion.getVersionNumber().then((res) => {
      this.appV = res;
      var loginRequest = new LoginRequest();
      loginRequest.signatureKey = AppConstants.signatureKey
      this.apiservice.AdmAppVersion(loginRequest).then((res) => {
        var abc: AppVersionResponse = JSON.parse(res.data);
        console.log("Login  AppUpdate Current "+ this.appV +" ===  Api"+abc.Result_Output)

        if (this.appV != abc.Result_Output) {
          if (window.confirm("Update Required")) {
            this.market.open('com.edios.adm');
          }
          else {
            navigator['app'].exitApp();
          }
        }
      })

    })

  
    // var loginRequest = new LoginRequest();
    // loginRequest.signatureKey = AppConstants.signatureKey


    // this.apiservice.AdmAppVersion(loginRequest).then((res) => {

    //   if (this.apiversion != res.data.Result_Output) {
    //     if (window.confirm("Update Required")) {
    //       this.market.open('com.edios.adm');
    //     }
    //     else {
    //       navigator['app'].exitApp();
    //     }
    //   }
    // });
  }



  ngOnInit() {
  }


  togglePassword() {

    this.passwordType = !this.passwordType;
  
    this.iconName == "eye-outline" ? this.iconName = "eye-off-outline" : this.iconName = "eye-outline";
    if(this.contactClass=="hide"){
      this.contactClass ="show"
    }
    else{
      this.contactClass ="hide"
    }
  }
  validateInputs() {

    if (this.loginService.validateInputs(this.user)) {
      this.loginService.authenticateUser(this.user);
    }

  }
  signOut() {

  }
}

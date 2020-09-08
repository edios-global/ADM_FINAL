import { LocalStorageService } from 'src/app/services/storage/localStorage';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DistributorDetails } from './modals/modal';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';
import { AppConstants } from './utils/AppConstants';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ApiService } from './services/api/api';
import { LoginRequest } from './modals/payload';
import { tick } from '@angular/core/testing';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  distributorName = "";
  dashboardClass = "active";
  contactClass = "noactive";
  apiversion = "";

  constructor(
    private broadcaster: Broadcaster,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: NativeStorage,
    private screenOrientation: ScreenOrientation,
    private localstorge: LocalStorageService,
    private appversion:AppVersion,
    private api:ApiService
  ) {
    this.appversion.getVersionNumber().then((res)=>{
      console.log("AppComponent version name" + res);
      this.apiversion = res;
    })
    this.initializeApp();
    this.backPressed();


    this.localstorge.getDistributor()
      .then((res) => {
        if (res != null) {
          var distributore = new DistributorDetails();
          distributore = res;
          this.distributorName = distributore.distributorName;
        }
      })



      this.broadcaster.addEventListener('user').subscribe((event) => {
        console.log("Appcomponent" ,"broadcast even received"+JSON.stringify(event) )
        const details = JSON.parse(JSON.stringify(event));
       this.distributorName = details.user.distributorName;
    
       });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      var loginRequest = new LoginRequest();
          loginRequest.signatureKey = AppConstants.signatureKey


      this.api.AdmAppVersion(loginRequest).then((res)=>{
       if(this.apiversion != res.data.Result_Output){
         alert("Update Required");
       }
      })

      this.localstorge.getDistributor()
      .then((distributor) => {
        console.log("Login Page" + JSON.stringify(distributor));
        
        if (distributor != null) {
          this.router.navigate(['/dashboard']);
        }
        else{
          this.router.navigate(['/login']);
        }
      })
      .catch((err) => {
        console.log("ADM" + JSON.stringify(err))
        this.router.navigate(['/login']);

      })

    });
  }
  signOut() {

    if (window.confirm("Are you sure you want to Sign Out? ")) {
     this.storage.clear();
      this.router.navigate(['/login']);

    }
  }

  contact() {
    this.dashboardClass = "noactive";
    this.contactClass = "active";

    this.router.navigate(['/contact']);


  }
  dashboard() {
    this.dashboardClass = "active";
    this.contactClass = "noactive";

    this.router.navigate(['/dashboard']);
  }


  backPressed() {
    this.platform.backButton.subscribeWithPriority(66666, (processNextHandler) => {
      this.storage.getItem('getBack').then(res => {
        if (res) {
          if (window.confirm("Do you want to exit the app?")) {
            navigator["app"].exitApp();
          }
        } else {
          processNextHandler();
        }
      })
        .catch((err) => {

        });
    });

    this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log('Another handler was called!');
    });
  }


}

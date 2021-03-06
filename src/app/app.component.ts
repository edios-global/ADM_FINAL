import { LocalStorageService } from "src/app/services/storage/localStorage";
import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { DistributorDetails } from "./modals/modal";
import { Broadcaster } from "@ionic-native/broadcaster/ngx";
import { AppConstants } from "./utils/AppConstants";
import { AppVersion } from "@ionic-native/app-version/ngx";
import { ApiService } from "./services/api/api";
import { LoginRequest, AppVersionResponse } from "./modals/payload";
import { tick } from "@angular/core/testing";
import { Market } from "@ionic-native/market/ngx";
import { HelperClass } from "./utils/HelperClasses";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  distributorName = "";
  dashboardClass = "active";
  contactClass = "noactive";
  appV = "";

  constructor(
    private market: Market,
    private broadcaster: Broadcaster,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: NativeStorage,
    private screenOrientation: ScreenOrientation,
    private localstorge: LocalStorageService,
    private appversion: AppVersion,
    private api: ApiService,
    private helperclass  :HelperClass,
  ) {
    this.appversion.getVersionNumber().then((res) => {
      console.log("AppComponent version name" + res);
      this.appV = res;
    });
    this.initializeApp();
    this.backPressed();

    this.storage.getItem(AppConstants.distributorKey).then((res) => {
      if (res != null) {
        var distributore = new DistributorDetails();
        distributore = res;
        this.distributorName = distributore.distributorName;
      }
    });

    this.broadcaster.addEventListener("user").subscribe((event) => {
      console.log(
        "AppComponent",
        "broadcast even received" + JSON.stringify(event)
      );
      const details = JSON.parse(JSON.stringify(event));
      this.distributorName = details.user.distributorName;
    });
  }

  initializeApp() {
    var distributor;
    this.platform.ready().then(async () => {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#4d71d7");
      this.splashScreen.hide();
      try{
        
        if (!this.helperclass.isConnected()) {
          this.helperclass.showMessage(AppConstants.NoInternetConnectionErrMsg);
          return;
        }

        const appV = await  this.appversion.getVersionNumber();
      var loginRequest = new LoginRequest();
      loginRequest.signatureKey = AppConstants.signatureKey;

       distributor   = await this.storage.getItem(AppConstants.distributorKey);
       if(distributor == null){
        loginRequest.distributorUserCode = "Guest";
       }
       else{
        loginRequest.distributorUserCode = distributor.distributorUserCode;

       }
      
      const res  = await   this.api.AdmAppVersion(loginRequest);
      var databaseVersion: AppVersionResponse = JSON.parse(res.data.map);
      console.log(
              "Appcomponent AppUpdate Current " +
                appV +
                " ===  Api ===" +
                databaseVersion.Result_Output
            );
            if (databaseVersion.Result_Output.map.forceUpdate == "true") {
              if (appV != databaseVersion.Result_Output.map.versionName) {
                this.storage.remove(AppConstants.distributorKey);
                this.storage.remove(AppConstants.distributorCode);
               
                if (window.confirm("Update Required")) {
                  this.market.open("com.edios.adm");
                } else {
                  navigator["app"].exitApp();
                }
              }
              else if (distributor != null) {
                this.router.navigate(["/dashboard"]);
              } else {
                this.router.navigate(["/login"]);
              }

            }
      else{
        if (distributor != null) {
          this.router.navigate(["/dashboard"]);
        } else {
          this.router.navigate(["/login"]);
        }
      }
    }
    catch(err){
      console.log("Appcomponent error  "+JSON.stringify(err));
     const appV = await  this.appversion.getVersionNumber();
     var loginRequest = new LoginRequest();
     loginRequest.signatureKey = AppConstants.signatureKey;
     loginRequest.distributorUserCode = "Guest";
     const res  = await   this.api.AdmAppVersion(loginRequest);
     var databaseVersion: AppVersionResponse = JSON.parse(res.data);

     console.log(
      "Appcomponent AppUpdate Current " +
        appV +
        " ===  Api ===" +
        databaseVersion.Result_Output
        );

     if (databaseVersion.Result_Output.map.forceUpdate == "true") {
       if (appV != databaseVersion.Result_Output.map.versionName) {
         if (window.confirm("Update Required")) {
          this.storage.remove(AppConstants.distributorKey);
          this.storage.remove(AppConstants.distributorCode);
           this.market.open("com.edios.adm");
         } else {
           navigator["app"].exitApp();
         }
       }
       else if (distributor != null) {
        this.router.navigate(["/dashboard"]);
      } else {
        this.router.navigate(["/login"]);
      }

     }
     else{
      if (distributor != null) {
        this.router.navigate(["/dashboard"]);
      } else {
        this.router.navigate(["/login"]);
      }
    }
    
    }
      // this.appversion.getVersionNumber().then((res) => {
      //   this.appV = res;
      //   var loginRequest = new LoginRequest();
      //   loginRequest.signatureKey = AppConstants.signatureKey;
      //   loginRequest.distributorUserCode = distributor.distributorUserCode;
       
       
      //   this.api.AdmAppVersion(loginRequest).then((res) => {
      //     var databaseVersion: AppVersionResponse = JSON.parse(res.data);
      //     console.log(
      //       "Appcomponent AppUpdate Current " +
      //         this.appV +
      //         " ===  Api" +
      //         databaseVersion.Result_Output
      //     );

      //     if (databaseVersion.Result_Output) {
      //       if (this.appV != databaseVersion.Result_Output.versionName) {
      //         if (window.confirm("Update Required")) {
      //           this.market.open("com.edios.adm");
      //         } else {
      //           navigator["app"].exitApp();
      //         }
      //       }
      //       else{
              
      // this.localstorge
      // .getDistributor()
      // .then((distributor) => {
      //   console.log("Login Page" + JSON.stringify(distributor));

      //   if (distributor != null) {
      //     this.router.navigate(["/dashboard"]);
      //   } else {
      //     this.router.navigate(["/login"]);
      //   }
      // })
      // .catch((err) => {
      //   console.log("ADM" + JSON.stringify(err));
      //   this.router.navigate(["/login"]);
      // });
      //       }

      //     }
      //   });
    //  });

    });
  }
  signOut() {
    if (window.confirm("Are you sure you want to Sign Out? ")) {
      this.storage.clear();
      this.router.navigate(["/login"]);
    }
  }

  contact() {
    this.dashboardClass = "noactive";
    this.contactClass = "active";

    this.router.navigate(["/contact"]);
  }
  dashboard() {
    this.dashboardClass = "active";
    this.contactClass = "noactive";

    this.router.navigate(["/dashboard"]);
  }

  backPressed() {
    this.platform.backButton.subscribeWithPriority(
      66666,
      (processNextHandler) => {
        this.storage
          .getItem("getBack")
          .then((res) => {
            if (res) {
              if (window.confirm("Do you want to exit the app?")) {
                navigator["app"].exitApp();
              }
            } else {
              processNextHandler();
            }
          })
          .catch((err) => {});
      }
    );

    this.platform.backButton.subscribeWithPriority(-1, () => {
      console.log("Another handler was called!");
    });
  }
}

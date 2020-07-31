import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginService } from './services/loginService';
import { HelperClass } from './utils/HelperClasses';
import { ApiService } from './services/api/api';
import { LocalStorageService } from './services/storage/localStorage';
import { Camera } from '@ionic-native/camera/ngx';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocTypeComponent } from './components/doc-type/doc-type.component';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';

import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';




import { Network } from '@ionic-native/network/ngx';

@NgModule({
  declarations: [AppComponent, DashboardComponent, DocTypeComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), HttpClientModule, AppRoutingModule, NgxIonicImageViewerModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LoginService,
    HelperClass,
    ApiService,
    HTTP,
    LocalStorageService,
    NativeStorage,
    Camera,
    HttpClient,
    FileTransfer,
    PhotoViewer,
    ScreenOrientation,
    Network,
    CallNumber,
    Base64,
    Broadcaster,
    Crop,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

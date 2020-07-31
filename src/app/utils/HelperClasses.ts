import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { AppConstants } from './AppConstants';

@Injectable({
  providedIn: 'root'
})
export class HelperClass {
  isLoading = false;
  constructor(private toast: ToastController,
    private loadingController: LoadingController,
    private network: Network
  ) { }

  showMessage(msg: string) {
    this.toast.create({
      message: msg,
      duration: 1500
    }).then((toast) => {
      toast.present();
    })
  }

  isConnected(): boolean {
    let conntype = this.network.type;
    if (!(conntype && conntype !== "unknown" && conntype !== "none")) {

      return false;
    }
    return true;
  }



  // FUNCTION TO SHOW LOADING
  async showLoading(msg: string) {
    this.isLoading = true;
    return await this.loadingController.create({
      message: msg,
      spinner: 'circular'
    })
      .then(loading => {
        loading.present().then(() => {

          if (!this.isLoading) {
            loading.dismiss();
          }
        })
      })
  }
  //FUNCTION TO DISMISS  LOADING 

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }

  // isConnected(): boolean {
  //   let conntype = this.network.type;
  //   if (!(conntype && conntype !== "unknown" && conntype !== "none")) {
  //     this.showMessage(AppConstants.NoInternetConnectionErrMsg);
  //     return false;
  //   }
  //   return true;
  // }

}

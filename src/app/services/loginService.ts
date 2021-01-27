import { DistributorDetails } from './../modals/modal';
import { Constants } from './../utils/AppConstants';
import { LocalStorageService } from './storage/localStorage';
import { ApiService } from './api/api';
import { Injectable } from '@angular/core';
import { User, LoginResponse } from '../modals/modal';
import { HelperClass } from '../utils/HelperClasses';
import { AppConstants } from '../utils/AppConstants';
import { LoginRequest } from '../modals/payload';
import { Router } from '@angular/router';
import { Broadcaster } from '@ionic-native/broadcaster/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  tag = "LoginService";

  constructor(private helperclass: HelperClass, private apiservice: ApiService,
    private localstorage: LocalStorageService,
    private router: Router,
    private broadcaster: Broadcaster,
    private storage : NativeStorage) { }

  /*
  Function to validate login inputs
   */

  validateInputs(user: User): boolean {
    if (!user.username) {
      this.helperclass.showMessage(AppConstants.userNameError);
      return false;
    }
    else if (!user.password) {
      this.helperclass.showMessage(AppConstants.passwordError);
      return false;
    }
    return true;
  }


  /* 
  Function to authenticate user
   */

  authenticateUser(user: User) {
    if (!this.helperclass.isConnected()) {
      this.helperclass.showMessage(AppConstants.NoInternetConnectionErrMsg);
      return;
    }
    this.helperclass.showLoading("Authenticating User...");
    var loginRequest = new LoginRequest();
    loginRequest.distributorUserCode = user.username;
    loginRequest.distributorUserPassword = user.password
    loginRequest.signatureKey = AppConstants.signatureKey
    loginRequest.distributorUserCode = user.username;
    

    this.apiservice.login(loginRequest)
      .then((result) => {
        this.helperclass.dismissLoading()
          .then(() => {
            let response = new LoginResponse();
            response = JSON.parse(result.data);

            if (response.Result_Status.startsWith("F")) {
              this.helperclass.showMessage(response.Result_Message);
            }
            else {

              let distributor = new DistributorDetails();
              distributor = response.Result_Output;
              this.localstorage.storeDistributor(distributor);
              Constants.distributorId = distributor.distributorId;
             this.storage.setItem(AppConstants.distributorCode , distributor.distributorUserCode);
             this.storage.setItem(AppConstants.distributorKey , response.Result_Output);

              this.broadcaster.fireNativeEvent('user', {user : distributor}).then(() => console.log('broadcast fire success'));
              this.router.navigate(['/dashboard']);
            }
          })
      })
      .catch(err => {
        this.helperclass.dismissLoading();
        this.helperclass.showMessage(AppConstants.apiErrorMessage)
        console.error("Login Service Error  is " + JSON.stringify(err));

      })
  }
}
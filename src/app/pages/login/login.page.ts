import { LocalStorageService } from './../../services/storage/localStorage';

import { LoginService } from './../../services/loginService';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/modals/modal';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
  constructor(private loginService: LoginService,
    private localstorageService: LocalStorageService,
    private router: Router,
    private storage: NativeStorage,
    private platform: Platform) {
    this.localstorageService.getDistributor()
      .then((distributor) => {
        console.log("Login Page" + JSON.stringify(distributor));
        if (distributor != null) {
          this.router.navigate(['/dashboard']);
        }
      })
      .catch((err) => {
        console.log("ADM" + JSON.stringify(err))
      })
  }


  ionViewDidEnter() {
    this.storage.setItem('getBack', "true");
    console.log("loginGetBack Stored");
  }

  ionViewWillLeave() {
    this.storage.remove("getBack");
    console.log("loginGetBack Removed");
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

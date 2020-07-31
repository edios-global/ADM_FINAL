import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  
  contactNumber1 = "8588894399"
  contactNumber2 = "8750045508"
  name1  ="Prabhat Kumar"
  name2  ="Sudipt"

  constructor(private callNumber: CallNumber,
    private storage: NativeStorage,) {
   
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
  call(phone: string) {

    this.callNumber
      .callNumber(phone, true)
      .then(res => console.log("CONTACT PAGE  Launched dialer!", res))
      .catch(err => console.log(" CONTACT PAGE Error launching dialer", err));

  }

  // ionViewWillLeave() {
  //   this.storage.remove("getBack");
  //   console.log("loginGetBack Removed");
  // }



}

import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent implements OnInit {
  url :any;
  slide = {
    zoom:{
      maxRatio:3
    }
  }
  @Input() public lunch: any;

  constructor( private modalCtrl: ModalController,
    private DomSanitizer: DomSanitizer,

  ) { }

  ngOnInit() {}

  ionViewWillEnter(){
  
    this.url = this.lunch;
   }

   closeModal() {
    this.modalCtrl.dismiss();
    // this.socialSharing.share(this.url, null, null, null);
}
  


}

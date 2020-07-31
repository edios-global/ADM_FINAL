import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CafSearchResponse } from 'src/app/modals/modal';

@Component({
  selector: 'app-doc-type',
  templateUrl: './doc-type.component.html',
  styleUrls: ['./doc-type.component.scss'],
})
export class DocTypeComponent implements OnInit {

  constructor(private modalCtrl: ModalController,
    private router  : Router) { }
    searchItems: CafSearchResponse[] = [];

    @Input() public lunch: any;

  ngOnInit() { }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }

  cafType(type: string) {

    this.modalCtrl.dismiss(type);
  }

  search(){
    this.router.navigate(['/search-caf']);

  }
  ionViewWillEnter(){
  
   this.searchItems = this.lunch;

  }

}

import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CafSearchResponse, cafImages, GeneralResponse, cafIdResponse } from 'src/app/modals/modal';
import { ApiService } from 'src/app/services/api/api';
import { HelperClass } from 'src/app/utils/HelperClasses';
import { EditCafDetail, RemoveDocument, CafePayload } from 'src/app/modals/payload';
import { AppConstants } from 'src/app/utils/AppConstants';
import { AlertController, PopoverController, ModalController } from '@ionic/angular';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-edit-images',
  templateUrl: './edit-images.page.html',
  styleUrls: ['./edit-images.page.scss'],
})
export class EditImagesPage implements OnInit {

  cafImages: cafImages[] = [];
  poiImages: cafImages[] = [];
  poaImages: cafImages[] = [];
  poImages: cafImages[] = [];
  asImages: cafImages[] = [];
  dfImages: cafImages[] = [];
  cafDataIntent = new CafePayload();
  cafId: string;
  deleteNotes ="";
  images: cafImages[] = [];
  noImages = false;
  editImagePage  = "EditImagesPage";
  constructor(private router: Router,
    private apiservice: ApiService,
    private hc: HelperClass,
    public popoverCtrl: PopoverController,
    private helperclass: HelperClass,
    private photoviewer: PhotoViewer,
    public modalController: ModalController,
    private storage : NativeStorage,
    private alertController: AlertController) {

    if (!this.helperclass.isConnected()) {
      this.helperclass.showMessage(AppConstants.NoInternetConnectionErrMsg);
      return;
    }

    if (this.router.getCurrentNavigation().extras.state) {

      console.log(this.editImagePage, "Intent data extra"+JSON.stringify(this.router.getCurrentNavigation().extras.state));

      if (this.router.getCurrentNavigation().extras.state.CAFID) {
        this.cafId = this.router.getCurrentNavigation().extras.state.CAFID;
      }

      if (this.router.getCurrentNavigation().extras.state.cafData) {
        this.cafDataIntent = this.router.getCurrentNavigation().extras.state.cafData;
      }
    }
  }

  async ionViewWillEnter() {

    var payload = new EditCafDetail();
    payload.cafId = this.cafId;
    payload.signatureKey = AppConstants.signatureKey;

    this.hc.showLoading("Loading Images")
    const code = await this.storage.getItem(AppConstants.distributorCode);
    payload.distributorUserCode = code;

    this.apiservice.getImageByCafId(payload)
      .then(res => {
        this.hc.dismissLoading();
        let response = new GeneralResponse();

        response = JSON.parse(res.data);

        console.log("EDIT IMAGES RESPONSE    " + JSON.stringify(response));
        if (response.Result_Status.startsWith("F")) {
          this.noImages = true;
        }

        else {
          this.images = response.Result_Output;
          this.filterArray();

          if (this.images.length == 0) {
            this.noImages = true;
          }
        }

      })
      .catch(err => {
        this.hc.dismissLoading();
        this.helperclass.showMessage(AppConstants.apiErrorMessage)
        console.log("EDIT IMAGES RESPONSE ERROR   " + JSON.stringify(err));

      })
  }

  async openModal(url: string) {
    const modal = await this.modalController.create({
      component: ViewImageComponent,
      componentProps: {
        lunch: url
      }
    });
    return await modal.present();
  }

  async openViewer(url: string) {
    console.log("Upload image " + url)
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: url,
        scheme: "dark",
        text: " ",
        title: "IMAGE",
        titleSize: "large"


      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }


  showImage(item: cafImages) {
    // this.photoviewer.show(item.cafFileUrl)
    //this.openViewer(item.cafFileUrl)
    this.openModal(item.cafFileUrl);
  }

  addCafImage(type: string) {
    var changeStatus = false;
    if(type == 'PO'){
      if(this.cafDataIntent.cafType.startsWith("V")){
        if(this.cafImages.length > 0 && this.poiImages.length  >0 && this.poaImages.length  >0 && this.asImages.length >0){
          changeStatus = true;
        }
      }
      if(this.cafDataIntent.cafType.startsWith("M")){
        if(this.cafImages.length > 0 && this.poiImages.length  >0 && this.poaImages.length  >0 && this.dfImages.length >0){
          changeStatus = true;
        }
      }
      
    }

    else if(type == 'CAF'){

      if(this.cafDataIntent.cafType.startsWith("V")){
        if(this.poImages.length > 0 && this.poiImages.length  >0 && this.poaImages.length  >0 && this.asImages.length >0){
          changeStatus = true;
        }
      }
      if(this.cafDataIntent.cafType.startsWith("M")){
        if(this.poImages.length > 0 && this.poiImages.length  >0 && this.poaImages.length  >0 && this.dfImages.length >0){
          changeStatus = true;
        }
      }
      
    }


    else if(type == 'POA'){
      if(this.cafDataIntent.cafType.startsWith("V")){
        if(this.cafImages.length > 0 && this.poiImages.length  >0 && this.poImages.length  >0 && this.asImages.length >0){
          changeStatus = true;
        }
      }
      if(this.cafDataIntent.cafType.startsWith("M")){
        if(this.cafImages.length > 0 && this.poiImages.length  >0 && this.poImages.length  >0 && this.dfImages.length >0){
          changeStatus = true;
        }
      }
      
    }


   else if(type == 'POI'){
    if(this.cafDataIntent.cafType.startsWith("V")){
      if(this.cafImages.length > 0 && this.poImages.length  >0 && this.poaImages.length  >0  && this.asImages.length >0){
        changeStatus = true;
      }
    }
    if(this.cafDataIntent.cafType.startsWith("M")){
      if(this.cafImages.length > 0 && this.poImages.length  >0 && this.poaImages.length  >0  && this.asImages.length >0){
        changeStatus = true;
      }
    }
      
    }
    else if(type == 'AS'){
      
        if(this.cafImages.length > 0 && this.poImages.length  >0 && this.poaImages.length  >0  && this.poiImages.length >0){
          changeStatus = true;
        }
      }

      else if(type == 'DF'){
      
        if(this.cafImages.length > 0 && this.poImages.length  >0 && this.poaImages.length  >0  && this.poiImages.length >0){
          changeStatus = true;
        }
      }
   

    let cafidR = new cafIdResponse();
    cafidR.cafId = eval(this.cafId);

    let navigationExtras: NavigationExtras = {
      state: {
        cafId: cafidR,
        imageType: type,
        editImage: true,
        statusModified :changeStatus,
        cafData : this.cafDataIntent,
      }
    };

    this.router.navigate(['upload-image'], navigationExtras);
  }


  filterArray() {
    this.cafImages = [];
    this.poiImages = [];
    this.poaImages = [];
    this.poImages = [];
    this.asImages = [];
    this.dfImages = [];

    this.images.forEach(element => {

      if (element.documentType.toLowerCase() == "caf") {
        this.cafImages.push(element);
      }

      else if (element.documentType.toLowerCase() == "poi") {
        this.poiImages.push(element);
      }

      else if (element.documentType.toLowerCase() == "poa") {
        this.poaImages.push(element);
      }

      else if (element.documentType.toLowerCase() == "po") {
        this.poImages.push(element);
      }

      else if (element.documentType.toLowerCase() == "as") {
        this.asImages.push(element);
      }

      else if (element.documentType.toLowerCase() == "df") {
        this.dfImages.push(element);
      }


    });

  }


  async showConfirmationOfDeleteImage(image: cafImages, i: number, type: string){
  const alert = await this.alertController.create({
  mode:'ios',
  animated:true,
  message:'Enter reason for removing the image',
  subHeader:"Remove  Image",
    inputs: [
      {
        name: 'name1',
        type: 'textarea',
        max :500,
      
        cssClass:'reasoninput'
        // placeholder: 'Please enter the reason to remove this image'
      }],    
     buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (alertData) => { //takes the data 
              console.log(alertData.name1);
              if(!alertData.name1){
                this.helperclass.showMessage("Please enter reason for removing image")
              
              }
              else{
                this.deleteNotes = alertData.name1;
                this.removeDocument(image,i,type);
              }
          }
          }
        ]
});
await alert.present();
}
  removeDoucument(image: cafImages, i: number, type: string) {

    if (!this.hc.isConnected()) {
      this.hc.showMessage(AppConstants.NoInternetConnectionErrMsg);
      return;
    }
    this.showConfirmationOfDeleteImage(image,i,type);

    }
   
      async removeDocument(image: cafImages, i: number, type: string){
        // if (window.confirm("Are you sure you want to remove ?")) {

          var removePayload = new RemoveDocument();
          removePayload.cafId = this.cafId;
          removePayload.fileName = image.fileName;
          removePayload.signatureKey = AppConstants.signatureKey;
          removePayload.deleteNotes = this.deleteNotes;
          this.hc.showLoading("Removing..")
          const code = await this.storage.getItem(AppConstants.distributorCode);
          removePayload.distributorUserCode = code;
          
          this.apiservice.removeDocumnet(removePayload)
    
            .then(res => {
    
              this.hc.dismissLoading();
    
              let response = new GeneralResponse();
    
              response = JSON.parse(res.data);
    
              console.log("EDIT IMAGES RESPONSE    " + JSON.stringify(response));
    
              if (response.Result_Status.startsWith("S")) {
    
                this.hc.showMessage("Image Removed Successfully");
    
                const index = this.images.indexOf(image);
    
                if (index > -1) {
                  this.images.splice(index, 1);
                  if (this.images.length == 0) {
                    this.noImages = true;
                  }
    
                }
                if (type == "CAF") {
                  this.cafImages.splice(i, 1);
                  if(this.cafImages.length ==0){
                    this.updateCafStatus();
                  }
                }
    
                else if (type == "POI") {
                  this.poiImages.splice(i, 1);
                  if(this.poiImages.length ==0){
                    this.updateCafStatus();
                  }
                }
    
                else if (type == "POA") {
                  this.poaImages.splice(i, 1);
                  if(this.poaImages.length ==0){
                    this.updateCafStatus();
                  }
                  
                }
    
                else if (type == "PO") {
                  this.poImages.splice(i, 1);
                  if(this.poImages.length ==0){
                    this.updateCafStatus();
                  }
                }
                else if (type == "AS") {
                  this.asImages.splice(i, 1);
                  if(this.asImages.length ==0){
                    this.updateCafStatus();
                  }
                }
                else if (type == "DF") {
                  this.dfImages.splice(i, 1);
                  if(this.dfImages.length ==0){
                    this.updateCafStatus();
                  }
                }
              }
    
    
            })
            .catch(err => {
              console.log("EDIT IMAGES RESPONSE ERROR   " + JSON.stringify(err));
    
            })
    
    
    
        // }
    
      }
  async updateCafStatus(){
    this.helperclass.showLoading("Updating Caf Status..")
    // this.cafDataIntent.cafStatus ='Pending';
    this.cafDataIntent.cafStatus ='Docs Not Uploaded';
    this.cafDataIntent.cafId =this.cafId;
    console.log("UPLOAD IMAGE change status"+JSON.stringify(this.cafDataIntent))
    
    const code = await this.storage.getItem(AppConstants.distributorCode);
    this.cafDataIntent.distributorUserCode = code;

    
    this.apiservice.editCafData(this.cafDataIntent)
      .then((result) => {
        this.helperclass.dismissLoading()
          .then(() => {

            let response = new GeneralResponse();
            response = JSON.parse(result.data);
            console.log("UPLOAD IMAGE change status UPLOAD RESPONSE " + JSON.stringify(result));

            if (response.Result_Status.startsWith("S")) {
              // this.helperclass.showMessage("CAF Status has been changed to Pending");
              this.helperclass.showMessage("CAF Status has been changed to Docs Not Uploaded");
            }
            else {
              this.helperclass.showMessage(response.Result_Message);
            }

          })
      })
      .catch(err => {
        this.helperclass.dismissLoading();
        this.helperclass.showMessage(AppConstants.apiErrorMessage)

        console.error("Uplaod caf Error  is " + JSON.stringify(err));

      })
  }

  async dashboard(ev: any) {


    const popover = await this.popoverCtrl.create({
      component: DashboardComponent,
      event: ev,
      animated: true,
      showBackdrop: true

    });
    return await popover.present();
  }

  ngOnInit() {
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'No Caf Documents Found',
      mode: "ios",
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // this.router.navigate(['dashboard']);
          }
        }
      ]
    });

    await alert.present();
  }

  addImage() {

    let cafidR = new cafIdResponse();
    cafidR.cafId = eval(this.cafId);

    let navigationExtras: NavigationExtras = {
      state: {
        itemSend: cafidR,

      }
    };

    this.router.navigate(['upload-image'], navigationExtras);
  }

}

import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ApiService } from 'src/app/services/api/api';
import { HelperClass } from 'src/app/utils/HelperClasses';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { AppConstants } from 'src/app/utils/AppConstants';
import { PopoverController, ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { cafIdResponse, UploadCafImageData, GeneralResponse, DistributorDetails } from 'src/app/modals/modal';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { CafePayload } from 'src/app/modals/payload';

import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.page.html',
  styleUrls: ['./upload-image.page.scss'],
})
export class UploadImagePage {
  cameraImages: string[] = []
  cafId = new cafIdResponse;
  distributorUserCode : string;
  responseImagesName: string[] = []
  uploadFile: FileTransferObject
  showImages: string[] = [];
  docType: string[] = [];
  index = 0;

  times = 0;
  cafPayload: CafePayload = new CafePayload();
  cafType = "CAF";
  buttonName = "CAF";
  editImage = false;
  changeStatusOfCaf = false;
  cafDataIntent = new CafePayload();
  uploadImagePage = "UploadImagePage";
  shoDashboardButton = false;
   distributore = new DistributorDetails();
  constructor(private camera: Camera,
    private api: ApiService,
    private helperclass: HelperClass,
    private fileTransfer: FileTransfer,
    private crop: Crop,
    private DomSanitizer: DomSanitizer,
    private photoviewer: PhotoViewer,
    private webview: WebView,
    private router: Router,
    private storage : NativeStorage,
    public modalController: ModalController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    private actionSheetController: ActionSheetController) {
    this.uploadFile = this.fileTransfer.create()

    this.storage.getItem(AppConstants.distributorKey)
    .then((res) => {
      if (res != null) {
       
        this.distributore = res;
        this.cafPayload.distributorID = this.distributore.distributorId.toString();
        this.cafDataIntent.distributorID = this.distributore.distributorId.toString();

      }
    })
      
    if (this.router.getCurrentNavigation().extras.state) {
      console.log(this.uploadImagePage, "Intent data extra"+JSON.stringify(this.router.getCurrentNavigation().extras.state));

      if (this.router.getCurrentNavigation().extras.state.cafPayload) {
        this.cafPayload = this.router.getCurrentNavigation().extras.state.cafPayload;

      }

      if (this.router.getCurrentNavigation().extras.state.cafId) {

        this.cafId = this.router.getCurrentNavigation().extras.state.cafId;

      }

      if (this.router.getCurrentNavigation().extras.state.imageType) {
        this.cafType = this.router.getCurrentNavigation().extras.state.imageType;
        if(this.cafType == "AS"){
          this.buttonName ="Authorized Signatory"

        }
        else if(this.cafType == "DF"){
          this.buttonName ="Declaration Form"

        }
        else{
          this.buttonName = this.router.getCurrentNavigation().extras.state.imageType;

        }
      }

      if (this.router.getCurrentNavigation().extras.state.cafidR) {
        this.cafId = this.router.getCurrentNavigation().extras.state.cafidR;

      }

      if (this.router.getCurrentNavigation().extras.state.editImage) {
        this.editImage = this.router.getCurrentNavigation().extras.state.editImage;

      }
      if (this.router.getCurrentNavigation().extras.state.statusModified) {
        this.changeStatusOfCaf = this.router.getCurrentNavigation().extras.state.statusModified;

      }

      if (this.router.getCurrentNavigation().extras.state.cafData) {
        this.cafDataIntent = this.router.getCurrentNavigation().extras.state.cafData;

      }

    }


  }

  async openViewer(url: string) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,

      componentProps: {
        src: url,

      },
      mode: "ios",
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
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

  async openModal() {
    this.chooseImage(this.cafType);
  }

  showDialog(index) {

    //this.photoviewer.show(this.cameraImages[index]);
    // this.openViewer(this.showImages[index])
    this.openModal1(this.showImages[index]);

  }

  async openModal1(url: string) {
    const modal = await this.modalController.create({
      component: ViewImageComponent,
      componentProps: {
        lunch: url
      }
    });
    return await modal.present();

  }


  chooseImage(mydoc) {
    this.setImage(mydoc)
  }

  setImage(mydoc) {

    const options: CameraOptions = {
      quality: 100,
      targetWidth: 1920,
      targetHeight: 1080,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: false,
      sourceType: 1,
      allowEdit: true
    }

    this.camera.getPicture(options).then((imageData) => {

      console.log("IMAGE croped url" + imageData)
      this.docType.push(mydoc);
      this.cameraImages.push(imageData);
      this.showImages.push(this.webview.convertFileSrc(imageData));
      this.index++;
    }, (err) => {
      console.log("CHOOSE IMAGE ERROR => " + JSON.stringify(err));
    });
  }


  uploadMultipleImages(): any {


    if (this.docType.length == 0) {
      this.helperclass.showMessage("Please select an  image");
      return;
    }

    if (!this.helperclass.isConnected()) {
      this.helperclass.showMessage(AppConstants.NoInternetConnectionErrMsg);
      return;
    }

    this.uploadCafDetails();

  }
   getUploadImagesPromises() {
    var objArray = [];
    let data = new UploadCafImageData();
    data.baseUrl = this.api.baseUrl;
    data.cafID = this.cafId.cafId.toString();
    data.signatureKey = AppConstants.signatureKey;
    data.distributorUserCode = this.distributorUserCode;
  

    let indeXval = 0;

    for (var j = 0; j < this.cameraImages.length; j++) {

      if (this.docType[j] && this.responseImagesName[indeXval]) {

        data.documentType = this.docType[j];
        data.fileName = this.responseImagesName[indeXval];
        objArray.push(this.api.uploadCafImageData(data));
        indeXval++;
        // }
      }

    }
    console.log("IMAGES UPLOAD  OBJECT ARRAY SIZE IS" + objArray.length)



    return objArray;
  }


  getUploadObjArray(): any {
    var objArray = [];
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: "myImage"+"&"+this.distributorUserCode+".jpg",
      // fileName: "myImage"+"&"+this.distributorUserCode,
      // fileName: "myImage.jpg",
      chunkedMode: false,
      httpMethod: "post", 
      params: {},
    };
    this.responseImagesName = [];

    for (var i = 0; i < this.cameraImages.length; i++) {

      if (this.cameraImages[i].length > 0) {

        objArray.push(
          this.fileTransfer.create().upload(this.cameraImages[i], this.api.baseUrl.concat("UploadCAFimageV1"), options)
          // this.fileTransfer.create().upload(this.cameraImages[i], this.api.baseUrl.concat("UploadCAFimage"), options)
            .then(res => {
              console.log("Uploaded image response "+JSON.stringify(res));

              // this.responseImagesName.push(res.response+"&"+this.distributorUserCode);
              this.responseImagesName.push(res.response);
            })
            // .catch((err)=>{
            //   console.log("Uploaded image error  "+JSON.stringify(err));

            // })
        )
      }
    }
    return objArray;
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Select an option',
      mode: "ios",
      buttons: [
        {
          text: 'View',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Retake',
          handler: () => {


          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }
      ]
    });

    await alert.present();
  }



  uploadImagesAndData() {



    this.helperclass.showLoading("Uploading Images ...");

    Promise.all(this.getUploadObjArray()).then(res => {

      console.log(this.uploadImagePage, JSON.stringify(res))
      console.error(this.uploadImagePage, JSON.stringify(this.responseImagesName));

      Promise.all(this.getUploadImagesPromises())
        .then(async result => {
          this.helperclass.dismissLoading();
          this.helperclass.showMessage("CAF Images Uploaded successfully For  " + this.buttonName)
          this.showImages = [];
          this.cameraImages = [];
          this.docType = [];
          this.responseImagesName = [];

          if (this.editImage) {

            if (this.changeStatusOfCaf) {
              this.helperclass.showLoading("Updating Caf Status...")
              this.cafDataIntent.cafStatus = 'Uploaded';
              const code = await this.storage.getItem(AppConstants.distributorCode);
              this.cafDataIntent.distributorUserCode = code;


              this.api.editCafData(this.cafDataIntent)
                .then((result) => {
                  this.helperclass.dismissLoading()
                    .then(() => {
                      
                      let response = new GeneralResponse();
                      response = JSON.parse(result.data);
                      console.log(this.uploadImagePage, "Status Uploaded Response" + JSON.stringify(result));

                      if (response.Result_Status.startsWith("S")) {

                        let cafId = new cafIdResponse()
                        cafId = response.Result_Output;
                        this.cafId = cafId;
                        // this.helperclass.showMessage(message);

                        setTimeout(() => {
                          let navigationExtras: NavigationExtras = {
                            state: {
                              CAFID: this.cafId.cafId.toString()
                            }
                          };

                          this.router.navigate(['edit-images'], navigationExtras);
                        }, 500)

                      }
                      else {
                        this.helperclass.showMessage(response.Result_Message);
                        console.log("IMAGES CAF UPLOAD RESPONSE " + response.Result_Message);
                      }

                    })
                })
                .catch(err => {
                  this.helperclass.dismissLoading();
                  this.helperclass.showMessage(AppConstants.apiErrorMessage)

                  console.error("Uplaod caf Error  is " + JSON.stringify(err));

                })



            }
            else if(!this.changeStatusOfCaf){

              this.helperclass.showLoading("Updating Caf Status...")
              // this.cafDataIntent.cafStatus = 'Pending';
              this.cafDataIntent.cafStatus = 'Docs Not Uploaded';
              const code = await this.storage.getItem(AppConstants.distributorCode);
              this.cafDataIntent.distributorUserCode = code;


              this.api.editCafData(this.cafDataIntent)
                .then((result) => {
                  this.helperclass.dismissLoading()
                    .then(() => {
                      
                      let response = new GeneralResponse();
                      response = JSON.parse(result.data);
                      console.log(this.uploadImagePage, "Status Uploaded Response" + JSON.stringify(result));

                      if (response.Result_Status.startsWith("S")) {

                        let cafId = new cafIdResponse()
                        cafId = response.Result_Output;
                        this.cafId = cafId;
                        // this.helperclass.showMessage(message);

                        setTimeout(() => {
                          let navigationExtras: NavigationExtras = {
                            state: {
                              CAFID: this.cafId.cafId.toString()
                            }
                          };

                          this.router.navigate(['edit-images'], navigationExtras);
                        }, 1000)

                      }
                      else {
                        this.helperclass.showMessage(response.Result_Message);
                        console.log("IMAGES CAF UPLOAD RESPONSE " + response.Result_Message);
                      }

                    })
                })
                .catch(err => {
                  this.helperclass.dismissLoading();
                  this.helperclass.showMessage(AppConstants.apiErrorMessage)

                  console.error("Uplaod caf Error  is " + JSON.stringify(err));

                })

            }
            else {
              setTimeout(() => {
                let navigationExtras: NavigationExtras = {
                  state: {
                    CAFID: this.cafId.cafId.toString()
                  }
                };

                this.router.navigate(['edit-images'], navigationExtras);
              }, 1000)
            }

          }

          else {

            console.log("UPLOAD IMAGE times"+this.times);

            if (this.times == 0) {

              //CAF TYPE CAF

              this.cafType = "POI"
              this.buttonName = "POI"
              this.times = 1;

            }


            else if (this.times == 1) {

             
              this.cafType = "POA"
              this.buttonName = "POA"
              this.times = 2;
            }

            else if (this.times == 2) {
              // if(this.cafPayload.cafType.startsWith("V")){
                this.cafType ="AS"
                this.buttonName ="Authorized Signatory"
                this.times = 3;
              //}
           
              // this.cafType = "PO"
              // this.buttonName = "PO"
              // this.times = 3;
             
            }
            else if (this.times == 3) {

           
              //if(this.cafPayload.cafType.startsWith("V")){
                this.cafType ="Po"
                this.buttonName ="PO"
                if(this.cafPayload.cafType.startsWith("V")){
                  this.times = 4;
                }
                if(this.cafPayload.cafType.startsWith("M")){
                  this.times = 5;
                }
                
             
              //
             
            
             
            }
            else if(this.times == 5){
              this.cafType ="DF"
              this.buttonName ="Declaration Form"
              this.times =6;
              
            }

            
            else if(this.times == 4 || this.times ==6) {
              
              this.cafPayload.cafStatus = "Uploaded"
              this.cafPayload.cafId =this.cafId.cafId.toString();
              console.log("UPLOAD IMAGE change status"+JSON.stringify(this.cafPayload))
              const code = await this.storage.getItem(AppConstants.distributorCode);
              this.cafDataIntent.distributorUserCode = code;

              this.api.editCafData(this.cafPayload)
                .then((result) => {
                  // this.helperclass.dismissLoading()
                  //   .then(() => {

                      let response = new GeneralResponse();
                      response = JSON.parse(result.data);
                      console.log("UPLOAD IMAGE change status UPLOAD RESPONSE " + JSON.stringify(result));

                      if (response.Result_Status.startsWith("S")) {

                        let cafId = new cafIdResponse();
                        cafId = response.Result_Output;
                        this.cafId = cafId;
                        // this.helperclass.showMessage(message);

                        // setTimeout(() => {
                        //   this.router.navigateByUrl('/dashboard');
                        // }, 1500)
                        this.shoDashboardButton = true;

                      }
                      else {
                        this.helperclass.showMessage(response.Result_Message);
                      }

                    })
                // })
                // .catch(err => {
                //   this.helperclass.dismissLoading();
                //   this.helperclass.showMessage(AppConstants.apiErrorMessage)

                //   console.error("Uplaod caf Error  is " + JSON.stringify(err));

                // })


            }

          }







        })
        .catch(error => {
          // if(this.flagVar){

          // }
          // else{
          this.helperclass.dismissLoading();
          //this.helperclass.showMessage(AppConstants.apiErrorMessage)

          console.error(" IMAGES Data  Response  Error  ===>" + JSON.stringify(error));
          //}
        })
    })
      .catch(error => {
        this.helperclass.dismissLoading();
        this.helperclass.showMessage(AppConstants.apiErrorMessage)
        console.error(" IMAGES UPLOAD  Error ===> " + JSON.stringify(error));
        console.error("IMAGES NAMES ARE ===> " + JSON.stringify(this.responseImagesName));


      });
  }

  goToDashboard(){
    this.router.navigateByUrl('/dashboard');
  }


  async uploadCafDetails() {

    if (this.times == 0) {

      if (this.editImage) {

        //UPLOAD IMAGES FROM EDIT PAGE

        this.uploadImagesAndData();
      }
      else {

        this.helperclass.showLoading("");
        const code = await this.storage.getItem(AppConstants.distributorCode);
        this.cafPayload.distributorUserCode = code;

        this.api.uploadCaf(this.cafPayload)
          .then((result) => {
            this.helperclass.dismissLoading()
              .then(() => {

                let response = new GeneralResponse();
                response = JSON.parse(result.data);
                console.log("IMAGES CAF UPLOAD RESPONSE " + JSON.stringify(result));

                if (response.Result_Status.startsWith("S")) {

                  let cafId = new cafIdResponse();
                  cafId = response.Result_Output;
                  this.cafId = cafId;
                  // this.helperclass.showMessage(message);
                  this.uploadImagesAndData();

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
    }

    else {
      this.uploadImagesAndData();
    }

  }

  async ionViewWillEnter(){
    const code = await this.storage.getItem(AppConstants.distributorCode);
    this.distributorUserCode = code;

  }

  deletePhoto(index: any) {


    if (window.confirm("Are you sure you want to delete the image ?")) {

      this.docType.splice(index, 1);
      this.cameraImages.splice(index, 1);
      this.showImages.splice(index, 1);
      this.index--;

    }

  }



}



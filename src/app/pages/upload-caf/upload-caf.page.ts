import { LocalStorageService } from './../../services/storage/localStorage';
import { Router, NavigationExtras } from '@angular/router';
import { GeneralResponse, CafSearchResponse, DistributorDetails, cafIdResponse } from './../../modals/modal';
import { AppConstants } from 'src/app/utils/AppConstants';
import { ApiService } from 'src/app/services/api/api';
import { HelperClass } from './../../utils/HelperClasses';
import { CafePayload, ResubmitCafPayload, SearchCafeRequest } from './../../modals/payload';
import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-upload-caf',
  templateUrl: './upload-caf.page.html',
  styleUrls: ['./upload-caf.page.scss'],
})
export class UploadCafPage implements OnInit {
  caf = new CafePayload();
  newCaf = new CafePayload();
  buttonName = "Next"
  placeholder = "Select"
  maxlength = 10;
  iconname  = "chevron-forward-outline"
  cafeItems: CafSearchResponse[] = [];
  rejectCafId : string


  constructor(private helperclass: HelperClass,
    private apiservice: ApiService,
    private router: Router,
    private storage  : NativeStorage,
    public popoverCtrl: PopoverController,
    private localstorage: LocalStorageService,
    public alertController: AlertController,
    ) {

    // this.localstorage.getDistributor()
    //   .then((res) => {
    //     console.log("Dashboard distributores details is " + JSON.stringify(res));
    //     if (res != null) {

    //       var distributore = new DistributorDetails();
    //       distributore = res;
    //       this.caf.distributorID = distributore.distributorId.toString();
    //     }
    //   })

      this.storage.getItem(AppConstants.distributorKey)
      .then((res) => {
        if (res != null) {
          if (res != null) {
            var distributore = new DistributorDetails();
            distributore = res;
            this.caf.distributorID = distributore.distributorId.toString();
          }

        }
      })


    if (this.router.getCurrentNavigation().extras.state) {
      this.buttonName = "Edit"
      this.iconname="create-outline";
      var caf = new CafSearchResponse();
      caf = this.router.getCurrentNavigation().extras.state.itemSend;
      if(caf.cafStatus.startsWith("R")){
        this.buttonName = "Resubmit Rejection"
      }
      console.log("EDIT CAF " + JSON.stringify(caf))
      this.placeholder = ""

      this.caf.cafNumber = caf.cafNumber;
      this.caf.cafStatus = caf.cafStatus;
      this.caf.cafType = caf.cafType;
      this.caf.noOfConnections = caf.noOfConnections.toString();
      this.caf.companyName = caf.companyName;
      this.caf.customerName = caf.customerName;
      this.caf.fatherName = caf.fatherName;
      this.caf.notes = caf.notes;
      this.caf.cafId = caf.cafId.toString();
      this.rejectCafId =caf.cafId.toString()
      this.caf.mobileNumber = caf.mobileNumber
      this.newCaf = this.caf;

      if (this.caf.cafType == "VOICE") {
        this.maxlength = 10;
      }
      else {
        this.maxlength = 13;
      }

    }
  }

  ngOnInit() {
  }

  selectCafType(event: any) {

    this.caf.cafType = event.target.value;
    if (this.caf.cafType == "VOICE") {
      this.maxlength = 10;
    }
    else {
      this.maxlength = 13;
    }
  }

  selectFirmType(event: any) {

    this.caf.fatherName = event.target.value;
  }

  async validateCafe() {

    if (!this.caf.cafType) {
      this.helperclass.showMessage("Please select CAF type");
      return;
    }

    if (!this.caf.cafNumber) {
      this.helperclass.showMessage("Please enter CAF number");
      return;
    }

    var expr = /^[a-zA-Z0-9]*$/;
    if (!expr.test(this.caf.cafNumber)) {
      this.helperclass.showMessage("Only Alphabets and Numbers are allowed in CAF Number ");
      return;

    }
    if (this.caf.cafNumber.length > 20) {
      this.helperclass.showMessage("CAF number can't be more than 20 characters");
      return;
    }


    if (!this.caf.customerName) {
      this.helperclass.showMessage("Please enter customer name");
      return;
    }
    var expr2 = /^[a-zA-Z ]*$/;
    if (!expr2.test(this.caf.customerName)) {
      this.helperclass.showMessage("Only Alphabets are allowed in Customer name");
      return;

    }
    if (this.caf.customerName.length > 50) {
      this.helperclass.showMessage("Customer name can't be more than 50 characters");
      return;
    }

    if (!this.caf.mobileNumber) {
      this.helperclass.showMessage("Please enter mobile number");
      return;
    }


    if (this.caf.cafType == "M2M") {
      if (this.caf.mobileNumber.length < 13) {
        this.helperclass.showMessage("Mobile Number can't be less than 13 digits");
        return;
      }


    }

    if (this.caf.cafType == "VOICE") {
      if (this.caf.mobileNumber.length < 10) {
        this.helperclass.showMessage("Mobile Number can't be less than 10 digits");
        return;
      }
      if (this.caf.mobileNumber.length > 10) {
        this.helperclass.showMessage("Mobile Number can't be more than 10 digits");
        return;
      }

    }

   

    var expr1 =  /^[0-9]*$/;
    if (!expr1.test(this.caf.mobileNumber)) {
      this.helperclass.showMessage("Please enter a valid mobile number");
      return;

    }

    // if (this.caf.mobileNumber.includes(",") || this.caf.mobileNumber.includes(".") || this.caf.mobileNumber.includes(" ") ||
    //   this.caf.mobileNumber.includes("-")) {
    //   this.helperclass.showMessage("Please enter a valid mobile number");
    //   return;
    // }


    // if (!this.caf.fatherName) {
    //   this.helperclass.showMessage("Please enter your Firm name");
    //   return;
    // }

    // var expr5 = /^[a-zA-z ]*$/;
    // if (!expr5.test(this.caf.fatherName)) {
    //   this.helperclass.showMessage("Only Alphabets are allowed in Firm name");
    //   return;

    // }
    // if (this.caf.fatherName.length > 50) {
    //   this.helperclass.showMessage("Father name can't be more than 50 characters");
    //   return;
    // }
    if (!this.caf.fatherName) {
      this.helperclass.showMessage("Please select FIRM type");
      return;
    }


    if (this.caf.companyName) {
      if (this.caf.companyName.length > 30) {
        this.helperclass.showMessage("Company  name can't be more than 30 characters");
        return;
      }
    }

    if (!this.caf.noOfConnections) {
      this.helperclass.showMessage("Please enter number of connections");
      return;
    }

    var expr1 =  /^[0-9]*$/;
    if (!expr1.test(this.caf.noOfConnections)) {
      this.helperclass.showMessage("Please enter a valid number of connections");
      return;

    }

    // if (this.caf.noOfConnections.includes(",") || this.caf.noOfConnections.includes(".") || this.caf.noOfConnections.includes(" ") ||
    //   this.caf.noOfConnections.includes("-")) {
    //   this.helperclass.showMessage("Please enter a valid number of connections");
    //   return;
    // }

    if (this.caf.noOfConnections.startsWith("0")) {
      this.helperclass.showMessage("Number of connections should not start with zero");
      return;
    }

if(this.caf.notes){
  if (this.caf.notes.length > 100) {
    this.helperclass.showMessage("CAF Notes can't be more than 100 characters");
    return;
  }
}


    if (!this.helperclass.isConnected()) {
      this.helperclass.showMessage(AppConstants.NoInternetConnectionErrMsg);
      return;
    }


    this.caf.signatureKey = AppConstants.signatureKey;

  if(!this.caf.cafStatus){

    // this.caf.cafStatus = "Pending"
    this.caf.cafStatus = "Docs Not Uploaded"
  
  }
  if(this.caf.cafStatus.startsWith('R')){
    this.caf.cafStatus = "Docs Not Uploaded"
  }

    console.log("Upload" + JSON.stringify(this.caf));

    if (this.buttonName == 'Edit') {
      this.helperclass.showLoading("Updating CAF Details..");
      console.log("Edit Caf  Payload is"+JSON.stringify(this.caf))
     
      const code = await this.storage.getItem(AppConstants.distributorCode);
      // this.caf.distributorUserCode = code;

      
      this.apiservice.editCafData(this.caf).
        then((result) => {
          this.helperclass.dismissLoading()
            .then(() => {
              let response = new GeneralResponse();
              response = JSON.parse(result.data);
              console.log("CafeDetailsResponse" + JSON.stringify(result));
              if (response.Result_Status.startsWith("S")) {
                let cafId = new cafIdResponse();
                cafId = response.Result_Output;
                // this.helperclass.showMessage(message);
                let navigationExtras: NavigationExtras = {
                  state: {
                    CAFID: cafId
                  }
                };

                if (this.buttonName == "Upload") {

                  this.router.navigate(['upload-image'], navigationExtras);
                }
                else {
                  this.helperclass.showMessage("CAF Updated Successfully");
                  this.presentAlertConfirm();
                }
              }

            })
        })
        .catch(err => {
          this.helperclass.dismissLoading();
          this.helperclass.showMessage(AppConstants.apiErrorMessage)

          console.error("Uplaod caf Error  is " + JSON.stringify(err));

        })

    }
    else if(this.buttonName.startsWith('R')){
      this.helperclass.showLoading("Resubmitting CAF ..");
      const searchPayload = new SearchCafeRequest();
      searchPayload.signatureKey = AppConstants.signatureKey;
      searchPayload.distributorId = this.caf.distributorID;
      const code = await this.storage.getItem(AppConstants.distributorCode);
      searchPayload.distributorUserCode = code;
      
      this.apiservice.SearchCaf(searchPayload)
        .then((res) => {
  
          //RESPONSE FROM SERVER
          
          let response = new GeneralResponse();
          response = JSON.parse(res.data);
          if(response.Result_Status.startsWith("S")){
            this.cafeItems = response.Result_Output;
            this.cafeItems.forEach(element => {
              if(element.cafId.toString() == this.rejectCafId){
                console.log("SEARCH Response" +this.caf.cafId +"  "+element.cafId.toString());

                if(element.duplicateCafId){
                  console.log("SEARCH Response duplicate" +element.duplicateCafId);

                  this.helperclass.dismissLoading();
                  this.helperclass.showMessage("This CAF is Already Resubmitted")
                  return;
                }
                else{
                  this.resubmitCAf();
                }
              }
            });
          }
    
          
        })
        .catch((err) => {
          this.helperclass.dismissLoading();
          this.helperclass.showMessage(AppConstants.apiErrorMessage)
          console.error("SEARCH   Error  is " + JSON.stringify(err));
        })
    }

    else {
      console.log("Upload new caf",JSON.stringify(this.caf))

      let navigationExtras: NavigationExtras = {
        state: {
          cafPayload: this.caf
        }
      };
      if (this.buttonName == "Next") {

        this.router.navigate(['upload-image'], navigationExtras);
      }
      else {
        this.helperclass.showMessage("Caf Updated Successfully");
        this.presentAlertConfirm();
      }
    }




  }

  async resubmitCAf(){
    // var cafId = this.caf.cafId;
    // this.caf.cafId=null
    console.log("Edit Caf  Payload is"+JSON.stringify(this.caf))
    var payload = new ResubmitCafPayload();
    payload.cafId = this.caf.cafId;
    payload.signatureKey  = AppConstants.signatureKey;
    const code = await this.storage.getItem(AppConstants.distributorCode);
    payload.distributorUserCode = code;


    this.apiservice.reSubmitCafdetail(payload).
      then((result) => {
        this.helperclass.dismissLoading()
          .then(() => {
            let response = new GeneralResponse();
            response = JSON.parse(result.data);
            console.log("CafeDetailsResponse" + JSON.stringify(result));
            if (response.Result_Status.startsWith("S")) {
              // let cafId = new cafIdResponse();
              // cafId = response.Result_Output;
              this.caf.cafId = response.Result_Output.cafId;
              // this.helperclass.showMessage(message);
                this.helperclass.showMessage("CAF Resubmitted Successfully");
                // setTimeout(()=>{
                //   this.router.navigate(['dashboard']);
                // },1000)
                // this.caf.cafId =cafId;
                this.presentAlertConfirm();
              
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


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Do you want to edit images?',
      mode: "ios",
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigate(['dashboard']);
          }
        }, {
          text: 'Yes',
          handler: () => {

            let navigationExtras: NavigationExtras = {
              state: {
                CAFID: this.caf.cafId,
                cafData : this.caf
              }
            };

            this.router.navigate(['edit-images'], navigationExtras);
          }
        }
      ]
    });

    await alert.present();
  }

}

import { DistributorDetails, SevenDaysResponse, DateAndTime, CafSearchResponse, LoginResponse } from './../../modals/modal';
import { AppConstants } from 'src/app/utils/AppConstants';
import { CafeCountRequest, SearchCafeRequest, LoginRequest, AppVersionResponse } from './../../modals/payload';
import { HelperClass } from './../../utils/HelperClasses';
import { LocalStorageService } from './../../services/storage/localStorage';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api';
import { GeneralResponse, CafDetailsResponse } from 'src/app/modals/modal';
import { Router } from '@angular/router';
import { Platform, PopoverController, ModalController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Subscription, Observable } from 'rxjs';
import { interval } from 'rxjs';
import { DocTypeComponent } from 'src/app/components/doc-type/doc-type.component';
import { Market } from '@ionic-native/market/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  //VARIBALE NAMES : 

  fromdate = "";
  distributorId: number;
  daysArray: CafDetailsResponse[] = [];
  cafeItems: CafSearchResponse[] = [];
  searchItems: CafSearchResponse[] = [];

  savedDate: Date;
  todate = "";
  observableVar: Subscription;
  observableVar1: Subscription;
  public folder = "Dashboard";
  cafeCount = new CafDetailsResponse();
  currentDate: Date;
  appV = "";


  constructor(private localstorage: LocalStorageService,
    private router: Router,
    private market: Market,
    private appversion: AppVersion,
    private platform: Platform,
    private storage: NativeStorage,
    public popoverCtrl: PopoverController,
    private modalcontroller: ModalController,
    private helperclass: HelperClass, private apiservice: ApiService) {
    this.cafeCount.currentMonthApprovedCount = 0
    this.cafeCount.rejectedCount = 0;
    this.cafeCount.uploadedCount = 0
    this.localstorage.getDistributor()
      .then((res) => {
        if (res != null) {
          var distributore = new DistributorDetails();
          distributore = res;
          this.distributorId = distributore.distributorId;

        }
      })
    this.platform.backButton.subscribeWithPriority(10, () => {

      if (window.confirm("Are You Sure You Want to Exit ? ")) {
        navigator['app'].exitApp();
      }
    });
  }
  async openModal() {
    const modal = await this.modalcontroller.create({
      component: DocTypeComponent,
      componentProps: {
        lunch: this.searchItems
      }
    });
    return await modal.present();
  }
  ionViewWillLeave() {
    this.storage.remove("getBack");
  }
  dashboard(ev: any) {
    this.router.navigate(['/search-caf']);
  }
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.appversion.getVersionNumber().then((res) => {
      this.appV = res;
      var loginRequest = new LoginRequest();
      loginRequest.signatureKey = AppConstants.signatureKey
      this.apiservice.AdmAppVersion(loginRequest).then((res) => {
        var abc: AppVersionResponse = JSON.parse(res.data);
        console.log("DashBoard AppUpdate Current "+ this.appV +" ===  Api"+abc.Result_Output)

        if (this.appV != abc.Result_Output) {
          if (window.confirm("Update Required")) {
            this.market.open('com.edios.adm');
          }
          else {
            navigator['app'].exitApp();
          }
        }

      })

    })

    setTimeout(() => {
      this.loadUpdatedCaf();
    }, 1500)
    this.loadDashBoardDetails();
    this.storage.setItem('getBack', "true");
    if (!this.helperclass.isConnected()) {
      this.helperclass.showMessage(AppConstants.NoInternetConnectionErrMsg);
      return;
    }
    this.observableVar = interval(15000).subscribe(() => {
      this.loadDashBoardDetails();
    });
    this.observableVar1 = interval(1000).subscribe(() => {
      this.loadUpdatedCaf();
    });
  }
  ionViewDidLeave() {
    this.observableVar.unsubscribe();
    this.observableVar1.unsubscribe();
    this.savedDate = null;
    this.searchItems = [];

  }
  loadUpdatedCaf() {
    this.storage.getItem("cafItems").then((res) => {
      console.log("dashboard not empty");

      this.loadIfStorageIsNotEmpty(res);
    })
      .catch((err) => {
        console.log("dashboard empty");

        this.loadIfStorageIsEmpty();

      })
  }
  loadIfStorageIsNotEmpty(res: any) {

    let local: CafSearchResponse[] = JSON.parse(res);
    console.log("local==>" + JSON.stringify(local));
    const searchPayload = new SearchCafeRequest();
    searchPayload.signatureKey = AppConstants.signatureKey;
    searchPayload.distributorId = this.distributorId.toString();
    this.apiservice.SearchCaf(searchPayload)
      .then((res) => {
        let response = new GeneralResponse();
        response = JSON.parse(res.data);
        if (response.Result_Status.startsWith("S")) {
          this.cafeItems = response.Result_Output;

          this.searchItems = [];

          // if(local != null && local != undefined && local.length !=0) {

          // } else {
          //   this.searchItems.push(this.cafeItems);
          // }
          for (var i = 0; i < this.cafeItems.length; i++) {

            if (i < local.length) {
              // if(this.cafeItems[i].cafId == local[i].cafId){
              if (this.cafeItems[i].cafStatus != local[i].cafStatus) {
                console.log("STATS==>cafeItem status" + this.cafeItems[i].cafStatus);
                console.log("STATS==>local status" + local[i].cafStatus);

                if (!this.cafeItems[i].cafStatus.startsWith("U"))

                  this.searchItems.push(this.cafeItems[i]);
              }
              //}
              //}
            }
            else {
              if (!this.cafeItems[i].cafStatus.startsWith("U"))
                this.searchItems.push(this.cafeItems[i]);
            }
          }
          console.log("searchItems==>" + this.searchItems);
          if (this.searchItems.length > 0) {
            this.openModal();
          }

          this.storage.setItem("cafItems", JSON.stringify(this.cafeItems));
        }

      })
      .catch((err) => {
        this.helperclass.dismissLoading();
        // this.helperclass.showMessage(AppConstants.apiErrorMessage)
      })

  }
  loadIfStorageIsEmpty() {
    const searchPayload = new SearchCafeRequest();
    searchPayload.signatureKey = AppConstants.signatureKey;
    searchPayload.distributorId = this.distributorId.toString();
    this.apiservice.SearchCaf(searchPayload)
      .then((res) => {
        let response = new GeneralResponse();
        response = JSON.parse(res.data);
        if (response.Result_Status.startsWith("S")) {
          this.cafeItems = response.Result_Output;
          this.filterArrayIfDateIsEmpty();
          if (this.searchItems.length > 0) {
            this.openModal();

          }
          this.storage.setItem("cafItems", JSON.stringify(this.cafeItems));
        }

      })
      .catch((err) => {
        this.helperclass.dismissLoading();
        // this.helperclass.showMessage(AppConstants.apiErrorMessage)
      })
  }
  loadDashBoardDetails() {
    this.helperclass.showLoading("Loading...");
    var caferequest = new CafeCountRequest();
    caferequest.signatureKey = AppConstants.signatureKey;
    caferequest.distributorId = this.distributorId;
    this.apiservice.cafCountDetails(caferequest)
      .then((res) => {
        this.helperclass.dismissLoading()
          .then(() => {
            let response = new GeneralResponse();
            response = JSON.parse(res.data);
            if (response.Result_Status.startsWith("S")) {
              var result: CafDetailsResponse[];

              result = response.Result_Output;
              if (result[0]) {


                if (result.length == 1) {

                  this.daysArray = [];
                  this.cafeCount.uploadedCount = result[0].uploadedCount;
                  this.cafeCount.rejectedCount = result[0].rejectedCount;
                  this.cafeCount.currentMonthApprovedCount = result[0].currentMonthApprovedCount;
                  this.daysArray.push(result[0])
                }
                else {

                  //results greater than 1

                  this.cafeCount.uploadedCount = result[0].uploadedCount;
                  this.cafeCount.rejectedCount = result[0].rejectedCount;
                  this.cafeCount.currentMonthApprovedCount = result[0].currentMonthApprovedCount;



                  this.daysArray = [];

                  for (var i = 1; i < result.length; i++) {

                    var res1 = new CafDetailsResponse();

                    if (result[i].dailyUploadedCount == undefined) {

                      res1.dailyRejectedCount = result[i].dailyRejectedCount;
                      res1.cafAuditDatetime = result[i].cafAuditDatetime;
                      res1.dailyApprovedCount = result[i].dailyApprovedCount;
                      res1.dailyUploadedCount = 0;
                      this.daysArray.push(res1);

                    }

                    else {
                      var bool = false;
                      var till, a = 0;

                      if (this.daysArray.length == 0) {
                        till = result.length;
                        a = 1
                      }
                      else {
                        till = this.daysArray.length;
                        a = 0;
                      }


                      if (this.daysArray.length > 0) {
                        for (a; a < till; a++) {
                          if (this.getFormattedDate(this.daysArray[a].cafAuditDatetime) == this.getFormattedDate(result[i].cafUploadedDatetime)) {
                            this.daysArray[a].dailyUploadedCount = result[i].dailyUploadedCount;
                            bool = true;
                            break;

                          }
                        }

                        if (!bool) {
                          res1.cafAuditDatetime = result[i].cafUploadedDatetime;
                          res1.dailyApprovedCount = 0;
                          res1.dailyRejectedCount = 0;
                          res1.dailyUploadedCount = result[i].dailyUploadedCount;
                          this.daysArray.push(res1);

                        }
                      }
                      else {
                        res1.cafAuditDatetime = result[i].cafUploadedDatetime;
                        res1.dailyApprovedCount = 0;
                        res1.dailyRejectedCount = 0;
                        res1.dailyUploadedCount = result[i].dailyUploadedCount;
                        this.daysArray.push(res1);
                      }

                    }

                  }
                }
                if (this.daysArray[0].cafAuditDatetime) {
                  this.fromdate = this.getFormattedDate(this.daysArray[0].cafAuditDatetime);

                }
                else if (this.daysArray[0].cafUploadedDatetime) {
                  this.fromdate = this.getFormattedDate(this.daysArray[0].cafUploadedDatetime);

                }


                if (this.daysArray[this.daysArray.length - 1].cafAuditDatetime) {
                  this.todate = this.getFormattedDate(this.daysArray[this.daysArray.length - 1].cafAuditDatetime);

                }
                else if (this.daysArray[this.daysArray.length - 1].cafUploadedDatetime) {
                  this.todate = this.getFormattedDate(this.daysArray[this.daysArray.length - 1].cafUploadedDatetime);

                }

                this.daysArray.reverse();
              }
            }

          })
      })
      .catch((err) => {
        this.helperclass.dismissLoading();
      })
  }

  uploadCaf() {
    this.router.navigate(['/upload-caf']);
  }

  searchCafe() {
    this.router.navigate(['/search-caf']);
  }

  getFormattedDate(date: string): any {
    if (date) {
      var arr = date.split(" ");

      var abc = arr[1] + " " + arr[0] + " " + arr[2];
      return abc.replace(',', '');
    }
  }


  filterArrayIfDateIsEmpty() {
    this.searchItems = []

    this.cafeItems.forEach(element => {
      if (element.cafApprovedDatetime) {

        if (element.cafStatus != 'Uploaded') {
          this.searchItems.push(element)
        }

      }
    });

  }

}

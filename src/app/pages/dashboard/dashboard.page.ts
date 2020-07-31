import { DistributorDetails, SevenDaysResponse, DateAndTime, CafSearchResponse } from './../../modals/modal';
import { AppConstants } from 'src/app/utils/AppConstants';
import { CafeCountRequest, SearchCafeRequest } from './../../modals/payload';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  //VARIBALE NAMES : 

  distributorId: number;
  daysArray: CafDetailsResponse[] = [];
  fromdate = "";

  cafeItems: CafSearchResponse[] = [];
  searchItems: CafSearchResponse[] = [];

  savedDate: Date;
  todate = "";
  observableVar: Subscription;
  public folder = "Dashboard";
  cafeCount = new CafDetailsResponse();
  currentDate: Date;
  distributorName: string = "AVS Telecom"; //Distributor name from DB

  constructor(private localstorage: LocalStorageService,
    private router: Router,
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
          console.log("Dashboard", JSON.stringify(distributore))
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

  ionViewDidEnter() {
    this.localstorage.getDateAndTime()
      .then((res) => {
        if (res != null) {
          this.savedDate = res
        }
      })
      .catch((err) => {
        console.log("Dashboard error in getting  dateAndTime details  " + JSON.stringify(err));

        this.localstorage.storeDateAndTime(new Date().toString());
      })

    this.storage.setItem('getBack', "true");

    if (!this.helperclass.isConnected()) {
      this.helperclass.showMessage(AppConstants.NoInternetConnectionErrMsg);
      return;
    }

    this.loadDashBoardDetails()

    setTimeout(() => {
      this.loadUpdatedCaf()
    }, 1500)


    //REGRESH THE CALL AFTER EVERY 15 SECONDS

    this.observableVar = interval(15000).subscribe(() => {
      this.loadDashBoardDetails();

    });
  }

  ionViewDidLeave() {
    //UNSUBSCRIBE THE OBASERVER

    this.observableVar.unsubscribe();
  }

  loadUpdatedCaf() {

    const searchPayload = new SearchCafeRequest();
    searchPayload.signatureKey = AppConstants.signatureKey;
    searchPayload.distributorId = this.distributorId.toString();

    this.apiservice.SearchCaf(searchPayload)
      .then((res) => {
        let response = new GeneralResponse();
        response = JSON.parse(res.data);
        this.cafeItems = response.Result_Output;

        console.log("Dashboard Total Updated Cafs ", JSON.stringify(this.cafeItems))
        if (this.cafeItems.length > 0) {

          if (this.savedDate) {
            this.filterArray();

            console.log("Dashboard Filtered Cafs  having saved date  => " + this.savedDate, JSON.stringify(this.searchItems))


            if (this.searchItems.length > 0) {

              this.localstorage.storeDateAndTime(new Date().toString());

              this.openModal();
            }
          }
          else {
            this.filterArrayIfDateIsEmpty();

            console.log("Dashboard Filtered  Cafs having no saved date => " + this.savedDate, JSON.stringify(this.searchItems))

            if (this.searchItems.length > 0) {
              this.openModal();
            }

          }

        }

      })
      .catch((err) => {
        this.helperclass.dismissLoading();
        this.helperclass.showMessage(AppConstants.apiErrorMessage)
        console.error("Dashboard  Error in loading Updated caf is " + JSON.stringify(err));
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
            var result: CafDetailsResponse[];

            result = response.Result_Output;
              console.log("Dashboard details" , JSON.stringify(result))
            if (result.length != 0) {


              if (result.length == 1) {
                this.cafeCount.uploadedCount = result[0].uploadedCount;
                this.cafeCount.rejectedCount = result[0].rejectedCount;
                this.cafeCount.currentMonthApprovedCount = result[0].currentMonthApprovedCount;
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
                    else{
                        res1.cafAuditDatetime = result[i].cafUploadedDatetime;
                        res1.dailyApprovedCount = 0;
                        res1.dailyRejectedCount = 0;
                        res1.dailyUploadedCount = result[i].dailyUploadedCount;
                        this.daysArray.push(res1);
                    }

                  }



                  // if (this.daysArray[1].cafAuditDatetime) {

                  //   this.fromdate = this.getFormattedDate(this.daysArray[1].cafAuditDatetime);
                  //   this.todate = this.getFormattedDate(this.daysArray[this.daysArray.length - 1].cafAuditDatetime);
                  // }




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
            })
      })
      .catch((err) => {
        this.helperclass.dismissLoading();
        this.helperclass.dismissLoading();

        console.error("Dashboard   Error  is " + JSON.stringify(err));
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
  filterArray() {

    this.searchItems = []

    var date = new Date(this.savedDate);
    // var d =   date.toString().replace('GMT+0530 (India Standard Time)','');



    this.cafeItems.forEach(element => {
      if (element.cafApprovedDatetime) {

        var dateString = element.cafApprovedDatetime.replace(',', '').replace('AM', '').replace('PM', '');
        var fetchedDate = new Date(dateString);
        fetchedDate.setHours(fetchedDate.getHours() + 12);
        if (fetchedDate > date) {
          if (element.cafStatus != 'Uploaded')
            this.searchItems.push(element)
        }

      }
    });

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

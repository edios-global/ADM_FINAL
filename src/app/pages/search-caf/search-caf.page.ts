import { SearchCafeRequest } from '../../modals/payload';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/storage/localStorage';
import { Router, NavigationExtras } from '@angular/router';
import { HelperClass } from 'src/app/utils/HelperClasses';
import { ApiService } from 'src/app/services/api/api';
import { AppConstants } from 'src/app/utils/AppConstants';
import { GeneralResponse, CafSearchResponse, DistributorDetails } from 'src/app/modals/modal';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';
@Component({
  selector: 'app-search-caf',
  templateUrl: './search-caf.page.html',
  styleUrls: ['./search-caf.page.scss'],
})
export class SearchCafPage implements OnInit {
  cafeItems: CafSearchResponse[] = [];
  cafNumber = "";
  customerName = "";
  mobileNumber = "";
  currentDate: any;
  dateFromPicker = "";
  searchPayload = new SearchCafeRequest();

  searchItems: CafSearchResponse[] = [];


  constructor(
    private router: Router,
    private localstorageService: LocalStorageService,
    private helperclass: HelperClass, private apiservice: ApiService) {
    this.currentDate = new Date().toISOString();
    this.dateFromPicker = this.currentDate;

    this.localstorageService.getDistributor()
      .then((distributor) => {

        if (distributor != null) {

          var distributore = new DistributorDetails();
          distributore = distributor;

          this.searchPayload.signatureKey = AppConstants.signatureKey;
          this.searchPayload.distributorId = distributore.distributorId.toString();


        }
      })
      .catch((err) => {
        console.log("ADM" + JSON.stringify(err))
      })


  }


  ngOnInit() {
  }

  editCaf(index: number) {

    if (this.searchItems[index].cafStatus == 'Uploaded' || this.searchItems[index].cafStatus == 'Pending') {
      let navigationExtras: NavigationExtras = {
        state: {
          itemSend: this.searchItems[index]
        }
      };
      this.router.navigate(['upload-caf'], navigationExtras);
    }

  }

  search() {
    if (!this.customerName && !this.cafNumber && !this.mobileNumber && !this.dateFromPicker) {
      this.helperclass.showMessage("Please enter any search keyword");
      return;
    }
    if (this.mobileNumber) {

      if (this.mobileNumber.includes(",") || this.mobileNumber.includes(".") || this.mobileNumber.includes(" ") ||
        this.mobileNumber.includes("-")) {
        this.helperclass.showMessage("Please enter a valid mobile number");
        return;
      }

    }

    if (this.cafNumber) {

      var expr = /^[a-zA-Z0-9]*$/;
      if (!expr.test(this.cafNumber)) {
        this.helperclass.showMessage("Only Alphabets and Numbers are allowed in CAF Number ");
        return;

      }

    }



    if (!this.helperclass.isConnected()) {
      this.helperclass.showMessage(AppConstants.NoInternetConnectionErrMsg);
      return;
    }



    this.helperclass.showLoading("Searching ...");
    const searchPayload = new SearchCafeRequest();
    searchPayload.signatureKey = AppConstants.signatureKey;
    searchPayload.distributorId = this.searchPayload.distributorId;

    this.apiservice.SearchCaf(searchPayload)
      .then((res) => {

        //RESPONSE FROM SERVER
        
        let response = new GeneralResponse();
        response = JSON.parse(res.data);
        this.cafeItems = response.Result_Output;
        console.log("SEARCH Response" + JSON.stringify(this.cafeItems));
        

        //FILTER ARRAY ON SEARCH ENTRY
        this.filterArray();
        console.log("SEARCH Response RESULT" + JSON.stringify(this.searchItems));
        
        this.helperclass.dismissLoading()
        console.log("SEARCH PAGE SEARCHED RESULT IS" + this.searchItems.length)
        if (this.searchItems.length == 0) {
          this.helperclass.showMessage("No CAF Found , Try Again")
        }
      })
      .catch((err) => {
        this.helperclass.dismissLoading();
        this.helperclass.showMessage(AppConstants.apiErrorMessage)
        console.error("SEARCH   Error  is " + JSON.stringify(err));
      })



  }
  filterArray() {
    var abc = moment(this.dateFromPicker).format('MMM-DD-YYYY').split("-");
   
    var selectedDate = abc[1] + " " + abc[0] + " " + abc[2];
    console.log("SEARCH" + selectedDate);
    this.searchItems = [];


    this.cafeItems.forEach(element => {


      if (element.cafNumber == this.cafNumber || element.customerName.toLowerCase() == this.customerName.toLowerCase() || element.mobileNumber == this.mobileNumber

        || this.getFormattedDate(element.uploadedDate) == selectedDate || this.getFormattedDate(element.cafApprovedDatetime) == selectedDate) {

        this.searchItems.push(element);

      }
    });

  }

  getFormattedDate(date: string): any {
    if (!date) {
      return "";
    }
    else {
      var arr = date.split(" ");
      if(parseInt(arr[1]) <10){
        arr[1] = "0"+arr[1];
      }
      var abc = arr[1] + " " + arr[0] + " " + arr[2];
      console.log("Search"+abc)
      return abc.replace(',', '');

    }


  }

}




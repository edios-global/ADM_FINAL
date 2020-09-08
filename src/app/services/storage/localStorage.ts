import { DistributorDetails, DateAndTime } from './../../modals/modal';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { User } from 'src/app/modals/modal';
import { AppConstants } from 'src/app/utils/AppConstants';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private nativeStorage: NativeStorage) { }

  /*
  Function to store user 
   */
  public storeDistributor(distributor: DistributorDetails) {
    this.nativeStorage.setItem(AppConstants.distributorKey, JSON.stringify(distributor))
      .then(() => {
        console.log("LocalStorage : User saved successfully");
      })
      .catch((error) => {
        console.error("LocalStorage :Error in saving user" + JSON.stringify(error))
      })

  }


  /*Function to get user  
   */
  public async getDistributor() {
    const distributor = await this.nativeStorage.getItem(AppConstants.distributorKey)
    if (distributor != null) {
      return JSON.parse(distributor);
    }

  }



  /**
   * storeDateAndTime FUNCTION TO STORE LAST DATE AND TIME
   */
  public storeDateAndTime(dateAndTime: string):any {
    return this.nativeStorage.setItem(AppConstants.dateAndTime, dateAndTime)


  }

  /**
   * getDateAndTime
   */
  public async getDateAndTime() {
    const dateAndTime = await this.nativeStorage.getItem(AppConstants.dateAndTime)
    if (dateAndTime != null) {
      return dateAndTime;
    }
  }

  clear(key: string) {
    this.nativeStorage.clear();
  }


}

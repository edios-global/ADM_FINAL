export class User {
    username: string;
    password: string;
}

export class DistributorDetails {

    distributorName: string
    distributorUserName: string
    distributorStatus: string
    distributorId: number
    distributorUserPassword: string
    distributorUserCode: string
}
export class UploadImages {
    imageUrl: string = "";
    docType: string = "";
    loaded: boolean = false;
    synced: boolean = false;

    constructor(imageUrl, loaded, synced) {
        this.imageUrl = imageUrl,
            this.loaded = loaded,
            this.synced = synced
    }
}

export class CafSearchResponse {

    noOfConnections: number
    cafNumber: string
    cafId: number
    cafType: string
    cafApprovedDatetime: string
    companyName: string
    uploadedDate: string
    cafStatus: string
    customerName: string
    notes: string
    fatherName: string
    mobileNumber: string

}
export class cafIdResponse {
    cafId: number;
}

export class DateAndTime{
    date : string
    time : string

}
export class cafImages {

    fileName: string
    cafId: number
    cafImageId: number
    documentType: string
    cafFileUrl: string
}

export class UploadCafImageData {

    signatureKey: string
    documentType: string
    fileName: string
    baseUrl: string
    cafID: string
}


export class LoginResponse {

    Result_Status: string
    Result_Message: string
    Result_Output: any
    Result_Code: string
}
export class GeneralResponse extends LoginResponse {

    updatedDate: string
}


export class SevenDaysResponse {

    dailyRejectedCount: number
    cafAuditDatetime: string
    dailyUploadedCount: number
    dailyApprovedCount: number
    cafUploadedDatetime:string
}

export class CafDetailsResponse extends SevenDaysResponse {

    uploadedCount: number
    //currentDayApprovedCount: number
    //processedCount: number
    rejectedCount: number
    // approvedCount: number
    currentMonthApprovedCount: number
}


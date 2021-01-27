export class UserCode{
    distributorUserCode : string
}
export class LoginRequest extends UserCode{
    
    signatureKey: string
    distributorUserCode: string
    distributorUserPassword: string

}
export class CafeCountRequest extends UserCode {
    signatureKey: string
    distributorId: number
}
export class SearchCafeRequest extends UserCode {
    signatureKey: string
    distributorId:string

}
export class ResubmitCafPayload extends UserCode {
    signatureKey: string
    cafId:string

}
export class AppVersionResponse{
    
        Result_Status: string
        Result_Output: any
        Result_Code: string
    
}
export class map{

    versionName  : string
    forceUpdate  : boolean

}

export class CafePayload extends UserCode {

    signatureKey: string
    duplicateCafId:number
    cafType: string
    cafNumber: string
    companyName: string
    customerName: string
    fatherName: string
    noOfConnections: string
    cafStatus: string
    notes: string
    distributorID: string
    cafId : string
    mobileNumber :string
}
export class EditCafDetail extends UserCode {

    signatureKey: string
    cafId: string

}
export class RemoveDocument extends UserCode{
    signatureKey: string
    cafId: string
    fileName:string
    deleteNotes:string

}


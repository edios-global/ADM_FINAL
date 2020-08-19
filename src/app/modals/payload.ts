export class LoginRequest {

    signatureKey: string
    distributorUserCode: string
    distributorUserPassword: string

}
export class CafeCountRequest {
    signatureKey: string
    distributorId: number
}
export class SearchCafeRequest {
    signatureKey: string
    distributorId:string

}

export class CafePayload {

    signatureKey: string
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
export class EditCafDetail {

    signatureKey: string
    cafId: string

}
export class RemoveDocument{
    signatureKey: string
    cafId: string
    fileName:string
    deleteNotes:string

}
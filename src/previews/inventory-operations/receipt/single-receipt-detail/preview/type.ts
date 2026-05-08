export interface singleReceiptDataType {
  recepitId:                      number;
  rno:                            string;
  actualAmount:                   number;
  distAmount:                     number;
  recepitAmount:                  number;
  customerName:                   string;
  customerIdentityNo:             string;
  recepitDate:                    Date;
  paymentMode:                    string;
  manualRecpNo:                   string;
  remarks:                        string;
  isRealized:                     boolean;
  vMRptSingleRecepitRefrenceList: VMRptSingleRecepitRefrenceList[];
}

export interface VMRptSingleRecepitRefrenceList {
  instellmentType: string;
  propertyType:    string;
  propertyNo:      string;
  floorName:       string;
}

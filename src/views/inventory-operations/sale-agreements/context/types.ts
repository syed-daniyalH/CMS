export interface SaleAgreementsDataType {
  agreeId?: number
  propertyId?: number
  saleDate: string | Date
  orgPrice: number
  distPercentage: number
  distAmount: number
  soldPrice: number
  planId?: number
  customerId?: number
  floorId?: number
  ratePerSqft?: number
  marlaRate?: number
  areaMarla?: number
  areaSqft?: number
  typeId?: number
  agentId?: number
  agentPercentage: number
  agentAmout: number
  formNo: string
  secondNo: string
  remarks: string
  isMarkSale: boolean
  vmSaleAgreementInstallments: saleAgreementInstallment[]
}
export interface saleAgreementInstallment {
  instTypeId?: number
  isEditing?: number
  recAmount?: number
  recno?: number
  installmentStartDate: string | Date
  noOfInstallment: number
  instPercentage: number
  installmentAmount: number
  totalInstallmentAmount: number
  isCharged: boolean
  chargeId?: number
  monthGap: number
}

export interface DefaultValuesType {
  saleAgreements: SaleAgreementsDataType | null
  loadSaleAgreementsData: (recno: number) => Promise<void> | null,
  storeSaleAgreements: (attachments: File[]) => Promise<void> | null,
  handleSaleAgreementsData: (update: any) => void
  handleInstallmentDetailData: (update: any,value:any) => void
  removeSaleDetailAgreements: (index: number) => void
  resetSaleAgreementsData: () => void
  addInstallmentDetail: () => void
  removeInstallmentDetail: (value:any) => void
  recalcFrom: () => void
  recalcAllInstallments: (value:any,index:any) => void
}

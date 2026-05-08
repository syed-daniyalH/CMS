export interface InventoryPreviewDataType {
  recno: number
  itemName: string
  catagory: string | null
  subCatagory: string | null
  brand: string | null
  unit: string | null
  isAssetItem: boolean
  isServiceItem: boolean
  color: string | null
  sSize: string | null
  discountType: string | null
  code: string | null
  sku: string | null
  image: string
  purchaseRate: number | null
  salesRate: number | null
  purchaseAccount: string | null
  salesDescription: string | null
  purchaseDescription: string | null
  revenueAccount: string | null
  createdBy: string | null
  itemType: string | null
  discontinue: boolean | null
  isNonInventory: boolean | null
  balance: number | null
  createdAt: string | null
  dynamicFields: DynamicFieldDataType[]
}

export interface DynamicFieldDataType {
  dynamicFieldId: number
  fieldName: string
  fieldType: string
  value: string
}

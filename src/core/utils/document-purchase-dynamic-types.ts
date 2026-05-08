import {SubUnitListProps} from "../dropdown-selectors/SubUnitSelector";

export interface Tag {
  tagId?: number | null;
  optionId?: number | null;
}

export interface PurchaseDetails {
  lineno: number;
  itemId?: number | null;
  qty: number;
  invoiceAbleQty?: number | null;
  pcQty?: number | null;
  discountType?: string | null;
  discountVal: number;
  taxPer?: number | null;
  fedPer?: number | null;
  otherTaxPer?: number | null;
  sRemarks?: string | null;
  source?: string | null;
  sourceno?: number | null;
  sourceLocation?: number | null;
  sourceFyear?: number | null;
  sLine?: number | null;
  taxType?: number | null;
  costCenter?: number | null;
  cLocation?: number | null;
  transactionCurrencyRate: number;
  transactionCurrencyConversionRate: number;
  recno?: number | null;
  transactionDiscountAmount: number;
  transactionTaxAmount: number;
  transactionTotalAmount: number;
  transactionInAmount: number;
  transactionExAmount: number;
  customerId?: number | null;
  skuCode?: string | null;
  workOrderId?: number | null;
  unitId?: number | null;
  subUnitId?: number | null;
  unitFraction?: number | null;
  subUnitQty?: number | null;
  subUnitDefaultId?: number | null;
  subUnitTransactionRate: number;
  batch?: string | null;
  batchDate?: string | Date | null;
  isBillable: boolean;
  billableMarkupPercent?: number | null;
  tags: Tag[];
  uomList: SubUnitListProps[];
  isEditing?: boolean | null;
  isNewAdded: boolean;
  isDeleted: boolean;
  isUpdated: boolean;
}

export interface PurchaseCoaDetail {
  lineno: number;
  coaId?: number | null;
  sRemarks?: string | null;
  taxType?: number | null;
  taxPer?: number | null;
  costCenter?: number | null;
  cLocation?: number | null;
  transactionCurrencyRate: number;
  transactionCurrencyConversionRate: number;
  recno?: number | null;
  transactionDiscountAmount: number;
  transactionTaxAmount: number;
  transactionInAmount: number;
  transactionExAmount: number;
  transactionDiscountDiff: number;
  transactionTaxDiff: number;
  customerId?: number | null;
  workOrderId?: number | null;
  isBillable: boolean;
  billableMarkupPercent?: number | null;
  tags: Tag[];
  isEditing?: boolean | null;
  isNewAdded: boolean;
  isDeleted: boolean;
  isUpdated: boolean;
}

export interface PurchaseTaxDetail {
  recno?: number | null;
  taxType?: number | null;
  taxPercent?: number | null;
  lineno?: number | null;
  invoiceRecno?: number | null;
  transactionCurrencyConversionRate: number;
  transactionCurrencyTaxAmount: number;
  baseCurrency: number | null;
  transactionCurrency: number | null;
  isNewAdded: boolean;
  isDeleted: boolean;
  isUpdated: boolean;
}


export interface PurchaseLandedCostDetail {
  lineno: number;
  itemId?: number | null;
  qty: number;
  invoiceAbleQty?: number | null;
  pcQty?: number | null;
  discountType?: string | null;
  discountVal: number;
  taxPer?: number | null;
  fedPer?: number | null;
  otherTaxPer?: number | null;
  sRemarks?: string | null;
  source?: string | null;
  sourceno?: number | null;
  sourceLocation?: number | null;
  sourceFyear?: number | null;
  sLine?: number | null;
  batch?: string | null;
  taxType?: number | null;
  batchDate?: string | null;
  costCenter?: number | null;
  foc?: number | null;
  cLocation?: number | null;
  transactionCurrencyRate: number;
  transactionCurrencyConversionRate: number;
  recno?: number | null;
  transactionDiscountAmount: number;
  transactionTotalAmount: number;
  transactionTaxAmount: number;
  transactionInAmount: number;
  transactionExAmount: number;
  customerId?: number | null;
  skuCode?: string | null;
  workOrderId?: number | null;
  isBillable?: boolean | null;
  billableMarkupPercent?: number | null;
  tags?: Tag[] | null;
  isNewAdded: boolean;
  isDeleted: boolean;
  isUpdated: boolean;
  isLandedCostRow: boolean;
  isEditing?: boolean | null;
  unitId?: number | null;
  subUnitId?: number | null;
  unitFraction?: number | null;
  subUnitQty?: number | null;
  subUnitDefaultId?: number | null;
  subUnitTransactionRate: number;
}


export interface PurchaseDocumentType {
  pDate: Date;
  term?: string | null;
  creditTermsValue?: string | null;
  poCode?: string | null;
  crDays?: number | null;
  remarks?: string | null;
  terms?: string | null;
  code?: string | null;
  systemCode?: string | null;
  otherTerms?: string | null;
  vendorInvoiceNo?: string | null;
  baseCurrency: number | null;
  transactionCurrency: number | null;
  recno?: number | null;
  transactionCurrencyspdiscount: number;
  transactionCurrencyTotalAmount: number;
  transactionCurrencyTotalDiscount: number;
  transactionCurrencyNetAmount: number;
  transactionCurrencyInvoiceCredit: number;
  transactionCurrencyBalance: number;
  transactionCurrencyInvoiceReceived: number;
  transactionCurrencyCashAmount: number;
  transactionCurrencyCreditAmount: number;
  transactionCurrencyFreight: number;
  transactionCurrencyRate: number;
  transactionCurrencyConvertedRate: number;
  transactionCurrencyInvoiceTotalTaxAmount: number;
  transactionCurrencyFreightTaxAmount: number;
  vendorId?: number | null;
  coaId?: number | null;
  paymentCOAId?: number | null;
  isServiceInvoice?: boolean | null;
  taxType?: number | null;
  invoiceTaxType?: string | null;
  areaId?: number | null;
  creditTerms?: number | null;
  creditDueDate?: Date | null;
  costCenter?: number | null;
  cLocation: number | null;
  deliveryLocation?: number | null;
  refNo?: string | null;
  refrenceNo?: string | null;
  purchaseLocation?: number | null;
  expectedDelivery?: Date | null;
  changeDefaultTerms?: boolean | null;
  changeDefaultNotes?: boolean | null;
  statementRecno?: number | null;
  status?: string | null;
  freightTaxType?: number | null;
  freightTaxPer?: number | null;
  source?: string | null;
  sourceNo?: number | null;
  sourceRecno?: number | null;
  sourceLocation?: number | null;
  sourceYear?: number | null;
  ptype?: string | null;
  chequeNo?: string | null;
  chequeDate?: string | Date | null;
  details: PurchaseDetails[];
  landedCostDetails?: PurchaseLandedCostDetail[] | null;
  coaDetails: PurchaseCoaDetail[];
  taxDetails: PurchaseTaxDetail[];
  serverTaxDetails: PurchaseTaxDetail[];
}


export interface ProjectParams {
  projectId?: number | null,
  customerId?: number | null
}

export interface ReceiptDataList {
  isEditing?: boolean | null;
  lineno: number;
  refId?: number;
  recepitId?: number;
  installmentId?: number;
  agreeId?: number;
  propertyId?: number;
  amount: number;
  instTypeId?: number;
}

export interface ReceiptDataType {
  recepitId?: number | null;
  rno?: string;
  actualAmount: number;
  distAmount: number;
  recepitAmount: number;
  customerId?: number;
  recepitDate: Date | string; // ISO date (e.g., "2025-10-06")
  paymentModeId?: number;
  manualRecpNo: string;
  bankId?: number | null;
  presentedDate: Date | string; // ISO date
  remarks: string;
  isBuyBack: boolean;
  isRealized: boolean;
  vMRecepitRefrenceLists: ReceiptDataList[];
}

export interface DefaultValuesType {
  receipt: ReceiptDataType | null
  loadReceiptData: (recno: number) => Promise<void> | null,
  storeReceipt: (attachments: File[]) => Promise<void> | null,
  handleReceiptData: (update: any) => void
  handleReceiptDetailData: (update: any, lineno: number) => void
  addReceiptDetail: () => null,
  removeReceiptDetail: (index: number) => null,
  resetReceiptData: () => void
}

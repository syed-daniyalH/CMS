export interface CustomerDataType {
  customerId?: number;
  parentCustomerId?: number;
  firstName: string;
  secondName: string;
  typeId?: number | null;
  gender: string;
  identityNo?: string | null;
  identityExpDate?: string | Date | null; // ISO date string
  isActive: boolean;
  guardianType?: number | null;
  guardianName?: string | null;
  dob?: string | Date | null; // ISO date string
  nationality?: string | null;
  city?: string | null;
  country?: string | null;
  countryId?: number | null;
  tempAddress?: string | null;
  permAddress?: string | null;
  email?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  remarks?: string | null;
  passNo?: string | null;
  customerImageUrl?: string | null;
  passExpDate?: string | Date | null; // ISO date string
  isAllowLogin: boolean;
  nomineesList: Nominee[];
}

export interface Nominee {
  nomId?: number;
  custAgentId?: number;
  name: string;
  email: string;
  phone?: string | null;
  relation?: string | null;
  identityNo?: string | null;
  nomFor?: number | null;
  identityExp?: string | null | Date; // ISO date string
  address?: string | null;
  remarks?: string | null;
}


export interface DocumentDataType {
  files: File[]
  documentNo?: string | null
  comments?: string | null
  docId?: number | null
  countryId?: number | null
  issuedOn?: string | null
  validFrom?: string | null
  expiresOn?: string | null
  docTypeId?: number | null
  customerId?: number | null
  documents: DocumentsFilesDataType[]
}


export interface DocumentsFilesDataType {
  url: string,
  documentId: number,
  size: number
}

export interface DefaultValuesType {
  documents: DocumentDataType[]
  customer: CustomerDataType | null
  storeDocument: (doc: DocumentDataType) => Promise<void> | null,
  nominee: Nominee | null
  removeDocument: (recno: number) => Promise<void> | null,
  loadCustomerData: (recno: number) => Promise<void> | null,
  storeCustomer: (attachments: File[], imageFiles: File[]) => Promise<void> | null,
  handleCustomerData: (update: any) => void
  handleNominee: (update: any) => void
  resetCustomerData: () => void
  resetNominee: () => void
}

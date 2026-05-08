export interface PropertyDataType {
  propertyId?: number;
  floorId?: number;
  typeId?: number;
  propertyNo: string;
  currenctStatus?: string;
  setupDate?: string;
  statusId?: number;
  areaSqft: number;
  ratePerSqft: number;
  areaMarla: number;
  marlaRate: number;
  orgPrice: number;
  saleablePrice: number;
  tax?: number;
  cost?: number;
  prefId?: number;
  prefPercentage?: number;
  prefAmount?: number;
  secondNo?: string;
  regNo?: string;
  remarks?: string;
  dimensions?: string;
}

export interface DefaultValuesType {
  property: PropertyDataType | null
  loadPropertyData: (recno: number) => Promise<void> | null,
  storeProperty: (attachments: File[]) => Promise<void> | null,
  handlePropertyData: (update: any) => void
  resetPropertyData: () => void
}

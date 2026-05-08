export interface SalePlansDataType {
  salePlan: SalePlanObj;
  subSalePlan: SubSalePlanObj[];
}


export interface SalePlanObj {
  planId?: number;
  description: string;
  areaSqft: number;
  areaMarla: number;
  defSalePrice: number;
  isDefault: boolean;
}


export interface SubSalePlanObj {
  recno?: number;
  planId?: number;
  instTypeId?: number | null;
  percentage?: number | null;
  noOfInst?: number | null;
  instAmount?: number | null;
  totalInstAmount?: number | null;
  monthGap?: number | null;
  isInclude?: boolean | null;
  inststName?: string | null;
}


export interface DefaultValuesType {
  salePlans: SalePlansDataType;
  loadSalePlansData: (recno: number) => Promise<SalePlansDataType>;
  handleSalePlansData: (update: Partial<SalePlanObj>) => void;
  setSalePlans: (value:any) => void;
  resetSalePlansData: () => void;
  storeSalePlans: (attachments: File[]) => Promise<any>;
  addSaleDetailPlans: (data: SubSalePlanObj) => void;
  removeSaleDetailPlans: (index: number) => void;
}


// A convenient strongly-typed factory for new models
export const createNewSalePlans = (): SalePlansDataType => ({
  salePlan: {
    description: "",
    defSalePrice: 0,
    isDefault: false,
    areaSqft: 0,
    areaMarla: 0,
  },
  subSalePlan: [],
});

// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'


export interface DropDownParamsType {
  Recno?: number | null,
  TaxTreatmentTypeId?: number | null,
  CustomerId?: number | null,
  FloorId?: number | null,
  AreaMarla?: number | null,
  AreaSqft?: number | null,
  TypeId?: number | null,
  payPeriodId?: number | null,
  DefaultCurrencyId?: number | null,
  Name?: string | null,
  CategoryId?: number | string | null
  CountryId?: number | string | null
}

export interface OrgUsersDropdown {
  value: number
  text: string
  image?: string | null
}
export interface AssetsTypeDropdown {
  value: number,
  text: string,
  assetAccount: number,
  depreciationAccount: number,
  expenseAccount: number,
  deprecetionMethod: number,
  averagingMethod: number,
  depreciationPercent: number,
  effectiveLife: number
}

export interface DocumentTypeEmp {
  value: number
  text: string
  isSelected: boolean
  isRequried: boolean
}



export interface DetailAccountTypeParams {
  Recno?: number | null,
  Type?: number | null
}

export interface TemplateBankDetailsObj {
  recno: number
  banckAccountTitle: string
  bankName: string
  bankAccountNo: string
  bankIBAN: string
  bankSwiftCode: string
  bankBranchName: string
}

export interface BanksDropDownObj {
  recno: number
  parentRecno: number
  text: string
  code: string
  categoryId: number
  level: number
  defaultCurrencyId: number
  type: number
  secondLanguageName: string
}

export interface CategoryDropdownObj {
  recno: number
  text: string
  code: string | null
  mobile?: string | null
  level?: number | null
  description?: string | null
  defaultCurrencyId?: number | null
}

export interface HSCodeDropdownObj {
  hsCode: string
  description: string
}


export interface FbrScenarioDropdownObj {
  scenerioId: string,
  rate: string,
  ratePercent: number,
  extraTaxPercent: number,
  furtherTaxPercent: number,
  fedpayable: number,
  saleType: string,
  description: string
}

export interface CustomerProjectDropdownObj {
  recno: number
  customerId: number
  projectId?: number | null
  type: string
  text: string
  code: string
  coaName: string
  coaId: number
  area: number
  creditTerms?: number | null
  advanceAdjustCOAName: string
  advanceAdjustCOAId: number
  mobileNo: string
  creditDays: number
  creditLimit: number
  defaultCurrencyId: number
  level: number
  address: string
}

export interface ProjectDropdownObj {
  recno: number
  projectLevel?: number | null
  customerId: number
  name: string
  customerName: string
}

export interface CurrencyDropdownObj {
  recno: number
  name?: string
  text: string
  code: string
  symbol: string
  subUnit: string
  isDefaultCurrency: boolean
  conversionRate: number
}

export interface ItemDropdownObj {
  recno: number
  name: string
  saleRate: number
  purchaseRate: number
  discountType: string
  description?: string | null
  sku?: string | null
  code: string
  revenueAccount?: number
  costAccount?: number
  purchaseAccount?: number
  transferAccount?: number
  salesAccount?: number
  qty: number
  salesTaxTypeId?: number | null
  smPrice: number
  distributorPrice: number
  resellerPrice: number
  lockPrice: number
  itemTaxType: string
  salesTaxType: string
  unit: number
  isService: boolean
  subUnits: SubUnitDataType[]
}

export interface SubUnitDataType {
  recno: number
  description: string
  isDefault: boolean
  ratio: number
}

export interface SupplierDropdownObj {
  recno: number
  text: string
  code: string | null
  coaName: string | null
  coaId: number
  advanceAdjustCOAName: string | null
  advanceAdjustCOAId: number | null
  mobileNo: string | null
  creditDays: number | null
  creditLimit: number | null
  area: number | null
  defaultCurrencyId: number | null
  vatRegistered: boolean | null
  creditTerms: number | null
  address: string | null
}

export interface ItemAdjDropdownObj {
  itemId: number
  itemName: string
  rate: number | null
  qty: number | null
  unit: number | null
  subUnits: SubUnitDataType[]
}

export interface GenericDropdownObj {
  total?: number | string | null
  value?: number | string | null
  text?: string
  code?: string | null
  defaultValue?: string | null
  taxPercent?: number | null
  saleablePrice?: number | null
  areaMarla?: number | null
  areaSqft?: number | null
  marlaRate?: number | null
  ratePerSqft?: number | null
  prefPercentage?: number | null
  showOpeningBalances?: boolean | null
  showCurrency?: boolean | null
  group?: boolean | string | null
}

export interface CountryDropdownObj {
  recno: number | null
  name: string
  code: string | null
}

export interface WHTDropdownObj {
  taxName?: string,
  taxPercent?: number,
  coaId?: number
}
export interface CityDropdownObj {
  recno: number | null
  name: string
  countryId: number,
  countryName: string
}

export interface TaxTreatmentDropdownObj {
  value: number | null
  text: string
  showTaxNo: boolean | null
  showPlaceOfSupply: boolean | null
}

export interface EmployeeDropdownObj {
  id: number
  code?: string
  name: string
  fName?: string
  lName?: string
  monthlySalary?: number
  netSalary?: number
  grossSalary?: number
  advances?: number
  expenseCoa?: number
  advanceCoa?: number
}


export const getCategories = createAsyncThunk('appDropdowns/getCategories', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/InventoryCategories', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getHSCodes = createAsyncThunk('appDropdowns/getHSCodes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetFbrHsCodes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDesignations = createAsyncThunk('appDropdowns/getDesignations', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetEmployeeDesignations', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getDepartments = createAsyncThunk('appDropdowns/getDepartments', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetEmployeeDepartments', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDocTypes = createAsyncThunk('appDropdowns/getDocTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetCustomerDocumentsTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getEmployeeTypes = createAsyncThunk('appDropdowns/getEmployeeTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetPayRollEmployeeTypes', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getEmployeeContracts = createAsyncThunk('appDropdowns/getEmployeeContracts', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetPayRollEmployeeContractTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getEmployeeMarital = createAsyncThunk('appDropdowns/getEmployeeMarital', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetPayRollEmployeeMaritalStatuses', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDynamicFields = createAsyncThunk('appDropdowns/getDynamicFields', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetDynamicFields', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getEmpStatus = createAsyncThunk('appDropdowns/getEmpStatus', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetEmployeeStatuses', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getPendingPayPeriods = createAsyncThunk('appDropdowns/getPendingPayPeriods', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetAllPendingPayRollPayPeriods', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getClosedPayPeriods = createAsyncThunk('appDropdowns/getClosedPayPeriods', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetAllClosedPayRollPayPeriods', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAllPayPeriods = createAsyncThunk('appDropdowns/getAllPayPeriods', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetAllPayRollPayPeriods', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAllowances = createAsyncThunk('appDropdowns/getAllowances', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetPayRollAllowances', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getEmployees = createAsyncThunk('appDropdowns/getEmployees', async (params: DropDownParamsType) => {
  const response = await axios.get(`/Defaults/GetPayRollEmployees/${params.payPeriodId}`, { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAllEmployees = createAsyncThunk('appDropdowns/getAllEmployees', async (params: DropDownParamsType) => {
  const response = await axios.get(`/Defaults/PayRollEmployees`, { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDeductions = createAsyncThunk('appDropdowns/getDeductions', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetPayRollDeductions', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getEarnings = createAsyncThunk('appDropdowns/getEarnings', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetPayRollEarnings', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getFbrScenarios = createAsyncThunk('appDropdowns/getFbrScenarios', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetFbrScenerios', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getWHTTaxes = createAsyncThunk('appDropdowns/getWHTTaxes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetWithHeldTaxesList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDetailAccounts = createAsyncThunk('appDropdowns/getDetailAccounts', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/DetailCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAccountsType = createAsyncThunk('appDropdowns/getAccountsType', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/COATypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getPayrollPaymentTypes = createAsyncThunk('appDropdowns/getPayrollPaymentTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetPayRollEmployeePaymentInformation', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAccountsCategories = createAsyncThunk('appDropdowns/getAccountsCategories', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/COACategories', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDefaultFloors = createAsyncThunk('appDropdowns/getDefaultFloors', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetActiveFloors', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDefaultInstallmentTypes = createAsyncThunk('appDropdowns/getDefaultInstallmentTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetActiveInstallmentTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDefaultPaymentModes = createAsyncThunk('appDropdowns/getDefaultPaymentModes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetPaymentModeTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAccountsDetailType = createAsyncThunk('appDropdowns/getAccountsDetailType', async (params: DetailAccountTypeParams) => {
  const response = await axios.get('/Defaults/COALevel2TypeWiseControlCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAccountParentType = createAsyncThunk('appDropdowns/getAccountParentType', async (params: DetailAccountTypeParams) => {
  const response = await axios.get('/Defaults/ControlCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAccountsDetailTypeWise = createAsyncThunk('appDropdowns/getAccountsDetailTypeWise', async (params: DetailAccountTypeParams) => {
  const response = await axios.get('/Defaults/DetailTypeWiseCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getBanks = createAsyncThunk('appDropdowns/getBanks', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/DetailCashBankCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getUnits = createAsyncThunk('appDropdowns/getUnits', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/InventoryMunits', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getBrands = createAsyncThunk('appDropdowns/getBrands', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/InventoryBrands', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getColors = createAsyncThunk('appDropdowns/getColors', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/InventoryColors', { params })
  return {
    params,
    data: response.data
  } as any
})
export const getAssemblyTemplates = createAsyncThunk('appDropdowns/getAssemblyTemplates', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetAssemblyTemplatesList', { params })
  return {
    params,
    data: response.data
  } as any
})
export const getAreas = createAsyncThunk('appDropdowns/getAreas', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/areas', { params })
  return {
    params,
    data: response.data
  } as any
})
export const getDepreciationMethods = createAsyncThunk('appDropdowns/getDepreciationMethods', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetFixedAssetsDepreciationMethods', { params })
  return {
    params,
    data: response.data
  } as any
})
export const getAveragingMethods = createAsyncThunk('appDropdowns/getAveragingMethods', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetFixedAssetsAveragingMethods', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getClasses = createAsyncThunk('appDropdowns/getClasses', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/CostCenters', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getSupplier = createAsyncThunk('appDropdowns/getSupplier', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/Vendors', { params })
  return {
    params,
    data: response.data
  } as any
})
export const getOrgUsers = createAsyncThunk('appDropdowns/getOrgUsers', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetOrganizationUsers', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getSalesStatus = createAsyncThunk('appDropdowns/getSalesStatus', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/SalesStatuses', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getJobsStatus = createAsyncThunk('appDropdowns/getJobsStatus', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetAssemblyingStatuses', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getJournalStatus = createAsyncThunk('appDropdowns/getJournalStatus', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/JournalVoucherStatuses', { params })
  return {
    params,
    data: response.data
  } as any
})
export const getProjectStatus = createAsyncThunk('appDropdowns/getProjectStatus', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetProjectStatuses', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getProjectTypes = createAsyncThunk('appDropdowns/getProjectTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetProjectsTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getBillsStatus = createAsyncThunk('appDropdowns/getBillsStatus', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/PurchaseStatuses', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getExpenseStatus = createAsyncThunk('appDropdowns/getExpenseStatus', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/ExpenseStatuses', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getCustomers = createAsyncThunk('appDropdowns/getCustomers', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetActiveCustomers', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getAgents = createAsyncThunk('appDropdowns/getAgents', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetActiveAgents', { params })
  return {
    params,
    data: response.data
  } as any
})



export const getPreferences = createAsyncThunk('appDropdowns/getPreferences', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetActivePrefrence', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getProjects = createAsyncThunk('appDropdowns/getProjects', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetActiveProjects', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getCustomerType = createAsyncThunk('appDropdowns/getCustomerType', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetCustomerAgentTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getPropertyType = createAsyncThunk('appDropdowns/getPropertyType', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetActivePropTypes', { params })
  return {
    params,
    data: response.data
  } as any
})
export const getPropertyListSelector = createAsyncThunk('appDropdowns/getPropertyListSelector', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetAllPropertyList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getPropertyStatus = createAsyncThunk('appDropdowns/getPropertyStatus', async (params: DropDownParamsType) => {
  const response = await axios.get('/Dropdowns/GetActivePropStatus', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getParentProjects = createAsyncThunk('appDropdowns/getParentProjects', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetParentProjects', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getCountries = createAsyncThunk('appDropdowns/getCountries', async (params: DropDownParamsType) => {
  const response = await axios.get('/OpenDefaults/CountriesesList', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getOrgTypes = createAsyncThunk('appDropdowns/getOrgTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/OpenDefaults/TenantsTypesList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getInventory = createAsyncThunk('appDropdowns/getInventory', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/Inventory', { params })
  return {
    params,
    data: response.data
  } as any
})
export const getSaleInventory = createAsyncThunk('appDropdowns/getSaleInventory', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/Inventory', { params: {...params, Type: 'sales'} })
  return {
    params,
    data: response.data
  } as any
})
export const getBranches = createAsyncThunk('appDropdowns/getBranches', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/Locations', { params: {...params, Type: 'sales'} })
  return {
    params,
    data: response.data
  } as any
})

export const getInventoryAdj = createAsyncThunk('appDropdowns/getInventoryAd', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetInventeoryAvgPurchaseRateWithQty', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getInventoryServices = createAsyncThunk('appDropdowns/getInventoryServices', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetNonInventeoryServiceItems', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getSizes = createAsyncThunk('appDropdowns/getSizes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/InventorySizes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getVatReturnPeriod = createAsyncThunk('appDropdowns/getVatReturnPeriod', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetVatReturnPeriodTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getLiabilityAccounts = createAsyncThunk('appDropdowns/getLiabilityAccounts', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/DetailLiabilitiesCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getEquityAccounts = createAsyncThunk('appDropdowns/getEquityAccounts', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/DetailEquityCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getExpenseAccounts = createAsyncThunk('appDropdowns/getExpenseAccounts', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/DetailExpenditureCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDefaultAssetsTypes = createAsyncThunk('appDropdowns/getDefaultAssetsTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetFixedAssetTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDefaultWorkLocations = createAsyncThunk('appDropdowns/PayrollWorkLocations', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/PayrollWorkLocations', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDefaultDisposalTypes = createAsyncThunk('appDropdowns/getDefaultDisposalTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetFixedAssetDisposalTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getRevenueAccounts = createAsyncThunk('appDropdowns/getRevenueAccounts', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/DetailRevenueCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getInterestAccounts = createAsyncThunk('appDropdowns/getInterestAccounts', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/DetailExpenditureOtherIncomeCOAList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getTaxTypes = createAsyncThunk('appDropdowns/getTaxTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/TaxTypes', { params })
  return {
    params,
    data: response.data
  } as any
})


export const getJVTypes = createAsyncThunk('appDropdowns/getJVTypes', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/JVTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getTaxTreatments = createAsyncThunk('appDropdowns/getTaxTreatments', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetTaxTreatmentTypes', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getAdjReasons = createAsyncThunk('appDropdowns/getAdjReasons', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetInventoryAdjustmentReasons', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getConReasons = createAsyncThunk('appDropdowns/getConReasons', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/GetInventoryConsumptionReasons', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getUsers = createAsyncThunk('appDropdowns/getUsers', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/LocationUsers', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getPolicies = createAsyncThunk('appDropdowns/getPolicies', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/AllPolicies', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getSalesman = createAsyncThunk('appDropdowns/getSalesman', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/Employees', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getCreditTerms = createAsyncThunk('appDropdowns/getCreditTerms', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/InvoiceCreditTerms', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getCurrencies = createAsyncThunk('appDropdowns/getCurrencies', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/TenantCurrencies', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getDefaultCurrencies = createAsyncThunk('appDropdowns/getDefaultCurrencies', async (params: DropDownParamsType) => {
  const response = await axios.get('/OpenDefaults/CurrenciesList', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getSubCategories = createAsyncThunk('appDropdowns/getSubCategories', async (params: DropDownParamsType) => {
  const response = await axios.get('/Defaults/InventorySubCategories', { params })
  return {
    params,
    data: response.data
  } as any
})

export const getProperties = createAsyncThunk('appDropdowns/getProperties', async (params: DropDownParamsType) => {
  const response = await axios.get(`/Dropdowns/GetPropertyListByCustomer/${params.CustomerId}`)
  return {
    params,
    data: response.data
  } as any
})

export const getPropertiesByFloor = createAsyncThunk('appDropdowns/getPropertiesByFloor', async (params: DropDownParamsType) => {
  const response = await axios.get(`/Dropdowns/GetPropertyListByFloorType/${params.FloorId}/${params.TypeId}`)
  return {
    params,
    data: response.data
  } as any
})

export const getSalePlans = createAsyncThunk('appDropdowns/getSalePlans', async (params: DropDownParamsType) => {
  const response = await axios.get(`/Dropdowns/GetSalePlansByArea/true/${params.AreaMarla}/${params.AreaSqft}`)
  return {
    params,
    data: response.data
  } as any
})

export const getCities = createAsyncThunk('appDropdowns/getCities', async (params: DropDownParamsType) => {
  const response = await axios.get(`OpenDefaults/CitesList/${params.CountryId}`, { params })
  return {
    params,
    data: response.data
  } as any
})

export const getShippingCities = createAsyncThunk('appDropdowns/getShippingCities', async (params: DropDownParamsType) => {
  const response = await axios.get(`OpenDefaults/CitesList/${params.CountryId}`, { params })
  return {
    params,
    data: response.data
  } as any
})

export const getTicketStatus = createAsyncThunk('appDropdowns/getTicketStatus', async (params: DropDownParamsType) => {
  const response = await axios.get(`/Defaults/GetTicketStatuses`, { params })
  return {
    params,
    data: response.data
  } as any
})

export const getTicketTypes = createAsyncThunk('appDropdowns/getTicketTypes', async (params: DropDownParamsType) => {
  const response = await axios.get(`/Defaults/GetTicketTypes`, { params })
  return {
    params,
    data: response.data
  } as any
})



// ** invoice Bank
export const templateBanks = createAsyncThunk('appDropdowns/templateBanks', async (params: any) => {
  const response = await axios.get(`/Defaults/LocationBanksDetails/`,)
  return {
    params,
    data: response.data
  } as any
})

export const appDropdowns = createSlice({
  name: 'appDropdowns',
  initialState: {
    sales_status: [],
    jobs_status: [],
    jv_status: [],
    project_status_success: false,
    projects_types_success: false,
    project_status: [],
    bills_status: [],
    projects_types: [],
    branches: [],
    expenses_status: [],
    classes_success: false,
    classes: [],
    detail_accounts: [],
    detail_accounts_success: false,
    type_accounts_success: false,
    default_floors_success: false,
    type_accounts: [],
    emp_payment_type: [],
    category_accounts: [],
    default_floors: [],
    payment_modes: [],
    installment_types: [],
    category_accounts_success: false,
    installment_types_success: false,
    payment_modes_success: false,
    detail_type_accounts_success: false,
    detail_type_accounts: [],
    parent_type_accounts_success: false,
    parent_type_accounts: [],
    detail_type_wise_accounts_success: false,
    detail_type_wise_accounts: [],
    liability_accounts: [],
    equity_accounts_success: false,
    equity_accounts: [],
    expense_accounts: [],
    expense_accounts_success: false,
    default_assets: [],
    default_assets_success: false,
    disposal_types: [],
    disposal_types_success: false,
    work_locations: [],
    work_locations_success: false,
    revenue_accounts_success: false,
    revenue_accounts: [],
    interest_accounts_success: false,
    interest_accounts: [],
    cities: [],
    sale_items_success: false,
    sale_items: [],
    shipping_cities: [],
    countries: [],
    org_types: [],
    customers: [],
    agents: [],
    preferences: [],
    projects: [],
    customer_types: [],
    property_types: [],
    property_list: [],
    property_status: [],
    parent_projects: [],
    customers_success: false,
    property_status_success: false,
    agents_success: false,
    preferences_success: false,
    projects_success: false,
    customer_types_success: false,
    property_types_success: false,
    property_list_success: false,
    parent_projects_success: false,
    suppliers: [],
    suppliers_success: false,
    credit_terms: [],
    tax_types: [],
    tax_types_success: false,
    jv_types_success: false,
    jv_types: [],
    currencies: [],
    default_currencies: [],
    items_success: false,
    items: [],
    areas: [],
    areas_success: false,
    depreciation_methods: [],
    depreciation_methods_success: false,
    averaging_methods: [],
    averaging_methods_success: false,
    items_adj_success: false,
    items_services_success: false,
    items_adj: [],
    items_services: [],
    brands: [],
    brands_success: false,
    assembly_templates_success: false,
    adj_reasons_success: false,
    adj_reasons: [],
    con_reasons: [],
    colors: [],
    assembly_templates: [],
    banks_success: false,
    hsCodes_success: false,
    banks: [],
    sizes: [],
    users: [],
    policies: [],
    hsCodes: [],
    units_success: false,
    units: [],
    vat_periods: [],
    salesmans: [],
    salesmans_success: false,
    tax_treatments: [],
    org_users: [],
    categories: [],
    designations: [],
    designation_success: false,
    designations_params: {},
    payment_modes_params: {},
    agents_params: {},
    customer_types_params: {},
    preferences_params: {},
    work_locations_params: {},
    disposal_types_params: {},
    default_floors_params: {},
    property_types_params: {},
    property_list_params: {},
    installment_types_params: {},
    ticket_status: [],
    ticket_status_success: false,
    ticket_status_params: {},
    ticket_types: [],
    ticket_types_success: false,
    ticket_types_params: {},
    departments: [],
    departments_success: false,
    departments_params: {},
    property_status_params: {},
    doc_types: [],
    doc_types_success: false,
    doc_types_params: {},
    emp_types: [],
    emp_types_success: false,
    emp_types_params: {},
    contract_types: [],
    contract_types_success: false,
    contract_types_params: {},
    org_types_params: {},
    marital_status: [],
    marital_status_success: false,
    marital_status_params: {},
    depreciation_methods_params: {},
    projects_types_params: {},
    default_assets_params: {},
    averaging_methods_params: {},
    dynamic_fields: [],
    dynamic_fields_success: false,
    dynamic_fields_params: {},
    emp_status: [],
    emp_status_success: false,
    emp_status_params: {},
    pending_pay_periods: [],
    pending_pay_period_success: false,
    pending_pay_periods_params: {},
    closed_pay_periods: [],
    closed_pay_period_success: false,
    closed_pay_periods_params: {},
    all_pay_periods: [],
    all_pay_period_success: false,
    all_pay_periods_params: {},
    allowances: [],
    allowances_success: false,
    allowances_params: {},
    employees: [],
    employees_success: false,
    employees_params: {},
    all_employees: [],
    all_employees_success: false,
    all_employees_params: {},
    deductions: [],
    deductions_success: false,
    deductions_params: {},
    earnings: [],
    earnings_success: false,
    earnings_params: {},
    wht_taxes: [],
    wht_taxes_success: false,
    property_floor_success: false,
    wht_taxes_params: {},
    fbr_scenarios: [],
    fbr_scenarios_success: false,
    properties_success: false,
    fbr_scenarios_params: {},
    properties_params: {},
    sub_categories: [],
    property_floor: [],
    properties: [],
    sale_plans: [],
    sub_category_success: false,
    sale_plans_success: false,
    users_params: {},
    policies_params: {},
    org_users_params: {},
    classes_params: {},
    sale_items_params: {},
    countries_params: {},
    units_params: {},
    liability_accounts_params: {},
    equity_accounts_params: {},
    type_accounts_params: {},
    emp_payment_type_params: {},
    category_accounts_params: {},
    detail_type_accounts_params: {},
    parent_type_accounts_params: {},
    detail_type_wise_accounts_params: {},
    expense_accounts_params: {},
    revenue_accounts_params: {},
    interest_accounts_params: {},
    sale_plans_params: {},
    vat_periods_params: {},
    banks_params: {},
    cities_params: {},
    shipping_cities_params: {},
    salesmans_params: {},
    brands_params: {},
    colors_params: {},
    assembly_templates_params: {},
    property_floor_params: {},
    adj_reasons_params: {},
    con_reasons_params: {},
    credit_terms_params: {},
    branches_params: {},
    areas_params: {},
    currencies_params: {},
    default_currencies_params: {},
    customers_params: {},
    projects_params: {},
    parent_projects_params: {},
    sizes_params: {},
    tax_treatments_params: {},
    categories_params: {},
    hsCodes_params: {},
    items_params: {},
    items_adj_params: {},
    items_services_params: {},
    detail_accounts_params: {},
    sub_categories_params: {},
    tax_types_params: {},
    jv_types_params: {},
    sales_status_params: {},
    jobs_status_params: {},
    bills_status_params: {},
    jv_status_params: {},
    project_status_params: {},
    expenses_status_params: {},
    invoice_bank: null,
    template_banks_success: false,
    template_banks: []
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDesignations.fulfilled, (state, action: any) => {
        state.designation_success = true
        state.designations = action.payload.data.data
        state.designations_params = action.payload.params
      })
      .addCase(getDepartments.fulfilled, (state, action: any) => {
        state.departments_success = true
        state.departments = action.payload.data.data
        state.departments_params = action.payload.params
      })
      .addCase(getDocTypes.fulfilled, (state, action: any) => {
        state.doc_types_success = true
        state.doc_types = action.payload.data.data
        state.doc_types_params = action.payload.params
      })
      .addCase(getEmployeeTypes.fulfilled, (state, action: any) => {
        state.emp_types_success = true
        state.emp_types = action.payload.data.data
        state.emp_types_params = action.payload.params
      })
      .addCase(getEmployeeContracts.fulfilled, (state, action: any) => {
        state.contract_types_success = true
        state.contract_types = action.payload.data.data
        state.contract_types_params = action.payload.params
      })
      .addCase(getEmployeeMarital.fulfilled, (state, action: any) => {
        state.marital_status_success = true
        state.marital_status = action.payload.data.data
        state.marital_status_params = action.payload.params
      })
      .addCase(getDynamicFields.fulfilled, (state, action: any) => {
        state.dynamic_fields_success = true
        state.dynamic_fields = action.payload.data.data
        state.dynamic_fields_params = action.payload.params
      })
      .addCase(getEmpStatus.fulfilled, (state, action: any) => {
        state.emp_status_success = true
        state.emp_status = action.payload.data.data
        state.emp_status_params = action.payload.params
      })
      .addCase(getPendingPayPeriods.fulfilled, (state, action: any) => {
        state.pending_pay_period_success = true
        state.pending_pay_periods = action.payload.data.data
        state.pending_pay_periods_params = action.payload.params
      })
      .addCase(getClosedPayPeriods.fulfilled, (state, action: any) => {
        state.closed_pay_period_success = true
        state.closed_pay_periods = action.payload.data.data
        state.closed_pay_periods_params = action.payload.params
      })
      .addCase(getAllPayPeriods.fulfilled, (state, action: any) => {
        state.all_pay_period_success = true
        state.all_pay_periods = action.payload.data.data
        state.all_pay_periods_params = action.payload.params
      })
      .addCase(getAllowances.fulfilled, (state, action: any) => {
        state.allowances_success = true
        state.allowances = action.payload.data.data
        state.allowances_params = action.payload.params
      })
      .addCase(getEmployees.fulfilled, (state, action: any) => {
        state.employees_success = true
        state.employees = action.payload.data.data
        state.employees_params = action.payload.params
      })
      .addCase(getAllEmployees.fulfilled, (state, action: any) => {
        state.all_employees_success = true
        state.all_employees = action.payload.data.data
        state.all_employees_params = action.payload.params
      })
      .addCase(getDeductions.fulfilled, (state, action: any) => {
        state.deductions_success = true
        state.deductions = action.payload.data.data
        state.deductions_params = action.payload.params
      })
      .addCase(getEarnings.fulfilled, (state, action: any) => {
        state.earnings_success = true
        state.earnings = action.payload.data.data
        state.earnings_params = action.payload.params
      })
      .addCase(getWHTTaxes.fulfilled, (state, action: any) => {
        state.wht_taxes_success = true
        state.wht_taxes = action.payload.data.data
        state.wht_taxes_params = action.payload.params
      })
      .addCase(getFbrScenarios.fulfilled, (state, action: any) => {
        state.fbr_scenarios_success = true
        state.fbr_scenarios = action.payload.data.data
        state.fbr_scenarios_params = action.payload.params
      })
      .addCase(getCategories.fulfilled, (state, action: any) => {
        state.categories = action.payload.data.data
        state.categories_params = action.payload.params
      })
      .addCase(getHSCodes.fulfilled, (state, action: any) => {
        state.hsCodes_success = true
        state.hsCodes = action.payload.data.data??[]
        state.hsCodes_params = action.payload.params
      })
      .addCase(getDetailAccounts.fulfilled, (state, action: any) => {
        state.detail_accounts_success = true
        state.detail_accounts = action.payload.data.data
        state.detail_accounts_params = action.payload.params
      })
      .addCase(getAccountsType.fulfilled, (state, action: any) => {
        state.type_accounts_success = true
        state.type_accounts = action.payload.data.data
        state.type_accounts_params = action.payload.params
      })
      .addCase(getPayrollPaymentTypes.fulfilled, (state, action: any) => {
        state.emp_payment_type = action.payload.data.data.sort((a: any, b: any) => a.value - b.value)
        state.emp_payment_type_params = action.payload.params
      })
      .addCase(getAccountsCategories.fulfilled, (state, action: any) => {
        state.category_accounts_success = true
        state.category_accounts = action.payload.data.data
        state.category_accounts_params = action.payload.params
      })
      .addCase(getDefaultFloors.fulfilled, (state, action: any) => {
        state.default_floors_success = true
        state.default_floors = action.payload.data.data
        state.default_floors_params = action.payload.params
      })
      .addCase(getDefaultInstallmentTypes.fulfilled, (state, action: any) => {
        state.installment_types_success = true
        state.installment_types = action.payload.data.data
        state.installment_types_params = action.payload.params
      })
      .addCase(getDefaultPaymentModes.fulfilled, (state, action: any) => {
        state.payment_modes_success = true
        state.payment_modes = action.payload.data.data
        state.payment_modes_params = action.payload.params
      })
      .addCase(getAccountsDetailType.fulfilled, (state, action: any) => {
        state.detail_type_accounts_success = true
        state.detail_type_accounts = action.payload.data.data
        state.detail_type_accounts_params = action.payload.params
      })
      .addCase(getAccountParentType.fulfilled, (state, action: any) => {
        state.parent_type_accounts_success = true
        state.parent_type_accounts = action.payload.data.data
        state.parent_type_accounts_params = action.payload.params
      })
      .addCase(getAccountsDetailTypeWise.fulfilled, (state, action: any) => {
        state.detail_type_wise_accounts_success = true
        state.detail_type_wise_accounts = action.payload.data.data
        state.detail_type_wise_accounts_params = action.payload.params
      })
      .addCase(getLiabilityAccounts.fulfilled, (state, action: any) => {
        state.liability_accounts_success = true
        state.liability_accounts = action.payload.data.data
        state.liability_accounts_params = action.payload.params
      })
      .addCase(getEquityAccounts.fulfilled, (state, action: any) => {
        state.equity_accounts_success = false
        state.equity_accounts = action.payload.data.data
        state.equity_accounts_params = action.payload.params
      })
      .addCase(getExpenseAccounts.fulfilled, (state, action: any) => {
        state.expense_accounts_success = true
        state.expense_accounts = action.payload.data.data
        state.expense_accounts_params = action.payload.params
      })
      .addCase(getDefaultAssetsTypes.fulfilled, (state, action: any) => {
        state.default_assets_success = true
        state.default_assets = action.payload.data.data
        state.default_assets_params = action.payload.params
      })
      .addCase(getDefaultDisposalTypes.fulfilled, (state, action: any) => {
        state.disposal_types_success = true
        state.disposal_types = action.payload.data.data
        state.disposal_types_params = action.payload.params
      })
      .addCase(getDefaultWorkLocations.fulfilled, (state, action: any) => {
        state.work_locations_success = true
        state.work_locations = action.payload.data.data
        state.work_locations_params = action.payload.params
      })
      .addCase(getRevenueAccounts.fulfilled, (state, action: any) => {
        state.revenue_accounts_success = true
        state.revenue_accounts = action.payload.data.data
        state.revenue_accounts_params = action.payload.params
      })
      .addCase(getInterestAccounts.fulfilled, (state, action: any) => {
        state.interest_accounts_success = true
        state.interest_accounts = action.payload.data.data
        state.interest_accounts_params = action.payload.params
      })
      .addCase(getBanks.fulfilled, (state, action: any) => {
        state.banks_success = true
        state.banks = action.payload.data.data
        state.banks_params = action.payload.params
      })
      .addCase(getUnits.fulfilled, (state, action: any) => {
        state.units_success = true
        state.units = action.payload.data.data
        state.units_params = action.payload.params
      })
      .addCase(getInventory.fulfilled, (state, action: any) => {
        state.items_success = true
        state.items = action.payload.data.data
        state.items_params = action.payload.params
      })
      .addCase(getSaleInventory.fulfilled, (state, action: any) => {
        state.sale_items_success = true
        state.sale_items = action.payload.data.data
        state.sale_items_params = action.payload.params
      })
      .addCase(getVatReturnPeriod.fulfilled, (state, action: any) => {
        state.vat_periods = action.payload.data.data
        state.vat_periods_params = action.payload.params
      })
      .addCase(getAreas.fulfilled, (state, action: any) => {
        state.areas_success = true
        state.areas = action.payload.data.data
        state.areas_params = action.payload.params
      })
      .addCase(getDepreciationMethods.fulfilled, (state, action: any) => {
        state.depreciation_methods_success = true
        state.depreciation_methods = action.payload.data.data
        state.depreciation_methods_params = action.payload.params
      })
      .addCase(getAveragingMethods.fulfilled, (state, action: any) => {
        state.averaging_methods_success = true
        state.averaging_methods = action.payload.data.data
        state.averaging_methods_params = action.payload.params
      })
      .addCase(getClasses.fulfilled, (state, action: any) => {
        state.classes_success = true
        state.classes = action.payload.data.data
        state.classes_params = action.payload.params
      })
      .addCase(getInventoryAdj.fulfilled, (state, action: any) => {
        state.items_adj_success = true
        state.items_adj = action.payload.data.data
        state.items_adj_params = action.payload.params
      })
      .addCase(getInventoryServices.fulfilled, (state, action: any) => {
        state.items_services_success = true
        state.items_services = action.payload.data.data
        state.items_services_params = action.payload.params
      })
      .addCase(getAdjReasons.fulfilled, (state, action: any) => {
        state.adj_reasons_success = true
        state.adj_reasons = action.payload.data.data
        state.adj_reasons_params = action.payload.params
      })
      .addCase(getConReasons.fulfilled, (state, action: any) => {
        state.con_reasons = action.payload.data.data
        state.con_reasons_params = action.payload.params
      })
      .addCase(getUsers.fulfilled, (state, action: any) => {
        state.users = action.payload.data.data
        state.users_params = action.payload.params
      })
      .addCase(getPolicies.fulfilled, (state, action: any) => {
        state.policies = action.payload.data.data
        state.policies_params = action.payload.params
      })
      .addCase(getBrands.fulfilled, (state, action: any) => {
        state.brands_success = true
        state.brands = action.payload.data.data
        state.brands_params = action.payload.params
      })
      .addCase(getColors.fulfilled, (state, action: any) => {
        state.colors = action.payload.data.data
        state.colors_params = action.payload.params
      })
      .addCase(getAssemblyTemplates.fulfilled, (state, action: any) => {
        state.assembly_templates_sucess = true
        state.assembly_templates = action.payload.data.data
        state.assembly_templates_params = action.payload.params
      })
      .addCase(getSizes.fulfilled, (state, action: any) => {
        state.sizes = action.payload.data.data
        state.sizes_params = action.payload.params
      })
      .addCase(getCountries.fulfilled, (state, action: any) => {
        state.countries = action.payload.data.data
        state.countries_params = action.payload.params
      })
      .addCase(getOrgTypes.fulfilled, (state, action: any) => {
        state.org_types = action.payload.data.data
        state.org_types_params = action.payload.params
      })
      .addCase(getTaxTypes.fulfilled, (state, action: any) => {
        state.tax_types_success = true
        state.tax_types = action.payload.data.data
        state.tax_types_params = action.payload.params
      })
      .addCase(getJVTypes.fulfilled, (state, action: any) => {
        state.jv_types_success = true
        state.jv_types = action.payload.data.data
        state.jv_types_params = action.payload.params
      })
      .addCase(getTaxTreatments.fulfilled, (state, action: any) => {
        state.tax_treatments = action.payload.data.data
        state.tax_treatments_params = action.payload.params
      })
      .addCase(getOrgUsers.fulfilled, (state, action: any) => {
        state.org_users = action.payload.data.data
        state.org_users_params = action.payload.params
      })
      .addCase(getSupplier.fulfilled, (state, action: any) => {
        state.suppliers_success = true
        state.suppliers = action.payload.data.data
        state.suppliers_params = action.payload.params
      })
      .addCase(getCustomers.fulfilled, (state, action: any) => {
        state.customers_success = true
        state.customers = action.payload.data.data
        state.customers_params = action.payload.params
      })
      .addCase(getAgents.fulfilled, (state, action: any) => {
        state.agents_success = true
        state.agents = action.payload.data.data
        state.agents_params = action.payload.params
      })
      .addCase(getPreferences.fulfilled, (state, action: any) => {
        state.preferences_success = true
        state.preferences = action.payload.data.data
        state.preferences_params = action.payload.params
      })
      .addCase(getProjects.fulfilled, (state, action: any) => {
        state.projects_success = true
        state.projects = action.payload.data.data
        state.projects_params = action.payload.params
      })
      .addCase(getCustomerType.fulfilled, (state, action: any) => {
        state.customer_types_success = true
        state.customer_types = action.payload.data.data
        state.customer_types_params = action.payload.params
      })
      .addCase(getPropertyType.fulfilled, (state, action: any) => {
        state.property_types_success = true
        state.property_types = action.payload.data.data
        state.property_types_params = action.payload.params
      })
      .addCase(getPropertyListSelector.fulfilled, (state, action: any) => {
        state.property_list_success = true
        state.property_list = action.payload.data.data
        state.property_list_params = action.payload.params
      })
      .addCase(getPropertyStatus.fulfilled, (state, action: any) => {
        state.property_status_success = true
        state.property_status = action.payload.data.data
        state.property_status_params = action.payload.params
      })
      .addCase(getParentProjects.fulfilled, (state, action: any) => {
        state.parent_projects_success = true
        state.parent_projects = action.payload.data.data
        state.parent_projects_params = action.payload.params
      })
      .addCase(getCurrencies.fulfilled, (state, action: any) => {
        state.currencies = action.payload.data.data
        state.currencies_params = action.payload.params
      })
      .addCase(getDefaultCurrencies.fulfilled, (state, action: any) => {
        state.default_currencies = action.payload.data.data
        state.default_currencies_params = action.payload.params
      })
      .addCase(getCreditTerms.fulfilled, (state, action: any) => {
        state.credit_terms = action.payload.data.data
        state.credit_terms_params = action.payload.params
      })
      .addCase(getSalesman.fulfilled, (state, action: any) => {
        state.salesmans_success = true
        state.salesmans = action.payload.data.data
        state.salesmans_params = action.payload.params
      })
      .addCase(getCities.fulfilled, (state, action: any) => {
        state.cities = action.payload.data.data
        state.cities_params = action.payload.params
      })
      .addCase(getSalesStatus.fulfilled, (state, action: any) => {
        state.sales_status = action.payload.data.data
        state.sales_status_params = action.payload.params
      })
      .addCase(getJobsStatus.fulfilled, (state, action: any) => {
        state.jobs_status = action.payload.data.data
        state.jobs_status_params = action.payload.params
      })
      .addCase(getJournalStatus.fulfilled, (state, action: any) => {
        state.jv_status = action.payload.data.data
        state.jv_status_params = action.payload.params
      })
      .addCase(getProjectStatus.fulfilled, (state, action: any) => {
        state.project_status_success = true
        state.project_status = action.payload.data.data
        state.project_status_params = action.payload.params
      })
      .addCase(getProjectTypes.fulfilled, (state, action: any) => {
        state.projects_types_success = true
        state.projects_types = action.payload.data.data
        state.projects_types_params = action.payload.params
      })
      .addCase(getBillsStatus.fulfilled, (state, action: any) => {
        state.bills_status = action.payload.data.data
        state.bills_status_params = action.payload.params
      })
      .addCase(getExpenseStatus.fulfilled, (state, action: any) => {
        state.expenses_status = action.payload.data.data
        state.expenses_status_params = action.payload.params
      })
      .addCase(getShippingCities.fulfilled, (state, action: any) => {
        state.shipping_cities = action.payload.data.data
        state.shipping_cities_params = action.payload.params
      })
      .addCase(getTicketStatus.fulfilled, (state, action: any) => {
        state.ticket_status_success = true
        state.ticket_status = (action.payload.data.data??[]).sort((a: any,b: any) => a.value - b.value);
        state.ticket_status_params = action.payload.params
      })
      .addCase(getTicketTypes.fulfilled, (state, action: any) => {
        state.ticket_types_success = true
        state.ticket_types = (action.payload.data.data??[])
        state.ticket_types_params = action.payload.params
      })
      .addCase(getBranches.fulfilled, (state, action: any) => {
        state.branches = action.payload.data.data
        state.branches_params = action.payload.params
      })
      .addCase(getSubCategories.fulfilled, (state, action: any) => {
        state.sub_category_success = true
        state.sub_categories = action.payload.data.data
        state.sub_categories_params = action.payload.params
      })
      .addCase(getPropertiesByFloor.fulfilled, (state, action: any) => {
        state.property_floor_success = true
        state.property_floor = action.payload.data.data
        state.property_floor_params = action.payload.params
      })
      .addCase(getProperties.fulfilled, (state, action: any) => {
        state.properties_success = true
        state.properties = action.payload.data.data
        state.properties_params = action.payload.params
      })
      .addCase(getSalePlans.fulfilled, (state, action: any) => {
        state.sale_plans_success = true
        state.sale_plans = action.payload.data.data
        state.sale_plans_params = action.payload.params
      })
      .addCase(templateBanks.fulfilled, (state, action: any) => {
        state.template_banks_success = true
        state.template_banks = action.payload.data.data
      })
  }
} as CreateSliceOptions)

export default appDropdowns.reducer

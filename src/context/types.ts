import {ApolloClient, NormalizedCacheObject} from "@apollo/client";

export type ErrCallbackType = (err: any) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  qlClient: ApolloClient<NormalizedCacheObject> | null
  loading: boolean
  logout: () => void
  user: LoginDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: LoginDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}

export

interface FilterListObj {
  name: string
  title: string
  value?: string | number | null
}

export type DefaultValuesType = {
  defaultCurrency: CurrencyTypeData | null
  currencies: CurrencyTypeData[]
  defaultCostLocation: DefaultGenericDataType | null
  defaultTanent: DefaultTenantType | null
  systemInfo: SystemInfoDataType | null
  unauthorized: boolean
}

export interface CurrencyTypeData {
  code: string
  symbol?: string
  recno?: number
  text?: string
  subUnit?: string
  isDefaultCurrency?: boolean
  conversionRate?: number
}

export interface SystemInfoDataType {
  ip?: string | null
  long?: number | null
  lat?: number | null
  name?: string | null
}

export interface DefaultTenantType {
  tenantId: number
  name: string
  noOfEmployees: number
  defaultLanguage?: string
  defaultLanguageId?: number
  timeZoneId?: number
  defaultCurrency: string
  defaultCurrencyCode: string
  defaultCurrencySymbol: string
  defaultCurrencySubUnit: string
  defaultCurrencyId: number
  roundingDigit: number
  base64Logo?: string
  city?: string
  country?: string
  address?: string
  address2?: string
  cityId?: number
  countryId?: number
  taxNo?: string | null
  isTaxRegistered?: boolean
  fYearType?: number
  email?: string
  phoneNo?: string
  fax?: string
}


export interface DefaultGenericDataType {
  recno?: number
  value?: string | null
  code?: string | null
  text?: string
}


// ** Login User Data Type
export interface LoginData {
  message: string
  status: string
  succeeded: boolean
  data: LoginDataType
  totalRecords: number
}

export interface LoginDataType {
  accessToken: string
  fyears: FyearType[]
  locationDetails: LocationDetailType[]
  userDetails?: UserDetailsType | null
  tenantDetails: TenantDetailType[]
  languages: LanguageType[]
  name: string
  fatherName: string
  country: string
  email: string
  instanceURL: string
  gender: string
  userId: number
  projectType: number
  marlaSize: number
  loginUserId: number
  loginTenantId: number
  loginLocationId: number
  loginFyearId: number
  coaLevel: number
  coaMaxLevel: number
  defaultCurrency: number
  isFyearLocked: boolean
  isDefaultYear: boolean
  roundingDigit: number
  fYearType: number
  fyearStart: string
  fyearEnd: string
  dateFormat: string
  weekType: number
  branchLogo: string
  profileImageURL: string
  roleName: string
  isPosAllowed: boolean
  isTaxRegistered: boolean
  taxRegistrationDate: string
  stripeCustomerId: string
  isStripeCustomerCardExist: boolean
  planActualPrice: number
  planDiscountedPrice: number
  planPayableAmount: number
  planPayableAmountCurrency: string
  planDueDate: string
  isDueDatePassed: boolean
  paymentTypeId: number
  paymentTypeName: string
  isUnsubscripbed: boolean
  isFirstPaymentExist: boolean
  isLastPaymentSuccess: boolean
  isLastPaymentInsuffesentBalance: boolean
  isPosShiftActive: boolean
  enableHierarchicalCoa: boolean
  hierarchicalCoalevel?: number | null
  activePosShiftId: number
  allowedBranches: number
  ability: AbilityData
}

export interface FyearType {
  tenantId: number
  fyearId: number
  period: string
  startDate: string
  endDate: string
  isFyearLocked: boolean
  isDefaultYear: boolean
}

export interface LocationDetailType {
  locationId: number
  tenantId: number
  userId: number
  name: string
  address: string
  shortName: string
  branchLogo: string
}

export interface UserDetailsType {
  name: string
  fatherName: string
  country: string
  email: string
  gender: string
  userId: number
  profileImageURL: string
}

export interface TenantDetailType {
  tenantId: number
  organizationName: string
  defaultLanguage: number
  defaultTimeZone: number
  defaultCurrency: number
  organizationType: number
  defaultLanguageText: string
  defaultTimeZoneText: string
  defaultCurrencyText: string
  organizationTypeText: string
  userId: number
  coaLevel: number
  coaMaxLevel: number
  roundingDigit: number
  fYearType: number
  dateFormat: string
  weekType: number
  isUnsubscribed: boolean
  defaultInvoicePaymentType: number
  defaultInvoicePaymentTypeDescription: string
  isFyearLocked: boolean
  isPosAllowed: boolean
  isTaxRegistered: boolean
  taxRegistrationDate?: string
  role: string
  logo: string
  allowedBranches: number
}

export interface LanguageType {
  name: string
  recno: number
  countryId: number
  countryName: string
  countryCode: string
  languageCode: string
}

// ** Rights Response Type

export interface RightsDataType {
  message: string
  status: string
  succeeded: boolean
  data: RightsData
  totalRecords: number
}

export interface RightsData {
  list: RightsListType[]
}
export type AbilityData = AbilityDataRoot[]

export interface AbilityDataRoot {
  action: string
  subject: string
}

export interface RightsListType {
  policyId: number
  locationId: number
  fyearId: number
  screenId: number
  screenName: string
  screenDescription: string
  screenGroup: string
  viewScreen: boolean
  addScreen: boolean
  updateScreen: boolean
  deleteScreen: boolean
  others: boolean
}

export interface MapAccountsDataType {
  salestaxReceive: number
  salestaxPay: number
  fedReceive: number
  fedPay: number
  ftaxReceive: number
  ftaxPay: number
  discountRecieve: number
  discountPay: number
  freightReceive: number
  freightPay: number
  spdiscountPay: number
  spdiscountReceive: number
  openingBalanceAdjustment: number
  employeeSalaryPayableCoa: number
  empExpenseCoa: number
  empAdvanceSalaryCoa: number
  roudingDifferenceAdjustment: number
  cashReceive: number
  cashPaid: number
  defSale: number
  defPur: number
  defAsset: number
  defCost: number
  defTransfer: number
  defIncomeTax: number
  defWht: number
  defWriteoff: number
  defBank: number
  defaultCustomer: number
  defCustomerCoa: number
  defVendorCoa: number
  yearTransferAdjustment: number
  defCustomerAdvanceCoa: number
  defVendorAdvanceCoa: number
  defBankCharges: number
  exchangeGainLossAccount: number
  defItemAdjustmentCoa: number
  defGCCTaxPayable: number
  defMarkupCoa: number
  defaultCash: number
  defaultSales: number
  defaultCashHeadOffice: number
}

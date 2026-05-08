// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'


export interface BankClosingDataType {
  ToDate?: string | Date | null
  FromDate?: string | Date | null
  type?: string | null
  NoOfRecords?: number | null
}

export interface EmployeeDocumentsParams {
  ExpiryDateTo?: string | Date | null
  ExpiryDateFrom?: string | Date | null
  DocumentName?: string | null
  DocumentStatus?: string | null
  DocumentTypeId?: number | null
  EmployeeId?: number | null
  PageNo?: number | null
  PageSize?: number | null
}

interface LoadingStateParams {
  getData?: boolean
  getTopExpensesStats?: boolean
  getSupplierStats?: boolean
  getPaymentStats?: boolean
  getPayPeriodSalary?: boolean
  getSalaryDemographics?: boolean
  getNewJoiners?: boolean
  getLastLeavers?: boolean
  getDepartmentStrength?: boolean
  getDesignationStrength?: boolean
  getEmployeeDocuments?: boolean
  getGroupPaymentsStats?: boolean
  getRevenueStats?: boolean
  getCustomerStats?: boolean
  getEstimateStats?: boolean
  getMonthlySalesRecoveries?: boolean
  getMonthlyPurchaseExpenses?: boolean
  getHCMCardsData?: boolean
}

export const setLoading = createAsyncThunk('appDashboard/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getBankClosingBalances = createAsyncThunk('appDashboard/getBankClosingBalances', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Dashboard/BankAccountsComparison', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getReceivableStats = createAsyncThunk('appDashboard/getReceivableStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Dashboard/GetReceivableStats', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getReceivableAging = createAsyncThunk('appDashboard/getReceivableAging', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Dashboard/ReceivableAgings', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getPayableAging = createAsyncThunk('appDashboard/getPayableAging', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Dashboard/PayableAgings', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})


export const getPayableStats = createAsyncThunk('appDashboard/GetPayableStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Dashboard/GetPayableStats', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})


export const getPNLComparison = createAsyncThunk('appDashboard/getPNLComparison', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Dashboard/GetProfitAndLossComparisonDetails', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getCashFlowChartStats = createAsyncThunk('appDashboard/getCashFlowChartStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Dashboard/GetCashFlowChartStats', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getRevenueStats = createAsyncThunk('appDashboard/getRevenueStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getRevenueStats: true }))
  const response = await axios.get('/Dashboard/GetRevenueStats', { params })
  dispatch(setLoading({ getRevenueStats: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getPaymentStats = createAsyncThunk('appDashboard/getPaymentStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getPaymentStats: true }))
  const response = await axios.get('/Dashboard/GetPurchasePaymentStats', { params })
  dispatch(setLoading({ getPaymentStats: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getPayPeriodSalary = createAsyncThunk('appDashboard/getPayPeriodSalary', async (params: any, { dispatch }) => {
  dispatch(setLoading({ getPayPeriodSalary: true }))
  const response = await axios.get('/Dashboard/GetEmployeeDashboardPayPeriodWiseSalaries', { params })
  dispatch(setLoading({ getPayPeriodSalary: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getSalaryDemographics = createAsyncThunk('appDashboard/getSalaryDemographics', async (params: any, { dispatch }) => {
  dispatch(setLoading({ getSalaryDemographics: true }))
  const response = await axios.get('/Dashboard/GetEmployeeDashboardSalaryDemographics', { params })
  dispatch(setLoading({ getSalaryDemographics: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getNewJoiners = createAsyncThunk('appDashboard/getNewJoiners', async (params: any, { dispatch }) => {
  dispatch(setLoading({ getNewJoiners: true }))
  const response = await axios.get('/Dashboard/GetEmployeeDashboardLatestJoines', { params })
  dispatch(setLoading({ getNewJoiners: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getLastLeavers = createAsyncThunk('appDashboard/getLastLeavers', async (params: any, { dispatch }) => {
  dispatch(setLoading({ getLastLeavers: true }))
  const response = await axios.get('/Dashboard/GetEmployeeDashboardLatestLeavers', { params })
  dispatch(setLoading({ getLastLeavers: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getDepartmentStrength = createAsyncThunk('appDashboard/getDepartmentStrength', async (params: any, { dispatch }) => {
  dispatch(setLoading({ getDepartmentStrength: true }))
  const response = await axios.get('/Dashboard/GetEmployeeDashboardDepartmentStrength', { params })
  dispatch(setLoading({ getDepartmentStrength: false }))

  return {
    params,
    data: response.data
  } as any
})
export const getDesignationStrength = createAsyncThunk('appDashboard/getDesignationStrength', async (params: any, { dispatch }) => {
  dispatch(setLoading({ getDesignationStrength: true }))
  const response = await axios.get('/Dashboard/GetEmployeeDashboardDesignationStrength', { params })
  dispatch(setLoading({ getDesignationStrength: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getEmployeeDocuments = createAsyncThunk('appDashboard/getEmployeeDocuments', async (params: EmployeeDocumentsParams, { dispatch }) => {
  dispatch(setLoading({ getEmployeeDocuments: true }))
  const response = await axios.get('/Dashboard/SelectEmployeeDashboardDocumentsList', { params })
  dispatch(setLoading({ getEmployeeDocuments: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getMonthlySalesRecoveries = createAsyncThunk('appDashboard/getTotalSales', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getMonthlySalesRecoveries: true }))
  const response = await axios.get('/Dashboard/GetSalesStats', { params })
  const responseRec = await axios.get('/Dashboard/GetTotalRecoveriesStats', { params })
  dispatch(setLoading({ getMonthlySalesRecoveries: false }))

  return {
    params,
    sales: response.data,
    recovery: responseRec?.data
  } as any
})

export const getMonthlyPurchaseExpenses = createAsyncThunk('appDashboard/getMonthlyPurchaseExpenses', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getMonthlyPurchaseExpenses: true }))
  const response = await axios.get('/Dashboard/GetPurchaseStats', { params })
  const responseRec = await axios.get('/Dashboard/GetTotalExpensesStats', { params })
  dispatch(setLoading({ getMonthlyPurchaseExpenses: false }))

  return {
    params,
    purchases: response.data,
    expense: responseRec?.data
  } as any
})

export const getHCMCardsData = createAsyncThunk('appDashboard/getHCMCardsData', async (params: any, { dispatch }) => {
  dispatch(setLoading({ getHCMCardsData: true }))
  const response = await axios.get('/Dashboard/GetEmployeeDashboardCardStats', { params })
  dispatch(setLoading({ getHCMCardsData: false }))

  return {
    params,
    data: response.data
  } as any
})


export const getCustomerStats = createAsyncThunk('appDashboard/getCustomerStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getCustomerStats: true }))
  const response = await axios.get('/Dashboard/GetCustomerWiseReceivalbeStats', { params })
  dispatch(setLoading({ getCustomerStats: false }))

  return {
    params,
    data: response.data
  } as any
})


export const getSupplierStats = createAsyncThunk('appDashboard/getSupplierStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getSupplierStats: true }))
  const response = await axios.get('/Dashboard/GetVendorWisePayalbeStats', { params })
  dispatch(setLoading({ getSupplierStats: false }))

  return {
    params,
    data: response.data
  } as any
})


export const getTopExpensesStats = createAsyncThunk('appDashboard/getTopExpensesStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getTopExpensesStats: true }))
  const response = await axios.get('/Dashboard/GetExpensesStats', { params })
  dispatch(setLoading({ getTopExpensesStats: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getEstimateStats = createAsyncThunk('appDashboard/getEstimateStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getEstimateStats: true }))
  const response = await axios.get('/Dashboard/GetSalesEstimateStats', { params })
  dispatch(setLoading({ getEstimateStats: false }))

  return {
    params,
    data: response.data
  } as any
})
export const getGroupPaymentsStats = createAsyncThunk('appDashboard/getGroupPaymentsStats', async (params: BankClosingDataType, { dispatch }) => {
  dispatch(setLoading({ getGroupPaymentsStats: true }))
  const response = await axios.get('/Dashboard/GetGroupTotalPaymentsStats', { params })
  dispatch(setLoading({ getGroupPaymentsStats: false }))

  return {
    params,
    data: response.data
  } as any
})

export const appDashboard = createSlice({
  name: 'appDashboard',
  initialState: {
    bank_data_success: false,
    bank_data_params: {},
    bank_data: [],
    revenue_stats: [],
    revenue_stats_params: {},
    payment_stats: [],
    pay_period_salaries: [],
    salary_demo: [],
    new_joiners: [],
    last_leavers: [],
    dept_strength: [],
    desg_strength: [],
    emp_documents: [],
    emp_documents_total: 0,
    payment_stats_params: {},
    new_joiners_params: {},
    emp_documents_params: {},
    last_leavers_params: {},
    desg_strength_params: {},
    dept_strength_params: {},
    salary_demo_params: {},
    pay_period_salaries_params: {},
    estimate_stats: {},
    estimate_stats_params: {},
    group_payment_stats: {},
    group_payment_stats_params: {},
    hcm_cards_stats: [],
    customer_stats: [],
    customer_stats_params: {},
    hcm_cards_stats_params: {},
    supplier_stats: [],
    supplier_stats_params: {},
    expense_stats: [],
    expense_stats_params: {},
    monthly_sales: 0,
    monthly_recoveries: 0,
    monthly_purchases: 0,
    monthly_expenses: 0,
    pnl_data_success: false,
    pnl_data_params: {},
    pnl_data: [],
    payable_data_success: false,
    payable_data_params: {},
    payable_data: {},
    receivable_data_success: false,
    receivable_data_params: {},
    receivable_data: {},
    payable_aging_data_success: false,
    payable_aging_data_params: {},
    payable_aging_data: {},
    receivable_aging_data_success: false,
    receivable_aging_data_params: {},
    receivable_aging_data: {},
    cash_flow_data_success: false,
    cash_flow_data_params: {},
    cash_flow_data: {},
    loadingState: { getData: false, getRevenueStats: false, getCustomerStats: false, getEstimateStats: false }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getBankClosingBalances.fulfilled, (state, action: any) => {
        state.bank_data_success = true
        state.bank_data = action.payload.data?.data??[]
        state.bank_data_params = action.payload.params
      })
      .addCase(getReceivableStats.fulfilled, (state, action: any) => {
        state.receivable_data_success = true
        state.receivable_data = action.payload.data?.data??{}
        state.receivable_data_params = action.payload.params
      })
      .addCase(getPayableStats.fulfilled, (state, action: any) => {
        state.payable_data_success = true
        state.payable_data = action.payload.data?.data??{}
        state.payable_data_params = action.payload.params
      })
      .addCase(getReceivableAging.fulfilled, (state, action: any) => {
        state.receivable_aging_data_success = true
        state.receivable_aging_data = action.payload.data?.data??{}
        state.receivable_aging_data_params = action.payload.params
      })
      .addCase(getPayableAging.fulfilled, (state, action: any) => {
        state.payable_aging_data_success = true
        state.payable_aging_data = action.payload.data?.data??{}
        state.payable_aging_data_params = action.payload.params
      })
      .addCase(getPNLComparison.fulfilled, (state, action: any) => {
        state.pnl_data_success = true
        state.pnl_data = action.payload.data?.data??{}
        state.pnl_data_params = action.payload.params
      })
      .addCase(getCashFlowChartStats.fulfilled, (state, action: any) => {
        state.cash_flow_data_success = true
        state.cash_flow_data = action.payload.data?.data??{}
        state.cash_flow_data_params = action.payload.params
      })
      .addCase(getRevenueStats.fulfilled, (state, action: any) => {
        state.revenue_stats = action.payload.data?.data??[]
        state.revenue_stats_params = action.payload.params
      })
      .addCase(getPaymentStats.fulfilled, (state, action: any) => {
        state.payment_stats = action.payload.data?.data??[]
        state.payment_stats_params = action.payload.params
      })
      .addCase(getPayPeriodSalary.fulfilled, (state, action: any) => {
        state.pay_period_salaries = action.payload.data?.data??[]
        state.pay_period_salaries_params = action.payload.params
      })
      .addCase(getSalaryDemographics.fulfilled, (state, action: any) => {
        state.salary_demo = action.payload.data?.data??[]
        state.salary_demo_params = action.payload.params
      })
      .addCase(getNewJoiners.fulfilled, (state, action: any) => {
        state.new_joiners = action.payload.data?.data??[]
        state.new_joiners_params = action.payload.params
      })
      .addCase(getLastLeavers.fulfilled, (state, action: any) => {
        state.last_leavers = action.payload.data?.data??[]
        state.last_leavers_params = action.payload.params
      })
      .addCase(getDepartmentStrength.fulfilled, (state, action: any) => {
        state.dept_strength = action.payload.data?.data??[]
        state.dept_strength_params = action.payload.params
      })
      .addCase(getDesignationStrength.fulfilled, (state, action: any) => {
        state.desg_strength = action.payload.data?.data??[]
        state.desg_strength_params = action.payload.params
      })
      .addCase(getEmployeeDocuments.fulfilled, (state, action: any) => {
        state.emp_documents = action.payload.data?.data.list??[]
        state.emp_documents_total = action.payload.data.totalRecords
        state.emp_documents_params = action.payload.params
      })
      .addCase(getCustomerStats.fulfilled, (state, action: any) => {
        state.customer_stats = action.payload.data?.data??[]
        state.customer_stats_params = action.payload.params
      })
      .addCase(getHCMCardsData.fulfilled, (state, action: any) => {
        state.hcm_cards_stats = action.payload.data?.data??{}
        state.hcm_cards_stats_params = action.payload.params
      })
      .addCase(getSupplierStats.fulfilled, (state, action: any) => {
        state.supplier_stats = action.payload.data?.data??[]
        state.supplier_stats_params = action.payload.params
      })
      .addCase(getTopExpensesStats.fulfilled, (state, action: any) => {
        state.expense_stats = action.payload.data?.data??[]
        state.expense_stats_params = action.payload.params
      })
      .addCase(getEstimateStats.fulfilled, (state, action: any) => {
        state.estimate_stats = action.payload.data?.data??{}
        state.estimate_stats_params = action.payload.params
      })
      .addCase(getGroupPaymentsStats.fulfilled, (state, action: any) => {
        state.group_payment_stats = action.payload.data?.data??{}
        state.group_payment_stats_params = action.payload.params
      })
      .addCase(getMonthlySalesRecoveries.fulfilled, (state, action: any) => {
        let sales = action.payload.sales?.data??[];
        state.monthly_sales = sales.reduce((total: number, sa: any) => (sa.totalSales ?? 0) + total, 0)
        state.monthly_recoveries = action.payload.recovery?.data?.totalRecevings??0
      })
      .addCase(getMonthlyPurchaseExpenses.fulfilled, (state, action: any) => {
        let sales = action.payload.purchases?.data??[];
        state.monthly_purchases = sales.reduce((total: number, sa: any) => (sa.totalPurchases ?? 0) + total, 0)
        state.monthly_expenses = action.payload.expense?.data?.totalExpenses??0
      })
      .addCase(setLoading.fulfilled, (state, action) => {
        state.loadingState = action.payload
      })
  }
} as CreateSliceOptions)

export default appDashboard.reducer

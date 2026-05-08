import { createAsyncThunk, createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import axiosInstance from 'src/@core/utils/axiosInstence'

export interface CaseStudySearchParams {
  page: number
  limit: number
  search?: string
}

interface LoadingStateParams {
  getData?: boolean
}

type CaseStudyState = {
  data: any[]
  totalRecords: number
  params: CaseStudySearchParams
  loadingState: LoadingStateParams
}

export const setLoading = createAsyncThunk('appCaseStudies/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appCaseStudies/getData', async (params: CaseStudySearchParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axiosInstance.get('/api/case-studies', { params })
  dispatch(setLoading({ getData: false }))

  const raw = response?.data ?? {}
  return {
    params,
    data: raw?.data ?? [],
    totalRecords: raw?.total ?? raw?.count ?? 0
  }
})

const initialParams: CaseStudySearchParams = {
  page: 1,
  limit: 10,
  search: ''
}

export const appCaseStudies = createSlice({
  name: 'appCaseStudies',
  initialState: {
    data: [],
    totalRecords: 0,
    params: initialParams,
    loadingState: { getData: false }
  } as CaseStudyState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action: any) => {
        state.data = action.payload.data ?? []
        state.totalRecords = action.payload.totalRecords ?? 0
        state.params = action.payload.params
      })
      .addCase(setLoading.fulfilled, (state, action: any) => {
        state.loadingState = action.payload
      })
  }
} as CreateSliceOptions)

export default appCaseStudies.reducer

// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import axiosInstance from 'src/@core/utils/axiosInstence'


export interface SectionTypeSearchParams {
  PageNo: number,
  PageSize: number,
  searchModel?: any
}

interface LoadingStateParams {
  getData?: boolean
  getStats?: boolean
}

export const setLoading = createAsyncThunk('appSectionType/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appSectionType/getData', async (params: SectionTypeSearchParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axiosInstance.get('/api/section-types', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const appSectionType = createSlice({
  name: 'appSectionType',
  initialState: {
    data: [],
    stats: [],
    totalRecords: 0,
    params: {},
    loadingState: { getData: false, getStats: false }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action: any) => {
        state.data = action.payload.data.data??[]
        state.totalRecords = action.payload.data.totalRecords ?? 0
        state.params = action.payload.params
      })
      .addCase(setLoading.fulfilled, (state, action) => {
        state.loadingState = action.payload
      })
  }
} as CreateSliceOptions)

export default appSectionType.reducer

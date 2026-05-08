// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'


export interface CustomerDataParams {
  PageNo: number,
  PageSize: number,
  searchModel?: any
}

interface LoadingStateParams {
  getData?: boolean
  getStats?: boolean
}

export const setLoading = createAsyncThunk('appCustomers/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appCustomers/getData', async (params: CustomerDataParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Customer/List', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const appCustomers = createSlice({
  name: 'appCustomers',
  initialState: {
    data: [],
    stats: [],
    totalRecords: 1,
    params: {},
    loadingState: { getData: false, getStats: false }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action: any) => {
        state.data = action.payload.data.data??[]
        state.totalRecords = action.payload.data.totalRecords
        state.params = action.payload.params
      })
      .addCase(setLoading.fulfilled, (state, action) => {
        state.loadingState = action.payload
      })
  }
} as CreateSliceOptions)

export default appCustomers.reducer

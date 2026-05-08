// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface LoadingStateParams {
  getData?: boolean
}

export interface InstallmentTypeSearchSchema {
  searchModel?: any,
  PageNo: number,
  PageSize: number
}

export const setLoading = createAsyncThunk('definitionInstallmentTypeStore/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('definitionInstallmentTypeStore/getData', async (params: InstallmentTypeSearchSchema, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/InstTypes/List', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const definitionInstallmentTypeStore = createSlice({
  name: 'definitionInstallmentTypeStore',
  initialState: {
    data: [],
    params: {},
    totalRecords: 1,
    loadingState: { getData: false }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action: any) => {
        state.data = action.payload.data?.data??[]
        state.totalRecords = action.payload?.data?.totalRecords??1
        state.params = action.payload.params
      })
      .addCase(setLoading.fulfilled, (state, action) => {
        state.loadingState = action.payload
      })
  }
} as CreateSliceOptions)

export default definitionInstallmentTypeStore.reducer

// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface LoadingStateParams {
  getData?: boolean
}

export interface FloorsSearchParams {
  searchModel?: any,
  PageNo: number,
  PageSize: number
}

export const setLoading = createAsyncThunk('definitionFloorsStore/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('definitionFloorsStore/getData', async (params: FloorsSearchParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Floors/List', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const definitionFloorsStore = createSlice({
  name: 'definitionFloorsStore',
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

export default definitionFloorsStore.reducer

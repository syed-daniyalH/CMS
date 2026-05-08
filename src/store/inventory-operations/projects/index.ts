// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface LoadingStateParams {
  getData?: boolean
}

export interface ProjectSearchParams {
  searchModel?: any,
  PageNo: number,
  PageSize: number
}

export const setLoading = createAsyncThunk('definitionProjectsStore/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('definitionProjectsStore/getData', async (params: ProjectSearchParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/Project/List', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const definitionProjectsStore = createSlice({
  name: 'definitionProjectsStore',
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

export default definitionProjectsStore.reducer

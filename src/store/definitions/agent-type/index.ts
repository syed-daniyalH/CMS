// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface LoadingStateParams {
  getData?: boolean
}

export interface AgentTypeSearchParams {
  searchModel?: any,
  PageNo: number,
  PageSize: number
}

export const setLoading = createAsyncThunk('definitionAgentTypeStore/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('definitionAgentTypeStore/getData', async (params: AgentTypeSearchParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/CustAgentType/List', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const definitionAgentTypeStore = createSlice({
  name: 'definitionAgentTypeStore',
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

export default definitionAgentTypeStore.reducer

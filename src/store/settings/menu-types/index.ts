import { createAsyncThunk, createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import axiosInstance from 'src/@core/utils/axiosInstence'

interface LoadingStateParams {
  getData?: boolean
}

type MenuTypesState = {
  data: any[]
  loadingState: LoadingStateParams
}

export const setLoading = createAsyncThunk('appMenuTypes/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appMenuTypes/getData', async (_, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axiosInstance.get('/api/menus/types')
  dispatch(setLoading({ getData: false }))
  return {
    data: response?.data?.data ?? []
  }
})

export const appMenuTypes = createSlice({
  name: 'appMenuTypes',
  initialState: {
    data: [],
    loadingState: { getData: false }
  } as MenuTypesState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action: any) => {
        state.data = action.payload.data ?? []
      })
      .addCase(setLoading.fulfilled, (state, action: any) => {
        state.loadingState = action.payload
      })
  }
} as CreateSliceOptions)

export default appMenuTypes.reducer

import { createAsyncThunk, createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import axiosInstance from 'src/core/utils/axiosInstence'

interface LoadingStateParams {
  getData?: boolean
}

type MenuNodesState = {
  data: any[]
  loadingState: LoadingStateParams
}

export const setLoading = createAsyncThunk('appMenuNodes/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appMenuNodes/getData', async (menuType: string | undefined, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const query = menuType ? `?menuType=${encodeURIComponent(menuType)}` : ''
  const response = await axiosInstance.get(`/api/menus/nodes${query}`)
  dispatch(setLoading({ getData: false }))
  return {
    data: response?.data?.data ?? []
  }
})

export const appMenuNodes = createSlice({
  name: 'appMenuNodes',
  initialState: {
    data: [],
    loadingState: { getData: false }
  } as MenuNodesState,
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

export default appMenuNodes.reducer

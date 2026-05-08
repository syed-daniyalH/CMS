import { createAsyncThunk, createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import axiosInstance from 'src/@core/utils/axiosInstence'

export interface BlogSearchParams {
  page: number
  limit: number
  search?: string
  categoryId?: string
}

interface LoadingStateParams {
  getData?: boolean
}

type BlogState = {
  data: any[]
  totalRecords: number
  params: BlogSearchParams
  loadingState: LoadingStateParams
}

export const setLoading = createAsyncThunk('appBlogs/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appBlogs/getData', async (params: BlogSearchParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axiosInstance.get('/api/blogs', { params })
  dispatch(setLoading({ getData: false }))

  const raw = response?.data ?? {}
  return {
    params,
    data: raw?.data ?? [],
    totalRecords: raw?.total ?? raw?.count ?? 0
  }
})

const initialParams: BlogSearchParams = {
  page: 1,
  limit: 10,
  search: ''
}

export const appBlogs = createSlice({
  name: 'appBlogs',
  initialState: {
    data: [],
    totalRecords: 0,
    params: initialParams,
    loadingState: { getData: false }
  } as BlogState,
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

export default appBlogs.reducer

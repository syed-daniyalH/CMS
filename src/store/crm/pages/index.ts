import { createAsyncThunk, createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import axiosInstance from 'src/@core/utils/axiosInstence'

export interface CmsPagesSearchParams {
  page: number
  limit: number
  search?: string
}

interface LoadingStateParams {
  getData?: boolean
}

type CmsPagesState = {
  data: any[]
  totalRecords: number
  params: CmsPagesSearchParams
  loadingState: LoadingStateParams
}

export const setLoading = createAsyncThunk('appCmsPages/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appCmsPages/getData', async (params: CmsPagesSearchParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axiosInstance.get('/api/pages')
  dispatch(setLoading({ getData: false }))

  const raw = response?.data ?? {}
  const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : []
  const keyword = `${params?.search ?? ''}`.toLowerCase().trim()
  const filtered = keyword
    ? list.filter(
        (item: any) =>
          `${item?.title ?? ''}`.toLowerCase().includes(keyword) ||
          `${item?.slug ?? ''}`.toLowerCase().includes(keyword)
      )
    : list

  const start = Math.max((params.page - 1) * params.limit, 0)
  const paged = filtered.slice(start, start + params.limit)

  return {
    params,
    data: paged,
    totalRecords: filtered.length
  }
})

const initialParams: CmsPagesSearchParams = { page: 1, limit: 10, search: '' }

export const appCmsPages = createSlice({
  name: 'appCmsPages',
  initialState: {
    data: [],
    totalRecords: 0,
    params: initialParams,
    loadingState: { getData: false }
  } as CmsPagesState,
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

export default appCmsPages.reducer

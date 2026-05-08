import { createAsyncThunk, createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import axiosInstance from 'src/@core/utils/axiosInstence'

export interface TagSearchParams {
  PageNo: number
  PageSize: number
  search?: string
}

interface LoadingStateParams {
  getData?: boolean
}

type CategoryState = {
  data: any[]
  totalRecords: number
  params: TagSearchParams
  loadingState: LoadingStateParams
}

export const setLoading = createAsyncThunk('appTags/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appTags/getData', async (params: TagSearchParams, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axiosInstance.get('/api/taxonomy/tags')
  dispatch(setLoading({ getData: false }))

  const raw = response?.data ?? {}
  const normalizedData = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw?.results) ? raw.results : Array.isArray(raw) ? raw : []
  const keyword = (params?.search ?? '').toLowerCase().trim()
  const filteredData = keyword
    ? normalizedData.filter(
        (item: any) =>
          `${item?.name ?? ''}`.toLowerCase().includes(keyword) ||
          `${item?.slug ?? ''}`.toLowerCase().includes(keyword) ||
          `${item?.shortDescription ?? ''}`.toLowerCase().includes(keyword)
      )
    : normalizedData
  const start = Math.max((params.PageNo - 1) * params.PageSize, 0)
  const end = start + params.PageSize
  const pagedData = filteredData.slice(start, end)

  return {
    params,
    data: pagedData,
    totalRecords: filteredData.length
  }
})

const initialParams: TagSearchParams = {
  PageNo: 1,
  PageSize: 10,
  search: ''
}

export const appTags = createSlice({
  name: 'appTags',
  initialState: {
    data: [],
    totalRecords: 0,
    params: initialParams,
    loadingState: { getData: false }
  } as CategoryState,
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

export default appTags.reducer

import { createAsyncThunk, createSlice, CreateSliceOptions } from '@reduxjs/toolkit'
import axiosInstance from 'src/core/utils/axiosInstence'

type CmsDropdownState = {
  blogCategories: any[]
  blogSubCategories: any[]
  blogTags: any[]
  caseStudyCategories: any[]
  caseStudySubCategories: any[]
  caseStudyTags: any[]
  menuTypes: any[]
  menuCategories: any[]
  menuSubCategories: any[]
  contentRefs: any[]
  serviceLinks: Array<{ id?: string; slug: string; name: string; title?: string; imageUrl?: string }>
  subServiceLinks: Array<{ id?: string; slug: string; name: string; title?: string; imageUrl?: string }>
  industryLinks: Array<{ id?: string; slug: string; name: string; title?: string; imageUrl?: string }>
  blogSubCategoriesParams: { parentCategory?: string | null }
  caseStudySubCategoriesParams: { parentCategory?: string | null }
  menuCategoriesParams: { menuType?: string | null }
  menuSubCategoriesParams: { categoryId?: string | null }
  contentRefsParams: { contentType?: string | null }
  serviceLinksParams: { typeSlug?: string | null }
  subServiceLinksParams: { serviceSlug?: string | null; serviceId?: string | null }
}

const initialState: CmsDropdownState = {
  blogCategories: [],
  blogSubCategories: [],
  blogTags: [],
  caseStudyCategories: [],
  caseStudySubCategories: [],
  caseStudyTags: [],
  menuTypes: [],
  menuCategories: [],
  menuSubCategories: [],
  contentRefs: [],
  serviceLinks: [],
  subServiceLinks: [],
  industryLinks: [],
  blogSubCategoriesParams: {},
  caseStudySubCategoriesParams: {},
  menuCategoriesParams: {},
  menuSubCategoriesParams: {},
  contentRefsParams: {},
  serviceLinksParams: {},
  subServiceLinksParams: {}
}

export const getBlogCategoriesDropdown = createAsyncThunk('cmsDropdowns/getBlogCategories', async () => {
  const res = await axiosInstance.get('/api/dropdowns/blog-categories')
  return res?.data?.data ?? []
})

export const getBlogSubCategoriesDropdown = createAsyncThunk(
  'cmsDropdowns/getBlogSubCategories',
  async (params: { parentCategory?: string | null } = {}) => {
    const query = params?.parentCategory ? `?parentCategory=${encodeURIComponent(params.parentCategory)}` : ''
    const res = await axiosInstance.get(`/api/dropdowns/blog-sub-categories${query}`)
    return { data: res?.data?.data ?? [], params }
  }
)

export const getBlogTagsDropdown = createAsyncThunk('cmsDropdowns/getBlogTags', async () => {
  const res = await axiosInstance.get('/api/dropdowns/blog-tags')
  return res?.data?.data ?? []
})

export const getCaseStudyCategoriesDropdown = createAsyncThunk('cmsDropdowns/getCaseStudyCategories', async () => {
  const res = await axiosInstance.get('/api/dropdowns/case-study-categories')
  return res?.data?.data ?? []
})

export const getCaseStudySubCategoriesDropdown = createAsyncThunk(
  'cmsDropdowns/getCaseStudySubCategories',
  async (params: { parentCategory?: string | null } = {}) => {
    const query = params?.parentCategory ? `?parentCategory=${encodeURIComponent(params.parentCategory)}` : ''
    const res = await axiosInstance.get(`/api/dropdowns/case-study-sub-categories${query}`)
    return { data: res?.data?.data ?? [], params }
  }
)

export const getCaseStudyTagsDropdown = createAsyncThunk('cmsDropdowns/getCaseStudyTags', async () => {
  const res = await axiosInstance.get('/api/dropdowns/case-study-tags')
  return res?.data?.data ?? []
})

export const getMenuTypesDropdown = createAsyncThunk('cmsDropdowns/getMenuTypes', async () => {
  const res = await axiosInstance.get('/api/dropdowns/menu-types')
  return res?.data?.data ?? []
})

export const getMenuCategoriesDropdown = createAsyncThunk(
  'cmsDropdowns/getMenuCategories',
  async (params: { menuType?: string | null } = {}) => {
    const query = params?.menuType ? `?menuType=${encodeURIComponent(params.menuType)}` : ''
    const res = await axiosInstance.get(`/api/dropdowns/categories${query}${query ? '&' : '?'}type=category`)
    return { data: res?.data?.data ?? [], params }
  }
)

export const getMenuSubCategoriesDropdown = createAsyncThunk(
  'cmsDropdowns/getMenuSubCategories',
  async (params: { categoryId?: string | null } = {}) => {
    if (!params?.categoryId) return { data: [], params }
    const res = await axiosInstance.get(`/api/dropdowns/sub-categories/${encodeURIComponent(params.categoryId)}`)
    return { data: res?.data?.data ?? [], params }
  }
)

export const getContentRefsDropdown = createAsyncThunk(
  'cmsDropdowns/getContentRefs',
  async (params: { contentType?: string | null } = {}) => {
    if (!params?.contentType) return { data: [], params }
    const res = await axiosInstance.get(`/api/dropdowns/content-refs?contentType=${encodeURIComponent(params.contentType)}`)
    return { data: res?.data?.data ?? [], params }
  }
)

export const getServiceLinksDropdown = createAsyncThunk(
  'cmsDropdowns/getServiceLinks',
  async (params: { typeSlug?: string | null } = {}) => {
    const typeSlug = `${params?.typeSlug ?? 'services'}`.trim() || 'services'
    const res = await axiosInstance.get('/api/dropdowns/services', { params: { typeSlug } })
    const data = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
    const links = data
      .map((item: any) => ({
        id: `${item?.id ?? item?._id ?? ''}` || undefined,
        slug: `${item?.slug ?? ''}`.trim(),
        name: `${item?.name ?? item?.title ?? ''}`.trim(),
        title: `${item?.title ?? ''}`.trim() || undefined,
        imageUrl: `${item?.imageUrl ?? ''}`.trim() || undefined
      }))
      .filter((item: any) => item.slug)
    return { data: links, params: { typeSlug } }
  }
)

export const getIndustryLinksDropdown = createAsyncThunk('cmsDropdowns/getIndustryLinks', async () => {
  const res = await axiosInstance.get('/api/dropdowns/industries')
  const data = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
  const links = data
    .map((item: any) => ({
      id: `${item?.id ?? item?._id ?? ''}` || undefined,
      slug: `${item?.slug ?? ''}`.trim(),
      name: `${item?.name ?? item?.title ?? ''}`.trim(),
      title: `${item?.title ?? ''}`.trim() || undefined,
      imageUrl: `${item?.imageUrl ?? ''}`.trim() || undefined
    }))
    .filter((item: any) => item.slug)
  return { data: links }
})

export const getSubServiceLinksDropdown = createAsyncThunk(
  'cmsDropdowns/getSubServiceLinks',
  async (params: { serviceSlug?: string | null; serviceId?: string | null } = {}) => {
    const query = new URLSearchParams()
    if (params?.serviceSlug) query.set('serviceSlug', `${params.serviceSlug}`.trim())
    if (params?.serviceId) query.set('serviceId', `${params.serviceId}`.trim())
    const suffix = query.toString() ? `?${query.toString()}` : ''
    const res = await axiosInstance.get(`/api/dropdowns/services/sub-services${suffix}`)
    const data = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
    const links = data
      .map((item: any) => ({
        id: `${item?.id ?? item?._id ?? ''}` || undefined,
        slug: `${item?.slug ?? ''}`.trim(),
        name: `${item?.name ?? item?.title ?? ''}`.trim(),
        title: `${item?.title ?? ''}`.trim() || undefined,
        imageUrl: `${item?.imageUrl ?? ''}`.trim() || undefined
      }))
      .filter((item: any) => item.slug)
    return { data: links, params: { serviceSlug: params?.serviceSlug ?? null, serviceId: params?.serviceId ?? null } }
  }
)

export const cmsDropdowns = createSlice({
  name: 'cmsDropdowns',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getBlogCategoriesDropdown.fulfilled, (state, action: any) => {
        state.blogCategories = action.payload ?? []
      })
      .addCase(getBlogSubCategoriesDropdown.fulfilled, (state, action: any) => {
        state.blogSubCategories = action.payload?.data ?? []
        state.blogSubCategoriesParams = action.payload?.params ?? {}
      })
      .addCase(getBlogTagsDropdown.fulfilled, (state, action: any) => {
        state.blogTags = action.payload ?? []
      })
      .addCase(getCaseStudyCategoriesDropdown.fulfilled, (state, action: any) => {
        state.caseStudyCategories = action.payload ?? []
      })
      .addCase(getCaseStudySubCategoriesDropdown.fulfilled, (state, action: any) => {
        state.caseStudySubCategories = action.payload?.data ?? []
        state.caseStudySubCategoriesParams = action.payload?.params ?? {}
      })
      .addCase(getCaseStudyTagsDropdown.fulfilled, (state, action: any) => {
        state.caseStudyTags = action.payload ?? []
      })
      .addCase(getMenuTypesDropdown.fulfilled, (state, action: any) => {
        state.menuTypes = action.payload ?? []
      })
      .addCase(getMenuCategoriesDropdown.fulfilled, (state, action: any) => {
        state.menuCategories = action.payload?.data ?? []
        state.menuCategoriesParams = action.payload?.params ?? {}
      })
      .addCase(getMenuSubCategoriesDropdown.fulfilled, (state, action: any) => {
        state.menuSubCategories = action.payload?.data ?? []
        state.menuSubCategoriesParams = action.payload?.params ?? {}
      })
      .addCase(getContentRefsDropdown.fulfilled, (state, action: any) => {
        state.contentRefs = action.payload?.data ?? []
        state.contentRefsParams = action.payload?.params ?? {}
      })
      .addCase(getIndustryLinksDropdown.fulfilled, (state, action: any) => {
        state.industryLinks = action.payload?.data ?? []
      })
      .addCase(getServiceLinksDropdown.fulfilled, (state, action: any) => {
        state.serviceLinks = action.payload?.data ?? []
        state.serviceLinksParams = action.payload?.params ?? {}
      })
      .addCase(getSubServiceLinksDropdown.fulfilled, (state, action: any) => {
        state.subServiceLinks = action.payload?.data ?? []
        state.subServiceLinksParams = action.payload?.params ?? {}
      })
  }
} as CreateSliceOptions)

export default cmsDropdowns.reducer

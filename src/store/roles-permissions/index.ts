// ** Redux Imports
import {createAsyncThunk, createSlice, CreateSliceOptions} from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface LoadingStateParams {
  getData?: boolean
  getUsers?: boolean
}

interface OrgUsersParams {
  LocationId: number | null
}

export interface UserDataTypes {
  userId: number
  userName: string
  userImage?: string | null
  userEmail?: string | null
  locationId: number
  locationName?: string | null
  policyId?: number | null
  policyName?: string | null
  isBlocked: boolean
  addedAt: string | null
}

export interface PolicyDataType {
  policyId?: number | null
  description?: string | null
  totalUser?: number | null
  users: Array<{
    userId?: number | null
    userName?: string | null
    userEmail?: string | null
    userProfileImage?: string | null
  }>;
}


export interface PolicyDetailDataType {
  policyId?: number | null;
  locationId?: number | null;
  fyearId?: number | null;
  screenId?: number | null;
  screenName?: string | null;
  screenDescription?: string | null;
  screenGroup: string;
  viewScreen: boolean | null;
  addScreen: boolean;
  updateScreen: boolean;
  deleteScreen: boolean;
  others: boolean;
}

export interface ScreenGroup {
  screenGroup: string;
  viewScreen: boolean;
  addScreen: boolean;
  updateScreen: boolean;
  deleteScreen: boolean;
  others: boolean;
  screens: PolicyDetailDataType[];
}


export const setLoading = createAsyncThunk('appPolicies/setLoading', async (loadingState: LoadingStateParams) => ({ ...loadingState }) as any)

export const getData = createAsyncThunk('appPolicies/getData', async (params: any, { dispatch }) => {
  dispatch(setLoading({ getData: true }))
  const response = await axios.get('/UserRights/GetPoliciesList', { params })
  dispatch(setLoading({ getData: false }))

  return {
    params,
    data: response.data
  } as any
})

export const getUsers = createAsyncThunk('appPolicies/getUsers', async (params: OrgUsersParams, { dispatch }) => {
  dispatch(setLoading({ getUsers: true }))
  const response = await axios.get('/UserRights/GetOrgUsersDetails', { params })
  dispatch(setLoading({ getUsers: false }))

  return {
    params,
    data: response.data
  } as any
})

export const appPolicies = createSlice({
  name: 'appPolicies',
  initialState: {
    users: [] as UserDataTypes[],
    data: [] as PolicyDataType[],
    params: {},
    user_params: {},
    loadingState: { getData: false }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action: any) => {
        state.data = action.payload.data.data?.list??[] as PolicyDataType[]
        state.params = action.payload.params
      })
      .addCase(getUsers.fulfilled, (state, action: any) => {
        state.users = action.payload.data.data??[] as UserDataTypes[]
        state.user_params = action.payload.params
      })
      .addCase(setLoading.fulfilled, (state, action) => {
        state.loadingState = action.payload
      })
  }
} as CreateSliceOptions)

export default appPolicies.reducer

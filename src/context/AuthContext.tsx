// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  LoginDataType
} from './types'
import { localServerAddress } from '../@core/utils/form-types'

// ** Apollo Imports
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import axiosInstance from 'src/@core/utils/axiosInstence'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  qlClient: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

interface LoginResponse {
  token?: string
  accessToken?: string
  user?: AuthUserPayload
  userData?: AuthUserPayload
  data?: {
    user?: AuthUserPayload
    userData?: AuthUserPayload
  }
}

type AuthUserPayload = {
  id?: string | number
  _id?: string | number
  userId?: string | number
  name?: string
  fullName?: string
  username?: string
  email?: string
  role?: string
  avatar?: string | null
}

type NormalizedAuthUser = {
  id: string | number
  name: string
  email: string
  role: string
  avatar?: string | null
}

const useMockAuth = process.env.NODE_ENV !== 'production'
const authHttp = useMockAuth ? axios : axiosInstance
const authEndpoints = {
  login: useMockAuth ? '/jwt/login' : authConfig.loginEndpoint,
  me: useMockAuth ? '/auth/me' : authConfig.meEndpoint
}

const normalizeAuthUser = (rawUser?: AuthUserPayload | null): NormalizedAuthUser | null => {
  if (!rawUser) {
    return null
  }

  const id = rawUser.id ?? rawUser._id ?? rawUser.userId
  const name = rawUser.name ?? rawUser.fullName ?? rawUser.username ?? rawUser.email ?? ''
  const email = rawUser.email ?? ''

  if (id === undefined || !name || !email) {
    return null
  }

  return {
    id,
    name,
    email,
    role: rawUser.role ?? 'admin',
    avatar: rawUser.avatar ?? null
  }
}

const extractAuthUser = (payload: LoginResponse | any): AuthUserPayload | null => {
  return (
    payload?.userData ??
    payload?.user ??
    payload?.data?.userData ??
    payload?.data?.user ??
    payload?.data ??
    null
  )
}

const extractAuthToken = (payload: LoginResponse | any): string | null => {
  return payload?.token ?? payload?.accessToken ?? null
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<any | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Apollo Client state
  const [qlClient, setQlClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null)

  // ** Hooks
  const router = useRouter()
  const { jwtToken } = router.query

  // ** Default ability for all users (full access)
  const defaultAbility = [
    { action: 'manage', subject: 'all' },
    { action: 'view', subject: 'DashboardMain' },
    { action: 'read', subject: 'DashboardMain' }
  ]

  // Helper function to clear auth data
  const clearAuthData = () => {
    sessionStorage.removeItem('userData')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem(localServerAddress)
    localStorage.removeItem('userData')
    localStorage.removeItem('accessToken')
    localStorage.removeItem(localServerAddress)
    delete axios.defaults.headers.common['Authorization']
    delete axiosInstance.defaults.headers.common['Authorization']
    setUser(null)
    setQlClient(null)
  }

  // Setup Apollo Client
  const setupApolloClient = (token: string) => {
    const gqlBase = process.env.NEXT_PUBLIC_API_URL_LIVE || 'http://tbuez12tkp6df31lpii6i5ql.187.124.213.221.sslip.io'
    const httpLink = createHttpLink({
      uri: `${gqlBase}/graphql`
    })
    
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    }))
    
    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    })
    
    setQlClient(client)
    return client
  }

  // Check if user is authenticated
  const checkAuth = () => {
    const token = sessionStorage.getItem(authConfig.storageTokenKeyName) || 
                  localStorage.getItem(authConfig.storageTokenKeyName)
    return !!token
  }

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      // Clear any existing auth headers first
      delete axios.defaults.headers.common['Authorization']
      delete axiosInstance.defaults.headers.common['Authorization']

      let storedToken = sessionStorage.getItem(authConfig.storageTokenKeyName) ||
                       localStorage.getItem(authConfig.storageTokenKeyName)

      if (storedToken) {
        setLoading(true)
        try {
          // Verify token by calling user endpoint
          const response = await authHttp.get(authEndpoints.me, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          })

          if (response.data) {
            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
            
            // Transform user data to match your expected structure
            const userData = normalizeAuthUser(extractAuthUser(response.data))

            if (!userData) {
              throw new Error('Invalid user data')
            }
            
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              ability: defaultAbility
            } as any)

            // Setup Apollo Client
            setupApolloClient(storedToken)

            // Store user data
            const userToStore = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role
            }
            
            sessionStorage.setItem('userData', JSON.stringify(userToStore))
            
            setLoading(false)
          } else {
            throw new Error('Invalid user data')
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          clearAuthData()
          setLoading(false)
          
          if (!router.pathname.includes('login') && 
              !router.pathname.includes('reset-password') && 
              !router.pathname.includes('forgot-password') && 
              !router.pathname.includes('register')) {
            router.replace('/login')
          }
        }
      } else {
        clearAuthData()
        setLoading(false)
        
        if (!router.pathname.includes('login') && 
            !router.pathname.includes('reset-password') && 
            !router.pathname.includes('forgot-password') && 
            !router.pathname.includes('register')) {
          router.replace('/login')
        }
      }
    }

    if (jwtToken) {
      localStorage.setItem(authConfig.storageTokenKeyName, `${jwtToken}`)
      router.replace(router.pathname)
    } else {
      initAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtToken])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    // Clear any existing auth headers
    delete axios.defaults.headers.common['Authorization']
    delete axiosInstance.defaults.headers.common['Authorization']
    
    authHttp
      .post<LoginResponse>(authEndpoints.login, params)
      .then(async response => {
        const token = extractAuthToken(response.data)
        const userData = normalizeAuthUser(extractAuthUser(response.data))

        if (!token) {
          throw new Error('No token received from server')
        }

        if (!userData) {
          throw new Error('No user data received from server')
        }

        // Store token
        sessionStorage.setItem(authConfig.storageTokenKeyName, token)
        
        if (params.rememberMe) {
          localStorage.setItem(authConfig.storageTokenKeyName, token)
        }

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Set user with default ability (full access)
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          ability: defaultAbility
        } as any)

        // Store user data
        const userToStore = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        }
        
        sessionStorage.setItem('userData', JSON.stringify(userToStore))
        
        if (params.rememberMe) {
          localStorage.setItem('userData', JSON.stringify(userToStore))
        }

        // Setup Apollo Client
        setupApolloClient(token)

        // Store instance URL
        const instanceURL = process.env.NEXT_PUBLIC_API_URL || 'http://tbuez12tkp6df31lpii6i5ql.187.124.213.221.sslip.io'
        sessionStorage.setItem(localServerAddress, `${instanceURL}/`)
        
        if (params.rememberMe) {
          localStorage.setItem(localServerAddress, `${instanceURL}/`)
        }

        // Redirect
        const returnUrl = router.query.returnUrl
        const redirectURL = (returnUrl && returnUrl !== '/' ? returnUrl : '/') as string
        router.replace(redirectURL)
      })
      .catch(err => {
        console.error('Login error:', err)
        
        let errorMessage = 'Invalid email or password'
        
        // Extract error message from response
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.response?.data?.error?.email?.[0]) {
          errorMessage = err.response.data.error.email[0]
        } else if (err.response?.data?.error?.message) {
          errorMessage = err.response.data.error.message
        } else if (err.message) {
          errorMessage = err.message
        }
        
        if (errorCallback) {
          errorCallback({
            response: {
              data: {
                message: errorMessage
              }
            }
          })
        }
      })
  }

  const handleLogout = () => {
    clearAuthData()
    delete axios.defaults.headers.common['Authorization']
    delete axiosInstance.defaults.headers.common['Authorization']
    router.push('/login')
  }

  const values: AuthValuesType = {
    user,
    qlClient,
    loading,
    setUser: (userData: LoginDataType | null) => setUser(userData),
    setLoading: (isLoading: boolean) => setLoading(isLoading),
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

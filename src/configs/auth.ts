const normalizeUrl = (value?: string) => (value || '').trim().toLowerCase()

const isLocalApiUrl = (value?: string) => {
  const normalized = normalizeUrl(value)

  if (!normalized) return true

  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/|$)/.test(normalized)
}

const isLocalAuthEnabled =
  process.env.NEXT_PUBLIC_USE_LOCAL_AUTH === 'true' || process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'

export const useMockAuth = isLocalAuthEnabled && isLocalApiUrl(process.env.NEXT_PUBLIC_API_URL)

export default {
  meEndpoint: useMockAuth ? '/auth/me' : '/api/auth/me',
  loginEndpoint: useMockAuth
    ? '/jwt/login'
    : `${process.env.NEXT_PUBLIC_API_URL_LIVE || 'http://localhost:5000/'}api/auth/login`,
  registerEndpoint: useMockAuth
    ? '/jwt/register'
    : `${process.env.NEXT_PUBLIC_API_URL_LIVE || 'http://localhost:5000/'}api/auth/register`,
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

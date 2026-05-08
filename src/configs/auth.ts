export default {
  meEndpoint: '/api/auth/me',
  loginEndpoint: `${process.env.NEXT_PUBLIC_API_URL_LIVE}api/auth/login`,
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

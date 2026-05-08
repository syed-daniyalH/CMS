export default {
  meEndpoint: '/api/auth/me',
  loginEndpoint: '/api/auth/login',
  registerEndpoint: '/api/auth/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

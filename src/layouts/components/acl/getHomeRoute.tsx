/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  if (role === 'admin' || role === 'editor' || role === 'author') return '/crm/section-type'

  return '/dashboards'
}

export default getHomeRoute

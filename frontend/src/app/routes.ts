import { type RouteConfig, index, route } from '@react-router/dev/routes'


/**
 * Application route configuration.
 * Maps URL paths to their corresponding route components.
 */
export default [
  index('routes/home.tsx'),                              // / - Landing page
  route('dashboard', 'routes/dashboard.tsx'),            // /dashboard - Estimates list
  route('estimates/new', 'routes/new-estimate.tsx'),     // /estimates/new - Create estimate
  route('estimates/:id', 'routes/estimate-detail.tsx'),  // /estimates/:id - Estimate detail
  route('configs', 'routes/configs.tsx'),                // /configs - Configs list
  route('configs/new', 'routes/new-user-config.tsx'),    // /configs/new - Create user config
  route('sign-in', 'routes/sign-in.tsx'),                // /sign-in - Authentication page
  route('activate', 'routes/activate.tsx')               // /activate - Account activation page
] satisfies RouteConfig

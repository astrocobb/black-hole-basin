import { type RouteConfig, index, route } from '@react-router/dev/routes'


/**
 * Application route configuration.
 * Maps URL paths to their corresponding route components.
 */
export default [
  index('routes/home.tsx'),                                  // / - Landing page
  route('dashboard', 'routes/dashboard.tsx'),                // /dashboard - Sectioned dashboard
  route('depth-calculator', 'routes/depth-calculator.tsx'),  // /depth-calculator - Standalone depth calculator
  route('well-designs/new', 'routes/new-well-design.tsx'),   // /well-designs/new - Create well design
  route('well-designs/:id', 'routes/well-design-detail.tsx'),// /well-designs/:id - Well design detail
  route('configs', 'routes/configs.tsx'),                    // /configs - Configs list
  route('configs/new', 'routes/new-user-config.tsx'),        // /configs/new - Create user config
  route('sign-in', 'routes/sign-in.tsx'),                    // /sign-in - Authentication page
  route('activate', 'routes/activate.tsx')                   // /activate - Account activation page
] satisfies RouteConfig

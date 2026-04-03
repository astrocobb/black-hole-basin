import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'react-router'

import type { Route } from './+types/root'
import './app.css'
import { AuthProvider } from '../features/auth/hooks/use-auth'


/**
 * Preloads external font resources for the application.
 * Connects to Google Fonts and loads the Inter typeface.
 * @returns { Array } Array of link descriptors for font preconnection and stylesheet.
 */
export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
  }
]

/**
 * Root HTML layout component that wraps every page.
 * Provides the base document structure including head meta tags,
 * scroll restoration, and client-side script hydration.
 * @param {{ children: React.ReactNode }} props - The child route content to render.
 * @returns { JSX.Element } The full HTML document shell.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <Meta/>
        <Links/>
      </head>
      <body>
        { children }
        <ScrollRestoration/>
        <Scripts/>
      </body>
    </html>
  )
}

/**
 * Root application component that renders the matched child route.
 * Wraps all routes with the AuthProvider for global auth state access.
 * @returns { JSX.Element } The AuthProvider wrapping the Outlet.
 */
export default function App() {
  return (
    <AuthProvider>
      <Outlet/>
    </AuthProvider>
  )
}

/**
 * Global error boundary that catches route and runtime errors.
 * Displays a user-friendly error message, with stack traces shown only in development.
 * @param {{ error: unknown }} props - The error caught by the boundary.
 * @returns { JSX.Element } An error page with status message and optional stack trace.
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  // Display specific messages for route errors (e.g. 404)
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    // Show detailed error info only in development mode
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{ message }</h1>
      <p>{ details }</p>
      { stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{ stack }</code>
        </pre>
      ) }
    </main>
  )
}

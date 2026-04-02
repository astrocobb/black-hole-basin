import React from 'react'


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      <header className="border-b border-gray-700 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white">Black Hole Basin</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Well Depth Calculator
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Calculate optimal well designs using geographic coordinates and subsurface data.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-md bg-gray-700 p-6 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-400">Coordinate Input</h3>
            <p className="mt-2 text-sm text-gray-400">
              Enter latitude and longitude to target a specific drilling location.
            </p>
          </div>

          <div className="rounded-md bg-gray-700 p-6 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-400">Depth Analysis</h3>
            <p className="mt-2 text-sm text-gray-400">
              Get calculated well depth recommendations based on subsurface conditions.
            </p>
          </div>

          <div className="rounded-md bg-gray-700 p-6 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-400">Monitoring</h3>
            <p className="mt-2 text-sm text-gray-400">
              Track and monitor well status through a centralized dashboard.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <a
            href="/dashboard"
            className="rounded-md bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-500 active:bg-blue-700"
          >
            Go to Dashboard
          </a>
          <a
            href="/sign-in"
            className="rounded-md border border-gray-600 px-6 py-2.5 font-medium text-gray-300 transition hover:bg-gray-700"
          >
            Sign In
          </a>
        </div>
      </main>
    </div>
  )
}

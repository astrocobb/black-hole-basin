import React from 'react'


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      <header className="border-b border-gray-700 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white">Black Hole Basin</h1>
          <span className="text-sm text-gray-500">Well Depth Calculator</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-md bg-gray-700 p-6 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-gray-200">Enter Coordinates</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="latitude" className="text-sm font-medium text-gray-400">
                Latitude
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                placeholder="34.6628"
                className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="longitude" className="text-sm font-medium text-gray-400">
                Longitude
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                placeholder="-106.7764"
                className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-8 w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-500 active:bg-blue-700"
          >
            Calculate Well Design
          </button>
        </div>
      </main>
    </div>
  )
}
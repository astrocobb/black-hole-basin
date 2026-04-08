import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../features/auth/hooks/use-auth'
import { type Estimate, fetchEstimates } from '../../features/estimates/api/fetch-estimates'


export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [ estimates, setEstimates ] = useState<Estimate[]>([])
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/sign-in')
    }
  }, [ authLoading, isAuthenticated, navigate ])

  useEffect(() => {
    if (!user) return
    fetchEstimates(user.id)
      .then(res => setEstimates(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [ user ])

  if (authLoading || !isAuthenticated || !user) return null

  function handleSignOut() {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="border-b border-base-300 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight hover:text-neutral-content transition">
            Black Hole Basin
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-content">{ user.name }</span>
            <button
              type="button"
              onClick={ handleSignOut }
              className="rounded-md border border-base-300 px-3 py-1.5 text-sm text-neutral-content transition hover:bg-base-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Estimates</h2>
          <button
            type="button"
            onClick={ () => navigate('/estimates/new') }
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content transitionhover:bg-primary/90"
          >
            New Estimate
          </button>
        </div>

        { loading ? (
          <p className="text-neutral-content">Loading...</p>
        ) : estimates.length === 0 ? (
          <p className="text-neutral-content">No estimates yet. Create your first one.</p>
        ) : (
          <div className="flex flex-col gap-4">
            { estimates.map(estimate => (
              <button
                key={ estimate.id }
                type="button"
                onClick={ () => navigate(`/estimates/${ estimate.id }`) }
                className="rounded-md border border-base-300 bg-base-100 p-4 shadow-sm text-left transition
  hover:border-primary"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      { estimate.estimatedDepth.toFixed(0) } ft &middot; { estimate.casingDiameter }" casing
                    </p>
                    <p className="text-sm text-neutral-content">
                      { estimate.inputLat.toFixed(4) }, { estimate.inputLon.toFixed(4) } &middot; {
                      estimate.waterDemandGpm } GPM
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${ estimate.totalCost.toFixed(2) }</p>
                    <p className="text-sm text-neutral-content">
                      { new Date(estimate.createdAt).toLocaleDateString() }
                    </p>
                  </div>
                </div>
              </button>
            )) }
          </div>
        ) }
      </main>
    </div>
  )
}
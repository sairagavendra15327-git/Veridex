import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ScannerPage from './pages/ScannerPage'
import InspectionsPage from './pages/InspectionsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  function handleNavigate(pageId) {
    setActivePage(pageId)
    setIsMobileNavOpen(false)
  }

  return (
    <div className="min-h-svh bg-veridex-bg text-slate-100">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isMobileNavOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-veridex-border bg-veridex-bg px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-veridex-border p-2 text-slate-200 lg:hidden"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
              </svg>
            </button>

            <p className="text-sm font-medium text-slate-300">
              VERIDEX
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-veridex-border px-2.5 py-1">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              aria-hidden="true"
            />
            <span className="text-[11px] uppercase tracking-wide text-slate-300">
              System Ready
            </span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {activePage === 'dashboard' && (
            <Dashboard onScanProduct={() => handleNavigate('scan')} />
          )}

          {activePage === 'scan' && (
            <ScannerPage
              onBackToDashboard={() => handleNavigate('dashboard')}
            />
          )}

          {activePage === 'inspections' && <InspectionsPage />}

          {activePage === 'reports' && <ReportsPage />}

          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

export default App
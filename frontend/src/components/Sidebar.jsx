const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'scan', label: 'Scan Product' },
  { id: 'inspections', label: 'Inspections' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
]

function NavIcon({ id }) {
  const common = 'h-4 w-4'

  if (id === 'dashboard') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (id === 'scan') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 8V5h3M16 5h3v3M19 16v3h-3M8 19H5v-3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 12h16" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (id === 'inspections') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 6h8M8 12h8M8 18h5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  if (id === 'reports') {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 18V10M12 18V6M18 18v-7" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 4.5v1.5M12 18v1.5M4.5 12H6M18 12h1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function Sidebar({ activePage, onNavigate, isMobileNavOpen, onClose }) {
  return (
    <>
      {isMobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-veridex-border bg-veridex-surface transition-transform duration-200 lg:translate-x-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-veridex-border px-5 py-5">
          <p className="text-lg font-semibold tracking-wide text-white">VERIDEX</p>
          <p className="mt-1 text-xs text-slate-400">Legal Metrology support</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-veridex-border bg-veridex-bg px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-300">
              System Ready
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activePage

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-veridex-accent/15 text-veridex-accent-soft'
                    : 'text-slate-300 hover:bg-veridex-raised hover:text-white'
                }`}
              >
                <NavIcon id={item.id} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <p className="border-t border-veridex-border px-5 py-4 text-[11px] leading-relaxed text-slate-500">
          SIH26034 · Packaged Commodities Rules, 2011
        </p>
      </aside>
    </>
  )
}

export default Sidebar

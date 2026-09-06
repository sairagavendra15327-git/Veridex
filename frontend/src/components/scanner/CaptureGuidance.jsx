import { useState } from 'react'

const GUIDELINES = [
  {
    id: 'flat',
    title: 'Keep Label Flat & Aligned',
    description:
      'Smooth out folded pouches or curved labels. Keep the package parallel to the camera sensor to avoid perspective distortion and skewed OCR readings.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: 'readable',
    title: 'Ensure Readable, High-Contrast Text',
    description:
      'Ensure the photo is sharply focused. Text smaller than 1.5 mm (such as Unit Sale Price and ingredient lists) must be legible without pixelation.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
      </svg>
    ),
  },
  {
    id: 'glare',
    title: 'Avoid Glare & Hard Shadows',
    description:
      'Reflective foil packaging, glossy lamination, and harsh flash create bright specular spots that obscure mandatory declarations.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  {
    id: 'full_label',
    title: 'Capture Full Relevant Label Area',
    description:
      'Include the complete Principal Display Panel (PDP) and borders. Missing edges may cause statutory declarations (like Net Quantity or MRP) to be omitted.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6" />
      </svg>
    ),
  },
  {
    id: 'multi_side',
    title: 'Multi-Sided Package Awareness',
    description:
      'If manufacturer details or consumer care info are printed on the back or side panels, capture and inspect those panels as well.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
        <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
]

function CaptureGuidance() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="rounded-xl border border-veridex-border bg-veridex-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-veridex-raised/50"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-veridex-accent/15 text-veridex-accent-soft">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Capture Guidance for Legal Metrology</h2>
            <p className="text-xs text-slate-400">
              Optimal image preparation for accurate PCR 2011 rule verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-veridex-accent-soft hidden sm:inline">
            {isOpen ? 'Collapse Tips' : 'View Tips'}
          </span>
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-veridex-border p-4 sm:p-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDELINES.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-veridex-border bg-veridex-bg/60 p-3.5 flex flex-col justify-between hover:border-slate-600 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-veridex-accent-soft mb-2">
                    {item.icon}
                    <h3 className="text-xs font-semibold text-slate-200">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}

            {/* Statutory Tip Card */}
            <div className="rounded-lg border border-veridex-accent/30 bg-veridex-accent/5 p-3.5 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center gap-2 text-veridex-accent-soft mb-2">
                  <span className="h-2 w-2 rounded-full bg-veridex-accent" />
                  <h3 className="text-xs font-semibold text-veridex-accent-soft">Inspector Standard</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clear images ensure OCR character confidence exceeds 90%, preventing false positives on mandatory declarations like MRP and Unit Sale Price.
                </p>
              </div>
              <p className="mt-2 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                PCR 2011 · Rule 9 Standard
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaptureGuidance

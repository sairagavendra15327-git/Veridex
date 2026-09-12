import { useState } from 'react'

function InspectorVerifyModal({ result, onClose, onSaveVerification }) {
  const [inspectorName, setInspectorName] = useState('')
  const [badgeId, setBadgeId] = useState('')
  const [decision, setDecision] = useState('NOTICE') // 'APPROVE' | 'NOTICE' | 'SEIZE'
  const [remarks, setRemarks] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSaveVerification({
      inspectorName,
      badgeId,
      decision,
      remarks,
      verifiedAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verify-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-xl border border-veridex-border bg-veridex-surface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-veridex-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-veridex-accent/20 text-veridex-accent">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h2 id="verify-modal-title" className="text-base font-semibold text-white">
                Inspector Verification
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Review of the preliminary compliance screening result. This record captures the authorized inspector's decision-support review.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="inspector-name-input" className="block text-xs font-medium text-slate-300">
                Officer Name
              </label>
              <input
                id="inspector-name-input"
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                placeholder="Enter officer name"
                className="mt-1 w-full rounded-lg border border-veridex-border bg-veridex-bg px-3 py-2 text-xs text-white focus:border-veridex-accent focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="badge-id-input" className="block text-xs font-medium text-slate-300">
                Inspector Badge / Jurisdiction ID
              </label>
              <input
                id="badge-id-input"
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                placeholder="Enter badge or jurisdiction ID"
                className="mt-1 w-full rounded-lg border border-veridex-border bg-veridex-bg px-3 py-2 text-xs text-white focus:border-veridex-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Inspector Decision
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  decision === 'NOTICE'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-veridex-border bg-veridex-bg hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="NOTICE"
                  checked={decision === 'NOTICE'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="mt-0.5 text-veridex-accent focus:ring-0"
                />
                <div>
                  <p className="text-xs font-semibold text-amber-300">
                    Issue Notice of Violation (PCR Rule 6(11) / Section 39)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Flagged declarations require formal explanation from the packer or manufacturer.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  decision === 'APPROVE'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-veridex-border bg-veridex-bg hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="APPROVE"
                  checked={decision === 'APPROVE'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="mt-0.5 text-veridex-accent focus:ring-0"
                />
                <div>
                  <p className="text-xs font-semibold text-emerald-300">
                    Officer Overrule · Verified Compliant
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Officer confirms physical label meets statutory standards despite algorithmic warning.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  decision === 'SEIZE'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-veridex-border bg-veridex-bg hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="SEIZE"
                  checked={decision === 'SEIZE'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="mt-0.5 text-veridex-accent focus:ring-0"
                />
                <div>
                  <p className="text-xs font-semibold text-red-300">
                    Seize Samples & Refer for Laboratory Measurement
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Direct physical seizure of package lots under Section 15 for volumetric calibration.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="inspector-remarks-input" className="block text-xs font-medium text-slate-300">
              Inspector Legal Remarks & Justification
            </label>
            <textarea
              id="inspector-remarks-input"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="mt-1 w-full rounded-lg border border-veridex-border bg-veridex-bg p-2.5 text-xs text-white focus:border-veridex-accent focus:outline-none"
              placeholder="Enter official observation, rule clauses cited, and next actions..."
            />
          </div>

          <div className="rounded border border-veridex-border bg-veridex-bg p-2.5 text-[11px] text-slate-400">
            Recorded against Inspection ID: <span className="font-mono text-slate-200">{result.inspectionId}</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-veridex-border px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-veridex-accent px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-veridex-accent-soft"
            >
              Record Inspector Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InspectorVerifyModal

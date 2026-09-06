import { useState } from 'react'

function EvidenceModal({ result, onClose }) {
  const [activeTab, setActiveTab] = useState('snippets') // 'snippets' | 'raw' | 'rules'

  if (!result) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl border border-veridex-border bg-veridex-surface shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-veridex-border p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-veridex-accent/15 px-2 py-0.5 font-mono text-[11px] text-veridex-accent-soft border border-veridex-accent/30">
                AUDIT TRAIL
              </span>
              <h2 id="evidence-modal-title" className="text-lg font-semibold text-white">
                Comprehensive Extraction & Legal Evidence
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Inspection ID: <span className="font-mono text-slate-300">{result.inspectionId}</span> · Target: {result.productName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-veridex-border p-2 text-slate-400 hover:border-slate-400 hover:text-white transition-colors"
            aria-label="Close evidence modal"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-veridex-border px-5 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('snippets')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'snippets'
                ? 'border-veridex-accent text-veridex-accent-soft'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Extracted Evidence Snippets ({result.evidenceSnippets?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'raw'
                ? 'border-veridex-accent text-veridex-accent-soft'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw OCR Stream Transcript
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'rules'
                ? 'border-veridex-accent text-veridex-accent-soft'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Statutory Rule Matrix (PCR 2011)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'snippets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Segmented text regions mapped against Legal Metrology mandatory declarations:
              </p>
              <div className="space-y-2.5">
                {result.evidenceSnippets?.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-veridex-border bg-veridex-bg p-3.5 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
                            item.status === 'PASS'
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-xs font-semibold text-white">{item.field}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        Rule: <span className="text-slate-200">{item.targetRule}</span>
                      </span>
                    </div>

                    <div className="rounded border border-slate-800 bg-slate-950 p-2.5 font-mono text-xs text-emerald-400 overflow-x-auto">
                      {item.rawOcrText}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span>Spatial Context: {item.context}</span>
                      <span className="font-mono">Match Confidence: {item.matchScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Direct character stream output from the optical character recognition pipeline before entity classification:
              </p>
              <pre className="rounded-lg border border-veridex-border bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {result.rawOcrTranscript}
              </pre>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Statutory criteria evaluated under the Legal Metrology (Packaged Commodities) Rules, 2011:
              </p>
              <div className="space-y-2">
                <div className="rounded-lg border border-veridex-border bg-veridex-bg p-3 text-xs space-y-1">
                  <p className="font-semibold text-white">Rule 6(1)(a) · Manufacturer Identity</p>
                  <p className="text-slate-400">Requires name and complete postal address of the manufacturer, packer, or importer.</p>
                </div>
                <div className="rounded-lg border border-veridex-border bg-veridex-bg p-3 text-xs space-y-1">
                  <p className="font-semibold text-white">Rule 6(1)(b) & Rule 12 · Net Quantity</p>
                  <p className="text-slate-400">Requires declaration in standard SI units (g, kg, ml, L) without misleading prefixes.</p>
                </div>
                <div className="rounded-lg border border-veridex-border bg-veridex-bg p-3 text-xs space-y-1">
                  <p className="font-semibold text-white">Rule 6(1)(e) · Retail Sale Price (MRP)</p>
                  <p className="text-slate-400">Mandates unambiguous MRP declaration formatted with &quot;inclusive of all taxes&quot; phrase.</p>
                </div>
                <div className="rounded-lg border border-veridex-border bg-veridex-bg p-3 text-xs space-y-1">
                  <p className="font-semibold text-amber-400">Rule 6(11) · Unit Sale Price (USP) Amendment</p>
                  <p className="text-slate-400">For net quantity &gt; 1 L or 1 kg, Unit Sale Price must be stated per 100 ml/g or per 1 L/kg with proportionate font height.</p>
                </div>
                <div className="rounded-lg border border-veridex-border bg-veridex-bg p-3 text-xs space-y-1">
                  <p className="font-semibold text-white">Rule 6(1)(g) · Consumer Grievance Details</p>
                  <p className="text-slate-400">Requires name, address, telephone number, and email address of grievance officer.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-veridex-border p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-veridex-raised border border-veridex-border px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  )
}

export default EvidenceModal

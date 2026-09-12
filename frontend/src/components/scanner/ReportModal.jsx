function ReportModal({ result, verification, onClose }) {
  if (!result) return null

  function handlePrint() {
    window.print()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-xl border border-veridex-border bg-veridex-surface shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-veridex-border p-4 sm:p-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-veridex-accent-soft">
              Decision-Support Report
            </span>
            <h2 id="report-modal-title" className="text-base font-semibold text-white">
              Preliminary Compliance Screening Report
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-veridex-accent px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-veridex-accent-soft transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <path d="M6 14h12v8H6z" />
              </svg>
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-veridex-border p-1.5 text-slate-400 hover:text-white"
              aria-label="Close report"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200">
          {/* Official Letterhead */}
          <div className="border-b border-veridex-border pb-4 text-center">
            <p className="text-xs uppercase tracking-widest text-veridex-accent font-semibold">
              GOVERNMENT OF INDIA · DEPARTMENT OF CONSUMER AFFAIRS
            </p>
            <h3 className="text-lg font-bold text-white mt-1">
              DIRECTORATE OF LEGAL METROLOGY (PACKAGED COMMODITIES DIVISION)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Preliminary Screening Summary · Decision-support system for inspector review
            </p>
          </div>

          {/* Metadata Grid — 6 cells: ID, timestamp, verdict, score, OCR confidence, rule version */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-veridex-bg p-3.5 rounded-lg border border-veridex-border">
            <div>
              <span className="text-slate-500 block">Report / Inspection ID</span>
              <span className="font-mono text-white font-semibold">{result.inspectionId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date &amp; Time</span>
              <span className="text-white font-mono">{new Date(result.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Preliminary Status</span>
              <span className="text-amber-400 font-semibold">{result.overallStatus}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Checks Passed</span>
              <span className="text-white font-mono font-semibold">{result.overallScore}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">OCR Confidence</span>
              <span className="text-white font-mono">{result.confidenceMetrics?.ocrExtraction ?? '—'}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Rule Version</span>
              <span className="font-mono text-slate-300 text-[10px]">{result.ruleVersion || 'LM-PCR-2011'}</span>
            </div>
          </div>

          {/* Product Profile */}
          <div className="space-y-1 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-slate-400 text-[11px]">
              Inspected Commodity
            </h4>
            <div className="rounded-lg border border-veridex-border p-3 space-y-1">
              <p className="text-sm font-semibold text-white">{result.productName}</p>
              <p className="text-slate-400">Category: {result.category}</p>
              <p className="text-slate-400 font-mono text-[11px]">Governing Standard: {result.targetStandard}</p>
            </div>
          </div>

          {/* Compliance Findings Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-slate-400 text-[11px]">
              SYSTEM SCREENING · Mandatory Declarations Assessment
            </h4>
            <table className="w-full text-left border-collapse border border-veridex-border rounded overflow-hidden">
              <thead className="bg-veridex-bg text-slate-400 font-medium">
                <tr>
                  <th className="p-2 border-b border-veridex-border">Declaration Field</th>
                  <th className="p-2 border-b border-veridex-border">Rule Reference</th>
                  <th className="p-2 border-b border-veridex-border">Extracted Finding</th>
                  <th className="p-2 border-b border-veridex-border">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-veridex-border text-[11px]">
                {result.detectedDeclarations?.map((d) => (
                  <tr key={d.id}>
                    <td className="p-2 font-medium text-slate-200">{d.name}</td>
                    <td className="p-2 font-mono text-slate-400">{d.statutoryRule}</td>
                    <td className="p-2 text-slate-300 truncate max-w-xs">{d.extractedValue}</td>
                    <td className="p-2 text-emerald-400 font-semibold">{d.status}</td>
                  </tr>
                ))}
                {result.flaggedDeclarations?.map((d) => (
                  <tr key={d.id} className="bg-amber-500/5">
                    <td className="p-2 font-medium text-amber-300">{d.name}</td>
                    <td className="p-2 font-mono text-amber-300">{d.statutoryRule}</td>
                    <td className="p-2 text-amber-200">{d.issue}: {d.extractedValue}</td>
                    <td className="p-2 text-amber-400 font-semibold">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inspector Verification Sign-off Box */}
          <div className="rounded-lg border border-veridex-border bg-veridex-bg p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-veridex-border pb-2">
              <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
                INSPECTOR DECISION
              </span>
              <span className="font-mono text-[10px] text-veridex-accent-soft">
                captured by authorized inspector
              </span>
            </div>
            {verification ? (
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <p><span className="text-slate-500">Inspector:</span> <span className="font-semibold text-white">{verification.inspectorName}</span></p>
                  <p><span className="text-slate-500">Badge ID:</span> <span className="font-mono text-white">{verification.badgeId}</span></p>
                  <p><span className="text-slate-500">Recorded Decision:</span> <span className="font-semibold text-veridex-accent">{verification.decision}</span></p>
                  <p><span className="text-slate-500">Verified Timestamp:</span> <span className="font-mono text-slate-300">{new Date(verification.verifiedAt).toLocaleString()}</span></p>
                </div>
                <p className="text-slate-300 text-[11px] pt-1">
                  <span className="text-slate-500 font-medium">Remarks:</span> {verification.remarks || '—'}
                </p>
              </div>
            ) : (
              <div className="py-2 text-center text-slate-500 italic text-[11px]">
                Awaiting inspector verification (Use the Verify Result action in the scanner).
              </div>
            )}
          </div>

          {/* Statutory Disclaimer Notice */}
          <div className="border-t border-veridex-border pt-3 text-[10px] text-slate-500 leading-relaxed text-center">
            {result.statutoryNotice?.text ||
              'VERIDEX provides preliminary decision support based on image extraction and codified checks. The authorized Legal Metrology Inspector makes the final determination.'}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-veridex-border p-4 flex justify-between items-center bg-veridex-bg/50">
          <p className="text-[11px] text-slate-500">
            VERIDEX SIH26034 · Legal Metrology Intelligence Platform · Preliminary Screening Only
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-veridex-border px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportModal

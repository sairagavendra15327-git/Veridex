import StatusBadge from '../StatusBadge'

function ConfidenceBar({ label, value }) {
  let color = 'bg-emerald-400'
  if (value < 80) color = 'bg-amber-400'
  if (value < 60) color = 'bg-red-400'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono font-semibold text-slate-200">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-veridex-bg rounded-full overflow-hidden border border-veridex-border">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function ComplianceResult({
  result,
  previewUrl,
  verification,
  onVerifyResult,
  onStartNewScan,
  onViewEvidence,
  onGenerateReport,
}) {
  if (!result) return null

  return (
    <div className="space-y-6">
      {/* Top Banner / Inspection Header */}
      <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {previewUrl ? (
              <div className="hidden sm:flex h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-veridex-border bg-veridex-bg items-center justify-center p-1">
                <img
                  src={previewUrl}
                  alt="Inspected label thumbnail"
                  className="h-full w-full object-contain rounded"
                />
              </div>
            ) : null}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <StatusBadge
                  status={
                    result.overallStatus === 'COMPLIANT'
                      ? 'PASS'
                      : result.overallStatus === 'NON-COMPLIANT'
                      ? 'FAIL'
                      : 'REVIEW'
                  }
                />
                <span className="rounded-md border border-veridex-border bg-veridex-bg px-2.5 py-0.5 font-mono text-xs text-slate-300">
                  {result.inspectionId}
                </span>
                <span className="text-xs text-slate-500">
                  • {new Date(result.timestamp).toLocaleDateString()} {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {result.productName}
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Category: <span className="text-slate-300 font-medium">{result.category}</span>
              </p>
            </div>
          </div>

          {/* Quick actions top bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onStartNewScan}
              className="inline-flex items-center gap-1.5 rounded-lg border border-veridex-border bg-veridex-raised px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-400 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start New Scan
            </button>

            <button
              type="button"
              onClick={onVerifyResult}
              className="inline-flex items-center gap-1.5 rounded-lg bg-veridex-accent px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-veridex-accent-soft transition-colors shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verify Result
            </button>
          </div>
        </div>

        {/* Verification attestation banner if already verified by officer */}
        {verification && (
          <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-bold">
                ✓
              </span>
              <div>
                <p className="font-semibold text-emerald-300">
                  Inspector Verification: {verification.decision}
                </p>
                <p className="text-[11px] text-slate-300">
                  By Inspector {verification.inspectorName} ({verification.badgeId}) · {verification.remarks}
                </p>
              </div>
            </div>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30 shrink-0">
              Inspector Verification Recorded
            </span>
          </div>
        )}
      </div>

      {/* Summary Stats Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-veridex-border bg-veridex-surface p-4">
          <p className="text-xs text-slate-400">Checks Passed</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {result.overallScore}%
            </span>
            <span className="text-[10px] uppercase font-mono text-slate-500">Preliminary Screening</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
  Preliminary rule-check coverage
</p>
        </div>

        <div className="rounded-xl border border-veridex-border bg-veridex-surface p-4">
          <p className="text-xs text-slate-400">Compliant Declarations</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {result.summary.compliantCount}
            </span>
            <span className="text-[11px] text-slate-500">of {result.summary.totalChecked} checked</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-400/90">
  Preliminary checks passed
</p>
        </div>

        <div className="rounded-xl border border-veridex-border bg-veridex-surface p-4">
          <p className="text-xs text-slate-400">Flagged for Review</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {result.summary.reviewRequiredCount}
            </span>
            <span className="text-[11px] text-slate-500">items</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-400/90">
  {result.flaggedDeclarations.length > 0
    ? result.flaggedDeclarations
        .slice(0, 2)
        .map((item) => item.name)
        .join(' & ')
    : 'No items flagged'}
</p>
        </div>

        <div className="rounded-xl border border-veridex-border bg-veridex-surface p-4">
          <p className="text-xs text-slate-400">OCR Confidence</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-200">
              {result.confidenceMetrics.overall}%
            </span>
            <span className="text-[10px] font-mono text-slate-500">
  Tesseract
</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
  OCR extraction confidence
</p>
        </div>
      </div>

      {/* Distinction: AI Extraction vs Rule Engine Decision */}
      <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5 sm:p-6">
        <div className="border-b border-veridex-border pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-veridex-accent" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              System Architecture: AI Extraction vs. Rule Engine Decision
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            VERIDEX separates statistical perception (vision OCR) from deterministic legal adjudication (rule engine).
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* AI Extraction Layer */}
          <div className="rounded-lg border border-veridex-border bg-veridex-bg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-sky-500/20 text-sky-400 text-xs font-mono">
                  AI
                </span>
                <h3 className="text-xs font-semibold text-sky-300">
                  {result.pipelineExplanation.aiRole.title}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Perception Layer</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.pipelineExplanation.aiRole.description}
            </p>
            <div className="space-y-1.5 pt-2 border-t border-veridex-border/60">
              {result.pipelineExplanation.aiRole.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-sky-400">›</span>
                  <span>{cap}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <ConfidenceBar
                label="AI OCR & Token Extraction Confidence"
                value={result.confidenceMetrics.ocrExtraction}
              />
            </div>
          </div>

          {/* Statutory Rule Engine */}
          <div className="rounded-lg border border-veridex-border bg-veridex-bg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-veridex-accent/20 text-veridex-accent-soft text-xs font-mono">
                  PCR
                </span>
                <h3 className="text-xs font-semibold text-veridex-accent-soft">
                  {result.pipelineExplanation.ruleEngineRole.title}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Statutory Engine</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.pipelineExplanation.ruleEngineRole.description}
            </p>
            <div className="space-y-1.5 pt-2 border-t border-veridex-border/60">
              {result.pipelineExplanation.ruleEngineRole.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-veridex-accent">›</span>
                  <span>{cap}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <ConfidenceBar
                label="Codified Rule Engine Match Confidence"
                value={result.confidenceMetrics.ruleEngineDecision}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Declarations Breakdown: Flagged Items & Compliant Items */}
      <div className="space-y-4">
        {/* Flagged / Review Required Declarations */}
        <div className="rounded-xl border border-amber-500/30 bg-veridex-surface p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-veridex-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
                !
              </div>
              <h2 className="text-sm font-semibold text-white">
                Review Required / Potential Deficiencies ({result.flaggedDeclarations.length})
              </h2>
            </div>
            <span className="text-xs text-amber-400 font-medium">
              Requires Physical Measurement
            </span>
          </div>

          <div className="space-y-3">
            {result.flaggedDeclarations.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      FLAGGED
                    </span>
                    <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                  </div>
                  <span className="font-mono text-xs text-amber-400">
                    {item.statutoryRule}
                  </span>
                </div>

                <div className="rounded border border-veridex-border bg-veridex-bg p-2.5 text-xs">
                  <span className="text-slate-400 font-mono text-[11px] block">Extracted Declaration Text:</span>
                  <span className="font-semibold text-slate-200">{item.extractedValue}</span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  <p><span className="font-semibold text-amber-300">Issue:</span> {item.explanation}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400 border-t border-amber-500/20">
                  <span className="italic text-slate-300">
                    Recommendation: {item.recommendation}
                  </span>
                  <span className="font-mono">Confidence: {item.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliant Declarations List */}
        <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-veridex-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                ✓
              </div>
              <h2 className="text-sm font-semibold text-white">
                Detected Compliant Declarations ({result.detectedDeclarations.length})
              </h2>
            </div>
            <span className="text-xs text-emerald-400 font-medium">Satisfies PCR 2011</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {result.detectedDeclarations.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-veridex-border bg-veridex-bg p-3.5 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-white">{item.name}</h3>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 shrink-0">
                      PASS
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-slate-400">
                    {item.statutoryRule}
                  </p>
                  <p className="mt-2 text-xs text-slate-200 line-clamp-2">
                    {item.extractedValue}
                  </p>
                </div>
                <div className="pt-2 border-t border-veridex-border flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.notes}</span>
                  <span className="font-mono text-emerald-400 shrink-0">{item.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relevant Extracted Text & Evidence Preview */}
      <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-veridex-border pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Extracted Text Evidence Samples
            </h2>
            <p className="text-xs text-slate-400">
              Raw OCR character segments mapped to target statutory declarations
            </p>
          </div>
          <button
            type="button"
            onClick={onViewEvidence}
            className="inline-flex items-center gap-1 text-xs font-semibold text-veridex-accent-soft hover:underline"
          >
            View Full OCR Stream →
          </button>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {result.evidenceSnippets.slice(0, 3).map((snippet) => (
            <div
              key={snippet.id}
              className="rounded-lg border border-veridex-border bg-veridex-bg p-3 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-300">{snippet.field}</span>
                <span className="font-mono text-slate-500">{snippet.targetRule}</span>
              </div>
              <p className="font-mono text-xs text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800 truncate">
                {snippet.rawOcrText}
              </p>
              <p className="text-[10px] text-slate-400">{snippet.context}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prominent Statutory Warning / Inspector Note */}
      <div className="rounded-xl border border-veridex-border bg-veridex-raised p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-veridex-accent/15 text-veridex-accent">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">
              {result.statutoryNotice.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.statutoryNotice.text}
            </p>
            <p className="pt-1 text-[11px] font-mono text-slate-500">
              Statutory Basis: {result.statutoryNotice.legalAct}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-veridex-border bg-veridex-surface p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-400">
            Inspection record cached for this session
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onStartNewScan}
            className="inline-flex items-center gap-1.5 rounded-lg border border-veridex-border bg-veridex-raised px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Start New Scan
          </button>
          <button
            type="button"
            onClick={onViewEvidence}
            className="inline-flex items-center gap-1.5 rounded-lg border border-veridex-border bg-veridex-raised px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            View Full Evidence
          </button>
          <button
            type="button"
            onClick={onGenerateReport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-veridex-border bg-veridex-raised px-4 py-2 text-xs font-semibold text-veridex-accent-soft hover:border-veridex-accent transition-colors"
          >
            Generate Report
          </button>
          <button
            type="button"
            onClick={onVerifyResult}
            className="inline-flex items-center gap-1.5 rounded-lg bg-veridex-accent px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-veridex-accent-soft transition-colors"
          >
            Verify Result
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComplianceResult

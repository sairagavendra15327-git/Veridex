import { ANALYSIS_STAGES } from '../../services/scannerService'

function AnalysisProgress({ currentStage, previewUrl }) {
  const currentIdx = currentStage?.stageIndex ?? 0
  const progressPercent = currentStage?.progressPercent ?? 10

  return (
    <div className="rounded-xl border border-veridex-border bg-veridex-surface p-6 sm:p-8">
      {/* Non-pretentious Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-veridex-border pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-veridex-accent/40 bg-veridex-accent/10 px-3 py-1 text-xs font-semibold text-veridex-accent-soft">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-veridex-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-veridex-accent"></span>
            </span>
            Compliance Analysis Pipeline Active
          </div>
          <h2 className="mt-2 text-xl font-bold text-white tracking-tight">
            Analyzing Package Commodity Declarations
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Tesseract OCR · PCR 2011 Rule Engine · Real-time backend analysis
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-veridex-accent-soft">
            {progressPercent}%
          </span>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Stage {currentIdx + 1} of {ANALYSIS_STAGES.length}
          </p>
        </div>
      </div>

      {/* Main Analysis Display: Scanner Graphic + Step List */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12 items-center">
        {/* Left: Image scanning visualization */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center rounded-lg border border-veridex-border bg-veridex-bg p-4 overflow-hidden min-h-[260px]">
          {previewUrl ? (
            <div className="relative w-full max-h-[240px] flex items-center justify-center overflow-hidden rounded">
              <img
                src={previewUrl}
                alt="Package undergoing OCR"
                className="max-h-[220px] w-auto object-contain opacity-75 filter contrast-125"
              />
              {/* Simulated laser scan bar */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-veridex-accent to-transparent shadow-[0_0_12px_#f59e0b] animate-pulse" />
              {/* Overlay grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a334015_1px,transparent_1px),linear-gradient(to_bottom,#2a334015_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500">Processing package...</div>
          )}
          <p className="mt-3 text-[11px] font-mono text-veridex-accent-soft">
            Extracting OCR Bounding Polygons
          </p>
        </div>

        {/* Right: Step breakdown */}
        <div className="lg:col-span-7 space-y-3">
          {/* Progress Bar */}
          <div className="w-full bg-veridex-bg rounded-full h-2 overflow-hidden border border-veridex-border mb-4">
            <div
              className="bg-gradient-to-r from-veridex-accent to-amber-300 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="space-y-2.5">
            {ANALYSIS_STAGES.map((stage, idx) => {
              const isDone = idx < currentIdx
              const isCurrent = idx === currentIdx
              const isPending = idx > currentIdx

              return (
                <div
                  key={stage.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                    isCurrent
                      ? 'border-veridex-accent bg-veridex-accent/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : isDone
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-veridex-border/60 bg-veridex-bg/40 opacity-50'
                  }`}
                >
                  {/* Status icon */}
                  <div className="mt-0.5 shrink-0">
                    {isDone && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    {isCurrent && (
                      <div className="flex h-5 w-5 items-center justify-center">
                        <svg className="h-4 w-4 animate-spin text-veridex-accent" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                    )}
                    {isPending && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-veridex-border text-[10px] font-mono text-slate-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Stage Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-white'
                            : isDone
                            ? 'text-emerald-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {stage.label}
                      </p>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">
                      {isCurrent ? currentStage?.stageDetail || stage.detail : stage.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisProgress

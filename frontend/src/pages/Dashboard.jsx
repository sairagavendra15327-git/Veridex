import InspectionRow from '../components/InspectionRow'
import PrimaryButton from '../components/PrimaryButton'
import SectionHeader from '../components/SectionHeader'
import StatCard from '../components/StatCard'
import {
  dashboardStats,
  MOCK_DATA_SOURCE,
  recentInspections,
  workflowSteps,
} from '../data/mockDashboard'

function greetingForHour(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function Dashboard({ onScanProduct }) {
  const greeting = greetingForHour(new Date().getHours())

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-veridex-accent-soft">{greeting}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Compliance intelligence at a glance.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Decision-support view for packaged commodity inspections. Statistics
          below are mock values for interface development.
        </p>
      </header>

      <section aria-labelledby="stats-heading">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="stats-heading" className="sr-only">
            Inspection statistics
          </h2>
          <span className="rounded-md border border-veridex-border bg-veridex-raised px-2 py-1 text-[11px] uppercase tracking-wide text-slate-400">
            Data source: {MOCK_DATA_SOURCE}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              detail={stat.detail}
              tone={stat.tone}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-veridex-border bg-gradient-to-r from-veridex-surface to-veridex-raised p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-veridex-accent-soft">
            Start inspection
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">Scan New Product</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            Upload or capture a package or label image. Image processing and
            rule checks will connect here later.
          </p>
        </div>
        <PrimaryButton className="w-full sm:w-auto" onClick={onScanProduct}>
          Open scanner
        </PrimaryButton>
      </section>

      <section className="rounded-xl border border-veridex-border bg-veridex-surface p-4 sm:p-5">
        <SectionHeader
          title="How Veridex works"
          description="Intended inspection flow. Extraction, checks, and explanations are not live yet."
        />
        <ol className="flex flex-wrap items-center gap-2">
          {workflowSteps.map((step, index) => (
            <li key={step.id} className="flex items-center gap-2">
              <span className="rounded-md border border-veridex-border bg-veridex-bg px-3 py-2 text-xs font-semibold tracking-wide text-slate-200">
                {step.label}
              </span>
              {index < workflowSteps.length - 1 ? (
                <span className="text-slate-500" aria-hidden="true">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-veridex-border bg-veridex-surface">
        <div className="border-b border-veridex-border px-4 py-4 sm:px-5">
          <SectionHeader
            title="Recent inspections"
            description="Sample records used to layout the list. Not a live inspection history."
          />
        </div>
        <div className="hidden border-b border-veridex-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_6.5rem_5.5rem]">
          <span>Product</span>
          <span>Date / time</span>
          <span>Status</span>
          <span>Score</span>
        </div>
        {recentInspections.map((inspection) => (
          <InspectionRow
            key={inspection.id}
            productName={inspection.productName}
            inspectedAt={inspection.inspectedAt}
            status={inspection.status}
            score={inspection.score}
          />
        ))}
      </section>
    </div>
  )
}

export default Dashboard

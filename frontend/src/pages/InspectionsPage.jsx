import { useMemo, useState } from 'react'

const INSPECTIONS = [
  {
    id: 'INSP-2026-PCR-0884',
    product: 'Royal Heritage Pure Mustard Oil 1 L',
    category: 'Edible Oil',
    date: '06 Sep 2026',
    time: '07:45 PM',
    status: 'REVIEW',
    compliant: 5,
    review: 2,
    confidence: '86.6%',
  },
  {
    id: 'INSP-2026-PCR-0883',
    product: 'FreshHarvest Basmati Rice 5 kg',
    category: 'Packaged Food',
    date: '06 Sep 2026',
    time: '04:18 PM',
    status: 'COMPLIANT',
    compliant: 7,
    review: 0,
    confidence: '94.1%',
  },
  {
    id: 'INSP-2026-PCR-0882',
    product: 'PureDrop Refined Sunflower Oil 1 L',
    category: 'Edible Oil',
    date: '05 Sep 2026',
    time: '02:36 PM',
    status: 'REVIEW',
    compliant: 6,
    review: 1,
    confidence: '89.7%',
  },
  {
    id: 'INSP-2026-PCR-0881',
    product: 'DailyGrain Wheat Flour 5 kg',
    category: 'Packaged Food',
    date: '05 Sep 2026',
    time: '11:12 AM',
    status: 'COMPLIANT',
    compliant: 7,
    review: 0,
    confidence: '95.3%',
  },
  {
    id: 'INSP-2026-PCR-0880',
    product: 'Golden Harvest Groundnut Oil 1 L',
    category: 'Edible Oil',
    date: '04 Sep 2026',
    time: '05:27 PM',
    status: 'REVIEW',
    compliant: 5,
    review: 2,
    confidence: '82.4%',
  },
]

function StatusPill({ status }) {
  const isCompliant = status === 'COMPLIANT'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
        isCompliant
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isCompliant ? 'bg-emerald-400' : 'bg-amber-400'
        }`}
      />
      {status}
    </span>
  )
}

function InspectionCard({ inspection }) {
  return (
    <article className="rounded-xl border border-veridex-border bg-veridex-surface p-5 transition hover:border-slate-600">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusPill status={inspection.status} />
            <span className="rounded-md border border-veridex-border px-2 py-1 font-mono text-[11px] text-slate-400">
              {inspection.id}
            </span>
          </div>

          <h2 className="text-lg font-semibold text-white">
            {inspection.product}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {inspection.category} · {inspection.date} · {inspection.time}
          </p>
        </div>

        <button
          type="button"
          className="rounded-lg border border-veridex-border px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-400/50 hover:text-amber-300"
          onClick={() => window.alert(`Inspection ${inspection.id} is a mock record.`)}
        >
          View inspection
        </button>
      </div>

      <div className="mt-5 grid gap-3 border-t border-veridex-border pt-4 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Compliant
          </p>
          <p className="mt-1 text-lg font-semibold text-emerald-400">
            {inspection.compliant}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Review required
          </p>
          <p className="mt-1 text-lg font-semibold text-amber-400">
            {inspection.review}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Extraction confidence
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-200">
            {inspection.confidence}
          </p>
        </div>
      </div>
    </article>
  )
}

export default function InspectionsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  const filteredInspections = useMemo(() => {
    return INSPECTIONS.filter((inspection) => {
      const matchesSearch =
        inspection.product.toLowerCase().includes(search.toLowerCase()) ||
        inspection.id.toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === 'ALL' || inspection.status === filter

      return matchesSearch && matchesFilter
    })
  }, [search, filter])

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-medium text-amber-400">INSPECTION RECORDS</p>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Inspections
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review preliminary screening records and their verification
              states. Records shown here are mock data until the backend is
              connected.
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full border border-veridex-border px-3 py-1.5 text-xs text-slate-400">
            DATA SOURCE: MOCK
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-veridex-border bg-veridex-surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product or inspection ID..."
            className="min-h-11 flex-1 rounded-lg border border-veridex-border bg-veridex-bg px-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-amber-400/60"
          />

          <div className="flex rounded-lg border border-veridex-border bg-veridex-bg p-1">
            {['ALL', 'REVIEW', 'COMPLIANT'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                  filter === option
                    ? 'bg-amber-400/15 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {option === 'ALL' ? 'All' : option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredInspections.map((inspection) => (
          <InspectionCard key={inspection.id} inspection={inspection} />
        ))}

        {filteredInspections.length === 0 && (
          <div className="rounded-xl border border-dashed border-veridex-border bg-veridex-surface p-10 text-center">
            <p className="font-medium text-slate-200">No inspections found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term or filter.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
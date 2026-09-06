import StatusBadge from './StatusBadge'

function formatInspectedAt(isoDate) {
  return new Date(isoDate).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function InspectionRow({ productName, inspectedAt, status, score }) {
  return (
    <article className="grid grid-cols-1 gap-3 border-b border-veridex-border px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_6.5rem_5.5rem] sm:items-center">
      <div>
        <p className="font-medium text-slate-100">{productName}</p>
        <p className="mt-0.5 text-xs text-slate-500 sm:hidden">
          {formatInspectedAt(inspectedAt)}
        </p>
      </div>
      <p className="hidden text-sm text-slate-400 sm:block">
        {formatInspectedAt(inspectedAt)}
      </p>
      <StatusBadge status={status} />
      <p className="text-sm font-semibold tabular-nums text-slate-200">
        Score {score}
      </p>
    </article>
  )
}

export default InspectionRow

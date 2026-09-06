const TONE_ACCENT = {
  pass: 'border-l-emerald-500',
  fail: 'border-l-red-500',
  review: 'border-l-amber-500',
  default: 'border-l-veridex-accent',
}

function StatCard({ label, value, detail, tone = 'default' }) {
  const accent = TONE_ACCENT[tone] ?? TONE_ACCENT.default

  return (
    <article
      className={`rounded-xl border border-veridex-border bg-veridex-surface p-4 border-l-4 ${accent}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  )
}

export default StatCard

const STATUS_STYLES = {
  PASS: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  FAIL: 'border-red-500/40 bg-red-500/15 text-red-300',
  REVIEW: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.REVIEW

  return (
    <span
      className={`inline-flex min-w-[4.75rem] items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide ${style}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge

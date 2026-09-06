function PrimaryButton({ children, type = 'button', onClick, disabled = false, className = '' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`inline-flex items-center justify-center rounded-lg bg-veridex-accent px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-veridex-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-veridex-accent disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default PrimaryButton

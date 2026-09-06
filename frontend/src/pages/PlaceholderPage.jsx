function PlaceholderPage({ title, description }) {
  return (
    <section className="max-w-2xl rounded-xl border border-veridex-border bg-veridex-surface p-6">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>
    </section>
  )
}

export default PlaceholderPage

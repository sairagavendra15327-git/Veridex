import { useState } from 'react'

function SettingRow({ title, description, children }) {
    return (
        <div className="flex flex-col gap-4 border-b border-veridex-border py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
                <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
            </div>

            {children}
        </div>
    )
}

export default function SettingsPage() {
    const [highQuality, setHighQuality] = useState(true)
    const [guidance, setGuidance] = useState(true)

    return (
        <section className="mx-auto max-w-5xl space-y-6">
            <div>
                <p className="text-sm font-medium text-amber-400">WORKSPACE</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                    Settings
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Configure inspection preferences and review the rule configuration
                    used by the Veridex screening workflow.
                </p>
            </div>

            <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5">
                <div className="flex items-center justify-between border-b border-veridex-border pb-4">
                    <div>
                        <h2 className="font-semibold text-white">Inspector Profile</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Demo profile for the current frontend session.
                        </p>
                    </div>

                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                        Active
                    </span>
                </div>

                <div className="grid gap-4 py-5 sm:grid-cols-2">
                    <div>
                        <label className="text-xs uppercase tracking-wide text-slate-500">
                            Officer name
                        </label>
                        <input
                            defaultValue="Demo Inspector"
                            className="mt-2 w-full rounded-lg border border-veridex-border bg-veridex-bg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-400/60"
                        />
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wide text-slate-500">
                            Role
                        </label>
                        <input
                            defaultValue="Legal Metrology Inspector"
                            className="mt-2 w-full rounded-lg border border-veridex-border bg-veridex-bg px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-400/60"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5">
                <div className="border-b border-veridex-border pb-4">
                    <h2 className="font-semibold text-white">Screening Preferences</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        These controls are frontend preferences and are not connected to
                        backend services yet.
                    </p>
                </div>

                <SettingRow
                    title="Prefer high-resolution scans"
                    description="Recommend high-resolution package images before analysis."
                >
                    <button
                        type="button"
                        onClick={() => setHighQuality(!highQuality)}
                        className={`relative h-6 w-11 rounded-full transition ${highQuality ? 'bg-amber-400' : 'bg-slate-700'
                            }`}
                        aria-pressed={highQuality}
                    >
                        <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${highQuality ? 'left-6' : 'left-1'
                                }`}
                        />
                    </button>
                </SettingRow>

                <SettingRow
                    title="Show capture guidance"
                    description="Display photography guidance before package analysis."
                >
                    <button
                        type="button"
                        onClick={() => setGuidance(!guidance)}
                        className={`relative h-6 w-11 rounded-full transition ${guidance ? 'bg-amber-400' : 'bg-slate-700'
                            }`}
                        aria-pressed={guidance}
                    >
                        <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${guidance ? 'left-6' : 'left-1'
                                }`}
                        />
                    </button>
                </SettingRow>
            </div>

            <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5">
                <div className="border-b border-veridex-border pb-4">
                    <h2 className="font-semibold text-white">Rule Configuration</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Version information that will later be supplied by the backend rule
                        service.
                    </p>
                </div>

                <div className="grid gap-3 py-5 sm:grid-cols-3">
                    <div className="rounded-lg border border-veridex-border bg-veridex-bg p-4">
                        <p className="text-xs text-slate-500">Rule family</p>
                        <p className="mt-2 text-sm font-semibold text-slate-200">
                            Packaged Commodities
                        </p>
                    </div>

                    <div className="rounded-lg border border-veridex-border bg-veridex-bg p-4">
                        <p className="text-xs text-slate-500">Rule set</p>
                        <p className="mt-2 text-sm font-semibold text-slate-200">
                            PCR 2011
                        </p>
                    </div>

                    <div className="rounded-lg border border-veridex-border bg-veridex-bg p-4">
                        <p className="text-xs text-slate-500">Engine state</p>
                        <p className="mt-2 text-sm font-semibold text-amber-400">
                            Frontend Simulation
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-slate-400">
                    Rule applicability, exceptions and amendments will be maintained as
                    versioned configuration when the deterministic compliance engine is
                    connected.
                </div>
            </div>

            <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5">
                <h2 className="font-semibold text-white">System Status</h2>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-veridex-border p-3">
                        <span className="text-sm text-slate-300">Frontend application</span>
                        <span className="text-xs font-semibold text-emerald-400">
                            READY
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-veridex-border p-3">
                        <span className="text-sm text-slate-300">OCR service</span>
                        <span className="text-xs font-semibold text-slate-500">
                            NOT CONNECTED
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-veridex-border p-3">
                        <span className="text-sm text-slate-300">
                            Compliance rule engine
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                            NOT CONNECTED
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
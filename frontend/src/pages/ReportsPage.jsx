import { useState } from 'react'

const REPORTS = [
    {
        id: 'RPT-2026-0884',
        inspection: 'INSP-2026-PCR-0884',
        product: 'Royal Heritage Pure Mustard Oil 1 L',
        date: '06 Sep 2026',
        status: 'PRELIMINARY',
    },
    {
        id: 'RPT-2026-0883',
        inspection: 'INSP-2026-PCR-0883',
        product: 'FreshHarvest Basmati Rice 5 kg',
        date: '06 Sep 2026',
        status: 'PRELIMINARY',
    },
    {
        id: 'RPT-2026-0882',
        inspection: 'INSP-2026-PCR-0882',
        product: 'PureDrop Refined Sunflower Oil 1 L',
        date: '05 Sep 2026',
        status: 'PRELIMINARY',
    },
]

function ReportPreview({ report, onClose }) {
    if (!report) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-veridex-border bg-veridex-surface shadow-2xl">
                <div className="flex items-center justify-between border-b border-veridex-border p-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                            Preliminary Report
                        </p>
                        <h2 className="mt-1 text-xl font-semibold text-white">
                            {report.product}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-veridex-border px-3 py-2 text-sm text-slate-300 hover:text-white"
                    >
                        Close
                    </button>
                </div>

                <div className="space-y-5 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-veridex-border bg-veridex-bg p-4">
                            <p className="text-xs text-slate-500">Report ID</p>
                            <p className="mt-1 font-mono text-sm text-slate-200">
                                {report.id}
                            </p>
                        </div>

                        <div className="rounded-lg border border-veridex-border bg-veridex-bg p-4">
                            <p className="text-xs text-slate-500">Inspection</p>
                            <p className="mt-1 font-mono text-sm text-slate-200">
                                {report.inspection}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                        <p className="text-sm font-semibold text-amber-300">
                            Overall Assessment: REVIEW REQUIRED
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            This preliminary report summarizes extracted package information
                            and configured screening rules. Final statutory verification
                            remains with the authorized Legal Metrology Inspector.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">Screening Summary</h3>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-lg border border-veridex-border p-4">
                                <p className="text-xs text-slate-500">Compliant</p>
                                <p className="mt-1 text-xl font-semibold text-emerald-400">5</p>
                            </div>
                            <div className="rounded-lg border border-veridex-border p-4">
                                <p className="text-xs text-slate-500">Review required</p>
                                <p className="mt-1 text-xl font-semibold text-amber-400">2</p>
                            </div>
                            <div className="rounded-lg border border-veridex-border p-4">
                                <p className="text-xs text-slate-500">Verification state</p>
                                <p className="mt-1 text-xl font-semibold text-slate-200">
                                    Pending
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-veridex-border bg-veridex-bg p-5">
                        <h3 className="font-semibold text-white">Evidence Summary</h3>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="rounded-lg border border-veridex-border p-3">
                                <p className="text-slate-500">Unit Sale Price</p>
                                <p className="mt-1 text-slate-200">
                                    Review required — verify applicability and presentation
                                    against package type and applicable rule conditions.
                                </p>
                            </div>
                            <div className="rounded-lg border border-veridex-border p-3">
                                <p className="text-slate-500">Country of Origin</p>
                                <p className="mt-1 text-slate-200">
                                    Review required — declaration detected; presentation should
                                    be verified by the inspector.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-veridex-border pt-4 text-xs leading-5 text-slate-500">
                        VERIDEX is a decision-support system. This report is a preliminary
                        screening record and does not constitute final statutory
                        determination or enforcement action.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ReportsPage() {
    const [selectedReport, setSelectedReport] = useState(null)

    return (
        <section className="mx-auto max-w-7xl space-y-6">
            <div>
                <p className="text-sm font-medium text-amber-400">DOCUMENT CENTER</p>
                <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-white">
                            Reports
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                            Preliminary compliance screening reports generated from
                            inspection records.
                        </p>
                    </div>

                    <span className="inline-flex w-fit items-center rounded-full border border-veridex-border px-3 py-1.5 text-xs text-slate-400">
                        PRELIMINARY REPORTS
                    </span>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Reports available
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                        {REPORTS.length}
                    </p>
                </div>

                <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Awaiting verification
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-amber-400">3</p>
                </div>

                <div className="rounded-xl border border-veridex-border bg-veridex-surface p-5">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Data source
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-200">Mock</p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-veridex-border bg-veridex-surface">
                <div className="border-b border-veridex-border p-5">
                    <h2 className="font-semibold text-white">Recent Reports</h2>
                </div>

                <div className="divide-y divide-veridex-border">
                    {REPORTS.map((report) => (
                        <div
                            key={report.id}
                            className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                        >
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-md border border-veridex-border px-2 py-1 font-mono text-[11px] text-slate-400">
                                        {report.id}
                                    </span>
                                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-400">
                                        {report.status}
                                    </span>
                                </div>

                                <h3 className="mt-2 font-medium text-slate-100">
                                    {report.product}
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {report.inspection} · {report.date}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedReport(report)}
                                className="rounded-lg border border-veridex-border px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-400/50 hover:text-amber-300"
                            >
                                Preview report
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <ReportPreview
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
            />
        </section>
    )
}
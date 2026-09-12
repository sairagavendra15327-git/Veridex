import { useState, useEffect } from 'react'
import ImageUploader from '../components/scanner/ImageUploader'
import CaptureGuidance from '../components/scanner/CaptureGuidance'
import AnalysisProgress from '../components/scanner/AnalysisProgress'
import ComplianceResult from '../components/scanner/ComplianceResult'
import EvidenceModal from '../components/scanner/EvidenceModal'
import InspectorVerifyModal from '../components/scanner/InspectorVerifyModal'
import ReportModal from '../components/scanner/ReportModal'
import PrimaryButton from '../components/PrimaryButton'
import { analyzeProduct, ANALYSIS_STAGES } from '../services/scannerService'

// ── Error display card shown when the backend API is unavailable ───────────
function ScanErrorCard({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-lg font-bold">
          ✕
        </span>
        <div>
          <h2 className="text-sm font-semibold text-red-300">Analysis Failed</h2>
          <p className="text-xs text-slate-300 mt-0.5">{message}</p>
        </div>
      </div>
      <p className="text-[11px] text-slate-400">
        Ensure the backend server is running at{' '}
        <span className="font-mono text-slate-200">
          {import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}
        </span>{' '}
        and the image is a supported format (JPG, JPEG, PNG).
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:border-red-400 hover:text-red-200 transition-colors"
      >
        ← Return to Upload
      </button>
    </div>
  )
}

// ── No-text result card shown when OCR extracts no readable characters ─────
function NoTextResultCard({ onRetry }) {
  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-lg font-bold">
          !
        </span>
        <div>
          <h2 className="text-sm font-semibold text-amber-300">Unable to Extract Readable Text</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            The OCR pipeline could not detect any readable characters in the uploaded image.
          </p>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Possible causes: low-resolution image, heavy blur or glare, non-Latin script, or the image
        does not contain a package label. Please upload a clearer, higher-resolution photograph of
        the principal display panel.
      </p>
      <p className="text-[11px] font-mono text-amber-400">
        Preliminary result: REVIEW REQUIRED — Manual physical inspection necessary.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:border-amber-400 hover:text-amber-200 transition-colors"
      >
        ← Try Different Image
      </button>
    </div>
  )
}

function normalizeBackendResult(response) {
  const analysis = response.analysis
  const product = analysis.product || {}
  const compliance = analysis.compliance || {}
  const ocr = analysis.ocr || {}

  const checks = compliance.checks || []

  const passedChecks = checks.filter(
    (check) => check.status === 'PASS'
  )

  const reviewChecks = checks.filter(
    (check) => check.status === 'REVIEW'
  )

  const failedChecks = checks.filter(
    (check) => check.status === 'FAIL'
  )

  const totalChecks = checks.length

  const overallScore = totalChecks
    ? Math.round((passedChecks.length / totalChecks) * 100)
    : 0

  const detectedDeclarations = passedChecks.map((check, index) => ({
    id: `decl-${index}`,
    name: formatFieldName(check.field),
    statutoryRule: check.rule_id,
    status: 'COMPLIANT',
    extractedValue: check.value,
    confidence: Math.round(ocr.confidence || 0),
    notes: check.message
  }))

  const flaggedDeclarations = [
    ...failedChecks,
    ...reviewChecks
  ].map((check, index) => ({
    id: `flag-${index}`,
    name: formatFieldName(check.field),
    statutoryRule: check.rule_id,
    status: check.status === 'FAIL'
      ? 'FAIL'
      : 'REVIEW REQUIRED',
    severity: check.status === 'FAIL'
      ? 'high'
      : 'medium',
    extractedValue: check.value || 'Not detected',
    confidence: Math.round(ocr.confidence || 0),
    issue: check.message,
    explanation: check.message,
    statutoryReference: check.rule_id,
    recommendation:
      check.status === 'FAIL'
        ? 'Inspector should verify the package declaration.'
        : 'Inspector should verify applicability and physical package details.'
  }))

  const evidenceSnippets = checks.map((check, index) => ({
    id: `ev-${index}`,
    field: formatFieldName(check.field),
    rawOcrText: check.value
      ? `${check.field}: ${check.value}`
      : `No matching declaration detected`,
    targetRule: check.rule_id,
    matchScore: Math.round(ocr.confidence || 0),
    status: check.status,
    context: 'Extracted from uploaded package image'
  }))

  return {
    inspectionId: `INSP-${Date.now()}`,
    timestamp: new Date().toISOString(),

    overallStatus:
      compliance.status === 'PASS'
        ? 'COMPLIANT'
        : compliance.status === 'FAIL'
          ? 'NON-COMPLIANT'
          : 'REVIEW REQUIRED',

    overallScore,

    // Rule engine version from the backend for auditability
    ruleVersion: compliance.rule_version || 'LM-PCR-2011',

    // OCR metadata
    ocrCharacterCount: ocr.character_count || 0,
    ocrWords: Array.isArray(ocr.words) ? ocr.words : [],

    productName:
      product.product_name || 'Product name not detected',

    category:
      'Packaged Commodity',

    targetStandard:
      'Legal Metrology (Packaged Commodities) Rules, 2011',

    confidenceMetrics: {
      ocrExtraction: Math.round(ocr.confidence || 0),
      fieldClassification: Math.round(ocr.confidence || 0),
      ruleEngineDecision: totalChecks
        ? Math.round((passedChecks.length / totalChecks) * 100)
        : 0,
      overall: Math.round(ocr.confidence || 0)
    },

    summary: {
      totalChecked: totalChecks,
      compliantCount: passedChecks.length,
      reviewRequiredCount: reviewChecks.length,
      violationCount: failedChecks.length
    },

    pipelineExplanation: {
      aiRole: {
        title: 'OCR & Text Extraction',
        description:
          'Extracts text from the uploaded package image and provides confidence information for detected text.',
        capabilities: [
          'Optical character recognition',
          'Text tokenization',
          'Character confidence scoring',
          'Text location detection'
        ]
      },

      ruleEngineRole: {
        title: 'Codified Compliance Rule Engine',
        description:
          'Applies deterministic preliminary checks to the declarations extracted from the package label.',
        capabilities: [
          'Mandatory declaration checks',
          'Conditional requirement review',
          'Rule identification',
          'PASS / FAIL / REVIEW classification'
        ]
      }
    },

    detectedDeclarations,

    flaggedDeclarations,

    evidenceSnippets,

    rawOcrTranscript:
      ocr.text || 'No OCR text detected.',

    statutoryNotice: {
      title: 'Inspector Review Required',
      legalAct:
        'Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011',
      text:
        'VERIDEX provides preliminary decision support based on image extraction and codified checks. Final statutory determination remains with the authorized Legal Metrology Inspector.',
      legalBasis:
        'Preliminary screening only'
    }
  }
}


function formatFieldName(field) {
  if (!field) return 'Unknown Declaration'

  return field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
function ScannerPage({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState('upload') // 'upload' | 'analyzing' | 'result' | 'error' | 'notext'
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [currentStage, setCurrentStage] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const [scanError, setScanError] = useState(null)
  const [verification, setVerification] = useState(null)

  // Modal dialog states
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  // Manage preview object URL directly without calling setState inside an effect
  function handleFileSelected(file) {
    setSelectedFile(file)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  function handleClearFile() {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function handleStartAnalysis() {
    if (!selectedFile) return

    setCurrentStep('analyzing')
    setScanError(null)

    const stageSequence = ANALYSIS_STAGES.map((stage, index) => ({
      stageIndex: index,
      progressPercent: Math.round(((index + 1) / ANALYSIS_STAGES.length) * 100),
      stageDetail: stage.detail,
      stageName: stage.label,
    }))

    let stageCursor = 0
    setCurrentStage(stageSequence[0])

    const progressTimer = window.setInterval(() => {
      stageCursor += 1
      if (stageCursor < stageSequence.length) {
        setCurrentStage(stageSequence[stageCursor])
      } else {
        setCurrentStage({
          ...stageSequence[stageSequence.length - 1],
          progressPercent: 100,
          stageDetail: 'Finalizing OCR evidence and rule-check results for inspector review.'
        })
        window.clearInterval(progressTimer)
      }
    }, 450)

    try {
      const response = await analyzeProduct(selectedFile)

      window.clearInterval(progressTimer)
      setCurrentStage({
        ...stageSequence[stageSequence.length - 1],
        progressPercent: 100,
        stageDetail: 'Evidence prepared for the preliminary compliance report.'
      })

      const ocrText = response?.analysis?.ocr?.text || ''
      if (!ocrText || ocrText.trim().length < 3) {
        setCurrentStep('notext')
        return
      }

      const normalizedResult = normalizeBackendResult(response)
      setScanResult(normalizedResult)
      setCurrentStep('result')
    } catch (err) {
      window.clearInterval(progressTimer)
      console.error('Scan analysis error:', err)
      setScanError(
        err?.message || 'An unexpected error occurred. Please check the backend server.'
      )
      setCurrentStep('error')
    }
  }

  function handleResetScan() {
    setSelectedFile(null)
    setScanResult(null)
    setCurrentStage(null)
    setVerification(null)
    setScanError(null)
    setCurrentStep('upload')
  }

  function handleSaveVerification(verifData) {
    setVerification(verifData)
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-veridex-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            {onBackToDashboard ? (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="hover:text-white transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <span>Dashboard</span>
            )}
            <span>/</span>
            <span className="text-veridex-accent-soft font-medium">Scanner</span>
            {currentStep === 'result' && (
              <>
                <span>/</span>
                <span className="text-slate-300">Inspection Result</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Commodity Compliance Scanner
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Automated compliance verification under the Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>

        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 self-start sm:self-center rounded-full border border-veridex-border bg-veridex-surface px-3 py-1 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              currentStep === 'upload'
                ? selectedFile
                  ? 'bg-sky-400 animate-pulse'
                  : 'bg-slate-400'
                : currentStep === 'analyzing'
                ? 'bg-amber-400 animate-ping'
                : 'bg-emerald-400'
            }`}
          />
          <span className="text-slate-300 font-medium capitalize">
            {currentStep === 'upload'
              ? selectedFile
                ? 'Ready for Analysis'
                : 'Awaiting Package Image'
              : currentStep === 'analyzing'
              ? 'Analyzing Package...'
              : 'Screening Complete'}
          </span>
        </div>
      </header>

      {/* Step 1: Upload & Capture Guidance */}
      {currentStep === 'upload' && (
        <div className="space-y-6">
          {/* Action Trigger Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-veridex-border bg-gradient-to-r from-veridex-surface to-veridex-raised p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-veridex-accent-soft">
                Step 1 · Input Target Package
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">
                Upload Package or Label Image
              </h2>
              <p className="mt-1 text-xs text-slate-400 max-w-xl">
                Select a high-resolution photograph of the principal display panel or complete package.
                Supports JPG, JPEG, and PNG up to 10 MB.
              </p>
            </div>

            <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-1.5">
              <PrimaryButton
                onClick={handleStartAnalysis}
                className={`w-full sm:w-auto px-6 ${
                  !selectedFile
                    ? 'opacity-40 cursor-not-allowed hover:bg-veridex-accent'
                    : 'shadow-lg shadow-veridex-accent/20'
                }`}
                disabled={!selectedFile}
              >
                Analyze Product
              </PrimaryButton>
              {!selectedFile && (
                <span className="text-[11px] text-slate-500">
                  Select or drop an image first
                </span>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <ImageUploader
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onFileSelected={handleFileSelected}
            onClearFile={handleClearFile}
          />

          {/* Capture Guidance Section */}
          <CaptureGuidance />
        </div>
      )}

      {/* Step 2: Processing — real backend call in progress */}
      {currentStep === 'analyzing' && (
        <AnalysisProgress currentStage={currentStage} previewUrl={previewUrl} />
      )}

      {/* Error state: backend unavailable or network error */}
      {currentStep === 'error' && (
        <ScanErrorCard message={scanError} onRetry={handleResetScan} />
      )}

      {/* No-text state: OCR found no readable characters */}
      {currentStep === 'notext' && (
        <NoTextResultCard onRetry={handleResetScan} />
      )}

      {/* Step 3: Compliance Result */}
      {currentStep === 'result' && (
        <ComplianceResult
          result={scanResult}
          previewUrl={previewUrl}
          verification={verification}
          onVerifyResult={() => setIsVerifyModalOpen(true)}
          onStartNewScan={handleResetScan}
          onViewEvidence={() => setIsEvidenceModalOpen(true)}
          onGenerateReport={() => setIsReportModalOpen(true)}
        />
      )}

      {/* Modal Dialogs */}
      {isEvidenceModalOpen && (
        <EvidenceModal
          result={scanResult}
          onClose={() => setIsEvidenceModalOpen(false)}
        />
      )}

      {isVerifyModalOpen && (
        <InspectorVerifyModal
          result={scanResult}
          onClose={() => setIsVerifyModalOpen(false)}
          onSaveVerification={handleSaveVerification}
        />
      )}

      {isReportModalOpen && (
        <ReportModal
          result={scanResult}
          verification={verification}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  )
}

export default ScannerPage

import { useState, useEffect } from 'react'
import ImageUploader from '../components/scanner/ImageUploader'
import CaptureGuidance from '../components/scanner/CaptureGuidance'
import AnalysisProgress from '../components/scanner/AnalysisProgress'
import ComplianceResult from '../components/scanner/ComplianceResult'
import EvidenceModal from '../components/scanner/EvidenceModal'
import InspectorVerifyModal from '../components/scanner/InspectorVerifyModal'
import ReportModal from '../components/scanner/ReportModal'
import PrimaryButton from '../components/PrimaryButton'
import { analyzeProductImage } from '../services/scannerService'

function ScannerPage({ onBackToDashboard }) {
  const [currentStep, setCurrentStep] = useState('upload') // 'upload' | 'analyzing' | 'result'
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [currentStage, setCurrentStage] = useState(null)
  const [scanResult, setScanResult] = useState(null)
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
    setCurrentStage(null)

    try {
      const result = await analyzeProductImage(selectedFile, (stageUpdate) => {
        setCurrentStage(stageUpdate)
      })
      setScanResult(result)
      setCurrentStep('result')
    } catch (err) {
      console.error('Scan analysis error:', err)
      setCurrentStep('upload')
    }
  }

  function handleResetScan() {
    setSelectedFile(null)
    setScanResult(null)
    setCurrentStage(null)
    setVerification(null)
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

      {/* Step 2: Processing Simulation State */}
      {currentStep === 'analyzing' && (
        <AnalysisProgress currentStage={currentStage} previewUrl={previewUrl} />
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

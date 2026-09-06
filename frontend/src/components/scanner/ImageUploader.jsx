import { useState, useRef } from 'react'

const MAX_FILE_SIZE_MB = 10
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png']

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Creates a synthetic demo package label image on a canvas
 * so users can test immediately without searching their local drive.
 */
function createSampleImageBlob() {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#181e26'
  ctx.fillRect(0, 0, 800, 600)

  // Decorative border
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 4
  ctx.strokeRect(20, 20, 760, 560)

  // Brand header
  ctx.fillStyle = '#fbbf24'
  ctx.font = 'bold 30px sans-serif'
  ctx.fillText('ROYAL HERITAGE BRAND', 50, 80)

  ctx.fillStyle = '#e2e8f0'
  ctx.font = '22px sans-serif'
  ctx.fillText('PURE KACHI GHANI MUSTARD OIL', 50, 120)

  // Declarations
  ctx.font = '16px sans-serif'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('LEGAL METROLOGY MANDATORY DECLARATIONS (PCR 2011)', 50, 180)

  ctx.fillStyle = '#f8fafc'
  ctx.font = '17px monospace'
  ctx.fillText('1. MFD & PACKED BY: Royal Agro Industries Pvt Ltd, Alwar, Raj - 301030', 50, 230)
  ctx.fillText('2. NET QUANTITY: 1 L (AT 30°C)', 50, 275)
  ctx.fillText('3. MRP: ₹ 195.00 (INCL. OF ALL TAXES)', 50, 320)
  ctx.fillText('4. USP: ₹ 0.195/ml [FLAGGED: SUB-UNIT FORMAT]', 50, 365)
  ctx.fillText('5. MFG DATE: 08/2026 | BATCH: RA-882B', 50, 410)
  ctx.fillText('6. CONSUMER CARE: 1800-419-0909 / care@royalagro.in', 50, 455)
  ctx.fillText('7. COUNTRY OF ORIGIN: MADE IN INDIA [SEAM FOLD]', 50, 500)

  // Regulatory banner
  ctx.fillStyle = '#334155'
  ctx.fillRect(50, 530, 700, 30)
  ctx.fillStyle = '#e2e8f0'
  ctx.font = '13px sans-serif'
  ctx.fillText('SAMPLE COMMODITY PACKAGE LABEL · VERIDEX INSPECTION DATASET', 65, 550)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const sampleFile = new File([blob], 'royal_heritage_mustard_oil_label.png', {
        type: 'image/png',
      })
      resolve(sampleFile)
    }, 'image/png')
  })
}

function ImageUploader({ selectedFile, previewUrl, onFileSelected, onClearFile }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)

  function validateAndSelect(file) {
    setErrorMessage('')

    if (!file) return

    // Type check
    const isExtensionValid = ALLOWED_EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    )
    const isTypeValid = ALLOWED_TYPES.includes(file.type)

    if (!isExtensionValid && !isTypeValid) {
      setErrorMessage(
        `Unsupported file type "${file.name}". Please upload a JPG, JPEG, or PNG image.`
      )
      return
    }

    // Size check
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(
        `File is too large (${formatFileSize(file.size)}). Maximum permissible file size is ${MAX_FILE_SIZE_MB} MB.`
      )
      return
    }

    onFileSelected(file)
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSelect(file)
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      validateAndSelect(file)
    }
  }

  async function handleLoadSample() {
    setErrorMessage('')
    try {
      const sample = await createSampleImageBlob()
      onFileSelected(sample)
    } catch {
      setErrorMessage('Could not generate sample label image.')
    }
  }

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload commodity package image"
      />

      {/* Upload Zone or Preview */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              fileInputRef.current?.click()
            }
          }}
          className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veridex-accent ${
            isDragOver
              ? 'border-veridex-accent bg-veridex-accent/10'
              : 'border-veridex-border bg-veridex-surface hover:border-slate-500 hover:bg-veridex-raised'
          }`}
        >
          {/* Upload icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-veridex-border bg-veridex-raised text-veridex-accent group-hover:scale-105 transition-transform">
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 16.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.5M12 3v12m0-12 4 4m-4-4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-base font-semibold text-white">
            Drag & drop package label image here
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            or <span className="font-medium text-veridex-accent-soft underline underline-offset-4">browse from your computer</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="rounded bg-veridex-bg px-2 py-0.5 border border-veridex-border">
              JPG, JPEG, PNG
            </span>
            <span>•</span>
            <span>Max file size: {MAX_FILE_SIZE_MB} MB</span>
            <span>•</span>
            <span>High resolution recommended</span>
          </div>

          {/* Quick sample button inside dropzone */}
          <div className="mt-6 pt-4 border-t border-veridex-border/60 w-full max-w-sm flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleLoadSample()
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-veridex-border bg-veridex-bg px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-veridex-accent hover:text-white transition-colors"
            >
              <svg className="h-4 w-4 text-veridex-accent" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4v16m-8-8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Use Sample Commodity Label (Quick Demo)
            </button>
          </div>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="rounded-xl border border-veridex-border bg-veridex-surface p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-veridex-border pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Image Selected Ready for Analysis
              </span>
              <h3 className="mt-1 text-base font-semibold text-white truncate max-w-md">
                {selectedFile.name}
              </h3>
              <p className="text-xs text-slate-400">
                Size: <span className="font-mono text-slate-300">{formatFileSize(selectedFile.size)}</span> · Format:{' '}
                <span className="uppercase text-slate-300">{selectedFile.type.split('/')[1] || 'IMAGE'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-veridex-border bg-veridex-raised px-3 py-2 text-xs font-medium text-slate-200 hover:border-slate-400 hover:text-white transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8-4-4m0 0L8 8m4-4v12" />
                </svg>
                Change Image
              </button>
              <button
                type="button"
                onClick={onClearFile}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20 transition-colors"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>

          {/* Image Display */}
          <div className="mt-4 relative overflow-hidden rounded-lg border border-veridex-border bg-veridex-bg max-h-[380px] flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected package label preview"
                className="max-h-[360px] w-auto max-w-full object-contain p-2 rounded"
              />
            ) : (
              <div className="py-16 text-center text-xs text-slate-500">Preview loading...</div>
            )}
            <div className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-1 text-[10px] font-mono text-slate-300 backdrop-blur-sm">
              Inspection Target
            </div>
          </div>
        </div>
      )}

      {/* Friendly Error Banner */}
      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200"
        >
          <svg className="h-5 w-5 shrink-0 text-red-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-red-300">Invalid File Selection</p>
            <p className="mt-0.5 text-xs text-red-200/90">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-red-400 hover:text-red-200 text-xs font-semibold p-1"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ImageUploader

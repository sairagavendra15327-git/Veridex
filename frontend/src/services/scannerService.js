/**
 * Scanner Service for Veridex.
 * Handles the compliance analysis pipeline.
 *
 * Currently simulates the multi-stage OCR & Legal Metrology rule check pipeline.
 * In production, `analyzeProductImage` can be updated to call the FastAPI backend:
 * e.g., const response = await fetch('/api/v1/scan', { method: 'POST', body: formData });
 */

import { MOCK_SCAN_RESULT } from '../data/mockScannerData'

export const ANALYSIS_STAGES = [
  {
    id: 'quality_check',
    label: 'Image Quality Check',
    detail: 'Checking resolution, DPI, contrast, glare, and skew angles...',
    durationMs: 650,
  },
  {
    id: 'ocr_extraction',
    label: 'OCR & Text Extraction',
    detail: 'Detecting text bounding polygons, segmenting lines, and transcribing characters...',
    durationMs: 750,
  },
  {
    id: 'field_identification',
    label: 'Field Identification',
    detail: 'Identifying mandatory Legal Metrology fields (MRP, Net Qty, Mfg Date, Address)...',
    durationMs: 650,
  },
  {
    id: 'rule_compliance',
    label: 'Compliance Rule Check',
    detail: 'Evaluating codified PCR 2011 statutory rules (Rule 6, 9, 12, Unit Sale Price)...',
    durationMs: 700,
  },
  {
    id: 'evidence_prep',
    label: 'Evidence Preparation',
    detail: 'Compiling audit trail, confidence metrics, and inspector decision matrix...',
    durationMs: 550,
  },
]

/**
 * Simulates the backend analysis pipeline with progress updates.
 *
 * @param {File|Blob|string} imageFile - The image uploaded by the inspector
 * @param {Function} onStageUpdate - Callback invoked as stages transition
 * @returns {Promise<typeof MOCK_SCAN_RESULT>} Result object
 */
export async function analyzeProductImage(imageFile, onStageUpdate) {
  // If a real backend URL is configured in the future, connect here:
  // if (import.meta.env.VITE_API_URL) {
  //   const formData = new FormData()
  //   formData.append('file', imageFile)
  //   const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/scan`, { method: 'POST', body: formData })
  //   return await res.json()
  // }

  let currentStageIndex = 0

  for (const stage of ANALYSIS_STAGES) {
    if (onStageUpdate) {
      onStageUpdate({
        stageIndex: currentStageIndex,
        stageId: stage.id,
        stageLabel: stage.label,
        stageDetail: stage.detail,
        progressPercent: Math.round(((currentStageIndex + 1) / ANALYSIS_STAGES.length) * 100),
      })
    }

    await new Promise((resolve) => setTimeout(resolve, stage.durationMs))
    currentStageIndex++
  }

  // Derive result, updating timestamp and optionally file name if available
  const result = {
    ...MOCK_SCAN_RESULT,
    timestamp: new Date().toISOString(),
    scannedFileName: imageFile?.name || 'label_sample.jpg',
  }

  return result
}

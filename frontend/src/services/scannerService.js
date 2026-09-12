export const ANALYSIS_STAGES = [
  {
    id: 'quality',
    label: 'Image Quality Check',
    detail: 'Verifying image is readable and suitable for OCR processing.'
  },
  {
    id: 'ocr',
    label: 'OCR Text Extraction',
    detail: 'Tesseract 5 extracting word-level text and confidence scores from the label image.'
  },
  {
    id: 'extraction',
    label: 'Declaration Field Extraction',
    detail: 'Regex-based parser identifying mandatory PCR declaration fields from OCR output.'
  },
  {
    id: 'rules',
    label: 'Rule Engine Check (PCR 2011)',
    detail: 'Deterministic checks: manufacturer, net quantity, MRP, manufacture date, consumer care.'
  },
  {
    id: 'evidence',
    label: 'Evidence Preparation',
    detail: 'Assembling OCR bounding-box data and check results into the compliance evidence record.'
  }
]


const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'


export async function analyzeProduct(file) {
  const formData = new FormData()

  formData.append('file', file)

  const response = await fetch(
    `${API_URL}/api/v1/analyze`,
    {
      method: 'POST',
      body: formData
    }
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Analysis failed (${response.status}): ${errorText}`
    )
  }

  return await response.json()
}
/**
 * Mock data for the Veridex Scanner flow.
 * Complies with SIH 2026 Problem Statement SIH26034:
 * Automated Compliance Verification under Legal Metrology (Packaged Commodities) Rules, 2011.
 *
 * This structured mock will be replaced by FastAPI backend responses later.
 */

export const MOCK_SCAN_RESULT = {
  inspectionId: 'INSP-2026-PCR-0884',
  timestamp: new Date().toISOString(),
  overallStatus: 'REVIEW REQUIRED',
  overallScore: 78,
  productName: 'Royal Heritage Pure Mustard Oil 1 L',
  category: 'Packaged Commodities / Edible Oil (Schedule II, Item 14)',
  targetStandard: 'Legal Metrology (Packaged Commodities) Rules, 2011 (as amended)',
  
  // Confidence breakdown distinguishing OCR extraction vs Rule engine reasoning
  confidenceMetrics: {
    ocrExtraction: 94.2,
    fieldClassification: 89.0,
    ruleEngineDecision: 76.5,
    overall: 86.6,
  },

  // Key stats summary
  summary: {
    totalChecked: 7,
    compliantCount: 5,
    reviewRequiredCount: 2,
    violationCount: 0,
  },

  // Clarifying AI extraction vs Rule engine
  pipelineExplanation: {
    aiRole: {
      title: 'AI Vision & OCR Extraction',
      description:
        'Detects label boundaries, parses optical character tokens, normalizes skewed orientation, and predicts candidate field types based on spatial context.',
      capabilities: ['Bounding polygon detection', 'Text tokenization', 'Entity recognition (NER)', 'Character confidence scoring'],
    },
    ruleEngineRole: {
      title: 'Codified Statutory Rule Engine',
      description:
        'Strictly applies codified requirements of the Legal Metrology (Packaged Commodities) Rules, 2011 (e.g. font size minimums, unit of measurement symbols, USP ratios).',
      capabilities: ['Rule 6 mandatory declarations', 'Rule 9 font height matrices', 'Rule 12 standard units (kg/g/L/ml)', 'Rule 6(11) Unit Sale Price calculation'],
    },
  },

  // Detected & compliant mandatory declarations
  detectedDeclarations: [
    {
      id: 'decl-mfg',
      name: 'Name & Address of Manufacturer / Packer',
      statutoryRule: 'Rule 6(1)(a)',
      status: 'COMPLIANT',
      extractedValue: 'M/s Royal Agro Industries Pvt. Ltd., Plot No. 42, Sector 8, Industrial Area, Alwar, Rajasthan - 301030',
      confidence: 96.5,
      notes: 'Complete postal address with PIN code and registered entity name clearly stated.',
    },
    {
      id: 'decl-qty',
      name: 'Net Quantity Declaration',
      statutoryRule: 'Rule 6(1)(b) & Rule 12',
      status: 'COMPLIANT',
      extractedValue: '1 L (Net Volume at 30°C)',
      confidence: 98.2,
      notes: 'Capital "L" symbol used in accordance with the amended First Schedule. Temperature condition specified for edible oil.',
    },
    {
      id: 'decl-mrp',
      name: 'Maximum Retail Price (MRP)',
      statutoryRule: 'Rule 6(1)(e)',
      status: 'COMPLIANT',
      extractedValue: '₹ 195.00 (Incl. of all taxes)',
      confidence: 95.8,
      notes: 'Inclusive of all taxes phrase explicitly printed in compliance with mandatory wording.',
    },
    {
      id: 'decl-mfgdate',
      name: 'Month & Year of Manufacture / Packing',
      statutoryRule: 'Rule 6(1)(d)',
      status: 'COMPLIANT',
      extractedValue: 'Mfg: 08/2026 · Batch No: RA-882B',
      confidence: 92.1,
      notes: 'Clear numerical month and year representation accompanied by verifiable batch identifier.',
    },
    {
      id: 'decl-consumer',
      name: 'Consumer Care Details',
      statutoryRule: 'Rule 6(1)(g)',
      status: 'COMPLIANT',
      extractedValue: 'Toll-Free: 1800-419-0909 | Email: care@royalagro.in | Customer Grievance Officer: Address as above',
      confidence: 91.4,
      notes: 'Telephone number, email address, and officer designation all identified on principal display panel.',
    },
  ],

  // Missing or potentially non-compliant declarations requiring inspector attention
  flaggedDeclarations: [
    {
      id: 'decl-usp',
      name: 'Unit Sale Price (USP) Declaration',
      statutoryRule: 'Rule 6(11) PCR (Amendment Rules, 2021)',
      status: 'REVIEW REQUIRED',
      severity: 'high',
      extractedValue: '₹ 0.195 per ml (Printed in 1.1 mm subscript)',
      confidence: 74.0,
      issue: 'Ambiguous font size ratio & format',
      explanation:
        'Under Rule 6(11), for packages containing > 1 L or 1 kg, Unit Sale Price must be declared per 100 ml or per 1 L, rather than fractional per ml. Furthermore, the font height does not appear to meet the minimum proportion relative to the principal MRP declaration.',
      statutoryReference: 'Legal Metrology (Packaged Commodities) Amendment Rules, 2021, Rule 6 sub-rule (11).',
      recommendation: 'Inspector must measure physical font height using precision optical gauge and verify unit denominator.',
    },
    {
      id: 'decl-origin',
      name: 'Country of Origin / Place of Origin',
      statutoryRule: 'Rule 6(10) & Rule 9 Table I',
      status: 'REVIEW REQUIRED',
      severity: 'medium',
      extractedValue: '"Made in India" printed along bottom fold margin',
      confidence: 78.5,
      issue: 'Sub-optimal contrast and marginal positioning',
      explanation:
        'The country of origin text is situated on the crimped bottom seam with low tonal contrast against the amber plastic substrate. Rule 9 mandates that all declarations on the principal display panel must be prominent, legible, and conspicuous.',
      statutoryReference: 'Rule 9(1) of the Legal Metrology (Packaged Commodities) Rules, 2011.',
      recommendation: 'Verify whether crimping obscuration is present on shelf stock or unique to this sample photograph.',
    },
  ],

  // Evidence snippets with raw extracted OCR text segments
  evidenceSnippets: [
    {
      id: 'ev-1',
      field: 'Net Quantity',
      rawOcrText: 'NET QTY: 1 L (at 30 C) [CONF: 0.982]',
      targetRule: 'Rule 6(1)(b) & Rule 12',
      matchScore: 98,
      status: 'PASS',
      context: 'Principal Display Panel · Bottom Right Quadrant',
    },
    {
      id: 'ev-2',
      field: 'Unit Sale Price (USP)',
      rawOcrText: 'USP: Rs 0.195/ml (subscript h=1.1mm) [CONF: 0.740]',
      targetRule: 'Rule 6(11) PCR Amendment',
      matchScore: 74,
      status: 'REVIEW',
      context: 'Immediately adjacent to MRP · Font size disparity flagged',
    },
    {
      id: 'ev-3',
      field: 'Country of Origin',
      rawOcrText: 'MADE IN INDIA (seam fold) [CONF: 0.785]',
      targetRule: 'Rule 6(10) & Rule 9(1)',
      matchScore: 79,
      status: 'REVIEW',
      context: 'Bottom crimp edge · Marginal legibility index 0.62',
    },
    {
      id: 'ev-4',
      field: 'MRP Declaration',
      rawOcrText: 'MRP Rs. 195.00 INCL. OF ALL TAXES [CONF: 0.958]',
      targetRule: 'Rule 6(1)(e)',
      matchScore: 96,
      status: 'PASS',
      context: 'Principal Display Panel · Top Header Box',
    },
    {
      id: 'ev-5',
      field: 'Consumer Grievance',
      rawOcrText: 'FEEDBACK/QUERIES: TOLL FREE 1800-419-0909 care@royalagro.in [CONF: 0.914]',
      targetRule: 'Rule 6(1)(g)',
      matchScore: 91,
      status: 'PASS',
      context: 'Reverse label · Dedicated Consumer Care Panel',
    },
  ],

  // Raw OCR transcript representation for evidence drawer
  rawOcrTranscript: `--- VERIDEX OPTICAL CHARACTER RECOGNITION (OCR) STREAM ---
[HEADER] ROYAL HERITAGE BRAND PURE MUSTARD OIL
[LINE 01] KACHI GHANI COLD PRESSED MUSTARD OIL
[LINE 02] NET QUANTITY: 1 L (AT 30°C)
[LINE 03] MFD. & PACKED BY: M/S ROYAL AGRO INDUSTRIES PVT. LTD.
[LINE 04] PLOT NO. 42, SECTOR 8, INDUSTRIAL AREA, ALWAR, RAJASTHAN - 301030
[LINE 05] LIC. NO. 10018013000001
[LINE 06] BATCH NO: RA-882B
[LINE 07] MFG DATE: 08/2026 | BEST BEFORE 9 MONTHS FROM MANUFACTURE
[LINE 08] MRP ₹ 195.00 (INCL. OF ALL TAXES)
[LINE 09] USP ₹ 0.195/ml
[LINE 10] FOR CONSUMER FEEDBACK / COMPLAINTS CONTACT MANAGER AT ABOVE ADDRESS
[LINE 11] TEL: 1800-419-0909 | EMAIL: care@royalagro.in
[LINE 12] MADE IN INDIA (CRIMP SEAM)
--- END OF STREAM (12 TOKENS PARSED, 0 OCR ERRORS DETECTED) ---`,

  // Statutory Inspector Advisory Note
  statutoryNotice: {
    title: 'Statutory Inspector Notice',
    legalAct: 'Legal Metrology Act, 2009 & Packaged Commodities Rules, 2011',
    text: 'VERIDEX is an AI-assisted decision-support system designed to accelerate preliminary field screening. Under Sections 15 and 18 of the Legal Metrology Act, 2009, final statutory determination, physical measurement of font heights, sample seizure, and issuance of show-cause notices are strictly the prerogative of the authorized Legal Metrology Inspector.',
  },
}

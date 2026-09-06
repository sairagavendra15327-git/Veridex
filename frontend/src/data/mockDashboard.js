/**
 * Mock dashboard data for UI development.
 * Replace this module with API responses later; keep the same field names
 * so dashboard components do not need a redesign.
 *
 * These values are placeholders and are not live inspection statistics.
 */

export const MOCK_DATA_SOURCE = 'mock'

export const dashboardStats = [
  {
    id: 'products-scanned',
    label: 'Products Scanned',
    value: 128,
    detail: 'Placeholder count',
  },
  {
    id: 'compliant',
    label: 'Compliant',
    value: 91,
    detail: 'Placeholder count',
    tone: 'pass',
  },
  {
    id: 'violations',
    label: 'Violations',
    value: 22,
    detail: 'Placeholder count',
    tone: 'fail',
  },
  {
    id: 'review-required',
    label: 'Review Required',
    value: 15,
    detail: 'Placeholder count',
    tone: 'review',
  },
]

export const recentInspections = [
  {
    id: 'insp-001',
    productName: 'Sunrise Whole Wheat Atta 5 kg',
    inspectedAt: '2026-09-06T09:14:00',
    status: 'PASS',
    score: 96,
  },
  {
    id: 'insp-002',
    productName: 'Nectar Refined Sunflower Oil 1 L',
    inspectedAt: '2026-09-05T16:42:00',
    status: 'FAIL',
    score: 54,
  },
  {
    id: 'insp-003',
    productName: 'Hilltop Packaged Drinking Water 1 L',
    inspectedAt: '2026-09-05T11:08:00',
    status: 'REVIEW',
    score: 71,
  },
  {
    id: 'insp-004',
    productName: 'Harvest Gold Instant Coffee 200 g',
    inspectedAt: '2026-09-04T18:25:00',
    status: 'PASS',
    score: 89,
  },
  {
    id: 'insp-005',
    productName: 'Metro Care Detergent Powder 1 kg',
    inspectedAt: '2026-09-04T10:03:00',
    status: 'FAIL',
    score: 41,
  },
]

export const workflowSteps = [
  { id: 'scan', label: 'SCAN' },
  { id: 'extract', label: 'EXTRACT' },
  { id: 'check', label: 'CHECK' },
  { id: 'explain', label: 'EXPLAIN' },
  { id: 'verify', label: 'VERIFY' },
]

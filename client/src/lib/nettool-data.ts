import type {
  DisclosureNote,
  DisclosureSchedule,
  NarrativeBlock,
  DisclosureTemplate,
  DisclosureReview,
  DisclosurePeriod,
  DisclosureDashboardKPIs,
  ScheduleColumn,
  ScheduleRow,
  ScheduleTextBlock,
  StatementLineItem,
  ScheduleLayoutType,
  TBFootnote,
} from "@shared/schema";

// Sample Periods
export const samplePeriods: DisclosurePeriod[] = [
  {
    periodId: "FY2024",
    periodLabel: "FY 2024",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    state: "DRAFT",
    version: 1,
    isRestatement: false,
    lockedAt: null,
  },
  {
    periodId: "FY2023",
    periodLabel: "FY 2023",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    state: "FINAL",
    version: 1,
    isRestatement: false,
    lockedAt: "2024-02-15T00:00:00Z",
  },
];

// Sample Statement Line Items
export const sampleStatementLines: StatementLineItem[] = [
  { lineId: "bs-ppe", statementType: "BALANCE_SHEET", lineLabel: "Property, Plant & Equipment", lineNumber: "10", amount: 5250000, period: "FY2024" },
  { lineId: "bs-intangibles", statementType: "BALANCE_SHEET", lineLabel: "Intangible Assets", lineNumber: "11", amount: 1800000, period: "FY2024" },
  { lineId: "bs-leases", statementType: "BALANCE_SHEET", lineLabel: "Right-of-Use Assets", lineNumber: "12", amount: 2100000, period: "FY2024" },
  { lineId: "bs-inventory", statementType: "BALANCE_SHEET", lineLabel: "Inventory", lineNumber: "6", amount: 890000, period: "FY2024" },
  { lineId: "is-revenue", statementType: "INCOME_STATEMENT", lineLabel: "Revenue", lineNumber: "1", amount: 12500000, period: "FY2024" },
  { lineId: "is-depreciation", statementType: "INCOME_STATEMENT", lineLabel: "Depreciation & Amortization", lineNumber: "8", amount: 875000, period: "FY2024" },
];

// Sample Templates
export const sampleTemplates: DisclosureTemplate[] = [
  {
    templateId: "tmpl-rollforward-standard",
    templateName: "Rollforward - Opening to Closing",
    layoutType: "ROLLFORWARD",
    defaultColumns: [
      { label: "Opening Balance", role: "SYSTEM", widthPx: 120, orderIndex: 0, hidden: false, locked: true },
      { label: "Additions", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { label: "Disposals", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { label: "Depreciation", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { label: "FX Adjustment", role: "USER", widthPx: 100, orderIndex: 4, hidden: false, locked: false },
      { label: "Closing Balance", role: "SYSTEM", widthPx: 120, orderIndex: 5, hidden: false, locked: true, formula: "SUM(col0:col4)" },
    ],
    defaultRows: [],
    defaultTextBlocks: [],
    hiddenColumns: [],
    framework: "BOTH",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    templateId: "tmpl-rollforward-adj",
    templateName: "Rollforward - Adjustment Split",
    layoutType: "ROLLFORWARD",
    defaultColumns: [
      { label: "Opening Balance", role: "SYSTEM", widthPx: 120, orderIndex: 0, hidden: false, locked: true },
      { label: "Additions", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { label: "Disposals", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { label: "Impairment", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { label: "Revaluation", role: "USER", widthPx: 100, orderIndex: 4, hidden: false, locked: false },
      { label: "Depreciation", role: "USER", widthPx: 100, orderIndex: 5, hidden: false, locked: false },
      { label: "FX Adjustment", role: "USER", widthPx: 100, orderIndex: 6, hidden: false, locked: false },
      { label: "Closing Balance", role: "SYSTEM", widthPx: 120, orderIndex: 7, hidden: false, locked: true, formula: "SUM(col0:col6)" },
    ],
    defaultRows: [],
    defaultTextBlocks: [],
    hiddenColumns: [],
    framework: "IFRS",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    templateId: "tmpl-gross-to-net",
    templateName: "Gross to Net",
    layoutType: "GROSS_TO_NET",
    defaultColumns: [
      { label: "Gross Amount", role: "SYSTEM", widthPx: 120, orderIndex: 0, hidden: false, locked: true },
      { label: "Allowance", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { label: "Net Amount", role: "SYSTEM", widthPx: 120, orderIndex: 2, hidden: false, locked: true, formula: "col0-col1" },
    ],
    defaultRows: [],
    defaultTextBlocks: [],
    hiddenColumns: [],
    framework: "BOTH",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    templateId: "tmpl-maturity",
    templateName: "Maturity Buckets",
    layoutType: "TIMING_MATURITY",
    defaultColumns: [
      { label: "< 1 Year", role: "USER", widthPx: 100, orderIndex: 0, hidden: false, locked: false },
      { label: "1-2 Years", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { label: "2-5 Years", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { label: "> 5 Years", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { label: "Total", role: "SYSTEM", widthPx: 120, orderIndex: 4, hidden: false, locked: true, formula: "SUM(col0:col3)" },
    ],
    defaultRows: [],
    defaultTextBlocks: [],
    hiddenColumns: [],
    framework: "BOTH",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    templateId: "tmpl-composition",
    templateName: "Composition / Breakdown",
    layoutType: "COMPOSITION",
    defaultColumns: [
      { label: "Current Year", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { label: "Prior Year", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    defaultRows: [],
    defaultTextBlocks: [],
    hiddenColumns: [],
    framework: "BOTH",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    templateId: "tmpl-reconciliation",
    templateName: "Reconciliation",
    layoutType: "RECONCILIATION",
    defaultColumns: [
      { label: "Per Books", role: "SYSTEM", widthPx: 120, orderIndex: 0, hidden: false, locked: true },
      { label: "Adjustment", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { label: "As Restated", role: "SYSTEM", widthPx: 120, orderIndex: 2, hidden: false, locked: true, formula: "col0+col1" },
    ],
    defaultRows: [],
    defaultTextBlocks: [],
    hiddenColumns: [],
    framework: "US_GAAP",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    templateId: "tmpl-movement-by-category",
    templateName: "Movement by Category",
    layoutType: "MOVEMENT_BY_CATEGORY",
    defaultColumns: [
      { label: "Category", role: "SYSTEM", widthPx: 150, orderIndex: 0, hidden: false, locked: true },
      { label: "Opening", role: "SYSTEM", widthPx: 110, orderIndex: 1, hidden: false, locked: true },
      { label: "Additions", role: "USER", widthPx: 110, orderIndex: 2, hidden: false, locked: false },
      { label: "Disposals", role: "USER", widthPx: 110, orderIndex: 3, hidden: false, locked: false },
      { label: "Transfers", role: "USER", widthPx: 110, orderIndex: 4, hidden: false, locked: false },
      { label: "Closing", role: "SYSTEM", widthPx: 110, orderIndex: 5, hidden: false, locked: true, formula: "col1+col2-col3+col4" },
    ],
    defaultRows: [],
    defaultTextBlocks: [],
    hiddenColumns: [],
    framework: "BOTH",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// Helper to create a schedule with default columns for a layout type
function createDefaultColumns(layoutType: ScheduleLayoutType): ScheduleColumn[] {
  const template = sampleTemplates.find(t => t.layoutType === layoutType);
  if (!template) return [];
  return template.defaultColumns.map((col, idx) => ({
    ...col,
    columnId: `col-${idx}`,
  }));
}

// Sample Disclosure Schedules
export const sampleSchedules: DisclosureSchedule[] = [
  {
    scheduleId: "sch-ppe-rollforward",
    noteId: "note-ppe",
    scheduleTitle: "Property, Plant & Equipment Rollforward",
    layoutType: "ROLLFORWARD",
    columns: [
      { columnId: "col-0", label: "Opening Balance", role: "SYSTEM", widthPx: 120, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Additions", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "Disposals", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "Depreciation", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: "FX Adjustment", role: "USER", widthPx: 100, orderIndex: 4, hidden: false, locked: false },
      { columnId: "col-5", label: "Closing Balance", role: "SYSTEM", widthPx: 120, orderIndex: 5, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-land", label: "Land", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-buildings", label: "Buildings", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-machinery", label: "Machinery & Equipment", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-vehicles", label: "Vehicles", role: "DATA", heightPx: 32, orderIndex: 3, hidden: false, locked: false },
      { rowId: "row-ff", label: "Furniture & Fixtures", role: "DATA", heightPx: 32, orderIndex: 4, hidden: false, locked: false },
      { rowId: "row-total", label: "Total", role: "TOTAL", heightPx: 36, orderIndex: 5, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-land": { "col-0": 1200000, "col-1": 0, "col-2": 0, "col-3": 0, "col-4": 0, "col-5": 1200000 },
      "row-buildings": { "col-0": 2500000, "col-1": 350000, "col-2": 0, "col-3": -125000, "col-4": 0, "col-5": 2725000 },
      "row-machinery": { "col-0": 800000, "col-1": 120000, "col-2": -50000, "col-3": -95000, "col-4": 0, "col-5": 775000 },
      "row-vehicles": { "col-0": 250000, "col-1": 75000, "col-2": -25000, "col-3": -45000, "col-4": 0, "col-5": 255000 },
      "row-ff": { "col-0": 180000, "col-1": 45000, "col-2": -10000, "col-3": -22000, "col-4": 0, "col-5": 193000 },
      "row-total": { "col-0": 4930000, "col-1": 590000, "col-2": -85000, "col-3": -287000, "col-4": 0, "col-5": 5148000 },
    },
    templateId: "tmpl-rollforward-standard",
    supportAttachments: [],
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2024-12-01T14:30:00Z",
  },
  {
    scheduleId: "sch-intangibles-rollforward",
    noteId: "note-intangibles",
    scheduleTitle: "Intangible Assets Rollforward",
    layoutType: "ROLLFORWARD",
    columns: createDefaultColumns("ROLLFORWARD"),
    rows: [
      { rowId: "row-software", label: "Software", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-patents", label: "Patents", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-licenses", label: "Licenses", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-goodwill", label: "Goodwill", role: "DATA", heightPx: 32, orderIndex: 3, hidden: false, locked: false },
      { rowId: "row-total", label: "Total", role: "TOTAL", heightPx: 36, orderIndex: 4, hidden: false, locked: true },
    ],
    textBlocks: [
      { textBlockId: "tb-1", position: 0, span: "FULL_WIDTH", content: "DEFINITE LIFE INTANGIBLES", style: "SECTION_HEADER" },
    ],
    cellValues: {
      "row-software": { "col-0": 450000, "col-1": 125000, "col-2": 0, "col-3": -75000, "col-4": 0, "col-5": 500000 },
      "row-patents": { "col-0": 320000, "col-1": 0, "col-2": 0, "col-3": -32000, "col-4": 0, "col-5": 288000 },
      "row-licenses": { "col-0": 180000, "col-1": 50000, "col-2": 0, "col-3": -18000, "col-4": 0, "col-5": 212000 },
      "row-goodwill": { "col-0": 800000, "col-1": 0, "col-2": 0, "col-3": 0, "col-4": 0, "col-5": 800000 },
      "row-total": { "col-0": 1750000, "col-1": 175000, "col-2": 0, "col-3": -125000, "col-4": 0, "col-5": 1800000 },
    },
    templateId: "tmpl-rollforward-standard",
    supportAttachments: [],
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-12-01T14:45:00Z",
  },
  {
    scheduleId: "sch-lease-maturity",
    noteId: "note-leases",
    scheduleTitle: "Lease Liabilities Maturity Analysis",
    layoutType: "TIMING_MATURITY",
    columns: [
      { columnId: "col-0", label: "< 1 Year", role: "USER", widthPx: 100, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "1-2 Years", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "2-5 Years", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "> 5 Years", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: "Total", role: "SYSTEM", widthPx: 120, orderIndex: 4, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-office", label: "Office Leases", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-equipment", label: "Equipment Leases", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-vehicles", label: "Vehicle Leases", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total Lease Liabilities", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-office": { "col-0": 420000, "col-1": 420000, "col-2": 980000, "col-3": 580000, "col-4": 2400000 },
      "row-equipment": { "col-0": 85000, "col-1": 85000, "col-2": 130000, "col-3": 0, "col-4": 300000 },
      "row-vehicles": { "col-0": 45000, "col-1": 45000, "col-2": 60000, "col-3": 0, "col-4": 150000 },
      "row-total": { "col-0": 550000, "col-1": 550000, "col-2": 1170000, "col-3": 580000, "col-4": 2850000 },
    },
    templateId: "tmpl-maturity",
    supportAttachments: [],
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: "2024-12-01T15:00:00Z",
  },
  {
    scheduleId: "sch-inventory-composition",
    noteId: "note-inventory",
    scheduleTitle: "Inventory Composition",
    layoutType: "COMPOSITION",
    columns: [
      { columnId: "col-0", label: "2024", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "2023", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    rows: [
      { rowId: "row-raw", label: "Raw Materials", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-wip", label: "Work in Progress", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-finished", label: "Finished Goods", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total Inventory", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-raw": { "col-0": 245000, "col-1": 220000 },
      "row-wip": { "col-0": 180000, "col-1": 165000 },
      "row-finished": { "col-0": 465000, "col-1": 430000 },
      "row-total": { "col-0": 890000, "col-1": 815000 },
    },
    templateId: "tmpl-composition",
    supportAttachments: [],
    createdAt: "2024-07-15T11:00:00Z",
    updatedAt: "2024-12-01T15:15:00Z",
  },
  {
    scheduleId: "sch-revenue-breakdown",
    noteId: "note-revenue",
    scheduleTitle: "Revenue Disaggregation",
    layoutType: "COMPOSITION",
    columns: [
      { columnId: "col-0", label: "2024", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "2023", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    rows: [
      { rowId: "row-product", label: "Product Sales", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-services", label: "Service Revenue", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-licensing", label: "Licensing", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total Revenue", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [
      { textBlockId: "tb-rev-1", position: 0, span: "FULL_WIDTH", content: "BY TYPE", style: "SECTION_HEADER" },
    ],
    cellValues: {
      "row-product": { "col-0": 8500000, "col-1": 7800000 },
      "row-services": { "col-0": 3200000, "col-1": 2900000 },
      "row-licensing": { "col-0": 800000, "col-1": 650000 },
      "row-total": { "col-0": 12500000, "col-1": 11350000 },
    },
    templateId: "tmpl-composition",
    supportAttachments: [],
    createdAt: "2024-08-01T08:00:00Z",
    updatedAt: "2024-12-01T15:30:00Z",
  },
  {
    scheduleId: "sch-intangibles-movement",
    noteId: "note-intangibles",
    scheduleTitle: "Intangible Assets Movement",
    layoutType: "MOVEMENT_BY_CATEGORY",
    columns: [
      { columnId: "col-0", label: "Category", role: "SYSTEM", widthPx: 150, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Opening", role: "SYSTEM", widthPx: 110, orderIndex: 1, hidden: false, locked: true },
      { columnId: "col-2", label: "Additions", role: "USER", widthPx: 110, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "Disposals", role: "USER", widthPx: 110, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: "Transfers", role: "USER", widthPx: 110, orderIndex: 4, hidden: false, locked: false },
      { columnId: "col-5", label: "Closing", role: "SYSTEM", widthPx: 110, orderIndex: 5, hidden: false, locked: true, formula: "col1+col2-col3+col4" },
    ],
    rows: [
      { rowId: "row-software", label: "Software", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-patents", label: "Patents", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-trademarks", label: "Trademarks", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-software": { "col-0": "Software", "col-1": 1200000, "col-2": 350000, "col-3": 50000, "col-4": 0, "col-5": 1500000 },
      "row-patents": { "col-0": "Patents", "col-1": 800000, "col-2": 200000, "col-3": 0, "col-4": 0, "col-5": 1000000 },
      "row-trademarks": { "col-0": "Trademarks", "col-1": 400000, "col-2": 50000, "col-3": 25000, "col-4": 0, "col-5": 425000 },
      "row-total": { "col-0": "Total", "col-1": 2400000, "col-2": 600000, "col-3": 75000, "col-4": 0, "col-5": 2925000 },
    },
    templateId: "tmpl-movement-by-category",
    supportAttachments: [],
    createdAt: "2024-07-01T10:00:00Z",
    updatedAt: "2024-12-01T16:00:00Z",
  },
];

// Sample Disclosure Notes
export const sampleNotes: DisclosureNote[] = [
  {
    noteId: "note-ppe",
    noteNumber: "10",
    noteTitle: "Property, Plant & Equipment",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-ppe"],
    scheduleIds: ["sch-ppe-rollforward"],
    narrativeBlockIds: ["narr-ppe-1"],
    status: "UNDER_REVIEW",
    owner: "John Smith",
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2024-12-01T14:30:00Z",
  },
  {
    noteId: "note-intangibles",
    noteNumber: "11",
    noteTitle: "Intangible Assets",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-intangibles"],
    scheduleIds: ["sch-intangibles-rollforward", "sch-intangibles-movement"],
    narrativeBlockIds: ["narr-intangibles-1"],
    status: "DRAFT",
    owner: "Sarah Johnson",
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-12-01T14:45:00Z",
  },
  {
    noteId: "note-leases",
    noteNumber: "12",
    noteTitle: "Leases",
    periodId: "FY2024",
    framework: "IFRS",
    linkedStatementLines: ["bs-leases"],
    scheduleIds: ["sch-lease-maturity"],
    narrativeBlockIds: ["narr-leases-1"],
    status: "APPROVED",
    owner: "Michael Chen",
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: "2024-12-01T15:00:00Z",
  },
  {
    noteId: "note-inventory",
    noteNumber: "6",
    noteTitle: "Inventory",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-inventory"],
    scheduleIds: ["sch-inventory-composition"],
    narrativeBlockIds: [],
    status: "DRAFT",
    owner: "Emily Davis",
    createdAt: "2024-07-15T11:00:00Z",
    updatedAt: "2024-12-01T15:15:00Z",
  },
  {
    noteId: "note-revenue",
    noteNumber: "3",
    noteTitle: "Revenue",
    periodId: "FY2024",
    framework: "US_GAAP",
    linkedStatementLines: ["is-revenue"],
    scheduleIds: ["sch-revenue-breakdown"],
    narrativeBlockIds: ["narr-revenue-1"],
    status: "PUBLISHED",
    owner: "David Wilson",
    createdAt: "2024-08-01T08:00:00Z",
    updatedAt: "2024-12-01T15:30:00Z",
  },
];

// Sample Narrative Blocks
export const sampleNarratives: NarrativeBlock[] = [
  {
    narrativeId: "narr-ppe-1",
    noteId: "note-ppe",
    linkedScheduleIds: ["sch-ppe-rollforward"],
    linkedMovements: ["row-buildings.col-1"],
    content: "During the year, the Company acquired additional office space in the downtown location, resulting in building additions of $350,000. Depreciation expense for the year was $287,000, recognized on a straight-line basis over the estimated useful lives of the assets.",
    owner: "John Smith",
    status: "UNDER_REVIEW",
    createdAt: "2024-09-01T10:00:00Z",
    updatedAt: "2024-12-01T14:30:00Z",
  },
  {
    narrativeId: "narr-intangibles-1",
    noteId: "note-intangibles",
    linkedScheduleIds: ["sch-intangibles-rollforward"],
    linkedMovements: ["row-software.col-1"],
    content: "The Company invested $125,000 in new software development costs during the year. Goodwill of $800,000 was assessed for impairment at year-end with no impairment recognized. All finite-life intangible assets are amortized over their estimated useful lives.",
    owner: "Sarah Johnson",
    status: "DRAFT",
    createdAt: "2024-09-15T11:00:00Z",
    updatedAt: "2024-12-01T14:45:00Z",
  },
  {
    narrativeId: "narr-leases-1",
    noteId: "note-leases",
    linkedScheduleIds: ["sch-lease-maturity"],
    linkedMovements: [],
    content: "The Company's lease portfolio consists primarily of office space leases with remaining terms ranging from 1 to 8 years. The weighted-average remaining lease term is 4.2 years with a weighted-average discount rate of 5.5%. Total lease liability at year-end was $2.85 million.",
    owner: "Michael Chen",
    status: "APPROVED",
    createdAt: "2024-10-01T09:00:00Z",
    updatedAt: "2024-12-01T15:00:00Z",
  },
  {
    narrativeId: "narr-revenue-1",
    noteId: "note-revenue",
    linkedScheduleIds: ["sch-revenue-breakdown"],
    linkedMovements: [],
    content: "Revenue is recognized when control of goods or services is transferred to customers. Product sales are recognized at a point in time when delivery occurs. Service revenue is recognized over time as services are rendered. Licensing revenue is recognized over the license term.",
    owner: "David Wilson",
    status: "APPROVED",
    createdAt: "2024-10-15T08:00:00Z",
    updatedAt: "2024-12-01T15:30:00Z",
  },
];

// Sample Reviews
export const sampleReviews: DisclosureReview[] = [
  {
    reviewId: "rev-1",
    targetType: "NOTE",
    targetId: "note-ppe",
    reviewer: "CFO - Robert Brown",
    comments: [
      {
        commentId: "comm-1",
        author: "CFO - Robert Brown",
        content: "Please verify the building additions amount matches the capital expenditure report.",
        timestamp: "2024-11-25T14:00:00Z",
        isResolved: true,
      },
      {
        commentId: "comm-2",
        author: "John Smith",
        content: "Verified - amount confirmed with CapEx schedule.",
        timestamp: "2024-11-26T09:00:00Z",
        isResolved: true,
      },
    ],
    approvalStatus: "PENDING",
    timestamp: "2024-11-25T14:00:00Z",
  },
  {
    reviewId: "rev-2",
    targetType: "SCHEDULE",
    targetId: "sch-lease-maturity",
    reviewer: "Controller - Lisa Anderson",
    comments: [],
    approvalStatus: "APPROVED",
    timestamp: "2024-11-28T10:00:00Z",
  },
];

// Dashboard KPIs calculation
export function calculateDashboardKPIs(notes: DisclosureNote[], schedules: DisclosureSchedule[], narratives: NarrativeBlock[], reviews: DisclosureReview[]): DisclosureDashboardKPIs {
  return {
    totalNotes: notes.length,
    draftNotes: notes.filter(n => n.status === "DRAFT").length,
    underReviewNotes: notes.filter(n => n.status === "UNDER_REVIEW").length,
    approvedNotes: notes.filter(n => n.status === "APPROVED").length,
    publishedNotes: notes.filter(n => n.status === "PUBLISHED").length,
    totalSchedules: schedules.length,
    totalNarratives: narratives.length,
    pendingReviews: reviews.filter(r => r.approvalStatus === "PENDING").length,
  };
}

// Format currency helper
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Get layout type label
export function getLayoutTypeLabel(type: ScheduleLayoutType): string {
  const labels: Record<ScheduleLayoutType, string> = {
    ROLLFORWARD: "Rollforward",
    MOVEMENT_BY_CATEGORY: "Movement by Category",
    TIMING_MATURITY: "Timing / Maturity",
    GROSS_TO_NET: "Gross to Net",
    COMPOSITION: "Composition / Breakdown",
    RECONCILIATION: "Reconciliation",
  };
  return labels[type];
}

// Get status badge color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    UNDER_REVIEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    PUBLISHED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    PENDING: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
}

// Get framework label
export function getFrameworkLabel(framework: string): string {
  const labels: Record<string, string> = {
    IFRS: "IFRS",
    US_GAAP: "US GAAP",
    BOTH: "IFRS / US GAAP",
  };
  return labels[framework] || framework;
}

// ===== FINANCIAL STATEMENTS DATA =====

import type {
  FSCompanyProfile,
  FSAuditorOpinion,
  FSBalanceSheet,
  FSIncomeStatement,
  FSEquityStatement,
  FSCashFlowStatement,
  FSLineItem,
} from "@shared/schema";

// Company Profile
export const sampleCompanyProfile: FSCompanyProfile = {
  entityId: "CORP-001",
  legalEntityName: "Acme Corporation Inc.",
  registeredAddress: "123 Corporate Plaza, Suite 1000, New York, NY 10001",
  jurisdiction: "Delaware, USA",
  entityType: "C Corporation",
  reportingPeriod: "FY2024",
  functionalCurrency: "USD",
  presentationCurrency: "USD",
  periodStartDate: "2024-01-01",
  periodEndDate: "2024-12-31",
  framework: "US_GAAP",
  consolidationStatus: "CONSOLIDATED",
  updatedAt: "2024-12-15T10:00:00Z",
};

// Auditor's Opinion
export const sampleAuditorOpinion: FSAuditorOpinion = {
  opinionId: "aud-2024-001",
  periodId: "FY2024",
  auditorName: "Deloitte & Touche LLP",
  opinionType: "UNQUALIFIED",
  opinionDate: "2025-02-15",
  opinionText: `We have audited the accompanying consolidated financial statements of Acme Corporation Inc. and its subsidiaries (the "Company"), which comprise the consolidated balance sheet as of December 31, 2024, and the related consolidated statements of income, comprehensive income, changes in stockholders' equity, and cash flows for the year then ended, and the related notes to the consolidated financial statements.

In our opinion, the accompanying consolidated financial statements present fairly, in all material respects, the financial position of the Company as of December 31, 2024, and the results of its operations and its cash flows for the year then ended in accordance with accounting principles generally accepted in the United States of America.

We have also audited, in accordance with the standards of the Public Company Accounting Oversight Board (United States), the Company's internal control over financial reporting as of December 31, 2024, and our report dated February 15, 2025, expressed an unqualified opinion on the Company's internal control over financial reporting.`,
  signedDocumentId: "doc-aud-signed-2024",
  signedDocumentName: "Signed_Audit_Opinion_FY2024.pdf",
  isLocked: false,
  updatedAt: "2025-01-20T14:00:00Z",
};

// Helper to create line items
function createLineItem(
  id: string,
  statementType: FSLineItem["statementType"],
  section: string,
  label: string,
  lineNumber: string,
  current: number,
  prior: number,
  noteRefs: string[] = [],
  order: number = 0,
  options?: Partial<FSLineItem>
): FSLineItem {
  return {
    lineId: id,
    statementType,
    section,
    lineLabel: label,
    lineNumber,
    indentLevel: options?.indentLevel ?? 0,
    isBold: options?.isBold ?? false,
    isSubtotal: options?.isSubtotal ?? false,
    isTotal: options?.isTotal ?? false,
    currentYearAmount: current,
    priorYearAmount: prior,
    noteRefs,
    orderIndex: order,
  };
}

// Balance Sheet
export const sampleBalanceSheet: FSBalanceSheet = {
  periodId: "FY2024",
  currentPeriodLabel: "Dec 31, 2024",
  priorPeriodLabel: "Dec 31, 2023",
  sections: {
    currentAssets: [
      createLineItem("bs-ca-header", "BALANCE_SHEET", "current_assets", "Current Assets", "", 0, 0, [], 0, { isBold: true }),
      createLineItem("bs-cash", "BALANCE_SHEET", "current_assets", "Cash and cash equivalents", "4", 2850000, 2450000, ["note-cash"], 1, { indentLevel: 1 }),
      createLineItem("bs-ar", "BALANCE_SHEET", "current_assets", "Accounts receivable, net", "5", 4200000, 3800000, ["note-ar"], 2, { indentLevel: 1 }),
      createLineItem("bs-inventory", "BALANCE_SHEET", "current_assets", "Inventory", "6", 890000, 815000, ["note-inventory"], 3, { indentLevel: 1 }),
      createLineItem("bs-prepaid", "BALANCE_SHEET", "current_assets", "Prepaid expenses", "7", 425000, 380000, ["note-prepaid"], 4, { indentLevel: 1 }),
      createLineItem("bs-ca-total", "BALANCE_SHEET", "current_assets", "Total current assets", "", 8365000, 7445000, [], 5, { isBold: true, isSubtotal: true }),
    ],
    nonCurrentAssets: [
      createLineItem("bs-nca-header", "BALANCE_SHEET", "non_current_assets", "Non-Current Assets", "", 0, 0, [], 0, { isBold: true }),
      createLineItem("bs-ppe", "BALANCE_SHEET", "non_current_assets", "Property, plant & equipment, net", "10", 5250000, 4930000, ["note-ppe"], 1, { indentLevel: 1 }),
      createLineItem("bs-intangibles", "BALANCE_SHEET", "non_current_assets", "Intangible assets, net", "11", 1800000, 1750000, ["note-intangibles"], 2, { indentLevel: 1 }),
      createLineItem("bs-rou", "BALANCE_SHEET", "non_current_assets", "Right-of-use assets", "12", 2100000, 2300000, ["note-leases"], 3, { indentLevel: 1 }),
      createLineItem("bs-goodwill", "BALANCE_SHEET", "non_current_assets", "Goodwill", "13", 800000, 800000, ["note-goodwill"], 4, { indentLevel: 1 }),
      createLineItem("bs-other-nc", "BALANCE_SHEET", "non_current_assets", "Other non-current assets", "14", 320000, 290000, [], 5, { indentLevel: 1 }),
      createLineItem("bs-nca-total", "BALANCE_SHEET", "non_current_assets", "Total non-current assets", "", 10270000, 10070000, [], 6, { isBold: true, isSubtotal: true }),
    ],
    currentLiabilities: [
      createLineItem("bs-cl-header", "BALANCE_SHEET", "current_liabilities", "Current Liabilities", "", 0, 0, [], 0, { isBold: true }),
      createLineItem("bs-ap", "BALANCE_SHEET", "current_liabilities", "Accounts payable", "15", 1850000, 1650000, ["note-ap"], 1, { indentLevel: 1 }),
      createLineItem("bs-accrued", "BALANCE_SHEET", "current_liabilities", "Accrued expenses", "16", 920000, 850000, ["note-accrued"], 2, { indentLevel: 1 }),
      createLineItem("bs-curr-lease", "BALANCE_SHEET", "current_liabilities", "Current portion of lease liabilities", "12", 550000, 480000, ["note-leases"], 3, { indentLevel: 1 }),
      createLineItem("bs-curr-debt", "BALANCE_SHEET", "current_liabilities", "Current portion of long-term debt", "17", 500000, 500000, ["note-debt"], 4, { indentLevel: 1 }),
      createLineItem("bs-deferred-rev", "BALANCE_SHEET", "current_liabilities", "Deferred revenue", "18", 380000, 340000, ["note-revenue"], 5, { indentLevel: 1 }),
      createLineItem("bs-cl-total", "BALANCE_SHEET", "current_liabilities", "Total current liabilities", "", 4200000, 3820000, [], 6, { isBold: true, isSubtotal: true }),
    ],
    nonCurrentLiabilities: [
      createLineItem("bs-ncl-header", "BALANCE_SHEET", "non_current_liabilities", "Non-Current Liabilities", "", 0, 0, [], 0, { isBold: true }),
      createLineItem("bs-lt-debt", "BALANCE_SHEET", "non_current_liabilities", "Long-term debt", "17", 3200000, 3700000, ["note-debt"], 1, { indentLevel: 1 }),
      createLineItem("bs-lt-lease", "BALANCE_SHEET", "non_current_liabilities", "Long-term lease liabilities", "12", 2300000, 2550000, ["note-leases"], 2, { indentLevel: 1 }),
      createLineItem("bs-dti", "BALANCE_SHEET", "non_current_liabilities", "Deferred tax liabilities", "19", 450000, 420000, ["note-tax"], 3, { indentLevel: 1 }),
      createLineItem("bs-other-ncl", "BALANCE_SHEET", "non_current_liabilities", "Other non-current liabilities", "20", 185000, 175000, [], 4, { indentLevel: 1 }),
      createLineItem("bs-ncl-total", "BALANCE_SHEET", "non_current_liabilities", "Total non-current liabilities", "", 6135000, 6845000, [], 5, { isBold: true, isSubtotal: true }),
    ],
    equity: [
      createLineItem("bs-eq-header", "BALANCE_SHEET", "equity", "Stockholders' Equity", "", 0, 0, [], 0, { isBold: true }),
      createLineItem("bs-common", "BALANCE_SHEET", "equity", "Common stock ($0.01 par value)", "21", 50000, 50000, ["note-equity"], 1, { indentLevel: 1 }),
      createLineItem("bs-apic", "BALANCE_SHEET", "equity", "Additional paid-in capital", "21", 3500000, 3200000, ["note-equity"], 2, { indentLevel: 1 }),
      createLineItem("bs-retained", "BALANCE_SHEET", "equity", "Retained earnings", "21", 4850000, 3700000, ["note-equity"], 3, { indentLevel: 1 }),
      createLineItem("bs-aoci", "BALANCE_SHEET", "equity", "Accumulated other comprehensive loss", "22", -100000, -100000, ["note-oci"], 4, { indentLevel: 1 }),
      createLineItem("bs-eq-total", "BALANCE_SHEET", "equity", "Total stockholders' equity", "", 8300000, 6850000, [], 5, { isBold: true, isSubtotal: true }),
    ],
  },
  totalAssets: { current: 18635000, prior: 17515000 },
  totalLiabilities: { current: 10335000, prior: 10665000 },
  totalEquity: { current: 8300000, prior: 6850000 },
  balanceCheck: true,
};

// Income Statement
export const sampleIncomeStatement: FSIncomeStatement = {
  periodId: "FY2024",
  currentPeriodLabel: "Year Ended Dec 31, 2024",
  priorPeriodLabel: "Year Ended Dec 31, 2023",
  lines: [
    createLineItem("is-revenue", "INCOME_STATEMENT", "revenue", "Net revenue", "3", 12500000, 11350000, ["note-revenue"], 0, { isBold: true }),
    createLineItem("is-cogs", "INCOME_STATEMENT", "cost_of_sales", "Cost of goods sold", "8", -7500000, -6950000, ["note-cost"], 1),
    createLineItem("is-gross", "INCOME_STATEMENT", "gross_profit", "Gross profit", "", 5000000, 4400000, [], 2, { isBold: true, isSubtotal: true }),
    createLineItem("is-opex-header", "INCOME_STATEMENT", "operating_expenses", "Operating expenses:", "", 0, 0, [], 3, { isBold: true }),
    createLineItem("is-sga", "INCOME_STATEMENT", "operating_expenses", "Selling, general & administrative", "9", -2100000, -1950000, ["note-sga"], 4, { indentLevel: 1 }),
    createLineItem("is-rd", "INCOME_STATEMENT", "operating_expenses", "Research & development", "9", -850000, -780000, [], 5, { indentLevel: 1 }),
    createLineItem("is-da", "INCOME_STATEMENT", "operating_expenses", "Depreciation & amortization", "10,11", -875000, -820000, ["note-ppe", "note-intangibles"], 6, { indentLevel: 1 }),
    createLineItem("is-opex-total", "INCOME_STATEMENT", "operating_expenses", "Total operating expenses", "", -3825000, -3550000, [], 7, { isSubtotal: true }),
    createLineItem("is-opinc", "INCOME_STATEMENT", "operating_income", "Operating income", "", 1175000, 850000, [], 8, { isBold: true, isSubtotal: true }),
    createLineItem("is-interest", "INCOME_STATEMENT", "other", "Interest expense, net", "17", -125000, -145000, ["note-debt"], 9),
    createLineItem("is-other", "INCOME_STATEMENT", "other", "Other income (expense), net", "", 50000, 35000, [], 10),
    createLineItem("is-pretax", "INCOME_STATEMENT", "pretax", "Income before income taxes", "", 1100000, 740000, [], 11, { isBold: true, isSubtotal: true }),
    createLineItem("is-tax", "INCOME_STATEMENT", "tax", "Income tax expense", "19", -275000, -185000, ["note-tax"], 12),
    createLineItem("is-net", "INCOME_STATEMENT", "net_income", "Net income", "", 825000, 555000, [], 13, { isBold: true, isTotal: true }),
  ],
  netIncome: { current: 825000, prior: 555000 },
};

// Statement of Changes in Equity
export const sampleEquityStatement: FSEquityStatement = {
  periodId: "FY2024",
  currentPeriodLabel: "2024",
  priorPeriodLabel: "2023",
  components: [
    {
      componentId: "eq-common",
      componentName: "Common Stock",
      openingBalance: { current: 50000, prior: 48000 },
      movements: [
        { description: "Stock issuance", current: 0, prior: 2000 },
      ],
      closingBalance: { current: 50000, prior: 50000 },
      noteRefs: ["note-equity"],
    },
    {
      componentId: "eq-apic",
      componentName: "Additional Paid-in Capital",
      openingBalance: { current: 3200000, prior: 2900000 },
      movements: [
        { description: "Stock-based compensation", current: 250000, prior: 200000 },
        { description: "Stock issuance", current: 50000, prior: 100000 },
      ],
      closingBalance: { current: 3500000, prior: 3200000 },
      noteRefs: ["note-equity"],
    },
    {
      componentId: "eq-retained",
      componentName: "Retained Earnings",
      openingBalance: { current: 3700000, prior: 3245000 },
      movements: [
        { description: "Net income", current: 825000, prior: 555000 },
        { description: "Dividends declared", current: -175000, prior: -100000 },
        { description: "Prior period adjustment", current: 500000, prior: 0 },
      ],
      closingBalance: { current: 4850000, prior: 3700000 },
      noteRefs: ["note-equity"],
    },
    {
      componentId: "eq-aoci",
      componentName: "Accumulated Other Comprehensive Income (Loss)",
      openingBalance: { current: -100000, prior: -75000 },
      movements: [
        { description: "Foreign currency translation", current: 0, prior: -25000 },
      ],
      closingBalance: { current: -100000, prior: -100000 },
      noteRefs: ["note-oci"],
    },
  ],
  totalEquity: { current: 8300000, prior: 6850000 },
};

// Cash Flow Statement
export const sampleCashFlowStatement: FSCashFlowStatement = {
  periodId: "FY2024",
  currentPeriodLabel: "Year Ended Dec 31, 2024",
  priorPeriodLabel: "Year Ended Dec 31, 2023",
  method: "INDIRECT",
  operatingActivities: [
    createLineItem("cf-op-header", "CASH_FLOW_STATEMENT", "operating", "Cash flows from operating activities:", "", 0, 0, [], 0, { isBold: true }),
    createLineItem("cf-net-income", "CASH_FLOW_STATEMENT", "operating", "Net income", "", 825000, 555000, [], 1, { indentLevel: 1 }),
    createLineItem("cf-adj-header", "CASH_FLOW_STATEMENT", "operating", "Adjustments to reconcile net income:", "", 0, 0, [], 2, { indentLevel: 1 }),
    createLineItem("cf-da", "CASH_FLOW_STATEMENT", "operating", "Depreciation and amortization", "10,11", 875000, 820000, ["note-ppe", "note-intangibles"], 3, { indentLevel: 2 }),
    createLineItem("cf-sbc", "CASH_FLOW_STATEMENT", "operating", "Stock-based compensation", "", 250000, 200000, [], 4, { indentLevel: 2 }),
    createLineItem("cf-dti", "CASH_FLOW_STATEMENT", "operating", "Deferred income taxes", "19", 30000, 25000, ["note-tax"], 5, { indentLevel: 2 }),
    createLineItem("cf-ar", "CASH_FLOW_STATEMENT", "operating", "Increase in accounts receivable", "", -400000, -350000, [], 6, { indentLevel: 2 }),
    createLineItem("cf-inv", "CASH_FLOW_STATEMENT", "operating", "Increase in inventory", "", -75000, -65000, [], 7, { indentLevel: 2 }),
    createLineItem("cf-prep", "CASH_FLOW_STATEMENT", "operating", "Increase in prepaid expenses", "", -45000, -30000, [], 8, { indentLevel: 2 }),
    createLineItem("cf-ap", "CASH_FLOW_STATEMENT", "operating", "Increase in accounts payable", "", 200000, 180000, [], 9, { indentLevel: 2 }),
    createLineItem("cf-accrued", "CASH_FLOW_STATEMENT", "operating", "Increase in accrued expenses", "", 70000, 55000, [], 10, { indentLevel: 2 }),
    createLineItem("cf-deferred", "CASH_FLOW_STATEMENT", "operating", "Increase in deferred revenue", "", 40000, 35000, [], 11, { indentLevel: 2 }),
    createLineItem("cf-op-total", "CASH_FLOW_STATEMENT", "operating", "Net cash provided by operating activities", "", 1770000, 1425000, [], 12, { isBold: true, isSubtotal: true }),
  ],
  investingActivities: [
    createLineItem("cf-inv-header", "CASH_FLOW_STATEMENT", "investing", "Cash flows from investing activities:", "", 0, 0, [], 0, { isBold: true }),
    createLineItem("cf-capex", "CASH_FLOW_STATEMENT", "investing", "Purchases of property and equipment", "10", -590000, -480000, ["note-ppe"], 1, { indentLevel: 1 }),
    createLineItem("cf-intang", "CASH_FLOW_STATEMENT", "investing", "Purchases of intangible assets", "11", -175000, -150000, ["note-intangibles"], 2, { indentLevel: 1 }),
    createLineItem("cf-disposal", "CASH_FLOW_STATEMENT", "investing", "Proceeds from sale of assets", "", 60000, 45000, [], 3, { indentLevel: 1 }),
    createLineItem("cf-inv-total", "CASH_FLOW_STATEMENT", "investing", "Net cash used in investing activities", "", -705000, -585000, [], 4, { isBold: true, isSubtotal: true }),
  ],
  financingActivities: [
    createLineItem("cf-fin-header", "CASH_FLOW_STATEMENT", "financing", "Cash flows from financing activities:", "", 0, 0, [], 0, { isBold: true }),
    createLineItem("cf-debt-repay", "CASH_FLOW_STATEMENT", "financing", "Repayments of long-term debt", "17", -500000, -400000, ["note-debt"], 1, { indentLevel: 1 }),
    createLineItem("cf-lease-pay", "CASH_FLOW_STATEMENT", "financing", "Principal payments on lease liabilities", "12", -180000, -165000, ["note-leases"], 2, { indentLevel: 1 }),
    createLineItem("cf-stock", "CASH_FLOW_STATEMENT", "financing", "Proceeds from stock issuance", "21", 50000, 102000, ["note-equity"], 3, { indentLevel: 1 }),
    createLineItem("cf-div", "CASH_FLOW_STATEMENT", "financing", "Dividends paid", "", -75000, -50000, [], 4, { indentLevel: 1 }),
    createLineItem("cf-prior-adj", "CASH_FLOW_STATEMENT", "financing", "Prior period adjustment", "", 40000, 0, [], 5, { indentLevel: 1 }),
    createLineItem("cf-fin-total", "CASH_FLOW_STATEMENT", "financing", "Net cash used in financing activities", "", -665000, -513000, [], 6, { isBold: true, isSubtotal: true }),
  ],
  openingCash: { current: 2450000, prior: 2123000 },
  netCashChange: { current: 400000, prior: 327000 },
  closingCash: { current: 2850000, prior: 2450000 },
  reconciliationCheck: true,
};

// Financial Statement navigation items
export const financialStatementNavItems = [
  { id: "company-profile", label: "Company Profile", icon: "Building2" },
  { id: "auditor-opinion", label: "Auditor's Opinion", icon: "FileCheck" },
  { id: "trial-balance", label: "Trial Balance", icon: "Calculator" },
  { id: "balance-sheet", label: "Balance Sheet", icon: "Scale" },
  { id: "income-statement", label: "Income Statement", icon: "TrendingUp" },
  { id: "equity-statement", label: "Statement of Changes in Equity", icon: "Users" },
  { id: "cash-flow", label: "Cash Flow Statement", icon: "ArrowDownUp" },
];

// Trial Balance Sample Data
import type { GLAccount, TBColumn, TBLine, TBWorkspace, FSCategory } from "@shared/schema";

// Sample GL Accounts with FS Category Tags
export const sampleGLAccounts: GLAccount[] = [
  // Current Assets
  { accountId: "gl-1010", accountCode: "1010", accountName: "Cash and Cash Equivalents", fsCategory: "CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 1 },
  { accountId: "gl-1100", accountCode: "1100", accountName: "Accounts Receivable", fsCategory: "CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 2 },
  { accountId: "gl-1150", accountCode: "1150", accountName: "Allowance for Doubtful Accounts", fsCategory: "CURRENT_ASSETS", isActive: true, normalBalance: "CREDIT", orderIndex: 3 },
  { accountId: "gl-1200", accountCode: "1200", accountName: "Inventory", fsCategory: "CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 4 },
  { accountId: "gl-1300", accountCode: "1300", accountName: "Prepaid Expenses", fsCategory: "CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 5 },
  { accountId: "gl-1350", accountCode: "1350", accountName: "Other Current Assets", fsCategory: "CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 6 },
  // Non-Current Assets
  { accountId: "gl-1500", accountCode: "1500", accountName: "Property, Plant & Equipment", fsCategory: "NON_CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 7 },
  { accountId: "gl-1550", accountCode: "1550", accountName: "Accumulated Depreciation - PPE", fsCategory: "NON_CURRENT_ASSETS", isActive: true, normalBalance: "CREDIT", orderIndex: 8 },
  { accountId: "gl-1600", accountCode: "1600", accountName: "Intangible Assets", fsCategory: "NON_CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 9 },
  { accountId: "gl-1650", accountCode: "1650", accountName: "Accumulated Amortization - Intangibles", fsCategory: "NON_CURRENT_ASSETS", isActive: true, normalBalance: "CREDIT", orderIndex: 10 },
  { accountId: "gl-1700", accountCode: "1700", accountName: "Right-of-Use Assets", fsCategory: "NON_CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 11 },
  { accountId: "gl-1750", accountCode: "1750", accountName: "Accumulated Depreciation - ROU", fsCategory: "NON_CURRENT_ASSETS", isActive: true, normalBalance: "CREDIT", orderIndex: 12 },
  { accountId: "gl-1800", accountCode: "1800", accountName: "Deferred Tax Assets", fsCategory: "NON_CURRENT_ASSETS", isActive: true, normalBalance: "DEBIT", orderIndex: 13 },
  // Current Liabilities
  { accountId: "gl-2010", accountCode: "2010", accountName: "Accounts Payable", fsCategory: "CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 14 },
  { accountId: "gl-2100", accountCode: "2100", accountName: "Accrued Expenses", fsCategory: "CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 15 },
  { accountId: "gl-2150", accountCode: "2150", accountName: "Income Taxes Payable", fsCategory: "CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 16 },
  { accountId: "gl-2200", accountCode: "2200", accountName: "Deferred Revenue - Current", fsCategory: "CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 17 },
  { accountId: "gl-2250", accountCode: "2250", accountName: "Current Portion of Long-Term Debt", fsCategory: "CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 18 },
  { accountId: "gl-2300", accountCode: "2300", accountName: "Current Lease Liabilities", fsCategory: "CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 19 },
  // Non-Current Liabilities
  { accountId: "gl-2500", accountCode: "2500", accountName: "Long-Term Debt", fsCategory: "NON_CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 20 },
  { accountId: "gl-2600", accountCode: "2600", accountName: "Long-Term Lease Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 21 },
  { accountId: "gl-2700", accountCode: "2700", accountName: "Deferred Tax Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 22 },
  { accountId: "gl-2800", accountCode: "2800", accountName: "Other Long-Term Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", isActive: true, normalBalance: "CREDIT", orderIndex: 23 },
  // Equity
  { accountId: "gl-3010", accountCode: "3010", accountName: "Common Stock", fsCategory: "EQUITY", isActive: true, normalBalance: "CREDIT", orderIndex: 24 },
  { accountId: "gl-3100", accountCode: "3100", accountName: "Additional Paid-in Capital", fsCategory: "EQUITY", isActive: true, normalBalance: "CREDIT", orderIndex: 25 },
  { accountId: "gl-3200", accountCode: "3200", accountName: "Retained Earnings", fsCategory: "EQUITY", isActive: true, normalBalance: "CREDIT", orderIndex: 26 },
  { accountId: "gl-3300", accountCode: "3300", accountName: "Accumulated OCI", fsCategory: "EQUITY", isActive: true, normalBalance: "CREDIT", orderIndex: 27 },
  // Revenue
  { accountId: "gl-4010", accountCode: "4010", accountName: "Product Revenue", fsCategory: "REVENUE", isActive: true, normalBalance: "CREDIT", orderIndex: 28 },
  { accountId: "gl-4100", accountCode: "4100", accountName: "Service Revenue", fsCategory: "REVENUE", isActive: true, normalBalance: "CREDIT", orderIndex: 29 },
  { accountId: "gl-4200", accountCode: "4200", accountName: "Other Revenue", fsCategory: "OTHER_INCOME", isActive: true, normalBalance: "CREDIT", orderIndex: 30 },
  // Cost of Sales
  { accountId: "gl-5010", accountCode: "5010", accountName: "Cost of Goods Sold", fsCategory: "COST_OF_SALES", isActive: true, normalBalance: "DEBIT", orderIndex: 31 },
  { accountId: "gl-5100", accountCode: "5100", accountName: "Cost of Services", fsCategory: "COST_OF_SALES", isActive: true, normalBalance: "DEBIT", orderIndex: 32 },
  // Operating Expenses
  { accountId: "gl-6010", accountCode: "6010", accountName: "Salaries & Wages", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 33 },
  { accountId: "gl-6100", accountCode: "6100", accountName: "Employee Benefits", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 34 },
  { accountId: "gl-6200", accountCode: "6200", accountName: "Rent Expense", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 35 },
  { accountId: "gl-6300", accountCode: "6300", accountName: "Depreciation & Amortization", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 36 },
  { accountId: "gl-6400", accountCode: "6400", accountName: "Professional Fees", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 37 },
  { accountId: "gl-6500", accountCode: "6500", accountName: "Marketing & Advertising", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 38 },
  { accountId: "gl-6600", accountCode: "6600", accountName: "Utilities", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 39 },
  { accountId: "gl-6700", accountCode: "6700", accountName: "Insurance", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 40 },
  { accountId: "gl-6800", accountCode: "6800", accountName: "Travel & Entertainment", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 41 },
  { accountId: "gl-6900", accountCode: "6900", accountName: "Office Supplies & Expenses", fsCategory: "OPERATING_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 42 },
  // Other Expenses
  { accountId: "gl-7010", accountCode: "7010", accountName: "Interest Expense", fsCategory: "OTHER_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 43 },
  { accountId: "gl-7100", accountCode: "7100", accountName: "Other Expense", fsCategory: "OTHER_EXPENSES", isActive: true, normalBalance: "DEBIT", orderIndex: 44 },
  // Tax
  { accountId: "gl-8010", accountCode: "8010", accountName: "Income Tax Expense", fsCategory: "TAX_EXPENSE", isActive: true, normalBalance: "DEBIT", orderIndex: 45 },
];

// Sample Footnotes for Trial Balance
export const sampleTBFootnotes: TBFootnote[] = [
  { footnoteId: "fn-1", footnoteCode: "Note 1", footnoteTitle: "Summary of Significant Accounting Policies", disclosureId: null },
  { footnoteId: "fn-2", footnoteCode: "Note 2", footnoteTitle: "Revenue Recognition", disclosureId: null },
  { footnoteId: "fn-3", footnoteCode: "Note 3", footnoteTitle: "Property, Plant & Equipment", disclosureId: null },
  { footnoteId: "fn-4", footnoteCode: "Note 4", footnoteTitle: "Intangible Assets", disclosureId: null },
  { footnoteId: "fn-5", footnoteCode: "Note 5", footnoteTitle: "Leases", disclosureId: null },
  { footnoteId: "fn-6", footnoteCode: "Note 6", footnoteTitle: "Debt and Borrowings", disclosureId: null },
  { footnoteId: "fn-7", footnoteCode: "Note 7", footnoteTitle: "Income Taxes", disclosureId: null },
  { footnoteId: "fn-8", footnoteCode: "Note 8", footnoteTitle: "Equity", disclosureId: null },
  { footnoteId: "fn-9", footnoteCode: "Note 9", footnoteTitle: "Related Party Transactions", disclosureId: null },
  { footnoteId: "fn-10", footnoteCode: "Note 10", footnoteTitle: "Commitments and Contingencies", disclosureId: null },
];

// Sample Trial Balance Columns
// Net amount columns: DR positive, CR negative
export const sampleTBColumns: TBColumn[] = [
  { columnId: "col-opening", columnLabel: "Opening Balance", columnType: "OPENING", isLocked: true, isVisible: true, orderIndex: 0 },
  { columnId: "col-period", columnLabel: "Period Activity", columnType: "MOVEMENT", isLocked: false, isVisible: true, orderIndex: 1 },
  { columnId: "col-adj", columnLabel: "Audit Adjustments", columnType: "ADJUSTMENT", isLocked: false, isVisible: true, orderIndex: 2 },
  { columnId: "col-reclass", columnLabel: "Reclassifications", columnType: "ADJUSTMENT", isLocked: false, isVisible: true, orderIndex: 3 },
  { columnId: "col-net-move", columnLabel: "Net Movement", columnType: "NET_MOVEMENT", isLocked: true, isVisible: true, orderIndex: 4 },
  { columnId: "col-closing", columnLabel: "Closing Balance", columnType: "CLOSING", isLocked: true, isVisible: true, orderIndex: 5 },
];

// Sample TB Lines with opening balances rolled forward
// Net amounts: DR positive, CR negative
export const sampleTBLines: TBLine[] = [
  // Current Assets
  { lineId: "tb-1010", accountId: "gl-1010", accountCode: "1010", accountName: "Cash and Cash Equivalents", fsCategory: "CURRENT_ASSETS", footnoteIds: ["fn-1"], normalBalance: "DEBIT", openingDebit: 2450000, openingCredit: 0, amounts: { "col-period": 400000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 2850000, closingCredit: 0, orderIndex: 1 },
  { lineId: "tb-1100", accountId: "gl-1100", accountCode: "1100", accountName: "Accounts Receivable", fsCategory: "CURRENT_ASSETS", footnoteIds: ["fn-2"], normalBalance: "DEBIT", openingDebit: 3200000, openingCredit: 0, amounts: { "col-period": 400000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 3600000, closingCredit: 0, orderIndex: 2 },
  { lineId: "tb-1150", accountId: "gl-1150", accountCode: "1150", accountName: "Allowance for Doubtful Accounts", fsCategory: "CURRENT_ASSETS", footnoteIds: [], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 135000, amounts: { "col-period": -15000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 150000, orderIndex: 3 },
  { lineId: "tb-1200", accountId: "gl-1200", accountCode: "1200", accountName: "Inventory", fsCategory: "CURRENT_ASSETS", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 815000, openingCredit: 0, amounts: { "col-period": 75000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 890000, closingCredit: 0, orderIndex: 4 },
  { lineId: "tb-1300", accountId: "gl-1300", accountCode: "1300", accountName: "Prepaid Expenses", fsCategory: "CURRENT_ASSETS", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 580000, openingCredit: 0, amounts: { "col-period": 45000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 625000, closingCredit: 0, orderIndex: 5 },
  { lineId: "tb-1350", accountId: "gl-1350", accountCode: "1350", accountName: "Other Current Assets", fsCategory: "CURRENT_ASSETS", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 500000, openingCredit: 0, amounts: { "col-period": 50000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 550000, closingCredit: 0, orderIndex: 6 },
  // Non-Current Assets
  { lineId: "tb-1500", accountId: "gl-1500", accountCode: "1500", accountName: "Property, Plant & Equipment", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-3"], normalBalance: "DEBIT", openingDebit: 8200000, openingCredit: 0, amounts: { "col-period": 550000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 8750000, closingCredit: 0, orderIndex: 7 },
  { lineId: "tb-1550", accountId: "gl-1550", accountCode: "1550", accountName: "Accumulated Depreciation - PPE", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-3"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 2850000, amounts: { "col-period": -630000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 3480000, orderIndex: 8 },
  { lineId: "tb-1600", accountId: "gl-1600", accountCode: "1600", accountName: "Intangible Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-4"], normalBalance: "DEBIT", openingDebit: 2200000, openingCredit: 0, amounts: { "col-period": 175000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 2375000, closingCredit: 0, orderIndex: 9 },
  { lineId: "tb-1650", accountId: "gl-1650", accountCode: "1650", accountName: "Accumulated Amortization - Intangibles", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-4"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 400000, amounts: { "col-period": -225000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 625000, orderIndex: 10 },
  { lineId: "tb-1700", accountId: "gl-1700", accountCode: "1700", accountName: "Right-of-Use Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-5"], normalBalance: "DEBIT", openingDebit: 2500000, openingCredit: 0, amounts: { "col-period": 100000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 2600000, closingCredit: 0, orderIndex: 11 },
  { lineId: "tb-1750", accountId: "gl-1750", accountCode: "1750", accountName: "Accumulated Depreciation - ROU", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-5"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 350000, amounts: { "col-period": -150000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 500000, orderIndex: 12 },
  { lineId: "tb-1800", accountId: "gl-1800", accountCode: "1800", accountName: "Deferred Tax Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-7"], normalBalance: "DEBIT", openingDebit: 285000, openingCredit: 0, amounts: { "col-period": 15000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 300000, closingCredit: 0, orderIndex: 13 },
  // Current Liabilities
  { lineId: "tb-2010", accountId: "gl-2010", accountCode: "2010", accountName: "Accounts Payable", fsCategory: "CURRENT_LIABILITIES", footnoteIds: [], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 1280000, amounts: { "col-period": -200000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 1480000, orderIndex: 14 },
  { lineId: "tb-2100", accountId: "gl-2100", accountCode: "2100", accountName: "Accrued Expenses", fsCategory: "CURRENT_LIABILITIES", footnoteIds: [], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 630000, amounts: { "col-period": -70000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 700000, orderIndex: 15 },
  { lineId: "tb-2150", accountId: "gl-2150", accountCode: "2150", accountName: "Income Taxes Payable", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-7"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 210000, amounts: { "col-period": -15000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 225000, orderIndex: 16 },
  { lineId: "tb-2200", accountId: "gl-2200", accountCode: "2200", accountName: "Deferred Revenue - Current", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-2"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 660000, amounts: { "col-period": -40000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 700000, orderIndex: 17 },
  { lineId: "tb-2250", accountId: "gl-2250", accountCode: "2250", accountName: "Current Portion of Long-Term Debt", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-6"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 500000, amounts: { "col-period": 0, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 500000, orderIndex: 18 },
  { lineId: "tb-2300", accountId: "gl-2300", accountCode: "2300", accountName: "Current Lease Liabilities", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-5"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 175000, amounts: { "col-period": -10000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 185000, orderIndex: 19 },
  // Non-Current Liabilities
  { lineId: "tb-2500", accountId: "gl-2500", accountCode: "2500", accountName: "Long-Term Debt", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-6"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 4500000, amounts: { "col-period": 500000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 4000000, orderIndex: 20 },
  { lineId: "tb-2600", accountId: "gl-2600", accountCode: "2600", accountName: "Long-Term Lease Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-5"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 1700000, amounts: { "col-period": 85000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 1615000, orderIndex: 21 },
  { lineId: "tb-2700", accountId: "gl-2700", accountCode: "2700", accountName: "Deferred Tax Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-7"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 565000, amounts: { "col-period": -35000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 600000, orderIndex: 22 },
  { lineId: "tb-2800", accountId: "gl-2800", accountCode: "2800", accountName: "Other Long-Term Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: [], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 280000, amounts: { "col-period": -20000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 300000, orderIndex: 23 },
  // Equity
  { lineId: "tb-3010", accountId: "gl-3010", accountCode: "3010", accountName: "Common Stock", fsCategory: "EQUITY", footnoteIds: ["fn-8"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 50000, amounts: { "col-period": 0, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 50000, orderIndex: 24 },
  { lineId: "tb-3100", accountId: "gl-3100", accountCode: "3100", accountName: "Additional Paid-in Capital", fsCategory: "EQUITY", footnoteIds: ["fn-8"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 3200000, amounts: { "col-period": -300000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 3500000, orderIndex: 25 },
  { lineId: "tb-3200", accountId: "gl-3200", accountCode: "3200", accountName: "Retained Earnings", fsCategory: "EQUITY", footnoteIds: ["fn-8"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 3345000, amounts: { "col-period": -235000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 3580000, orderIndex: 26 },
  { lineId: "tb-3300", accountId: "gl-3300", accountCode: "3300", accountName: "Accumulated OCI", fsCategory: "EQUITY", footnoteIds: [], normalBalance: "CREDIT", openingDebit: 100000, openingCredit: 0, amounts: { "col-period": 0, "col-adj": 0, "col-reclass": 0 }, closingDebit: 100000, closingCredit: 0, orderIndex: 27 },
  // Revenue (Income Statement)
  { lineId: "tb-4010", accountId: "gl-4010", accountCode: "4010", accountName: "Product Revenue", fsCategory: "REVENUE", footnoteIds: ["fn-2"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": -9500000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 9500000, orderIndex: 28 },
  { lineId: "tb-4100", accountId: "gl-4100", accountCode: "4100", accountName: "Service Revenue", fsCategory: "REVENUE", footnoteIds: ["fn-2"], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": -2850000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 2850000, orderIndex: 29 },
  { lineId: "tb-4200", accountId: "gl-4200", accountCode: "4200", accountName: "Other Revenue", fsCategory: "OTHER_INCOME", footnoteIds: [], normalBalance: "CREDIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": -150000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 0, closingCredit: 150000, orderIndex: 30 },
  // Cost of Sales
  { lineId: "tb-5010", accountId: "gl-5010", accountCode: "5010", accountName: "Cost of Goods Sold", fsCategory: "COST_OF_SALES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 5700000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 5700000, closingCredit: 0, orderIndex: 31 },
  { lineId: "tb-5100", accountId: "gl-5100", accountCode: "5100", accountName: "Cost of Services", fsCategory: "COST_OF_SALES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 1650000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 1650000, closingCredit: 0, orderIndex: 32 },
  // Operating Expenses
  { lineId: "tb-6010", accountId: "gl-6010", accountCode: "6010", accountName: "Salaries & Wages", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 1850000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 1850000, closingCredit: 0, orderIndex: 33 },
  { lineId: "tb-6100", accountId: "gl-6100", accountCode: "6100", accountName: "Employee Benefits", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 425000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 425000, closingCredit: 0, orderIndex: 34 },
  { lineId: "tb-6200", accountId: "gl-6200", accountCode: "6200", accountName: "Rent Expense", fsCategory: "OPERATING_EXPENSES", footnoteIds: ["fn-5"], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 180000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 180000, closingCredit: 0, orderIndex: 35 },
  { lineId: "tb-6300", accountId: "gl-6300", accountCode: "6300", accountName: "Depreciation & Amortization", fsCategory: "OPERATING_EXPENSES", footnoteIds: ["fn-3", "fn-4"], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 875000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 875000, closingCredit: 0, orderIndex: 36 },
  { lineId: "tb-6400", accountId: "gl-6400", accountCode: "6400", accountName: "Professional Fees", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 215000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 215000, closingCredit: 0, orderIndex: 37 },
  { lineId: "tb-6500", accountId: "gl-6500", accountCode: "6500", accountName: "Marketing & Advertising", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 275000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 275000, closingCredit: 0, orderIndex: 38 },
  { lineId: "tb-6600", accountId: "gl-6600", accountCode: "6600", accountName: "Utilities", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 72000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 72000, closingCredit: 0, orderIndex: 39 },
  { lineId: "tb-6700", accountId: "gl-6700", accountCode: "6700", accountName: "Insurance", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 95000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 95000, closingCredit: 0, orderIndex: 40 },
  { lineId: "tb-6800", accountId: "gl-6800", accountCode: "6800", accountName: "Travel & Entertainment", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 58000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 58000, closingCredit: 0, orderIndex: 41 },
  { lineId: "tb-6900", accountId: "gl-6900", accountCode: "6900", accountName: "Office Supplies & Expenses", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 35000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 35000, closingCredit: 0, orderIndex: 42 },
  // Other Expenses
  { lineId: "tb-7010", accountId: "gl-7010", accountCode: "7010", accountName: "Interest Expense", fsCategory: "OTHER_EXPENSES", footnoteIds: ["fn-6"], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 280000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 280000, closingCredit: 0, orderIndex: 43 },
  { lineId: "tb-7100", accountId: "gl-7100", accountCode: "7100", accountName: "Other Expense", fsCategory: "OTHER_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 15000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 15000, closingCredit: 0, orderIndex: 44 },
  // Tax
  { lineId: "tb-8010", accountId: "gl-8010", accountCode: "8010", accountName: "Income Tax Expense", fsCategory: "TAX_EXPENSE", footnoteIds: ["fn-7"], normalBalance: "DEBIT", openingDebit: 0, openingCredit: 0, amounts: { "col-period": 325000, "col-adj": 0, "col-reclass": 0 }, closingDebit: 325000, closingCredit: 0, orderIndex: 45 },
];

// Calculate totals
const calculateTBTotals = (lines: TBLine[]) => {
  let totalOpeningDebit = 0;
  let totalOpeningCredit = 0;
  let totalClosingDebit = 0;
  let totalClosingCredit = 0;
  
  lines.forEach(line => {
    totalOpeningDebit += line.openingDebit;
    totalOpeningCredit += line.openingCredit;
    totalClosingDebit += line.closingDebit;
    totalClosingCredit += line.closingCredit;
  });
  
  return { totalOpeningDebit, totalOpeningCredit, totalClosingDebit, totalClosingCredit };
};

const tbTotals = calculateTBTotals(sampleTBLines);

// Sample Trial Balance Workspace
export const sampleTBWorkspace: TBWorkspace = {
  workspaceId: "tb-fy2024",
  footnotes: sampleTBFootnotes,
  periodId: "FY2024",
  periodLabel: "FY 2024",
  priorPeriodId: "FY2023",
  entityName: "Acme Corporation Inc.",
  reportingCurrency: "USD",
  columns: sampleTBColumns,
  lines: sampleTBLines,
  glAccounts: sampleGLAccounts,
  totalOpeningDebit: tbTotals.totalOpeningDebit,
  totalOpeningCredit: tbTotals.totalOpeningCredit,
  totalClosingDebit: tbTotals.totalClosingDebit,
  totalClosingCredit: tbTotals.totalClosingCredit,
  isBalanced: Math.abs(tbTotals.totalClosingDebit - tbTotals.totalClosingCredit) < 0.01,
  lastUpdated: "2024-12-31T23:59:59Z",
};

// FS Category labels for display
export const fsCategoryLabels: Record<FSCategory, string> = {
  CURRENT_ASSETS: "Current Assets",
  NON_CURRENT_ASSETS: "Non-Current Assets",
  CURRENT_LIABILITIES: "Current Liabilities",
  NON_CURRENT_LIABILITIES: "Non-Current Liabilities",
  EQUITY: "Equity",
  REVENUE: "Revenue",
  COST_OF_SALES: "Cost of Sales",
  OPERATING_EXPENSES: "Operating Expenses",
  OTHER_INCOME: "Other Income",
  OTHER_EXPENSES: "Other Expenses",
  TAX_EXPENSE: "Tax Expense",
  CASH_OPERATING: "Cash - Operating",
  CASH_INVESTING: "Cash - Investing",
  CASH_FINANCING: "Cash - Financing",
};

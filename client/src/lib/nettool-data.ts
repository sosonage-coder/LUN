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
  FSComprehensiveIncome,
  FSBasisOfPreparation,
  AccountingPolicy,
  MDADocument,
  TBAdjustmentEntry,
  TBAdjustmentColumn,
  TBAdjustmentAccountLine,
  TBAdjustmentsWorkspace,
  FinalTBLine,
  FinalTBView,
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
  // Current Assets
  { lineId: "bs-cash", statementType: "BALANCE_SHEET", lineLabel: "Cash and Cash Equivalents", lineNumber: "1", amount: 2850000, period: "FY2024" },
  { lineId: "bs-ar", statementType: "BALANCE_SHEET", lineLabel: "Trade and Other Receivables", lineNumber: "2", amount: 3450000, period: "FY2024" },
  { lineId: "bs-inventory", statementType: "BALANCE_SHEET", lineLabel: "Inventory", lineNumber: "3", amount: 890000, period: "FY2024" },
  { lineId: "bs-prepaid", statementType: "BALANCE_SHEET", lineLabel: "Prepaid Expenses", lineNumber: "4", amount: 625000, period: "FY2024" },
  // Non-Current Assets
  { lineId: "bs-ppe", statementType: "BALANCE_SHEET", lineLabel: "Property, Plant & Equipment", lineNumber: "5", amount: 5250000, period: "FY2024" },
  { lineId: "bs-intangibles", statementType: "BALANCE_SHEET", lineLabel: "Intangible Assets", lineNumber: "6", amount: 1800000, period: "FY2024" },
  { lineId: "bs-rou", statementType: "BALANCE_SHEET", lineLabel: "Right-of-Use Assets", lineNumber: "7", amount: 2100000, period: "FY2024" },
  { lineId: "bs-leases", statementType: "BALANCE_SHEET", lineLabel: "Right-of-Use Assets (Net)", lineNumber: "7a", amount: 2100000, period: "FY2024" },
  { lineId: "bs-goodwill", statementType: "BALANCE_SHEET", lineLabel: "Goodwill", lineNumber: "8", amount: 3500000, period: "FY2024" },
  { lineId: "bs-dti", statementType: "BALANCE_SHEET", lineLabel: "Deferred Tax Assets", lineNumber: "9", amount: 300000, period: "FY2024" },
  // Current Liabilities
  { lineId: "bs-ap", statementType: "BALANCE_SHEET", lineLabel: "Trade and Other Payables", lineNumber: "10", amount: -1480000, period: "FY2024" },
  { lineId: "bs-accrued", statementType: "BALANCE_SHEET", lineLabel: "Accrued Liabilities", lineNumber: "11", amount: -775000, period: "FY2024" },
  { lineId: "bs-curr-debt", statementType: "BALANCE_SHEET", lineLabel: "Current Portion of Long-Term Debt", lineNumber: "12", amount: -700000, period: "FY2024" },
  { lineId: "bs-curr-lease", statementType: "BALANCE_SHEET", lineLabel: "Current Lease Liabilities", lineNumber: "13", amount: -185000, period: "FY2024" },
  // Non-Current Liabilities
  { lineId: "bs-lt-debt", statementType: "BALANCE_SHEET", lineLabel: "Long-Term Debt", lineNumber: "14", amount: -3800000, period: "FY2024" },
  { lineId: "bs-lt-lease", statementType: "BALANCE_SHEET", lineLabel: "Long-Term Lease Liabilities", lineNumber: "15", amount: -1615000, period: "FY2024" },
  { lineId: "bs-dtl", statementType: "BALANCE_SHEET", lineLabel: "Deferred Tax Liabilities", lineNumber: "16", amount: -600000, period: "FY2024" },
  // Equity
  { lineId: "bs-common", statementType: "BALANCE_SHEET", lineLabel: "Common Stock", lineNumber: "17", amount: -50000, period: "FY2024" },
  { lineId: "bs-apic", statementType: "BALANCE_SHEET", lineLabel: "Additional Paid-in Capital", lineNumber: "18", amount: -5000000, period: "FY2024" },
  { lineId: "bs-retained", statementType: "BALANCE_SHEET", lineLabel: "Retained Earnings", lineNumber: "19", amount: -4600000, period: "FY2024" },
  { lineId: "bs-aoci", statementType: "BALANCE_SHEET", lineLabel: "Accumulated Other Comprehensive Income", lineNumber: "20", amount: -65000, period: "FY2024" },
  // Income Statement
  { lineId: "is-revenue", statementType: "INCOME_STATEMENT", lineLabel: "Revenue", lineNumber: "1", amount: 12500000, period: "FY2024" },
  { lineId: "is-cogs", statementType: "INCOME_STATEMENT", lineLabel: "Cost of Goods Sold", lineNumber: "2", amount: -7500000, period: "FY2024" },
  { lineId: "is-sga", statementType: "INCOME_STATEMENT", lineLabel: "Selling, General & Administrative", lineNumber: "3", amount: -2800000, period: "FY2024" },
  { lineId: "is-rd", statementType: "INCOME_STATEMENT", lineLabel: "Research & Development", lineNumber: "4", amount: -950000, period: "FY2024" },
  { lineId: "is-depreciation", statementType: "INCOME_STATEMENT", lineLabel: "Depreciation & Amortization", lineNumber: "5", amount: -875000, period: "FY2024" },
  { lineId: "is-tax", statementType: "INCOME_STATEMENT", lineLabel: "Income Tax Expense", lineNumber: "6", amount: -94000, period: "FY2024" },
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
  // ========== NEW SCHEDULES FOR ALL FS LINE ITEMS ==========
  {
    scheduleId: "sch-cash-composition",
    noteId: "note-cash",
    scheduleTitle: "Cash and Cash Equivalents Composition",
    layoutType: "COMPOSITION",
    columns: [
      { columnId: "col-0", label: "2024", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "2023", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    rows: [
      { rowId: "row-cash", label: "Cash at bank", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-mm", label: "Money market funds", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-petty", label: "Petty cash", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-cash": { "col-0": 2300000, "col-1": 1900000 },
      "row-mm": { "col-0": 550000, "col-1": 545000 },
      "row-petty": { "col-0": 0, "col-1": 5000 },
      "row-total": { "col-0": 2850000, "col-1": 2450000 },
    },
    templateId: "tmpl-composition",
    supportAttachments: [],
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
  },
  {
    scheduleId: "sch-ar-aging",
    noteId: "note-ar",
    scheduleTitle: "Trade Receivables Aging Analysis",
    layoutType: "TIMING_MATURITY",
    columns: [
      { columnId: "col-0", label: "Not Due", role: "USER", widthPx: 100, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "1-30 Days", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "31-60 Days", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "61-90 Days", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: ">90 Days", role: "USER", widthPx: 100, orderIndex: 4, hidden: false, locked: false },
      { columnId: "col-5", label: "Total", role: "SYSTEM", widthPx: 120, orderIndex: 5, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-gross", label: "Gross receivables", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-allow", label: "Allowance for doubtful accounts", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-net", label: "Net receivables", role: "TOTAL", heightPx: 36, orderIndex: 2, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-gross": { "col-0": 2600000, "col-1": 800000, "col-2": 280000, "col-3": 85000, "col-4": 35000, "col-5": 3800000 },
      "row-allow": { "col-0": 0, "col-1": -20000, "col-2": -50000, "col-3": -60000, "col-4": -70000, "col-5": -200000 },
      "row-net": { "col-0": 2600000, "col-1": 780000, "col-2": 230000, "col-3": 25000, "col-4": -35000, "col-5": 3600000 },
    },
    templateId: "tmpl-maturity",
    supportAttachments: [],
    createdAt: "2024-06-15T09:00:00Z",
    updatedAt: "2024-12-19T14:00:00Z",
  },
  {
    scheduleId: "sch-prepaid-rollforward",
    noteId: "note-prepaid",
    scheduleTitle: "Prepaid Expenses Rollforward",
    layoutType: "ROLLFORWARD",
    columns: [
      { columnId: "col-0", label: "Opening", role: "SYSTEM", widthPx: 100, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Additions", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "Amortization", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "Closing", role: "SYSTEM", widthPx: 100, orderIndex: 3, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-ins", label: "Insurance", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-sw", label: "Software subscriptions", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-rent", label: "Rent deposits", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-other", label: "Other", role: "DATA", heightPx: 32, orderIndex: 3, hidden: false, locked: false },
      { rowId: "row-total", label: "Total", role: "TOTAL", heightPx: 36, orderIndex: 4, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-ins": { "col-0": 180000, "col-1": 195000, "col-2": -185000, "col-3": 190000 },
      "row-sw": { "col-0": 120000, "col-1": 140000, "col-2": -125000, "col-3": 135000 },
      "row-rent": { "col-0": 50000, "col-1": 15000, "col-2": -5000, "col-3": 60000 },
      "row-other": { "col-0": 30000, "col-1": 25000, "col-2": -15000, "col-3": 40000 },
      "row-total": { "col-0": 380000, "col-1": 375000, "col-2": -330000, "col-3": 425000 },
    },
    templateId: "tmpl-rollforward-standard",
    supportAttachments: [],
    createdAt: "2024-07-01T10:00:00Z",
    updatedAt: "2024-12-21T11:00:00Z",
  },
  {
    scheduleId: "sch-cogs-breakdown",
    noteId: "note-cogs",
    scheduleTitle: "Cost of Goods Sold Breakdown",
    layoutType: "COMPOSITION",
    columns: [
      { columnId: "col-0", label: "2024", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "2023", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    rows: [
      { rowId: "row-mat", label: "Direct materials", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-labor", label: "Direct labor", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-oh", label: "Manufacturing overhead", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total COGS", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-mat": { "col-0": 3750000, "col-1": 3500000 },
      "row-labor": { "col-0": 2250000, "col-1": 2100000 },
      "row-oh": { "col-0": 1500000, "col-1": 1350000 },
      "row-total": { "col-0": 7500000, "col-1": 6950000 },
    },
    templateId: "tmpl-composition",
    supportAttachments: [],
    createdAt: "2024-07-15T08:00:00Z",
    updatedAt: "2024-12-18T15:00:00Z",
  },
  {
    scheduleId: "sch-opex-breakdown",
    noteId: "note-opex",
    scheduleTitle: "Operating Expenses by Category",
    layoutType: "COMPOSITION",
    columns: [
      { columnId: "col-0", label: "2024", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "2023", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    rows: [
      { rowId: "row-sga", label: "Selling, general & administrative", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-rd", label: "Research & development", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-da", label: "Depreciation & amortization", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total operating expenses", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-sga": { "col-0": 2100000, "col-1": 1950000 },
      "row-rd": { "col-0": 850000, "col-1": 780000 },
      "row-da": { "col-0": 875000, "col-1": 820000 },
      "row-total": { "col-0": 3825000, "col-1": 3550000 },
    },
    templateId: "tmpl-composition",
    supportAttachments: [],
    createdAt: "2024-07-20T09:00:00Z",
    updatedAt: "2024-12-19T16:00:00Z",
  },
  {
    scheduleId: "sch-goodwill-impairment",
    noteId: "note-goodwill",
    scheduleTitle: "Goodwill by Reporting Unit",
    layoutType: "COMPOSITION",
    columns: [
      { columnId: "col-0", label: "2024", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "2023", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    rows: [
      { rowId: "row-product", label: "Product segment", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-service", label: "Service segment", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-total", label: "Total goodwill", role: "TOTAL", heightPx: 36, orderIndex: 2, hidden: false, locked: true },
    ],
    textBlocks: [{ textBlockId: "tb-1", position: 0, span: "FULL_WIDTH", content: "Tested annually for impairment; no impairment recognized", style: "NOTE" }],
    cellValues: {
      "row-product": { "col-0": 500000, "col-1": 500000 },
      "row-service": { "col-0": 300000, "col-1": 300000 },
      "row-total": { "col-0": 800000, "col-1": 800000 },
    },
    templateId: "tmpl-composition",
    supportAttachments: [],
    createdAt: "2024-08-01T10:00:00Z",
    updatedAt: "2024-12-18T14:00:00Z",
  },
  {
    scheduleId: "sch-ap-aging",
    noteId: "note-ap",
    scheduleTitle: "Trade Payables Aging Analysis",
    layoutType: "TIMING_MATURITY",
    columns: [
      { columnId: "col-0", label: "Current", role: "USER", widthPx: 100, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "1-30 Days", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "31-60 Days", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: ">60 Days", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: "Total", role: "SYSTEM", widthPx: 120, orderIndex: 4, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-trade", label: "Trade payables", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-accrued", label: "Accrued purchases", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-total", label: "Total payables", role: "TOTAL", heightPx: 36, orderIndex: 2, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-trade": { "col-0": 1200000, "col-1": 350000, "col-2": 45000, "col-3": 5000, "col-4": 1600000 },
      "row-accrued": { "col-0": 225000, "col-1": 15000, "col-2": 5000, "col-3": 5000, "col-4": 250000 },
      "row-total": { "col-0": 1425000, "col-1": 365000, "col-2": 50000, "col-3": 10000, "col-4": 1850000 },
    },
    templateId: "tmpl-maturity",
    supportAttachments: [],
    createdAt: "2024-08-15T09:00:00Z",
    updatedAt: "2024-12-21T10:00:00Z",
  },
  {
    scheduleId: "sch-accruals-rollforward",
    noteId: "note-accruals",
    scheduleTitle: "Accrued Liabilities Rollforward",
    layoutType: "ROLLFORWARD",
    columns: [
      { columnId: "col-0", label: "Opening", role: "SYSTEM", widthPx: 100, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Additions", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "Payments", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "Closing", role: "SYSTEM", widthPx: 100, orderIndex: 3, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-payroll", label: "Payroll & benefits", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-bonus", label: "Bonuses", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-pto", label: "Vacation & PTO", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-prof", label: "Professional fees", role: "DATA", heightPx: 32, orderIndex: 3, hidden: false, locked: false },
      { rowId: "row-total", label: "Total", role: "TOTAL", heightPx: 36, orderIndex: 4, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-payroll": { "col-0": 420000, "col-1": 5200000, "col-2": -5150000, "col-3": 470000 },
      "row-bonus": { "col-0": 180000, "col-1": 250000, "col-2": -180000, "col-3": 250000 },
      "row-pto": { "col-0": 125000, "col-1": 180000, "col-2": -165000, "col-3": 140000 },
      "row-prof": { "col-0": 75000, "col-1": 120000, "col-2": -155000, "col-3": 40000 },
      "row-total": { "col-0": 800000, "col-1": 5750000, "col-2": -5650000, "col-3": 900000 },
    },
    templateId: "tmpl-rollforward-standard",
    supportAttachments: [],
    createdAt: "2024-08-20T10:00:00Z",
    updatedAt: "2024-12-19T15:00:00Z",
  },
  {
    scheduleId: "sch-debt-rollforward",
    noteId: "note-debt",
    scheduleTitle: "Borrowings Rollforward",
    layoutType: "ROLLFORWARD",
    columns: [
      { columnId: "col-0", label: "Opening", role: "SYSTEM", widthPx: 100, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Drawdowns", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "Repayments", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "Closing", role: "SYSTEM", widthPx: 100, orderIndex: 3, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-term-a", label: "Term Loan A", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-term-b", label: "Term Loan B", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-total", label: "Total borrowings", role: "TOTAL", heightPx: 36, orderIndex: 2, hidden: false, locked: true },
      { rowId: "row-curr", label: "Less: Current portion", role: "DATA", heightPx: 32, orderIndex: 3, hidden: false, locked: false },
      { rowId: "row-lt", label: "Long-term borrowings", role: "TOTAL", heightPx: 36, orderIndex: 4, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-term-a": { "col-0": 2500000, "col-1": 0, "col-2": -300000, "col-3": 2200000 },
      "row-term-b": { "col-0": 1700000, "col-1": 0, "col-2": -200000, "col-3": 1500000 },
      "row-total": { "col-0": 4200000, "col-1": 0, "col-2": -500000, "col-3": 3700000 },
      "row-curr": { "col-0": -500000, "col-1": 0, "col-2": 0, "col-3": -500000 },
      "row-lt": { "col-0": 3700000, "col-1": 0, "col-2": -500000, "col-3": 3200000 },
    },
    templateId: "tmpl-rollforward-standard",
    supportAttachments: [],
    createdAt: "2024-09-01T08:00:00Z",
    updatedAt: "2024-12-20T11:00:00Z",
  },
  {
    scheduleId: "sch-debt-maturity",
    noteId: "note-debt",
    scheduleTitle: "Debt Maturity Schedule",
    layoutType: "TIMING_MATURITY",
    columns: [
      { columnId: "col-0", label: "< 1 Year", role: "USER", widthPx: 100, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "1-2 Years", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "2-5 Years", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "> 5 Years", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: "Total", role: "SYSTEM", widthPx: 120, orderIndex: 4, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-term-a", label: "Term Loan A", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-term-b", label: "Term Loan B", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-total", label: "Total", role: "TOTAL", heightPx: 36, orderIndex: 2, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-term-a": { "col-0": 300000, "col-1": 300000, "col-2": 1600000, "col-3": 0, "col-4": 2200000 },
      "row-term-b": { "col-0": 200000, "col-1": 1300000, "col-2": 0, "col-3": 0, "col-4": 1500000 },
      "row-total": { "col-0": 500000, "col-1": 1600000, "col-2": 1600000, "col-3": 0, "col-4": 3700000 },
    },
    templateId: "tmpl-maturity",
    supportAttachments: [],
    createdAt: "2024-09-01T09:00:00Z",
    updatedAt: "2024-12-20T12:00:00Z",
  },
  {
    scheduleId: "sch-tax-provision",
    noteId: "note-tax",
    scheduleTitle: "Income Tax Expense",
    layoutType: "COMPOSITION",
    columns: [
      { columnId: "col-0", label: "2024", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "2023", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    rows: [
      { rowId: "row-curr-fed", label: "Current - Federal", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-curr-state", label: "Current - State", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-curr-total", label: "Total current", role: "SUBTOTAL", heightPx: 32, orderIndex: 2, hidden: false, locked: true },
      { rowId: "row-def-fed", label: "Deferred - Federal", role: "DATA", heightPx: 32, orderIndex: 3, hidden: false, locked: false },
      { rowId: "row-def-state", label: "Deferred - State", role: "DATA", heightPx: 32, orderIndex: 4, hidden: false, locked: false },
      { rowId: "row-def-total", label: "Total deferred", role: "SUBTOTAL", heightPx: 32, orderIndex: 5, hidden: false, locked: true },
      { rowId: "row-total", label: "Total tax expense", role: "TOTAL", heightPx: 36, orderIndex: 6, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-curr-fed": { "col-0": 210000, "col-1": 145000 },
      "row-curr-state": { "col-0": 35000, "col-1": 25000 },
      "row-curr-total": { "col-0": 245000, "col-1": 170000 },
      "row-def-fed": { "col-0": 25000, "col-1": 12000 },
      "row-def-state": { "col-0": 5000, "col-1": 3000 },
      "row-def-total": { "col-0": 30000, "col-1": 15000 },
      "row-total": { "col-0": 275000, "col-1": 185000 },
    },
    templateId: "tmpl-composition",
    supportAttachments: [],
    createdAt: "2024-09-15T09:00:00Z",
    updatedAt: "2024-12-19T17:00:00Z",
  },
  {
    scheduleId: "sch-deferred-tax",
    noteId: "note-tax",
    scheduleTitle: "Deferred Tax Assets and Liabilities",
    layoutType: "GROSS_TO_NET",
    columns: [
      { columnId: "col-0", label: "Gross Amount", role: "SYSTEM", widthPx: 120, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Valuation Allowance", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "Net Amount", role: "SYSTEM", widthPx: 120, orderIndex: 2, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-dta-nol", label: "DTA - NOL carryforwards", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-dta-accr", label: "DTA - Accruals", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-dta-total", label: "Total DTA", role: "SUBTOTAL", heightPx: 32, orderIndex: 2, hidden: false, locked: true },
      { rowId: "row-dtl-da", label: "DTL - Depreciation", role: "DATA", heightPx: 32, orderIndex: 3, hidden: false, locked: false },
      { rowId: "row-dtl-intang", label: "DTL - Intangibles", role: "DATA", heightPx: 32, orderIndex: 4, hidden: false, locked: false },
      { rowId: "row-dtl-total", label: "Total DTL", role: "SUBTOTAL", heightPx: 32, orderIndex: 5, hidden: false, locked: true },
      { rowId: "row-net", label: "Net deferred tax", role: "TOTAL", heightPx: 36, orderIndex: 6, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-dta-nol": { "col-0": 150000, "col-1": 0, "col-2": 150000 },
      "row-dta-accr": { "col-0": 150000, "col-1": 0, "col-2": 150000 },
      "row-dta-total": { "col-0": 300000, "col-1": 0, "col-2": 300000 },
      "row-dtl-da": { "col-0": -350000, "col-1": 0, "col-2": -350000 },
      "row-dtl-intang": { "col-0": -250000, "col-1": 0, "col-2": -250000 },
      "row-dtl-total": { "col-0": -600000, "col-1": 0, "col-2": -600000 },
      "row-net": { "col-0": -300000, "col-1": 0, "col-2": -300000 },
    },
    templateId: "tmpl-gross-to-net",
    supportAttachments: [],
    createdAt: "2024-09-15T10:00:00Z",
    updatedAt: "2024-12-19T18:00:00Z",
  },
  {
    scheduleId: "sch-equity-rollforward",
    noteId: "note-equity",
    scheduleTitle: "Stockholders Equity Rollforward",
    layoutType: "MOVEMENT_BY_CATEGORY",
    columns: [
      { columnId: "col-0", label: "Component", role: "SYSTEM", widthPx: 150, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Opening", role: "SYSTEM", widthPx: 100, orderIndex: 1, hidden: false, locked: true },
      { columnId: "col-2", label: "Net Income", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "Dividends", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: "Stock Comp", role: "USER", widthPx: 100, orderIndex: 4, hidden: false, locked: false },
      { columnId: "col-5", label: "Other", role: "USER", widthPx: 100, orderIndex: 5, hidden: false, locked: false },
      { columnId: "col-6", label: "Closing", role: "SYSTEM", widthPx: 100, orderIndex: 6, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-common", label: "Common stock", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-apic", label: "APIC", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-re", label: "Retained earnings", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-aoci", label: "AOCI", role: "DATA", heightPx: 32, orderIndex: 3, hidden: false, locked: false },
      { rowId: "row-total", label: "Total equity", role: "TOTAL", heightPx: 36, orderIndex: 4, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-common": { "col-0": "Common Stock", "col-1": 50000, "col-2": 0, "col-3": 0, "col-4": 0, "col-5": 0, "col-6": 50000 },
      "row-apic": { "col-0": "APIC", "col-1": 3200000, "col-2": 0, "col-3": 0, "col-4": 250000, "col-5": 50000, "col-6": 3500000 },
      "row-re": { "col-0": "Retained Earnings", "col-1": 3700000, "col-2": 825000, "col-3": -175000, "col-4": 0, "col-5": 500000, "col-6": 4850000 },
      "row-aoci": { "col-0": "AOCI", "col-1": -100000, "col-2": 0, "col-3": 0, "col-4": 0, "col-5": 0, "col-6": -100000 },
      "row-total": { "col-0": "Total", "col-1": 6850000, "col-2": 825000, "col-3": -175000, "col-4": 250000, "col-5": 550000, "col-6": 8300000 },
    },
    templateId: "tmpl-movement-by-category",
    supportAttachments: [],
    createdAt: "2024-09-20T10:00:00Z",
    updatedAt: "2024-12-20T16:00:00Z",
  },
  {
    scheduleId: "sch-oci-components",
    noteId: "note-oci",
    scheduleTitle: "Other Comprehensive Income Components",
    layoutType: "COMPOSITION",
    columns: [
      { columnId: "col-0", label: "2024", role: "USER", widthPx: 120, orderIndex: 0, hidden: false, locked: false },
      { columnId: "col-1", label: "2023", role: "USER", widthPx: 120, orderIndex: 1, hidden: false, locked: false },
    ],
    rows: [
      { rowId: "row-fx", label: "Foreign currency translation", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-hedge", label: "Cash flow hedges", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-pension", label: "Pension adjustments", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total OCI", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-fx": { "col-0": 15000, "col-1": -25000 },
      "row-hedge": { "col-0": -5000, "col-1": 10000 },
      "row-pension": { "col-0": -10000, "col-1": -15000 },
      "row-total": { "col-0": 0, "col-1": -30000 },
    },
    templateId: "tmpl-composition",
    supportAttachments: [],
    createdAt: "2024-10-01T08:00:00Z",
    updatedAt: "2024-12-18T13:00:00Z",
  },
  {
    scheduleId: "sch-inventory-rollforward",
    noteId: "note-inventory",
    scheduleTitle: "Inventory Rollforward by Category",
    layoutType: "ROLLFORWARD",
    columns: [
      { columnId: "col-0", label: "Opening", role: "SYSTEM", widthPx: 100, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Purchases", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "Usage/COGS", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "Write-downs", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: "Closing", role: "SYSTEM", widthPx: 100, orderIndex: 4, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-raw", label: "Raw materials", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-wip", label: "Work in progress", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-fg", label: "Finished goods", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total inventory", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-raw": { "col-0": 220000, "col-1": 3200000, "col-2": -3160000, "col-3": -15000, "col-4": 245000 },
      "row-wip": { "col-0": 165000, "col-1": 0, "col-2": 15000, "col-3": 0, "col-4": 180000 },
      "row-fg": { "col-0": 430000, "col-1": 0, "col-2": 45000, "col-3": -10000, "col-4": 465000 },
      "row-total": { "col-0": 815000, "col-1": 3200000, "col-2": -3100000, "col-3": -25000, "col-4": 890000 },
    },
    templateId: "tmpl-rollforward-standard",
    supportAttachments: [],
    createdAt: "2024-06-20T09:00:00Z",
    updatedAt: "2024-12-19T11:00:00Z",
  },
  {
    scheduleId: "sch-rou-rollforward",
    noteId: "note-leases",
    scheduleTitle: "Right-of-Use Assets Rollforward",
    layoutType: "ROLLFORWARD",
    columns: [
      { columnId: "col-0", label: "Opening", role: "SYSTEM", widthPx: 100, orderIndex: 0, hidden: false, locked: true },
      { columnId: "col-1", label: "Additions", role: "USER", widthPx: 100, orderIndex: 1, hidden: false, locked: false },
      { columnId: "col-2", label: "Depreciation", role: "USER", widthPx: 100, orderIndex: 2, hidden: false, locked: false },
      { columnId: "col-3", label: "Modifications", role: "USER", widthPx: 100, orderIndex: 3, hidden: false, locked: false },
      { columnId: "col-4", label: "Closing", role: "SYSTEM", widthPx: 100, orderIndex: 4, hidden: false, locked: true },
    ],
    rows: [
      { rowId: "row-property", label: "Property leases", role: "DATA", heightPx: 32, orderIndex: 0, hidden: false, locked: false },
      { rowId: "row-equipment", label: "Equipment leases", role: "DATA", heightPx: 32, orderIndex: 1, hidden: false, locked: false },
      { rowId: "row-vehicles", label: "Vehicle leases", role: "DATA", heightPx: 32, orderIndex: 2, hidden: false, locked: false },
      { rowId: "row-total", label: "Total ROU assets", role: "TOTAL", heightPx: 36, orderIndex: 3, hidden: false, locked: true },
    ],
    textBlocks: [],
    cellValues: {
      "row-property": { "col-0": 1850000, "col-1": 150000, "col-2": -350000, "col-3": 50000, "col-4": 1700000 },
      "row-equipment": { "col-0": 350000, "col-1": 50000, "col-2": -100000, "col-3": 0, "col-4": 300000 },
      "row-vehicles": { "col-0": 100000, "col-1": 25000, "col-2": -25000, "col-3": 0, "col-4": 100000 },
      "row-total": { "col-0": 2300000, "col-1": 225000, "col-2": -475000, "col-3": 50000, "col-4": 2100000 },
    },
    templateId: "tmpl-rollforward-standard",
    supportAttachments: [],
    createdAt: "2024-07-10T10:00:00Z",
    updatedAt: "2024-12-18T16:00:00Z",
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
  // ========== NEW DISCLOSURE NOTES FOR ALL FS LINE ITEMS ==========
  {
    noteId: "note-cash",
    noteNumber: "4",
    noteTitle: "Cash and Cash Equivalents",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-cash"],
    scheduleIds: ["sch-cash-composition"],
    narrativeBlockIds: ["narr-cash-1"],
    status: "APPROVED",
    owner: "Treasury Analyst",
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
  },
  {
    noteId: "note-ar",
    noteNumber: "5",
    noteTitle: "Trade and Other Receivables",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-ar"],
    scheduleIds: ["sch-ar-aging"],
    narrativeBlockIds: ["narr-ar-1"],
    status: "UNDER_REVIEW",
    owner: "Credit Manager",
    createdAt: "2024-06-15T09:00:00Z",
    updatedAt: "2024-12-19T14:00:00Z",
  },
  {
    noteId: "note-prepaid",
    noteNumber: "7",
    noteTitle: "Prepaid Expenses",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-prepaid"],
    scheduleIds: ["sch-prepaid-rollforward"],
    narrativeBlockIds: ["narr-prepaid-1"],
    status: "DRAFT",
    owner: "Staff Accountant",
    createdAt: "2024-07-01T10:00:00Z",
    updatedAt: "2024-12-21T11:00:00Z",
  },
  {
    noteId: "note-cogs",
    noteNumber: "8",
    noteTitle: "Cost of Goods Sold",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["is-cogs"],
    scheduleIds: ["sch-cogs-breakdown"],
    narrativeBlockIds: ["narr-cogs-1"],
    status: "APPROVED",
    owner: "Cost Accountant",
    createdAt: "2024-07-15T08:00:00Z",
    updatedAt: "2024-12-18T15:00:00Z",
  },
  {
    noteId: "note-opex",
    noteNumber: "9",
    noteTitle: "Operating Expenses",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["is-sga", "is-rd"],
    scheduleIds: ["sch-opex-breakdown"],
    narrativeBlockIds: ["narr-opex-1"],
    status: "APPROVED",
    owner: "Senior Accountant",
    createdAt: "2024-07-20T09:00:00Z",
    updatedAt: "2024-12-19T16:00:00Z",
  },
  {
    noteId: "note-goodwill",
    noteNumber: "13",
    noteTitle: "Goodwill",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-goodwill"],
    scheduleIds: ["sch-goodwill-impairment"],
    narrativeBlockIds: ["narr-goodwill-1"],
    status: "APPROVED",
    owner: "Controller",
    createdAt: "2024-08-01T10:00:00Z",
    updatedAt: "2024-12-18T14:00:00Z",
  },
  {
    noteId: "note-ap",
    noteNumber: "15",
    noteTitle: "Trade and Other Payables",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-ap"],
    scheduleIds: ["sch-ap-aging"],
    narrativeBlockIds: ["narr-ap-1"],
    status: "UNDER_REVIEW",
    owner: "AP Manager",
    createdAt: "2024-08-15T09:00:00Z",
    updatedAt: "2024-12-21T10:00:00Z",
  },
  {
    noteId: "note-accruals",
    noteNumber: "16",
    noteTitle: "Accrued Liabilities",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-accrued"],
    scheduleIds: ["sch-accruals-rollforward"],
    narrativeBlockIds: ["narr-accruals-1"],
    status: "APPROVED",
    owner: "Senior Accountant",
    createdAt: "2024-08-20T10:00:00Z",
    updatedAt: "2024-12-19T15:00:00Z",
  },
  {
    noteId: "note-debt",
    noteNumber: "17",
    noteTitle: "Borrowings",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-lt-debt", "bs-curr-debt"],
    scheduleIds: ["sch-debt-rollforward", "sch-debt-maturity"],
    narrativeBlockIds: ["narr-debt-1"],
    status: "APPROVED",
    owner: "Treasury Manager",
    createdAt: "2024-09-01T08:00:00Z",
    updatedAt: "2024-12-20T11:00:00Z",
  },
  {
    noteId: "note-tax",
    noteNumber: "19",
    noteTitle: "Income Taxes",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["is-tax", "bs-dti"],
    scheduleIds: ["sch-tax-provision", "sch-deferred-tax"],
    narrativeBlockIds: ["narr-tax-1"],
    status: "APPROVED",
    owner: "Tax Manager",
    createdAt: "2024-09-15T09:00:00Z",
    updatedAt: "2024-12-19T17:00:00Z",
  },
  {
    noteId: "note-equity",
    noteNumber: "21",
    noteTitle: "Share Capital and Reserves",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-common", "bs-apic", "bs-retained"],
    scheduleIds: ["sch-equity-rollforward"],
    narrativeBlockIds: ["narr-equity-1"],
    status: "APPROVED",
    owner: "Controller",
    createdAt: "2024-09-20T10:00:00Z",
    updatedAt: "2024-12-20T16:00:00Z",
  },
  {
    noteId: "note-oci",
    noteNumber: "22",
    noteTitle: "Other Comprehensive Income",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-aoci"],
    scheduleIds: ["sch-oci-components"],
    narrativeBlockIds: ["narr-oci-1"],
    status: "DRAFT",
    owner: "Senior Accountant",
    createdAt: "2024-10-01T08:00:00Z",
    updatedAt: "2024-12-18T13:00:00Z",
  },
  {
    noteId: "note-inventory",
    noteNumber: "6",
    noteTitle: "Inventories",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-inventory"],
    scheduleIds: ["sch-inventory-rollforward"],
    narrativeBlockIds: ["narr-inventory-1"],
    status: "APPROVED",
    owner: "Inventory Controller",
    createdAt: "2024-06-20T09:00:00Z",
    updatedAt: "2024-12-19T11:00:00Z",
  },
  {
    noteId: "note-leases",
    noteNumber: "12",
    noteTitle: "Leases",
    periodId: "FY2024",
    framework: "BOTH",
    linkedStatementLines: ["bs-rou", "bs-curr-lease", "bs-lt-lease"],
    scheduleIds: ["sch-lease-maturity", "sch-rou-rollforward"],
    narrativeBlockIds: ["narr-leases-1"],
    status: "APPROVED",
    owner: "Lease Accountant",
    createdAt: "2024-07-10T10:00:00Z",
    updatedAt: "2024-12-18T16:00:00Z",
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
  // ========== NEW NARRATIVES FOR ALL FS LINE ITEMS ==========
  {
    narrativeId: "narr-cash-1",
    noteId: "note-cash",
    linkedScheduleIds: ["sch-cash-composition"],
    linkedMovements: [],
    content: "Cash and cash equivalents include cash at bank and highly liquid investments with original maturities of three months or less. The Company maintains cash balances at major financial institutions. At December 31, 2024, cash increased by $400,000 primarily driven by strong operating cash flows offset by debt repayments and capital expenditures.",
    owner: "Treasury Analyst",
    status: "APPROVED",
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
  },
  {
    narrativeId: "narr-ar-1",
    noteId: "note-ar",
    linkedScheduleIds: ["sch-ar-aging"],
    linkedMovements: [],
    content: "Trade receivables are recognized at the original invoice amount less an allowance for expected credit losses. The allowance is based on the expected credit loss model, considering historical loss rates, current conditions, and forward-looking economic factors. The allowance for doubtful accounts increased by $65,000 during the year to reflect changes in customer credit risk profiles.",
    owner: "Credit Manager",
    status: "UNDER_REVIEW",
    createdAt: "2024-11-05T10:00:00Z",
    updatedAt: "2024-12-19T14:00:00Z",
  },
  {
    narrativeId: "narr-prepaid-1",
    noteId: "note-prepaid",
    linkedScheduleIds: ["sch-prepaid-rollforward"],
    linkedMovements: [],
    content: "Prepaid expenses primarily consist of insurance premiums, software subscription costs, and rent deposits. These amounts are amortized over the period of benefit, typically 12 months or less. The increase in prepaid expenses is primarily due to timing of annual insurance renewals and new software subscriptions.",
    owner: "Staff Accountant",
    status: "DRAFT",
    createdAt: "2024-11-10T11:00:00Z",
    updatedAt: "2024-12-21T11:00:00Z",
  },
  {
    narrativeId: "narr-cogs-1",
    noteId: "note-cogs",
    linkedScheduleIds: ["sch-cogs-breakdown"],
    linkedMovements: [],
    content: "Cost of goods sold includes direct materials, direct labor, and manufacturing overhead costs. Inventory is valued at the lower of cost (using first-in, first-out method) or net realizable value. The gross margin remained stable at 40.0% compared to 38.8% in the prior year, reflecting improved procurement practices and manufacturing efficiencies.",
    owner: "Cost Accountant",
    status: "APPROVED",
    createdAt: "2024-11-15T08:00:00Z",
    updatedAt: "2024-12-18T15:00:00Z",
  },
  {
    narrativeId: "narr-opex-1",
    noteId: "note-opex",
    linkedScheduleIds: ["sch-opex-breakdown"],
    linkedMovements: [],
    content: "Operating expenses increased by 7.7% year-over-year, primarily driven by investments in sales and marketing to support business growth. Research and development spending increased to support new product development initiatives. The Company maintained disciplined expense management with operating expenses at 30.6% of revenue.",
    owner: "Senior Accountant",
    status: "APPROVED",
    createdAt: "2024-11-18T09:00:00Z",
    updatedAt: "2024-12-19T16:00:00Z",
  },
  {
    narrativeId: "narr-goodwill-1",
    noteId: "note-goodwill",
    linkedScheduleIds: ["sch-goodwill-impairment"],
    linkedMovements: [],
    content: "Goodwill is tested for impairment annually in the fourth quarter or whenever indicators of impairment exist. The Company performed its annual impairment test using a qualitative assessment and determined that it was more likely than not that the fair value of each reporting unit exceeded its carrying amount. No impairment was recognized during the year.",
    owner: "Controller",
    status: "APPROVED",
    createdAt: "2024-11-20T10:00:00Z",
    updatedAt: "2024-12-18T14:00:00Z",
  },
  {
    narrativeId: "narr-ap-1",
    noteId: "note-ap",
    linkedScheduleIds: ["sch-ap-aging"],
    linkedMovements: [],
    content: "Trade payables represent amounts due to suppliers for goods and services purchased in the ordinary course of business. The Company maintains standard payment terms of 30-60 days. Trade payables increased by $200,000 due to higher purchasing activity to support revenue growth and the timing of year-end shipments.",
    owner: "AP Manager",
    status: "UNDER_REVIEW",
    createdAt: "2024-11-22T09:00:00Z",
    updatedAt: "2024-12-21T10:00:00Z",
  },
  {
    narrativeId: "narr-accruals-1",
    noteId: "note-accruals",
    linkedScheduleIds: ["sch-accruals-rollforward"],
    linkedMovements: [],
    content: "Accrued liabilities include amounts for payroll, employee benefits, bonuses, vacation, and other obligations incurred but not yet paid. The increase in accrued liabilities is primarily attributable to higher bonus accruals based on improved company performance and timing of payroll cycles at year-end.",
    owner: "Senior Accountant",
    status: "APPROVED",
    createdAt: "2024-11-25T10:00:00Z",
    updatedAt: "2024-12-19T15:00:00Z",
  },
  {
    narrativeId: "narr-debt-1",
    noteId: "note-debt",
    linkedScheduleIds: ["sch-debt-rollforward", "sch-debt-maturity"],
    linkedMovements: [],
    content: "The Company has term loan facilities with scheduled quarterly principal payments. Term Loan A bears interest at SOFR plus 2.5% and matures in December 2027. Term Loan B bears interest at a fixed rate of 6.5% and matures in June 2026. The Company was in compliance with all debt covenants at December 31, 2024. Total debt decreased by $500,000 due to scheduled principal repayments.",
    owner: "Treasury Manager",
    status: "APPROVED",
    createdAt: "2024-11-28T08:00:00Z",
    updatedAt: "2024-12-20T11:00:00Z",
  },
  {
    narrativeId: "narr-tax-1",
    noteId: "note-tax",
    linkedScheduleIds: ["sch-tax-provision", "sch-deferred-tax"],
    linkedMovements: [],
    content: "The provision for income taxes is based on pretax income and applicable statutory rates in the jurisdictions in which the Company operates. The effective tax rate of 25.0% is consistent with the prior year and reflects the federal statutory rate of 21% plus state income taxes. Deferred tax assets and liabilities arise from temporary differences between financial statement and tax bases of assets and liabilities.",
    owner: "Tax Manager",
    status: "APPROVED",
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2024-12-19T17:00:00Z",
  },
  {
    narrativeId: "narr-equity-1",
    noteId: "note-equity",
    linkedScheduleIds: ["sch-equity-rollforward"],
    linkedMovements: [],
    content: "Total stockholders' equity increased by $1,450,000 during the year, primarily driven by net income of $825,000, stock-based compensation of $250,000, and a prior period adjustment of $500,000, partially offset by dividends of $175,000. The Company has authorized 10,000,000 shares of common stock, par value $0.01, with 5,000,000 shares issued and outstanding.",
    owner: "Controller",
    status: "APPROVED",
    createdAt: "2024-12-05T10:00:00Z",
    updatedAt: "2024-12-20T16:00:00Z",
  },
  {
    narrativeId: "narr-oci-1",
    noteId: "note-oci",
    linkedScheduleIds: ["sch-oci-components"],
    linkedMovements: [],
    content: "Other comprehensive income (loss) consists of foreign currency translation adjustments, unrealized gains and losses on cash flow hedges, and actuarial adjustments on defined benefit pension plans. Total OCI for the year was zero, reflecting offsetting gains from currency translation and losses from pension adjustments.",
    owner: "Senior Accountant",
    status: "DRAFT",
    createdAt: "2024-12-10T08:00:00Z",
    updatedAt: "2024-12-18T13:00:00Z",
  },
  {
    narrativeId: "narr-inventory-1",
    noteId: "note-inventory",
    linkedScheduleIds: ["sch-inventory-rollforward"],
    linkedMovements: [],
    content: "Inventories are stated at the lower of cost (using the first-in, first-out method) or net realizable value. The Company regularly reviews inventory for excess, obsolete, or slow-moving items. During the year, inventory write-downs of $25,000 were recognized. Inventory increased by $75,000 reflecting higher production volumes to support anticipated sales growth.",
    owner: "Inventory Controller",
    status: "APPROVED",
    createdAt: "2024-11-08T09:00:00Z",
    updatedAt: "2024-12-19T11:00:00Z",
  },
  {
    narrativeId: "narr-leases-1",
    noteId: "note-leases",
    linkedScheduleIds: ["sch-rou-rollforward", "sch-lease-maturity"],
    linkedMovements: [],
    content: "The Company leases office space, equipment, and vehicles under operating and finance leases. Right-of-use assets and lease liabilities are recognized at lease commencement based on the present value of remaining lease payments. The weighted-average remaining lease term is 5.2 years and the weighted-average discount rate is 5.5%. Total lease expense for the year was $625,000.",
    owner: "Lease Accountant",
    status: "APPROVED",
    createdAt: "2024-11-12T10:00:00Z",
    updatedAt: "2024-12-18T16:00:00Z",
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

// Sample TB Lines with net amounts (DR positive, CR negative)
export const sampleTBLines: TBLine[] = [
  // Current Assets (Debit balances = positive)
  { lineId: "tb-1010", accountId: "gl-1010", accountCode: "1010", accountName: "Cash and Cash Equivalents", fsCategory: "CURRENT_ASSETS", footnoteIds: ["fn-1"], footnoteDescription: "Cash held at banks", normalBalance: "DEBIT", openingBalance: 2450000, amounts: { "col-period": 400000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 2850000, orderIndex: 1 },
  { lineId: "tb-1100", accountId: "gl-1100", accountCode: "1100", accountName: "Accounts Receivable", fsCategory: "CURRENT_ASSETS", footnoteIds: ["fn-2"], footnoteDescription: "Trade receivables", normalBalance: "DEBIT", openingBalance: 3200000, amounts: { "col-period": 400000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 3600000, orderIndex: 2 },
  { lineId: "tb-1150", accountId: "gl-1150", accountCode: "1150", accountName: "Allowance for Doubtful Accounts", fsCategory: "CURRENT_ASSETS", footnoteIds: [], footnoteDescription: null, normalBalance: "CREDIT", openingBalance: -135000, amounts: { "col-period": -15000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -150000, orderIndex: 3 },
  { lineId: "tb-1200", accountId: "gl-1200", accountCode: "1200", accountName: "Inventory", fsCategory: "CURRENT_ASSETS", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 815000, amounts: { "col-period": 75000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 890000, orderIndex: 4 },
  { lineId: "tb-1300", accountId: "gl-1300", accountCode: "1300", accountName: "Prepaid Expenses", fsCategory: "CURRENT_ASSETS", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 580000, amounts: { "col-period": 45000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 625000, orderIndex: 5 },
  { lineId: "tb-1350", accountId: "gl-1350", accountCode: "1350", accountName: "Other Current Assets", fsCategory: "CURRENT_ASSETS", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 500000, amounts: { "col-period": 50000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 550000, orderIndex: 6 },
  // Non-Current Assets
  { lineId: "tb-1500", accountId: "gl-1500", accountCode: "1500", accountName: "Property, Plant & Equipment", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-3"], footnoteDescription: "Gross carrying value of PPE", normalBalance: "DEBIT", openingBalance: 8200000, amounts: { "col-period": 550000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 8750000, orderIndex: 7 },
  { lineId: "tb-1550", accountId: "gl-1550", accountCode: "1550", accountName: "Accumulated Depreciation - PPE", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-3"], footnoteDescription: "Accumulated depreciation", normalBalance: "CREDIT", openingBalance: -2850000, amounts: { "col-period": -630000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -3480000, orderIndex: 8 },
  { lineId: "tb-1600", accountId: "gl-1600", accountCode: "1600", accountName: "Intangible Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-4"], footnoteDescription: "Software and licenses", normalBalance: "DEBIT", openingBalance: 2200000, amounts: { "col-period": 175000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 2375000, orderIndex: 9 },
  { lineId: "tb-1650", accountId: "gl-1650", accountCode: "1650", accountName: "Accumulated Amortization - Intangibles", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-4"], footnoteDescription: "Accumulated amortization", normalBalance: "CREDIT", openingBalance: -400000, amounts: { "col-period": -225000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -625000, orderIndex: 10 },
  { lineId: "tb-1700", accountId: "gl-1700", accountCode: "1700", accountName: "Right-of-Use Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-5"], footnoteDescription: "Operating lease ROU assets", normalBalance: "DEBIT", openingBalance: 2500000, amounts: { "col-period": 100000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 2600000, orderIndex: 11 },
  { lineId: "tb-1750", accountId: "gl-1750", accountCode: "1750", accountName: "Accumulated Depreciation - ROU", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-5"], footnoteDescription: "ROU depreciation", normalBalance: "CREDIT", openingBalance: -350000, amounts: { "col-period": -150000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -500000, orderIndex: 12 },
  { lineId: "tb-1800", accountId: "gl-1800", accountCode: "1800", accountName: "Deferred Tax Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-7"], footnoteDescription: "Net deferred tax assets", normalBalance: "DEBIT", openingBalance: 285000, amounts: { "col-period": 15000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 300000, orderIndex: 13 },
  // Current Liabilities (Credit balances = negative)
  { lineId: "tb-2010", accountId: "gl-2010", accountCode: "2010", accountName: "Accounts Payable", fsCategory: "CURRENT_LIABILITIES", footnoteIds: [], footnoteDescription: null, normalBalance: "CREDIT", openingBalance: -1280000, amounts: { "col-period": -200000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -1480000, orderIndex: 14 },
  { lineId: "tb-2100", accountId: "gl-2100", accountCode: "2100", accountName: "Accrued Expenses", fsCategory: "CURRENT_LIABILITIES", footnoteIds: [], footnoteDescription: null, normalBalance: "CREDIT", openingBalance: -630000, amounts: { "col-period": -70000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -700000, orderIndex: 15 },
  { lineId: "tb-2150", accountId: "gl-2150", accountCode: "2150", accountName: "Income Taxes Payable", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-7"], footnoteDescription: "Current tax liability", normalBalance: "CREDIT", openingBalance: -210000, amounts: { "col-period": -15000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -225000, orderIndex: 16 },
  { lineId: "tb-2200", accountId: "gl-2200", accountCode: "2200", accountName: "Deferred Revenue - Current", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-2"], footnoteDescription: "Contract liabilities", normalBalance: "CREDIT", openingBalance: -660000, amounts: { "col-period": -40000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -700000, orderIndex: 17 },
  { lineId: "tb-2250", accountId: "gl-2250", accountCode: "2250", accountName: "Current Portion of Long-Term Debt", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-6"], footnoteDescription: "Current maturities", normalBalance: "CREDIT", openingBalance: -500000, amounts: { "col-period": 0, "col-adj": 0, "col-reclass": 0 }, closingBalance: -500000, orderIndex: 18 },
  { lineId: "tb-2300", accountId: "gl-2300", accountCode: "2300", accountName: "Current Lease Liabilities", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-5"], footnoteDescription: "Operating lease obligations", normalBalance: "CREDIT", openingBalance: -175000, amounts: { "col-period": -10000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -185000, orderIndex: 19 },
  // Non-Current Liabilities
  { lineId: "tb-2500", accountId: "gl-2500", accountCode: "2500", accountName: "Long-Term Debt", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-6"], footnoteDescription: "Term loan facility", normalBalance: "CREDIT", openingBalance: -4500000, amounts: { "col-period": 500000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -4000000, orderIndex: 20 },
  { lineId: "tb-2600", accountId: "gl-2600", accountCode: "2600", accountName: "Long-Term Lease Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-5"], footnoteDescription: "Non-current lease obligations", normalBalance: "CREDIT", openingBalance: -1700000, amounts: { "col-period": 85000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -1615000, orderIndex: 21 },
  { lineId: "tb-2700", accountId: "gl-2700", accountCode: "2700", accountName: "Deferred Tax Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-7"], footnoteDescription: "Net deferred tax liabilities", normalBalance: "CREDIT", openingBalance: -565000, amounts: { "col-period": -35000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -600000, orderIndex: 22 },
  { lineId: "tb-2800", accountId: "gl-2800", accountCode: "2800", accountName: "Other Long-Term Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: [], footnoteDescription: null, normalBalance: "CREDIT", openingBalance: -280000, amounts: { "col-period": -20000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -300000, orderIndex: 23 },
  // Equity
  { lineId: "tb-3010", accountId: "gl-3010", accountCode: "3010", accountName: "Common Stock", fsCategory: "EQUITY", footnoteIds: ["fn-8"], footnoteDescription: "Issued and outstanding shares", normalBalance: "CREDIT", openingBalance: -50000, amounts: { "col-period": 0, "col-adj": 0, "col-reclass": 0 }, closingBalance: -50000, orderIndex: 24 },
  { lineId: "tb-3100", accountId: "gl-3100", accountCode: "3100", accountName: "Additional Paid-in Capital", fsCategory: "EQUITY", footnoteIds: ["fn-8"], footnoteDescription: "Share premium", normalBalance: "CREDIT", openingBalance: -3200000, amounts: { "col-period": -300000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -3500000, orderIndex: 25 },
  { lineId: "tb-3200", accountId: "gl-3200", accountCode: "3200", accountName: "Retained Earnings", fsCategory: "EQUITY", footnoteIds: ["fn-8"], footnoteDescription: "Accumulated earnings", normalBalance: "CREDIT", openingBalance: -3345000, amounts: { "col-period": -235000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -3580000, orderIndex: 26 },
  { lineId: "tb-3300", accountId: "gl-3300", accountCode: "3300", accountName: "Accumulated OCI", fsCategory: "EQUITY", footnoteIds: [], footnoteDescription: null, normalBalance: "CREDIT", openingBalance: 100000, amounts: { "col-period": 0, "col-adj": 0, "col-reclass": 0 }, closingBalance: 100000, orderIndex: 27 },
  // Revenue (Credit = negative)
  { lineId: "tb-4010", accountId: "gl-4010", accountCode: "4010", accountName: "Product Revenue", fsCategory: "REVENUE", footnoteIds: ["fn-2"], footnoteDescription: "Revenue from product sales", normalBalance: "CREDIT", openingBalance: 0, amounts: { "col-period": -9500000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -9500000, orderIndex: 28 },
  { lineId: "tb-4100", accountId: "gl-4100", accountCode: "4100", accountName: "Service Revenue", fsCategory: "REVENUE", footnoteIds: ["fn-2"], footnoteDescription: "Revenue from services", normalBalance: "CREDIT", openingBalance: 0, amounts: { "col-period": -2850000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -2850000, orderIndex: 29 },
  { lineId: "tb-4200", accountId: "gl-4200", accountCode: "4200", accountName: "Other Revenue", fsCategory: "OTHER_INCOME", footnoteIds: [], footnoteDescription: null, normalBalance: "CREDIT", openingBalance: 0, amounts: { "col-period": -150000, "col-adj": 0, "col-reclass": 0 }, closingBalance: -150000, orderIndex: 30 },
  // Cost of Sales (Debit = positive)
  { lineId: "tb-5010", accountId: "gl-5010", accountCode: "5010", accountName: "Cost of Goods Sold", fsCategory: "COST_OF_SALES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 5700000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 5700000, orderIndex: 31 },
  { lineId: "tb-5100", accountId: "gl-5100", accountCode: "5100", accountName: "Cost of Services", fsCategory: "COST_OF_SALES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 1650000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 1650000, orderIndex: 32 },
  // Operating Expenses
  { lineId: "tb-6010", accountId: "gl-6010", accountCode: "6010", accountName: "Salaries & Wages", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 1850000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 1850000, orderIndex: 33 },
  { lineId: "tb-6100", accountId: "gl-6100", accountCode: "6100", accountName: "Employee Benefits", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 425000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 425000, orderIndex: 34 },
  { lineId: "tb-6200", accountId: "gl-6200", accountCode: "6200", accountName: "Rent Expense", fsCategory: "OPERATING_EXPENSES", footnoteIds: ["fn-5"], footnoteDescription: "Lease expense", normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 180000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 180000, orderIndex: 35 },
  { lineId: "tb-6300", accountId: "gl-6300", accountCode: "6300", accountName: "Depreciation & Amortization", fsCategory: "OPERATING_EXPENSES", footnoteIds: ["fn-3", "fn-4"], footnoteDescription: "D&A expense", normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 875000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 875000, orderIndex: 36 },
  { lineId: "tb-6400", accountId: "gl-6400", accountCode: "6400", accountName: "Professional Fees", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 215000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 215000, orderIndex: 37 },
  { lineId: "tb-6500", accountId: "gl-6500", accountCode: "6500", accountName: "Marketing & Advertising", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 275000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 275000, orderIndex: 38 },
  { lineId: "tb-6600", accountId: "gl-6600", accountCode: "6600", accountName: "Utilities", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 72000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 72000, orderIndex: 39 },
  { lineId: "tb-6700", accountId: "gl-6700", accountCode: "6700", accountName: "Insurance", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 95000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 95000, orderIndex: 40 },
  { lineId: "tb-6800", accountId: "gl-6800", accountCode: "6800", accountName: "Travel & Entertainment", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 58000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 58000, orderIndex: 41 },
  { lineId: "tb-6900", accountId: "gl-6900", accountCode: "6900", accountName: "Office Supplies & Expenses", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 35000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 35000, orderIndex: 42 },
  // Other Expenses
  { lineId: "tb-7010", accountId: "gl-7010", accountCode: "7010", accountName: "Interest Expense", fsCategory: "OTHER_EXPENSES", footnoteIds: ["fn-6"], footnoteDescription: "Interest on borrowings", normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 280000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 280000, orderIndex: 43 },
  { lineId: "tb-7100", accountId: "gl-7100", accountCode: "7100", accountName: "Other Expense", fsCategory: "OTHER_EXPENSES", footnoteIds: [], footnoteDescription: null, normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 15000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 15000, orderIndex: 44 },
  // Tax
  { lineId: "tb-8010", accountId: "gl-8010", accountCode: "8010", accountName: "Income Tax Expense", fsCategory: "TAX_EXPENSE", footnoteIds: ["fn-7"], footnoteDescription: "Current and deferred tax", normalBalance: "DEBIT", openingBalance: 0, amounts: { "col-period": 325000, "col-adj": 0, "col-reclass": 0 }, closingBalance: 325000, orderIndex: 45 },
];

// Calculate totals (net amounts - should sum to 0 for balanced TB)
const calculateTBTotals = (lines: TBLine[]) => {
  let totalOpening = 0;
  let totalClosing = 0;
  
  lines.forEach(line => {
    totalOpening += line.openingBalance;
    totalClosing += line.closingBalance;
  });
  
  return { totalOpening, totalClosing };
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
  totalOpeningBalance: tbTotals.totalOpening,
  totalClosingBalance: tbTotals.totalClosing,
  isBalanced: Math.abs(tbTotals.totalClosing) < 0.01,
  lastUpdated: "2024-12-31T23:59:59Z",
};

// Sample Split Declarations (for accounts mapped to multiple disclosures)
import type { SplitDeclaration, WorkingPaper } from "@shared/schema";

export const sampleSplitDeclarations: SplitDeclaration[] = [
  {
    splitId: "split-2100",
    accountId: "gl-2100",
    accountCode: "2100",
    accountName: "Accrued Expenses",
    periodId: "FY2024",
    tbBalance: -700000, // Credit balance from TB
    components: [
      { componentId: "comp-1", componentName: "Payroll accrual", amount: -120000, sourceType: "DECLARED", sourceReference: null, basis: "January payroll accrual per HR", footnoteId: "fn-1", createdAt: "2024-12-15T10:00:00Z", createdBy: "Controller", isLocked: false },
      { componentId: "comp-2", componentName: "Legal accrual", amount: -80000, sourceType: "DECLARED", sourceReference: null, basis: "Legal invoices received post year-end", footnoteId: "fn-10", createdAt: "2024-12-15T10:05:00Z", createdBy: "Controller", isLocked: false },
      { componentId: "comp-3", componentName: "Bonus accrual", amount: -250000, sourceType: "GL_BACKED", sourceReference: "GL 2150", basis: "Per bonus calculation schedule", footnoteId: "fn-1", createdAt: "2024-12-15T10:10:00Z", createdBy: "Controller", isLocked: false },
      { componentId: "comp-4", componentName: "Utilities accrual", amount: -50000, sourceType: "DECLARED", sourceReference: null, basis: "Estimated utility bills", footnoteId: null, createdAt: "2024-12-15T10:15:00Z", createdBy: "Controller", isLocked: false },
    ],
    totalAssigned: -500000,
    totalUnassigned: -200000,
    isComplete: false,
    lastUpdated: "2024-12-15T10:15:00Z",
    updatedBy: "Controller",
  },
  {
    splitId: "split-6300",
    accountId: "gl-6300",
    accountCode: "6300",
    accountName: "Depreciation & Amortization",
    periodId: "FY2024",
    tbBalance: 875000, // Debit balance
    components: [
      { componentId: "comp-5", componentName: "PPE Depreciation", amount: 630000, sourceType: "CALCULATED", sourceReference: "WP-PPE-001", basis: "Per fixed asset register", footnoteId: "fn-3", createdAt: "2024-12-20T09:00:00Z", createdBy: "Senior Accountant", isLocked: false },
      { componentId: "comp-6", componentName: "Intangibles Amortization", amount: 225000, sourceType: "CALCULATED", sourceReference: "WP-INT-001", basis: "Per intangible schedule", footnoteId: "fn-4", createdAt: "2024-12-20T09:05:00Z", createdBy: "Senior Accountant", isLocked: false },
      { componentId: "comp-7", componentName: "ROU Depreciation", amount: 20000, sourceType: "DECLARED", sourceReference: null, basis: "Lease amortization per schedule", footnoteId: "fn-5", createdAt: "2024-12-20T09:10:00Z", createdBy: "Senior Accountant", isLocked: false },
    ],
    totalAssigned: 875000,
    totalUnassigned: 0,
    isComplete: true,
    lastUpdated: "2024-12-20T09:10:00Z",
    updatedBy: "Senior Accountant",
  },
];

// Sample Working Papers
export const sampleWorkingPapers: WorkingPaper[] = [
  {
    workingPaperId: "wp-ppe-001",
    name: "Property, Plant & Equipment Rollforward",
    type: "ROLLFORWARD",
    periodId: "FY2024",
    linkedFsLines: ["bs-ppe"],
    linkedNotes: ["note-ppe"],
    columns: [
      { columnId: "col-desc", label: "Description", widthPx: 200, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-opening", label: "Opening", widthPx: 120, orderIndex: 1, isLocked: true, formula: null },
      { columnId: "col-additions", label: "Additions", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-disposals", label: "Disposals", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-depreciation", label: "Depreciation", widthPx: 100, orderIndex: 4, isLocked: false, formula: null },
      { columnId: "col-closing", label: "Closing", widthPx: 120, orderIndex: 5, isLocked: true, formula: "col-opening+col-additions+col-disposals+col-depreciation" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-desc": "Land & Buildings", "col-opening": 3500000, "col-additions": 200000, "col-disposals": 0, "col-depreciation": -250000, "col-closing": 3450000 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-desc": "Machinery & Equipment", "col-opening": 2800000, "col-additions": 300000, "col-disposals": -50000, "col-depreciation": -280000, "col-closing": 2770000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-desc": "Vehicles", "col-opening": 550000, "col-additions": 50000, "col-disposals": 0, "col-depreciation": -100000, "col-closing": 500000 }, isLocked: false },
      { rowId: "row-4", rowType: "TOTAL", orderIndex: 3, values: { "col-desc": "Total", "col-opening": 6850000, "col-additions": 550000, "col-disposals": -50000, "col-depreciation": -630000, "col-closing": 6720000 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "IN_REVIEW",
    linkedAccountCodes: ["1510", "1520", "1530"],
    tbSourceAmount: 6720000,
    wpTotalAmount: 6720000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [
      { noteId: "wn-1", content: "Verified additions to capital expenditure budget approval.", createdAt: "2024-12-15T10:00:00Z", createdBy: "Senior Accountant" },
      { noteId: "wn-2", content: "Depreciation calculation reviewed and approved by Controller.", createdAt: "2024-12-18T14:00:00Z", createdBy: "Controller" },
    ],
    attachments: [
      { attachmentId: "att-1", fileName: "CapEx_Approval_2024.pdf", fileType: "application/pdf", fileSize: 245000, uploadedAt: "2024-12-10T09:00:00Z", uploadedBy: "Senior Accountant", description: "Capital expenditure approval documentation" },
    ],
    createdAt: "2024-11-01T00:00:00Z",
    createdBy: "Senior Accountant",
    lastUpdated: "2024-12-20T14:30:00Z",
    updatedBy: "Controller",
  },
  {
    workingPaperId: "wp-int-001",
    name: "Intangible Assets Rollforward",
    type: "ROLLFORWARD",
    periodId: "FY2024",
    linkedFsLines: ["bs-intangibles"],
    linkedNotes: ["note-intangibles"],
    columns: [
      { columnId: "col-desc", label: "Description", widthPx: 200, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-opening", label: "Opening", widthPx: 120, orderIndex: 1, isLocked: true, formula: null },
      { columnId: "col-additions", label: "Additions", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-amortization", label: "Amortization", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-closing", label: "Closing", widthPx: 120, orderIndex: 4, isLocked: true, formula: "col-opening+col-additions+col-amortization" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-desc": "Software Licenses", "col-opening": 1200000, "col-additions": 100000, "col-amortization": -150000, "col-closing": 1150000 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-desc": "Patents & Trademarks", "col-opening": 600000, "col-additions": 75000, "col-amortization": -75000, "col-closing": 600000 }, isLocked: false },
      { rowId: "row-3", rowType: "TOTAL", orderIndex: 2, values: { "col-desc": "Total", "col-opening": 1800000, "col-additions": 175000, "col-amortization": -225000, "col-closing": 1750000 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["1610", "1620"],
    tbSourceAmount: 1750000,
    wpTotalAmount: 1750000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [
      { noteId: "wn-1", content: "Amortization schedule verified against software licensing agreements.", createdAt: "2024-12-16T11:00:00Z", createdBy: "Senior Accountant" },
    ],
    attachments: [],
    createdAt: "2024-11-01T00:00:00Z",
    createdBy: "Senior Accountant",
    lastUpdated: "2024-12-18T16:00:00Z",
    updatedBy: "Controller",
  },
  {
    workingPaperId: "wp-aging-001",
    name: "Accounts Receivable Aging",
    type: "AGING",
    periodId: "FY2024",
    linkedFsLines: ["bs-ar"],
    linkedNotes: ["note-ar"],
    columns: [
      { columnId: "col-customer", label: "Customer", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-current", label: "Current", widthPx: 100, orderIndex: 1, isLocked: false, formula: null },
      { columnId: "col-30", label: "1-30 Days", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-60", label: "31-60 Days", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-90", label: "61-90 Days", widthPx: 100, orderIndex: 4, isLocked: false, formula: null },
      { columnId: "col-over90", label: ">90 Days", widthPx: 100, orderIndex: 5, isLocked: false, formula: null },
      { columnId: "col-total", label: "Total", widthPx: 120, orderIndex: 6, isLocked: true, formula: "SUM(col-current:col-over90)" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-customer": "Customer A", "col-current": 500000, "col-30": 200000, "col-60": 50000, "col-90": 0, "col-over90": 0, "col-total": 750000 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-customer": "Customer B", "col-current": 800000, "col-30": 150000, "col-60": 0, "col-90": 25000, "col-over90": 0, "col-total": 975000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-customer": "Customer C", "col-current": 1200000, "col-30": 400000, "col-60": 200000, "col-90": 50000, "col-over90": 25000, "col-total": 1875000 }, isLocked: false },
      { rowId: "row-4", rowType: "TOTAL", orderIndex: 3, values: { "col-customer": "Total", "col-current": 2500000, "col-30": 750000, "col-60": 250000, "col-90": 75000, "col-over90": 25000, "col-total": 3600000 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "DRAFT",
    linkedAccountCodes: ["1200", "1210"],
    tbSourceAmount: 3600000,
    wpTotalAmount: 3600000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [
      { noteId: "wn-1", content: "Aging buckets reconciled to subledger.", createdAt: "2024-12-20T09:00:00Z", createdBy: "Staff Accountant" },
    ],
    attachments: [
      { attachmentId: "att-1", fileName: "AR_Subledger_Dec2024.xlsx", fileType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileSize: 156000, uploadedAt: "2024-12-22T10:00:00Z", uploadedBy: "Staff Accountant", description: "AR subledger export" },
    ],
    createdAt: "2024-12-01T00:00:00Z",
    createdBy: "Staff Accountant",
    lastUpdated: "2024-12-22T10:00:00Z",
    updatedBy: "Staff Accountant",
  },
  // ========== NEW WORKING PAPERS FOR ALL FS LINE ITEMS ==========
  // Revenue & Receivables
  {
    workingPaperId: "wp-revenue-001",
    name: "Revenue Analysis",
    type: "LINEAR",
    periodId: "FY2024",
    linkedFsLines: ["is-revenue"],
    linkedNotes: ["note-revenue"],
    columns: [
      { columnId: "col-stream", label: "Revenue Stream", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-cy", label: "CY 2024", widthPx: 120, orderIndex: 1, isLocked: false, formula: null },
      { columnId: "col-py", label: "PY 2023", widthPx: 120, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-var", label: "Variance", widthPx: 100, orderIndex: 3, isLocked: true, formula: "col-cy-col-py" },
      { columnId: "col-pct", label: "% Change", widthPx: 80, orderIndex: 4, isLocked: true, formula: "(col-cy-col-py)/col-py*100" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-stream": "Product Sales", "col-cy": 8500000, "col-py": 7800000, "col-var": 700000, "col-pct": 9.0 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-stream": "Service Revenue", "col-cy": 3200000, "col-py": 2900000, "col-var": 300000, "col-pct": 10.3 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-stream": "Licensing & Royalties", "col-cy": 800000, "col-py": 650000, "col-var": 150000, "col-pct": 23.1 }, isLocked: false },
      { rowId: "row-4", rowType: "TOTAL", orderIndex: 3, values: { "col-stream": "Total Revenue", "col-cy": 12500000, "col-py": 11350000, "col-var": 1150000, "col-pct": 10.1 }, isLocked: true },
    ],
    textBlocks: [{ blockId: "tb-1", content: "Revenue disaggregation by type per ASC 606", orderIndex: 0, style: "NOTE" }],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["4000", "4010", "4020"],
    tbSourceAmount: 12500000,
    wpTotalAmount: 12500000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-11-01T00:00:00Z",
    createdBy: "Revenue Accountant",
    lastUpdated: "2024-12-18T11:00:00Z",
    updatedBy: "Controller",
  },
  // Cost of Goods Sold
  {
    workingPaperId: "wp-cogs-001",
    name: "Cost of Goods Sold Analysis",
    type: "LINEAR",
    periodId: "FY2024",
    linkedFsLines: ["is-cogs"],
    linkedNotes: ["note-cogs"],
    columns: [
      { columnId: "col-cat", label: "Cost Category", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-cy", label: "CY 2024", widthPx: 120, orderIndex: 1, isLocked: false, formula: null },
      { columnId: "col-py", label: "PY 2023", widthPx: 120, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-margin", label: "% of Revenue", widthPx: 100, orderIndex: 3, isLocked: true, formula: "col-cy/12500000*100" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-cat": "Direct Materials", "col-cy": 3750000, "col-py": 3500000, "col-margin": 30.0 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-cat": "Direct Labor", "col-cy": 2250000, "col-py": 2100000, "col-margin": 18.0 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-cat": "Manufacturing Overhead", "col-cy": 1500000, "col-py": 1350000, "col-margin": 12.0 }, isLocked: false },
      { rowId: "row-4", rowType: "TOTAL", orderIndex: 3, values: { "col-cat": "Total COGS", "col-cy": 7500000, "col-py": 6950000, "col-margin": 60.0 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["5000", "5010", "5020"],
    tbSourceAmount: 7500000,
    wpTotalAmount: 7500000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-11-01T00:00:00Z",
    createdBy: "Cost Accountant",
    lastUpdated: "2024-12-17T14:00:00Z",
    updatedBy: "Controller",
  },
  // Inventory
  {
    workingPaperId: "wp-inventory-001",
    name: "Inventory Rollforward",
    type: "ROLLFORWARD",
    periodId: "FY2024",
    linkedFsLines: ["bs-inventory"],
    linkedNotes: ["note-inventory"],
    columns: [
      { columnId: "col-cat", label: "Category", widthPx: 160, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-opening", label: "Opening", widthPx: 100, orderIndex: 1, isLocked: true, formula: null },
      { columnId: "col-purchases", label: "Purchases", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-usage", label: "Usage/COGS", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-writedown", label: "Write-downs", widthPx: 100, orderIndex: 4, isLocked: false, formula: null },
      { columnId: "col-closing", label: "Closing", widthPx: 100, orderIndex: 5, isLocked: true, formula: "col-opening+col-purchases+col-usage+col-writedown" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-cat": "Raw Materials", "col-opening": 220000, "col-purchases": 3200000, "col-usage": -3160000, "col-writedown": -15000, "col-closing": 245000 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-cat": "Work in Progress", "col-opening": 165000, "col-purchases": 0, "col-usage": 15000, "col-writedown": 0, "col-closing": 180000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-cat": "Finished Goods", "col-opening": 430000, "col-purchases": 0, "col-usage": 45000, "col-writedown": -10000, "col-closing": 465000 }, isLocked: false },
      { rowId: "row-4", rowType: "TOTAL", orderIndex: 3, values: { "col-cat": "Total Inventory", "col-opening": 815000, "col-purchases": 3200000, "col-usage": -3100000, "col-writedown": -25000, "col-closing": 890000 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "IN_REVIEW",
    linkedAccountCodes: ["1300", "1310", "1320"],
    tbSourceAmount: 890000,
    wpTotalAmount: 890000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-11-15T00:00:00Z",
    createdBy: "Inventory Accountant",
    lastUpdated: "2024-12-20T10:00:00Z",
    updatedBy: "Senior Accountant",
  },
  // Operating Expenses
  {
    workingPaperId: "wp-opex-001",
    name: "Operating Expenses Analysis",
    type: "LINEAR",
    periodId: "FY2024",
    linkedFsLines: ["is-sga", "is-rd", "is-da"],
    linkedNotes: ["note-opex"],
    columns: [
      { columnId: "col-cat", label: "Expense Category", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-cy", label: "CY 2024", widthPx: 120, orderIndex: 1, isLocked: false, formula: null },
      { columnId: "col-py", label: "PY 2023", widthPx: 120, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-budget", label: "Budget", widthPx: 120, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-var-bud", label: "vs Budget", widthPx: 100, orderIndex: 4, isLocked: true, formula: "col-cy-col-budget" },
    ],
    rows: [
      { rowId: "row-1", rowType: "HEADER", orderIndex: 0, values: { "col-cat": "Selling, General & Administrative" }, isLocked: true },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-cat": "Salaries & Wages", "col-cy": 1200000, "col-py": 1100000, "col-budget": 1180000, "col-var-bud": 20000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-cat": "Sales Commissions", "col-cy": 450000, "col-py": 420000, "col-budget": 460000, "col-var-bud": -10000 }, isLocked: false },
      { rowId: "row-4", rowType: "DATA", orderIndex: 3, values: { "col-cat": "Marketing & Advertising", "col-cy": 275000, "col-py": 265000, "col-budget": 300000, "col-var-bud": -25000 }, isLocked: false },
      { rowId: "row-5", rowType: "DATA", orderIndex: 4, values: { "col-cat": "Professional Fees", "col-cy": 175000, "col-py": 165000, "col-budget": 180000, "col-var-bud": -5000 }, isLocked: false },
      { rowId: "row-6", rowType: "SUBTOTAL", orderIndex: 5, values: { "col-cat": "Total SG&A", "col-cy": 2100000, "col-py": 1950000, "col-budget": 2120000, "col-var-bud": -20000 }, isLocked: true },
      { rowId: "row-7", rowType: "HEADER", orderIndex: 6, values: { "col-cat": "Research & Development" }, isLocked: true },
      { rowId: "row-8", rowType: "DATA", orderIndex: 7, values: { "col-cat": "R&D Personnel", "col-cy": 650000, "col-py": 600000, "col-budget": 640000, "col-var-bud": 10000 }, isLocked: false },
      { rowId: "row-9", rowType: "DATA", orderIndex: 8, values: { "col-cat": "R&D Materials & Supplies", "col-cy": 200000, "col-py": 180000, "col-budget": 210000, "col-var-bud": -10000 }, isLocked: false },
      { rowId: "row-10", rowType: "SUBTOTAL", orderIndex: 9, values: { "col-cat": "Total R&D", "col-cy": 850000, "col-py": 780000, "col-budget": 850000, "col-var-bud": 0 }, isLocked: true },
      { rowId: "row-11", rowType: "DATA", orderIndex: 10, values: { "col-cat": "Depreciation & Amortization", "col-cy": 875000, "col-py": 820000, "col-budget": 870000, "col-var-bud": 5000 }, isLocked: false },
      { rowId: "row-12", rowType: "TOTAL", orderIndex: 11, values: { "col-cat": "Total Operating Expenses", "col-cy": 3825000, "col-py": 3550000, "col-budget": 3840000, "col-var-bud": -15000 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["6000", "6010", "6020", "6030"],
    tbSourceAmount: 3825000,
    wpTotalAmount: 3825000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-11-01T00:00:00Z",
    createdBy: "Senior Accountant",
    lastUpdated: "2024-12-19T16:00:00Z",
    updatedBy: "Controller",
  },
  // Accounts Payable
  {
    workingPaperId: "wp-ap-001",
    name: "Accounts Payable Aging",
    type: "AGING",
    periodId: "FY2024",
    linkedFsLines: ["bs-ap"],
    linkedNotes: ["note-ap"],
    columns: [
      { columnId: "col-vendor", label: "Vendor", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-current", label: "Current", widthPx: 100, orderIndex: 1, isLocked: false, formula: null },
      { columnId: "col-30", label: "1-30 Days", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-60", label: "31-60 Days", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-over60", label: ">60 Days", widthPx: 100, orderIndex: 4, isLocked: false, formula: null },
      { columnId: "col-total", label: "Total", widthPx: 120, orderIndex: 5, isLocked: true, formula: "SUM" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-vendor": "Supplier A (Materials)", "col-current": 450000, "col-30": 120000, "col-60": 0, "col-over60": 0, "col-total": 570000 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-vendor": "Supplier B (Components)", "col-current": 380000, "col-30": 95000, "col-60": 25000, "col-over60": 0, "col-total": 500000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-vendor": "Logistics Provider", "col-current": 180000, "col-30": 45000, "col-60": 0, "col-over60": 0, "col-total": 225000 }, isLocked: false },
      { rowId: "row-4", rowType: "DATA", orderIndex: 3, values: { "col-vendor": "Utilities & Services", "col-current": 95000, "col-30": 25000, "col-60": 10000, "col-over60": 5000, "col-total": 135000 }, isLocked: false },
      { rowId: "row-5", rowType: "DATA", orderIndex: 4, values: { "col-vendor": "Other Vendors", "col-current": 320000, "col-30": 80000, "col-60": 15000, "col-over60": 5000, "col-total": 420000 }, isLocked: false },
      { rowId: "row-6", rowType: "TOTAL", orderIndex: 5, values: { "col-vendor": "Total AP", "col-current": 1425000, "col-30": 365000, "col-60": 50000, "col-over60": 10000, "col-total": 1850000 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "IN_REVIEW",
    linkedAccountCodes: ["2000", "2010"],
    tbSourceAmount: 1850000,
    wpTotalAmount: 1850000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-12-01T00:00:00Z",
    createdBy: "AP Specialist",
    lastUpdated: "2024-12-21T09:00:00Z",
    updatedBy: "Senior Accountant",
  },
  // Accrued Liabilities
  {
    workingPaperId: "wp-accruals-001",
    name: "Accrued Liabilities Rollforward",
    type: "ROLLFORWARD",
    periodId: "FY2024",
    linkedFsLines: ["bs-accrued"],
    linkedNotes: ["note-accruals"],
    columns: [
      { columnId: "col-type", label: "Accrual Type", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-opening", label: "Opening", widthPx: 100, orderIndex: 1, isLocked: true, formula: null },
      { columnId: "col-additions", label: "Additions", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-payments", label: "Payments", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-closing", label: "Closing", widthPx: 100, orderIndex: 4, isLocked: true, formula: "col-opening+col-additions+col-payments" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-type": "Payroll & Benefits", "col-opening": 420000, "col-additions": 5200000, "col-payments": -5150000, "col-closing": 470000 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-type": "Bonuses", "col-opening": 180000, "col-additions": 250000, "col-payments": -180000, "col-closing": 250000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-type": "Vacation & PTO", "col-opening": 125000, "col-additions": 180000, "col-payments": -165000, "col-closing": 140000 }, isLocked: false },
      { rowId: "row-4", rowType: "DATA", orderIndex: 3, values: { "col-type": "Professional Fees", "col-opening": 75000, "col-additions": 120000, "col-payments": -155000, "col-closing": 40000 }, isLocked: false },
      { rowId: "row-5", rowType: "DATA", orderIndex: 4, values: { "col-type": "Other Accruals", "col-opening": 50000, "col-additions": 35000, "col-payments": -65000, "col-closing": 20000 }, isLocked: false },
      { rowId: "row-6", rowType: "TOTAL", orderIndex: 5, values: { "col-type": "Total Accrued Liabilities", "col-opening": 850000, "col-additions": 5785000, "col-payments": -5715000, "col-closing": 920000 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["2100", "2110", "2120"],
    tbSourceAmount: 920000,
    wpTotalAmount: 920000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-11-15T00:00:00Z",
    createdBy: "Senior Accountant",
    lastUpdated: "2024-12-18T15:00:00Z",
    updatedBy: "Controller",
  },
  // Debt & Borrowings
  {
    workingPaperId: "wp-debt-001",
    name: "Debt & Borrowings Rollforward",
    type: "ROLLFORWARD",
    periodId: "FY2024",
    linkedFsLines: ["bs-lt-debt", "bs-curr-debt"],
    linkedNotes: ["note-debt"],
    columns: [
      { columnId: "col-facility", label: "Debt Facility", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-opening", label: "Opening", widthPx: 110, orderIndex: 1, isLocked: true, formula: null },
      { columnId: "col-draws", label: "Drawdowns", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-repay", label: "Repayments", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-closing", label: "Closing", widthPx: 110, orderIndex: 4, isLocked: true, formula: "col-opening+col-draws+col-repay" },
      { columnId: "col-rate", label: "Rate", widthPx: 70, orderIndex: 5, isLocked: false, formula: null },
      { columnId: "col-maturity", label: "Maturity", widthPx: 100, orderIndex: 6, isLocked: false, formula: null },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-facility": "Term Loan A", "col-opening": 2500000, "col-draws": 0, "col-repay": -300000, "col-closing": 2200000, "col-rate": "SOFR+2.5%", "col-maturity": "Dec 2027" }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-facility": "Term Loan B", "col-opening": 1700000, "col-draws": 0, "col-repay": -200000, "col-closing": 1500000, "col-rate": "6.5% Fixed", "col-maturity": "Jun 2026" }, isLocked: false },
      { rowId: "row-3", rowType: "TOTAL", orderIndex: 2, values: { "col-facility": "Total Debt", "col-opening": 4200000, "col-draws": 0, "col-repay": -500000, "col-closing": 3700000, "col-rate": "", "col-maturity": "" }, isLocked: true },
      { rowId: "row-4", rowType: "DATA", orderIndex: 3, values: { "col-facility": "Less: Current Portion", "col-opening": -500000, "col-draws": 0, "col-repay": 0, "col-closing": -500000, "col-rate": "", "col-maturity": "" }, isLocked: false },
      { rowId: "row-5", rowType: "TOTAL", orderIndex: 4, values: { "col-facility": "Long-Term Debt", "col-opening": 3700000, "col-draws": 0, "col-repay": -500000, "col-closing": 3200000, "col-rate": "", "col-maturity": "" }, isLocked: true },
    ],
    textBlocks: [{ blockId: "tb-1", content: "Debt covenants tested quarterly; all in compliance as of Dec 31, 2024", orderIndex: 0, style: "NOTE" }],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["2200", "2210"],
    tbSourceAmount: 3700000,
    wpTotalAmount: 3700000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [
      { noteId: "wn-1", content: "All debt covenants verified as compliant. Interest rate swap hedge in place.", createdAt: "2024-12-19T10:00:00Z", createdBy: "Treasury Analyst" },
    ],
    attachments: [
      { attachmentId: "att-1", fileName: "Loan_Agreement_TermA.pdf", fileType: "application/pdf", fileSize: 520000, uploadedAt: "2024-11-01T09:00:00Z", uploadedBy: "Treasury Analyst", description: "Term Loan A agreement" },
    ],
    createdAt: "2024-11-01T00:00:00Z",
    createdBy: "Treasury Analyst",
    lastUpdated: "2024-12-19T11:00:00Z",
    updatedBy: "Controller",
  },
  // Equity
  {
    workingPaperId: "wp-equity-001",
    name: "Stockholders Equity Rollforward",
    type: "ROLLFORWARD",
    periodId: "FY2024",
    linkedFsLines: ["bs-common", "bs-apic", "bs-retained", "bs-aoci"],
    linkedNotes: ["note-equity"],
    columns: [
      { columnId: "col-comp", label: "Component", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-opening", label: "Opening", widthPx: 120, orderIndex: 1, isLocked: true, formula: null },
      { columnId: "col-ni", label: "Net Income", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-div", label: "Dividends", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-sbc", label: "Stock Comp", widthPx: 100, orderIndex: 4, isLocked: false, formula: null },
      { columnId: "col-other", label: "Other", widthPx: 100, orderIndex: 5, isLocked: false, formula: null },
      { columnId: "col-closing", label: "Closing", widthPx: 120, orderIndex: 6, isLocked: true, formula: "SUM" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-comp": "Common Stock", "col-opening": 50000, "col-ni": 0, "col-div": 0, "col-sbc": 0, "col-other": 0, "col-closing": 50000 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-comp": "Additional Paid-in Capital", "col-opening": 3200000, "col-ni": 0, "col-div": 0, "col-sbc": 250000, "col-other": 50000, "col-closing": 3500000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-comp": "Retained Earnings", "col-opening": 3700000, "col-ni": 825000, "col-div": -175000, "col-sbc": 0, "col-other": 500000, "col-closing": 4850000 }, isLocked: false },
      { rowId: "row-4", rowType: "DATA", orderIndex: 3, values: { "col-comp": "AOCI", "col-opening": -100000, "col-ni": 0, "col-div": 0, "col-sbc": 0, "col-other": 0, "col-closing": -100000 }, isLocked: false },
      { rowId: "row-5", rowType: "TOTAL", orderIndex: 4, values: { "col-comp": "Total Equity", "col-opening": 6850000, "col-ni": 825000, "col-div": -175000, "col-sbc": 250000, "col-other": 550000, "col-closing": 8300000 }, isLocked: true },
    ],
    textBlocks: [{ blockId: "tb-1", content: "Other column includes prior period adjustment of $500K", orderIndex: 0, style: "NOTE" }],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["3000", "3010", "3020", "3030"],
    tbSourceAmount: 8300000,
    wpTotalAmount: 8300000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-11-01T00:00:00Z",
    createdBy: "Controller",
    lastUpdated: "2024-12-20T16:00:00Z",
    updatedBy: "CFO",
  },
  // Cash & Cash Equivalents
  {
    workingPaperId: "wp-cash-001",
    name: "Cash & Cash Equivalents Reconciliation",
    type: "LINEAR",
    periodId: "FY2024",
    linkedFsLines: ["bs-cash"],
    linkedNotes: ["note-cash"],
    columns: [
      { columnId: "col-account", label: "Bank Account", widthPx: 200, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-bank", label: "Bank", widthPx: 100, orderIndex: 1, isLocked: false, formula: null },
      { columnId: "col-gl", label: "Per GL", widthPx: 120, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-stmt", label: "Per Bank", widthPx: 120, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-diff", label: "Difference", widthPx: 100, orderIndex: 4, isLocked: true, formula: "col-gl-col-stmt" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-account": "Operating Account", "col-bank": "JPMorgan", "col-gl": 1850000, "col-stmt": 1850000, "col-diff": 0 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-account": "Payroll Account", "col-bank": "JPMorgan", "col-gl": 450000, "col-stmt": 450000, "col-diff": 0 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-account": "Money Market", "col-bank": "Fidelity", "col-gl": 550000, "col-stmt": 550000, "col-diff": 0 }, isLocked: false },
      { rowId: "row-4", rowType: "TOTAL", orderIndex: 3, values: { "col-account": "Total Cash", "col-bank": "", "col-gl": 2850000, "col-stmt": 2850000, "col-diff": 0 }, isLocked: true },
    ],
    textBlocks: [{ blockId: "tb-1", content: "All accounts reconciled to bank statements dated Dec 31, 2024", orderIndex: 0, style: "NOTE" }],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["1000", "1010"],
    tbSourceAmount: 2850000,
    wpTotalAmount: 2850000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [
      { attachmentId: "att-1", fileName: "Bank_Stmt_JPM_Dec2024.pdf", fileType: "application/pdf", fileSize: 180000, uploadedAt: "2024-12-22T08:00:00Z", uploadedBy: "Treasury Analyst", description: "JPMorgan bank statement Dec 2024" },
    ],
    createdAt: "2024-12-01T00:00:00Z",
    createdBy: "Treasury Analyst",
    lastUpdated: "2024-12-22T08:00:00Z",
    updatedBy: "Controller",
  },
  // Prepaid Expenses
  {
    workingPaperId: "wp-prepaid-001",
    name: "Prepaid Expenses Rollforward",
    type: "ROLLFORWARD",
    periodId: "FY2024",
    linkedFsLines: ["bs-prepaid"],
    linkedNotes: ["note-prepaid"],
    columns: [
      { columnId: "col-type", label: "Prepaid Type", widthPx: 180, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-opening", label: "Opening", widthPx: 100, orderIndex: 1, isLocked: true, formula: null },
      { columnId: "col-additions", label: "Additions", widthPx: 100, orderIndex: 2, isLocked: false, formula: null },
      { columnId: "col-amort", label: "Amortization", widthPx: 100, orderIndex: 3, isLocked: false, formula: null },
      { columnId: "col-closing", label: "Closing", widthPx: 100, orderIndex: 4, isLocked: true, formula: "col-opening+col-additions+col-amort" },
    ],
    rows: [
      { rowId: "row-1", rowType: "DATA", orderIndex: 0, values: { "col-type": "Insurance", "col-opening": 180000, "col-additions": 195000, "col-amort": -185000, "col-closing": 190000 }, isLocked: false },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-type": "Software Subscriptions", "col-opening": 120000, "col-additions": 140000, "col-amort": -125000, "col-closing": 135000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-type": "Rent Deposits", "col-opening": 50000, "col-additions": 15000, "col-amort": -5000, "col-closing": 60000 }, isLocked: false },
      { rowId: "row-4", rowType: "DATA", orderIndex: 3, values: { "col-type": "Other Prepaids", "col-opening": 30000, "col-additions": 25000, "col-amort": -15000, "col-closing": 40000 }, isLocked: false },
      { rowId: "row-5", rowType: "TOTAL", orderIndex: 4, values: { "col-type": "Total Prepaids", "col-opening": 380000, "col-additions": 375000, "col-amort": -330000, "col-closing": 425000 }, isLocked: true },
    ],
    textBlocks: [],
    frozenRows: 1,
    status: "IN_REVIEW",
    linkedAccountCodes: ["1400", "1410"],
    tbSourceAmount: 425000,
    wpTotalAmount: 425000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-11-15T00:00:00Z",
    createdBy: "Staff Accountant",
    lastUpdated: "2024-12-21T14:00:00Z",
    updatedBy: "Senior Accountant",
  },
  // Income Tax
  {
    workingPaperId: "wp-tax-001",
    name: "Income Tax Provision",
    type: "CUSTOM",
    periodId: "FY2024",
    linkedFsLines: ["is-tax", "bs-dti"],
    linkedNotes: ["note-tax"],
    columns: [
      { columnId: "col-item", label: "Tax Item", widthPx: 220, orderIndex: 0, isLocked: false, formula: null },
      { columnId: "col-cy", label: "CY 2024", widthPx: 120, orderIndex: 1, isLocked: false, formula: null },
      { columnId: "col-py", label: "PY 2023", widthPx: 120, orderIndex: 2, isLocked: false, formula: null },
    ],
    rows: [
      { rowId: "row-1", rowType: "HEADER", orderIndex: 0, values: { "col-item": "Current Tax Expense" }, isLocked: true },
      { rowId: "row-2", rowType: "DATA", orderIndex: 1, values: { "col-item": "Federal", "col-cy": 210000, "col-py": 145000 }, isLocked: false },
      { rowId: "row-3", rowType: "DATA", orderIndex: 2, values: { "col-item": "State", "col-cy": 35000, "col-py": 25000 }, isLocked: false },
      { rowId: "row-4", rowType: "SUBTOTAL", orderIndex: 3, values: { "col-item": "Total Current", "col-cy": 245000, "col-py": 170000 }, isLocked: true },
      { rowId: "row-5", rowType: "HEADER", orderIndex: 4, values: { "col-item": "Deferred Tax Expense" }, isLocked: true },
      { rowId: "row-6", rowType: "DATA", orderIndex: 5, values: { "col-item": "Federal", "col-cy": 25000, "col-py": 12000 }, isLocked: false },
      { rowId: "row-7", rowType: "DATA", orderIndex: 6, values: { "col-item": "State", "col-cy": 5000, "col-py": 3000 }, isLocked: false },
      { rowId: "row-8", rowType: "SUBTOTAL", orderIndex: 7, values: { "col-item": "Total Deferred", "col-cy": 30000, "col-py": 15000 }, isLocked: true },
      { rowId: "row-9", rowType: "TOTAL", orderIndex: 8, values: { "col-item": "Total Tax Expense", "col-cy": 275000, "col-py": 185000 }, isLocked: true },
      { rowId: "row-10", rowType: "DATA", orderIndex: 9, values: { "col-item": "Effective Tax Rate", "col-cy": "25.0%", "col-py": "25.0%" }, isLocked: false },
    ],
    textBlocks: [{ blockId: "tb-1", content: "Statutory rate 21% federal; state rate varies by jurisdiction", orderIndex: 0, style: "NOTE" }],
    frozenRows: 1,
    status: "APPROVED",
    linkedAccountCodes: ["7000", "7010", "1700"],
    tbSourceAmount: 275000,
    wpTotalAmount: 275000,
    variance: 0,
    tieOutStatus: "TIED",
    wpNotes: [],
    attachments: [],
    createdAt: "2024-11-15T00:00:00Z",
    createdBy: "Tax Manager",
    lastUpdated: "2024-12-19T17:00:00Z",
    updatedBy: "Controller",
  },
];

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

// Statement of Comprehensive Income
export const sampleComprehensiveIncome: FSComprehensiveIncome = {
  periodId: "FY2024",
  currentPeriodLabel: "Year Ended Dec 31, 2024",
  priorPeriodLabel: "Year Ended Dec 31, 2023",
  netIncome: { current: 825000, prior: 555000 },
  ociItems: [
    {
      itemId: "oci-fx",
      label: "Foreign currency translation adjustments",
      isReclassifiable: true,
      current: 15000,
      prior: -25000,
      noteRef: "note-oci",
    },
    {
      itemId: "oci-hedge",
      label: "Unrealized gain (loss) on cash flow hedges",
      isReclassifiable: true,
      current: -5000,
      prior: 10000,
      noteRef: "note-oci",
    },
    {
      itemId: "oci-pension",
      label: "Actuarial gain (loss) on defined benefit plans",
      isReclassifiable: false,
      current: -10000,
      prior: -15000,
      noteRef: "note-pension",
    },
    {
      itemId: "oci-revaluation",
      label: "Revaluation surplus on land and buildings",
      isReclassifiable: false,
      current: 0,
      prior: 30000,
      noteRef: "note-ppe",
    },
  ],
  totalOCI: { current: 0, prior: 0 },
  totalComprehensiveIncome: { current: 825000, prior: 555000 },
};

// Basis of Preparation
export const sampleBasisOfPreparation: FSBasisOfPreparation = {
  periodId: "FY2024",
  reportingFramework: "US_GAAP",
  frameworkStatement: "These consolidated financial statements have been prepared in accordance with accounting principles generally accepted in the United States of America (US GAAP).",
  measurementBasis: "The financial statements have been prepared under the historical cost convention, except for certain financial instruments measured at fair value as disclosed in the accounting policies.",
  functionalCurrency: "USD",
  presentationCurrency: "USD",
  goingConcern: {
    status: "CONFIRMED",
    statement: "Management has assessed the Company's ability to continue as a going concern and is satisfied that the Company has the resources to continue in business for the foreseeable future. Accordingly, the financial statements have been prepared on a going concern basis.",
  },
  consolidationStatement: "The consolidated financial statements include the accounts of Acme Corporation Inc. and its wholly-owned subsidiaries. All intercompany transactions and balances have been eliminated in consolidation.",
  comparativeStatement: "Comparative figures for the prior year have been presented. Certain prior year amounts have been reclassified to conform to the current year presentation.",
  roundingPolicy: "Amounts in the financial statements are presented in US dollars and rounded to the nearest dollar unless otherwise indicated.",
  isLocked: false,
  updatedAt: "2024-12-20T14:00:00Z",
  updatedBy: "Controller",
};

// Accounting Policies Library
export const sampleAccountingPolicies: AccountingPolicy[] = [
  {
    policyId: "pol-revenue",
    policyName: "Revenue Recognition",
    category: "Revenue",
    policyText: `Revenue is recognized when control of promised goods or services is transferred to customers in an amount that reflects the consideration expected to be entitled in exchange for those goods or services.

The Company's revenue is derived primarily from software license sales, subscription services, and professional services. For each revenue stream:

**Software Licenses:** Revenue from perpetual software licenses is recognized at the point in time when the software is delivered and the customer has the right to use the software.

**Subscription Services:** Revenue from subscription services is recognized ratably over the subscription period as the services are provided.

**Professional Services:** Revenue from professional services is recognized as services are rendered, typically using an input method based on hours incurred.`,
    effectiveFrom: "2024-01-01",
    version: 2,
    status: "ACTIVE",
    linkedNotes: ["note-revenue"],
    isBoilerplate: false,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    updatedBy: "Controller",
  },
  {
    policyId: "pol-ppe",
    policyName: "Property, Plant & Equipment",
    category: "Assets",
    policyText: `Property, plant and equipment are stated at cost less accumulated depreciation and accumulated impairment losses. Cost includes expenditure that is directly attributable to the acquisition of the asset.

Depreciation is calculated using the straight-line method over the estimated useful lives of the assets:
- Buildings: 25-40 years
- Machinery & Equipment: 5-10 years
- Furniture & Fixtures: 5-7 years
- Computer Equipment: 3-5 years
- Leasehold Improvements: Lesser of useful life or lease term

Residual values and useful lives are reviewed, and adjusted if appropriate, at each balance sheet date. An asset's carrying amount is written down immediately to its recoverable amount if the asset's carrying amount is greater than its estimated recoverable amount.`,
    effectiveFrom: "2024-01-01",
    version: 1,
    status: "ACTIVE",
    linkedNotes: ["note-ppe"],
    isBoilerplate: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    updatedBy: "Controller",
  },
  {
    policyId: "pol-leases",
    policyName: "Leases",
    category: "Leases",
    policyText: `The Company determines if an arrangement is a lease at inception. Right-of-use assets and lease liabilities are recognized at the lease commencement date based on the present value of future lease payments over the lease term.

**Right-of-use assets:** Right-of-use assets are measured at the present value of future lease payments, adjusted for any lease payments made at or before the commencement date, plus any initial direct costs incurred.

**Lease liabilities:** Lease liabilities are measured at the present value of future lease payments discounted using the Company's incremental borrowing rate.

The Company has elected not to recognize right-of-use assets and lease liabilities for short-term leases (leases with a term of 12 months or less) and leases of low-value assets.`,
    effectiveFrom: "2024-01-01",
    version: 1,
    status: "ACTIVE",
    linkedNotes: ["note-leases"],
    isBoilerplate: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    updatedBy: "Controller",
  },
  {
    policyId: "pol-inventory",
    policyName: "Inventory",
    category: "Assets",
    policyText: `Inventories are stated at the lower of cost or net realizable value. Cost is determined using the first-in, first-out (FIFO) method.

Net realizable value is the estimated selling price in the ordinary course of business less the estimated costs of completion and the estimated costs necessary to make the sale.

When inventories are sold, the carrying amount is recognized as an expense in the period in which the related revenue is recognized.`,
    effectiveFrom: "2024-01-01",
    version: 1,
    status: "ACTIVE",
    linkedNotes: ["note-inventory"],
    isBoilerplate: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    updatedBy: "Controller",
  },
  {
    policyId: "pol-tax",
    policyName: "Income Taxes",
    category: "Taxes",
    policyText: `The Company accounts for income taxes using the asset and liability method. Deferred tax assets and liabilities are recognized for the future tax consequences attributable to differences between the financial statement carrying amounts of existing assets and liabilities and their respective tax bases.

Deferred tax assets and liabilities are measured using enacted tax rates expected to apply to taxable income in the years in which those temporary differences are expected to be recovered or settled.

A valuation allowance is established when it is more likely than not that some or all of the deferred tax assets will not be realized.`,
    effectiveFrom: "2024-01-01",
    version: 1,
    status: "ACTIVE",
    linkedNotes: ["note-tax"],
    isBoilerplate: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    updatedBy: "Controller",
  },
];

// MD&A Document
export const sampleMDA: MDADocument = {
  periodId: "FY2024",
  documentTitle: "Management Discussion & Analysis - Fiscal Year 2024",
  sections: [
    {
      sectionId: "mda-overview",
      sectionTitle: "Business Overview",
      orderIndex: 0,
      narrativeText: `Acme Corporation Inc. is a leading provider of enterprise software solutions, serving customers across North America, Europe, and Asia Pacific. During fiscal year 2024, the Company continued to execute on its strategic growth initiatives while maintaining operational discipline.

The Company operates primarily in two business segments:
- **Enterprise Software:** Providing core business management solutions
- **Cloud Services:** Offering subscription-based cloud hosting and support services`,
      linkedFsLines: [],
      linkedNotes: [],
      status: "APPROVED",
      lastUpdated: "2024-12-20T10:00:00Z",
      updatedBy: "CFO",
    },
    {
      sectionId: "mda-results",
      sectionTitle: "Results of Operations",
      orderIndex: 1,
      narrativeText: `**Revenue:** Total revenue increased by 10.1% to $12.5 million in fiscal 2024 compared to $11.35 million in fiscal 2023. This growth was primarily driven by strong performance in our subscription services segment and increased software license sales.

**Gross Profit:** Gross profit increased to $5.0 million (40.0% gross margin) compared to $4.4 million (38.8% gross margin) in the prior year. The improvement in gross margin reflects ongoing optimization of our service delivery costs and favorable product mix.

**Operating Expenses:** Operating expenses increased by 7.7% to $3.83 million, primarily due to increased investment in research and development activities and higher personnel costs to support growth initiatives.

**Net Income:** Net income increased by 48.6% to $825,000 compared to $555,000 in fiscal 2023, reflecting both top-line growth and improved operational efficiency.`,
      linkedFsLines: ["is-revenue", "is-gross", "is-net"],
      linkedNotes: ["note-revenue"],
      status: "APPROVED",
      lastUpdated: "2024-12-20T10:00:00Z",
      updatedBy: "CFO",
    },
    {
      sectionId: "mda-liquidity",
      sectionTitle: "Liquidity and Capital Resources",
      orderIndex: 2,
      narrativeText: `**Cash Position:** As of December 31, 2024, the Company had cash and cash equivalents of $2.85 million, an increase from $2.45 million at the prior year end.

**Operating Cash Flow:** Net cash provided by operating activities was $1.2 million, driven by strong net income and effective working capital management.

**Investing Activities:** Capital expenditures totaled $320,000 during the year, primarily for technology infrastructure upgrades and equipment purchases.

**Financing Activities:** The Company made scheduled debt repayments of $500,000 and paid dividends of $175,000 to shareholders.

**Debt Levels:** Total debt decreased to $3.7 million from $4.2 million as the Company continues to deleverage its balance sheet.

Management believes that current cash resources and cash flows from operations will be sufficient to meet the Company's working capital and capital expenditure requirements for the next twelve months.`,
      linkedFsLines: ["bs-cash", "cf-operating-total", "bs-lt-debt"],
      linkedNotes: ["note-cash", "note-debt"],
      status: "REVIEWED",
      lastUpdated: "2024-12-19T15:00:00Z",
      updatedBy: "Controller",
    },
    {
      sectionId: "mda-outlook",
      sectionTitle: "Outlook",
      orderIndex: 3,
      narrativeText: `Looking ahead to fiscal 2025, management remains cautiously optimistic about the Company's growth prospects. Key strategic priorities include:

- Continued investment in cloud services capabilities
- Expansion of our customer base in the mid-market segment
- Development of next-generation product features
- Maintaining operational efficiency while scaling the business

Management expects revenue growth in the range of 8-12% for fiscal 2025, with continued improvement in profitability.`,
      linkedFsLines: [],
      linkedNotes: [],
      status: "DRAFT",
      lastUpdated: "2024-12-22T09:00:00Z",
      updatedBy: "CFO",
    },
  ],
  status: "REVIEWED",
  isLocked: false,
  updatedAt: "2024-12-20T10:00:00Z",
  updatedBy: "CFO",
};

// ========================
// TB Adjustments Workspace Sample Data
// ========================

// RJE Columns (Reclassification Journal Entries)
export const sampleRJEColumns: TBAdjustmentColumn[] = [
  { columnId: "rje-1", entryType: "RJE", entryNumber: 1, columnLabel: "RJE-1", isVisible: true, orderIndex: 0 },
  { columnId: "rje-2", entryType: "RJE", entryNumber: 2, columnLabel: "RJE-2", isVisible: true, orderIndex: 1 },
];

// AJE Columns (Adjusting Journal Entries)
export const sampleAJEColumns: TBAdjustmentColumn[] = [
  { columnId: "aje-1", entryType: "AJE", entryNumber: 1, columnLabel: "AJE-1", isVisible: true, orderIndex: 0 },
  { columnId: "aje-2", entryType: "AJE", entryNumber: 2, columnLabel: "AJE-2", isVisible: true, orderIndex: 1 },
  { columnId: "aje-3", entryType: "AJE", entryNumber: 3, columnLabel: "AJE-3", isVisible: true, orderIndex: 2 },
];

// Adjustment Entries (the actual journal entries)
export const sampleAdjustmentEntries: TBAdjustmentEntry[] = [
  {
    entryId: "entry-rje-1",
    entryType: "RJE",
    entryNumber: 1,
    entryLabel: "RJE-1",
    description: "Reclass prepaid to other current assets",
    debitAccountId: "gl-1350",
    creditAccountId: "gl-1300",
    amount: 50000,
    reference: "WP-RECLASS-001",
    preparedBy: "Staff Accountant",
    reviewedBy: "Senior Accountant",
    status: "APPROVED",
    createdAt: "2024-12-15T10:00:00Z",
    approvedAt: "2024-12-16T09:00:00Z",
  },
  {
    entryId: "entry-rje-2",
    entryType: "RJE",
    entryNumber: 2,
    entryLabel: "RJE-2",
    description: "Reclass current portion of long-term debt",
    debitAccountId: "gl-2500",
    creditAccountId: "gl-2250",
    amount: 200000,
    reference: "WP-RECLASS-002",
    preparedBy: "Staff Accountant",
    reviewedBy: "Controller",
    status: "APPROVED",
    createdAt: "2024-12-15T11:00:00Z",
    approvedAt: "2024-12-17T14:00:00Z",
  },
  {
    entryId: "entry-aje-1",
    entryType: "AJE",
    entryNumber: 1,
    entryLabel: "AJE-1",
    description: "Adjust bad debt provision",
    debitAccountId: "gl-6400",
    creditAccountId: "gl-1150",
    amount: 25000,
    reference: "WP-ADJ-001",
    preparedBy: "Staff Accountant",
    reviewedBy: "Senior Accountant",
    status: "APPROVED",
    createdAt: "2024-12-18T09:00:00Z",
    approvedAt: "2024-12-18T15:00:00Z",
  },
  {
    entryId: "entry-aje-2",
    entryType: "AJE",
    entryNumber: 2,
    entryLabel: "AJE-2",
    description: "Accrue year-end bonus",
    debitAccountId: "gl-6100",
    creditAccountId: "gl-2100",
    amount: 75000,
    reference: "WP-ADJ-002",
    preparedBy: "Senior Accountant",
    reviewedBy: "Controller",
    status: "APPROVED",
    createdAt: "2024-12-19T10:00:00Z",
    approvedAt: "2024-12-20T11:00:00Z",
  },
  {
    entryId: "entry-aje-3",
    entryType: "AJE",
    entryNumber: 3,
    entryLabel: "AJE-3",
    description: "Correct depreciation expense",
    debitAccountId: "gl-6300",
    creditAccountId: "gl-1550",
    amount: 15000,
    reference: "WP-ADJ-003",
    preparedBy: "Staff Accountant",
    reviewedBy: null,
    status: "PENDING_REVIEW",
    createdAt: "2024-12-21T14:00:00Z",
    approvedAt: null,
  },
];

// TB Adjustment Account Lines (all accounts with adjustments applied)
export const sampleAdjustmentLines: TBAdjustmentAccountLine[] = [
  // Current Assets
  { lineId: "adj-1010", accountId: "gl-1010", accountCode: "1010", accountName: "Cash and Cash Equivalents", fsCategory: "CURRENT_ASSETS", footnoteIds: ["fn-1"], normalBalance: "DEBIT", initialBalance: 2850000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 2850000, orderIndex: 1 },
  { lineId: "adj-1100", accountId: "gl-1100", accountCode: "1100", accountName: "Accounts Receivable", fsCategory: "CURRENT_ASSETS", footnoteIds: ["fn-2"], normalBalance: "DEBIT", initialBalance: 3600000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 3600000, orderIndex: 2 },
  { lineId: "adj-1150", accountId: "gl-1150", accountCode: "1150", accountName: "Allowance for Doubtful Accounts", fsCategory: "CURRENT_ASSETS", footnoteIds: [], normalBalance: "CREDIT", initialBalance: -150000, adjustments: { "aje-1": -25000 }, totalRJE: 0, totalAJE: -25000, netMovement: -25000, finalBalance: -175000, orderIndex: 3 },
  { lineId: "adj-1200", accountId: "gl-1200", accountCode: "1200", accountName: "Inventory", fsCategory: "CURRENT_ASSETS", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 890000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 890000, orderIndex: 4 },
  { lineId: "adj-1300", accountId: "gl-1300", accountCode: "1300", accountName: "Prepaid Expenses", fsCategory: "CURRENT_ASSETS", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 625000, adjustments: { "rje-1": -50000 }, totalRJE: -50000, totalAJE: 0, netMovement: -50000, finalBalance: 575000, orderIndex: 5 },
  { lineId: "adj-1350", accountId: "gl-1350", accountCode: "1350", accountName: "Other Current Assets", fsCategory: "CURRENT_ASSETS", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 550000, adjustments: { "rje-1": 50000 }, totalRJE: 50000, totalAJE: 0, netMovement: 50000, finalBalance: 600000, orderIndex: 6 },
  // Non-Current Assets
  { lineId: "adj-1500", accountId: "gl-1500", accountCode: "1500", accountName: "Property, Plant & Equipment", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-3"], normalBalance: "DEBIT", initialBalance: 8750000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 8750000, orderIndex: 7 },
  { lineId: "adj-1550", accountId: "gl-1550", accountCode: "1550", accountName: "Accumulated Depreciation - PPE", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-3"], normalBalance: "CREDIT", initialBalance: -3480000, adjustments: { "aje-3": -15000 }, totalRJE: 0, totalAJE: -15000, netMovement: -15000, finalBalance: -3495000, orderIndex: 8 },
  { lineId: "adj-1600", accountId: "gl-1600", accountCode: "1600", accountName: "Intangible Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-4"], normalBalance: "DEBIT", initialBalance: 2375000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 2375000, orderIndex: 9 },
  { lineId: "adj-1650", accountId: "gl-1650", accountCode: "1650", accountName: "Accumulated Amortization - Intangibles", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-4"], normalBalance: "CREDIT", initialBalance: -625000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -625000, orderIndex: 10 },
  { lineId: "adj-1700", accountId: "gl-1700", accountCode: "1700", accountName: "Right-of-Use Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-5"], normalBalance: "DEBIT", initialBalance: 2600000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 2600000, orderIndex: 11 },
  { lineId: "adj-1750", accountId: "gl-1750", accountCode: "1750", accountName: "Accumulated Depreciation - ROU", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-5"], normalBalance: "CREDIT", initialBalance: -500000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -500000, orderIndex: 12 },
  { lineId: "adj-1800", accountId: "gl-1800", accountCode: "1800", accountName: "Deferred Tax Assets", fsCategory: "NON_CURRENT_ASSETS", footnoteIds: ["fn-7"], normalBalance: "DEBIT", initialBalance: 300000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 300000, orderIndex: 13 },
  // Current Liabilities
  { lineId: "adj-2010", accountId: "gl-2010", accountCode: "2010", accountName: "Accounts Payable", fsCategory: "CURRENT_LIABILITIES", footnoteIds: [], normalBalance: "CREDIT", initialBalance: -1480000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -1480000, orderIndex: 14 },
  { lineId: "adj-2100", accountId: "gl-2100", accountCode: "2100", accountName: "Accrued Expenses", fsCategory: "CURRENT_LIABILITIES", footnoteIds: [], normalBalance: "CREDIT", initialBalance: -700000, adjustments: { "aje-2": -75000 }, totalRJE: 0, totalAJE: -75000, netMovement: -75000, finalBalance: -775000, orderIndex: 15 },
  { lineId: "adj-2150", accountId: "gl-2150", accountCode: "2150", accountName: "Income Taxes Payable", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-7"], normalBalance: "CREDIT", initialBalance: -225000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -225000, orderIndex: 16 },
  { lineId: "adj-2200", accountId: "gl-2200", accountCode: "2200", accountName: "Deferred Revenue - Current", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-2"], normalBalance: "CREDIT", initialBalance: -700000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -700000, orderIndex: 17 },
  { lineId: "adj-2250", accountId: "gl-2250", accountCode: "2250", accountName: "Current Portion of Long-Term Debt", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-6"], normalBalance: "CREDIT", initialBalance: -500000, adjustments: { "rje-2": -200000 }, totalRJE: -200000, totalAJE: 0, netMovement: -200000, finalBalance: -700000, orderIndex: 18 },
  { lineId: "adj-2300", accountId: "gl-2300", accountCode: "2300", accountName: "Current Lease Liabilities", fsCategory: "CURRENT_LIABILITIES", footnoteIds: ["fn-5"], normalBalance: "CREDIT", initialBalance: -185000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -185000, orderIndex: 19 },
  // Non-Current Liabilities
  { lineId: "adj-2500", accountId: "gl-2500", accountCode: "2500", accountName: "Long-Term Debt", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-6"], normalBalance: "CREDIT", initialBalance: -4000000, adjustments: { "rje-2": 200000 }, totalRJE: 200000, totalAJE: 0, netMovement: 200000, finalBalance: -3800000, orderIndex: 20 },
  { lineId: "adj-2600", accountId: "gl-2600", accountCode: "2600", accountName: "Long-Term Lease Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-5"], normalBalance: "CREDIT", initialBalance: -1615000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -1615000, orderIndex: 21 },
  { lineId: "adj-2700", accountId: "gl-2700", accountCode: "2700", accountName: "Deferred Tax Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: ["fn-7"], normalBalance: "CREDIT", initialBalance: -600000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -600000, orderIndex: 22 },
  { lineId: "adj-2800", accountId: "gl-2800", accountCode: "2800", accountName: "Other Long-Term Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", footnoteIds: [], normalBalance: "CREDIT", initialBalance: -300000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -300000, orderIndex: 23 },
  // Equity
  { lineId: "adj-3010", accountId: "gl-3010", accountCode: "3010", accountName: "Common Stock", fsCategory: "EQUITY", footnoteIds: ["fn-8"], normalBalance: "CREDIT", initialBalance: -50000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -50000, orderIndex: 24 },
  { lineId: "adj-3100", accountId: "gl-3100", accountCode: "3100", accountName: "Additional Paid-in Capital", fsCategory: "EQUITY", footnoteIds: ["fn-8"], normalBalance: "CREDIT", initialBalance: -3500000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -3500000, orderIndex: 25 },
  { lineId: "adj-3200", accountId: "gl-3200", accountCode: "3200", accountName: "Retained Earnings", fsCategory: "EQUITY", footnoteIds: ["fn-8"], normalBalance: "CREDIT", initialBalance: -3580000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -3580000, orderIndex: 26 },
  { lineId: "adj-3300", accountId: "gl-3300", accountCode: "3300", accountName: "Accumulated OCI", fsCategory: "EQUITY", footnoteIds: [], normalBalance: "CREDIT", initialBalance: 100000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 100000, orderIndex: 27 },
  // Revenue
  { lineId: "adj-4010", accountId: "gl-4010", accountCode: "4010", accountName: "Product Revenue", fsCategory: "REVENUE", footnoteIds: ["fn-2"], normalBalance: "CREDIT", initialBalance: -9500000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -9500000, orderIndex: 28 },
  { lineId: "adj-4100", accountId: "gl-4100", accountCode: "4100", accountName: "Service Revenue", fsCategory: "REVENUE", footnoteIds: ["fn-2"], normalBalance: "CREDIT", initialBalance: -2850000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -2850000, orderIndex: 29 },
  { lineId: "adj-4200", accountId: "gl-4200", accountCode: "4200", accountName: "Other Revenue", fsCategory: "OTHER_INCOME", footnoteIds: [], normalBalance: "CREDIT", initialBalance: -150000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: -150000, orderIndex: 30 },
  // Cost of Sales
  { lineId: "adj-5010", accountId: "gl-5010", accountCode: "5010", accountName: "Cost of Goods Sold", fsCategory: "COST_OF_SALES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 5700000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 5700000, orderIndex: 31 },
  { lineId: "adj-5100", accountId: "gl-5100", accountCode: "5100", accountName: "Cost of Services", fsCategory: "COST_OF_SALES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 1650000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 1650000, orderIndex: 32 },
  // Operating Expenses
  { lineId: "adj-6010", accountId: "gl-6010", accountCode: "6010", accountName: "Salaries & Wages", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 1850000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 1850000, orderIndex: 33 },
  { lineId: "adj-6100", accountId: "gl-6100", accountCode: "6100", accountName: "Employee Benefits", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 425000, adjustments: { "aje-2": 75000 }, totalRJE: 0, totalAJE: 75000, netMovement: 75000, finalBalance: 500000, orderIndex: 34 },
  { lineId: "adj-6200", accountId: "gl-6200", accountCode: "6200", accountName: "Rent Expense", fsCategory: "OPERATING_EXPENSES", footnoteIds: ["fn-5"], normalBalance: "DEBIT", initialBalance: 180000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 180000, orderIndex: 35 },
  { lineId: "adj-6300", accountId: "gl-6300", accountCode: "6300", accountName: "Depreciation & Amortization", fsCategory: "OPERATING_EXPENSES", footnoteIds: ["fn-3", "fn-4"], normalBalance: "DEBIT", initialBalance: 875000, adjustments: { "aje-3": 15000 }, totalRJE: 0, totalAJE: 15000, netMovement: 15000, finalBalance: 890000, orderIndex: 36 },
  { lineId: "adj-6400", accountId: "gl-6400", accountCode: "6400", accountName: "Professional Fees", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 215000, adjustments: { "aje-1": 25000 }, totalRJE: 0, totalAJE: 25000, netMovement: 25000, finalBalance: 240000, orderIndex: 37 },
  { lineId: "adj-6500", accountId: "gl-6500", accountCode: "6500", accountName: "Marketing & Advertising", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 275000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 275000, orderIndex: 38 },
  { lineId: "adj-6600", accountId: "gl-6600", accountCode: "6600", accountName: "Utilities", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 72000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 72000, orderIndex: 39 },
  { lineId: "adj-6700", accountId: "gl-6700", accountCode: "6700", accountName: "Insurance", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 95000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 95000, orderIndex: 40 },
  { lineId: "adj-6800", accountId: "gl-6800", accountCode: "6800", accountName: "Travel & Entertainment", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 58000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 58000, orderIndex: 41 },
  { lineId: "adj-6900", accountId: "gl-6900", accountCode: "6900", accountName: "Office Supplies & Expenses", fsCategory: "OPERATING_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 35000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 35000, orderIndex: 42 },
  // Other Expenses
  { lineId: "adj-7010", accountId: "gl-7010", accountCode: "7010", accountName: "Interest Expense", fsCategory: "OTHER_EXPENSES", footnoteIds: ["fn-6"], normalBalance: "DEBIT", initialBalance: 280000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 280000, orderIndex: 43 },
  { lineId: "adj-7100", accountId: "gl-7100", accountCode: "7100", accountName: "Other Expense", fsCategory: "OTHER_EXPENSES", footnoteIds: [], normalBalance: "DEBIT", initialBalance: 15000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 15000, orderIndex: 44 },
  // Tax
  { lineId: "adj-8010", accountId: "gl-8010", accountCode: "8010", accountName: "Income Tax Expense", fsCategory: "TAX_EXPENSE", footnoteIds: ["fn-7"], normalBalance: "DEBIT", initialBalance: 325000, adjustments: {}, totalRJE: 0, totalAJE: 0, netMovement: 0, finalBalance: 325000, orderIndex: 45 },
];

// Calculate adjustment workspace totals
const calculateAdjWorkspaceTotals = (lines: TBAdjustmentAccountLine[]) => {
  let totalInitial = 0;
  let totalFinal = 0;
  
  lines.forEach(line => {
    totalInitial += line.initialBalance;
    totalFinal += line.finalBalance;
  });
  
  return { totalInitial, totalFinal };
};

const adjTotals = calculateAdjWorkspaceTotals(sampleAdjustmentLines);

// Complete TB Adjustments Workspace
export const sampleTBAdjustmentsWorkspace: TBAdjustmentsWorkspace = {
  workspaceId: "adj-ws-fy2024",
  periodId: "FY2024",
  periodLabel: "FY 2024",
  entityName: "Lunari Corporation",
  reportingCurrency: "USD",
  footnotes: sampleTBFootnotes,
  rjeColumns: sampleRJEColumns,
  ajeColumns: sampleAJEColumns,
  entries: sampleAdjustmentEntries,
  lines: sampleAdjustmentLines,
  totalInitialBalance: adjTotals.totalInitial,
  totalFinalBalance: adjTotals.totalFinal,
  isBalanced: Math.abs(adjTotals.totalFinal) < 0.01,
  lastUpdated: "2024-12-21T16:00:00Z",
  updatedBy: "Controller",
};

// Final TB View - Read-only comparative (Prior Year vs Current Year)
export const sampleFinalTBLines: FinalTBLine[] = [
  // Current Assets
  { lineId: "ftb-1010", accountId: "gl-1010", accountCode: "1010", accountName: "Cash and Cash Equivalents", fsCategory: "CURRENT_ASSETS", priorYearClosing: 2450000, currentYearFinal: 2850000, variance: 400000, variancePercent: 16.33 },
  { lineId: "ftb-1100", accountId: "gl-1100", accountCode: "1100", accountName: "Accounts Receivable", fsCategory: "CURRENT_ASSETS", priorYearClosing: 3200000, currentYearFinal: 3600000, variance: 400000, variancePercent: 12.50 },
  { lineId: "ftb-1150", accountId: "gl-1150", accountCode: "1150", accountName: "Allowance for Doubtful Accounts", fsCategory: "CURRENT_ASSETS", priorYearClosing: -135000, currentYearFinal: -175000, variance: -40000, variancePercent: 29.63 },
  { lineId: "ftb-1200", accountId: "gl-1200", accountCode: "1200", accountName: "Inventory", fsCategory: "CURRENT_ASSETS", priorYearClosing: 815000, currentYearFinal: 890000, variance: 75000, variancePercent: 9.20 },
  { lineId: "ftb-1300", accountId: "gl-1300", accountCode: "1300", accountName: "Prepaid Expenses", fsCategory: "CURRENT_ASSETS", priorYearClosing: 580000, currentYearFinal: 575000, variance: -5000, variancePercent: -0.86 },
  { lineId: "ftb-1350", accountId: "gl-1350", accountCode: "1350", accountName: "Other Current Assets", fsCategory: "CURRENT_ASSETS", priorYearClosing: 500000, currentYearFinal: 600000, variance: 100000, variancePercent: 20.00 },
  // Non-Current Assets
  { lineId: "ftb-1500", accountId: "gl-1500", accountCode: "1500", accountName: "Property, Plant & Equipment", fsCategory: "NON_CURRENT_ASSETS", priorYearClosing: 8200000, currentYearFinal: 8750000, variance: 550000, variancePercent: 6.71 },
  { lineId: "ftb-1550", accountId: "gl-1550", accountCode: "1550", accountName: "Accumulated Depreciation - PPE", fsCategory: "NON_CURRENT_ASSETS", priorYearClosing: -2850000, currentYearFinal: -3495000, variance: -645000, variancePercent: 22.63 },
  { lineId: "ftb-1600", accountId: "gl-1600", accountCode: "1600", accountName: "Intangible Assets", fsCategory: "NON_CURRENT_ASSETS", priorYearClosing: 2200000, currentYearFinal: 2375000, variance: 175000, variancePercent: 7.95 },
  { lineId: "ftb-1650", accountId: "gl-1650", accountCode: "1650", accountName: "Accumulated Amortization - Intangibles", fsCategory: "NON_CURRENT_ASSETS", priorYearClosing: -400000, currentYearFinal: -625000, variance: -225000, variancePercent: 56.25 },
  { lineId: "ftb-1700", accountId: "gl-1700", accountCode: "1700", accountName: "Right-of-Use Assets", fsCategory: "NON_CURRENT_ASSETS", priorYearClosing: 2500000, currentYearFinal: 2600000, variance: 100000, variancePercent: 4.00 },
  { lineId: "ftb-1750", accountId: "gl-1750", accountCode: "1750", accountName: "Accumulated Depreciation - ROU", fsCategory: "NON_CURRENT_ASSETS", priorYearClosing: -350000, currentYearFinal: -500000, variance: -150000, variancePercent: 42.86 },
  { lineId: "ftb-1800", accountId: "gl-1800", accountCode: "1800", accountName: "Deferred Tax Assets", fsCategory: "NON_CURRENT_ASSETS", priorYearClosing: 285000, currentYearFinal: 300000, variance: 15000, variancePercent: 5.26 },
  // Current Liabilities
  { lineId: "ftb-2010", accountId: "gl-2010", accountCode: "2010", accountName: "Accounts Payable", fsCategory: "CURRENT_LIABILITIES", priorYearClosing: -1280000, currentYearFinal: -1480000, variance: -200000, variancePercent: 15.63 },
  { lineId: "ftb-2100", accountId: "gl-2100", accountCode: "2100", accountName: "Accrued Expenses", fsCategory: "CURRENT_LIABILITIES", priorYearClosing: -630000, currentYearFinal: -775000, variance: -145000, variancePercent: 23.02 },
  { lineId: "ftb-2150", accountId: "gl-2150", accountCode: "2150", accountName: "Income Taxes Payable", fsCategory: "CURRENT_LIABILITIES", priorYearClosing: -210000, currentYearFinal: -225000, variance: -15000, variancePercent: 7.14 },
  { lineId: "ftb-2200", accountId: "gl-2200", accountCode: "2200", accountName: "Deferred Revenue - Current", fsCategory: "CURRENT_LIABILITIES", priorYearClosing: -660000, currentYearFinal: -700000, variance: -40000, variancePercent: 6.06 },
  { lineId: "ftb-2250", accountId: "gl-2250", accountCode: "2250", accountName: "Current Portion of Long-Term Debt", fsCategory: "CURRENT_LIABILITIES", priorYearClosing: -500000, currentYearFinal: -700000, variance: -200000, variancePercent: 40.00 },
  { lineId: "ftb-2300", accountId: "gl-2300", accountCode: "2300", accountName: "Current Lease Liabilities", fsCategory: "CURRENT_LIABILITIES", priorYearClosing: -175000, currentYearFinal: -185000, variance: -10000, variancePercent: 5.71 },
  // Non-Current Liabilities
  { lineId: "ftb-2500", accountId: "gl-2500", accountCode: "2500", accountName: "Long-Term Debt", fsCategory: "NON_CURRENT_LIABILITIES", priorYearClosing: -4500000, currentYearFinal: -3800000, variance: 700000, variancePercent: -15.56 },
  { lineId: "ftb-2600", accountId: "gl-2600", accountCode: "2600", accountName: "Long-Term Lease Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", priorYearClosing: -1700000, currentYearFinal: -1615000, variance: 85000, variancePercent: -5.00 },
  { lineId: "ftb-2700", accountId: "gl-2700", accountCode: "2700", accountName: "Deferred Tax Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", priorYearClosing: -565000, currentYearFinal: -600000, variance: -35000, variancePercent: 6.19 },
  { lineId: "ftb-2800", accountId: "gl-2800", accountCode: "2800", accountName: "Other Long-Term Liabilities", fsCategory: "NON_CURRENT_LIABILITIES", priorYearClosing: -280000, currentYearFinal: -300000, variance: -20000, variancePercent: 7.14 },
  // Equity
  { lineId: "ftb-3010", accountId: "gl-3010", accountCode: "3010", accountName: "Common Stock", fsCategory: "EQUITY", priorYearClosing: -50000, currentYearFinal: -50000, variance: 0, variancePercent: 0 },
  { lineId: "ftb-3100", accountId: "gl-3100", accountCode: "3100", accountName: "Additional Paid-in Capital", fsCategory: "EQUITY", priorYearClosing: -3200000, currentYearFinal: -3500000, variance: -300000, variancePercent: 9.38 },
  { lineId: "ftb-3200", accountId: "gl-3200", accountCode: "3200", accountName: "Retained Earnings", fsCategory: "EQUITY", priorYearClosing: -3345000, currentYearFinal: -3580000, variance: -235000, variancePercent: 7.03 },
  { lineId: "ftb-3300", accountId: "gl-3300", accountCode: "3300", accountName: "Accumulated OCI", fsCategory: "EQUITY", priorYearClosing: 100000, currentYearFinal: 100000, variance: 0, variancePercent: 0 },
];

// Calculate Final TB totals (balance sheet accounts only for this view)
const calculateFinalTBTotals = (lines: FinalTBLine[]) => {
  // Filter to balance sheet accounts only (assets, liabilities, equity)
  const bsCategories = ["CURRENT_ASSETS", "NON_CURRENT_ASSETS", "CURRENT_LIABILITIES", "NON_CURRENT_LIABILITIES", "EQUITY"];
  const bsLines = lines.filter(l => l.fsCategory && bsCategories.includes(l.fsCategory));
  
  let totalPrior = 0;
  let totalCurrent = 0;
  
  bsLines.forEach(line => {
    totalPrior += line.priorYearClosing;
    totalCurrent += line.currentYearFinal;
  });
  
  return { totalPrior, totalCurrent };
};

const finalTBTotals = calculateFinalTBTotals(sampleFinalTBLines);

export const sampleFinalTBView: FinalTBView = {
  viewId: "ftb-fy2024",
  currentPeriodId: "FY2024",
  currentPeriodLabel: "FY 2024",
  priorPeriodId: "FY2023",
  priorPeriodLabel: "FY 2023",
  entityName: "Lunari Corporation",
  reportingCurrency: "USD",
  lines: sampleFinalTBLines,
  totalPriorYear: finalTBTotals.totalPrior,
  totalCurrentYear: finalTBTotals.totalCurrent,
  isBalanced: Math.abs(finalTBTotals.totalCurrent) < 0.01,
};

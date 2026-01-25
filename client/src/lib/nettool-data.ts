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
    scheduleIds: ["sch-intangibles-rollforward"],
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

import { randomUUID } from "crypto";
import type { 
  ScheduleMaster, 
  InsertScheduleMaster, 
  ScheduleEvent, 
  InsertScheduleEvent,
  PeriodLine,
  Entity,
  PeriodStatus,
  ScheduleSummary,
  PeriodState,
  PrepaidSchedule,
  InsertPrepaidSchedule,
  PrepaidDashboardKPIs,
  PrepaidCategoryBreakdown,
  AmortizationTrendPoint,
  PrepaidSubcategory,
  FixedAsset,
  InsertFixedAsset,
  FixedAssetDashboardKPIs,
  AssetClassBreakdown,
  DepreciationTrendPoint,
  UsefulLifeDistribution,
  ControlFlag,
  AssetClass,
  AccrualSchedule,
  InsertAccrualSchedule,
  AccrualDashboardKPIs,
  AccrualCategorySummary,
  AccrualTrendPoint,
  AccrualRiskPanel,
  AccrualMixBreakdown,
  AccrualCategory,
  RevenueSchedule,
  InsertRevenueSchedule,
  RevenueDashboardKPIs,
  RevenueCategorySummary,
  RevenueTrendPoint,
  DeferredRevenueRollforward,
  RevenueMixBreakdown,
  RevenueRiskPanel,
  RevenueCategory,
  InvestmentIncomeSchedule,
  InsertInvestmentIncomeSchedule,
  InvestmentIncomeDashboardKPIs,
  InvestmentIncomeCategorySummary,
  InvestmentIncomeTrendPoint,
  YieldMixBreakdown,
  AccruedVsReceivedPoint,
  InvestmentIncomeRiskPanel,
  InvestmentCategory,
  DebtSchedule,
  InsertDebtSchedule,
  DebtDashboardKPIs,
  DebtCategorySummary,
  DebtTrendPoint,
  PrincipalInterestSplit,
  DebtMixBreakdown,
  DebtRiskPanel,
  DebtCategory,
  CloseTemplate,
  CloseTemplateTask,
  InsertCloseTemplate,
  InsertCloseTemplateTask,
  UpdateCloseTemplate,
  UpdateCloseTemplateTask,
  CloseTask,
  InsertCloseTask,
  ReconciliationTemplate,
  ReconciliationAccount,
  Reconciliation,
  ReconciliationKPIs,
  InsertReconciliationTemplate,
  InsertReconciliationAccount,
  InsertReconciliation,
  InsertReconciliationLineItem,
  ReconciliationLineItem,
  ReconciliationAccountType,
  ReconciliationStatus,
  defaultAccountGroupForType,
  GLMasterMapping,
  GLMasterMappingRegistry,
  BSPLCategory,
  WorkingPaper,
  WorkingPaperRow,
  WorkingPaperColumn,
  FinancialArtifact,
  InsertArtifact,
  UpdateArtifact,
  ArtifactPurpose,
  ArtifactStatus,
  ArtifactHealthMetrics,
  PeriodCoverageSummary,
  EntityCoverageSummary
} from "@shared/schema";

// Trial Balance Import Entry
export interface TBImportEntry {
  id: string;
  accountCode: string;
  accountName: string;
  openingBalance: number;
  closingBalance: number;
  debitAmount: number;
  creditAmount: number;
  fsCategory: string | null;
  normalBalance: "DEBIT" | "CREDIT";
  importedAt: string;
  periodId: string;
}

export interface TBImportBatch {
  batchId: string;
  periodId: string;
  entityId: string;
  importedAt: string;
  importedBy: string;
  fileName: string;
  recordCount: number;
  entries: TBImportEntry[];
}

export interface IStorage {
  // Schedules
  getSchedules(): Promise<ScheduleMaster[]>;
  getSchedule(id: string): Promise<ScheduleMaster | undefined>;
  createSchedule(data: InsertScheduleMaster): Promise<ScheduleMaster>;
  
  // Events
  getScheduleEvents(scheduleId: string): Promise<ScheduleEvent[]>;
  createScheduleEvent(data: InsertScheduleEvent): Promise<ScheduleEvent>;
  
  // Periods (calculated, not stored)
  getSchedulePeriods(scheduleId: string): Promise<PeriodLine[]>;
  rebuildSchedule(scheduleId: string): Promise<PeriodLine[]>;
  
  // Entities
  getEntities(): Promise<Entity[]>;
  
  // Period Status
  getPeriodStatuses(entityId: string): Promise<PeriodStatus[]>;
  closePeriod(entityId: string, period: string): Promise<PeriodStatus>;
  isPeriodClosed(entityId: string, period: string): Promise<boolean>;
  
  // Summary
  getScheduleSummary(): Promise<ScheduleSummary>;
  
  // Prepaid Dashboard
  getPrepaidSchedules(entityId?: string, subcategory?: PrepaidSubcategory): Promise<PrepaidSchedule[]>;
  getPrepaidSchedule(id: string): Promise<PrepaidSchedule | undefined>;
  createPrepaidSchedule(data: InsertPrepaidSchedule): Promise<PrepaidSchedule>;
  getPrepaidDashboardKPIs(entityId?: string, period?: string): Promise<PrepaidDashboardKPIs>;
  getPrepaidCategoryBreakdown(entityId?: string): Promise<PrepaidCategoryBreakdown[]>;
  getAmortizationTrend(entityId?: string, periods?: number): Promise<AmortizationTrendPoint[]>;
  
  // Fixed Assets Dashboard
  getFixedAssets(entityId?: string, assetClass?: AssetClass): Promise<FixedAsset[]>;
  getFixedAsset(id: string): Promise<FixedAsset | undefined>;
  createFixedAsset(data: InsertFixedAsset): Promise<FixedAsset>;
  getFixedAssetDashboardKPIs(entityId?: string, period?: string): Promise<FixedAssetDashboardKPIs>;
  getAssetClassBreakdown(entityId?: string): Promise<AssetClassBreakdown[]>;
  getDepreciationTrend(entityId?: string, periods?: number): Promise<DepreciationTrendPoint[]>;
  getUsefulLifeDistribution(entityId?: string): Promise<UsefulLifeDistribution[]>;
  getControlFlags(entityId?: string): Promise<ControlFlag[]>;
  
  // Accruals Dashboard
  getAccrualSchedules(entityId?: string, category?: AccrualCategory): Promise<AccrualSchedule[]>;
  getAccrualSchedule(id: string): Promise<AccrualSchedule | undefined>;
  createAccrualSchedule(data: InsertAccrualSchedule): Promise<AccrualSchedule>;
  getAccrualDashboardKPIs(entityId?: string, period?: string): Promise<AccrualDashboardKPIs>;
  getAccrualCategorySummaries(entityId?: string): Promise<AccrualCategorySummary[]>;
  getAccrualTrend(entityId?: string, periods?: number): Promise<AccrualTrendPoint[]>;
  getAccrualRiskPanels(entityId?: string): Promise<AccrualRiskPanel[]>;
  getAccrualMixBreakdown(entityId?: string): Promise<AccrualMixBreakdown[]>;
  
  // Revenue & Contracts Dashboard
  getRevenueSchedules(entityId?: string, category?: RevenueCategory): Promise<RevenueSchedule[]>;
  getRevenueSchedule(id: string): Promise<RevenueSchedule | undefined>;
  createRevenueSchedule(data: InsertRevenueSchedule): Promise<RevenueSchedule>;
  getRevenueDashboardKPIs(entityId?: string, period?: string): Promise<RevenueDashboardKPIs>;
  getRevenueCategorySummaries(entityId?: string): Promise<RevenueCategorySummary[]>;
  getRevenueTrend(entityId?: string, periods?: number): Promise<RevenueTrendPoint[]>;
  getDeferredRevenueRollforward(entityId?: string, periods?: number): Promise<DeferredRevenueRollforward[]>;
  getRevenueMixBreakdown(entityId?: string): Promise<RevenueMixBreakdown[]>;
  getRevenueRiskPanels(entityId?: string): Promise<RevenueRiskPanel[]>;
  
  // Investment Income Earned Dashboard
  getInvestmentIncomeSchedules(entityId?: string, category?: InvestmentCategory): Promise<InvestmentIncomeSchedule[]>;
  getInvestmentIncomeSchedule(id: string): Promise<InvestmentIncomeSchedule | undefined>;
  createInvestmentIncomeSchedule(data: InsertInvestmentIncomeSchedule): Promise<InvestmentIncomeSchedule>;
  getInvestmentIncomeDashboardKPIs(entityId?: string, period?: string): Promise<InvestmentIncomeDashboardKPIs>;
  getInvestmentIncomeCategorySummaries(entityId?: string): Promise<InvestmentIncomeCategorySummary[]>;
  getInvestmentIncomeTrend(entityId?: string, periods?: number): Promise<InvestmentIncomeTrendPoint[]>;
  getYieldMixBreakdown(entityId?: string): Promise<YieldMixBreakdown[]>;
  getAccruedVsReceived(entityId?: string, periods?: number): Promise<AccruedVsReceivedPoint[]>;
  getInvestmentIncomeRiskPanels(entityId?: string): Promise<InvestmentIncomeRiskPanel[]>;
  
  // Loan & Debt Amortization Dashboard
  getDebtSchedules(entityId?: string, category?: DebtCategory): Promise<DebtSchedule[]>;
  getDebtSchedule(id: string): Promise<DebtSchedule | undefined>;
  createDebtSchedule(data: InsertDebtSchedule): Promise<DebtSchedule>;
  getDebtDashboardKPIs(entityId?: string, period?: string): Promise<DebtDashboardKPIs>;
  getDebtCategorySummaries(entityId?: string): Promise<DebtCategorySummary[]>;
  getDebtTrend(entityId?: string, periods?: number): Promise<DebtTrendPoint[]>;
  getPrincipalInterestSplit(entityId?: string, periods?: number): Promise<PrincipalInterestSplit[]>;
  getDebtMixBreakdown(entityId?: string): Promise<DebtMixBreakdown[]>;
  getDebtRiskPanels(entityId?: string): Promise<DebtRiskPanel[]>;
  
  // Close Control Templates
  getCloseTemplates(templateType?: "TASKLIST" | "SCHEDULE"): Promise<CloseTemplate[]>;
  getCloseTemplate(id: string): Promise<CloseTemplate | undefined>;
  createCloseTemplate(data: InsertCloseTemplate): Promise<CloseTemplate>;
  updateCloseTemplate(id: string, data: UpdateCloseTemplate): Promise<CloseTemplate>;
  deleteCloseTemplate(id: string): Promise<boolean>;
  cloneCloseTemplate(id: string, newName: string): Promise<CloseTemplate>;
  
  // Close Template Tasks
  getCloseTemplateTasks(templateId: string): Promise<CloseTemplateTask[]>;
  getCloseTemplateTask(id: string): Promise<CloseTemplateTask | undefined>;
  createCloseTemplateTask(data: InsertCloseTemplateTask): Promise<CloseTemplateTask>;
  updateCloseTemplateTask(id: string, data: UpdateCloseTemplateTask): Promise<CloseTemplateTask>;
  deleteCloseTemplateTask(id: string): Promise<boolean>;
  reorderCloseTemplateTasks(templateId: string, taskIds: string[]): Promise<CloseTemplateTask[]>;
  
  // Close Tasks (active tasks in close schedules)
  getCloseTasklistTasks(tasklistId: string): Promise<CloseTask[]>;
  getCloseTask(id: string): Promise<CloseTask | undefined>;
  createCloseTask(data: Partial<CloseTask> & { tasklistId: string; name: string }): Promise<CloseTask>;
  updateCloseTask(id: string, data: Partial<CloseTask>): Promise<CloseTask>;
  getAllCloseTasks(): Promise<CloseTask[]>;
  
  // Reconciliation Templates
  getReconciliationTemplates(): Promise<ReconciliationTemplate[]>;
  getReconciliationTemplate(id: string): Promise<ReconciliationTemplate | undefined>;
  createReconciliationTemplate(data: InsertReconciliationTemplate): Promise<ReconciliationTemplate>;
  
  // Reconciliation Accounts
  getReconciliationAccounts(entityId?: string, accountType?: ReconciliationAccountType): Promise<ReconciliationAccount[]>;
  getReconciliationAccount(id: string): Promise<ReconciliationAccount | undefined>;
  createReconciliationAccount(data: InsertReconciliationAccount): Promise<ReconciliationAccount>;
  
  // Reconciliations
  getReconciliations(accountId?: string, period?: string, status?: ReconciliationStatus): Promise<Reconciliation[]>;
  getReconciliation(id: string): Promise<Reconciliation | undefined>;
  createReconciliation(data: InsertReconciliation): Promise<Reconciliation>;
  updateReconciliationStatus(id: string, status: ReconciliationStatus, userId: string): Promise<Reconciliation>;
  updateReconciliationTemplate(id: string, templateId: string): Promise<Reconciliation>;
  addReconciliationLineItem(reconciliationId: string, sectionId: string, data: InsertReconciliationLineItem): Promise<Reconciliation>;
  
  // Reconciliation Dashboard
  getReconciliationKPIs(entityId?: string, period?: string): Promise<ReconciliationKPIs>;
  
  // GL Master Mapping
  getGLMasterMappings(): Promise<GLMasterMapping[]>;
  getGLMasterMapping(id: string): Promise<GLMasterMapping | undefined>;
  createGLMasterMapping(data: Omit<GLMasterMapping, 'mappingId'>): Promise<GLMasterMapping>;
  updateGLMasterMapping(id: string, data: Partial<GLMasterMapping>): Promise<GLMasterMapping>;
  deleteGLMasterMapping(id: string): Promise<boolean>;
  getUniqueWPNames(): Promise<string[]>;
  
  // Trial Balance Import
  getTBImportBatches(entityId?: string, periodId?: string): Promise<TBImportBatch[]>;
  getTBImportBatch(batchId: string): Promise<TBImportBatch | undefined>;
  createTBImportBatch(data: Omit<TBImportBatch, 'batchId' | 'importedAt'>): Promise<TBImportBatch>;
  deleteTBImportBatch(batchId: string): Promise<boolean>;
  
  // Working Papers
  getWorkingPapers(entityId?: string, periodId?: string): Promise<WorkingPaper[]>;
  getWorkingPaper(id: string): Promise<WorkingPaper | undefined>;
  createWorkingPaper(data: Omit<WorkingPaper, 'workingPaperId' | 'createdAt' | 'lastUpdated'>): Promise<WorkingPaper>;
  updateWorkingPaper(id: string, data: Partial<WorkingPaper>): Promise<WorkingPaper>;
  deleteWorkingPaper(id: string): Promise<boolean>;
  
  // Auto-populate Working Papers from TB data using GL Master Mapping
  autoPopulateWorkingPapers(entityId: string, periodId: string): Promise<{ 
    wpCount: number; 
    rowsPopulated: number; 
    workingPapers: WorkingPaper[] 
  }>;
  
  // Financial Artifacts (Document Registry)
  getArtifacts(filters?: {
    entityId?: string;
    period?: string;
    purpose?: ArtifactPurpose;
    status?: ArtifactStatus;
    isRequired?: boolean;
    isAuditRelevant?: boolean;
    linkedScheduleId?: string;
    linkedAccountCode?: string;
    virtualFolderPath?: string;
  }): Promise<FinancialArtifact[]>;
  getArtifact(id: string): Promise<FinancialArtifact | undefined>;
  createArtifact(data: InsertArtifact): Promise<FinancialArtifact>;
  updateArtifact(id: string, data: UpdateArtifact): Promise<FinancialArtifact>;
  deleteArtifact(id: string): Promise<boolean>;
  
  // Artifact Health Metrics (Management Dashboard)
  getArtifactHealthMetrics(entityId?: string, period?: string): Promise<ArtifactHealthMetrics>;
  getPeriodCoverageSummary(entityId: string): Promise<PeriodCoverageSummary[]>;
  getEntityCoverageSummary(): Promise<EntityCoverageSummary[]>;
  
  // Virtual Folder Navigation
  getVirtualFolderPaths(entityId?: string, period?: string): Promise<string[]>;
}

// Helper functions
function parseYearMonth(ym: string): { year: number; month: number } {
  const [year, month] = ym.split("-").map(Number);
  return { year, month };
}

function formatYearMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function addMonths(ym: string, months: number): string {
  const { year, month } = parseYearMonth(ym);
  const totalMonths = year * 12 + month - 1 + months;
  const newYear = Math.floor(totalMonths / 12);
  const newMonth = (totalMonths % 12) + 1;
  return formatYearMonth(newYear, newMonth);
}

function monthsBetween(start: string, end: string): number {
  const s = parseYearMonth(start);
  const e = parseYearMonth(end);
  return (e.year - s.year) * 12 + (e.month - s.month) + 1;
}

function comparePeriods(a: string, b: string): number {
  return a.localeCompare(b);
}

export class MemStorage implements IStorage {
  private schedules: Map<string, ScheduleMaster>;
  private events: Map<string, ScheduleEvent[]>;
  private entities: Map<string, Entity>;
  private periodStatuses: Map<string, PeriodStatus>;
  private cachedPeriods: Map<string, PeriodLine[]>;
  private prepaidSchedules: Map<string, PrepaidSchedule>;
  private fixedAssets: Map<string, FixedAsset>;
  private accrualSchedules: Map<string, AccrualSchedule>;
  private revenueSchedules: Map<string, RevenueSchedule>;
  private investmentIncomeSchedules: Map<string, InvestmentIncomeSchedule>;
  private debtSchedules: Map<string, DebtSchedule>;
  private closeTemplates: Map<string, CloseTemplate>;
  private closeTemplateTasks: Map<string, CloseTemplateTask>;
  private closeTasks: Map<string, CloseTask>;
  private reconciliationTemplates: Map<string, ReconciliationTemplate>;
  private reconciliationAccounts: Map<string, ReconciliationAccount>;
  private reconciliations: Map<string, Reconciliation>;
  private glMasterMappings: Map<string, GLMasterMapping>;
  private tbImportBatches: Map<string, TBImportBatch>;
  private workingPapers: Map<string, WorkingPaper>;
  private financialArtifacts: Map<string, FinancialArtifact>;

  constructor() {
    this.schedules = new Map();
    this.events = new Map();
    this.entities = new Map();
    this.periodStatuses = new Map();
    this.cachedPeriods = new Map();
    this.prepaidSchedules = new Map();
    this.fixedAssets = new Map();
    this.accrualSchedules = new Map();
    this.revenueSchedules = new Map();
    this.closeTemplates = new Map();
    this.closeTemplateTasks = new Map();
    this.closeTasks = new Map();
    this.investmentIncomeSchedules = new Map();
    this.debtSchedules = new Map();
    this.reconciliationTemplates = new Map();
    this.reconciliationAccounts = new Map();
    this.reconciliations = new Map();
    this.glMasterMappings = new Map();
    this.tbImportBatches = new Map();
    this.workingPapers = new Map();
    this.financialArtifacts = new Map();
    
    // Seed with default entities
    this.seedData();
    this.seedCloseTasks();
    this.seedReconciliationData();
    this.seedGLMasterMappings();
  }

  private seedData() {
    const defaultEntities: Entity[] = [
      { id: "CORP-001", name: "Corp HQ", localCurrency: "USD", reportingCurrency: "USD" },
      { id: "SUB-US", name: "US Subsidiary", localCurrency: "USD", reportingCurrency: "USD" },
      { id: "SUB-EU", name: "EU Subsidiary", localCurrency: "EUR", reportingCurrency: "USD" },
      { id: "SUB-UK", name: "UK Subsidiary", localCurrency: "GBP", reportingCurrency: "USD" },
      { id: "SUB-JP", name: "Japan Subsidiary", localCurrency: "JPY", reportingCurrency: "USD" },
    ];
    
    for (const entity of defaultEntities) {
      this.entities.set(entity.id, entity);
    }

    // Seed with sample schedules
    const sampleSchedules: InsertScheduleMaster[] = [
      {
        scheduleType: "PREPAID",
        entityId: "CORP-001",
        description: "Annual Software License - Enterprise Suite",
        localCurrency: "USD",
        reportingCurrency: "USD",
        startDate: "2024-01",
        endDate: "2024-12",
        totalAmountLocal: 120000,
        totalAmountReporting: 120000,
        systemPostingStartPeriod: null,
      },
      {
        scheduleType: "PREPAID",
        entityId: "SUB-EU",
        description: "Office Lease Prepayment - Berlin",
        localCurrency: "EUR",
        reportingCurrency: "USD",
        startDate: "2024-01",
        endDate: "2025-06",
        totalAmountLocal: 90000,
        totalAmountReporting: 99000,
        systemPostingStartPeriod: "2024-03",
      },
      {
        scheduleType: "FIXED_ASSET",
        entityId: "SUB-US",
        description: "Manufacturing Equipment - Line A",
        localCurrency: "USD",
        reportingCurrency: "USD",
        startDate: "2024-01",
        endDate: "2028-12",
        totalAmountLocal: 500000,
        totalAmountReporting: 500000,
        systemPostingStartPeriod: null,
      },
    ];

    for (const schedule of sampleSchedules) {
      this.createScheduleSync(schedule);
    }

    // Seed some closed periods for demonstration
    this.periodStatuses.set("CORP-001-2024-01", {
      entityId: "CORP-001",
      period: "2024-01",
      status: "CLOSED",
      closedAt: "2024-02-15T00:00:00.000Z"
    });
    this.periodStatuses.set("CORP-001-2024-02", {
      entityId: "CORP-001",
      period: "2024-02",
      status: "CLOSED",
      closedAt: "2024-03-15T00:00:00.000Z"
    });

    // Rebuild all schedules to incorporate closed period statuses
    const scheduleIds = Array.from(this.schedules.keys());
    for (const scheduleId of scheduleIds) {
      this.rebuildScheduleSync(scheduleId);
    }

    // Seed prepaid schedules for Category Dashboard
    this.seedPrepaidSchedules();
    
    // Seed fixed assets for Category Dashboard
    this.seedFixedAssets();
    
    // Seed accrual schedules for Category Dashboard
    this.seedAccrualSchedules();
    
    // Seed revenue schedules for Category Dashboard
    this.seedRevenueSchedules();
    
    // Seed investment income schedules for Category Dashboard
    this.seedInvestmentIncomeSchedules();
    
    // Seed debt schedules for Category Dashboard
    this.seedDebtSchedules();
    
    // Seed close control templates
    this.seedCloseTemplates();
  }

  private seedPrepaidSchedules() {
    const now = new Date().toISOString();
    const samplePrepaids: PrepaidSchedule[] = [
      {
        id: randomUUID(),
        name: "Annual D&O Insurance Premium",
        subcategory: "INSURANCE",
        entityId: "CORP-001",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        originalAmount: 48000,
        currency: "USD",
        monthlyExpense: 4000,
        remainingBalance: 40000,
        status: "ACTIVE",
        evidence: "ATTACHED",
        owner: "Sarah Chen",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Cybersecurity Insurance",
        subcategory: "INSURANCE",
        entityId: "CORP-001",
        startDate: "2025-02-01",
        endDate: "2026-01-31",
        originalAmount: 36000,
        currency: "USD",
        monthlyExpense: 3000,
        remainingBalance: 33000,
        status: "ACTIVE",
        evidence: "ATTACHED",
        owner: "Michael Torres",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "HQ Office Lease Q1-Q4",
        subcategory: "RENT",
        entityId: "CORP-001",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        originalAmount: 180000,
        currency: "USD",
        monthlyExpense: 15000,
        remainingBalance: 150000,
        status: "ACTIVE",
        evidence: "ATTACHED",
        owner: "James Wilson",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Berlin Office Rent",
        subcategory: "RENT",
        entityId: "SUB-EU",
        startDate: "2025-01-01",
        endDate: "2025-06-30",
        originalAmount: 72000,
        currency: "EUR",
        monthlyExpense: 12000,
        remainingBalance: 48000,
        status: "ACTIVE",
        evidence: "MISSING",
        owner: "Anna Schmidt",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Salesforce Enterprise License",
        subcategory: "SOFTWARE",
        entityId: "CORP-001",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        originalAmount: 96000,
        currency: "USD",
        monthlyExpense: 8000,
        remainingBalance: 80000,
        status: "ACTIVE",
        evidence: "ATTACHED",
        owner: "Emily Park",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "AWS Reserved Instances",
        subcategory: "SOFTWARE",
        entityId: "CORP-001",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        originalAmount: 120000,
        currency: "USD",
        monthlyExpense: 10000,
        remainingBalance: 100000,
        status: "ACTIVE",
        evidence: "ATTACHED",
        owner: "David Kim",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Microsoft 365 Annual",
        subcategory: "SOFTWARE",
        entityId: "SUB-US",
        startDate: "2024-07-01",
        endDate: "2025-06-30",
        originalAmount: 24000,
        currency: "USD",
        monthlyExpense: 2000,
        remainingBalance: 10000,
        status: "ACTIVE",
        evidence: "ATTACHED",
        owner: "Lisa Brown",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Annual Trade Show Booth",
        subcategory: "OTHER",
        entityId: "CORP-001",
        startDate: "2025-03-01",
        endDate: "2026-02-28",
        originalAmount: 60000,
        currency: "USD",
        monthlyExpense: 5000,
        remainingBalance: 60000,
        status: "ACTIVE",
        evidence: "MISSING",
        owner: "Robert Johnson",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "2024 Software Maintenance",
        subcategory: "SOFTWARE",
        entityId: "CORP-001",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        originalAmount: 36000,
        currency: "USD",
        monthlyExpense: 3000,
        remainingBalance: 0,
        status: "COMPLETED",
        evidence: "ATTACHED",
        owner: "Emily Park",
        createdAt: now,
      },
    ];

    for (const prepaid of samplePrepaids) {
      this.prepaidSchedules.set(prepaid.id, prepaid);
    }
  }

  private createScheduleSync(data: InsertScheduleMaster): ScheduleMaster {
    const scheduleId = randomUUID();
    const now = new Date().toISOString();
    
    const impliedFx = data.totalAmountReporting / data.totalAmountLocal;
    const periodCount = data.endDate 
      ? monthsBetween(data.startDate, data.endDate)
      : 12; // Default to 12 for ongoing

    const schedule: ScheduleMaster = {
      scheduleId,
      scheduleType: data.scheduleType,
      entityId: data.entityId,
      description: data.description,
      localCurrency: data.localCurrency,
      reportingCurrency: data.reportingCurrency,
      startDate: data.startDate,
      endDate: data.endDate,
      totalAmountLocalInitial: data.totalAmountLocal,
      totalAmountReportingInitial: data.totalAmountReporting,
      impliedFxInitial: impliedFx,
      recognitionPeriods: periodCount,
      systemPostingStartPeriod: data.systemPostingStartPeriod || null,
      createdAt: now,
      createdBy: "system",
    };

    this.schedules.set(scheduleId, schedule);
    this.events.set(scheduleId, []);
    
    // Build initial periods
    this.rebuildScheduleSync(scheduleId);
    
    return schedule;
  }

  async getSchedules(): Promise<ScheduleMaster[]> {
    return Array.from(this.schedules.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getSchedule(id: string): Promise<ScheduleMaster | undefined> {
    return this.schedules.get(id);
  }

  async createSchedule(data: InsertScheduleMaster): Promise<ScheduleMaster> {
    return this.createScheduleSync(data);
  }

  async getScheduleEvents(scheduleId: string): Promise<ScheduleEvent[]> {
    return this.events.get(scheduleId) || [];
  }

  async createScheduleEvent(data: InsertScheduleEvent): Promise<ScheduleEvent> {
    const schedule = this.schedules.get(data.scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    // Validate event type is supported
    const supportedEventTypes = ["AMOUNT_ADJUSTMENT", "TIMELINE_EXTENSION", "TIMELINE_REDUCTION", "ONBOARDING_BOUNDARY"];
    if (!supportedEventTypes.includes(data.eventType)) {
      throw new Error(`Event type ${data.eventType} is not yet supported`);
    }

    // Validate effective period is not before schedule start
    if (comparePeriods(data.effectivePeriod, schedule.startDate) < 0) {
      throw new Error("Event effective period cannot be before schedule start date");
    }

    // Check if effective period is in a closed period
    const isClosed = await this.isPeriodClosed(schedule.entityId, data.effectivePeriod);
    if (isClosed) {
      throw new Error("Cannot add event to a closed period. Changes must be prospective only.");
    }

    const eventId = randomUUID();
    const now = new Date().toISOString();

    const event: ScheduleEvent = {
      eventId,
      scheduleId: data.scheduleId,
      eventType: data.eventType,
      effectivePeriod: data.effectivePeriod,
      eventPayload: data.eventPayload,
      createdAt: now,
      createdBy: "user",
      reason: data.reason || null,
    };

    const events = this.events.get(data.scheduleId) || [];
    events.push(event);
    
    // Sort events by effective period and creation time for deterministic rebuild
    events.sort((a, b) => {
      const periodCompare = comparePeriods(a.effectivePeriod, b.effectivePeriod);
      if (periodCompare !== 0) return periodCompare;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    
    this.events.set(data.scheduleId, events);

    // Rebuild schedule after event
    await this.rebuildSchedule(data.scheduleId);

    return event;
  }

  async getSchedulePeriods(scheduleId: string): Promise<PeriodLine[]> {
    return this.cachedPeriods.get(scheduleId) || [];
  }

  async isPeriodClosed(entityId: string, period: string): Promise<boolean> {
    const key = `${entityId}-${period}`;
    const status = this.periodStatuses.get(key);
    return status?.status === "CLOSED";
  }

  private isPeriodClosedSync(entityId: string, period: string): boolean {
    const key = `${entityId}-${period}`;
    const status = this.periodStatuses.get(key);
    return status?.status === "CLOSED";
  }

  /**
   * Deterministic schedule rebuild algorithm
   * 
   * Given schedule_id:
   * 1. Identify last CLOSED period snapshot (for future use)
   * 2. Initialize state at that boundary
   * 3. Apply events in order (by effective period, then creation time)
   * 4. Generate forward schedule lines
   * 5. Apply adjustment deltas if needed
   * 6. Persist results for OPEN periods only
   */
  private rebuildScheduleSync(scheduleId: string): PeriodLine[] {
    const schedule = this.schedules.get(scheduleId);
    if (!schedule) {
      return [];
    }

    const events = this.events.get(scheduleId) || [];
    
    // Sort events for deterministic processing (by effective period, then creation time)
    const sortedEvents = [...events].sort((a, b) => {
      const periodCompare = comparePeriods(a.effectivePeriod, b.effectivePeriod);
      if (periodCompare !== 0) return periodCompare;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    // Initialize with recognition snapshot values
    let totalReporting = schedule.totalAmountReportingInitial;
    let totalLocal = schedule.totalAmountLocalInitial;
    let effectiveFx = schedule.impliedFxInitial;
    let endDate = schedule.endDate;
    let systemPostingStart = schedule.systemPostingStartPeriod;

    // Track cumulative adjustments per period for delta calculation
    const periodAdjustments = new Map<string, { reporting: number; local: number; reason: string }>();

    // Apply events in order to calculate final state
    for (const event of sortedEvents) {
      switch (event.eventType) {
        case "AMOUNT_ADJUSTMENT":
          if (event.eventPayload.amountReportingDelta) {
            totalReporting += event.eventPayload.amountReportingDelta;
            
            // Track adjustment for this period
            const existing = periodAdjustments.get(event.effectivePeriod) || { reporting: 0, local: 0, reason: "" };
            existing.reporting += event.eventPayload.amountReportingDelta;
            existing.reason = event.reason || "Amount adjustment";
            periodAdjustments.set(event.effectivePeriod, existing);
          }
          if (event.eventPayload.amountLocalDelta) {
            totalLocal += event.eventPayload.amountLocalDelta;
            
            const existing = periodAdjustments.get(event.effectivePeriod) || { reporting: 0, local: 0, reason: "" };
            existing.local += event.eventPayload.amountLocalDelta;
            periodAdjustments.set(event.effectivePeriod, existing);
          }
          // Re-derive FX after amount changes
          if (totalLocal > 0) {
            effectiveFx = totalReporting / totalLocal;
          }
          break;
          
        case "TIMELINE_EXTENSION":
        case "TIMELINE_REDUCTION":
          if (event.eventPayload.newEndDate) {
            endDate = event.eventPayload.newEndDate;
          }
          break;
          
        case "ONBOARDING_BOUNDARY":
          // Update system posting start period
          systemPostingStart = event.effectivePeriod;
          break;
      }
    }

    // Default end date for ongoing schedules
    if (!endDate) {
      endDate = addMonths(schedule.startDate, 11);
    }

    const periodCount = monthsBetween(schedule.startDate, endDate);
    
    // Calculate base amount per period (rounded to 2 decimals)
    const amountPerPeriodReporting = Math.round((totalReporting / periodCount) * 100) / 100;
    const amountPerPeriodLocal = Math.round((totalLocal / periodCount) * 100) / 100;

    const periods: PeriodLine[] = [];
    let cumulativeReporting = 0;
    let cumulativeLocal = 0;

    for (let i = 0; i < periodCount; i++) {
      const period = addMonths(schedule.startDate, i);
      const isLastPeriod = i === periodCount - 1;

      // Determine period state with priority:
      // 1. EXTERNAL - before system posting start (late onboarding)
      // 2. CLOSED - period has been closed in period status
      // 3. SYSTEM_ADJUSTED - has adjustments from events
      // 4. SYSTEM_BASE - standard system-generated
      
      let state: PeriodState = "SYSTEM_BASE";
      let explanation = "Standard allocation";

      // Check if EXTERNAL (before system posting start for late onboarding)
      const isExternal = systemPostingStart && comparePeriods(period, systemPostingStart) < 0;
      if (isExternal) {
        state = "EXTERNAL";
        explanation = "Outside system responsibility (late onboarding)";
      }

      // Check if period is CLOSED
      const isClosed = this.isPeriodClosedSync(schedule.entityId, period);
      if (isClosed && !isExternal) {
        state = "CLOSED";
        explanation = "Period closed - immutable";
      }

      // Check for adjustments (only if not EXTERNAL or CLOSED)
      const adjustment = periodAdjustments.get(period);
      let adjustmentDelta: number | null = null;
      
      if (adjustment && state === "SYSTEM_BASE") {
        state = "SYSTEM_ADJUSTED";
        adjustmentDelta = adjustment.reporting;
        explanation = `Adjusted: ${adjustment.reason}`;
      }

      // Calculate amounts (with true-up on last period to eliminate rounding drift)
      let periodAmountReporting = amountPerPeriodReporting;
      let periodAmountLocal = amountPerPeriodLocal;

      if (isLastPeriod) {
        // True-up: remaining amount goes to last period
        periodAmountReporting = Math.round((totalReporting - cumulativeReporting) * 100) / 100;
        periodAmountLocal = Math.round((totalLocal - cumulativeLocal) * 100) / 100;
        
        if (Math.abs(periodAmountReporting - amountPerPeriodReporting) > 0.01) {
          explanation += " (true-up applied)";
        }
      }

      cumulativeReporting = Math.round((cumulativeReporting + periodAmountReporting) * 100) / 100;
      cumulativeLocal = Math.round((cumulativeLocal + periodAmountLocal) * 100) / 100;

      periods.push({
        scheduleId,
        period,
        state,
        amountReporting: periodAmountReporting,
        amountLocal: periodAmountLocal,
        effectiveFx,
        cumulativeAmountReporting: cumulativeReporting,
        cumulativeAmountLocal: cumulativeLocal,
        remainingAmountReporting: Math.round((totalReporting - cumulativeReporting) * 100) / 100,
        remainingAmountLocal: Math.round((totalLocal - cumulativeLocal) * 100) / 100,
        adjustmentDelta,
        explanation,
      });
    }

    // Cache the rebuilt periods
    this.cachedPeriods.set(scheduleId, periods);
    return periods;
  }

  async rebuildSchedule(scheduleId: string): Promise<PeriodLine[]> {
    return this.rebuildScheduleSync(scheduleId);
  }

  async getEntities(): Promise<Entity[]> {
    return Array.from(this.entities.values());
  }

  async getPeriodStatuses(entityId: string): Promise<PeriodStatus[]> {
    return Array.from(this.periodStatuses.values()).filter(
      (ps) => ps.entityId === entityId
    );
  }

  async closePeriod(entityId: string, period: string): Promise<PeriodStatus> {
    const key = `${entityId}-${period}`;
    const status: PeriodStatus = {
      entityId,
      period,
      status: "CLOSED",
      closedAt: new Date().toISOString(),
    };
    this.periodStatuses.set(key, status);
    
    // Rebuild all schedules for this entity to reflect closed period
    const schedules = Array.from(this.schedules.values()).filter(
      s => s.entityId === entityId
    );
    for (const schedule of schedules) {
      this.rebuildScheduleSync(schedule.scheduleId);
    }
    
    return status;
  }

  async getScheduleSummary(): Promise<ScheduleSummary> {
    const schedules = Array.from(this.schedules.values());
    
    const schedulesByType = schedules.reduce(
      (acc, s) => {
        acc[s.scheduleType] = (acc[s.scheduleType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalAmountReporting = schedules.reduce(
      (sum, s) => sum + s.totalAmountReportingInitial,
      0
    );

    return {
      totalSchedules: schedules.length,
      totalAmountReporting,
      activeSchedules: schedules.length,
      schedulesByType: schedulesByType as Record<"PREPAID" | "FIXED_ASSET", number>,
    };
  }

  // Prepaid Dashboard Methods
  async getPrepaidSchedules(entityId?: string, subcategory?: PrepaidSubcategory): Promise<PrepaidSchedule[]> {
    let schedules = Array.from(this.prepaidSchedules.values());
    
    if (entityId) {
      schedules = schedules.filter(s => s.entityId === entityId);
    }
    if (subcategory) {
      schedules = schedules.filter(s => s.subcategory === subcategory);
    }
    
    return schedules.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getPrepaidSchedule(id: string): Promise<PrepaidSchedule | undefined> {
    return this.prepaidSchedules.get(id);
  }

  async createPrepaidSchedule(data: InsertPrepaidSchedule): Promise<PrepaidSchedule> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const months = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const monthlyExpense = Math.round((data.originalAmount / months) * 100) / 100;

    const schedule: PrepaidSchedule = {
      id,
      name: data.name,
      subcategory: data.subcategory,
      entityId: data.entityId,
      startDate: data.startDate,
      endDate: data.endDate,
      originalAmount: data.originalAmount,
      currency: data.currency,
      monthlyExpense,
      remainingBalance: data.originalAmount,
      status: "ACTIVE",
      evidence: "MISSING",
      owner: data.owner,
      createdAt: now,
    };

    this.prepaidSchedules.set(id, schedule);
    return schedule;
  }

  async getPrepaidDashboardKPIs(entityId?: string, period?: string): Promise<PrepaidDashboardKPIs> {
    let schedules = Array.from(this.prepaidSchedules.values());
    
    if (entityId) {
      schedules = schedules.filter(s => s.entityId === entityId);
    }

    const activeSchedules = schedules.filter(s => s.status === "ACTIVE");
    const totalPrepaidBalance = activeSchedules.reduce((sum, s) => sum + s.remainingBalance, 0);
    const expenseThisPeriod = activeSchedules.reduce((sum, s) => sum + s.monthlyExpense, 0);
    const remainingBalance = totalPrepaidBalance;
    
    const today = new Date();
    const days90 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    const upcomingExpirations = activeSchedules.filter(s => {
      const endDate = new Date(s.endDate);
      return endDate <= days90;
    }).length;

    return {
      totalPrepaidBalance,
      activeSchedules: activeSchedules.length,
      expenseThisPeriod,
      remainingBalance,
      upcomingExpirations,
    };
  }

  async getPrepaidCategoryBreakdown(entityId?: string): Promise<PrepaidCategoryBreakdown[]> {
    let schedules = Array.from(this.prepaidSchedules.values()).filter(s => s.status === "ACTIVE");
    
    if (entityId) {
      schedules = schedules.filter(s => s.entityId === entityId);
    }

    const breakdown: Record<PrepaidSubcategory, { amount: number; count: number }> = {
      INSURANCE: { amount: 0, count: 0 },
      RENT: { amount: 0, count: 0 },
      SOFTWARE: { amount: 0, count: 0 },
      OTHER: { amount: 0, count: 0 },
    };

    for (const schedule of schedules) {
      breakdown[schedule.subcategory].amount += schedule.remainingBalance;
      breakdown[schedule.subcategory].count += 1;
    }

    return Object.entries(breakdown)
      .filter(([_, data]) => data.count > 0)
      .map(([category, data]) => ({
        category: category as PrepaidSubcategory,
        amount: data.amount,
        count: data.count,
      }));
  }

  async getAmortizationTrend(entityId?: string, periods: number = 6): Promise<AmortizationTrendPoint[]> {
    let schedules = Array.from(this.prepaidSchedules.values()).filter(s => s.status === "ACTIVE");
    
    if (entityId) {
      schedules = schedules.filter(s => s.entityId === entityId);
    }

    const totalMonthlyExpense = schedules.reduce((sum, s) => sum + s.monthlyExpense, 0);
    const result: AmortizationTrendPoint[] = [];
    
    const today = new Date();
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const expense = i === 0 ? totalMonthlyExpense : totalMonthlyExpense * (0.9 + Math.random() * 0.2);
      result.push({ period, expense: Math.round(expense) });
    }

    return result;
  }

  // ========================
  // Fixed Assets Methods
  // ========================

  private seedFixedAssets() {
    const now = new Date().toISOString();
    const sampleAssets: FixedAsset[] = [
      {
        id: randomUUID(),
        name: "MacBook Pro Fleet - Engineering",
        assetClass: "IT",
        entityId: "CORP-001",
        inServiceDate: "2023-06-15",
        usefulLifeMonths: 36,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 125000,
        accumulatedDepreciation: 62500,
        netBookValue: 62500,
        currency: "USD",
        status: "IN_SERVICE",
        evidence: "ATTACHED",
        owner: "IT Operations",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Server Infrastructure - Data Center",
        assetClass: "IT",
        entityId: "CORP-001",
        inServiceDate: "2022-01-10",
        usefulLifeMonths: 60,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 450000,
        accumulatedDepreciation: 180000,
        netBookValue: 270000,
        currency: "USD",
        status: "IN_SERVICE",
        evidence: "ATTACHED",
        owner: "Infrastructure",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Office Furniture - HQ Floor 3",
        assetClass: "FURNITURE",
        entityId: "CORP-001",
        inServiceDate: "2021-03-01",
        usefulLifeMonths: 84,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 85000,
        accumulatedDepreciation: 42500,
        netBookValue: 42500,
        currency: "USD",
        status: "IN_SERVICE",
        evidence: "ATTACHED",
        owner: "Facilities",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Leasehold Improvements - Berlin Office",
        assetClass: "LEASEHOLD",
        entityId: "SUB-EU",
        inServiceDate: "2020-09-01",
        usefulLifeMonths: 120,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 320000,
        accumulatedDepreciation: 128000,
        netBookValue: 192000,
        currency: "EUR",
        status: "IN_SERVICE",
        evidence: "ATTACHED",
        owner: "EU Facilities",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Company Vehicles - Sales Fleet",
        assetClass: "VEHICLES",
        entityId: "SUB-US",
        inServiceDate: "2022-08-15",
        usefulLifeMonths: 60,
        depreciationMethod: "DOUBLE_DECLINING",
        cost: 180000,
        accumulatedDepreciation: 90000,
        netBookValue: 90000,
        currency: "USD",
        status: "IN_SERVICE",
        evidence: "ATTACHED",
        owner: "Sales Ops",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Manufacturing Equipment - Assembly Line",
        assetClass: "MACHINERY",
        entityId: "SUB-US",
        inServiceDate: "2019-04-01",
        usefulLifeMonths: 120,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 750000,
        accumulatedDepreciation: 437500,
        netBookValue: 312500,
        currency: "USD",
        status: "IN_SERVICE",
        evidence: "ATTACHED",
        owner: "Manufacturing",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "CNC Machine - Precision Shop",
        assetClass: "MACHINERY",
        entityId: "SUB-US",
        inServiceDate: "2018-01-15",
        usefulLifeMonths: 120,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 280000,
        accumulatedDepreciation: 196000,
        netBookValue: 84000,
        currency: "USD",
        status: "IN_SERVICE",
        evidence: "MISSING",
        owner: "Manufacturing",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Legacy Printers - Warehouse",
        assetClass: "IT",
        entityId: "CORP-001",
        inServiceDate: "2018-06-01",
        usefulLifeMonths: 60,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 45000,
        accumulatedDepreciation: 45000,
        netBookValue: 0,
        currency: "USD",
        status: "FULLY_DEPRECIATED",
        evidence: "ATTACHED",
        owner: "IT Operations",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Network Equipment - London",
        assetClass: "IT",
        entityId: "SUB-UK",
        inServiceDate: "2024-01-10",
        usefulLifeMonths: 48,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 95000,
        accumulatedDepreciation: 11875,
        netBookValue: 83125,
        currency: "GBP",
        status: "IN_SERVICE",
        evidence: "ATTACHED",
        owner: "UK IT",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Standing Desks - Tokyo Office",
        assetClass: "FURNITURE",
        entityId: "SUB-JP",
        inServiceDate: "2023-11-01",
        usefulLifeMonths: 84,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 42000,
        accumulatedDepreciation: 6000,
        netBookValue: 36000,
        currency: "JPY",
        status: "IN_SERVICE",
        evidence: "MISSING",
        owner: "JP Facilities",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Forklift - Warehouse",
        assetClass: "VEHICLES",
        entityId: "SUB-US",
        inServiceDate: "2024-03-01",
        usefulLifeMonths: 72,
        depreciationMethod: "STRAIGHT_LINE",
        cost: 55000,
        accumulatedDepreciation: 0,
        netBookValue: 55000,
        currency: "USD",
        status: "NOT_IN_SERVICE",
        evidence: "ATTACHED",
        owner: "Warehouse Ops",
        createdAt: now,
      },
    ];

    for (const asset of sampleAssets) {
      this.fixedAssets.set(asset.id, asset);
    }
  }

  async getFixedAssets(entityId?: string, assetClass?: AssetClass): Promise<FixedAsset[]> {
    let assets = Array.from(this.fixedAssets.values());
    
    if (entityId) {
      assets = assets.filter(a => a.entityId === entityId);
    }
    
    if (assetClass) {
      assets = assets.filter(a => a.assetClass === assetClass);
    }

    return assets.sort((a, b) => b.netBookValue - a.netBookValue);
  }

  async getFixedAsset(id: string): Promise<FixedAsset | undefined> {
    return this.fixedAssets.get(id);
  }

  async createFixedAsset(data: InsertFixedAsset): Promise<FixedAsset> {
    const now = new Date().toISOString();
    const asset: FixedAsset = {
      id: randomUUID(),
      name: data.name,
      assetClass: data.assetClass,
      entityId: data.entityId,
      inServiceDate: data.inServiceDate,
      usefulLifeMonths: data.usefulLifeMonths,
      depreciationMethod: data.depreciationMethod,
      cost: data.cost,
      accumulatedDepreciation: 0,
      netBookValue: data.cost,
      currency: data.currency,
      status: "NOT_IN_SERVICE",
      evidence: "MISSING",
      owner: data.owner,
      createdAt: now,
    };

    this.fixedAssets.set(asset.id, asset);
    return asset;
  }

  async getFixedAssetDashboardKPIs(entityId?: string, period?: string): Promise<FixedAssetDashboardKPIs> {
    let assets = Array.from(this.fixedAssets.values());
    
    if (entityId) {
      assets = assets.filter(a => a.entityId === entityId);
    }

    const grossAssetValue = assets.reduce((sum, a) => sum + a.cost, 0);
    const accumulatedDepreciation = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);
    const netBookValue = assets.reduce((sum, a) => sum + a.netBookValue, 0);
    
    const activeAssets = assets.filter(a => a.status === "IN_SERVICE");
    const monthlyDepreciation = activeAssets.reduce((sum, a) => {
      return sum + (a.cost / a.usefulLifeMonths);
    }, 0);

    const assetsInService = assets.filter(a => a.status === "IN_SERVICE").length;
    const assetsFullyDepreciated = assets.filter(a => a.status === "FULLY_DEPRECIATED").length;

    return {
      grossAssetValue,
      accumulatedDepreciation,
      netBookValue,
      depreciationThisPeriod: Math.round(monthlyDepreciation),
      assetsInService,
      assetsFullyDepreciated,
    };
  }

  async getAssetClassBreakdown(entityId?: string): Promise<AssetClassBreakdown[]> {
    let assets = Array.from(this.fixedAssets.values()).filter(a => a.status !== "DISPOSED");
    
    if (entityId) {
      assets = assets.filter(a => a.entityId === entityId);
    }

    const breakdown: Record<AssetClass, { amount: number; count: number }> = {
      IT: { amount: 0, count: 0 },
      FURNITURE: { amount: 0, count: 0 },
      LEASEHOLD: { amount: 0, count: 0 },
      VEHICLES: { amount: 0, count: 0 },
      MACHINERY: { amount: 0, count: 0 },
      OTHER: { amount: 0, count: 0 },
    };

    for (const asset of assets) {
      breakdown[asset.assetClass].amount += asset.netBookValue;
      breakdown[asset.assetClass].count += 1;
    }

    return Object.entries(breakdown)
      .filter(([_, data]) => data.count > 0)
      .map(([assetClass, data]) => ({
        assetClass: assetClass as AssetClass,
        amount: data.amount,
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  async getDepreciationTrend(entityId?: string, periods: number = 6): Promise<DepreciationTrendPoint[]> {
    let assets = Array.from(this.fixedAssets.values()).filter(a => a.status === "IN_SERVICE");
    
    if (entityId) {
      assets = assets.filter(a => a.entityId === entityId);
    }

    const monthlyDepreciation = assets.reduce((sum, a) => sum + (a.cost / a.usefulLifeMonths), 0);
    const result: DepreciationTrendPoint[] = [];
    
    const today = new Date();
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const depreciation = i === 0 ? monthlyDepreciation : monthlyDepreciation * (0.95 + Math.random() * 0.1);
      result.push({ period, depreciation: Math.round(depreciation) });
    }

    return result;
  }

  async getUsefulLifeDistribution(entityId?: string): Promise<UsefulLifeDistribution[]> {
    let assets = Array.from(this.fixedAssets.values()).filter(a => a.status === "IN_SERVICE");
    
    if (entityId) {
      assets = assets.filter(a => a.entityId === entityId);
    }

    const distribution: Record<string, number> = {
      "0-1 yrs": 0,
      "1-3 yrs": 0,
      "3-5 yrs": 0,
      "5+ yrs": 0,
    };

    const today = new Date();
    for (const asset of assets) {
      const inServiceDate = new Date(asset.inServiceDate);
      const monthsElapsed = (today.getFullYear() - inServiceDate.getFullYear()) * 12 + 
                           (today.getMonth() - inServiceDate.getMonth());
      const remainingMonths = Math.max(0, asset.usefulLifeMonths - monthsElapsed);
      const remainingYears = remainingMonths / 12;

      if (remainingYears <= 1) {
        distribution["0-1 yrs"]++;
      } else if (remainingYears <= 3) {
        distribution["1-3 yrs"]++;
      } else if (remainingYears <= 5) {
        distribution["3-5 yrs"]++;
      } else {
        distribution["5+ yrs"]++;
      }
    }

    return Object.entries(distribution).map(([range, count]) => ({ range, count }));
  }

  async getControlFlags(entityId?: string): Promise<ControlFlag[]> {
    let assets = Array.from(this.fixedAssets.values());
    
    if (entityId) {
      assets = assets.filter(a => a.entityId === entityId);
    }

    const flags: ControlFlag[] = [];

    const missingEvidence = assets.filter(a => a.evidence === "MISSING" && a.status !== "DISPOSED").length;
    if (missingEvidence > 0) {
      flags.push({
        type: "MISSING_EVIDENCE",
        count: missingEvidence,
        severity: "HIGH",
        description: "Assets missing capitalization evidence",
      });
    }

    const notInService = assets.filter(a => a.status === "NOT_IN_SERVICE").length;
    if (notInService > 0) {
      flags.push({
        type: "NOT_IN_SERVICE",
        count: notInService,
        severity: "MEDIUM",
        description: "Assets not yet placed in service",
      });
    }

    const fullyDepreciatedActive = assets.filter(a => a.status === "FULLY_DEPRECIATED").length;
    if (fullyDepreciatedActive > 0) {
      flags.push({
        type: "FULLY_DEPRECIATED_ACTIVE",
        count: fullyDepreciatedActive,
        severity: "LOW",
        description: "Fully depreciated but still active",
      });
    }

    return flags.sort((a, b) => {
      const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // ========================
  // Accruals Methods
  // ========================

  private seedAccrualSchedules() {
    const now = new Date().toISOString();
    const sampleAccruals: AccrualSchedule[] = [
      {
        id: randomUUID(),
        name: "Monthly Payroll Accrual - US",
        category: "PAYROLL",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        accrualAmount: 285000,
        priorPeriodAmount: 278000,
        trueUpAmount: 7000,
        currency: "USD",
        confidenceLevel: "HIGH",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Controller",
        owner: "HR Finance",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Monthly Payroll Accrual - EU",
        category: "PAYROLL",
        entityId: "SUB-EU",
        lifecycleState: "ACTIVE",
        accrualAmount: 125000,
        priorPeriodAmount: 122000,
        trueUpAmount: 3000,
        currency: "EUR",
        confidenceLevel: "HIGH",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "EU Controller",
        owner: "EU HR",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Q4 Bonus Pool",
        category: "BONUSES_COMMISSIONS",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        accrualAmount: 450000,
        priorPeriodAmount: 380000,
        trueUpAmount: 70000,
        currency: "USD",
        confidenceLevel: "MEDIUM",
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Compensation Team",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Sales Commissions - US",
        category: "BONUSES_COMMISSIONS",
        entityId: "SUB-US",
        lifecycleState: "ACTIVE",
        accrualAmount: 185000,
        priorPeriodAmount: 165000,
        trueUpAmount: 20000,
        currency: "USD",
        confidenceLevel: "MEDIUM",
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Sales Ops",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "External Audit Fees",
        category: "PROFESSIONAL_FEES",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        accrualAmount: 95000,
        priorPeriodAmount: 95000,
        trueUpAmount: 0,
        currency: "USD",
        confidenceLevel: "HIGH",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Controller",
        owner: "Finance",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Legal Services - M&A",
        category: "PROFESSIONAL_FEES",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        accrualAmount: 175000,
        priorPeriodAmount: 120000,
        trueUpAmount: 55000,
        currency: "USD",
        confidenceLevel: "LOW",
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Legal",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "AWS Infrastructure",
        category: "HOSTING_SAAS",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        accrualAmount: 82000,
        priorPeriodAmount: 78000,
        trueUpAmount: 4000,
        currency: "USD",
        confidenceLevel: "HIGH",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "IT Finance",
        owner: "Cloud Ops",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Salesforce Enterprise",
        category: "HOSTING_SAAS",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        accrualAmount: 45000,
        priorPeriodAmount: 45000,
        trueUpAmount: 0,
        currency: "USD",
        confidenceLevel: "HIGH",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "IT Finance",
        owner: "Sales Ops",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Office Utilities - HQ",
        category: "UTILITIES",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        accrualAmount: 18000,
        priorPeriodAmount: 16500,
        trueUpAmount: 1500,
        currency: "USD",
        confidenceLevel: "MEDIUM",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Facilities",
        owner: "Facilities",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Office Utilities - Berlin",
        category: "UTILITIES",
        entityId: "SUB-EU",
        lifecycleState: "DORMANT",
        accrualAmount: 8500,
        priorPeriodAmount: 9200,
        trueUpAmount: -700,
        currency: "EUR",
        confidenceLevel: "MEDIUM",
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "EU Facilities",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Miscellaneous Accruals",
        category: "OTHER",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        accrualAmount: 12000,
        priorPeriodAmount: 15000,
        trueUpAmount: -3000,
        currency: "USD",
        confidenceLevel: "LOW",
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Accounting",
        createdAt: now,
      },
      {
        id: randomUUID(),
        name: "Japan Payroll",
        category: "PAYROLL",
        entityId: "SUB-JP",
        lifecycleState: "ACTIVE",
        accrualAmount: 45000,
        priorPeriodAmount: 42000,
        trueUpAmount: 3000,
        currency: "JPY",
        confidenceLevel: "HIGH",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "JP Controller",
        owner: "JP HR",
        createdAt: now,
      },
    ];

    for (const accrual of sampleAccruals) {
      this.accrualSchedules.set(accrual.id, accrual);
    }
  }

  async getAccrualSchedules(entityId?: string, category?: AccrualCategory): Promise<AccrualSchedule[]> {
    let accruals = Array.from(this.accrualSchedules.values())
      .filter(a => a.lifecycleState === "ACTIVE" || a.lifecycleState === "DORMANT");
    
    if (entityId) {
      accruals = accruals.filter(a => a.entityId === entityId);
    }
    
    if (category) {
      accruals = accruals.filter(a => a.category === category);
    }

    return accruals.sort((a, b) => b.accrualAmount - a.accrualAmount);
  }

  async getAccrualSchedule(id: string): Promise<AccrualSchedule | undefined> {
    return this.accrualSchedules.get(id);
  }

  async createAccrualSchedule(data: InsertAccrualSchedule): Promise<AccrualSchedule> {
    const now = new Date().toISOString();
    const accrual: AccrualSchedule = {
      id: randomUUID(),
      name: data.name,
      category: data.category,
      entityId: data.entityId,
      lifecycleState: "ACTIVE",
      accrualAmount: data.accrualAmount,
      priorPeriodAmount: 0,
      trueUpAmount: data.accrualAmount,
      currency: data.currency,
      confidenceLevel: data.confidenceLevel,
      evidence: "MISSING",
      reviewStatus: "NOT_REVIEWED",
      lastReviewedAt: null,
      lastReviewedBy: null,
      owner: data.owner,
      createdAt: now,
    };

    this.accrualSchedules.set(accrual.id, accrual);
    return accrual;
  }

  async getAccrualDashboardKPIs(entityId?: string, period?: string): Promise<AccrualDashboardKPIs> {
    let accruals = Array.from(this.accrualSchedules.values())
      .filter(a => a.lifecycleState === "ACTIVE" || a.lifecycleState === "DORMANT");
    
    if (entityId) {
      accruals = accruals.filter(a => a.entityId === entityId);
    }

    const activeAccruals = accruals.filter(a => a.lifecycleState === "ACTIVE");
    const dormantAccruals = accruals.filter(a => a.lifecycleState === "DORMANT");

    const endingAccrualBalance = activeAccruals.reduce((sum, a) => sum + a.accrualAmount, 0) +
                                  dormantAccruals.reduce((sum, a) => sum + a.accrualAmount, 0);
    
    const categories = new Set(activeAccruals.map(a => a.category));
    const activeCategories = categories.size;

    const netTrueUpPeriod = accruals.reduce((sum, a) => sum + a.trueUpAmount, 0);

    const highRiskCategories = this.calculateHighRiskCategories(accruals);

    return {
      endingAccrualBalance,
      activeCategories,
      netTrueUpPeriod,
      highRiskCategories,
      dormantAccruals: dormantAccruals.length,
    };
  }

  private calculateHighRiskCategories(accruals: AccrualSchedule[]): number {
    const categoryRisks: Record<AccrualCategory, { lowConfidence: number; missingEvidence: number; largeTrueUp: number }> = {
      PAYROLL: { lowConfidence: 0, missingEvidence: 0, largeTrueUp: 0 },
      BONUSES_COMMISSIONS: { lowConfidence: 0, missingEvidence: 0, largeTrueUp: 0 },
      PROFESSIONAL_FEES: { lowConfidence: 0, missingEvidence: 0, largeTrueUp: 0 },
      HOSTING_SAAS: { lowConfidence: 0, missingEvidence: 0, largeTrueUp: 0 },
      UTILITIES: { lowConfidence: 0, missingEvidence: 0, largeTrueUp: 0 },
      OTHER: { lowConfidence: 0, missingEvidence: 0, largeTrueUp: 0 },
    };

    for (const accrual of accruals) {
      if (accrual.confidenceLevel === "LOW") {
        categoryRisks[accrual.category].lowConfidence++;
      }
      if (accrual.evidence === "MISSING") {
        categoryRisks[accrual.category].missingEvidence++;
      }
      if (Math.abs(accrual.trueUpAmount) > accrual.accrualAmount * 0.2) {
        categoryRisks[accrual.category].largeTrueUp++;
      }
    }

    let highRiskCount = 0;
    for (const category of Object.keys(categoryRisks) as AccrualCategory[]) {
      const risks = categoryRisks[category];
      if (risks.lowConfidence > 0 || risks.missingEvidence > 0 || risks.largeTrueUp > 0) {
        highRiskCount++;
      }
    }

    return highRiskCount;
  }

  async getAccrualCategorySummaries(entityId?: string): Promise<AccrualCategorySummary[]> {
    let accruals = Array.from(this.accrualSchedules.values())
      .filter(a => a.lifecycleState === "ACTIVE" || a.lifecycleState === "DORMANT");
    
    if (entityId) {
      accruals = accruals.filter(a => a.entityId === entityId);
    }

    const summaries: Record<AccrualCategory, AccrualCategorySummary> = {
      PAYROLL: { category: "PAYROLL", activeCount: 0, dormantCount: 0, endingBalance: 0, netTrueUp: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      BONUSES_COMMISSIONS: { category: "BONUSES_COMMISSIONS", activeCount: 0, dormantCount: 0, endingBalance: 0, netTrueUp: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      PROFESSIONAL_FEES: { category: "PROFESSIONAL_FEES", activeCount: 0, dormantCount: 0, endingBalance: 0, netTrueUp: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      HOSTING_SAAS: { category: "HOSTING_SAAS", activeCount: 0, dormantCount: 0, endingBalance: 0, netTrueUp: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      UTILITIES: { category: "UTILITIES", activeCount: 0, dormantCount: 0, endingBalance: 0, netTrueUp: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      OTHER: { category: "OTHER", activeCount: 0, dormantCount: 0, endingBalance: 0, netTrueUp: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
    };

    for (const accrual of accruals) {
      const cat = accrual.category;
      if (accrual.lifecycleState === "ACTIVE") {
        summaries[cat].activeCount++;
      } else {
        summaries[cat].dormantCount++;
      }
      summaries[cat].endingBalance += accrual.accrualAmount;
      summaries[cat].netTrueUp += accrual.trueUpAmount;
      
      if (accrual.confidenceLevel === "LOW" || accrual.evidence === "MISSING") {
        summaries[cat].riskLevel = "HIGH";
      } else if (accrual.confidenceLevel === "MEDIUM" && summaries[cat].riskLevel !== "HIGH") {
        summaries[cat].riskLevel = "MEDIUM";
      }
      
      if (accrual.reviewStatus === "NOT_REVIEWED") {
        summaries[cat].reviewStatus = "NOT_REVIEWED";
      }
    }

    return Object.values(summaries)
      .filter(s => s.activeCount > 0 || s.dormantCount > 0)
      .sort((a, b) => b.endingBalance - a.endingBalance);
  }

  async getAccrualTrend(entityId?: string, periods: number = 6): Promise<AccrualTrendPoint[]> {
    let accruals = Array.from(this.accrualSchedules.values())
      .filter(a => a.lifecycleState === "ACTIVE" || a.lifecycleState === "DORMANT");
    
    if (entityId) {
      accruals = accruals.filter(a => a.entityId === entityId);
    }

    const currentBalance = accruals.reduce((sum, a) => sum + a.accrualAmount, 0);
    const currentTrueUp = accruals.reduce((sum, a) => sum + a.trueUpAmount, 0);
    const result: AccrualTrendPoint[] = [];
    
    const today = new Date();
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const balance = i === 0 ? currentBalance : currentBalance * (0.92 + Math.random() * 0.16);
      const trueUp = i === 0 ? currentTrueUp : currentTrueUp * (0.7 + Math.random() * 0.6);
      result.push({ 
        period, 
        balance: Math.round(balance), 
        trueUp: Math.round(trueUp) 
      });
    }

    return result;
  }

  async getAccrualRiskPanels(entityId?: string): Promise<AccrualRiskPanel[]> {
    let accruals = Array.from(this.accrualSchedules.values())
      .filter(a => a.lifecycleState === "ACTIVE" || a.lifecycleState === "DORMANT");
    
    if (entityId) {
      accruals = accruals.filter(a => a.entityId === entityId);
    }

    const panels: AccrualRiskPanel[] = [];

    const missingEvidence: Record<AccrualCategory, number> = { PAYROLL: 0, BONUSES_COMMISSIONS: 0, PROFESSIONAL_FEES: 0, HOSTING_SAAS: 0, UTILITIES: 0, OTHER: 0 };
    const largeTrueUp: Record<AccrualCategory, number> = { PAYROLL: 0, BONUSES_COMMISSIONS: 0, PROFESSIONAL_FEES: 0, HOSTING_SAAS: 0, UTILITIES: 0, OTHER: 0 };
    const lowConfidence: Record<AccrualCategory, number> = { PAYROLL: 0, BONUSES_COMMISSIONS: 0, PROFESSIONAL_FEES: 0, HOSTING_SAAS: 0, UTILITIES: 0, OTHER: 0 };
    const notReviewed: Record<AccrualCategory, number> = { PAYROLL: 0, BONUSES_COMMISSIONS: 0, PROFESSIONAL_FEES: 0, HOSTING_SAAS: 0, UTILITIES: 0, OTHER: 0 };

    for (const accrual of accruals) {
      if (accrual.evidence === "MISSING") {
        missingEvidence[accrual.category]++;
      }
      if (Math.abs(accrual.trueUpAmount) > accrual.accrualAmount * 0.2) {
        largeTrueUp[accrual.category]++;
      }
      if (accrual.confidenceLevel === "LOW") {
        lowConfidence[accrual.category]++;
      }
      if (accrual.reviewStatus === "NOT_REVIEWED") {
        notReviewed[accrual.category]++;
      }
    }

    const buildCategories = (data: Record<AccrualCategory, number>) => {
      return Object.entries(data)
        .filter(([_, count]) => count > 0)
        .map(([category, count]) => ({ category: category as AccrualCategory, count }));
    };

    const missingEvidenceCategories = buildCategories(missingEvidence);
    if (missingEvidenceCategories.length > 0) {
      panels.push({
        type: "MISSING_EVIDENCE",
        title: "Categories with missing evidence",
        categories: missingEvidenceCategories,
        severity: "HIGH",
      });
    }

    const largeTrueUpCategories = buildCategories(largeTrueUp);
    if (largeTrueUpCategories.length > 0) {
      panels.push({
        type: "LARGE_TRUE_UP",
        title: "Categories with large true-ups",
        categories: largeTrueUpCategories,
        severity: "MEDIUM",
      });
    }

    const lowConfidenceCategories = buildCategories(lowConfidence);
    if (lowConfidenceCategories.length > 0) {
      panels.push({
        type: "LOW_CONFIDENCE",
        title: "Categories dominated by low-confidence accruals",
        categories: lowConfidenceCategories,
        severity: "HIGH",
      });
    }

    const notReviewedCategories = buildCategories(notReviewed);
    if (notReviewedCategories.length > 0) {
      panels.push({
        type: "NOT_REVIEWED",
        title: "Categories not reviewed for current period",
        categories: notReviewedCategories,
        severity: "MEDIUM",
      });
    }

    return panels.sort((a, b) => {
      const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  async getAccrualMixBreakdown(entityId?: string): Promise<AccrualMixBreakdown[]> {
    let accruals = Array.from(this.accrualSchedules.values())
      .filter(a => a.lifecycleState === "ACTIVE");
    
    if (entityId) {
      accruals = accruals.filter(a => a.entityId === entityId);
    }

    const totals: Record<AccrualCategory, number> = {
      PAYROLL: 0,
      BONUSES_COMMISSIONS: 0,
      PROFESSIONAL_FEES: 0,
      HOSTING_SAAS: 0,
      UTILITIES: 0,
      OTHER: 0,
    };

    for (const accrual of accruals) {
      totals[accrual.category] += accrual.accrualAmount;
    }

    const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);

    return Object.entries(totals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category: category as AccrualCategory,
        amount,
        percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // ========================
  // Revenue & Contracts Methods
  // ========================

  private seedRevenueSchedules() {
    const now = new Date().toISOString();
    const sampleRevenues: RevenueSchedule[] = [
      {
        id: randomUUID(),
        contractName: "Enterprise SaaS - Acme Corp",
        customerName: "Acme Corporation",
        category: "SUBSCRIPTIONS",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        recognitionMethod: "STRAIGHT_LINE",
        contractStartDate: "2024-01-01",
        contractEndDate: "2026-12-31",
        totalContractValue: 1200000,
        revenueRecognizedToDate: 400000,
        revenueRecognizedPeriod: 33333,
        deferredRevenue: 800000,
        contractAssets: 0,
        currency: "USD",
        judgmentLevel: "LOW",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Revenue Controller",
        owner: "Deal Desk",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Platform License - TechStart",
        customerName: "TechStart Inc",
        category: "SUBSCRIPTIONS",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        recognitionMethod: "STRAIGHT_LINE",
        contractStartDate: "2024-06-01",
        contractEndDate: "2025-05-31",
        totalContractValue: 240000,
        revenueRecognizedToDate: 160000,
        revenueRecognizedPeriod: 20000,
        deferredRevenue: 80000,
        contractAssets: 15000,
        currency: "USD",
        judgmentLevel: "LOW",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Revenue Controller",
        owner: "Sales",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Support Agreement - GlobalBank",
        customerName: "GlobalBank Financial",
        category: "SUPPORT_MAINTENANCE",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        recognitionMethod: "STRAIGHT_LINE",
        contractStartDate: "2024-03-01",
        contractEndDate: "2025-02-28",
        totalContractValue: 180000,
        revenueRecognizedToDate: 135000,
        revenueRecognizedPeriod: 15000,
        deferredRevenue: 45000,
        contractAssets: 0,
        currency: "USD",
        judgmentLevel: "LOW",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Revenue Controller",
        owner: "Customer Success",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Premium Support - Fintech Pro",
        customerName: "Fintech Pro LLC",
        category: "SUPPORT_MAINTENANCE",
        entityId: "SUB-US",
        lifecycleState: "ACTIVE",
        recognitionMethod: "STRAIGHT_LINE",
        contractStartDate: "2024-09-01",
        contractEndDate: "2025-08-31",
        totalContractValue: 96000,
        revenueRecognizedToDate: 40000,
        revenueRecognizedPeriod: 8000,
        deferredRevenue: 56000,
        contractAssets: 0,
        currency: "USD",
        judgmentLevel: "MEDIUM",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Customer Success",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "API Usage - DataFlow",
        customerName: "DataFlow Analytics",
        category: "USAGE_BASED",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        recognitionMethod: "USAGE",
        contractStartDate: "2024-01-01",
        contractEndDate: "2025-12-31",
        totalContractValue: 0,
        revenueRecognizedToDate: 125000,
        revenueRecognizedPeriod: 18500,
        deferredRevenue: 0,
        contractAssets: 22000,
        currency: "USD",
        judgmentLevel: "HIGH",
        hasPerformanceObligationDetail: false,
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Product",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Compute Credits - CloudScale",
        customerName: "CloudScale Ops",
        category: "USAGE_BASED",
        entityId: "SUB-US",
        lifecycleState: "ACTIVE",
        recognitionMethod: "USAGE",
        contractStartDate: "2024-04-01",
        contractEndDate: "2025-03-31",
        totalContractValue: 50000,
        revenueRecognizedToDate: 38000,
        revenueRecognizedPeriod: 5200,
        deferredRevenue: 12000,
        contractAssets: 0,
        currency: "USD",
        judgmentLevel: "MEDIUM",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Revenue Analyst",
        owner: "Cloud Ops",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Implementation Project - MegaCorp",
        customerName: "MegaCorp Industries",
        category: "MILESTONE_BASED",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        recognitionMethod: "MILESTONE",
        contractStartDate: "2024-07-01",
        contractEndDate: "2025-06-30",
        totalContractValue: 500000,
        revenueRecognizedToDate: 200000,
        revenueRecognizedPeriod: 100000,
        deferredRevenue: 300000,
        contractAssets: 50000,
        currency: "USD",
        judgmentLevel: "HIGH",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Revenue Controller",
        owner: "Professional Services",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Custom Integration - RetailMax",
        customerName: "RetailMax Holdings",
        category: "MILESTONE_BASED",
        entityId: "SUB-EU",
        lifecycleState: "ACTIVE",
        recognitionMethod: "MILESTONE",
        contractStartDate: "2024-10-01",
        contractEndDate: "2025-09-30",
        totalContractValue: 280000,
        revenueRecognizedToDate: 70000,
        revenueRecognizedPeriod: 35000,
        deferredRevenue: 210000,
        contractAssets: 25000,
        currency: "EUR",
        judgmentLevel: "HIGH",
        hasPerformanceObligationDetail: false,
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "EU Professional Services",
        reportingFramework: "IFRS_15",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Software License - ManufactureCo",
        customerName: "ManufactureCo Global",
        category: "LICENSING",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        recognitionMethod: "POINT_IN_TIME",
        contractStartDate: "2024-11-01",
        contractEndDate: "2027-10-31",
        totalContractValue: 750000,
        revenueRecognizedToDate: 750000,
        revenueRecognizedPeriod: 0,
        deferredRevenue: 0,
        contractAssets: 0,
        currency: "USD",
        judgmentLevel: "LOW",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Revenue Controller",
        owner: "Enterprise Sales",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "IP License - PharmaTech",
        customerName: "PharmaTech Research",
        category: "LICENSING",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        recognitionMethod: "OVER_TIME",
        contractStartDate: "2024-02-01",
        contractEndDate: "2029-01-31",
        totalContractValue: 2500000,
        revenueRecognizedToDate: 500000,
        revenueRecognizedPeriod: 41667,
        deferredRevenue: 2000000,
        contractAssets: 0,
        currency: "USD",
        judgmentLevel: "MEDIUM",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Revenue Controller",
        owner: "Licensing",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Consulting Services - StartupXYZ",
        customerName: "StartupXYZ",
        category: "OTHER",
        entityId: "SUB-US",
        lifecycleState: "DORMANT",
        recognitionMethod: "OVER_TIME",
        contractStartDate: "2024-05-01",
        contractEndDate: "2024-10-31",
        totalContractValue: 85000,
        revenueRecognizedToDate: 60000,
        revenueRecognizedPeriod: 0,
        deferredRevenue: 25000,
        contractAssets: 0,
        currency: "USD",
        judgmentLevel: "LOW",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Revenue Analyst",
        owner: "Consulting",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
      {
        id: randomUUID(),
        contractName: "Training Services - EduCorp",
        customerName: "EduCorp Learning",
        category: "OTHER",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        recognitionMethod: "OVER_TIME",
        contractStartDate: "2024-08-01",
        contractEndDate: "2025-01-31",
        totalContractValue: 45000,
        revenueRecognizedToDate: 30000,
        revenueRecognizedPeriod: 7500,
        deferredRevenue: 15000,
        contractAssets: 0,
        currency: "USD",
        judgmentLevel: "LOW",
        hasPerformanceObligationDetail: true,
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Training",
        reportingFramework: "ASC_606",
        createdAt: now,
      },
    ];

    for (const revenue of sampleRevenues) {
      this.revenueSchedules.set(revenue.id, revenue);
    }
  }

  async getRevenueSchedules(entityId?: string, category?: RevenueCategory): Promise<RevenueSchedule[]> {
    let revenues = Array.from(this.revenueSchedules.values())
      .filter(r => r.lifecycleState === "ACTIVE" || r.lifecycleState === "DORMANT");
    
    if (entityId) {
      revenues = revenues.filter(r => r.entityId === entityId);
    }
    
    if (category) {
      revenues = revenues.filter(r => r.category === category);
    }

    return revenues.sort((a, b) => b.revenueRecognizedPeriod - a.revenueRecognizedPeriod);
  }

  async getRevenueSchedule(id: string): Promise<RevenueSchedule | undefined> {
    return this.revenueSchedules.get(id);
  }

  async createRevenueSchedule(data: InsertRevenueSchedule): Promise<RevenueSchedule> {
    const now = new Date().toISOString();
    const revenue: RevenueSchedule = {
      id: randomUUID(),
      contractName: data.contractName,
      customerName: data.customerName,
      category: data.category,
      entityId: data.entityId,
      lifecycleState: "ACTIVE",
      recognitionMethod: data.recognitionMethod,
      contractStartDate: data.contractStartDate,
      contractEndDate: data.contractEndDate,
      totalContractValue: data.totalContractValue,
      revenueRecognizedToDate: 0,
      revenueRecognizedPeriod: 0,
      deferredRevenue: data.totalContractValue,
      contractAssets: 0,
      currency: data.currency,
      judgmentLevel: data.judgmentLevel,
      hasPerformanceObligationDetail: false,
      evidence: "MISSING",
      reviewStatus: "NOT_REVIEWED",
      lastReviewedAt: null,
      lastReviewedBy: null,
      owner: data.owner,
      reportingFramework: data.reportingFramework,
      createdAt: now,
    };

    this.revenueSchedules.set(revenue.id, revenue);
    return revenue;
  }

  async getRevenueDashboardKPIs(entityId?: string, period?: string): Promise<RevenueDashboardKPIs> {
    let revenues = Array.from(this.revenueSchedules.values())
      .filter(r => r.lifecycleState === "ACTIVE" || r.lifecycleState === "DORMANT");
    
    if (entityId) {
      revenues = revenues.filter(r => r.entityId === entityId);
    }

    const activeRevenues = revenues.filter(r => r.lifecycleState === "ACTIVE");
    const dormantRevenues = revenues.filter(r => r.lifecycleState === "DORMANT");

    const revenueRecognizedPeriod = activeRevenues.reduce((sum, r) => sum + r.revenueRecognizedPeriod, 0);
    const deferredRevenueEnding = revenues.reduce((sum, r) => sum + r.deferredRevenue, 0);
    const contractAssets = revenues.reduce((sum, r) => sum + r.contractAssets, 0);
    const highJudgmentContracts = revenues.filter(r => r.judgmentLevel === "HIGH").length;

    return {
      revenueRecognizedPeriod,
      deferredRevenueEnding,
      contractAssets,
      activeContracts: activeRevenues.length,
      dormantContracts: dormantRevenues.length,
      highJudgmentContracts,
    };
  }

  async getRevenueCategorySummaries(entityId?: string): Promise<RevenueCategorySummary[]> {
    let revenues = Array.from(this.revenueSchedules.values())
      .filter(r => r.lifecycleState === "ACTIVE" || r.lifecycleState === "DORMANT");
    
    if (entityId) {
      revenues = revenues.filter(r => r.entityId === entityId);
    }

    const summaries: Record<RevenueCategory, RevenueCategorySummary> = {
      SUBSCRIPTIONS: { category: "SUBSCRIPTIONS", activeCount: 0, revenueRecognized: 0, deferredRevenue: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      SUPPORT_MAINTENANCE: { category: "SUPPORT_MAINTENANCE", activeCount: 0, revenueRecognized: 0, deferredRevenue: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      USAGE_BASED: { category: "USAGE_BASED", activeCount: 0, revenueRecognized: 0, deferredRevenue: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      MILESTONE_BASED: { category: "MILESTONE_BASED", activeCount: 0, revenueRecognized: 0, deferredRevenue: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      LICENSING: { category: "LICENSING", activeCount: 0, revenueRecognized: 0, deferredRevenue: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      OTHER: { category: "OTHER", activeCount: 0, revenueRecognized: 0, deferredRevenue: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
    };

    for (const revenue of revenues) {
      const cat = revenue.category;
      if (revenue.lifecycleState === "ACTIVE") {
        summaries[cat].activeCount++;
      }
      summaries[cat].revenueRecognized += revenue.revenueRecognizedPeriod;
      summaries[cat].deferredRevenue += revenue.deferredRevenue;
      
      if (revenue.judgmentLevel === "HIGH" || !revenue.hasPerformanceObligationDetail || revenue.evidence === "MISSING") {
        summaries[cat].riskLevel = "HIGH";
      } else if (revenue.judgmentLevel === "MEDIUM" && summaries[cat].riskLevel !== "HIGH") {
        summaries[cat].riskLevel = "MEDIUM";
      }
      
      if (revenue.reviewStatus === "NOT_REVIEWED") {
        summaries[cat].reviewStatus = "NOT_REVIEWED";
      }
    }

    return Object.values(summaries)
      .filter(s => s.activeCount > 0 || s.revenueRecognized > 0)
      .sort((a, b) => b.revenueRecognized - a.revenueRecognized);
  }

  async getRevenueTrend(entityId?: string, periods: number = 6): Promise<RevenueTrendPoint[]> {
    let revenues = Array.from(this.revenueSchedules.values())
      .filter(r => r.lifecycleState === "ACTIVE");
    
    if (entityId) {
      revenues = revenues.filter(r => r.entityId === entityId);
    }

    const currentRecognized = revenues.reduce((sum, r) => sum + r.revenueRecognizedPeriod, 0);
    const currentDeferred = revenues.reduce((sum, r) => sum + r.deferredRevenue, 0);
    const result: RevenueTrendPoint[] = [];
    
    const today = new Date();
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const recognized = i === 0 ? currentRecognized : currentRecognized * (0.88 + Math.random() * 0.24);
      const deferred = i === 0 ? currentDeferred : currentDeferred * (1.02 + Math.random() * 0.1);
      result.push({ 
        period, 
        recognized: Math.round(recognized), 
        deferred: Math.round(deferred) 
      });
    }

    return result;
  }

  async getDeferredRevenueRollforward(entityId?: string, periods: number = 6): Promise<DeferredRevenueRollforward[]> {
    let revenues = Array.from(this.revenueSchedules.values())
      .filter(r => r.lifecycleState === "ACTIVE" || r.lifecycleState === "DORMANT");
    
    if (entityId) {
      revenues = revenues.filter(r => r.entityId === entityId);
    }

    const currentDeferred = revenues.reduce((sum, r) => sum + r.deferredRevenue, 0);
    const currentRecognition = revenues.reduce((sum, r) => sum + r.revenueRecognizedPeriod, 0);
    const result: DeferredRevenueRollforward[] = [];
    
    const today = new Date();
    let runningBalance = currentDeferred * 1.3; // Start from higher balance
    
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      
      const openingBalance = runningBalance;
      const additions = i === 0 ? currentRecognition * 1.2 : currentRecognition * (1.1 + Math.random() * 0.3);
      const recognition = i === 0 ? currentRecognition : currentRecognition * (0.9 + Math.random() * 0.2);
      const endingBalance = openingBalance + additions - recognition;
      
      result.push({ 
        period, 
        openingBalance: Math.round(openingBalance),
        additions: Math.round(additions),
        recognition: Math.round(recognition),
        endingBalance: Math.round(endingBalance)
      });
      
      runningBalance = endingBalance;
    }

    return result;
  }

  async getRevenueMixBreakdown(entityId?: string): Promise<RevenueMixBreakdown[]> {
    let revenues = Array.from(this.revenueSchedules.values())
      .filter(r => r.lifecycleState === "ACTIVE");
    
    if (entityId) {
      revenues = revenues.filter(r => r.entityId === entityId);
    }

    const totals: Record<RevenueCategory, number> = {
      SUBSCRIPTIONS: 0,
      SUPPORT_MAINTENANCE: 0,
      USAGE_BASED: 0,
      MILESTONE_BASED: 0,
      LICENSING: 0,
      OTHER: 0,
    };

    for (const revenue of revenues) {
      totals[revenue.category] += revenue.revenueRecognizedPeriod;
    }

    const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);

    return Object.entries(totals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category: category as RevenueCategory,
        amount,
        percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  async getRevenueRiskPanels(entityId?: string): Promise<RevenueRiskPanel[]> {
    let revenues = Array.from(this.revenueSchedules.values())
      .filter(r => r.lifecycleState === "ACTIVE" || r.lifecycleState === "DORMANT");
    
    if (entityId) {
      revenues = revenues.filter(r => r.entityId === entityId);
    }

    const panels: RevenueRiskPanel[] = [];

    const missingPODetail: Record<RevenueCategory, number> = { SUBSCRIPTIONS: 0, SUPPORT_MAINTENANCE: 0, USAGE_BASED: 0, MILESTONE_BASED: 0, LICENSING: 0, OTHER: 0 };
    const manualRecognition: Record<RevenueCategory, number> = { SUBSCRIPTIONS: 0, SUPPORT_MAINTENANCE: 0, USAGE_BASED: 0, MILESTONE_BASED: 0, LICENSING: 0, OTHER: 0 };
    const notReviewed: Record<RevenueCategory, number> = { SUBSCRIPTIONS: 0, SUPPORT_MAINTENANCE: 0, USAGE_BASED: 0, MILESTONE_BASED: 0, LICENSING: 0, OTHER: 0 };
    const largeTrueUp: Record<RevenueCategory, number> = { SUBSCRIPTIONS: 0, SUPPORT_MAINTENANCE: 0, USAGE_BASED: 0, MILESTONE_BASED: 0, LICENSING: 0, OTHER: 0 };

    for (const revenue of revenues) {
      if (!revenue.hasPerformanceObligationDetail) {
        missingPODetail[revenue.category]++;
      }
      if (revenue.judgmentLevel === "HIGH") {
        manualRecognition[revenue.category]++;
      }
      if (revenue.reviewStatus === "NOT_REVIEWED") {
        notReviewed[revenue.category]++;
      }
      // Consider large true-up if contract assets are significant
      if (revenue.contractAssets > revenue.revenueRecognizedPeriod * 0.5) {
        largeTrueUp[revenue.category]++;
      }
    }

    const buildCategories = (data: Record<RevenueCategory, number>) => {
      return Object.entries(data)
        .filter(([_, count]) => count > 0)
        .map(([category, count]) => ({ category: category as RevenueCategory, count }));
    };

    const missingPODetailCategories = buildCategories(missingPODetail);
    if (missingPODetailCategories.length > 0) {
      panels.push({
        type: "MISSING_PO_DETAIL",
        title: "Contracts missing performance obligation detail",
        categories: missingPODetailCategories,
        severity: "HIGH",
      });
    }

    const manualRecognitionCategories = buildCategories(manualRecognition);
    if (manualRecognitionCategories.length > 0) {
      panels.push({
        type: "MANUAL_RECOGNITION",
        title: "Manual or estimate-based recognition",
        categories: manualRecognitionCategories,
        severity: "MEDIUM",
      });
    }

    const largeTrueUpCategories = buildCategories(largeTrueUp);
    if (largeTrueUpCategories.length > 0) {
      panels.push({
        type: "LARGE_TRUE_UP",
        title: "Large recognition true-ups",
        categories: largeTrueUpCategories,
        severity: "MEDIUM",
      });
    }

    const notReviewedCategories = buildCategories(notReviewed);
    if (notReviewedCategories.length > 0) {
      panels.push({
        type: "NOT_REVIEWED",
        title: "Contracts not reviewed this period",
        categories: notReviewedCategories,
        severity: "MEDIUM",
      });
    }

    return panels.sort((a, b) => {
      const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // ========================
  // Investment Income Earned Methods
  // ========================

  private seedInvestmentIncomeSchedules() {
    const now = new Date().toISOString();
    const sampleInvestments: InvestmentIncomeSchedule[] = [
      {
        id: randomUUID(),
        instrumentName: "US Treasury Bond 5Y",
        issuerName: "US Treasury",
        category: "FIXED_INCOME",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        yieldBasis: "FIXED_RATE",
        acquisitionDate: "2023-01-15",
        maturityDate: "2028-01-15",
        principalAmount: 5000000,
        yieldRate: 4.25,
        incomeEarnedToDate: 425000,
        incomeEarnedPeriod: 17708,
        accruedIncomeBalance: 35417,
        cashReceivedPeriod: 17708,
        currency: "USD",
        hasRateData: true,
        lastRateUpdatePeriod: "2025-01",
        isAssumptionBased: false,
        accruedAgingDays: 30,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Treasury Controller",
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Corporate Bond - Apple Inc",
        issuerName: "Apple Inc",
        category: "FIXED_INCOME",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        yieldBasis: "FIXED_RATE",
        acquisitionDate: "2023-06-01",
        maturityDate: "2030-06-01",
        principalAmount: 2000000,
        yieldRate: 5.50,
        incomeEarnedToDate: 183333,
        incomeEarnedPeriod: 9167,
        accruedIncomeBalance: 18333,
        cashReceivedPeriod: 9167,
        currency: "USD",
        hasRateData: true,
        lastRateUpdatePeriod: "2025-01",
        isAssumptionBased: false,
        accruedAgingDays: 45,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Treasury Controller",
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Money Market Fund",
        issuerName: "Vanguard",
        category: "INTEREST_BEARING",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        yieldBasis: "VARIABLE_RATE",
        acquisitionDate: "2024-01-01",
        maturityDate: null,
        principalAmount: 10000000,
        yieldRate: 5.15,
        incomeEarnedToDate: 642500,
        incomeEarnedPeriod: 42917,
        accruedIncomeBalance: 0,
        cashReceivedPeriod: 42917,
        currency: "USD",
        hasRateData: true,
        lastRateUpdatePeriod: "2025-01",
        isAssumptionBased: false,
        accruedAgingDays: 0,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Treasury Analyst",
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "High Yield Savings",
        issuerName: "JPMorgan Chase",
        category: "INTEREST_BEARING",
        entityId: "SUB-US",
        lifecycleState: "ACTIVE",
        yieldBasis: "VARIABLE_RATE",
        acquisitionDate: "2024-03-01",
        maturityDate: null,
        principalAmount: 3000000,
        yieldRate: 4.85,
        incomeEarnedToDate: 145500,
        incomeEarnedPeriod: 12125,
        accruedIncomeBalance: 0,
        cashReceivedPeriod: 12125,
        currency: "USD",
        hasRateData: true,
        lastRateUpdatePeriod: "2024-12",
        isAssumptionBased: false,
        accruedAgingDays: 0,
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Microsoft Corp - Common Stock",
        issuerName: "Microsoft Corporation",
        category: "DIVIDENDS",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        yieldBasis: "DIVIDEND_DECLARED",
        acquisitionDate: "2022-05-01",
        maturityDate: null,
        principalAmount: 1500000,
        yieldRate: 0.72,
        incomeEarnedToDate: 32400,
        incomeEarnedPeriod: 2700,
        accruedIncomeBalance: 5400,
        cashReceivedPeriod: 2700,
        currency: "USD",
        hasRateData: true,
        lastRateUpdatePeriod: "2025-01",
        isAssumptionBased: false,
        accruedAgingDays: 60,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Investment Manager",
        owner: "Investments",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Johnson & Johnson - Common Stock",
        issuerName: "Johnson & Johnson",
        category: "DIVIDENDS",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        yieldBasis: "DIVIDEND_DECLARED",
        acquisitionDate: "2022-08-15",
        maturityDate: null,
        principalAmount: 800000,
        yieldRate: 2.95,
        incomeEarnedToDate: 70800,
        incomeEarnedPeriod: 1967,
        accruedIncomeBalance: 3933,
        cashReceivedPeriod: 1967,
        currency: "USD",
        hasRateData: true,
        lastRateUpdatePeriod: "2025-01",
        isAssumptionBased: false,
        accruedAgingDays: 45,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Investment Manager",
        owner: "Investments",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Private Equity Fund III",
        issuerName: "Blackstone",
        category: "EQUITY_METHOD",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        yieldBasis: "ESTIMATED",
        acquisitionDate: "2021-03-01",
        maturityDate: "2031-03-01",
        principalAmount: 5000000,
        yieldRate: 12.0,
        incomeEarnedToDate: 2400000,
        incomeEarnedPeriod: 50000,
        accruedIncomeBalance: 150000,
        cashReceivedPeriod: 0,
        currency: "USD",
        hasRateData: false,
        lastRateUpdatePeriod: null,
        isAssumptionBased: true,
        accruedAgingDays: 180,
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Private Investments",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Real Estate Fund LP",
        issuerName: "KKR Real Estate",
        category: "EQUITY_METHOD",
        entityId: "SUB-US",
        lifecycleState: "ACTIVE",
        yieldBasis: "ESTIMATED",
        acquisitionDate: "2022-01-15",
        maturityDate: "2032-01-15",
        principalAmount: 3000000,
        yieldRate: 8.5,
        incomeEarnedToDate: 765000,
        incomeEarnedPeriod: 21250,
        accruedIncomeBalance: 63750,
        cashReceivedPeriod: 0,
        currency: "USD",
        hasRateData: false,
        lastRateUpdatePeriod: null,
        isAssumptionBased: true,
        accruedAgingDays: 120,
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Private Investments",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Term Deposit - 12M",
        issuerName: "Bank of America",
        category: "INTEREST_BEARING",
        entityId: "SUB-EU",
        lifecycleState: "DORMANT",
        yieldBasis: "FIXED_RATE",
        acquisitionDate: "2024-02-01",
        maturityDate: "2025-02-01",
        principalAmount: 1000000,
        yieldRate: 4.0,
        incomeEarnedToDate: 40000,
        incomeEarnedPeriod: 0,
        accruedIncomeBalance: 3333,
        cashReceivedPeriod: 0,
        currency: "EUR",
        hasRateData: true,
        lastRateUpdatePeriod: "2024-06",
        isAssumptionBased: false,
        accruedAgingDays: 90,
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "EU Treasury",
        owner: "EU Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Convertible Notes - TechStartup",
        issuerName: "TechStartup Inc",
        category: "OTHER",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        yieldBasis: "ESTIMATED",
        acquisitionDate: "2023-09-01",
        maturityDate: "2026-09-01",
        principalAmount: 500000,
        yieldRate: 8.0,
        incomeEarnedToDate: 66667,
        incomeEarnedPeriod: 3333,
        accruedIncomeBalance: 10000,
        cashReceivedPeriod: 0,
        currency: "USD",
        hasRateData: false,
        lastRateUpdatePeriod: null,
        isAssumptionBased: true,
        accruedAgingDays: 270,
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Venture Investments",
        createdAt: now,
      },
    ];

    for (const investment of sampleInvestments) {
      this.investmentIncomeSchedules.set(investment.id, investment);
    }
  }

  async getInvestmentIncomeSchedules(entityId?: string, category?: InvestmentCategory): Promise<InvestmentIncomeSchedule[]> {
    let investments = Array.from(this.investmentIncomeSchedules.values())
      .filter(i => i.lifecycleState === "ACTIVE" || i.lifecycleState === "DORMANT");
    
    if (entityId) {
      investments = investments.filter(i => i.entityId === entityId);
    }
    
    if (category) {
      investments = investments.filter(i => i.category === category);
    }

    return investments.sort((a, b) => b.incomeEarnedPeriod - a.incomeEarnedPeriod);
  }

  async getInvestmentIncomeSchedule(id: string): Promise<InvestmentIncomeSchedule | undefined> {
    return this.investmentIncomeSchedules.get(id);
  }

  async createInvestmentIncomeSchedule(data: InsertInvestmentIncomeSchedule): Promise<InvestmentIncomeSchedule> {
    const now = new Date().toISOString();
    const investment: InvestmentIncomeSchedule = {
      id: randomUUID(),
      instrumentName: data.instrumentName,
      issuerName: data.issuerName,
      category: data.category,
      entityId: data.entityId,
      lifecycleState: "ACTIVE",
      yieldBasis: data.yieldBasis,
      acquisitionDate: data.acquisitionDate,
      maturityDate: data.maturityDate || null,
      principalAmount: data.principalAmount,
      yieldRate: data.yieldRate,
      incomeEarnedToDate: 0,
      incomeEarnedPeriod: 0,
      accruedIncomeBalance: 0,
      cashReceivedPeriod: 0,
      currency: data.currency,
      hasRateData: false,
      lastRateUpdatePeriod: null,
      isAssumptionBased: data.yieldBasis === "ESTIMATED",
      accruedAgingDays: 0,
      evidence: "MISSING",
      reviewStatus: "NOT_REVIEWED",
      lastReviewedAt: null,
      lastReviewedBy: null,
      owner: data.owner,
      createdAt: now,
    };

    this.investmentIncomeSchedules.set(investment.id, investment);
    return investment;
  }

  async getInvestmentIncomeDashboardKPIs(entityId?: string, period?: string): Promise<InvestmentIncomeDashboardKPIs> {
    let investments = Array.from(this.investmentIncomeSchedules.values())
      .filter(i => i.lifecycleState === "ACTIVE" || i.lifecycleState === "DORMANT");
    
    if (entityId) {
      investments = investments.filter(i => i.entityId === entityId);
    }

    const activeInvestments = investments.filter(i => i.lifecycleState === "ACTIVE");
    const dormantInvestments = investments.filter(i => i.lifecycleState === "DORMANT");

    const incomeEarnedPeriod = activeInvestments.reduce((sum, i) => sum + i.incomeEarnedPeriod, 0);
    const accruedIncomeBalance = investments.reduce((sum, i) => sum + i.accruedIncomeBalance, 0);
    const cashReceivedPeriod = activeInvestments.reduce((sum, i) => sum + i.cashReceivedPeriod, 0);
    const highRiskInstruments = investments.filter(i => 
      !i.hasRateData || i.isAssumptionBased || i.accruedAgingDays > 90
    ).length;

    return {
      incomeEarnedPeriod,
      accruedIncomeBalance,
      cashReceivedPeriod,
      activeInvestments: activeInvestments.length,
      dormantInvestments: dormantInvestments.length,
      highRiskInstruments,
    };
  }

  async getInvestmentIncomeCategorySummaries(entityId?: string): Promise<InvestmentIncomeCategorySummary[]> {
    let investments = Array.from(this.investmentIncomeSchedules.values())
      .filter(i => i.lifecycleState === "ACTIVE" || i.lifecycleState === "DORMANT");
    
    if (entityId) {
      investments = investments.filter(i => i.entityId === entityId);
    }

    const summaries: Record<InvestmentCategory, InvestmentIncomeCategorySummary> = {
      INTEREST_BEARING: { category: "INTEREST_BEARING", activeCount: 0, incomeEarned: 0, accruedBalance: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      DIVIDENDS: { category: "DIVIDENDS", activeCount: 0, incomeEarned: 0, accruedBalance: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      FIXED_INCOME: { category: "FIXED_INCOME", activeCount: 0, incomeEarned: 0, accruedBalance: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      EQUITY_METHOD: { category: "EQUITY_METHOD", activeCount: 0, incomeEarned: 0, accruedBalance: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
      OTHER: { category: "OTHER", activeCount: 0, incomeEarned: 0, accruedBalance: 0, riskLevel: "LOW", reviewStatus: "REVIEWED" },
    };

    for (const investment of investments) {
      const cat = investment.category;
      if (investment.lifecycleState === "ACTIVE") {
        summaries[cat].activeCount++;
      }
      summaries[cat].incomeEarned += investment.incomeEarnedPeriod;
      summaries[cat].accruedBalance += investment.accruedIncomeBalance;
      
      if (!investment.hasRateData || investment.isAssumptionBased || investment.accruedAgingDays > 90) {
        summaries[cat].riskLevel = "HIGH";
      } else if (investment.accruedAgingDays > 45 && summaries[cat].riskLevel !== "HIGH") {
        summaries[cat].riskLevel = "MEDIUM";
      }
      
      if (investment.reviewStatus === "NOT_REVIEWED") {
        summaries[cat].reviewStatus = "NOT_REVIEWED";
      }
    }

    return Object.values(summaries)
      .filter(s => s.activeCount > 0 || s.incomeEarned > 0)
      .sort((a, b) => b.incomeEarned - a.incomeEarned);
  }

  async getInvestmentIncomeTrend(entityId?: string, periods: number = 6): Promise<InvestmentIncomeTrendPoint[]> {
    let investments = Array.from(this.investmentIncomeSchedules.values())
      .filter(i => i.lifecycleState === "ACTIVE");
    
    if (entityId) {
      investments = investments.filter(i => i.entityId === entityId);
    }

    const currentEarned = investments.reduce((sum, i) => sum + i.incomeEarnedPeriod, 0);
    const currentReceived = investments.reduce((sum, i) => sum + i.cashReceivedPeriod, 0);
    const result: InvestmentIncomeTrendPoint[] = [];
    
    const today = new Date();
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const incomeEarned = i === 0 ? currentEarned : currentEarned * (0.92 + Math.random() * 0.16);
      const cashReceived = i === 0 ? currentReceived : currentReceived * (0.85 + Math.random() * 0.3);
      result.push({ 
        period, 
        incomeEarned: Math.round(incomeEarned), 
        cashReceived: Math.round(cashReceived) 
      });
    }

    return result;
  }

  async getYieldMixBreakdown(entityId?: string): Promise<YieldMixBreakdown[]> {
    let investments = Array.from(this.investmentIncomeSchedules.values())
      .filter(i => i.lifecycleState === "ACTIVE");
    
    if (entityId) {
      investments = investments.filter(i => i.entityId === entityId);
    }

    const totals: Record<InvestmentCategory, number> = {
      INTEREST_BEARING: 0,
      DIVIDENDS: 0,
      FIXED_INCOME: 0,
      EQUITY_METHOD: 0,
      OTHER: 0,
    };

    for (const investment of investments) {
      totals[investment.category] += investment.incomeEarnedPeriod;
    }

    const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);

    return Object.entries(totals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category: category as InvestmentCategory,
        amount,
        percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  async getAccruedVsReceived(entityId?: string, periods: number = 6): Promise<AccruedVsReceivedPoint[]> {
    let investments = Array.from(this.investmentIncomeSchedules.values())
      .filter(i => i.lifecycleState === "ACTIVE" || i.lifecycleState === "DORMANT");
    
    if (entityId) {
      investments = investments.filter(i => i.entityId === entityId);
    }

    const currentAccrued = investments.reduce((sum, i) => sum + i.accruedIncomeBalance, 0);
    const currentReceived = investments.reduce((sum, i) => sum + i.cashReceivedPeriod, 0);
    const result: AccruedVsReceivedPoint[] = [];
    
    const today = new Date();
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const accrued = i === 0 ? currentAccrued : currentAccrued * (0.8 + Math.random() * 0.4);
      const received = i === 0 ? currentReceived : currentReceived * (0.75 + Math.random() * 0.5);
      result.push({ 
        period, 
        accrued: Math.round(accrued), 
        received: Math.round(received) 
      });
    }

    return result;
  }

  async getInvestmentIncomeRiskPanels(entityId?: string): Promise<InvestmentIncomeRiskPanel[]> {
    let investments = Array.from(this.investmentIncomeSchedules.values())
      .filter(i => i.lifecycleState === "ACTIVE" || i.lifecycleState === "DORMANT");
    
    if (entityId) {
      investments = investments.filter(i => i.entityId === entityId);
    }

    const panels: InvestmentIncomeRiskPanel[] = [];

    const missingRate: Record<InvestmentCategory, number> = { INTEREST_BEARING: 0, DIVIDENDS: 0, FIXED_INCOME: 0, EQUITY_METHOD: 0, OTHER: 0 };
    const rateNotUpdated: Record<InvestmentCategory, number> = { INTEREST_BEARING: 0, DIVIDENDS: 0, FIXED_INCOME: 0, EQUITY_METHOD: 0, OTHER: 0 };
    const assumptionBased: Record<InvestmentCategory, number> = { INTEREST_BEARING: 0, DIVIDENDS: 0, FIXED_INCOME: 0, EQUITY_METHOD: 0, OTHER: 0 };
    const accruedOutstanding: Record<InvestmentCategory, number> = { INTEREST_BEARING: 0, DIVIDENDS: 0, FIXED_INCOME: 0, EQUITY_METHOD: 0, OTHER: 0 };
    const notReviewed: Record<InvestmentCategory, number> = { INTEREST_BEARING: 0, DIVIDENDS: 0, FIXED_INCOME: 0, EQUITY_METHOD: 0, OTHER: 0 };

    const currentPeriod = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

    for (const investment of investments) {
      if (!investment.hasRateData) {
        missingRate[investment.category]++;
      }
      if (investment.lastRateUpdatePeriod && investment.lastRateUpdatePeriod < currentPeriod) {
        rateNotUpdated[investment.category]++;
      }
      if (investment.isAssumptionBased) {
        assumptionBased[investment.category]++;
      }
      if (investment.accruedAgingDays > 90) {
        accruedOutstanding[investment.category]++;
      }
      if (investment.reviewStatus === "NOT_REVIEWED") {
        notReviewed[investment.category]++;
      }
    }

    const buildCategories = (data: Record<InvestmentCategory, number>) => {
      return Object.entries(data)
        .filter(([_, count]) => count > 0)
        .map(([category, count]) => ({ category: category as InvestmentCategory, count }));
    };

    const missingRateCategories = buildCategories(missingRate);
    if (missingRateCategories.length > 0) {
      panels.push({
        type: "MISSING_RATE",
        title: "Schedules missing rate or yield data",
        categories: missingRateCategories,
        severity: "HIGH",
      });
    }

    const rateNotUpdatedCategories = buildCategories(rateNotUpdated);
    if (rateNotUpdatedCategories.length > 0) {
      panels.push({
        type: "RATE_NOT_UPDATED",
        title: "Rate changes not updated this period",
        categories: rateNotUpdatedCategories,
        severity: "MEDIUM",
      });
    }

    const assumptionBasedCategories = buildCategories(assumptionBased);
    if (assumptionBasedCategories.length > 0) {
      panels.push({
        type: "ASSUMPTION_BASED",
        title: "Assumption-based income (manual estimates)",
        categories: assumptionBasedCategories,
        severity: "HIGH",
      });
    }

    const accruedOutstandingCategories = buildCategories(accruedOutstanding);
    if (accruedOutstandingCategories.length > 0) {
      panels.push({
        type: "ACCRUED_OUTSTANDING",
        title: "Accrued income outstanding beyond threshold",
        categories: accruedOutstandingCategories,
        severity: "MEDIUM",
      });
    }

    const notReviewedCategories = buildCategories(notReviewed);
    if (notReviewedCategories.length > 0) {
      panels.push({
        type: "NOT_REVIEWED",
        title: "Schedules not reviewed this period",
        categories: notReviewedCategories,
        severity: "MEDIUM",
      });
    }

    return panels.sort((a, b) => {
      const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // ========================
  // Loan & Debt Amortization Methods
  // ========================

  private seedDebtSchedules() {
    const now = new Date().toISOString();
    const currentPeriod = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
    
    const sampleDebts: DebtSchedule[] = [
      {
        id: randomUUID(),
        instrumentName: "Senior Secured Term Loan A",
        lenderName: "First National Bank",
        category: "TERM_LOANS",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        amortizationMethod: "EFFECTIVE",
        interestType: "FIXED",
        originationDate: "2022-06-15",
        maturityDate: "2029-06-15",
        originalPrincipal: 10000000,
        outstandingPrincipal: 7500000,
        principalRepaidPeriod: 125000,
        interestIncurredPeriod: 31250,
        accruedInterest: 15625,
        interestRate: 5.0,
        currency: "USD",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: currentPeriod,
        principalEvidenceStatus: "ATTACHED",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "John Smith",
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Term Loan B - Equipment Financing",
        lenderName: "Equipment Finance Corp",
        category: "TERM_LOANS",
        entityId: "SUB-US",
        lifecycleState: "ACTIVE",
        amortizationMethod: "NOMINAL",
        interestType: "FIXED",
        originationDate: "2023-03-01",
        maturityDate: "2028-03-01",
        originalPrincipal: 2500000,
        outstandingPrincipal: 1875000,
        principalRepaidPeriod: 52083,
        interestIncurredPeriod: 9375,
        accruedInterest: 4688,
        interestRate: 6.0,
        currency: "USD",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: currentPeriod,
        principalEvidenceStatus: "ATTACHED",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Sarah Chen",
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "ABL Revolver",
        lenderName: "Wells Fargo",
        category: "REVOLVING_CREDIT",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        amortizationMethod: "NOMINAL",
        interestType: "VARIABLE",
        originationDate: "2024-01-01",
        maturityDate: "2027-01-01",
        originalPrincipal: 5000000,
        outstandingPrincipal: 2000000,
        principalRepaidPeriod: 0,
        interestIncurredPeriod: 11667,
        accruedInterest: 5833,
        interestRate: 7.0,
        currency: "USD",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: "2025-12",
        principalEvidenceStatus: "ATTACHED",
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Corporate Bond Series A",
        lenderName: "Public Market",
        category: "BONDS_NOTES",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        amortizationMethod: "EFFECTIVE",
        interestType: "FIXED",
        originationDate: "2021-09-01",
        maturityDate: "2031-09-01",
        originalPrincipal: 50000000,
        outstandingPrincipal: 50000000,
        principalRepaidPeriod: 0,
        interestIncurredPeriod: 187500,
        accruedInterest: 93750,
        interestRate: 4.5,
        currency: "USD",
        hasEffectiveInterestOverride: true,
        lastRateUpdatePeriod: currentPeriod,
        principalEvidenceStatus: "ATTACHED",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Maria Garcia",
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Convertible Notes 2025",
        lenderName: "Venture Partners LP",
        category: "BONDS_NOTES",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        amortizationMethod: "NOMINAL",
        interestType: "FIXED",
        originationDate: "2023-06-01",
        maturityDate: "2028-06-01",
        originalPrincipal: 15000000,
        outstandingPrincipal: 15000000,
        principalRepaidPeriod: 0,
        interestIncurredPeriod: 75000,
        accruedInterest: 375000,
        interestRate: 6.0,
        currency: "USD",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: currentPeriod,
        principalEvidenceStatus: "ATTACHED",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "John Smith",
        owner: "Treasury",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Intercompany Loan - EU Sub",
        lenderName: "Corp HQ",
        category: "INTERCOMPANY_LOANS",
        entityId: "SUB-EU",
        lifecycleState: "ACTIVE",
        amortizationMethod: "NOMINAL",
        interestType: "FIXED",
        originationDate: "2024-01-01",
        maturityDate: "2027-01-01",
        originalPrincipal: 3000000,
        outstandingPrincipal: 2500000,
        principalRepaidPeriod: 41667,
        interestIncurredPeriod: 10417,
        accruedInterest: 5208,
        interestRate: 5.0,
        currency: "EUR",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: currentPeriod,
        principalEvidenceStatus: "MISSING",
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Intercompany",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Intercompany Loan - UK Sub",
        lenderName: "Corp HQ",
        category: "INTERCOMPANY_LOANS",
        entityId: "SUB-UK",
        lifecycleState: "DORMANT",
        amortizationMethod: "NOMINAL",
        interestType: "FIXED",
        originationDate: "2022-07-01",
        maturityDate: "2025-07-01",
        originalPrincipal: 1500000,
        outstandingPrincipal: 500000,
        principalRepaidPeriod: 0,
        interestIncurredPeriod: 2083,
        accruedInterest: 8333,
        interestRate: 5.0,
        currency: "GBP",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: "2025-10",
        principalEvidenceStatus: "ATTACHED",
        evidence: "ATTACHED",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Intercompany",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Office Lease - HQ Building",
        lenderName: "Commercial Properties LLC",
        category: "LEASE_LIABILITIES",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        amortizationMethod: "EFFECTIVE",
        interestType: "FIXED",
        originationDate: "2020-01-01",
        maturityDate: "2030-01-01",
        originalPrincipal: 8000000,
        outstandingPrincipal: 5200000,
        principalRepaidPeriod: 55556,
        interestIncurredPeriod: 21667,
        accruedInterest: 0,
        interestRate: 5.0,
        currency: "USD",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: currentPeriod,
        principalEvidenceStatus: "ATTACHED",
        evidence: "ATTACHED",
        reviewStatus: "REVIEWED",
        lastReviewedAt: now,
        lastReviewedBy: "Sarah Chen",
        owner: "Real Estate",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Vehicle Fleet Lease",
        lenderName: "Auto Leasing Inc",
        category: "LEASE_LIABILITIES",
        entityId: "SUB-US",
        lifecycleState: "ACTIVE",
        amortizationMethod: "NOMINAL",
        interestType: "FIXED",
        originationDate: "2024-06-01",
        maturityDate: "2027-06-01",
        originalPrincipal: 450000,
        outstandingPrincipal: 337500,
        principalRepaidPeriod: 12500,
        interestIncurredPeriod: 1406,
        accruedInterest: 0,
        interestRate: 5.0,
        currency: "USD",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: currentPeriod,
        principalEvidenceStatus: "ATTACHED",
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "Fleet Management",
        createdAt: now,
      },
      {
        id: randomUUID(),
        instrumentName: "Bridge Loan - Acquisition",
        lenderName: "Private Credit Fund",
        category: "OTHER",
        entityId: "CORP-001",
        lifecycleState: "ACTIVE",
        amortizationMethod: "NOMINAL",
        interestType: "VARIABLE",
        originationDate: "2025-01-01",
        maturityDate: "2026-01-01",
        originalPrincipal: 8000000,
        outstandingPrincipal: 8000000,
        principalRepaidPeriod: 0,
        interestIncurredPeriod: 66667,
        accruedInterest: 33333,
        interestRate: 10.0,
        currency: "USD",
        hasEffectiveInterestOverride: false,
        lastRateUpdatePeriod: "2025-11",
        principalEvidenceStatus: "MISSING",
        evidence: "MISSING",
        reviewStatus: "NOT_REVIEWED",
        lastReviewedAt: null,
        lastReviewedBy: null,
        owner: "M&A Team",
        createdAt: now,
      },
    ];

    for (const debt of sampleDebts) {
      this.debtSchedules.set(debt.id, debt);
    }
  }

  async getDebtSchedules(entityId?: string, category?: DebtCategory): Promise<DebtSchedule[]> {
    let debts = Array.from(this.debtSchedules.values())
      .filter(d => d.lifecycleState === "ACTIVE" || d.lifecycleState === "DORMANT");
    
    if (entityId) {
      debts = debts.filter(d => d.entityId === entityId);
    }
    if (category) {
      debts = debts.filter(d => d.category === category);
    }
    
    return debts.sort((a, b) => b.outstandingPrincipal - a.outstandingPrincipal);
  }

  async getDebtSchedule(id: string): Promise<DebtSchedule | undefined> {
    return this.debtSchedules.get(id);
  }

  async createDebtSchedule(data: InsertDebtSchedule): Promise<DebtSchedule> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    const schedule: DebtSchedule = {
      id,
      instrumentName: data.instrumentName,
      lenderName: data.lenderName,
      category: data.category,
      entityId: data.entityId,
      lifecycleState: "ACTIVE",
      amortizationMethod: data.amortizationMethod,
      interestType: data.interestType,
      originationDate: data.originationDate,
      maturityDate: data.maturityDate,
      originalPrincipal: data.originalPrincipal,
      outstandingPrincipal: data.originalPrincipal,
      principalRepaidPeriod: 0,
      interestIncurredPeriod: 0,
      accruedInterest: 0,
      interestRate: data.interestRate,
      currency: data.currency,
      hasEffectiveInterestOverride: false,
      lastRateUpdatePeriod: null,
      principalEvidenceStatus: "MISSING",
      evidence: "MISSING",
      reviewStatus: "NOT_REVIEWED",
      lastReviewedAt: null,
      lastReviewedBy: null,
      owner: data.owner,
      createdAt: now,
    };
    
    this.debtSchedules.set(id, schedule);
    return schedule;
  }

  async getDebtDashboardKPIs(entityId?: string, period?: string): Promise<DebtDashboardKPIs> {
    let debts = Array.from(this.debtSchedules.values())
      .filter(d => d.lifecycleState === "ACTIVE" || d.lifecycleState === "DORMANT");
    
    if (entityId) {
      debts = debts.filter(d => d.entityId === entityId);
    }

    const activeDebts = debts.filter(d => d.lifecycleState === "ACTIVE");
    const highRiskDebts = debts.filter(d => 
      d.interestType === "VARIABLE" || 
      d.hasEffectiveInterestOverride ||
      d.principalEvidenceStatus === "MISSING"
    );

    return {
      outstandingPrincipal: debts.reduce((sum, d) => sum + d.outstandingPrincipal, 0),
      principalRepaidPeriod: debts.reduce((sum, d) => sum + d.principalRepaidPeriod, 0),
      interestIncurredPeriod: debts.reduce((sum, d) => sum + d.interestIncurredPeriod, 0),
      accruedInterest: debts.reduce((sum, d) => sum + d.accruedInterest, 0),
      activeDebtInstruments: activeDebts.length,
      highRiskDebt: highRiskDebts.length,
    };
  }

  async getDebtCategorySummaries(entityId?: string): Promise<DebtCategorySummary[]> {
    let debts = Array.from(this.debtSchedules.values())
      .filter(d => d.lifecycleState === "ACTIVE" || d.lifecycleState === "DORMANT");
    
    if (entityId) {
      debts = debts.filter(d => d.entityId === entityId);
    }

    const categories: DebtCategory[] = ["TERM_LOANS", "REVOLVING_CREDIT", "BONDS_NOTES", "INTERCOMPANY_LOANS", "LEASE_LIABILITIES", "OTHER"];
    
    return categories
      .map(category => {
        const categoryDebts = debts.filter(d => d.category === category);
        const activeCount = categoryDebts.filter(d => d.lifecycleState === "ACTIVE").length;
        const outstandingPrincipal = categoryDebts.reduce((sum, d) => sum + d.outstandingPrincipal, 0);
        const principalRepaid = categoryDebts.reduce((sum, d) => sum + d.principalRepaidPeriod, 0);
        const interestIncurred = categoryDebts.reduce((sum, d) => sum + d.interestIncurredPeriod, 0);
        
        const hasHighRisk = categoryDebts.some(d => 
          d.interestType === "VARIABLE" || 
          d.hasEffectiveInterestOverride ||
          d.principalEvidenceStatus === "MISSING"
        );
        const hasMediumRisk = categoryDebts.some(d => d.reviewStatus === "NOT_REVIEWED");
        
        const riskLevel: "LOW" | "MEDIUM" | "HIGH" = hasHighRisk ? "HIGH" : hasMediumRisk ? "MEDIUM" : "LOW";
        const allReviewed = categoryDebts.every(d => d.reviewStatus === "REVIEWED");
        
        return {
          category,
          activeCount,
          outstandingPrincipal,
          principalRepaid,
          interestIncurred,
          riskLevel,
          reviewStatus: allReviewed ? "REVIEWED" as const : "NOT_REVIEWED" as const,
        };
      })
      .filter(s => s.activeCount > 0 || s.outstandingPrincipal > 0)
      .sort((a, b) => b.outstandingPrincipal - a.outstandingPrincipal);
  }

  async getDebtTrend(entityId?: string, periods: number = 6): Promise<DebtTrendPoint[]> {
    let debts = Array.from(this.debtSchedules.values())
      .filter(d => d.lifecycleState === "ACTIVE");
    
    if (entityId) {
      debts = debts.filter(d => d.entityId === entityId);
    }

    const currentPrincipal = debts.reduce((sum, d) => sum + d.outstandingPrincipal, 0);
    const monthlyRepayment = debts.reduce((sum, d) => sum + d.principalRepaidPeriod, 0);
    const result: DebtTrendPoint[] = [];
    
    const today = new Date();
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const outstandingPrincipal = i === 0 
        ? currentPrincipal 
        : currentPrincipal + (monthlyRepayment * i);
      result.push({ 
        period, 
        outstandingPrincipal: Math.round(outstandingPrincipal)
      });
    }

    return result;
  }

  async getPrincipalInterestSplit(entityId?: string, periods: number = 6): Promise<PrincipalInterestSplit[]> {
    let debts = Array.from(this.debtSchedules.values())
      .filter(d => d.lifecycleState === "ACTIVE");
    
    if (entityId) {
      debts = debts.filter(d => d.entityId === entityId);
    }

    const currentPrincipal = debts.reduce((sum, d) => sum + d.principalRepaidPeriod, 0);
    const currentInterest = debts.reduce((sum, d) => sum + d.interestIncurredPeriod, 0);
    const result: PrincipalInterestSplit[] = [];
    
    const today = new Date();
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const principalRepaid = i === 0 ? currentPrincipal : currentPrincipal * (0.9 + Math.random() * 0.2);
      const interestIncurred = i === 0 ? currentInterest : currentInterest * (0.95 + Math.random() * 0.1);
      result.push({ 
        period, 
        principalRepaid: Math.round(principalRepaid),
        interestIncurred: Math.round(interestIncurred)
      });
    }

    return result;
  }

  async getDebtMixBreakdown(entityId?: string): Promise<DebtMixBreakdown[]> {
    let debts = Array.from(this.debtSchedules.values())
      .filter(d => d.lifecycleState === "ACTIVE" || d.lifecycleState === "DORMANT");
    
    if (entityId) {
      debts = debts.filter(d => d.entityId === entityId);
    }

    const totals: Record<DebtCategory, number> = {
      TERM_LOANS: 0,
      REVOLVING_CREDIT: 0,
      BONDS_NOTES: 0,
      INTERCOMPANY_LOANS: 0,
      LEASE_LIABILITIES: 0,
      OTHER: 0,
    };

    for (const debt of debts) {
      totals[debt.category] += debt.outstandingPrincipal;
    }

    const grandTotal = Object.values(totals).reduce((sum, v) => sum + v, 0);

    return Object.entries(totals)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category: category as DebtCategory,
        amount,
        percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  async getDebtRiskPanels(entityId?: string): Promise<DebtRiskPanel[]> {
    let debts = Array.from(this.debtSchedules.values())
      .filter(d => d.lifecycleState === "ACTIVE" || d.lifecycleState === "DORMANT");
    
    if (entityId) {
      debts = debts.filter(d => d.entityId === entityId);
    }

    const panels: DebtRiskPanel[] = [];

    const principalNoEvidence: Record<DebtCategory, number> = { TERM_LOANS: 0, REVOLVING_CREDIT: 0, BONDS_NOTES: 0, INTERCOMPANY_LOANS: 0, LEASE_LIABILITIES: 0, OTHER: 0 };
    const variableRateNotUpdated: Record<DebtCategory, number> = { TERM_LOANS: 0, REVOLVING_CREDIT: 0, BONDS_NOTES: 0, INTERCOMPANY_LOANS: 0, LEASE_LIABILITIES: 0, OTHER: 0 };
    const effectiveInterestOverride: Record<DebtCategory, number> = { TERM_LOANS: 0, REVOLVING_CREDIT: 0, BONDS_NOTES: 0, INTERCOMPANY_LOANS: 0, LEASE_LIABILITIES: 0, OTHER: 0 };
    const accruedInterestOutstanding: Record<DebtCategory, number> = { TERM_LOANS: 0, REVOLVING_CREDIT: 0, BONDS_NOTES: 0, INTERCOMPANY_LOANS: 0, LEASE_LIABILITIES: 0, OTHER: 0 };
    const notReviewed: Record<DebtCategory, number> = { TERM_LOANS: 0, REVOLVING_CREDIT: 0, BONDS_NOTES: 0, INTERCOMPANY_LOANS: 0, LEASE_LIABILITIES: 0, OTHER: 0 };

    const currentPeriod = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

    for (const debt of debts) {
      if (debt.principalEvidenceStatus === "MISSING") {
        principalNoEvidence[debt.category]++;
      }
      if (debt.interestType === "VARIABLE" && debt.lastRateUpdatePeriod && debt.lastRateUpdatePeriod < currentPeriod) {
        variableRateNotUpdated[debt.category]++;
      }
      if (debt.hasEffectiveInterestOverride) {
        effectiveInterestOverride[debt.category]++;
      }
      if (debt.accruedInterest > debt.interestIncurredPeriod * 2) {
        accruedInterestOutstanding[debt.category]++;
      }
      if (debt.reviewStatus === "NOT_REVIEWED") {
        notReviewed[debt.category]++;
      }
    }

    const buildCategories = (data: Record<DebtCategory, number>) => {
      return Object.entries(data)
        .filter(([_, count]) => count > 0)
        .map(([category, count]) => ({ category: category as DebtCategory, count }));
    };

    const principalNoEvidenceCategories = buildCategories(principalNoEvidence);
    if (principalNoEvidenceCategories.length > 0) {
      panels.push({
        type: "PRINCIPAL_NO_EVIDENCE",
        title: "Principal movements not supported by cash evidence",
        categories: principalNoEvidenceCategories,
        severity: "HIGH",
      });
    }

    const variableRateNotUpdatedCategories = buildCategories(variableRateNotUpdated);
    if (variableRateNotUpdatedCategories.length > 0) {
      panels.push({
        type: "VARIABLE_RATE_NOT_UPDATED",
        title: "Variable-rate debt not updated this period",
        categories: variableRateNotUpdatedCategories,
        severity: "HIGH",
      });
    }

    const effectiveInterestOverrideCategories = buildCategories(effectiveInterestOverride);
    if (effectiveInterestOverrideCategories.length > 0) {
      panels.push({
        type: "EFFECTIVE_INTEREST_OVERRIDE",
        title: "Effective interest method overrides",
        categories: effectiveInterestOverrideCategories,
        severity: "MEDIUM",
      });
    }

    const accruedInterestOutstandingCategories = buildCategories(accruedInterestOutstanding);
    if (accruedInterestOutstandingCategories.length > 0) {
      panels.push({
        type: "ACCRUED_INTEREST_OUTSTANDING",
        title: "Accrued interest outstanding beyond threshold",
        categories: accruedInterestOutstandingCategories,
        severity: "MEDIUM",
      });
    }

    const notReviewedCategories = buildCategories(notReviewed);
    if (notReviewedCategories.length > 0) {
      panels.push({
        type: "NOT_REVIEWED",
        title: "Schedules not reviewed this period",
        categories: notReviewedCategories,
        severity: "MEDIUM",
      });
    }

    return panels.sort((a, b) => {
      const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  // ===============================
  // Close Control Templates
  // ===============================

  async getCloseTemplates(templateType?: "TASKLIST" | "SCHEDULE"): Promise<CloseTemplate[]> {
    let templates = Array.from(this.closeTemplates.values());
    if (templateType) {
      templates = templates.filter(t => t.templateType === templateType);
    }
    return templates.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCloseTemplate(id: string): Promise<CloseTemplate | undefined> {
    return this.closeTemplates.get(id);
  }

  async createCloseTemplate(data: InsertCloseTemplate): Promise<CloseTemplate> {
    const id = `TPL-${randomUUID().substring(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const template: CloseTemplate = {
      id,
      name: data.name,
      description: data.description,
      periodType: data.periodType,
      templateType: data.templateType,
      isSystemTemplate: false,
      version: 1,
      taskCount: 0,
      estimatedDays: data.estimatedDays,
      createdAt: now,
      createdBy: "User",
      updatedAt: null,
      updatedBy: null,
    };
    this.closeTemplates.set(id, template);
    return template;
  }

  async updateCloseTemplate(id: string, data: UpdateCloseTemplate): Promise<CloseTemplate> {
    const template = this.closeTemplates.get(id);
    if (!template) {
      throw new Error("Template not found");
    }
    if (template.isSystemTemplate) {
      throw new Error("Cannot modify system templates");
    }
    const now = new Date().toISOString();
    const updated: CloseTemplate = {
      ...template,
      name: data.name ?? template.name,
      description: data.description ?? template.description,
      periodType: data.periodType ?? template.periodType,
      estimatedDays: data.estimatedDays ?? template.estimatedDays,
      version: template.version + 1,
      updatedAt: now,
      updatedBy: "User",
    };
    this.closeTemplates.set(id, updated);
    return updated;
  }

  async deleteCloseTemplate(id: string): Promise<boolean> {
    const template = this.closeTemplates.get(id);
    if (!template) {
      return false;
    }
    if (template.isSystemTemplate) {
      throw new Error("Cannot delete system templates");
    }
    // Delete associated tasks
    const taskEntries = Array.from(this.closeTemplateTasks.entries());
    for (const [taskId, task] of taskEntries) {
      if (task.templateId === id) {
        this.closeTemplateTasks.delete(taskId);
      }
    }
    this.closeTemplates.delete(id);
    return true;
  }

  async cloneCloseTemplate(id: string, newName: string): Promise<CloseTemplate> {
    const source = this.closeTemplates.get(id);
    if (!source) {
      throw new Error("Template not found");
    }
    
    const now = new Date().toISOString();
    const newId = `TPL-${randomUUID().substring(0, 8).toUpperCase()}`;
    
    const cloned: CloseTemplate = {
      id: newId,
      name: newName,
      description: source.description,
      periodType: source.periodType,
      templateType: source.templateType,
      isSystemTemplate: false,
      version: 1,
      taskCount: source.taskCount,
      estimatedDays: source.estimatedDays,
      createdAt: now,
      createdBy: "User",
      updatedAt: null,
      updatedBy: null,
    };
    this.closeTemplates.set(newId, cloned);
    
    // Clone tasks with new IDs
    const sourceTasks = await this.getCloseTemplateTasks(id);
    const taskIdMap = new Map<string, string>();
    
    for (const task of sourceTasks) {
      const newTaskId = `TPLT-${randomUUID().substring(0, 8).toUpperCase()}`;
      taskIdMap.set(task.id, newTaskId);
    }
    
    for (const task of sourceTasks) {
      const newTaskId = taskIdMap.get(task.id)!;
      const clonedTask: CloseTemplateTask = {
        ...task,
        id: newTaskId,
        templateId: newId,
        dependencies: task.dependencies.map(d => taskIdMap.get(d) || d),
        createdAt: now,
        updatedAt: null,
      };
      this.closeTemplateTasks.set(newTaskId, clonedTask);
    }
    
    return cloned;
  }

  // ===============================
  // Close Template Tasks
  // ===============================

  async getCloseTemplateTasks(templateId: string): Promise<CloseTemplateTask[]> {
    const tasks = Array.from(this.closeTemplateTasks.values())
      .filter(t => t.templateId === templateId)
      .sort((a, b) => a.order - b.order);
    return tasks;
  }

  async getCloseTemplateTask(id: string): Promise<CloseTemplateTask | undefined> {
    return this.closeTemplateTasks.get(id);
  }

  async createCloseTemplateTask(data: InsertCloseTemplateTask): Promise<CloseTemplateTask> {
    const template = this.closeTemplates.get(data.templateId);
    if (!template) {
      throw new Error("Template not found");
    }
    if (template.isSystemTemplate) {
      throw new Error("Cannot modify system templates");
    }
    
    const id = `TPLT-${randomUUID().substring(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    
    const task: CloseTemplateTask = {
      id,
      templateId: data.templateId,
      name: data.name,
      description: data.description || "",
      priority: data.priority,
      estimatedHours: data.estimatedHours ?? 0,
      order: data.order,
      defaultPreparerRole: data.defaultPreparerRole ?? null,
      defaultReviewerRole: data.defaultReviewerRole ?? null,
      linkedScheduleType: data.linkedScheduleType ?? null,
      dueDayOffset: data.dueDayOffset ?? 0,
      dependencies: data.dependencies ?? [],
      createdAt: now,
      updatedAt: null,
    };
    
    this.closeTemplateTasks.set(id, task);
    
    // Update template task count
    const taskCount = (await this.getCloseTemplateTasks(data.templateId)).length;
    const updatedTemplate = { ...template, taskCount, updatedAt: now, updatedBy: "User" };
    this.closeTemplates.set(data.templateId, updatedTemplate);
    
    return task;
  }

  async updateCloseTemplateTask(id: string, data: UpdateCloseTemplateTask): Promise<CloseTemplateTask> {
    const task = this.closeTemplateTasks.get(id);
    if (!task) {
      throw new Error("Task not found");
    }
    
    const template = this.closeTemplates.get(task.templateId);
    if (template?.isSystemTemplate) {
      throw new Error("Cannot modify tasks in system templates");
    }
    
    const now = new Date().toISOString();
    const updated: CloseTemplateTask = {
      ...task,
      name: data.name ?? task.name,
      description: data.description ?? task.description,
      priority: data.priority ?? task.priority,
      estimatedHours: data.estimatedHours ?? task.estimatedHours,
      order: data.order ?? task.order,
      defaultPreparerRole: data.defaultPreparerRole !== undefined ? data.defaultPreparerRole : task.defaultPreparerRole,
      defaultReviewerRole: data.defaultReviewerRole !== undefined ? data.defaultReviewerRole : task.defaultReviewerRole,
      linkedScheduleType: data.linkedScheduleType !== undefined ? data.linkedScheduleType : task.linkedScheduleType,
      dueDayOffset: data.dueDayOffset ?? task.dueDayOffset,
      dependencies: data.dependencies ?? task.dependencies,
      updatedAt: now,
    };
    
    this.closeTemplateTasks.set(id, updated);
    
    // Update template timestamp
    if (template) {
      const updatedTemplate = { ...template, updatedAt: now, updatedBy: "User" };
      this.closeTemplates.set(task.templateId, updatedTemplate);
    }
    
    return updated;
  }

  async deleteCloseTemplateTask(id: string): Promise<boolean> {
    const task = this.closeTemplateTasks.get(id);
    if (!task) {
      return false;
    }
    
    const template = this.closeTemplates.get(task.templateId);
    if (template?.isSystemTemplate) {
      throw new Error("Cannot modify tasks in system templates");
    }
    
    this.closeTemplateTasks.delete(id);
    
    // Update template task count
    if (template) {
      const now = new Date().toISOString();
      const taskCount = (await this.getCloseTemplateTasks(task.templateId)).length;
      const updatedTemplate = { ...template, taskCount, updatedAt: now, updatedBy: "User" };
      this.closeTemplates.set(task.templateId, updatedTemplate);
    }
    
    return true;
  }

  async reorderCloseTemplateTasks(templateId: string, taskIds: string[]): Promise<CloseTemplateTask[]> {
    const template = this.closeTemplates.get(templateId);
    if (!template) {
      throw new Error("Template not found");
    }
    if (template.isSystemTemplate) {
      throw new Error("Cannot modify system templates");
    }
    
    const now = new Date().toISOString();
    
    for (let i = 0; i < taskIds.length; i++) {
      const task = this.closeTemplateTasks.get(taskIds[i]);
      if (task && task.templateId === templateId) {
        const updated = { ...task, order: i, updatedAt: now };
        this.closeTemplateTasks.set(taskIds[i], updated);
      }
    }
    
    const updatedTemplate = { ...template, updatedAt: now, updatedBy: "User" };
    this.closeTemplates.set(templateId, updatedTemplate);
    
    return this.getCloseTemplateTasks(templateId);
  }

  // Close Tasks (active tasks in close schedules)
  async getCloseTasklistTasks(tasklistId: string): Promise<CloseTask[]> {
    const tasks: CloseTask[] = [];
    this.closeTasks.forEach((task) => {
      if (task.tasklistId === tasklistId) {
        tasks.push(task);
      }
    });
    return tasks.sort((a, b) => a.order - b.order);
  }

  async getCloseTask(id: string): Promise<CloseTask | undefined> {
    return this.closeTasks.get(id);
  }

  async createCloseTask(data: Partial<CloseTask> & { tasklistId: string; name: string }): Promise<CloseTask> {
    const id = `TSK-${Date.now()}`;
    const now = new Date().toISOString();
    const task: CloseTask = {
      id,
      tasklistId: data.tasklistId,
      closeScheduleId: data.closeScheduleId || "",
      name: data.name,
      description: data.description || "",
      status: data.status || "NOT_STARTED",
      priority: data.priority || "MEDIUM",
      preparerId: data.preparerId || null,
      preparerName: data.preparerName || null,
      reviewerId: data.reviewerId || null,
      reviewerName: data.reviewerName || null,
      dueDate: data.dueDate || "",
      completedAt: null,
      approvedAt: null,
      approvedBy: null,
      evidenceStatus: data.evidenceStatus || "MISSING",
      evidenceCount: data.evidenceCount || 0,
      linkedSchedules: data.linkedSchedules || [],
      dependencies: data.dependencies || [],
      order: data.order || 0,
      period: data.period || "",
      createdAt: now,
    };
    this.closeTasks.set(id, task);
    return task;
  }

  async updateCloseTask(id: string, data: Partial<CloseTask>): Promise<CloseTask> {
    const task = this.closeTasks.get(id);
    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }
    const updated = { ...task, ...data };
    this.closeTasks.set(id, updated);
    return updated;
  }

  async getAllCloseTasks(): Promise<CloseTask[]> {
    const tasks: CloseTask[] = [];
    this.closeTasks.forEach((task) => {
      tasks.push(task);
    });
    return tasks.sort((a, b) => {
      // Sort by due date first, then by priority
      if (a.dueDate !== b.dueDate) {
        return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
      }
      const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 2) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 2);
    });
  }

  private seedCloseTasks() {
    // Seed sample close tasks for tasklist TL-001 (Cash Close)
    const cashCloseTasks: CloseTask[] = [
      { id: "TSK-001", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "Bank Reconciliation", description: "Complete bank reconciliations for all accounts", status: "APPROVED", priority: "HIGH", preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-29", completedAt: "2026-01-28T15:30:00Z", approvedAt: "2026-01-29T10:00:00Z", approvedBy: "Jane Controller", evidenceStatus: "ATTACHED", evidenceCount: 3, linkedSchedules: [{ type: "CASH", scheduleId: "CM-2026-01", scheduleName: "Cash Schedule Jan 2026", period: "2026-01" }], dependencies: [], order: 1, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-002", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "Intercompany Cash Review", description: "Review intercompany cash movements", status: "APPROVED", priority: "MEDIUM", preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-29", completedAt: "2026-01-28T16:00:00Z", approvedAt: "2026-01-29T10:15:00Z", approvedBy: "Jane Controller", evidenceStatus: "ATTACHED", evidenceCount: 2, linkedSchedules: [], dependencies: ["TSK-001"], order: 2, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-003", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "FX Translation", description: "Calculate FX translation impact", status: "SUBMITTED", priority: "HIGH", preparerId: "U003", preparerName: "Sarah Analyst", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-30", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "PENDING", evidenceCount: 1, linkedSchedules: [], dependencies: ["TSK-001"], order: 3, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-004", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "Cash Variance Analysis", description: "Analyze cash variances vs budget", status: "IN_PROGRESS", priority: "MEDIUM", preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-30", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "MISSING", evidenceCount: 0, linkedSchedules: [{ type: "CASH", scheduleId: "CM-2026-01", scheduleName: "Cash Schedule Jan 2026", period: "2026-01" }], dependencies: ["TSK-001", "TSK-003"], order: 4, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-005", tasklistId: "TL-001", closeScheduleId: "CS-2026-01", name: "Final Cash Sign-off", description: "Final controller review and sign-off", status: "NOT_STARTED", priority: "CRITICAL", preparerId: null, preparerName: null, reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-30", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "MISSING", evidenceCount: 0, linkedSchedules: [], dependencies: ["TSK-004"], order: 5, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
    ];

    // Seed sample close tasks for tasklist TL-003 (Accruals Close)
    const accrualsCloseTasks: CloseTask[] = [
      { id: "TSK-ACC-001", tasklistId: "TL-003", closeScheduleId: "CS-2026-01", name: "Accrued Expenses Review", description: "Review and update accrued expense schedules for utilities, services, and professional fees", status: "APPROVED", priority: "HIGH", preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-27", completedAt: "2026-01-26T14:00:00Z", approvedAt: "2026-01-27T09:00:00Z", approvedBy: "Jane Controller", evidenceStatus: "ATTACHED", evidenceCount: 4, linkedSchedules: [{ type: "ACCRUAL", scheduleId: "ACC-2026-01", scheduleName: "Accruals Schedule Jan 2026", period: "2026-01" }], dependencies: [], order: 1, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-ACC-002", tasklistId: "TL-003", closeScheduleId: "CS-2026-01", name: "Accrued Payroll Reconciliation", description: "Reconcile accrued wages, bonuses, commissions, and payroll taxes", status: "APPROVED", priority: "HIGH", preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-27", completedAt: "2026-01-26T16:00:00Z", approvedAt: "2026-01-27T10:00:00Z", approvedBy: "Jane Controller", evidenceStatus: "ATTACHED", evidenceCount: 3, linkedSchedules: [], dependencies: [], order: 2, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-ACC-003", tasklistId: "TL-003", closeScheduleId: "CS-2026-01", name: "Accrued Interest Calculation", description: "Calculate and record accrued interest on debt instruments", status: "SUBMITTED", priority: "MEDIUM", preparerId: "U003", preparerName: "Sarah Analyst", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-28", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "PENDING", evidenceCount: 2, linkedSchedules: [], dependencies: [], order: 3, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-ACC-004", tasklistId: "TL-003", closeScheduleId: "CS-2026-01", name: "Bonus & Commission Accruals", description: "Calculate period-end bonus and commission accruals based on performance metrics", status: "IN_PROGRESS", priority: "HIGH", preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-28", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "MISSING", evidenceCount: 0, linkedSchedules: [], dependencies: ["TSK-ACC-002"], order: 4, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-ACC-005", tasklistId: "TL-003", closeScheduleId: "CS-2026-01", name: "Accruals Aging Analysis", description: "Review aged accruals and release stale items with proper documentation", status: "NOT_STARTED", priority: "MEDIUM", preparerId: "U002", preparerName: "John Preparer", reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-29", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "MISSING", evidenceCount: 0, linkedSchedules: [], dependencies: ["TSK-ACC-001"], order: 5, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
      { id: "TSK-ACC-006", tasklistId: "TL-003", closeScheduleId: "CS-2026-01", name: "Accruals Sign-off", description: "Final controller review and accruals sign-off", status: "NOT_STARTED", priority: "CRITICAL", preparerId: null, preparerName: null, reviewerId: "U001", reviewerName: "Jane Controller", dueDate: "2026-01-30", completedAt: null, approvedAt: null, approvedBy: null, evidenceStatus: "MISSING", evidenceCount: 0, linkedSchedules: [], dependencies: ["TSK-ACC-004", "TSK-ACC-005"], order: 6, period: "2026-01", createdAt: "2026-01-01T00:00:00Z" },
    ];

    for (const task of [...cashCloseTasks, ...accrualsCloseTasks]) {
      this.closeTasks.set(task.id, task);
    }
  }

  private seedCloseTemplates() {
    const now = new Date().toISOString();
    
    // System Schedule Templates
    const scheduleTemplates: CloseTemplate[] = [
      {
        id: "TPL-MONTH-END-LEAN",
        name: "Lean Month-End Close",
        description: "Streamlined month-end close process with essential tasks only. Best for smaller organizations or interim periods.",
        periodType: "MONTHLY",
        templateType: "SCHEDULE",
        isSystemTemplate: true,
        version: 2,
        taskCount: 24,
        estimatedDays: 5,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-MONTH-END-FULL",
        name: "Full Month-End Close",
        description: "Comprehensive month-end close with all reconciliations, variance analysis, and management reporting.",
        periodType: "MONTHLY",
        templateType: "SCHEDULE",
        isSystemTemplate: true,
        version: 3,
        taskCount: 48,
        estimatedDays: 8,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-QUARTER-END",
        name: "Quarter-End Close",
        description: "Quarterly close template including quarterly adjustments, external reporting, and board packages.",
        periodType: "QUARTERLY",
        templateType: "SCHEDULE",
        isSystemTemplate: true,
        version: 2,
        taskCount: 62,
        estimatedDays: 12,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-YEAR-END",
        name: "Year-End Close",
        description: "Annual close template with year-end adjustments, audit preparation, and regulatory filings.",
        periodType: "YEARLY",
        templateType: "SCHEDULE",
        isSystemTemplate: true,
        version: 1,
        taskCount: 96,
        estimatedDays: 20,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
    ];

    // System Tasklist Templates
    const tasklistTemplates: CloseTemplate[] = [
      {
        id: "TPL-CASH-CLOSE",
        name: "Cash Close Tasklist",
        description: "Bank reconciliations, intercompany cash, FX translation, and cash variance analysis.",
        periodType: "MONTHLY",
        templateType: "TASKLIST",
        isSystemTemplate: true,
        version: 4,
        taskCount: 5,
        estimatedDays: 2,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-REVENUE-CLOSE",
        name: "Revenue Close Tasklist",
        description: "Revenue recognition: contract review, deferred revenue adjustments, ASC 606 compliance.",
        periodType: "MONTHLY",
        templateType: "TASKLIST",
        isSystemTemplate: true,
        version: 3,
        taskCount: 6,
        estimatedDays: 3,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-ACCRUALS-CLOSE",
        name: "Accruals Close Tasklist",
        description: "Expense accruals, payroll accruals, bonus provisions, and aging analysis.",
        periodType: "MONTHLY",
        templateType: "TASKLIST",
        isSystemTemplate: true,
        version: 2,
        taskCount: 4,
        estimatedDays: 2,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-FIXED-ASSETS-CLOSE",
        name: "Fixed Assets Close Tasklist",
        description: "Depreciation run, asset additions/disposals, impairment review, subledger reconciliation.",
        periodType: "MONTHLY",
        templateType: "TASKLIST",
        isSystemTemplate: true,
        version: 2,
        taskCount: 3,
        estimatedDays: 1,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-PREPAIDS-CLOSE",
        name: "Prepaids Close Tasklist",
        description: "Prepaid amortization: schedule review, new prepaid setup, balance reconciliation.",
        periodType: "MONTHLY",
        templateType: "TASKLIST",
        isSystemTemplate: true,
        version: 2,
        taskCount: 4,
        estimatedDays: 1,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-VARIANCE-ANALYSIS",
        name: "Variance Analysis Tasklist",
        description: "Budget vs actual, flux analysis, management commentary, and KPI reporting.",
        periodType: "MONTHLY",
        templateType: "TASKLIST",
        isSystemTemplate: true,
        version: 3,
        taskCount: 4,
        estimatedDays: 2,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-INTERCOMPANY",
        name: "Intercompany Tasklist",
        description: "IC balance matching, elimination entries, and transfer pricing documentation.",
        periodType: "MONTHLY",
        templateType: "TASKLIST",
        isSystemTemplate: true,
        version: 1,
        taskCount: 5,
        estimatedDays: 2,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
      {
        id: "TPL-TAX-PROVISION",
        name: "Tax Provision Tasklist",
        description: "Quarterly tax provision: current/deferred tax, ETR analysis, tax account reconciliation.",
        periodType: "QUARTERLY",
        templateType: "TASKLIST",
        isSystemTemplate: true,
        version: 2,
        taskCount: 6,
        estimatedDays: 3,
        createdAt: "2024-01-15T00:00:00Z",
        createdBy: "System",
        updatedAt: null,
        updatedBy: null,
      },
    ];

    for (const template of [...scheduleTemplates, ...tasklistTemplates]) {
      this.closeTemplates.set(template.id, template);
    }

    // Seed sample tasks for Cash Close template
    const cashCloseTasks: CloseTemplateTask[] = [
      {
        id: "TPLT-CASH-001",
        templateId: "TPL-CASH-CLOSE",
        name: "Bank Reconciliation",
        description: "Complete bank reconciliations for all accounts",
        priority: "HIGH",
        estimatedHours: 4,
        order: 0,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "CASH",
        dueDayOffset: 2,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-CASH-002",
        templateId: "TPL-CASH-CLOSE",
        name: "Intercompany Cash Review",
        description: "Review intercompany cash movements and balances",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 1,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "CASH",
        dueDayOffset: 3,
        dependencies: ["TPLT-CASH-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-CASH-003",
        templateId: "TPL-CASH-CLOSE",
        name: "FX Translation",
        description: "Calculate FX translation impact on cash",
        priority: "HIGH",
        estimatedHours: 3,
        order: 2,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: "CASH",
        dueDayOffset: 3,
        dependencies: ["TPLT-CASH-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-CASH-004",
        templateId: "TPL-CASH-CLOSE",
        name: "Cash Variance Analysis",
        description: "Analyze cash variances vs budget and prior period",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 3,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "CASH",
        dueDayOffset: 4,
        dependencies: ["TPLT-CASH-001", "TPLT-CASH-003"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-CASH-005",
        templateId: "TPL-CASH-CLOSE",
        name: "Final Cash Sign-off",
        description: "Final controller review and sign-off",
        priority: "CRITICAL",
        estimatedHours: 1,
        order: 4,
        defaultPreparerRole: null,
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: "CASH",
        dueDayOffset: 5,
        dependencies: ["TPLT-CASH-004"],
        createdAt: now,
        updatedAt: null,
      },
    ];

    for (const task of cashCloseTasks) {
      this.closeTemplateTasks.set(task.id, task);
    }

    // Seed sample tasks for Revenue Close template
    const revenueCloseTasks: CloseTemplateTask[] = [
      {
        id: "TPLT-REV-001",
        templateId: "TPL-REVENUE-CLOSE",
        name: "Contract Review",
        description: "Review new and modified contracts for revenue recognition",
        priority: "HIGH",
        estimatedHours: 4,
        order: 0,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "REVENUE",
        dueDayOffset: 1,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-REV-002",
        templateId: "TPL-REVENUE-CLOSE",
        name: "Deferred Revenue Roll",
        description: "Roll deferred revenue schedules and verify balances",
        priority: "HIGH",
        estimatedHours: 3,
        order: 1,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "REVENUE",
        dueDayOffset: 2,
        dependencies: ["TPLT-REV-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-REV-003",
        templateId: "TPL-REVENUE-CLOSE",
        name: "ASC 606 Compliance Check",
        description: "Verify compliance with ASC 606 requirements",
        priority: "CRITICAL",
        estimatedHours: 2,
        order: 2,
        defaultPreparerRole: "REVIEWER",
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: "REVENUE",
        dueDayOffset: 3,
        dependencies: ["TPLT-REV-002"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-REV-004",
        templateId: "TPL-REVENUE-CLOSE",
        name: "Revenue Variance Analysis",
        description: "Analyze revenue variances and prepare management commentary",
        priority: "MEDIUM",
        estimatedHours: 3,
        order: 3,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "REVENUE",
        dueDayOffset: 4,
        dependencies: ["TPLT-REV-002"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-REV-005",
        templateId: "TPL-REVENUE-CLOSE",
        name: "Contract Asset/Liability Reconciliation",
        description: "Reconcile contract assets and liabilities to GL",
        priority: "HIGH",
        estimatedHours: 2,
        order: 4,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "REVENUE",
        dueDayOffset: 4,
        dependencies: ["TPLT-REV-002"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-REV-006",
        templateId: "TPL-REVENUE-CLOSE",
        name: "Revenue Sign-off",
        description: "Final controller review and revenue sign-off",
        priority: "CRITICAL",
        estimatedHours: 1,
        order: 5,
        defaultPreparerRole: null,
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: "REVENUE",
        dueDayOffset: 5,
        dependencies: ["TPLT-REV-003", "TPLT-REV-004", "TPLT-REV-005"],
        createdAt: now,
        updatedAt: null,
      },
    ];

    for (const task of revenueCloseTasks) {
      this.closeTemplateTasks.set(task.id, task);
    }

    // Seed tasks for Accruals Close template
    const accrualsCloseTasks: CloseTemplateTask[] = [
      {
        id: "TPLT-ACC-001",
        templateId: "TPL-ACCRUALS-CLOSE",
        name: "Accrued Expenses Review",
        description: "Review and update accrued expense schedules for utilities, services, and professional fees",
        priority: "HIGH",
        estimatedHours: 3,
        order: 0,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "ACCRUAL",
        dueDayOffset: 2,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-ACC-002",
        templateId: "TPL-ACCRUALS-CLOSE",
        name: "Accrued Payroll Reconciliation",
        description: "Reconcile accrued wages, bonuses, commissions, and payroll taxes",
        priority: "HIGH",
        estimatedHours: 4,
        order: 1,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "ACCRUAL",
        dueDayOffset: 2,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-ACC-003",
        templateId: "TPL-ACCRUALS-CLOSE",
        name: "Accrued Interest Calculation",
        description: "Calculate and record accrued interest on debt instruments",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 2,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "ACCRUAL",
        dueDayOffset: 3,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-ACC-004",
        templateId: "TPL-ACCRUALS-CLOSE",
        name: "Bonus & Commission Accruals",
        description: "Calculate period-end bonus and commission accruals based on performance metrics",
        priority: "HIGH",
        estimatedHours: 3,
        order: 3,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: "ACCRUAL",
        dueDayOffset: 3,
        dependencies: ["TPLT-ACC-002"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-ACC-005",
        templateId: "TPL-ACCRUALS-CLOSE",
        name: "Accruals Aging Analysis",
        description: "Review aged accruals and release stale items with proper documentation",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 4,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "ACCRUAL",
        dueDayOffset: 4,
        dependencies: ["TPLT-ACC-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-ACC-006",
        templateId: "TPL-ACCRUALS-CLOSE",
        name: "Accruals Sign-off",
        description: "Final controller review and accruals sign-off",
        priority: "CRITICAL",
        estimatedHours: 1,
        order: 5,
        defaultPreparerRole: null,
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: "ACCRUAL",
        dueDayOffset: 5,
        dependencies: ["TPLT-ACC-004", "TPLT-ACC-005"],
        createdAt: now,
        updatedAt: null,
      },
    ];

    for (const task of accrualsCloseTasks) {
      this.closeTemplateTasks.set(task.id, task);
    }

    // Seed tasks for Fixed Assets Close template
    const fixedAssetsCloseTasks: CloseTemplateTask[] = [
      {
        id: "TPLT-FA-001",
        templateId: "TPL-FIXED-ASSETS-CLOSE",
        name: "Depreciation Run",
        description: "Execute monthly depreciation calculation and post journal entries",
        priority: "HIGH",
        estimatedHours: 2,
        order: 0,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "FIXED_ASSET",
        dueDayOffset: 1,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-FA-002",
        templateId: "TPL-FIXED-ASSETS-CLOSE",
        name: "Asset Additions Review",
        description: "Review new asset additions for proper capitalization and useful life assignment",
        priority: "HIGH",
        estimatedHours: 3,
        order: 1,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "FIXED_ASSET",
        dueDayOffset: 2,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-FA-003",
        templateId: "TPL-FIXED-ASSETS-CLOSE",
        name: "Asset Disposals & Retirements",
        description: "Process asset disposals, calculate gain/loss, and update registers",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 2,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "FIXED_ASSET",
        dueDayOffset: 2,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-FA-004",
        templateId: "TPL-FIXED-ASSETS-CLOSE",
        name: "CIP Transfer Review",
        description: "Review construction-in-progress for items ready to be placed in service",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 3,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "FIXED_ASSET",
        dueDayOffset: 3,
        dependencies: ["TPLT-FA-002"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-FA-005",
        templateId: "TPL-FIXED-ASSETS-CLOSE",
        name: "Subledger to GL Reconciliation",
        description: "Reconcile fixed asset subledger to general ledger balances",
        priority: "HIGH",
        estimatedHours: 2,
        order: 4,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "FIXED_ASSET",
        dueDayOffset: 4,
        dependencies: ["TPLT-FA-001", "TPLT-FA-003"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-FA-006",
        templateId: "TPL-FIXED-ASSETS-CLOSE",
        name: "Fixed Assets Sign-off",
        description: "Final controller review and fixed assets sign-off",
        priority: "CRITICAL",
        estimatedHours: 1,
        order: 5,
        defaultPreparerRole: null,
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: "FIXED_ASSET",
        dueDayOffset: 5,
        dependencies: ["TPLT-FA-005"],
        createdAt: now,
        updatedAt: null,
      },
    ];

    for (const task of fixedAssetsCloseTasks) {
      this.closeTemplateTasks.set(task.id, task);
    }

    // Seed tasks for Prepaids Close template
    const prepaidsCloseTasks: CloseTemplateTask[] = [
      {
        id: "TPLT-PP-001",
        templateId: "TPL-PREPAIDS-CLOSE",
        name: "Prepaid Amortization Run",
        description: "Execute prepaid amortization schedules and post monthly expense",
        priority: "HIGH",
        estimatedHours: 2,
        order: 0,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "PREPAID",
        dueDayOffset: 1,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-PP-002",
        templateId: "TPL-PREPAIDS-CLOSE",
        name: "New Prepaid Setup",
        description: "Set up new prepaids from AP invoices and configure amortization schedules",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 1,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "PREPAID",
        dueDayOffset: 2,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-PP-003",
        templateId: "TPL-PREPAIDS-CLOSE",
        name: "Insurance Prepaid Review",
        description: "Review insurance policies and verify amortization matches coverage periods",
        priority: "HIGH",
        estimatedHours: 2,
        order: 2,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "PREPAID",
        dueDayOffset: 2,
        dependencies: ["TPLT-PP-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-PP-004",
        templateId: "TPL-PREPAIDS-CLOSE",
        name: "Software & License Review",
        description: "Review software licenses and subscription prepaids for proper amortization",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 3,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "PREPAID",
        dueDayOffset: 3,
        dependencies: ["TPLT-PP-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-PP-005",
        templateId: "TPL-PREPAIDS-CLOSE",
        name: "Prepaid Balance Reconciliation",
        description: "Reconcile prepaid schedules to GL balances and investigate variances",
        priority: "HIGH",
        estimatedHours: 2,
        order: 4,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: "PREPAID",
        dueDayOffset: 4,
        dependencies: ["TPLT-PP-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-PP-006",
        templateId: "TPL-PREPAIDS-CLOSE",
        name: "Prepaids Sign-off",
        description: "Final controller review and prepaids sign-off",
        priority: "CRITICAL",
        estimatedHours: 1,
        order: 5,
        defaultPreparerRole: null,
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: "PREPAID",
        dueDayOffset: 5,
        dependencies: ["TPLT-PP-005"],
        createdAt: now,
        updatedAt: null,
      },
    ];

    for (const task of prepaidsCloseTasks) {
      this.closeTemplateTasks.set(task.id, task);
    }

    // Seed tasks for Variance Analysis template
    const varianceAnalysisTasks: CloseTemplateTask[] = [
      {
        id: "TPLT-VAR-001",
        templateId: "TPL-VARIANCE-ANALYSIS",
        name: "Budget vs Actual Analysis",
        description: "Prepare budget to actual comparison for all P&L line items",
        priority: "HIGH",
        estimatedHours: 4,
        order: 0,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 3,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-VAR-002",
        templateId: "TPL-VARIANCE-ANALYSIS",
        name: "Period-over-Period Flux",
        description: "Analyze month-over-month and year-over-year changes",
        priority: "HIGH",
        estimatedHours: 3,
        order: 1,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 3,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-VAR-003",
        templateId: "TPL-VARIANCE-ANALYSIS",
        name: "Management Commentary",
        description: "Draft variance explanations and management discussion for leadership",
        priority: "MEDIUM",
        estimatedHours: 3,
        order: 2,
        defaultPreparerRole: "REVIEWER",
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: null,
        dueDayOffset: 4,
        dependencies: ["TPLT-VAR-001", "TPLT-VAR-002"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-VAR-004",
        templateId: "TPL-VARIANCE-ANALYSIS",
        name: "KPI Dashboard Update",
        description: "Update key performance indicators and financial metrics dashboard",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 3,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 4,
        dependencies: ["TPLT-VAR-001"],
        createdAt: now,
        updatedAt: null,
      },
    ];

    for (const task of varianceAnalysisTasks) {
      this.closeTemplateTasks.set(task.id, task);
    }

    // Seed tasks for Intercompany template
    const intercompanyTasks: CloseTemplateTask[] = [
      {
        id: "TPLT-IC-001",
        templateId: "TPL-INTERCOMPANY",
        name: "IC Balance Matching",
        description: "Match intercompany balances between entities and identify discrepancies",
        priority: "HIGH",
        estimatedHours: 4,
        order: 0,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 2,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-IC-002",
        templateId: "TPL-INTERCOMPANY",
        name: "IC Discrepancy Resolution",
        description: "Investigate and resolve intercompany balance discrepancies",
        priority: "HIGH",
        estimatedHours: 3,
        order: 1,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 3,
        dependencies: ["TPLT-IC-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-IC-003",
        templateId: "TPL-INTERCOMPANY",
        name: "Elimination Entries",
        description: "Prepare and post intercompany elimination entries for consolidation",
        priority: "CRITICAL",
        estimatedHours: 3,
        order: 2,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: null,
        dueDayOffset: 4,
        dependencies: ["TPLT-IC-002"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-IC-004",
        templateId: "TPL-INTERCOMPANY",
        name: "Transfer Pricing Documentation",
        description: "Review transfer pricing calculations and update documentation",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 3,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 4,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-IC-005",
        templateId: "TPL-INTERCOMPANY",
        name: "IC Sign-off",
        description: "Final controller review and intercompany sign-off",
        priority: "CRITICAL",
        estimatedHours: 1,
        order: 4,
        defaultPreparerRole: null,
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: null,
        dueDayOffset: 5,
        dependencies: ["TPLT-IC-003"],
        createdAt: now,
        updatedAt: null,
      },
    ];

    for (const task of intercompanyTasks) {
      this.closeTemplateTasks.set(task.id, task);
    }

    // Seed tasks for Tax Provision template
    const taxProvisionTasks: CloseTemplateTask[] = [
      {
        id: "TPLT-TAX-001",
        templateId: "TPL-TAX-PROVISION",
        name: "Current Tax Calculation",
        description: "Calculate current period income tax expense based on taxable income",
        priority: "HIGH",
        estimatedHours: 4,
        order: 0,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 3,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-TAX-002",
        templateId: "TPL-TAX-PROVISION",
        name: "Deferred Tax Analysis",
        description: "Analyze and update deferred tax assets and liabilities",
        priority: "HIGH",
        estimatedHours: 4,
        order: 1,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 4,
        dependencies: ["TPLT-TAX-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-TAX-003",
        templateId: "TPL-TAX-PROVISION",
        name: "ETR Analysis & Reconciliation",
        description: "Calculate effective tax rate and reconcile to statutory rate",
        priority: "HIGH",
        estimatedHours: 3,
        order: 2,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: null,
        dueDayOffset: 5,
        dependencies: ["TPLT-TAX-001", "TPLT-TAX-002"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-TAX-004",
        templateId: "TPL-TAX-PROVISION",
        name: "Tax Account Reconciliation",
        description: "Reconcile all tax-related balance sheet accounts",
        priority: "MEDIUM",
        estimatedHours: 2,
        order: 3,
        defaultPreparerRole: "PREPARER",
        defaultReviewerRole: "REVIEWER",
        linkedScheduleType: null,
        dueDayOffset: 5,
        dependencies: ["TPLT-TAX-001"],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-TAX-005",
        templateId: "TPL-TAX-PROVISION",
        name: "Uncertain Tax Positions Review",
        description: "Review and update uncertain tax position reserves (FIN 48)",
        priority: "HIGH",
        estimatedHours: 2,
        order: 4,
        defaultPreparerRole: "REVIEWER",
        defaultReviewerRole: "CONTROLLER",
        linkedScheduleType: null,
        dueDayOffset: 6,
        dependencies: [],
        createdAt: now,
        updatedAt: null,
      },
      {
        id: "TPLT-TAX-006",
        templateId: "TPL-TAX-PROVISION",
        name: "Tax Provision Sign-off",
        description: "Final controller/CFO review and tax provision sign-off",
        priority: "CRITICAL",
        estimatedHours: 1,
        order: 5,
        defaultPreparerRole: null,
        defaultReviewerRole: "CFO",
        linkedScheduleType: null,
        dueDayOffset: 7,
        dependencies: ["TPLT-TAX-003", "TPLT-TAX-005"],
        createdAt: now,
        updatedAt: null,
      },
    ];

    for (const task of taxProvisionTasks) {
      this.closeTemplateTasks.set(task.id, task);
    }
  }

  private seedReconciliationData() {
    const now = new Date().toISOString();
    
    // Seed Reconciliation Templates
    const templates: ReconciliationTemplate[] = [
      {
        templateId: "RTPL-CASH-SINGLE",
        name: "Cash - Single Bank Account (Same Currency)",
        description: "Standard bank reconciliation for single currency, single bank account. For monetary accounts with FX revaluation.",
        accountTypes: ["CASH"],
        monetaryType: "MONETARY",
        fxApplicable: true,
        templateVariant: "SINGLE_BANK_SAME_CCY",
        sections: [
          { sectionId: "S1", sectionType: "BANK_TRANSACTIONS", name: "Bank Account", description: "Bank account details, currency, and period-end balance", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "BANK_NOT_IN_GL", name: "Items in Bank, Not in GL", description: "Deposits in transit, bank fees, interest, timing differences", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "GL_NOT_IN_BANK", name: "Items in GL, Not in Bank", description: "Outstanding cheques, pending payments, recording errors", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "FX_REVALUATION", name: "FX Revaluation", description: "Currency-driven balance movements from period-end revaluation", sortOrder: 4, isRequired: true, fields: [] },
          { sectionId: "S5", sectionType: "CLOSING_BALANCE", name: "Summary & Tie-Out", description: "Bank Balance ± Reconciling Items ± FX = GL Balance", sortOrder: 5, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      {
        templateId: "RTPL-CASH-MULTI-SAME",
        name: "Cash - Multiple Banks (Same Currency)",
        description: "Bank reconciliation for multiple bank accounts in the same currency with consolidated FX revaluation.",
        accountTypes: ["CASH"],
        monetaryType: "MONETARY",
        fxApplicable: true,
        templateVariant: "MULTI_BANK_SAME_CCY",
        sections: [
          { sectionId: "S1", sectionType: "SUBLEDGER_DETAIL", name: "Bank Account Summary", description: "List of all bank accounts with individual balances", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "BANK_NOT_IN_GL", name: "Items in Bank, Not in GL", description: "Deposits in transit, bank fees by account", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "GL_NOT_IN_BANK", name: "Items in GL, Not in Bank", description: "Outstanding cheques, pending payments by account", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "FX_REVALUATION", name: "FX Revaluation", description: "Aggregated FX revaluation impact", sortOrder: 4, isRequired: true, fields: [] },
          { sectionId: "S5", sectionType: "CLOSING_BALANCE", name: "Summary & Tie-Out", description: "Total Bank Balance ± Reconciling Items ± FX = GL Balance", sortOrder: 5, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      {
        templateId: "RTPL-CASH-MULTI-DIFF",
        name: "Cash - Multiple Banks (Different Currencies)",
        description: "Bank reconciliation for multinational cash structures with multiple currencies and per-account FX rates.",
        accountTypes: ["CASH"],
        monetaryType: "MONETARY",
        fxApplicable: true,
        templateVariant: "MULTI_BANK_DIFF_CCY",
        sections: [
          { sectionId: "S1", sectionType: "SUBLEDGER_DETAIL", name: "Bank Account Summary", description: "Bank accounts with currency, FX rate, and local/reporting balances", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "BANK_NOT_IN_GL", name: "Items in Bank, Not in GL", description: "Deposits in transit, fees by bank account (currency-agnostic)", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "GL_NOT_IN_BANK", name: "Items in GL, Not in Bank", description: "Outstanding cheques, pending payments (currency-agnostic)", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "FX_REVALUATION", name: "FX Revaluation", description: "Aggregated FX revaluation from all currency conversions", sortOrder: 4, isRequired: true, fields: [] },
          { sectionId: "S5", sectionType: "CLOSING_BALANCE", name: "Summary & Tie-Out", description: "Total Bank Balances (in reporting ccy) ± Items ± FX = GL Balance", sortOrder: 5, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      {
        templateId: "RTPL-PREPAID",
        name: "Prepaid Expenses",
        description: "Prepaid expense schedule reconciliation with amortization rollforward",
        accountTypes: ["PREPAID"],
        monetaryType: "NON_MONETARY",
        fxApplicable: false,
        sections: [
          { sectionId: "S1", sectionType: "OPENING_BALANCE", name: "Opening Balance", description: "Beginning prepaid balance", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "ADDITIONS", name: "Additions", description: "New prepaid items added during period", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "ADJUSTMENTS", name: "Amortization", description: "Amortization expense for the period", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "SUBLEDGER_DETAIL", name: "Schedule Detail", description: "Link to prepaid schedule for supporting detail", sortOrder: 4, isRequired: true, fields: [] },
          { sectionId: "S5", sectionType: "CLOSING_BALANCE", name: "Closing Balance", description: "Ending prepaid balance", sortOrder: 5, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      // Prepaid Schedule-Anchored Template (V1)
      {
        templateId: "RTPL-PREPAID-SCHEDULE",
        name: "Prepaid Expenses (Schedule-Anchored)",
        description: "Schedule-first prepaid reconciliation where approved schedules serve as supporting evidence. No month-by-month grid - just summary per prepaid with automatic rollforward from linked schedules.",
        accountTypes: ["PREPAID"],
        monetaryType: "NON_MONETARY",
        fxApplicable: false,
        templateVariant: "PREPAID_SCHEDULE_ANCHORED",
        sections: [
          { sectionId: "S1", sectionType: "SUBLEDGER_DETAIL", name: "Prepaid Schedules", description: "One row per approved prepaid schedule showing description, vendor, term, amounts amortized and remaining. Click to view schedule pop-out.", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "SUMMARY_TIE_OUT", name: "Summary & Tie-Out", description: "Total 'Amount Remaining' across all lines = Prepaid balance in trial balance", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "SUPPORTING_DOCUMENTATION", name: "Attachments & Evidence", description: "Vendor invoices, contracts - line-level and locked upon certification", sortOrder: 3, isRequired: false, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      {
        templateId: "RTPL-FIXED-ASSET",
        name: "Fixed Assets",
        description: "Fixed asset rollforward with additions, disposals, and depreciation",
        accountTypes: ["FIXED_ASSET"],
        monetaryType: "NON_MONETARY",
        fxApplicable: false,
        sections: [
          { sectionId: "S1", sectionType: "OPENING_BALANCE", name: "Opening NBV", description: "Net book value at period start", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "ADDITIONS", name: "Additions", description: "Capital expenditures and acquisitions", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "DISPOSALS", name: "Disposals", description: "Asset disposals and retirements", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "ADJUSTMENTS", name: "Depreciation", description: "Depreciation expense for the period", sortOrder: 4, isRequired: true, fields: [] },
          { sectionId: "S5", sectionType: "ADJUSTMENTS", name: "Impairment", description: "Impairment charges if any", sortOrder: 5, isRequired: false, fields: [] },
          { sectionId: "S6", sectionType: "CLOSING_BALANCE", name: "Closing NBV", description: "Net book value at period end", sortOrder: 6, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      {
        templateId: "RTPL-ACCRUAL",
        name: "Accrued Expenses (Simple)",
        description: "Simple accrual rollforward with additions and releases",
        accountTypes: ["ACCRUAL"],
        monetaryType: "MONETARY",
        fxApplicable: true,
        sections: [
          { sectionId: "S1", sectionType: "OPENING_BALANCE", name: "Opening Balance", description: "Accrued expenses at period start", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "ADDITIONS", name: "New Accruals", description: "Accruals recorded during period", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "ADJUSTMENTS", name: "Releases/Payments", description: "Accruals released or paid", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "VARIANCE_ANALYSIS", name: "Aging Analysis", description: "Analysis of aged accruals", sortOrder: 4, isRequired: true, fields: [] },
          { sectionId: "S5", sectionType: "CLOSING_BALANCE", name: "Closing Balance", description: "Ending accrued balance", sortOrder: 5, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      // Accrual 12-Month Rollforward Template (ERP-Aligned FX)
      {
        templateId: "RTPL-ACCRUAL-12M",
        name: "Accrued Expenses (12-Month Rollforward)",
        description: "Balance sheet reconciliation with 12-month horizontal view, line-based accrual tracking, and ERP-aligned FX validation. FX is validated, not calculated.",
        accountTypes: ["ACCRUAL"],
        monetaryType: "MONETARY",
        fxApplicable: true,
        templateVariant: "ACCRUAL_12M_ROLLFORWARD",
        sections: [
          { sectionId: "S1", sectionType: "ACCRUAL_LINE_DETAIL", name: "Accrual Lines", description: "Individual accrual lines with 12-month movements. Each row shows opening balance, monthly accruals, and ending balance in transaction currency.", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "FX_EXCEPTION", name: "FX Exceptions", description: "FX difference lines - only shown when converted balance ≠ trial balance or ERP FX rate requires investigation. Hidden when reconciliation ties cleanly.", sortOrder: 2, isRequired: false, fields: [] },
          { sectionId: "S3", sectionType: "SUMMARY_TIE_OUT", name: "Summary & Tie-Out", description: "Opening Balance (TC) + Monthly Movements (TC) = Ending Balance (TC). Ending Balance (TC) × ERP FX Rate = Trial Balance.", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "SUPPORTING_DOCUMENTATION", name: "Attachments & Evidence", description: "Contracts, invoices, accrual calculations - locked on certification", sortOrder: 4, isRequired: false, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      {
        templateId: "RTPL-AR",
        name: "Accounts Receivable",
        description: "AR reconciliation with aging and allowance analysis",
        accountTypes: ["ACCOUNTS_RECEIVABLE"],
        monetaryType: "MONETARY",
        fxApplicable: true,
        sections: [
          { sectionId: "S1", sectionType: "OPENING_BALANCE", name: "Opening Balance", description: "AR balance at period start", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "ADDITIONS", name: "Sales/Billings", description: "New receivables from sales", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "ADJUSTMENTS", name: "Collections", description: "Cash received from customers", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "ADJUSTMENTS", name: "Bad Debt", description: "Write-offs and allowance adjustments", sortOrder: 4, isRequired: false, fields: [] },
          { sectionId: "S5", sectionType: "SUBLEDGER_DETAIL", name: "Aging Schedule", description: "AR aging analysis", sortOrder: 5, isRequired: true, fields: [] },
          { sectionId: "S6", sectionType: "CLOSING_BALANCE", name: "Closing Balance", description: "Ending AR balance", sortOrder: 6, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      {
        templateId: "RTPL-AP",
        name: "Accounts Payable",
        description: "AP reconciliation with vendor analysis",
        accountTypes: ["ACCOUNTS_PAYABLE"],
        monetaryType: "MONETARY",
        fxApplicable: true,
        sections: [
          { sectionId: "S1", sectionType: "OPENING_BALANCE", name: "Opening Balance", description: "AP balance at period start", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "ADDITIONS", name: "Invoices Received", description: "New payables from vendor invoices", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "ADJUSTMENTS", name: "Payments", description: "Payments made to vendors", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "SUBLEDGER_DETAIL", name: "Vendor Detail", description: "Top vendors and aging", sortOrder: 4, isRequired: true, fields: [] },
          { sectionId: "S5", sectionType: "CLOSING_BALANCE", name: "Closing Balance", description: "Ending AP balance", sortOrder: 5, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
      {
        templateId: "RTPL-INTERCO",
        name: "Intercompany",
        description: "Intercompany balance reconciliation with counterparty confirmation",
        accountTypes: ["INTERCOMPANY"],
        monetaryType: "MONETARY",
        fxApplicable: true,
        sections: [
          { sectionId: "S1", sectionType: "SUBLEDGER_DETAIL", name: "Counterparty Balances", description: "Balance by intercompany counterparty", sortOrder: 1, isRequired: true, fields: [] },
          { sectionId: "S2", sectionType: "VARIANCE_ANALYSIS", name: "Reconciliation Differences", description: "Differences vs counterparty records", sortOrder: 2, isRequired: true, fields: [] },
          { sectionId: "S3", sectionType: "SUPPORTING_DOCUMENTATION", name: "Confirmations", description: "Counterparty balance confirmations", sortOrder: 3, isRequired: true, fields: [] },
          { sectionId: "S4", sectionType: "CLOSING_BALANCE", name: "Net Position", description: "Net intercompany position", sortOrder: 4, isRequired: true, fields: [] },
        ],
        isSystemTemplate: true,
        isActive: true,
        createdAt: now,
        createdBy: "System",
        updatedAt: now,
      },
    ];

    for (const tpl of templates) {
      this.reconciliationTemplates.set(tpl.templateId, tpl);
    }

    // Seed Reconciliation Accounts with accountGroup for 3-tier hierarchy
    const accounts: ReconciliationAccount[] = [
      { accountId: "ACCT-1010", accountCode: "1010", accountName: "Cash - Operating Account", accountType: "CASH", accountGroup: "OPERATING_CASH", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-CASH-SINGLE", isActive: true, createdAt: now },
      { accountId: "ACCT-1020", accountCode: "1020", accountName: "Cash - Payroll Account", accountType: "CASH", accountGroup: "OPERATING_CASH", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-CASH-SINGLE", isActive: true, createdAt: now },
      { accountId: "ACCT-1030", accountCode: "1030", accountName: "Cash - Restricted Escrow", accountType: "CASH", accountGroup: "RESTRICTED_CASH", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-CASH-SINGLE", isActive: true, createdAt: now },
      { accountId: "ACCT-1100", accountCode: "1100", accountName: "Trade Accounts Receivable", accountType: "ACCOUNTS_RECEIVABLE", accountGroup: "TRADE_RECEIVABLES", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-AR", isActive: true, createdAt: now },
      { accountId: "ACCT-1110", accountCode: "1110", accountName: "Employee Advances", accountType: "ACCOUNTS_RECEIVABLE", accountGroup: "OTHER_RECEIVABLES", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-AR", isActive: true, createdAt: now },
      { accountId: "ACCT-1200", accountCode: "1200", accountName: "Prepaid Insurance", accountType: "PREPAID", accountGroup: "SHORT_TERM_PREPAIDS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-PREPAID", isActive: true, createdAt: now },
      { accountId: "ACCT-1210", accountCode: "1210", accountName: "Prepaid Rent", accountType: "PREPAID", accountGroup: "SHORT_TERM_PREPAIDS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-PREPAID", isActive: true, createdAt: now },
      { accountId: "ACCT-1220", accountCode: "1220", accountName: "Prepaid Software", accountType: "PREPAID", accountGroup: "SHORT_TERM_PREPAIDS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-PREPAID", isActive: true, createdAt: now },
      { accountId: "ACCT-1230", accountCode: "1230", accountName: "Long-term Deposits", accountType: "PREPAID", accountGroup: "LONG_TERM_PREPAIDS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-PREPAID", isActive: true, createdAt: now },
      { accountId: "ACCT-1500", accountCode: "1500", accountName: "Equipment", accountType: "FIXED_ASSET", accountGroup: "EQUIPMENT", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-FIXED-ASSET", isActive: true, createdAt: now },
      { accountId: "ACCT-1510", accountCode: "1510", accountName: "Furniture & Fixtures", accountType: "FIXED_ASSET", accountGroup: "EQUIPMENT", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-FIXED-ASSET", isActive: true, createdAt: now },
      { accountId: "ACCT-1520", accountCode: "1520", accountName: "Buildings", accountType: "FIXED_ASSET", accountGroup: "LAND_AND_BUILDINGS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-FIXED-ASSET", isActive: true, createdAt: now },
      { accountId: "ACCT-1600", accountCode: "1600", accountName: "Accumulated Depreciation", accountType: "FIXED_ASSET", accountGroup: "ACCUMULATED_DEPRECIATION", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-FIXED-ASSET", isActive: true, createdAt: now },
      { accountId: "ACCT-2000", accountCode: "2000", accountName: "Trade Accounts Payable", accountType: "ACCOUNTS_PAYABLE", accountGroup: "TRADE_PAYABLES", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-AP", isActive: true, createdAt: now },
      { accountId: "ACCT-2010", accountCode: "2010", accountName: "Other Payables", accountType: "ACCOUNTS_PAYABLE", accountGroup: "OTHER_PAYABLES", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-AP", isActive: true, createdAt: now },
      { accountId: "ACCT-2100", accountCode: "2100", accountName: "Accrued Expenses", accountType: "ACCRUAL", accountGroup: "OTHER_ACCRUALS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-ACCRUAL", isActive: true, createdAt: now },
      { accountId: "ACCT-2110", accountCode: "2110", accountName: "Accrued Payroll", accountType: "ACCRUAL", accountGroup: "COMPENSATION_ACCRUALS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-ACCRUAL", isActive: true, createdAt: now },
      { accountId: "ACCT-2120", accountCode: "2120", accountName: "Accrued Taxes", accountType: "ACCRUAL", accountGroup: "TAX_ACCRUALS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-ACCRUAL", isActive: true, createdAt: now },
      { accountId: "ACCT-2200", accountCode: "2200", accountName: "Intercompany - US Sub Receivable", accountType: "INTERCOMPANY", accountGroup: "IC_RECEIVABLES", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-INTERCO", isActive: true, createdAt: now },
      { accountId: "ACCT-2210", accountCode: "2210", accountName: "Intercompany - EU Sub Payable", accountType: "INTERCOMPANY", accountGroup: "IC_PAYABLES", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-INTERCO", isActive: true, createdAt: now },
      { accountId: "ACCT-2300", accountCode: "2300", accountName: "Short-term Notes Payable", accountType: "DEBT", accountGroup: "SHORT_TERM_DEBT", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-INTERCO", isActive: true, createdAt: now },
      { accountId: "ACCT-2400", accountCode: "2400", accountName: "Long-term Debt", accountType: "DEBT", accountGroup: "LONG_TERM_DEBT", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-INTERCO", isActive: true, createdAt: now },
      { accountId: "ACCT-3000", accountCode: "3000", accountName: "Common Stock", accountType: "EQUITY", accountGroup: "CAPITAL_STOCK", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-INTERCO", isActive: true, createdAt: now },
      { accountId: "ACCT-3100", accountCode: "3100", accountName: "Retained Earnings", accountType: "EQUITY", accountGroup: "RETAINED_EARNINGS", entityId: "CORP-001", currency: "USD", defaultTemplateId: "RTPL-INTERCO", isActive: true, createdAt: now },
    ];

    for (const acct of accounts) {
      this.reconciliationAccounts.set(acct.accountId, acct);
    }

    // Helper function to create default line item with new required fields
    const makeLineItem = (
      itemId: string,
      description: string,
      amount: number,
      opts?: {
        reference?: string | null;
        date?: string | null;
        notes?: string | null;
        itemType?: ReconciliationLineItem["itemType"];
        itemNature?: ReconciliationLineItem["itemNature"];
        itemStatus?: ReconciliationLineItem["itemStatus"];
        bankAccountId?: string | null;
      }
    ): ReconciliationLineItem => ({
      itemId,
      description,
      amount,
      reference: opts?.reference ?? null,
      date: opts?.date ?? null,
      notes: opts?.notes ?? null,
      attachmentIds: [],
      itemType: opts?.itemType ?? null,
      itemNature: opts?.itemNature ?? null,
      itemStatus: opts?.itemStatus ?? "OPEN",
      customTags: [],
      bankAccountId: opts?.bankAccountId ?? null,
      accrualDetail: null,
      prepaidDetail: null,
      createdAt: now,
      createdBy: "System",
    });

    // Seed sample reconciliations for current period
    const reconciliations: Reconciliation[] = [
      {
        reconciliationId: "REC-1010-2026-01",
        accountId: "ACCT-1010",
        templateId: "RTPL-CASH-SINGLE",
        period: "2026-01",
        status: "APPROVED",
        glBalance: 1250000,
        reconciledBalance: 1250000,
        variance: 0,
        sections: [
          { sectionId: "S1", templateSectionId: "S1", name: "Bank Account", sectionType: "BANK_TRANSACTIONS", sortOrder: 1, isComplete: true, items: [makeLineItem("I1", "First National Bank - Operating", 1285000, { reference: "Stmt #12345", date: "2026-01-31" })], subtotal: 1285000 },
          { sectionId: "S2", templateSectionId: "S2", name: "Items in Bank, Not in GL", sectionType: "BANK_NOT_IN_GL", sortOrder: 2, isComplete: true, items: [makeLineItem("I2", "Deposit in transit", 25000, { reference: "DEP-001", date: "2026-01-30", itemType: "DEPOSIT", itemNature: "EXPECTED" })], subtotal: 25000 },
          { sectionId: "S3", templateSectionId: "S3", name: "Items in GL, Not in Bank", sectionType: "GL_NOT_IN_BANK", sortOrder: 3, isComplete: true, items: [makeLineItem("I3", "Check #4521", -35000, { reference: "CHK-4521", date: "2026-01-28", itemType: "CHEQUE", itemNature: "EXPECTED" }), makeLineItem("I4", "Check #4522", -25000, { reference: "CHK-4522", date: "2026-01-29", itemType: "CHEQUE", itemNature: "EXPECTED" })], subtotal: -60000 },
          { sectionId: "S4", templateSectionId: "S4", name: "FX Revaluation", sectionType: "FX_REVALUATION", sortOrder: 4, isComplete: true, items: [], subtotal: 0 },
          { sectionId: "S5", templateSectionId: "S5", name: "Summary & Tie-Out", sectionType: "CLOSING_BALANCE", sortOrder: 5, isComplete: true, items: [makeLineItem("I5", "Reconciled balance", 1250000)], subtotal: 1250000 },
        ],
        reportingCurrency: "USD",
        bankAccounts: [{ bankAccountId: "BA-001", bankName: "First National Bank", accountNumber: "****1234", currency: "USD", periodEndBalance: 1285000, fxRate: 1.0, fxRateSource: "SYSTEM", balanceInReportingCurrency: 1285000 }],
        totalBankBalance: 1285000,
        fxRevaluationAmount: 0,
        fxRevaluationManualAdj: 0,
        reconciliationEquation: { bankBalance: 1285000, reconciliingItems: -35000, fxRevaluation: 0, glBalance: 1250000, difference: 0 },
        preparedBy: "John Preparer",
        preparedAt: "2026-01-28T14:00:00Z",
        reviewedBy: "Jane Controller",
        reviewedAt: "2026-01-29T10:00:00Z",
        approvedBy: "Jane Controller",
        approvedAt: "2026-01-29T10:30:00Z",
        notes: null,
        attachmentCount: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        reconciliationId: "REC-1100-2026-01",
        accountId: "ACCT-1100",
        templateId: "RTPL-AR",
        period: "2026-01",
        status: "PENDING_REVIEW",
        glBalance: 875000,
        reconciledBalance: 875000,
        variance: 0,
        sections: [
          { sectionId: "S1", templateSectionId: "S1", name: "Opening Balance", sectionType: "OPENING_BALANCE", sortOrder: 1, isComplete: true, items: [makeLineItem("I1", "Beginning AR balance", 820000, { date: "2025-12-31" })], subtotal: 820000 },
          { sectionId: "S2", templateSectionId: "S2", name: "Sales/Billings", sectionType: "ADDITIONS", sortOrder: 2, isComplete: true, items: [makeLineItem("I2", "January sales", 450000)], subtotal: 450000 },
          { sectionId: "S3", templateSectionId: "S3", name: "Collections", sectionType: "ADJUSTMENTS", sortOrder: 3, isComplete: true, items: [makeLineItem("I3", "Cash receipts", -395000)], subtotal: -395000 },
          { sectionId: "S4", templateSectionId: "S4", name: "Bad Debt", sectionType: "ADJUSTMENTS", sortOrder: 4, isComplete: false, items: [], subtotal: 0 },
          { sectionId: "S5", templateSectionId: "S5", name: "Aging Schedule", sectionType: "SUBLEDGER_DETAIL", sortOrder: 5, isComplete: true, items: [], subtotal: 0 },
          { sectionId: "S6", templateSectionId: "S6", name: "Closing Balance", sectionType: "CLOSING_BALANCE", sortOrder: 6, isComplete: true, items: [makeLineItem("I4", "Ending AR balance", 875000)], subtotal: 875000 },
        ],
        reportingCurrency: "USD",
        bankAccounts: [],
        totalBankBalance: 0,
        fxRevaluationAmount: 0,
        fxRevaluationManualAdj: 0,
        reconciliationEquation: null,
        preparedBy: "Sarah Analyst",
        preparedAt: "2026-01-28T16:00:00Z",
        reviewedBy: null,
        reviewedAt: null,
        approvedBy: null,
        approvedAt: null,
        notes: "Pending bad debt review",
        attachmentCount: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        reconciliationId: "REC-1200-2026-01",
        accountId: "ACCT-1200",
        templateId: "RTPL-PREPAID",
        period: "2026-01",
        status: "IN_PROGRESS",
        glBalance: 125000,
        reconciledBalance: 118000,
        variance: 7000,
        sections: [
          { sectionId: "S1", templateSectionId: "S1", name: "Opening Balance", sectionType: "OPENING_BALANCE", sortOrder: 1, isComplete: true, items: [makeLineItem("I1", "Beginning prepaid balance", 130000, { date: "2025-12-31" })], subtotal: 130000 },
          { sectionId: "S2", templateSectionId: "S2", name: "Additions", sectionType: "ADDITIONS", sortOrder: 2, isComplete: false, items: [], subtotal: 0 },
          { sectionId: "S3", templateSectionId: "S3", name: "Amortization", sectionType: "ADJUSTMENTS", sortOrder: 3, isComplete: true, items: [makeLineItem("I2", "January amortization", -12000, { reference: "JE-1234", date: "2026-01-31" })], subtotal: -12000 },
          { sectionId: "S4", templateSectionId: "S4", name: "Schedule Detail", sectionType: "SUBLEDGER_DETAIL", sortOrder: 4, isComplete: false, items: [], subtotal: 0 },
          { sectionId: "S5", templateSectionId: "S5", name: "Closing Balance", sectionType: "CLOSING_BALANCE", sortOrder: 5, isComplete: true, items: [makeLineItem("I3", "Calculated ending balance", 118000, { notes: "Variance needs investigation" })], subtotal: 118000 },
        ],
        reportingCurrency: "USD",
        bankAccounts: [],
        totalBankBalance: 0,
        fxRevaluationAmount: 0,
        fxRevaluationManualAdj: 0,
        reconciliationEquation: null,
        preparedBy: "John Preparer",
        preparedAt: null,
        reviewedBy: null,
        reviewedAt: null,
        approvedBy: null,
        approvedAt: null,
        notes: "Working on variance investigation",
        attachmentCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        reconciliationId: "REC-2000-2026-01",
        accountId: "ACCT-2000",
        templateId: "RTPL-AP",
        period: "2026-01",
        status: "NOT_STARTED",
        glBalance: 340000,
        reconciledBalance: 0,
        variance: 340000,
        sections: [],
        reportingCurrency: "USD",
        bankAccounts: [],
        totalBankBalance: 0,
        fxRevaluationAmount: 0,
        fxRevaluationManualAdj: 0,
        reconciliationEquation: null,
        preparedBy: null,
        preparedAt: null,
        reviewedBy: null,
        reviewedAt: null,
        approvedBy: null,
        approvedAt: null,
        notes: null,
        attachmentCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        reconciliationId: "REC-2100-2026-01",
        accountId: "ACCT-2100",
        templateId: "RTPL-ACCRUAL",
        period: "2026-01",
        status: "APPROVED",
        glBalance: 185000,
        reconciledBalance: 185000,
        variance: 0,
        sections: [
          { sectionId: "S1", templateSectionId: "S1", name: "Opening Balance", sectionType: "OPENING_BALANCE", sortOrder: 1, isComplete: true, items: [makeLineItem("I1", "Beginning accrual balance", 165000, { date: "2025-12-31" })], subtotal: 165000 },
          { sectionId: "S2", templateSectionId: "S2", name: "New Accruals", sectionType: "ADDITIONS", sortOrder: 2, isComplete: true, items: [makeLineItem("I2", "January accruals", 95000)], subtotal: 95000 },
          { sectionId: "S3", templateSectionId: "S3", name: "Releases/Payments", sectionType: "ADJUSTMENTS", sortOrder: 3, isComplete: true, items: [makeLineItem("I3", "Payments and reversals", -75000)], subtotal: -75000 },
          { sectionId: "S4", templateSectionId: "S4", name: "Aging Analysis", sectionType: "VARIANCE_ANALYSIS", sortOrder: 4, isComplete: true, items: [], subtotal: 0 },
          { sectionId: "S5", templateSectionId: "S5", name: "Closing Balance", sectionType: "CLOSING_BALANCE", sortOrder: 5, isComplete: true, items: [makeLineItem("I4", "Ending accrual balance", 185000)], subtotal: 185000 },
        ],
        reportingCurrency: "USD",
        bankAccounts: [],
        totalBankBalance: 0,
        fxRevaluationAmount: 0,
        fxRevaluationManualAdj: 0,
        reconciliationEquation: null,
        preparedBy: "Sarah Analyst",
        preparedAt: "2026-01-27T15:00:00Z",
        reviewedBy: "Jane Controller",
        reviewedAt: "2026-01-28T09:00:00Z",
        approvedBy: "Jane Controller",
        approvedAt: "2026-01-28T09:30:00Z",
        notes: null,
        attachmentCount: 3,
        createdAt: now,
        updatedAt: now,
      },
      // Accrual Payroll - 12-Month Rollforward Template
      {
        reconciliationId: "REC-2110-2026-01",
        accountId: "ACCT-2110",
        templateId: "RTPL-ACCRUAL-12M",
        period: "2026-01",
        status: "IN_PROGRESS",
        glBalance: 72000,
        reconciledBalance: 72000,
        variance: 0,
        sections: [
          { 
            sectionId: "S1", 
            templateSectionId: "S1", 
            name: "Accrual Lines", 
            sectionType: "ACCRUAL_LINE_DETAIL", 
            sortOrder: 1, 
            isComplete: false, 
            items: [
              {
                itemId: "AL-001",
                description: "Audit Fee - 2025",
                reference: "AUD-2025-001",
                date: null,
                amount: 60000,
                notes: "Annual audit fee accrued monthly",
                attachmentIds: [],
                itemType: null,
                itemNature: null,
                itemStatus: "OPEN",
                customTags: [],
                bankAccountId: null,
                prepaidDetail: null,
                accrualDetail: {
                  supplierVendorId: "Big4 LLP",
                  plAccount: "6100",
                  groupAccount: "Professional Fees",
                  transactionCurrency: "USD",
                  openingBalanceTC: 0,
                  monthlyMovements: [
                    { period: "2025-01", amount: 5000, isActual: true },
                    { period: "2025-02", amount: 5000, isActual: true },
                    { period: "2025-03", amount: 5000, isActual: true },
                    { period: "2025-04", amount: 5000, isActual: true },
                    { period: "2025-05", amount: 5000, isActual: true },
                    { period: "2025-06", amount: 5000, isActual: true },
                    { period: "2025-07", amount: 5000, isActual: true },
                    { period: "2025-08", amount: 5000, isActual: true },
                    { period: "2025-09", amount: 5000, isActual: true },
                    { period: "2025-10", amount: 5000, isActual: true },
                    { period: "2025-11", amount: 5000, isActual: true },
                    { period: "2025-12", amount: 5000, isActual: true },
                  ],
                  totalMovementTC: 60000,
                  endingBalanceTC: 60000,
                  erpFxRate: 1.0,
                  convertedReportingAmount: 60000,
                  fxDifference: 0,
                  accrualType: "RECURRING",
                },
                createdAt: now,
                createdBy: "System",
              },
              {
                itemId: "AL-002",
                description: "Legal Invoice - ABC LLP",
                reference: "LEG-2025-Q1",
                date: null,
                amount: 12000,
                notes: "One-time legal engagement for Q1 contract review",
                attachmentIds: [],
                itemType: null,
                itemNature: null,
                itemStatus: "OPEN",
                customTags: [],
                bankAccountId: null,
                prepaidDetail: null,
                accrualDetail: {
                  supplierVendorId: "ABC LLP",
                  plAccount: "6200",
                  groupAccount: "Legal Fees",
                  transactionCurrency: "EUR",
                  openingBalanceTC: 0,
                  monthlyMovements: [
                    { period: "2025-01", amount: 0, isActual: true },
                    { period: "2025-02", amount: 0, isActual: true },
                    { period: "2025-03", amount: 12000, isActual: true },
                    { period: "2025-04", amount: 0, isActual: true },
                    { period: "2025-05", amount: 0, isActual: true },
                    { period: "2025-06", amount: 0, isActual: true },
                    { period: "2025-07", amount: 0, isActual: true },
                    { period: "2025-08", amount: 0, isActual: true },
                    { period: "2025-09", amount: 0, isActual: true },
                    { period: "2025-10", amount: 0, isActual: true },
                    { period: "2025-11", amount: 0, isActual: true },
                    { period: "2025-12", amount: 0, isActual: true },
                  ],
                  totalMovementTC: 12000,
                  endingBalanceTC: 12000,
                  erpFxRate: 1.0,
                  convertedReportingAmount: 12000,
                  fxDifference: 0,
                  accrualType: "ONE_OFF",
                },
                createdAt: now,
                createdBy: "System",
              },
            ], 
            subtotal: 72000 
          },
          { sectionId: "S2", templateSectionId: "S2", name: "FX Exceptions", sectionType: "FX_EXCEPTION", sortOrder: 2, isComplete: true, items: [], subtotal: 0 },
          { sectionId: "S3", templateSectionId: "S3", name: "Summary & Tie-Out", sectionType: "SUMMARY_TIE_OUT", sortOrder: 3, isComplete: true, items: [], subtotal: 0 },
          { sectionId: "S4", templateSectionId: "S4", name: "Attachments & Evidence", sectionType: "SUPPORTING_DOCUMENTATION", sortOrder: 4, isComplete: false, items: [], subtotal: 0 },
        ],
        reportingCurrency: "USD",
        bankAccounts: [],
        totalBankBalance: 0,
        fxRevaluationAmount: 0,
        fxRevaluationManualAdj: 0,
        reconciliationEquation: null,
        preparedBy: "Sarah Analyst",
        preparedAt: null,
        reviewedBy: null,
        reviewedAt: null,
        approvedBy: null,
        approvedAt: null,
        notes: "12-month rollforward view for payroll accruals",
        attachmentCount: 0,
        createdAt: now,
        updatedAt: now,
      },
      // Prepaid Insurance - Schedule-Anchored Template
      {
        reconciliationId: "REC-1200-SCH-2026-01",
        accountId: "ACCT-1200",
        templateId: "RTPL-PREPAID-SCHEDULE",
        period: "2026-01",
        status: "IN_PROGRESS",
        glBalance: 96000,
        reconciledBalance: 96000,
        variance: 0,
        sections: [
          { 
            sectionId: "S1", 
            templateSectionId: "S1", 
            name: "Prepaid Schedules", 
            sectionType: "SUBLEDGER_DETAIL", 
            sortOrder: 1, 
            isComplete: true, 
            items: [
              {
                itemId: "PP-001",
                description: "Annual D&O Insurance Premium",
                reference: "SCH-PP-001",
                date: null,
                amount: 48000,
                notes: "Directors & Officers liability insurance",
                attachmentIds: [],
                itemType: null,
                itemNature: null,
                itemStatus: "OPEN",
                customTags: [],
                bankAccountId: null,
                accrualDetail: null,
                prepaidDetail: {
                  scheduleId: "SCH-PP-001",
                  vendorSupplier: "Global Insurance Co.",
                  expenseAccount: "6300",
                  prepaidAccount: "1200",
                  startDate: "2025-07",
                  endDate: "2026-06",
                  totalTermMonths: 12,
                  monthsAmortized: 7,
                  monthsRemaining: 5,
                  totalPrepaidAmount: 96000,
                  amountAmortizedToDate: 56000,
                  amountRemaining: 40000,
                  isApproved: true,
                  approvedAt: "2025-06-15T10:00:00Z",
                  approvedBy: "Jane Controller",
                },
                createdAt: now,
                createdBy: "System",
              },
              {
                itemId: "PP-002",
                description: "Software License - Enterprise Suite",
                reference: "SCH-PP-002",
                date: null,
                amount: 36000,
                notes: "3-year enterprise software license",
                attachmentIds: [],
                itemType: null,
                itemNature: null,
                itemStatus: "OPEN",
                customTags: [],
                bankAccountId: null,
                accrualDetail: null,
                prepaidDetail: {
                  scheduleId: "SCH-PP-002",
                  vendorSupplier: "TechCorp Solutions",
                  expenseAccount: "6400",
                  prepaidAccount: "1200",
                  startDate: "2024-01",
                  endDate: "2026-12",
                  totalTermMonths: 36,
                  monthsAmortized: 25,
                  monthsRemaining: 11,
                  totalPrepaidAmount: 108000,
                  amountAmortizedToDate: 75000,
                  amountRemaining: 33000,
                  isApproved: true,
                  approvedAt: "2023-12-20T14:00:00Z",
                  approvedBy: "Mike CFO",
                },
                createdAt: now,
                createdBy: "System",
              },
              {
                itemId: "PP-003",
                description: "Office Lease Deposit",
                reference: "SCH-PP-003",
                date: null,
                amount: 12000,
                notes: "Security deposit for office lease",
                attachmentIds: [],
                itemType: null,
                itemNature: null,
                itemStatus: "OPEN",
                customTags: [],
                bankAccountId: null,
                accrualDetail: null,
                prepaidDetail: {
                  scheduleId: "SCH-PP-003",
                  vendorSupplier: "Downtown Properties LLC",
                  expenseAccount: "6500",
                  prepaidAccount: "1200",
                  startDate: "2025-01",
                  endDate: "2027-12",
                  totalTermMonths: 36,
                  monthsAmortized: 13,
                  monthsRemaining: 23,
                  totalPrepaidAmount: 36000,
                  amountAmortizedToDate: 13000,
                  amountRemaining: 23000,
                  isApproved: false,
                  approvedAt: null,
                  approvedBy: null,
                },
                createdAt: now,
                createdBy: "System",
              },
            ], 
            subtotal: 96000 
          },
          { sectionId: "S2", templateSectionId: "S2", name: "Summary & Tie-Out", sectionType: "SUMMARY_TIE_OUT", sortOrder: 2, isComplete: false, items: [], subtotal: 0 },
          { sectionId: "S3", templateSectionId: "S3", name: "Attachments & Evidence", sectionType: "SUPPORTING_DOCUMENTATION", sortOrder: 3, isComplete: false, items: [], subtotal: 0 },
        ],
        reportingCurrency: "USD",
        bankAccounts: [],
        totalBankBalance: 0,
        fxRevaluationAmount: 0,
        fxRevaluationManualAdj: 0,
        reconciliationEquation: null,
        preparedBy: "John Preparer",
        preparedAt: null,
        reviewedBy: null,
        reviewedAt: null,
        approvedBy: null,
        approvedAt: null,
        notes: "Schedule-anchored prepaid reconciliation",
        attachmentCount: 0,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const rec of reconciliations) {
      this.reconciliations.set(rec.reconciliationId, rec);
    }
  }

  // Reconciliation Template Methods
  async getReconciliationTemplates(): Promise<ReconciliationTemplate[]> {
    return Array.from(this.reconciliationTemplates.values());
  }

  async getReconciliationTemplate(id: string): Promise<ReconciliationTemplate | undefined> {
    return this.reconciliationTemplates.get(id);
  }

  async createReconciliationTemplate(data: InsertReconciliationTemplate): Promise<ReconciliationTemplate> {
    const now = new Date().toISOString();
    const template: ReconciliationTemplate = {
      templateId: `RTPL-${randomUUID().slice(0, 8).toUpperCase()}`,
      name: data.name,
      description: data.description,
      accountTypes: data.accountTypes,
      monetaryType: data.monetaryType || "NON_MONETARY",
      fxApplicable: data.fxApplicable || false,
      templateVariant: data.templateVariant,
      sections: data.sections.map((s, idx) => ({
        sectionId: `S${idx + 1}`,
        sectionType: s.sectionType,
        name: s.name,
        description: s.description,
        sortOrder: s.sortOrder,
        isRequired: s.isRequired,
        fields: s.fields.map((f, fidx) => ({
          fieldId: `F${idx + 1}-${fidx + 1}`,
          name: f.name,
          fieldType: f.fieldType,
          isRequired: f.isRequired,
          defaultValue: f.defaultValue,
          formula: f.formula,
        })),
      })),
      isSystemTemplate: false,
      isActive: true,
      createdAt: now,
      createdBy: "Current User",
      updatedAt: now,
    };
    this.reconciliationTemplates.set(template.templateId, template);
    return template;
  }

  // Reconciliation Account Methods
  async getReconciliationAccounts(entityId?: string, accountType?: ReconciliationAccountType): Promise<ReconciliationAccount[]> {
    let accounts = Array.from(this.reconciliationAccounts.values());
    if (entityId) {
      accounts = accounts.filter(a => a.entityId === entityId);
    }
    if (accountType) {
      accounts = accounts.filter(a => a.accountType === accountType);
    }
    return accounts.sort((a, b) => a.accountCode.localeCompare(b.accountCode));
  }

  async getReconciliationAccount(id: string): Promise<ReconciliationAccount | undefined> {
    return this.reconciliationAccounts.get(id);
  }

  async createReconciliationAccount(data: InsertReconciliationAccount): Promise<ReconciliationAccount> {
    const now = new Date().toISOString();
    const account: ReconciliationAccount = {
      accountId: `ACCT-${randomUUID().slice(0, 8).toUpperCase()}`,
      accountCode: data.accountCode,
      accountName: data.accountName,
      accountType: data.accountType,
      accountGroup: data.accountGroup || defaultAccountGroupForType[data.accountType],
      entityId: data.entityId,
      currency: data.currency,
      defaultTemplateId: data.defaultTemplateId || null,
      isActive: true,
      createdAt: now,
    };
    this.reconciliationAccounts.set(account.accountId, account);
    return account;
  }

  // Reconciliation Methods
  async getReconciliations(accountId?: string, period?: string, status?: ReconciliationStatus): Promise<Reconciliation[]> {
    let recs = Array.from(this.reconciliations.values());
    if (accountId) {
      recs = recs.filter(r => r.accountId === accountId);
    }
    if (period) {
      recs = recs.filter(r => r.period === period);
    }
    if (status) {
      recs = recs.filter(r => r.status === status);
    }
    return recs;
  }

  async getReconciliation(id: string): Promise<Reconciliation | undefined> {
    return this.reconciliations.get(id);
  }

  async createReconciliation(data: InsertReconciliation): Promise<Reconciliation> {
    const now = new Date().toISOString();
    const template = await this.getReconciliationTemplate(data.templateId);
    const account = await this.getReconciliationAccount(data.accountId);
    
    const reconciliation: Reconciliation = {
      reconciliationId: `REC-${randomUUID().slice(0, 8).toUpperCase()}`,
      accountId: data.accountId,
      templateId: data.templateId,
      period: data.period,
      status: "NOT_STARTED",
      glBalance: data.glBalance,
      reconciledBalance: 0,
      variance: data.glBalance,
      sections: template ? template.sections.map(s => ({
        sectionId: s.sectionId,
        templateSectionId: s.sectionId,
        name: s.name,
        sectionType: s.sectionType,
        sortOrder: s.sortOrder,
        isComplete: false,
        items: [],
        subtotal: 0,
      })) : [],
      reportingCurrency: account?.currency || "USD",
      bankAccounts: [],
      totalBankBalance: 0,
      fxRevaluationAmount: 0,
      fxRevaluationManualAdj: 0,
      reconciliationEquation: null,
      preparedBy: null,
      preparedAt: null,
      reviewedBy: null,
      reviewedAt: null,
      approvedBy: null,
      approvedAt: null,
      notes: null,
      attachmentCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.reconciliations.set(reconciliation.reconciliationId, reconciliation);
    return reconciliation;
  }

  async updateReconciliationStatus(id: string, status: ReconciliationStatus, userId: string): Promise<Reconciliation> {
    const rec = this.reconciliations.get(id);
    if (!rec) {
      throw new Error("Reconciliation not found");
    }
    
    const now = new Date().toISOString();
    const updated: Reconciliation = { ...rec, status, updatedAt: now };
    
    if (status === "PENDING_REVIEW" && !rec.preparedAt) {
      updated.preparedBy = userId;
      updated.preparedAt = now;
    } else if (status === "REVIEWED" && !rec.reviewedAt) {
      updated.reviewedBy = userId;
      updated.reviewedAt = now;
    } else if (status === "APPROVED" && !rec.approvedAt) {
      updated.approvedBy = userId;
      updated.approvedAt = now;
    }
    
    this.reconciliations.set(id, updated);
    return updated;
  }

  async updateReconciliationTemplate(id: string, templateId: string): Promise<Reconciliation> {
    const rec = this.reconciliations.get(id);
    if (!rec) {
      throw new Error("Reconciliation not found");
    }
    
    const template = this.reconciliationTemplates.get(templateId);
    if (!template) {
      throw new Error("Template not found");
    }
    
    const now = new Date().toISOString();
    
    // Create new sections from the template
    const newSections = template.sections.map((section, index) => ({
      sectionId: `S-${randomUUID().slice(0, 8)}`,
      templateSectionId: section.sectionId,
      name: section.name,
      sectionType: section.sectionType,
      sortOrder: section.sortOrder,
      isComplete: false,
      items: [],
      subtotal: 0,
    }));
    
    const updated: Reconciliation = {
      ...rec,
      templateId,
      sections: newSections,
      reconciledBalance: 0,
      variance: rec.glBalance,
      status: "NOT_STARTED",
      preparedBy: null,
      preparedAt: null,
      reviewedBy: null,
      reviewedAt: null,
      approvedBy: null,
      approvedAt: null,
      updatedAt: now,
    };
    
    this.reconciliations.set(id, updated);
    return updated;
  }

  async addReconciliationLineItem(reconciliationId: string, sectionId: string, data: InsertReconciliationLineItem): Promise<Reconciliation> {
    const rec = this.reconciliations.get(reconciliationId);
    if (!rec) {
      throw new Error("Reconciliation not found");
    }
    
    const now = new Date().toISOString();
    const section = rec.sections.find(s => s.sectionId === sectionId);
    if (!section) {
      throw new Error("Section not found");
    }
    
    const newItem: ReconciliationLineItem = {
      itemId: `I-${randomUUID().slice(0, 8)}`,
      description: data.description,
      reference: data.reference || null,
      date: data.date || null,
      amount: data.amount,
      notes: data.notes || null,
      attachmentIds: [],
      itemType: null,
      itemNature: null,
      itemStatus: "OPEN",
      customTags: [],
      bankAccountId: null,
      accrualDetail: null,
      prepaidDetail: null,
      createdAt: now,
      createdBy: "Current User",
    };
    
    section.items.push(newItem);
    section.subtotal = section.items.reduce((sum, item) => sum + item.amount, 0);
    
    // Recalculate reconciled balance
    rec.reconciledBalance = rec.sections.reduce((sum, s) => sum + s.subtotal, 0);
    rec.variance = rec.glBalance - rec.reconciledBalance;
    rec.updatedAt = now;
    
    if (rec.status === "NOT_STARTED") {
      rec.status = "IN_PROGRESS";
    }
    
    this.reconciliations.set(reconciliationId, rec);
    return rec;
  }

  // Reconciliation KPIs
  async getReconciliationKPIs(entityId?: string, period?: string): Promise<ReconciliationKPIs> {
    let accounts = Array.from(this.reconciliationAccounts.values());
    if (entityId) {
      accounts = accounts.filter(a => a.entityId === entityId);
    }
    
    const targetPeriod = period || "2026-01";
    const recs = Array.from(this.reconciliations.values()).filter(r => r.period === targetPeriod);
    
    const reconciledCount = recs.filter(r => r.status === "APPROVED" || r.status === "LOCKED").length;
    const pendingReviewCount = recs.filter(r => r.status === "PENDING_REVIEW" || r.status === "REVIEWED").length;
    const notStartedCount = recs.filter(r => r.status === "NOT_STARTED").length;
    const varianceTotal = recs.reduce((sum, r) => sum + Math.abs(r.variance), 0);
    
    return {
      totalAccounts: accounts.length,
      reconciledCount,
      pendingReviewCount,
      notStartedCount,
      varianceTotal,
      completionPercentage: accounts.length > 0 ? Math.round((reconciledCount / accounts.length) * 100) : 0,
    };
  }

  // Seed GL Master Mappings
  private seedGLMasterMappings() {
    const sampleMappings: GLMasterMapping[] = [
      { mappingId: "MAP-001", glAccountNumber: "1000", glDescriptionCategory: "Cash", bsPlCategory: "BS", footnoteNumber: "3", footnoteDescription: "Cash and cash equivalents", subNote: null, wpName: "Cash and cash equivalents", isActive: true, orderIndex: 1 },
      { mappingId: "MAP-002", glAccountNumber: "1100", glDescriptionCategory: "Trade Receivables", bsPlCategory: "BS", footnoteNumber: "4", footnoteDescription: "Trade receivables", subNote: null, wpName: "Trade receivables", isActive: true, orderIndex: 2 },
      { mappingId: "MAP-003", glAccountNumber: "1200", glDescriptionCategory: "Inventory", bsPlCategory: "BS", footnoteNumber: "5", footnoteDescription: "Inventories", subNote: null, wpName: "Inventories", isActive: true, orderIndex: 3 },
      { mappingId: "MAP-004", glAccountNumber: "1300", glDescriptionCategory: "Prepaid Expenses", bsPlCategory: "BS", footnoteNumber: "6", footnoteDescription: "Prepaid expenses", subNote: "Insurance", wpName: "Prepaid expenses", isActive: true, orderIndex: 4 },
      { mappingId: "MAP-005", glAccountNumber: "1310", glDescriptionCategory: "Prepaid Software", bsPlCategory: "BS", footnoteNumber: "6", footnoteDescription: "Prepaid expenses", subNote: "Software", wpName: "Prepaid expenses", isActive: true, orderIndex: 5 },
      { mappingId: "MAP-006", glAccountNumber: "1500", glDescriptionCategory: "Fixed Assets", bsPlCategory: "BS", footnoteNumber: "7", footnoteDescription: "Property, plant and equipment", subNote: "Buildings", wpName: "Property, plant and equipment", isActive: true, orderIndex: 6 },
      { mappingId: "MAP-007", glAccountNumber: "1590", glDescriptionCategory: "Accumulated Depreciation", bsPlCategory: "BS", footnoteNumber: "7", footnoteDescription: "Property, plant and equipment", subNote: "Accumulated Depreciation", wpName: "Property, plant and equipment", isActive: true, orderIndex: 7 },
      { mappingId: "MAP-008", glAccountNumber: "1600", glDescriptionCategory: "Intangible Assets", bsPlCategory: "BS", footnoteNumber: "8", footnoteDescription: "Intangible assets", subNote: null, wpName: "Intangible assets", isActive: true, orderIndex: 8 },
      { mappingId: "MAP-009", glAccountNumber: "2000", glDescriptionCategory: "Trade Payables", bsPlCategory: "BS", footnoteNumber: "9", footnoteDescription: "Trade and other payables", subNote: null, wpName: "Trade and other payables", isActive: true, orderIndex: 9 },
      { mappingId: "MAP-010", glAccountNumber: "2100", glDescriptionCategory: "Accrued Expenses", bsPlCategory: "BS", footnoteNumber: "10", footnoteDescription: "Accrued expenses", subNote: "Bonus", wpName: "Accrued expenses", isActive: true, orderIndex: 10 },
      { mappingId: "MAP-011", glAccountNumber: "2110", glDescriptionCategory: "Accrued Vacation", bsPlCategory: "BS", footnoteNumber: "10", footnoteDescription: "Accrued expenses", subNote: "Vacation", wpName: "Accrued expenses", isActive: true, orderIndex: 11 },
      { mappingId: "MAP-012", glAccountNumber: "2200", glDescriptionCategory: "Deferred Revenue", bsPlCategory: "BS", footnoteNumber: "11", footnoteDescription: "Deferred revenue", subNote: null, wpName: "Deferred revenue", isActive: true, orderIndex: 12 },
      { mappingId: "MAP-013", glAccountNumber: "2500", glDescriptionCategory: "Long-term Debt", bsPlCategory: "BS", footnoteNumber: "12", footnoteDescription: "Long-term borrowings", subNote: null, wpName: "Long-term borrowings", isActive: true, orderIndex: 13 },
      { mappingId: "MAP-014", glAccountNumber: "3000", glDescriptionCategory: "Share Capital", bsPlCategory: "BS", footnoteNumber: "13", footnoteDescription: "Share capital", subNote: null, wpName: "Share capital", isActive: true, orderIndex: 14 },
      { mappingId: "MAP-015", glAccountNumber: "3100", glDescriptionCategory: "Retained Earnings", bsPlCategory: "BS", footnoteNumber: "13", footnoteDescription: "Retained earnings", subNote: null, wpName: "Retained earnings", isActive: true, orderIndex: 15 },
      { mappingId: "MAP-016", glAccountNumber: "4000", glDescriptionCategory: "Revenue", bsPlCategory: "PL", footnoteNumber: "14", footnoteDescription: "Revenue", subNote: null, wpName: "Revenue", isActive: true, orderIndex: 16 },
      { mappingId: "MAP-017", glAccountNumber: "5000", glDescriptionCategory: "Cost of Sales", bsPlCategory: "PL", footnoteNumber: "15", footnoteDescription: "Cost of sales", subNote: null, wpName: "Cost of sales", isActive: true, orderIndex: 17 },
      { mappingId: "MAP-018", glAccountNumber: "6000", glDescriptionCategory: "Salaries & Wages", bsPlCategory: "PL", footnoteNumber: "16", footnoteDescription: "Employee costs", subNote: "Salaries", wpName: "Employee costs", isActive: true, orderIndex: 18 },
      { mappingId: "MAP-019", glAccountNumber: "6100", glDescriptionCategory: "Depreciation Expense", bsPlCategory: "PL", footnoteNumber: "7", footnoteDescription: "Depreciation expense", subNote: null, wpName: "Depreciation expense", isActive: true, orderIndex: 19 },
      { mappingId: "MAP-020", glAccountNumber: "7000", glDescriptionCategory: "Interest Expense", bsPlCategory: "PL", footnoteNumber: "17", footnoteDescription: "Finance costs", subNote: null, wpName: "Finance costs", isActive: true, orderIndex: 20 },
    ];
    
    for (const mapping of sampleMappings) {
      this.glMasterMappings.set(mapping.mappingId, mapping);
    }
  }

  // GL Master Mapping Methods
  async getGLMasterMappings(): Promise<GLMasterMapping[]> {
    return Array.from(this.glMasterMappings.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getGLMasterMapping(id: string): Promise<GLMasterMapping | undefined> {
    return this.glMasterMappings.get(id);
  }

  async createGLMasterMapping(data: Omit<GLMasterMapping, 'mappingId'>): Promise<GLMasterMapping> {
    // Validate required fields
    if (!data.glAccountNumber || !data.glDescriptionCategory || !data.footnoteDescription) {
      throw new Error("Missing required fields: glAccountNumber, glDescriptionCategory, footnoteDescription");
    }
    
    // Check for duplicate GL Number
    const existing = Array.from(this.glMasterMappings.values()).find(
      m => m.glAccountNumber === data.glAccountNumber
    );
    if (existing) {
      throw new Error(`GL Account Number ${data.glAccountNumber} already exists`);
    }
    
    const mappingId = `MAP-${randomUUID().slice(0, 8).toUpperCase()}`;
    const mapping: GLMasterMapping = {
      ...data,
      mappingId,
    };
    this.glMasterMappings.set(mappingId, mapping);
    return mapping;
  }

  async updateGLMasterMapping(id: string, data: Partial<GLMasterMapping>): Promise<GLMasterMapping> {
    const existing = this.glMasterMappings.get(id);
    if (!existing) {
      throw new Error("GL Master Mapping not found");
    }
    const updated: GLMasterMapping = { ...existing, ...data, mappingId: id };
    this.glMasterMappings.set(id, updated);
    return updated;
  }

  async deleteGLMasterMapping(id: string): Promise<boolean> {
    return this.glMasterMappings.delete(id);
  }

  async getUniqueWPNames(): Promise<string[]> {
    const mappings = Array.from(this.glMasterMappings.values());
    const wpNames = new Set<string>();
    for (const mapping of mappings) {
      if (mapping.wpName && mapping.isActive) {
        wpNames.add(mapping.wpName);
      }
    }
    return Array.from(wpNames).sort();
  }

  // Trial Balance Import Methods
  async getTBImportBatches(entityId?: string, periodId?: string): Promise<TBImportBatch[]> {
    let batches = Array.from(this.tbImportBatches.values());
    if (entityId) {
      batches = batches.filter(b => b.entityId === entityId);
    }
    if (periodId) {
      batches = batches.filter(b => b.periodId === periodId);
    }
    return batches.sort((a, b) => b.importedAt.localeCompare(a.importedAt));
  }

  async getTBImportBatch(batchId: string): Promise<TBImportBatch | undefined> {
    return this.tbImportBatches.get(batchId);
  }

  async createTBImportBatch(data: Omit<TBImportBatch, 'batchId' | 'importedAt'>): Promise<TBImportBatch> {
    const batchId = `TB-${randomUUID().slice(0, 8).toUpperCase()}`;
    const batch: TBImportBatch = {
      ...data,
      batchId,
      importedAt: new Date().toISOString(),
    };
    this.tbImportBatches.set(batchId, batch);
    return batch;
  }

  async deleteTBImportBatch(batchId: string): Promise<boolean> {
    return this.tbImportBatches.delete(batchId);
  }

  // Working Papers Methods
  async getWorkingPapers(entityId?: string, periodId?: string): Promise<WorkingPaper[]> {
    let papers = Array.from(this.workingPapers.values());
    if (entityId) {
      papers = papers.filter(wp => wp.entityId === entityId);
    }
    if (periodId) {
      papers = papers.filter(wp => wp.periodId === periodId);
    }
    return papers.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getWorkingPaper(id: string): Promise<WorkingPaper | undefined> {
    return this.workingPapers.get(id);
  }

  async createWorkingPaper(data: Omit<WorkingPaper, 'workingPaperId' | 'createdAt' | 'lastUpdated'>): Promise<WorkingPaper> {
    const workingPaperId = `WP-${randomUUID().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const wp: WorkingPaper = {
      ...data,
      workingPaperId,
      createdAt: now,
      lastUpdated: now,
    };
    this.workingPapers.set(workingPaperId, wp);
    return wp;
  }

  async updateWorkingPaper(id: string, data: Partial<WorkingPaper>): Promise<WorkingPaper> {
    const existing = this.workingPapers.get(id);
    if (!existing) throw new Error("Working paper not found");
    const updated: WorkingPaper = {
      ...existing,
      ...data,
      workingPaperId: id,
      lastUpdated: new Date().toISOString(),
    };
    this.workingPapers.set(id, updated);
    return updated;
  }

  async deleteWorkingPaper(id: string): Promise<boolean> {
    return this.workingPapers.delete(id);
  }

  // Auto-populate Working Papers from TB data using GL Master Mapping
  async autoPopulateWorkingPapers(entityId: string, periodId: string): Promise<{ 
    wpCount: number; 
    rowsPopulated: number; 
    workingPapers: WorkingPaper[] 
  }> {
    // Get GL Master Mappings
    const mappings = await this.getGLMasterMappings();
    const activeMappings = mappings.filter(m => m.isActive);
    
    // Get TB Import data for this period/entity
    const batches = await this.getTBImportBatches(entityId, periodId);
    if (batches.length === 0) {
      return { wpCount: 0, rowsPopulated: 0, workingPapers: [] };
    }
    
    // Use the most recent batch
    const latestBatch = batches[0];
    const tbEntries = latestBatch.entries;
    
    // Group mappings by WP name (sorted by orderIndex for precedence)
    const sortedMappings = [...activeMappings].sort((a, b) => a.orderIndex - b.orderIndex);
    const wpNameToMappings: Map<string, GLMasterMapping[]> = new Map();
    for (const mapping of sortedMappings) {
      const wpName = mapping.wpName || mapping.footnoteDescription;
      if (!wpNameToMappings.has(wpName)) {
        wpNameToMappings.set(wpName, []);
      }
      wpNameToMappings.get(wpName)!.push(mapping);
    }
    
    const createdWPs: WorkingPaper[] = [];
    let totalRowsPopulated = 0;
    
    // Track which TB entries have been assigned to prevent duplicates
    const assignedAccountCodes = new Set<string>();
    
    // For each WP name, find matching TB entries and create/update working papers
    for (const [wpName, wpMappings] of Array.from(wpNameToMappings.entries())) {
      // Find TB entries that match any of the GL description categories for this WP
      // Only include entries that haven't been assigned to another WP
      const matchingEntries: TBImportEntry[] = [];
      for (const entry of tbEntries) {
        // Skip if already assigned to another WP
        if (assignedAccountCodes.has(entry.accountCode)) continue;
        
        for (const mapping of wpMappings) {
          // Match by account name containing the GL description category (case-insensitive)
          const pattern = mapping.glDescriptionCategory.toLowerCase().trim();
          const accountName = entry.accountName.toLowerCase().trim();
          if (accountName.includes(pattern)) {
            matchingEntries.push(entry);
            assignedAccountCodes.add(entry.accountCode);
            break;
          }
        }
      }
      
      if (matchingEntries.length === 0) continue;
      
      // Check if WP already exists for this entity, period and name
      const existingWPs = await this.getWorkingPapers(entityId, periodId);
      let wp = existingWPs.find(w => w.name === wpName);
      
      // Determine WP type based on mapping characteristics
      const bsPlCategory = wpMappings[0].bsPlCategory;
      const wpType = bsPlCategory === "BS" ? "ROLLFORWARD" : "LINEAR";
      
      // Create rows from matching TB entries
      const rows: WorkingPaperRow[] = matchingEntries.map((entry, idx) => ({
        rowId: `row-${idx}`,
        rowType: "DATA" as const,
        orderIndex: idx,
        values: {
          "col-desc": entry.accountName,
          "col-code": entry.accountCode,
          "col-opening": entry.openingBalance,
          "col-closing": entry.closingBalance,
          "col-debit": entry.debitAmount,
          "col-credit": entry.creditAmount,
        },
        isLocked: false,
      }));
      
      // Add total row
      const totalOpening = matchingEntries.reduce((sum, e) => sum + e.openingBalance, 0);
      const totalClosing = matchingEntries.reduce((sum, e) => sum + e.closingBalance, 0);
      rows.push({
        rowId: `row-total`,
        rowType: "TOTAL",
        orderIndex: rows.length,
        values: {
          "col-desc": "Total",
          "col-code": "",
          "col-opening": totalOpening,
          "col-closing": totalClosing,
          "col-debit": matchingEntries.reduce((sum, e) => sum + e.debitAmount, 0),
          "col-credit": matchingEntries.reduce((sum, e) => sum + e.creditAmount, 0),
        },
        isLocked: true,
      });
      
      // Define columns
      const columns: WorkingPaperColumn[] = [
        { columnId: "col-desc", label: "Description", widthPx: 200, orderIndex: 0, isLocked: false, formula: null },
        { columnId: "col-code", label: "Account Code", widthPx: 100, orderIndex: 1, isLocked: false, formula: null },
        { columnId: "col-opening", label: "Opening", widthPx: 120, orderIndex: 2, isLocked: true, formula: null },
        { columnId: "col-closing", label: "Closing", widthPx: 120, orderIndex: 3, isLocked: true, formula: null },
        { columnId: "col-debit", label: "Debit", widthPx: 100, orderIndex: 4, isLocked: false, formula: null },
        { columnId: "col-credit", label: "Credit", widthPx: 100, orderIndex: 5, isLocked: false, formula: null },
      ];
      
      if (wp) {
        // Update existing WP with new data
        wp = await this.updateWorkingPaper(wp.workingPaperId, {
          rows,
          linkedAccountCodes: matchingEntries.map(e => e.accountCode),
          tbSourceAmount: totalClosing,
          wpTotalAmount: totalClosing,
          variance: 0,
          tieOutStatus: "TIED",
        });
      } else {
        // Create new WP with entityId
        wp = await this.createWorkingPaper({
          entityId,
          name: wpName,
          type: wpType,
          periodId,
          linkedFsLines: [],
          linkedNotes: [wpMappings[0].footnoteNumber || ""],
          columns,
          rows,
          textBlocks: [],
          frozenRows: 1,
          status: "DRAFT",
          linkedAccountCodes: matchingEntries.map(e => e.accountCode),
          tbSourceAmount: totalClosing,
          wpTotalAmount: totalClosing,
          variance: 0,
          tieOutStatus: "TIED",
          wpNotes: [],
          attachments: [],
          createdBy: "system",
          updatedBy: "system",
        });
      }
      
      createdWPs.push(wp);
      totalRowsPopulated += matchingEntries.length;
    }
    
    return {
      wpCount: createdWPs.length,
      rowsPopulated: totalRowsPopulated,
      workingPapers: createdWPs,
    };
  }

  // =============================================
  // Financial Artifacts (Document Registry)
  // =============================================

  async getArtifacts(filters?: {
    entityId?: string;
    period?: string;
    purpose?: ArtifactPurpose;
    status?: ArtifactStatus;
    isRequired?: boolean;
    isAuditRelevant?: boolean;
    linkedScheduleId?: string;
    linkedAccountCode?: string;
    virtualFolderPath?: string;
  }): Promise<FinancialArtifact[]> {
    let results = Array.from(this.financialArtifacts.values());
    
    if (filters) {
      if (filters.entityId) {
        results = results.filter(a => a.entityId === filters.entityId);
      }
      if (filters.period) {
        results = results.filter(a => a.period === filters.period);
      }
      if (filters.purpose) {
        results = results.filter(a => a.purpose === filters.purpose);
      }
      if (filters.status) {
        results = results.filter(a => a.status === filters.status);
      }
      if (filters.isRequired !== undefined) {
        results = results.filter(a => a.isRequired === filters.isRequired);
      }
      if (filters.isAuditRelevant !== undefined) {
        results = results.filter(a => a.isAuditRelevant === filters.isAuditRelevant);
      }
      if (filters.linkedScheduleId) {
        results = results.filter(a => a.linkedScheduleIds.includes(filters.linkedScheduleId!));
      }
      if (filters.linkedAccountCode) {
        results = results.filter(a => a.linkedAccountCodes.includes(filters.linkedAccountCode!));
      }
      if (filters.virtualFolderPath) {
        results = results.filter(a => 
          a.virtualFolderPath?.startsWith(filters.virtualFolderPath!) ?? false
        );
      }
    }
    
    // Sort by upload date descending
    return results.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  async getArtifact(id: string): Promise<FinancialArtifact | undefined> {
    return this.financialArtifacts.get(id);
  }

  async createArtifact(data: InsertArtifact): Promise<FinancialArtifact> {
    const now = new Date().toISOString();
    const artifact: FinancialArtifact = {
      artifactId: randomUUID(),
      fileName: data.fileName,
      fileType: data.fileType,
      fileSize: data.fileSize,
      filePath: data.filePath,
      mimeType: data.mimeType ?? null,
      period: data.period,
      entityId: data.entityId,
      purpose: data.purpose,
      customPurposeLabel: data.customPurposeLabel ?? null,
      description: data.description,
      tags: data.tags ?? [],
      owner: data.owner,
      status: data.status ?? "DRAFT",
      isRequired: data.isRequired ?? false,
      isAuditRelevant: data.isAuditRelevant ?? false,
      linkedAccountCodes: data.linkedAccountCodes ?? [],
      linkedScheduleIds: data.linkedScheduleIds ?? [],
      linkedReconciliationIds: data.linkedReconciliationIds ?? [],
      linkedWorkingPaperIds: data.linkedWorkingPaperIds ?? [],
      contractMetadata: data.contractMetadata ?? null,
      virtualFolderPath: data.virtualFolderPath ?? null,
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
      uploadedAt: now,
      lastModifiedAt: now,
      priorPeriodArtifactId: null,
    };
    
    this.financialArtifacts.set(artifact.artifactId, artifact);
    return artifact;
  }

  async updateArtifact(id: string, data: UpdateArtifact): Promise<FinancialArtifact> {
    const existing = this.financialArtifacts.get(id);
    if (!existing) {
      throw new Error(`Artifact with ID ${id} not found`);
    }
    
    const now = new Date().toISOString();
    const updated: FinancialArtifact = {
      ...existing,
      ...data,
      artifactId: existing.artifactId, // Preserve ID
      uploadedAt: existing.uploadedAt, // Preserve original upload time
      lastModifiedAt: now,
      // Handle review fields
      reviewedBy: data.reviewedBy !== undefined ? data.reviewedBy : existing.reviewedBy,
      reviewedAt: data.reviewedBy ? now : existing.reviewedAt,
      reviewNotes: data.reviewNotes !== undefined ? data.reviewNotes : existing.reviewNotes,
    };
    
    this.financialArtifacts.set(id, updated);
    return updated;
  }

  async deleteArtifact(id: string): Promise<boolean> {
    return this.financialArtifacts.delete(id);
  }

  async getArtifactHealthMetrics(entityId?: string, period?: string): Promise<ArtifactHealthMetrics> {
    const artifacts = await this.getArtifacts({ entityId, period });
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const byStatus: Record<ArtifactStatus, number> = {
      DRAFT: 0,
      PENDING: 0,
      REVIEWED: 0,
      APPROVED: 0,
      ARCHIVED: 0,
    };
    
    let requiredArtifacts = 0;
    let requiredComplete = 0;
    let supportingArtifacts = 0;
    let unreviewed = 0;
    let staleArtifacts = 0;
    let recentlyModified = 0;
    let auditRelevant = 0;
    let auditRelevantApproved = 0;
    let expiringContracts = 0;
    let expiredContracts = 0;
    
    for (const artifact of artifacts) {
      byStatus[artifact.status]++;
      
      if (artifact.isRequired) {
        requiredArtifacts++;
        if (artifact.status === "APPROVED") {
          requiredComplete++;
        }
      } else {
        supportingArtifacts++;
      }
      
      // Unreviewed = DRAFT or PENDING
      if (artifact.status === "DRAFT" || artifact.status === "PENDING") {
        unreviewed++;
      }
      
      // Stale = not reviewed in 90+ days
      const lastActivity = artifact.reviewedAt 
        ? new Date(artifact.reviewedAt) 
        : new Date(artifact.uploadedAt);
      if (lastActivity < ninetyDaysAgo && artifact.status !== "ARCHIVED") {
        staleArtifacts++;
      }
      
      // Recently modified check
      const modified = new Date(artifact.lastModifiedAt);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      if (modified > threeDaysAgo) {
        recentlyModified++;
      }
      
      // Audit relevance
      if (artifact.isAuditRelevant) {
        auditRelevant++;
        if (artifact.status === "APPROVED") {
          auditRelevantApproved++;
        }
      }
      
      // Contract expiry checks
      if (artifact.purpose === "CONTRACT" && artifact.contractMetadata?.expiryDate) {
        const expiry = new Date(artifact.contractMetadata.expiryDate);
        if (expiry < now) {
          expiredContracts++;
        } else if (expiry < thirtyDaysFromNow) {
          expiringContracts++;
        }
      }
    }
    
    return {
      totalArtifacts: artifacts.length,
      requiredArtifacts,
      requiredComplete,
      supportingArtifacts,
      byStatus,
      unreviewed,
      staleArtifacts,
      recentlyModified,
      auditRelevant,
      auditRelevantApproved,
      expiringContracts,
      expiredContracts,
    };
  }

  async getPeriodCoverageSummary(entityId: string): Promise<PeriodCoverageSummary[]> {
    const artifacts = await this.getArtifacts({ entityId });
    const entity = this.entities.get(entityId);
    const entityName = entity?.name ?? entityId;
    
    // Group by period
    const periodMap = new Map<string, FinancialArtifact[]>();
    for (const artifact of artifacts) {
      const existing = periodMap.get(artifact.period) ?? [];
      existing.push(artifact);
      periodMap.set(artifact.period, existing);
    }
    
    const summaries: PeriodCoverageSummary[] = [];
    for (const [period, periodArtifacts] of Array.from(periodMap.entries())) {
      const required = periodArtifacts.filter((a: FinancialArtifact) => a.isRequired);
      const requiredComplete = required.filter((a: FinancialArtifact) => a.status === "APPROVED").length;
      const unreviewedCount = periodArtifacts.filter(
        (a: FinancialArtifact) => a.status === "DRAFT" || a.status === "PENDING"
      ).length;
      
      summaries.push({
        period,
        entityId,
        entityName,
        totalArtifacts: periodArtifacts.length,
        requiredComplete,
        requiredTotal: required.length,
        completionPercent: required.length > 0 
          ? Math.round((requiredComplete / required.length) * 100) 
          : 100,
        unreviewedCount,
        hasGaps: required.length > 0 && requiredComplete < required.length,
      });
    }
    
    // Sort by period descending
    return summaries.sort((a, b) => b.period.localeCompare(a.period));
  }

  async getEntityCoverageSummary(): Promise<EntityCoverageSummary[]> {
    const entities = await this.getEntities();
    const summaries: EntityCoverageSummary[] = [];
    
    for (const entity of entities) {
      const periods = await this.getPeriodCoverageSummary(entity.id);
      const totalRequired = periods.reduce((sum, p) => sum + p.requiredTotal, 0);
      const totalComplete = periods.reduce((sum, p) => sum + p.requiredComplete, 0);
      const criticalGaps = periods.filter(p => p.hasGaps).length;
      
      summaries.push({
        entityId: entity.id,
        entityName: entity.name,
        periods,
        overallCompleteness: totalRequired > 0 
          ? Math.round((totalComplete / totalRequired) * 100) 
          : 100,
        criticalGaps,
      });
    }
    
    return summaries;
  }

  async getVirtualFolderPaths(entityId?: string, period?: string): Promise<string[]> {
    const artifacts = await this.getArtifacts({ entityId, period });
    const paths = new Set<string>();
    
    for (const artifact of artifacts) {
      if (artifact.virtualFolderPath) {
        // Add the path and all parent paths
        const parts = artifact.virtualFolderPath.split('/').filter(Boolean);
        let currentPath = '';
        for (const part of parts) {
          currentPath += '/' + part;
          paths.add(currentPath);
        }
      }
    }
    
    return Array.from(paths).sort();
  }
}

export const storage = new MemStorage();

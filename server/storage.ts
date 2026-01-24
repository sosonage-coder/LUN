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
  AccrualCategory
} from "@shared/schema";

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

  constructor() {
    this.schedules = new Map();
    this.events = new Map();
    this.entities = new Map();
    this.periodStatuses = new Map();
    this.cachedPeriods = new Map();
    this.prepaidSchedules = new Map();
    this.fixedAssets = new Map();
    this.accrualSchedules = new Map();
    
    // Seed with default entities
    this.seedData();
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
}

export const storage = new MemStorage();

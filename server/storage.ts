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
  PrepaidSubcategory
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

  constructor() {
    this.schedules = new Map();
    this.events = new Map();
    this.entities = new Map();
    this.periodStatuses = new Map();
    this.cachedPeriods = new Map();
    this.prepaidSchedules = new Map();
    
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
    for (const scheduleId of this.schedules.keys()) {
      this.rebuildScheduleSync(scheduleId);
    }

    // Seed prepaid schedules for Category Dashboard
    this.seedPrepaidSchedules();
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
}

export const storage = new MemStorage();

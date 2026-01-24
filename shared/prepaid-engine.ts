import Decimal from "decimal.js";

export type PrepaidEventType =
  | "REBASIS_AMOUNT"
  | "CHANGE_DATES"
  | "RECLASSIFICATION";

export type PrepaidPeriodState =
  | "EXTERNAL"
  | "SYSTEM_BASE"
  | "SYSTEM_ADJUSTED"
  | "CLOSED";

export type PrepaidOnboardingMode = "CONTINUE_ONLY" | "CATCH_UP";

export interface PrepaidRecognitionInput {
  start_date: string;
  end_date: string;
  total_amount_reporting: Decimal.Value;
  total_amount_local: Decimal.Value;
}

export interface PrepaidEvent {
  eventType: PrepaidEventType;
  eventPeriod: string;
  new_total_reporting?: Decimal.Value;
  new_total_local?: Decimal.Value;
  new_start_date?: string;
  new_end_date?: string;
  new_expense_account?: string;
  effective_period?: string;
}

export interface PrepaidScheduleOptions {
  system_posting_start_period?: string;
  onboarding_mode?: PrepaidOnboardingMode;
  closed_periods?: string[];
}

export interface PrepaidPeriodResult {
  period: string;
  reporting_amount: Decimal;
  local_amount: Decimal;
  posting_amount: Decimal;
  state: PrepaidPeriodState;
  adjustment_reason?: string;
}

const PERIOD_REGEX = /^\d{4}-\d{2}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const ensurePeriodFormat = (period: string): void => {
  if (!PERIOD_REGEX.test(period)) {
    throw new Error(`Invalid period format: ${period}`);
  }
};

const ensureDateFormat = (date: string): void => {
  if (!DATE_REGEX.test(date)) {
    throw new Error(`Invalid date format: ${date}`);
  }
};

const parseDate = (date: string): Date => {
  ensureDateFormat(date);
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  return parsed;
};

const formatPeriod = (year: number, month: number): string => {
  const paddedMonth = String(month).padStart(2, "0");
  return `${year}-${paddedMonth}`;
};

const isLastDayOfMonth = (date: Date): boolean => {
  const year = date.getUTCFullYear();
  const monthIndex = date.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  return date.getUTCDate() === lastDay;
};

const addMonths = (year: number, month: number, delta: number): {
  year: number;
  month: number;
} => {
  const total = year * 12 + (month - 1) + delta;
  const nextYear = Math.floor(total / 12);
  const nextMonth = (total % 12) + 1;
  return { year: nextYear, month: nextMonth };
};

const listPeriodsBetween = (start: string, end: string): string[] => {
  ensurePeriodFormat(start);
  ensurePeriodFormat(end);
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  let year = startYear;
  let month = startMonth;
  const periods: string[] = [];

  while (year < endYear || (year === endYear && month <= endMonth)) {
    periods.push(formatPeriod(year, month));
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return periods;
};

const generatePeriodsFromDates = (startDate: string, endDate: string): string[] => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const startMonth =
    start.getUTCDate() === 1
      ? { year: start.getUTCFullYear(), month: start.getUTCMonth() + 1 }
      : addMonths(start.getUTCFullYear(), start.getUTCMonth() + 1, 1);

  const endMonth = isLastDayOfMonth(end)
    ? { year: end.getUTCFullYear(), month: end.getUTCMonth() + 1 }
    : addMonths(end.getUTCFullYear(), end.getUTCMonth() + 1, -1);

  const startPeriod = formatPeriod(startMonth.year, startMonth.month);
  const endPeriod = formatPeriod(endMonth.year, endMonth.month);

  if (startPeriod > endPeriod) {
    return [];
  }

  return listPeriodsBetween(startPeriod, endPeriod);
};

const allocateAmounts = (
  periods: string[],
  totalReporting: Decimal,
  fx: Decimal
): Map<string, { reporting: Decimal; local: Decimal }> => {
  const allocations = new Map<string, { reporting: Decimal; local: Decimal }>();
  if (periods.length === 0) {
    return allocations;
  }
  const roundedMonthly = totalReporting
    .dividedBy(periods.length)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
  let accumulated = new Decimal(0);

  periods.forEach((period, index) => {
    const isLast = index === periods.length - 1;
    const reportingAmount = isLast
      ? totalReporting.minus(accumulated).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      : roundedMonthly;
    const localAmount = reportingAmount
      .dividedBy(fx)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    allocations.set(period, { reporting: reportingAmount, local: localAmount });
    accumulated = accumulated.plus(reportingAmount);
  });

  return allocations;
};

const deriveFx = (reporting: Decimal, local: Decimal): Decimal => {
  if (local.isZero()) {
    throw new Error("Local amount cannot be zero when deriving FX");
  }
  return reporting.dividedBy(local);
};

const sumReporting = (
  periods: string[],
  amounts: Map<string, { reporting: Decimal }>
): Decimal => {
  return periods.reduce((sum, period) => {
    const entry = amounts.get(period);
    return entry ? sum.plus(entry.reporting) : sum;
  }, new Decimal(0));
};

const sortPeriods = (periods: string[]): string[] => {
  return Array.from(new Set(periods)).sort();
};

const buildLockedSet = (
  periods: string[],
  eventPeriod: string,
  closedPeriods: Set<string>,
  systemPostingStart?: string
): Set<string> => {
  ensurePeriodFormat(eventPeriod);
  const locked = new Set<string>();
  periods.forEach((period) => {
    if (period < eventPeriod) {
      locked.add(period);
    }
    if (closedPeriods.has(period)) {
      locked.add(period);
    }
    if (systemPostingStart && period < systemPostingStart) {
      locked.add(period);
    }
  });
  return locked;
};

export const buildPrepaidSchedule = (
  recognition: PrepaidRecognitionInput,
  events: PrepaidEvent[] = [],
  options: PrepaidScheduleOptions = {}
): PrepaidPeriodResult[] => {
  const totalReportingInitial = new Decimal(recognition.total_amount_reporting);
  const totalLocalInitial = new Decimal(recognition.total_amount_local);
  const initialFx = deriveFx(totalReportingInitial, totalLocalInitial);

  let currentStartDate = recognition.start_date;
  let currentEndDate = recognition.end_date;
  let currentFx = initialFx;
  let currentTotalReporting = totalReportingInitial;
  let currentPeriods = generatePeriodsFromDates(currentStartDate, currentEndDate);

  const closedPeriods = new Set(options.closed_periods ?? []);
  const systemPostingStart = options.system_posting_start_period;
  const onboardingMode = options.onboarding_mode ?? "CONTINUE_ONLY";

  const periodAmounts = allocateAmounts(currentPeriods, currentTotalReporting, currentFx);
  const adjustedPeriods = new Set<string>();

  const sortedEvents = [...events].sort((a, b) => a.eventPeriod.localeCompare(b.eventPeriod));

  sortedEvents.forEach((event) => {
    ensurePeriodFormat(event.eventPeriod);

    if (event.eventType === "RECLASSIFICATION") {
      return;
    }

    if (event.eventType === "CHANGE_DATES") {
      if (event.new_start_date) {
        currentStartDate = event.new_start_date;
      }
      if (event.new_end_date) {
        currentEndDate = event.new_end_date;
      }

      const recalculatedPeriods = generatePeriodsFromDates(
        currentStartDate,
        currentEndDate
      );
      const locked = buildLockedSet(
        currentPeriods,
        event.eventPeriod,
        closedPeriods,
        systemPostingStart
      );
      const lockedPeriods = currentPeriods.filter((period) => locked.has(period));
      const mergedPeriods = sortPeriods([...lockedPeriods, ...recalculatedPeriods]);

      const lockedTotal = sumReporting(lockedPeriods, periodAmounts);
      const remainingPeriods = mergedPeriods.filter((period) => !locked.has(period));
      const remainingTotal = currentTotalReporting.minus(lockedTotal);
      const allocations = allocateAmounts(remainingPeriods, remainingTotal, currentFx);
      remainingPeriods.forEach((period) => {
        const allocation = allocations.get(period);
        if (allocation) {
          periodAmounts.set(period, allocation);
          adjustedPeriods.add(period);
        }
      });

      currentPeriods = mergedPeriods;
      return;
    }

    if (event.eventType === "REBASIS_AMOUNT") {
      const newReportingInput =
        event.new_total_reporting !== undefined
          ? new Decimal(event.new_total_reporting)
          : undefined;
      const newLocalInput =
        event.new_total_local !== undefined
          ? new Decimal(event.new_total_local)
          : undefined;

      if (!newReportingInput && !newLocalInput) {
        throw new Error("REBASIS_AMOUNT requires at least one amount");
      }

      let nextFx = currentFx;
      let nextTotalReporting = currentTotalReporting;

      if (newReportingInput && newLocalInput) {
        nextFx = deriveFx(newReportingInput, newLocalInput);
        nextTotalReporting = newReportingInput;
      } else if (newReportingInput) {
        nextTotalReporting = newReportingInput;
      } else if (newLocalInput) {
        nextTotalReporting = newLocalInput.mul(currentFx);
      }

      const locked = buildLockedSet(
        currentPeriods,
        event.eventPeriod,
        closedPeriods,
        systemPostingStart
      );
      const lockedPeriods = currentPeriods.filter((period) => locked.has(period));
      const lockedTotal = sumReporting(lockedPeriods, periodAmounts);
      const remainingPeriods = currentPeriods.filter((period) => !locked.has(period));
      const remainingTotal = nextTotalReporting.minus(lockedTotal);
      const allocations = allocateAmounts(remainingPeriods, remainingTotal, nextFx);

      remainingPeriods.forEach((period) => {
        const allocation = allocations.get(period);
        if (allocation) {
          periodAmounts.set(period, allocation);
          adjustedPeriods.add(period);
        }
      });

      currentFx = nextFx;
      currentTotalReporting = nextTotalReporting;
      return;
    }
  });

  const results: PrepaidPeriodResult[] = [];
  const sortedPeriodsResult = sortPeriods(currentPeriods);

  sortedPeriodsResult.forEach((period) => {
    const allocation = periodAmounts.get(period) ?? {
      reporting: new Decimal(0),
      local: new Decimal(0)
    };
    const isClosed = closedPeriods.has(period);
    const isExternal = systemPostingStart ? period < systemPostingStart : false;
    let state: PrepaidPeriodState = "SYSTEM_BASE";
    if (isClosed) {
      state = "CLOSED";
    } else if (isExternal) {
      state = "EXTERNAL";
    } else if (adjustedPeriods.has(period)) {
      state = "SYSTEM_ADJUSTED";
    }
    const postingAmount = isExternal ? new Decimal(0) : allocation.reporting;
    results.push({
      period,
      reporting_amount: allocation.reporting,
      local_amount: allocation.local,
      posting_amount: postingAmount,
      state
    });
  });

  if (systemPostingStart && onboardingMode === "CATCH_UP") {
    const externalTotal = results
      .filter((row) => row.state === "EXTERNAL")
      .reduce((sum, row) => sum.plus(row.reporting_amount), new Decimal(0));
    if (!externalTotal.isZero()) {
      const catchUpTarget = results.find(
        (row) => row.period >= systemPostingStart && row.state !== "CLOSED"
      );
      if (catchUpTarget) {
        catchUpTarget.posting_amount = catchUpTarget.posting_amount.plus(externalTotal);
        catchUpTarget.state = "SYSTEM_ADJUSTED";
        catchUpTarget.adjustment_reason = "CATCH_UP";
      }
    }
  }

  return results;
};

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calculator, Calendar, TrendingDown, Clock, AlertCircle, ChevronRight } from "lucide-react";
import Decimal from "decimal.js";

type PrepaidPeriodState = "EXTERNAL" | "SYSTEM_BASE" | "SYSTEM_ADJUSTED" | "CLOSED";
type PrepaidOnboardingMode = "CONTINUE_ONLY" | "CATCH_UP";

interface LocalSchedulePeriod {
  period: string;
  periodNumber: number;
  openingBalance: Decimal;
  expense: Decimal;
  closingBalance: Decimal;
  state: PrepaidPeriodState;
  progressPercent: number;
}

interface LocalScheduleResult {
  periods: LocalSchedulePeriod[];
  totalPeriods: number;
  totalAmount: Decimal;
  monthlyAmount: Decimal;
  error: string | null;
}

const stateColors: Record<string, string> = {
  EXTERNAL: "bg-slate-500",
  SYSTEM_BASE: "bg-emerald-600",
  SYSTEM_ADJUSTED: "bg-amber-500",
  CLOSED: "bg-red-500",
};

const stateLabels: Record<string, string> = {
  EXTERNAL: "External",
  SYSTEM_BASE: "Active",
  SYSTEM_ADJUSTED: "Adjusted",
  CLOSED: "Closed",
};

const PERIOD_REGEX = /^\d{4}-\d{2}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const parseDate = (date: string): Date => {
  if (!DATE_REGEX.test(date)) throw new Error(`Invalid date format: ${date}`);
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid date: ${date}`);
  return parsed;
};

const formatPeriod = (year: number, month: number): string => {
  return `${year}-${String(month).padStart(2, "0")}`;
};

const isLastDayOfMonth = (date: Date): boolean => {
  const year = date.getUTCFullYear();
  const monthIndex = date.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  return date.getUTCDate() === lastDay;
};

const addMonths = (year: number, month: number, delta: number): { year: number; month: number } => {
  const total = year * 12 + (month - 1) + delta;
  return { year: Math.floor(total / 12), month: (total % 12) + 1 };
};

const generatePeriodsFromDates = (startDate: string, endDate: string): string[] => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const startMonth = start.getUTCDate() === 1
    ? { year: start.getUTCFullYear(), month: start.getUTCMonth() + 1 }
    : addMonths(start.getUTCFullYear(), start.getUTCMonth() + 1, 1);

  const endMonth = isLastDayOfMonth(end)
    ? { year: end.getUTCFullYear(), month: end.getUTCMonth() + 1 }
    : addMonths(end.getUTCFullYear(), end.getUTCMonth() + 1, -1);

  const startPeriod = formatPeriod(startMonth.year, startMonth.month);
  const endPeriod = formatPeriod(endMonth.year, endMonth.month);

  if (startPeriod > endPeriod) return [];

  const periods: string[] = [];
  let { year, month } = startMonth;
  while (formatPeriod(year, month) <= endPeriod) {
    periods.push(formatPeriod(year, month));
    month++;
    if (month > 12) { month = 1; year++; }
  }
  return periods;
};

const buildLocalSchedule = (
  startDate: string,
  endDate: string,
  totalAmount: string,
  systemPostingStart: string,
  closedPeriodsStr: string,
  onboardingMode: PrepaidOnboardingMode,
  rebasisPeriod: string,
  rebasisAmount: string
): LocalScheduleResult => {
  try {
    const total = new Decimal(totalAmount);
    if (total.isNegative()) throw new Error("Amount cannot be negative");

    const periods = generatePeriodsFromDates(startDate, endDate);
    if (periods.length === 0) {
      return { periods: [], totalPeriods: 0, totalAmount: total, monthlyAmount: new Decimal(0), error: null };
    }

    const closedPeriods = new Set(
      closedPeriodsStr ? closedPeriodsStr.split(",").map(p => p.trim()).filter(p => PERIOD_REGEX.test(p)) : []
    );

    let workingTotal = total;
    let rebasisEffectivePeriod: string | null = null;
    if (rebasisPeriod && PERIOD_REGEX.test(rebasisPeriod) && rebasisAmount) {
      try {
        workingTotal = new Decimal(rebasisAmount);
        rebasisEffectivePeriod = rebasisPeriod;
      } catch {
        // Invalid rebasis amount, ignore
      }
    }

    const monthlyBase = total.dividedBy(periods.length).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    
    const result: LocalSchedulePeriod[] = [];
    let runningBalance = total;
    let accumulatedExpense = new Decimal(0);

    periods.forEach((period, idx) => {
      const periodNumber = idx + 1;
      const isExternal = systemPostingStart && period < systemPostingStart;
      const isClosed = closedPeriods.has(period);
      const isAdjusted = rebasisEffectivePeriod && period >= rebasisEffectivePeriod;

      let state: PrepaidPeriodState = "SYSTEM_BASE";
      if (isClosed) state = "CLOSED";
      else if (isExternal) state = "EXTERNAL";
      else if (isAdjusted) state = "SYSTEM_ADJUSTED";

      const openingBalance = runningBalance;
      
      let expense: Decimal;
      if (idx === periods.length - 1) {
        expense = runningBalance;
      } else if (rebasisEffectivePeriod && period >= rebasisEffectivePeriod) {
        const remainingPeriods = periods.length - idx;
        const alreadyExpensed = accumulatedExpense;
        const rebasisTotal = workingTotal;
        const remainingAfterRebasis = rebasisTotal.minus(alreadyExpensed);
        expense = remainingAfterRebasis.dividedBy(remainingPeriods).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
        if (expense.isNegative()) expense = new Decimal(0);
      } else {
        expense = monthlyBase;
      }

      if (expense.greaterThan(runningBalance)) {
        expense = runningBalance;
      }

      const closingBalance = runningBalance.minus(expense);
      accumulatedExpense = accumulatedExpense.plus(expense);
      
      const progressPercent = total.isZero() ? 100 : closingBalance.dividedBy(total).times(100).toNumber();

      result.push({
        period,
        periodNumber,
        openingBalance,
        expense,
        closingBalance,
        state,
        progressPercent: Math.max(0, Math.min(100, progressPercent)),
      });

      runningBalance = closingBalance;
    });

    return {
      periods: result,
      totalPeriods: periods.length,
      totalAmount: total,
      monthlyAmount: monthlyBase,
      error: null,
    };
  } catch (err) {
    return {
      periods: [],
      totalPeriods: 0,
      totalAmount: new Decimal(0),
      monthlyAmount: new Decimal(0),
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

const formatCurrency = (amount: Decimal | number, currency = "USD"): string => {
  const num = typeof amount === "number" ? amount : amount.toNumber();
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export default function PrepaidCalculator() {
  const [startDate, setStartDate] = useState("2025-01-15");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [totalAmount, setTotalAmount] = useState("12000.00");
  const [currency, setCurrency] = useState("USD");
  const [onboardingMode, setOnboardingMode] = useState<PrepaidOnboardingMode>("CONTINUE_ONLY");
  const [systemPostingStart, setSystemPostingStart] = useState("");
  const [closedPeriods, setClosedPeriods] = useState("");
  const [rebasisPeriod, setRebasisPeriod] = useState("");
  const [rebasisAmount, setRebasisAmount] = useState("");

  const schedule = useMemo(() => {
    return buildLocalSchedule(
      startDate,
      endDate,
      totalAmount,
      systemPostingStart,
      closedPeriods,
      onboardingMode,
      rebasisPeriod,
      rebasisAmount
    );
  }, [startDate, endDate, totalAmount, systemPostingStart, closedPeriods, onboardingMode, rebasisPeriod, rebasisAmount]);

  const periodsElapsed = schedule.periods.filter(p => p.closingBalance.isZero() || p.state === "CLOSED").length;
  const periodsRemaining = schedule.totalPeriods - periodsElapsed;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Local Prepaid Schedule</h1>
          <p className="text-muted-foreground">
            Time-based cost allocation with balance reduction tracking
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Schedule Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-testid="input-start-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-testid="input-end-date"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="total-amount">Total Prepaid Amount</Label>
              <Input
                id="total-amount"
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                data-testid="input-total-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency" data-testid="select-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="system-posting-start">System Start Period</Label>
              <Input
                id="system-posting-start"
                type="text"
                placeholder="YYYY-MM (optional)"
                value={systemPostingStart}
                onChange={(e) => setSystemPostingStart(e.target.value)}
                data-testid="input-system-posting-start"
              />
              <p className="text-xs text-muted-foreground">Periods before this are marked External</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="closed-periods">Closed Periods</Label>
              <Input
                id="closed-periods"
                type="text"
                placeholder="YYYY-MM, YYYY-MM"
                value={closedPeriods}
                onChange={(e) => setClosedPeriods(e.target.value)}
                data-testid="input-closed-periods"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Rebasis Event (Optional)</Label>
              <Input
                type="text"
                placeholder="Period (YYYY-MM)"
                value={rebasisPeriod}
                onChange={(e) => setRebasisPeriod(e.target.value)}
                data-testid="input-rebasis-period"
              />
              <Input
                type="text"
                placeholder="New Total Amount"
                value={rebasisAmount}
                onChange={(e) => setRebasisAmount(e.target.value)}
                data-testid="input-rebasis-amount"
              />
              {rebasisPeriod && rebasisAmount && (
                <Badge variant="outline" className="text-xs">
                  Rebasis from {rebasisPeriod}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold" data-testid="stat-total-amount">
                  {formatCurrency(schedule.totalAmount, currency)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Monthly Expense</div>
                <div className="text-2xl font-bold" data-testid="stat-monthly-expense">
                  {formatCurrency(schedule.monthlyAmount, currency)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Total Periods</div>
                <div className="text-2xl font-bold" data-testid="stat-total-periods">
                  {schedule.totalPeriods}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Remaining
                </div>
                <div className="text-2xl font-bold" data-testid="stat-remaining-periods">
                  {periodsRemaining} <span className="text-sm font-normal text-muted-foreground">periods</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Amortization Schedule
              </CardTitle>
              <CardDescription>
                FIRST_FULL_MONTH convention · Balance reduces each period until fully expensed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {schedule.error ? (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <span>{schedule.error}</span>
                </div>
              ) : schedule.periods.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No periods generated. Check your date inputs.
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table data-testid="prepaid-schedule-table">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Opening</TableHead>
                        <TableHead className="text-right">Expense</TableHead>
                        <TableHead className="text-right">Closing</TableHead>
                        <TableHead className="w-[180px]">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.periods.map((row, idx) => (
                        <TableRow 
                          key={row.period} 
                          data-testid={`period-row-${idx}`}
                          className={row.closingBalance.isZero() ? "bg-muted/30" : ""}
                        >
                          <TableCell className="text-muted-foreground font-mono text-sm">
                            {row.periodNumber}
                          </TableCell>
                          <TableCell className="font-mono font-medium">
                            {row.period}
                          </TableCell>
                          <TableCell>
                            <Badge className={stateColors[row.state]} variant="secondary">
                              {stateLabels[row.state]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(row.openingBalance, currency)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            <span className="text-destructive">
                              ({formatCurrency(row.expense, currency)})
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            {formatCurrency(row.closingBalance, currency)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={row.progressPercent} 
                                className="h-2 flex-1"
                              />
                              <span className="text-xs text-muted-foreground w-10 text-right">
                                {row.progressPercent.toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Period States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(stateLabels).map(([state, label]) => (
                  <div key={state} className="flex items-center gap-3">
                    <Badge className={stateColors[state]}>{label}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {state === "EXTERNAL" && "Expensed before system start"}
                      {state === "SYSTEM_BASE" && "Standard monthly amortization"}
                      {state === "SYSTEM_ADJUSTED" && "Modified by rebasis event"}
                      {state === "CLOSED" && "Period is closed (immutable)"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Schedule Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>FIRST_FULL_MONTH: Jan 15 start → Feb is first expense period</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>True-up applied on final period to eliminate rounding drift</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Closed periods are immutable - corrections flow forward</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Time drives amortization - not balance targeting</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

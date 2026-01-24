import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Calculator, Calendar, DollarSign, TrendingUp, Lock, AlertCircle } from "lucide-react";
import { CurrencyDisplay } from "@/components/currency-display";
import Decimal from "decimal.js";
import { 
  buildPrepaidSchedule, 
  type PrepaidRecognitionInput,
  type PrepaidEvent,
  type PrepaidScheduleOptions,
  type PrepaidPeriodResult,
  type PrepaidOnboardingMode
} from "@shared/prepaid-engine";

const stateColors: Record<string, string> = {
  EXTERNAL: "bg-slate-500",
  SYSTEM_BASE: "bg-blue-500",
  SYSTEM_ADJUSTED: "bg-amber-500",
  CLOSED: "bg-red-500",
};

const stateLabels: Record<string, string> = {
  EXTERNAL: "External",
  SYSTEM_BASE: "Base",
  SYSTEM_ADJUSTED: "Adjusted",
  CLOSED: "Closed",
};

export default function PrepaidCalculator() {
  const [startDate, setStartDate] = useState("2025-01-15");
  const [endDate, setEndDate] = useState("2025-12-31");
  const [totalReporting, setTotalReporting] = useState("12000.00");
  const [totalLocal, setTotalLocal] = useState("10000.00");
  const [onboardingMode, setOnboardingMode] = useState<PrepaidOnboardingMode>("CONTINUE_ONLY");
  const [systemPostingStart, setSystemPostingStart] = useState("");
  const [closedPeriods, setClosedPeriods] = useState("");
  
  const [rebasisPeriod, setRebasisPeriod] = useState("");
  const [rebasisReporting, setRebasisReporting] = useState("");
  const [events, setEvents] = useState<PrepaidEvent[]>([]);

  const scheduleResults = useMemo(() => {
    try {
      const recognition: PrepaidRecognitionInput = {
        start_date: startDate,
        end_date: endDate,
        total_amount_reporting: totalReporting,
        total_amount_local: totalLocal,
      };

      const options: PrepaidScheduleOptions = {
        onboarding_mode: onboardingMode,
        system_posting_start_period: systemPostingStart || undefined,
        closed_periods: closedPeriods ? closedPeriods.split(",").map(p => p.trim()) : [],
      };

      return {
        periods: buildPrepaidSchedule(recognition, events, options),
        error: null,
      };
    } catch (err) {
      return {
        periods: [] as PrepaidPeriodResult[],
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }, [startDate, endDate, totalReporting, totalLocal, onboardingMode, systemPostingStart, closedPeriods, events]);

  const impliedFx = useMemo(() => {
    try {
      const reporting = new Decimal(totalReporting);
      const local = new Decimal(totalLocal);
      if (local.isZero()) return null;
      return reporting.dividedBy(local).toDecimalPlaces(6);
    } catch {
      return null;
    }
  }, [totalReporting, totalLocal]);

  const totals = useMemo(() => {
    if (scheduleResults.periods.length === 0) {
      return { totalReporting: new Decimal(0), totalPosting: new Decimal(0), periodCount: 0 };
    }
    return {
      totalReporting: scheduleResults.periods.reduce((sum, p) => sum.plus(p.reporting_amount), new Decimal(0)),
      totalPosting: scheduleResults.periods.reduce((sum, p) => sum.plus(p.posting_amount), new Decimal(0)),
      periodCount: scheduleResults.periods.length,
    };
  }, [scheduleResults.periods]);

  const addRebasisEvent = () => {
    if (!rebasisPeriod || !rebasisReporting) return;
    
    const newEvent: PrepaidEvent = {
      eventType: "REBASIS_AMOUNT",
      eventPeriod: rebasisPeriod,
      new_total_reporting: rebasisReporting,
    };
    
    setEvents([...events, newEvent]);
    setRebasisPeriod("");
    setRebasisReporting("");
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" data-testid="page-title">Prepaid Schedule Calculator</h1>
          <p className="text-muted-foreground">
            FIRST_FULL_MONTH convention with Decimal.js precision
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recognition Input
            </CardTitle>
            <CardDescription>Define the prepaid schedule parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
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
            </div>

            <Separator />

            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="reporting-amount">Reporting Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reporting-amount"
                    type="text"
                    value={totalReporting}
                    onChange={(e) => setTotalReporting(e.target.value)}
                    className="pl-9"
                    data-testid="input-reporting-amount"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="local-amount">Local Amount</Label>
                <Input
                  id="local-amount"
                  type="text"
                  value={totalLocal}
                  onChange={(e) => setTotalLocal(e.target.value)}
                  data-testid="input-local-amount"
                />
              </div>
              {impliedFx && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Implied FX:</span>
                  <span className="font-mono font-medium">{impliedFx.toString()}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Onboarding Mode</Label>
              <Select value={onboardingMode} onValueChange={(v) => setOnboardingMode(v as PrepaidOnboardingMode)}>
                <SelectTrigger data-testid="select-onboarding-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTINUE_ONLY">Continue Only</SelectItem>
                  <SelectItem value="CATCH_UP">Catch-Up</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                <Label htmlFor="system-posting-start">System Posting Start (YYYY-MM)</Label>
                <Input
                  id="system-posting-start"
                  type="text"
                  placeholder="e.g., 2025-03"
                  value={systemPostingStart}
                  onChange={(e) => setSystemPostingStart(e.target.value)}
                  data-testid="input-system-posting-start"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closed-periods">Closed Periods (comma-separated)</Label>
                <Input
                  id="closed-periods"
                  type="text"
                  placeholder="e.g., 2025-02, 2025-03"
                  value={closedPeriods}
                  onChange={(e) => setClosedPeriods(e.target.value)}
                  data-testid="input-closed-periods"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Events
            </CardTitle>
            <CardDescription>Add rebasis or date change events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Rebasis Amount Event</Label>
              <div className="grid gap-2">
                <Input
                  type="text"
                  placeholder="Event Period (YYYY-MM)"
                  value={rebasisPeriod}
                  onChange={(e) => setRebasisPeriod(e.target.value)}
                  data-testid="input-rebasis-period"
                />
                <Input
                  type="text"
                  placeholder="New Total Reporting"
                  value={rebasisReporting}
                  onChange={(e) => setRebasisReporting(e.target.value)}
                  data-testid="input-rebasis-reporting"
                />
                <Button onClick={addRebasisEvent} size="sm" data-testid="button-add-rebasis">
                  Add Rebasis Event
                </Button>
              </div>
            </div>

            {events.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Active Events ({events.length})</Label>
                    <Button variant="ghost" size="sm" onClick={clearEvents} data-testid="button-clear-events">
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {events.map((event, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm">
                        <Badge variant="outline">{event.eventType}</Badge>
                        <span className="font-mono">{event.eventPeriod}</span>
                        {event.new_total_reporting !== undefined && (
                          <span className="text-muted-foreground">
                            → <CurrencyDisplay amount={Number(event.new_total_reporting)} currency="USD" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <Label>Summary</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded-md">
                  <div className="text-muted-foreground">Periods</div>
                  <div className="font-semibold">{totals.periodCount}</div>
                </div>
                <div className="p-2 bg-muted rounded-md">
                  <div className="text-muted-foreground">Total Reporting</div>
                  <div className="font-semibold">
                    <CurrencyDisplay amount={totals.totalReporting.toNumber()} currency="USD" />
                  </div>
                </div>
                <div className="p-2 bg-muted rounded-md col-span-2">
                  <div className="text-muted-foreground">Total Posting</div>
                  <div className="font-semibold">
                    <CurrencyDisplay amount={totals.totalPosting.toNumber()} currency="USD" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Period States</CardTitle>
            <CardDescription>Legend for schedule states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stateLabels).map(([state, label]) => (
              <div key={state} className="flex items-center gap-3">
                <Badge className={stateColors[state]}>{label}</Badge>
                <span className="text-sm text-muted-foreground">
                  {state === "EXTERNAL" && "Before system posting start"}
                  {state === "SYSTEM_BASE" && "Standard allocation"}
                  {state === "SYSTEM_ADJUSTED" && "Modified by event"}
                  {state === "CLOSED" && "Period is closed"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Schedule Output</CardTitle>
          <CardDescription>
            Generated periods using FIRST_FULL_MONTH convention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scheduleResults.error ? (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span>{scheduleResults.error}</span>
            </div>
          ) : scheduleResults.periods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No periods generated. Check your date inputs.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table data-testid="prepaid-schedule-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Reporting</TableHead>
                    <TableHead className="text-right">Local</TableHead>
                    <TableHead className="text-right">Posting</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleResults.periods.map((period, idx) => (
                    <TableRow key={period.period} data-testid={`period-row-${idx}`}>
                      <TableCell className="font-mono font-medium">
                        {period.period}
                      </TableCell>
                      <TableCell>
                        <Badge className={stateColors[period.state]}>
                          {stateLabels[period.state]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <CurrencyDisplay amount={period.reporting_amount.toNumber()} currency="USD" />
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        <CurrencyDisplay amount={period.local_amount.toNumber()} currency="USD" />
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <CurrencyDisplay amount={period.posting_amount.toNumber()} currency="USD" />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {period.adjustment_reason || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

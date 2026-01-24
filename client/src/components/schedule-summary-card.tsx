import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CurrencyDisplay, FxDisplay } from "@/components/currency-display";
import { ScheduleTypeBadge } from "@/components/schedule-type-badge";
import type { ScheduleMaster, PeriodLine } from "@shared/schema";
import { 
  Calendar, 
  Building2, 
  TrendingUp,
  Clock,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScheduleSummaryCardProps {
  schedule: ScheduleMaster;
  periods: PeriodLine[];
}

export function ScheduleSummaryCard({ schedule, periods }: ScheduleSummaryCardProps) {
  const completedPeriods = periods.filter(p => 
    p.state === "CLOSED" || p.state === "EXTERNAL"
  ).length;
  const totalPeriods = periods.length;
  const progress = totalPeriods > 0 ? (completedPeriods / totalPeriods) * 100 : 0;

  const recognizedAmount = periods
    .filter(p => p.state !== "EXTERNAL")
    .reduce((sum, p) => sum + p.cumulativeAmountReporting, 0);

  const latestPeriod = periods.length > 0 
    ? periods[periods.length - 1] 
    : null;

  return (
    <Card data-testid="schedule-summary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-lg">{schedule.description}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {schedule.scheduleId}
            </p>
          </div>
          <ScheduleTypeBadge type={schedule.scheduleType} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Entity
            </p>
            <p className="text-sm font-medium">{schedule.entityId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Recognition Period
            </p>
            <p className="text-sm font-medium">
              {schedule.startDate} to {schedule.endDate || "Ongoing"}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Initial Amount</span>
            <div className="text-right">
              <CurrencyDisplay 
                amount={schedule.totalAmountReportingInitial} 
                currency={schedule.reportingCurrency}
                className="font-medium"
              />
              <p className="text-xs text-muted-foreground">
                <CurrencyDisplay 
                  amount={schedule.totalAmountLocalInitial} 
                  currency={schedule.localCurrency}
                />
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              Implied FX
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Derived from reporting / local. Never edited.</p>
                </TooltipContent>
              </Tooltip>
            </span>
            <FxDisplay 
              fx={schedule.impliedFxInitial}
              localCurrency={schedule.localCurrency}
              reportingCurrency={schedule.reportingCurrency}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Progress
            </span>
            <span className="font-medium">{completedPeriods} / {totalPeriods} periods</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {latestPeriod && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Remaining Balance
              </span>
              <CurrencyDisplay 
                amount={latestPeriod.remainingAmountReporting} 
                currency={schedule.reportingCurrency}
                className="font-medium"
              />
            </div>
          </>
        )}

        {schedule.systemPostingStartPeriod && (
          <>
            <Separator />
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Badge variant="outline" className="text-xs">Late Onboarding</Badge>
              <span className="text-xs text-muted-foreground">
                System posting starts: {schedule.systemPostingStartPeriod}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

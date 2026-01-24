import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PeriodStateBadge } from "@/components/period-state-badge";
import { CurrencyDisplay } from "@/components/currency-display";
import type { PeriodLine } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PeriodScheduleTableProps {
  periods: PeriodLine[];
  localCurrency: string;
  reportingCurrency: string;
}

export function PeriodScheduleTable({ 
  periods, 
  localCurrency, 
  reportingCurrency 
}: PeriodScheduleTableProps) {
  if (periods.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No periods generated yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="period-schedule-table">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          Period Schedule
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Time-based allocation in reporting currency. Local currency shown for context only.</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Period</TableHead>
                <TableHead className="w-28">State</TableHead>
                <TableHead className="text-right w-32">{reportingCurrency}</TableHead>
                <TableHead className="text-right w-32 text-muted-foreground">{localCurrency}</TableHead>
                <TableHead className="text-right w-32">Cumulative</TableHead>
                <TableHead className="text-right w-32">Remaining</TableHead>
                <TableHead className="w-20 text-right">FX</TableHead>
                <TableHead className="min-w-40">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow 
                  key={period.period}
                  className={
                    period.state === "CLOSED" ? "bg-muted/30" : 
                    period.state === "EXTERNAL" ? "bg-muted/20 opacity-70" :
                    period.state === "SYSTEM_ADJUSTED" ? "bg-chart-4/5" : ""
                  }
                  data-testid={`period-row-${period.period}`}
                >
                  <TableCell className="font-mono text-sm">
                    {period.period}
                  </TableCell>
                  <TableCell>
                    <PeriodStateBadge state={period.state} />
                  </TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay 
                      amount={period.amountReporting} 
                      currency={reportingCurrency}
                    />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <CurrencyDisplay 
                      amount={period.amountLocal} 
                      currency={localCurrency}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay 
                      amount={period.cumulativeAmountReporting} 
                      currency={reportingCurrency}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <CurrencyDisplay 
                      amount={period.remainingAmountReporting} 
                      currency={reportingCurrency}
                    />
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">
                    {period.effectiveFx.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-40 truncate">
                    {period.adjustmentDelta !== null && (
                      <span className="text-chart-4 mr-1">
                        Adj: <CurrencyDisplay 
                          amount={period.adjustmentDelta} 
                          currency={reportingCurrency}
                          showSign
                          className="text-xs"
                        />
                      </span>
                    )}
                    {period.explanation}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

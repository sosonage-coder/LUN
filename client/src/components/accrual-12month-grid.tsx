import { useState, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ReconciliationSectionInstance, ReconciliationLineItem, AccrualLineDetail } from "@shared/schema";

interface AccrualLineRow {
  itemId: string;
  description: string;
  accrualDetail: AccrualLineDetail;
}

interface Accrual12MonthGridProps {
  sections: ReconciliationSectionInstance[];
  period: string;
  glBalance: number;
  onAddLine?: () => void;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generate12MonthPeriods(endPeriod: string): string[] {
  const [year, month] = endPeriod.split("-").map(Number);
  const periods: string[] = [];
  
  for (let i = 11; i >= 0; i--) {
    let targetMonth = month - i;
    let targetYear = year;
    
    while (targetMonth <= 0) {
      targetMonth += 12;
      targetYear -= 1;
    }
    
    periods.push(`${targetYear}-${String(targetMonth).padStart(2, "0")}`);
  }
  
  return periods;
}

function getPeriodLabel(periodStr: string): string {
  const month = parseInt(periodStr.split("-")[1], 10);
  return MONTH_LABELS[month - 1];
}

export function Accrual12MonthGrid({ sections, period, glBalance, onAddLine }: Accrual12MonthGridProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const accrualSection = sections.find(s => s.sectionType === "ACCRUAL_LINE_DETAIL");
  const fxExceptionSection = sections.find(s => s.sectionType === "FX_EXCEPTION");
  const summarySection = sections.find(s => s.sectionType === "SUMMARY_TIE_OUT");

  const accrualLines: AccrualLineRow[] = (accrualSection?.items || [])
    .filter((item: ReconciliationLineItem): item is ReconciliationLineItem & { accrualDetail: AccrualLineDetail } => 
      item.accrualDetail !== null
    )
    .map((item: ReconciliationLineItem & { accrualDetail: AccrualLineDetail }) => ({
      itemId: item.itemId,
      description: item.description,
      accrualDetail: item.accrualDetail,
    }));

  const toggleRow = (itemId: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const toggleAllRows = () => {
    if (isAllExpanded) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(accrualLines.map(l => l.itemId)));
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const periods12 = generate12MonthPeriods(period);

  const getAmountForPeriod = (movements: AccrualLineDetail["monthlyMovements"], targetPeriod: string): number | null => {
    const movement = movements.find(m => m.period === targetPeriod);
    return movement ? movement.amount : null;
  };

  const totalOpening = accrualLines.reduce((sum, line) => sum + line.accrualDetail.openingBalanceTC, 0);
  const totalEnding = accrualLines.reduce((sum, line) => sum + line.accrualDetail.endingBalanceTC, 0);
  const totalMovement = accrualLines.reduce((sum, line) => sum + line.accrualDetail.totalMovementTC, 0);
  
  const monthlyTotals = periods12.map((targetPeriod) => {
    return accrualLines.reduce((sum, line) => {
      const amt = getAmountForPeriod(line.accrualDetail.monthlyMovements, targetPeriod);
      return sum + (amt || 0);
    }, 0);
  });

  const totalConverted = accrualLines.reduce((sum, line) => 
    sum + (line.accrualDetail.convertedReportingAmount || 0), 0);
  
  const variance = glBalance - totalConverted;
  const hasTieOut = Math.abs(variance) < 0.01;

  return (
    <Card data-testid="accrual-12month-grid">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              Accrual Rollforward - 12 Month View
            </CardTitle>
            <CardDescription>
              Horizontal view of monthly accrual movements. Click rows to expand details.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAllRows}
              data-testid="button-toggle-all-rows"
            >
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </Button>
            {onAddLine && (
              <Button variant="outline" size="sm" onClick={onAddLine} data-testid="button-add-accrual-line">
                <Plus className="h-4 w-4 mr-1" />
                Add Line
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" data-testid="accrual-grid-table">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-2 py-2 text-left font-medium sticky left-0 bg-muted/50 min-w-[200px]">Description</th>
                <th className="px-2 py-2 text-right font-medium min-w-[80px]">Opening</th>
                {periods12.map((p, idx) => (
                  <th key={idx} className="px-2 py-2 text-right font-medium min-w-[70px]" title={p}>{getPeriodLabel(p)}</th>
                ))}
                <th className="px-2 py-2 text-right font-medium min-w-[90px]">Total Mvmt</th>
                <th className="px-2 py-2 text-right font-medium min-w-[90px]">Ending</th>
              </tr>
            </thead>
            <tbody>
              {accrualLines.length === 0 ? (
                <tr>
                  <td colSpan={15} className="px-2 py-8 text-center text-muted-foreground">
                    No accrual lines. Click "Add Line" to create one.
                  </td>
                </tr>
              ) : (
                accrualLines.map((line) => {
                  const isExpanded = expandedRows.has(line.itemId);
                  const detail = line.accrualDetail;
                  
                  return (
                    <Fragment key={line.itemId}>
                      <tr 
                        className="border-b cursor-pointer transition-colors"
                        onClick={() => toggleRow(line.itemId)}
                        data-testid={`accrual-row-${line.itemId}`}
                      >
                        <td className="px-2 py-2 sticky left-0 bg-background">
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">{line.description}</span>
                            {detail.accrualType === "RECURRING" && (
                              <Badge variant="outline" className="text-xs">Recurring</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-right font-mono">
                          {formatCurrency(detail.openingBalanceTC)}
                        </td>
                        {periods12.map((targetPeriod, idx) => {
                          const amt = getAmountForPeriod(detail.monthlyMovements, targetPeriod);
                          return (
                            <td key={idx} className="px-2 py-2 text-right font-mono">
                              {amt !== null && amt !== 0 ? (
                                <span className={amt < 0 ? "text-red-600" : ""}>
                                  {formatCurrency(amt)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground/50">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-2 py-2 text-right font-mono font-medium">
                          {formatCurrency(detail.totalMovementTC)}
                        </td>
                        <td className="px-2 py-2 text-right font-mono font-medium">
                          {formatCurrency(detail.endingBalanceTC)}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${line.itemId}-detail`} className="bg-muted/20 border-b">
                          <td colSpan={15} className="px-4 py-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Supplier/Vendor:</span>
                                <span className="ml-2 font-medium">{detail.supplierVendorId || "-"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">P&L Account:</span>
                                <span className="ml-2 font-medium">{detail.plAccount || "-"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Currency:</span>
                                <span className="ml-2 font-medium">{detail.transactionCurrency}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Group Account:</span>
                                <span className="ml-2 font-medium">{detail.groupAccount || "-"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">ERP FX Rate:</span>
                                <span className="ml-2 font-medium">{detail.erpFxRate?.toFixed(4) || "-"}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Converted (Reporting):</span>
                                <span className="ml-2 font-medium">
                                  {detail.convertedReportingAmount !== null 
                                    ? formatCurrency(detail.convertedReportingAmount) 
                                    : "-"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">FX Difference:</span>
                                <span className={`ml-2 font-medium ${detail.fxDifference && detail.fxDifference !== 0 ? "text-amber-600" : ""}`}>
                                  {detail.fxDifference !== null 
                                    ? formatCurrency(detail.fxDifference) 
                                    : "-"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Type:</span>
                                <span className="ml-2 font-medium">{detail.accrualType}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
              <tr className="border-t-2 border-foreground/20 bg-muted/30 font-medium">
                <td className="px-2 py-2 sticky left-0 bg-muted/30 font-bold">Total</td>
                <td className="px-2 py-2 text-right font-mono">{formatCurrency(totalOpening)}</td>
                {monthlyTotals.map((total, idx) => (
                  <td key={idx} className="px-2 py-2 text-right font-mono">
                    {total !== 0 ? formatCurrency(total) : <span className="text-muted-foreground/50">-</span>}
                  </td>
                ))}
                <td className="px-2 py-2 text-right font-mono font-bold">{formatCurrency(totalMovement)}</td>
                <td className="px-2 py-2 text-right font-mono font-bold">{formatCurrency(totalEnding)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-dashed">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground mb-1">Ending Balance (TC)</div>
              <div className="text-xl font-bold font-mono">{formatCurrency(totalEnding)}</div>
            </CardContent>
          </Card>
          <Card className="border-dashed">
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground mb-1">Converted to Reporting</div>
              <div className="text-xl font-bold font-mono">{formatCurrency(totalConverted)}</div>
            </CardContent>
          </Card>
          <Card className={`border-dashed ${hasTieOut ? "border-green-500" : "border-red-500"}`}>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                Tie-Out to GL
                {hasTieOut ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className={`text-xl font-bold font-mono ${hasTieOut ? "text-green-600" : "text-red-600"}`}>
                {hasTieOut ? "Reconciled" : `Variance: ${formatCurrency(variance)}`}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                GL Balance: {formatCurrency(glBalance)}
              </div>
            </CardContent>
          </Card>
        </div>

        {fxExceptionSection && fxExceptionSection.items.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              FX Exceptions
            </h4>
            <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 p-3">
              <ul className="text-sm space-y-1">
                {fxExceptionSection.items.map((item: ReconciliationLineItem) => (
                  <li key={item.itemId} className="flex justify-between">
                    <span>{item.description}</span>
                    <span className="font-mono">{formatCurrency(item.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

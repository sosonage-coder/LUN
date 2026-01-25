import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Building2,
  ShieldCheck
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ReconciliationSectionInstance, ReconciliationLineItem, PrepaidLineDetail } from "@shared/schema";

interface PrepaidLineRow {
  itemId: string;
  description: string;
  prepaidDetail: PrepaidLineDetail;
}

interface PrepaidScheduleGridProps {
  sections: ReconciliationSectionInstance[];
  glBalance: number;
  onAddLine?: () => void;
  onViewSchedule?: (scheduleId: string) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function PrepaidScheduleGrid({ sections, glBalance, onAddLine, onViewSchedule }: PrepaidScheduleGridProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const prepaidSection = sections.find(s => s.sectionType === "SUBLEDGER_DETAIL");
  const prepaidLines: PrepaidLineRow[] = prepaidSection?.items
    .filter((item): item is ReconciliationLineItem & { prepaidDetail: PrepaidLineDetail } => 
      item.prepaidDetail !== null
    )
    .map(item => ({
      itemId: item.itemId,
      description: item.description,
      prepaidDetail: item.prepaidDetail,
    })) || [];

  const totalAmortized = prepaidLines.reduce((sum, line) => sum + line.prepaidDetail.amountAmortizedToDate, 0);
  const totalRemaining = prepaidLines.reduce((sum, line) => sum + line.prepaidDetail.amountRemaining, 0);
  const totalPrepaid = prepaidLines.reduce((sum, line) => sum + line.prepaidDetail.totalPrepaidAmount, 0);

  const variance = glBalance - totalRemaining;
  const isReconciled = Math.abs(variance) < 0.01;

  const toggleRow = (itemId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleAll = () => {
    if (isAllExpanded) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(prepaidLines.map(line => line.itemId)));
    }
    setIsAllExpanded(!isAllExpanded);
  };

  return (
    <div className="space-y-4" data-testid="prepaid-schedule-grid">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <CardTitle className="text-lg">Prepaid Schedules</CardTitle>
              <CardDescription>
                Approved schedules serving as reconciliation support. Click row to expand details, or schedule link to view full amortization.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAll}
                data-testid="button-toggle-all-rows"
              >
                {isAllExpanded ? "Collapse All" : "Expand All"}
              </Button>
              {onAddLine && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAddLine}
                  data-testid="button-add-prepaid-line"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Prepaid
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="prepaid-grid-table">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Description</th>
                  <th className="px-3 py-2 text-left font-medium">Vendor</th>
                  <th className="px-3 py-2 text-center font-medium">Start</th>
                  <th className="px-3 py-2 text-center font-medium">End</th>
                  <th className="px-3 py-2 text-center font-medium">Term</th>
                  <th className="px-3 py-2 text-right font-medium">Total Prepaid</th>
                  <th className="px-3 py-2 text-right font-medium">Amortized</th>
                  <th className="px-3 py-2 text-right font-medium">Remaining</th>
                  <th className="px-3 py-2 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {prepaidLines.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground">
                      No approved schedules linked. Add prepaid items to begin reconciliation.
                    </td>
                  </tr>
                ) : (
                  prepaidLines.map((line) => {
                    const isExpanded = expandedRows.has(line.itemId);
                    const detail = line.prepaidDetail;
                    const progressPct = detail.totalTermMonths > 0 
                      ? Math.round((detail.monthsAmortized / detail.totalTermMonths) * 100) 
                      : 0;
                    
                    return (
                      <tr 
                        key={line.itemId}
                        className="border-b cursor-pointer transition-colors"
                        onClick={() => toggleRow(line.itemId)}
                        data-testid={`prepaid-row-${line.itemId}`}
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className="font-medium">{line.description}</span>
                            {detail.scheduleId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onViewSchedule?.(detail.scheduleId!);
                                }}
                                data-testid={`link-schedule-${line.itemId}`}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Schedule
                              </Button>
                            )}
                          </div>
                          {isExpanded && (
                            <div className="mt-3 ml-6 grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-muted-foreground border-t pt-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-3 w-3" />
                                <span>Expense Account:</span>
                                <span className="font-medium text-foreground">{detail.expenseAccount || "-"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-3 w-3" />
                                <span>Prepaid Account:</span>
                                <span className="font-medium text-foreground">{detail.prepaidAccount || "-"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Months Amortized:</span>
                                <span className="font-medium text-foreground">{detail.monthsAmortized} / {detail.totalTermMonths}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Months Remaining:</span>
                                <span className="font-medium text-foreground">{detail.monthsRemaining}</span>
                              </div>
                              {detail.isApproved && detail.approvedBy && (
                                <div className="flex items-center gap-2 col-span-2">
                                  <ShieldCheck className="h-3 w-3 text-green-600" />
                                  <span>Approved by:</span>
                                  <span className="font-medium text-foreground">{detail.approvedBy}</span>
                                  {detail.approvedAt && (
                                    <span className="text-muted-foreground">
                                      on {new Date(detail.approvedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">
                          {detail.vendorSupplier || "-"}
                        </td>
                        <td className="px-3 py-3 text-center text-muted-foreground">
                          {formatDate(detail.startDate)}
                        </td>
                        <td className="px-3 py-3 text-center text-muted-foreground">
                          {formatDate(detail.endDate)}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span>{detail.totalTermMonths}m</span>
                            <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right font-mono">
                          {formatCurrency(detail.totalPrepaidAmount)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-muted-foreground">
                          {formatCurrency(detail.amountAmortizedToDate)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono font-medium">
                          {formatCurrency(detail.amountRemaining)}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {detail.isApproved ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                {prepaidLines.length > 0 && (
                  <tr className="border-t-2 border-foreground/20 bg-muted/30 font-medium">
                    <td className="px-3 py-3 font-bold" colSpan={5}>Total</td>
                    <td className="px-3 py-3 text-right font-mono">{formatCurrency(totalPrepaid)}</td>
                    <td className="px-3 py-3 text-right font-mono">{formatCurrency(totalAmortized)}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold">{formatCurrency(totalRemaining)}</td>
                    <td className="px-3 py-3"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="prepaid-tieout-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Summary & Tie-Out</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">GL Balance (Trial Balance)</div>
              <div className="text-xl font-mono font-bold">{formatCurrency(glBalance)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Remaining (from Schedules)</div>
              <div className="text-xl font-mono font-bold">{formatCurrency(totalRemaining)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Variance</div>
              <div className={`text-xl font-mono font-bold ${isReconciled ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(variance)}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {isReconciled ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700">Reconciled</span>
                  <span className="text-muted-foreground">- Schedule balances tie to trial balance</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-amber-600">Variance</span>
                  <span className="text-muted-foreground">- Investigate difference between schedules and GL</span>
                </>
              )}
            </div>
            <Badge variant={isReconciled ? "default" : "destructive"}>
              {isReconciled ? "Ready for Certification" : "Requires Investigation"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

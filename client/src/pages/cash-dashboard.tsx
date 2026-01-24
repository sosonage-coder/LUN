import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Clock,
  ExternalLink,
  DollarSign,
  ArrowLeftRight,
  Users,
  Building2,
  Receipt,
  Landmark,
  CreditCard,
  HardDrive,
  CircleDollarSign
} from "lucide-react";
import type { CashKPIs, CashCategorySummary, CashMixBreakdown, CashMovementCategory, CashMovementStatus, CashScheduleStatus } from "@shared/schema";

const categoryLabels: Record<CashMovementCategory, string> = {
  PAYROLL: "Payroll",
  RENT: "Rent",
  CUSTOMER_RECEIPTS: "Customer Receipts",
  VENDOR_PAYMENTS: "Vendor Payments",
  INTERCOMPANY: "Intercompany",
  TAXES: "Taxes",
  DEBT_SERVICE: "Debt Service",
  CAPITAL_EXPENDITURE: "Capital Expenditure",
  OTHER: "Other",
};

const categoryIcons: Record<CashMovementCategory, typeof Banknote> = {
  PAYROLL: Users,
  RENT: Building2,
  CUSTOMER_RECEIPTS: Receipt,
  VENDOR_PAYMENTS: CreditCard,
  INTERCOMPANY: ArrowLeftRight,
  TAXES: Landmark,
  DEBT_SERVICE: CircleDollarSign,
  CAPITAL_EXPENDITURE: HardDrive,
  OTHER: DollarSign,
};

const categoryColors: Record<CashMovementCategory, string> = {
  PAYROLL: "bg-blue-500",
  RENT: "bg-purple-500",
  CUSTOMER_RECEIPTS: "bg-emerald-500",
  VENDOR_PAYMENTS: "bg-orange-500",
  INTERCOMPANY: "bg-cyan-500",
  TAXES: "bg-red-500",
  DEBT_SERVICE: "bg-amber-500",
  CAPITAL_EXPENDITURE: "bg-indigo-500",
  OTHER: "bg-gray-500",
};

const statusColors: Record<CashMovementStatus, string> = {
  OK: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  NEEDS_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  LOCKED: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

const scheduleStatusColors: Record<CashScheduleStatus, string> = {
  COMPLETE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  NEEDS_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  LOCKED: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  NO_TRANSACTIONS: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

const scheduleStatusIcons: Record<CashScheduleStatus, typeof CheckCircle2> = {
  COMPLETE: CheckCircle2,
  NEEDS_REVIEW: AlertTriangle,
  LOCKED: Lock,
  NO_TRANSACTIONS: Clock,
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export default function CashDashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery<CashKPIs>({
    queryKey: ["/api/cash/kpis"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<CashCategorySummary[]>({
    queryKey: ["/api/cash/categories"],
  });

  const { data: mix, isLoading: mixLoading } = useQuery<CashMixBreakdown[]>({
    queryKey: ["/api/cash/mix"],
  });

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="cash-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="page-title">Cash Schedule Dashboard</h1>
          <p className="text-muted-foreground">Level 0 — Is cash understood this period?</p>
        </div>
        <div className="flex items-center gap-2">
          {kpis && (
            <Badge className={scheduleStatusColors[kpis.status]} variant="secondary">
              {(() => {
                const StatusIcon = scheduleStatusIcons[kpis.status];
                return <StatusIcon className="h-3 w-3 mr-1" />;
              })()}
              {kpis.status === "COMPLETE" ? "Complete" : 
               kpis.status === "NEEDS_REVIEW" ? "Needs Review" :
               kpis.status === "LOCKED" ? "Locked" : "No Transactions"}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card data-testid="kpi-opening-cash">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Opening Cash (Bank)</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold" data-testid="value-opening-cash">
                {formatCurrency(kpis?.openingCashBank ?? 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Reference only</p>
          </CardContent>
        </Card>

        <Card data-testid="kpi-closing-cash">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closing Cash (Bank)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold" data-testid="value-closing-cash">
                {formatCurrency(kpis?.closingCashBank ?? 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Reference only</p>
          </CardContent>
        </Card>

        <Card data-testid="kpi-net-movement">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Cash Movement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${(kpis?.netCashMovement ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`} data-testid="value-net-movement">
                {(kpis?.netCashMovement ?? 0) >= 0 ? "+" : ""}{formatCurrency(kpis?.netCashMovement ?? 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Explained downstream</p>
          </CardContent>
        </Card>

        <Card data-testid="kpi-fx-impact">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">FX Impact</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${(kpis?.fxImpact ?? 0) >= 0 ? "text-blue-500" : "text-orange-500"}`} data-testid="value-fx-impact">
                {(kpis?.fxImpact ?? 0) >= 0 ? "+" : ""}{formatCurrency(kpis?.fxImpact ?? 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Isolated</p>
          </CardContent>
        </Card>

        <Card data-testid="kpi-unclassified">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unclassified Cash</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {kpisLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${(kpis?.unclassifiedCashPercent ?? 0) > 5 ? "text-red-500" : (kpis?.unclassifiedCashPercent ?? 0) > 0 ? "text-amber-500" : "text-emerald-500"}`} data-testid="value-unclassified">
                {formatPercent(kpis?.unclassifiedCashPercent ?? 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Control KPI</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" data-testid="movement-categories-card">
          <CardHeader>
            <CardTitle>Movement Categories</CardTitle>
            <CardDescription>Cash movements by category for current period</CardDescription>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Inflows</TableHead>
                      <TableHead className="text-right">Outflows</TableHead>
                      <TableHead className="text-right">Net Movement</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.map((cat) => {
                      const Icon = categoryIcons[cat.category];
                      return (
                        <TableRow key={cat.category} data-testid={`category-row-${cat.category.toLowerCase().replace(/_/g, '-')}`} className="hover-elevate">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${categoryColors[cat.category]}`} />
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <Link href={`/cash/${cat.category.toLowerCase().replace(/_/g, "-")}`} className="font-medium hover:underline">
                                {categoryLabels[cat.category]}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-emerald-500">
                            +{formatCurrency(cat.inflows)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-red-500">
                            -{formatCurrency(cat.outflows)}
                          </TableCell>
                          <TableCell className={`text-right font-mono font-medium ${cat.netMovement >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {cat.netMovement >= 0 ? "+" : ""}{formatCurrency(cat.netMovement)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={statusColors[cat.status]} variant="secondary">
                              {cat.status === "OK" ? (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              ) : cat.status === "NEEDS_REVIEW" ? (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              ) : (
                                <Lock className="h-3 w-3 mr-1" />
                              )}
                              {cat.status === "OK" ? "OK" : cat.status === "NEEDS_REVIEW" ? "Review" : "Locked"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/cash/${cat.category.toLowerCase().replace(/_/g, "-")}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="cash-flow-mix-card">
          <CardHeader>
            <CardTitle>Cash Flow Mix</CardTitle>
            <CardDescription>Net movement by category</CardDescription>
          </CardHeader>
          <CardContent>
            {mixLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {mix?.map((item) => (
                  <div key={item.category} className="space-y-2" data-testid={`mix-${item.category.toLowerCase().replace(/_/g, '-')}`}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${categoryColors[item.category]}`} />
                        <span>{categoryLabels[item.category]}</span>
                      </div>
                      <span className={`font-mono ${item.amount >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {item.amount >= 0 ? "+" : ""}{formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${categoryColors[item.category]} transition-all duration-500`}
                        style={{ width: `${Math.abs(item.percentage)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {formatPercent(Math.abs(item.percentage))} of total movement
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="level-info-card">
        <CardHeader>
          <CardTitle className="text-lg">Level 0 — Cash Category Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Question Answered:</strong> Is cash understood this period?</p>
            <p><strong>Audience:</strong> Controller, Reviewer</p>
            <p className="text-xs border-l-2 border-muted pl-3 mt-4">
              This level exists only to surface risk. No bank accounts, transactions, or tagging is shown here.
              Drill down into movement categories to understand why cash changed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

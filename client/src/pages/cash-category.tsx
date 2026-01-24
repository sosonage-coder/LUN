import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ExternalLink,
  DollarSign,
  ArrowLeftRight,
  RefreshCw,
  Shuffle,
  Zap
} from "lucide-react";
import type { CashMovementSummary, CashMovementCategory, CashFlowType, CashNature, CashMovementStatus } from "@shared/schema";

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

const flowTypeLabels: Record<CashFlowType, string> = {
  OPERATING: "Operating",
  INVESTING: "Investing",
  FINANCING: "Financing",
};

const flowTypeColors: Record<CashFlowType, string> = {
  OPERATING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  INVESTING: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  FINANCING: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

const natureLabels: Record<CashNature, string> = {
  RECURRING: "Recurring",
  VARIABLE: "Variable",
  ONE_OFF: "One-off",
};

const natureIcons: Record<CashNature, typeof RefreshCw> = {
  RECURRING: RefreshCw,
  VARIABLE: Shuffle,
  ONE_OFF: Zap,
};

const statusColors: Record<CashMovementStatus, string> = {
  OK: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  NEEDS_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  LOCKED: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CashCategoryPage() {
  const params = useParams<{ category: string }>();
  const categoryParam = params.category?.toUpperCase().replace(/-/g, "_") as CashMovementCategory;
  
  const { data: movements, isLoading } = useQuery<CashMovementSummary[]>({
    queryKey: [`/api/cash/movements?category=${params.category}`],
  });

  const filteredMovements = movements?.filter(m => m.movementCategory === categoryParam) ?? [];
  
  const totalInflows = filteredMovements.reduce((sum, m) => sum + m.inflows, 0);
  const totalOutflows = filteredMovements.reduce((sum, m) => sum + m.outflows, 0);
  const totalNetMovement = filteredMovements.reduce((sum, m) => sum + m.netMovement, 0);
  const totalFxImpact = filteredMovements.reduce((sum, m) => sum + m.fxImpact, 0);

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="cash-category-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cash">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold" data-testid="page-title">{categoryLabels[categoryParam] || params.category}</h1>
          <p className="text-muted-foreground">Level 1 — Why did cash change in this category?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="kpi-movements">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Movements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="value-movements">
                {filteredMovements.length}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-inflows">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Inflows</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-emerald-500" data-testid="value-inflows">
                +{formatCurrency(totalInflows)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-outflows">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Outflows</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-500" data-testid="value-outflows">
                -{formatCurrency(totalOutflows)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-net">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Movement</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${totalNetMovement >= 0 ? "text-emerald-500" : "text-red-500"}`} data-testid="value-net">
                {totalNetMovement >= 0 ? "+" : ""}{formatCurrency(totalNetMovement)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="movements-table-card">
        <CardHeader>
          <CardTitle>Movement Summary</CardTitle>
          <CardDescription>One row = one cash movement pattern for current period</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredMovements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No movements found for this category
            </div>
          ) : (
            <div className="rounded-md border">
              <Table data-testid="movements-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity</TableHead>
                    <TableHead>Cash Flow Type</TableHead>
                    <TableHead>Nature</TableHead>
                    <TableHead className="text-right">Inflows</TableHead>
                    <TableHead className="text-right">Outflows</TableHead>
                    <TableHead className="text-right">Net Movement</TableHead>
                    <TableHead className="text-right">FX Impact</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement) => {
                    const NatureIcon = natureIcons[movement.nature];
                    return (
                      <TableRow key={movement.id} data-testid={`movement-row-${movement.id}`} className="hover-elevate">
                        <TableCell className="font-medium">{movement.entityId}</TableCell>
                        <TableCell>
                          <Badge className={flowTypeColors[movement.cashFlowType]} variant="secondary">
                            {flowTypeLabels[movement.cashFlowType]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <NatureIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{natureLabels[movement.nature]}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-emerald-500">
                          {movement.inflows > 0 ? `+${formatCurrency(movement.inflows)}` : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono text-red-500">
                          {movement.outflows > 0 ? `-${formatCurrency(movement.outflows)}` : "-"}
                        </TableCell>
                        <TableCell className={`text-right font-mono font-medium ${movement.netMovement >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {movement.netMovement >= 0 ? "+" : ""}{formatCurrency(movement.netMovement)}
                        </TableCell>
                        <TableCell className={`text-right font-mono ${movement.fxImpact !== 0 ? (movement.fxImpact > 0 ? "text-blue-500" : "text-orange-500") : "text-muted-foreground"}`}>
                          {movement.fxImpact !== 0 ? (movement.fxImpact > 0 ? "+" : "") + formatCurrency(movement.fxImpact) : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusColors[movement.status]} variant="secondary">
                            {movement.status === "OK" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : movement.status === "NEEDS_REVIEW" ? (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            ) : (
                              <Lock className="h-3 w-3 mr-1" />
                            )}
                            {movement.status === "OK" ? "OK" : movement.status === "NEEDS_REVIEW" ? "Review" : "Locked"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/cash/${params.category}/movement/${movement.id}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="fx-summary-card">
          <CardHeader>
            <CardTitle className="text-lg">FX Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total FX Impact</span>
                <span className={`font-mono font-medium ${totalFxImpact >= 0 ? "text-blue-500" : "text-orange-500"}`}>
                  {totalFxImpact >= 0 ? "+" : ""}{formatCurrency(totalFxImpact)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground border-l-2 border-muted pl-3">
                FX is never embedded in movements. It is always isolated and shown separately.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="level-info-card">
          <CardHeader>
            <CardTitle className="text-lg">Level 1 — Movement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Question Answered:</strong> Why did cash change in this category?</p>
              <p><strong>Audience:</strong> Preparer, Reviewer, Controller</p>
              <p className="text-xs border-l-2 border-muted pl-3 mt-4">
                This level shows movement patterns, not individual transactions. 
                Click through to Level 2 to see what makes up each movement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

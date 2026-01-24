import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingDown,
  Building2,
  Users,
  Receipt,
  Landmark,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Lock
} from "lucide-react";
import type { CashMovementSummary, CashMovementStatus } from "@shared/schema";

type OpsSubcategory = "PAYROLL" | "RENT" | "TAXES" | "UTILITIES" | "INSURANCE";

const subcategoryLabels: Record<OpsSubcategory, string> = {
  PAYROLL: "Payroll",
  RENT: "Rent & Facilities",
  TAXES: "Taxes",
  UTILITIES: "Utilities",
  INSURANCE: "Insurance",
};

const subcategoryIcons: Record<OpsSubcategory, typeof Users> = {
  PAYROLL: Users,
  RENT: Building2,
  TAXES: Landmark,
  UTILITIES: Receipt,
  INSURANCE: CreditCard,
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

export default function CashOpsExpensesPage() {
  const { data: movements, isLoading } = useQuery<CashMovementSummary[]>({
    queryKey: ["/api/cash/ops-expenses"],
  });

  const opsMovements = movements ?? [];
  
  const totalOutflows = opsMovements.reduce((sum, m) => sum + m.outflows, 0);
  const totalFxImpact = opsMovements.reduce((sum, m) => sum + m.fxImpact, 0);

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="cash-ops-expenses-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cash">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold" data-testid="page-title">Ops Expenses</h1>
          <p className="text-muted-foreground">Level 1 — Operational expense categories breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="kpi-subcategories">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subcategories</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="value-subcategories">
                {opsMovements.length}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-total-expenses">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-500" data-testid="value-expenses">
                -{formatCurrency(totalOutflows)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-fx-impact">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">FX Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${totalFxImpact >= 0 ? "text-emerald-500" : "text-orange-500"}`} data-testid="value-fx">
                {totalFxImpact >= 0 ? "+" : ""}{formatCurrency(totalFxImpact)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="ops-subcategories-card">
        <CardHeader>
          <CardTitle>Expense Subcategories</CardTitle>
          <CardDescription>Payroll, Rent, Taxes and other operational costs</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : opsMovements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No operational expenses found
            </div>
          ) : (
            <div className="rounded-md border">
              <Table data-testid="ops-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Subcategory</TableHead>
                    <TableHead className="text-right">Outflows</TableHead>
                    <TableHead className="text-right">FX Impact</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opsMovements.map((movement) => {
                    const subcategory = movement.movementCategory as OpsSubcategory;
                    const Icon = subcategoryIcons[subcategory] || Building2;
                    return (
                      <TableRow key={movement.id} data-testid={`ops-row-${movement.id}`} className="hover-elevate">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{subcategoryLabels[subcategory] || movement.movementCategory}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-red-500">
                          -{formatCurrency(movement.outflows)}
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
                            <Link href={`/cash/ops-expenses/movement/${movement.id}`}>
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
    </div>
  );
}

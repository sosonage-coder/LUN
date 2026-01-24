import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  FileText,
  Building2,
  Banknote
} from "lucide-react";
import type { CashMovementDetail, CashMovementCategory } from "@shared/schema";

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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CashMovementDetailPage() {
  const params = useParams<{ category: string; id: string }>();
  const categoryParam = params.category?.toUpperCase().replace(/-/g, "_") as CashMovementCategory;
  
  // Level 2: Fetch patterns for specific movement ID
  const { data: details, isLoading } = useQuery<CashMovementDetail[]>({
    queryKey: [`/api/cash/movements/${params.id}/details`],
  });

  // Use details directly - API returns data specific to the movement ID
  const patternDetails = details ?? [];
  
  const totalAmount = patternDetails.reduce((sum, d) => {
    return sum + (d.direction === "INFLOW" ? d.amount : -d.amount);
  }, 0);
  
  const totalVariance = patternDetails.reduce((sum, d) => sum + d.varianceVsExpected, 0);
  const unexpectedCount = patternDetails.filter(d => !d.expected).length;

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="cash-movement-detail-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/cash/${params.category}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold" data-testid="page-title">
            {categoryLabels[categoryParam] || params.category} — Movement Detail
          </h1>
          <p className="text-muted-foreground">Level 2 — What makes up this movement?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card data-testid="kpi-patterns">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patterns</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="value-patterns">
                {patternDetails.length}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-total">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Period Total</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${totalAmount >= 0 ? "text-emerald-500" : "text-red-500"}`} data-testid="value-total">
                {totalAmount >= 0 ? "+" : ""}{formatCurrency(totalAmount)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-variance">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Variance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${totalVariance === 0 ? "text-muted-foreground" : totalVariance > 0 ? "text-emerald-500" : "text-red-500"}`} data-testid="value-variance">
                {totalVariance >= 0 ? "+" : ""}{formatCurrency(totalVariance)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-unexpected">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unexpected Items</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className={`text-2xl font-bold ${unexpectedCount > 0 ? "text-amber-500" : "text-emerald-500"}`} data-testid="value-unexpected">
                {unexpectedCount}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="patterns-table-card">
        <CardHeader>
          <CardTitle>Cash Movement Patterns</CardTitle>
          <CardDescription>One row = one classified cash pattern (not transactions)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : patternDetails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No patterns found for this movement
            </div>
          ) : (
            <div className="rounded-md border">
              <Table data-testid="patterns-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Pattern Name</TableHead>
                    <TableHead>Counterparty</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead className="text-center">Expected?</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Variance vs Expected</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patternDetails.map((detail) => (
                    <TableRow key={detail.id} data-testid={`pattern-row-${detail.id}`} className="hover-elevate">
                      <TableCell className="font-medium">{detail.patternName}</TableCell>
                      <TableCell>
                        {detail.counterparty ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span>{detail.counterparty}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={detail.direction === "INFLOW" 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }
                        >
                          {detail.direction === "INFLOW" ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {detail.direction === "INFLOW" ? "Inflow" : "Outflow"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {detail.expected ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${detail.direction === "INFLOW" ? "text-emerald-500" : "text-red-500"}`}>
                        {detail.direction === "INFLOW" ? "+" : "-"}{formatCurrency(detail.amount)}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${detail.varianceVsExpected === 0 ? "text-muted-foreground" : detail.varianceVsExpected > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {detail.varianceVsExpected === 0 ? "-" : (detail.varianceVsExpected > 0 ? "+" : "") + formatCurrency(detail.varianceVsExpected)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {detail.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-48 truncate">
                        {detail.notes || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert data-testid="level-info-alert">
        <Info className="h-4 w-4" />
        <AlertTitle>Level 2 — Movement Detail</AlertTitle>
        <AlertDescription>
          <p className="mt-2"><strong>Question Answered:</strong> What makes up this movement?</p>
          <p><strong>Audience:</strong> Preparer</p>
          <p className="text-xs mt-3 border-l-2 border-muted pl-3">
            This level shows patterns, not individual bank transactions.
            Patterns are classified movements that explain behavior.
            Notes are required if there is a variance from expected.
          </p>
        </AlertDescription>
      </Alert>

      <Card data-testid="bank-context-card">
        <CardHeader>
          <CardTitle className="text-lg">Bank Account Context (Level 3 — Read-Only)</CardTitle>
          <CardDescription>Where did cash actually move?</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Bank balances shown are sourced directly from financial institutions and are not reconciled to the general ledger.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground">
            <p>Bank account details are available at Level 3 for audit purposes.</p>
            <p className="mt-2">This level is read-only — no edits, no tagging, no certification.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

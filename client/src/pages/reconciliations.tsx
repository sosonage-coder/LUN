import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileCheck, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  CircleDot,
  FileQuestion,
  Loader2,
  ChevronDown,
  ChevronRight,
  Building2,
  DollarSign,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { ReconciliationKPIs, ReconciliationAccount, Reconciliation } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CircleDot }> = {
  NOT_STARTED: { label: "Not Started", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: CircleDot },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", icon: Clock },
  PENDING_REVIEW: { label: "Pending Review", color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300", icon: FileQuestion },
  REVIEWED: { label: "Reviewed", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300", icon: FileCheck },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", icon: CheckCircle2 },
  LOCKED: { label: "Locked", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", icon: CheckCircle2 },
};

const accountTypeLabels: Record<string, string> = {
  CASH: "Cash",
  ACCOUNTS_RECEIVABLE: "Accounts Receivable",
  ACCOUNTS_PAYABLE: "Accounts Payable",
  PREPAID: "Prepaid Expenses",
  FIXED_ASSET: "Fixed Assets",
  ACCRUAL: "Accruals",
  INVENTORY: "Inventory",
  INTERCOMPANY: "Intercompany",
  DEBT: "Debt",
  EQUITY: "Equity",
  OTHER: "Other",
};

const accountTypeIcons: Record<string, typeof DollarSign> = {
  CASH: DollarSign,
  ACCOUNTS_RECEIVABLE: TrendingUp,
  ACCOUNTS_PAYABLE: Building2,
  PREPAID: Clock,
  FIXED_ASSET: Building2,
  ACCRUAL: Clock,
  INVENTORY: Building2,
  INTERCOMPANY: Building2,
  DEBT: DollarSign,
  EQUITY: DollarSign,
  OTHER: FileCheck,
};

export default function ReconciliationsPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useQuery<ReconciliationKPIs>({
    queryKey: ["/api/reconciliations/kpis"],
  });

  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useQuery<ReconciliationAccount[]>({
    queryKey: ["/api/reconciliations/accounts"],
  });

  const { data: reconciliations, isLoading: recsLoading, error: recsError } = useQuery<Reconciliation[]>({
    queryKey: ["/api/reconciliations?period=2026-01"],
  });

  const isLoading = kpisLoading || accountsLoading || recsLoading;
  const hasError = kpisError || accountsError || recsError;

  const accountsByType = accounts?.reduce((acc, account) => {
    if (!acc[account.accountType]) {
      acc[account.accountType] = [];
    }
    acc[account.accountType].push(account);
    return acc;
  }, {} as Record<string, ReconciliationAccount[]>) || {};

  const getReconciliationForAccount = (accountId: string) => {
    return reconciliations?.find(r => r.accountId === accountId);
  };

  const getCategorySummary = (accountType: string) => {
    const accts = accountsByType[accountType] || [];
    const recs = accts.map(a => getReconciliationForAccount(a.accountId)).filter(Boolean);
    const approved = recs.filter(r => r?.status === "APPROVED" || r?.status === "LOCKED").length;
    const pending = recs.filter(r => r?.status === "PENDING_REVIEW" || r?.status === "REVIEWED").length;
    const inProgress = recs.filter(r => r?.status === "IN_PROGRESS").length;
    const notStarted = recs.filter(r => r?.status === "NOT_STARTED").length + (accts.length - recs.length);
    const totalGLBalance = accts.reduce((sum, a) => sum + (getReconciliationForAccount(a.accountId)?.glBalance || 0), 0);
    return { total: accts.length, approved, pending, inProgress, notStarted, totalGLBalance };
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCompletionPercent = (summary: ReturnType<typeof getCategorySummary>) => {
    if (summary.total === 0) return 0;
    return Math.round((summary.approved / summary.total) * 100);
  };

  return (
    <div className="p-6 space-y-6" data-testid="reconciliations-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reconciliations</h1>
          <p className="text-muted-foreground mt-1">
            Account reconciliation workspace - January 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/reconciliations/templates">
            <Button variant="outline" data-testid="button-templates">
              <FileCheck className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </Link>
          <Button data-testid="button-new-reconciliation">
            <Plus className="h-4 w-4 mr-2" />
            New Reconciliation
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : hasError ? (
        <Card className="border-destructive" data-testid="error-state">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Failed to Load Data</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Unable to load reconciliation data. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()} data-testid="button-retry">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="kpi-total-accounts">{kpis?.totalAccounts || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Reconciled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600" data-testid="kpi-reconciled">{kpis?.reconciledCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpis?.completionPercentage || 0}% complete</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600" data-testid="kpi-pending">{kpis?.pendingReviewCount || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Not Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground" data-testid="kpi-not-started">{kpis?.notStartedCount || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Accounts by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(accountsByType).map(([accountType, accts]) => {
                const summary = getCategorySummary(accountType);
                const isExpanded = expandedCategories.has(accountType);
                const completionPercent = getCompletionPercent(summary);
                const CategoryIcon = accountTypeIcons[accountType] || FileCheck;

                return (
                  <Collapsible
                    key={accountType}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(accountType)}
                  >
                    <CollapsibleTrigger asChild>
                      <div
                        className="flex items-center justify-between p-4 rounded-lg border hover-elevate cursor-pointer transition-all"
                        data-testid={`category-${accountType.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                            <CategoryIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{accountTypeLabels[accountType] || accountType}</span>
                              <Badge variant="secondary">{summary.total}</Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span>{formatCurrency(summary.totalGLBalance)} total</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden md:flex items-center gap-3">
                            {summary.approved > 0 && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-sm">{summary.approved}</span>
                              </div>
                            )}
                            {summary.pending > 0 && (
                              <div className="flex items-center gap-1 text-amber-600">
                                <FileQuestion className="h-4 w-4" />
                                <span className="text-sm">{summary.pending}</span>
                              </div>
                            )}
                            {summary.inProgress > 0 && (
                              <div className="flex items-center gap-1 text-blue-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">{summary.inProgress}</span>
                              </div>
                            )}
                            {summary.notStarted > 0 && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <CircleDot className="h-4 w-4" />
                                <span className="text-sm">{summary.notStarted}</span>
                              </div>
                            )}
                          </div>
                          <div className="hidden sm:block w-24">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all duration-300" 
                                style={{ width: `${completionPercent}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 text-right">
                              {completionPercent}%
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 ml-4 border-l-2 border-muted pl-4 space-y-2">
                        {accts.map((account) => {
                          const rec = getReconciliationForAccount(account.accountId);
                          const status = rec?.status || "NOT_STARTED";
                          const config = statusConfig[status];
                          const StatusIcon = config.icon;

                          return (
                            <div
                              key={account.accountId}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate"
                              data-testid={`account-row-${account.accountCode}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="font-mono text-sm font-medium">{account.accountCode}</div>
                                <div className="text-sm">{account.accountName}</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-sm font-medium text-right">
                                  {formatCurrency(rec?.glBalance || 0)}
                                </div>
                                {rec?.variance !== undefined && rec.variance !== 0 && (
                                  <Badge variant={rec.variance === 0 ? "secondary" : "destructive"} className="text-xs">
                                    {formatCurrency(rec.variance)} var
                                  </Badge>
                                )}
                                <Badge className={`${config.color} text-xs`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                                {rec && (
                                  <Link href={`/reconciliations/workspace/${rec.reconciliationId}`}>
                                    <Button size="sm" variant="ghost" data-testid={`button-open-${account.accountId}`}>
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Reconciliations - January 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Account</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">GL Balance</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Variance</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts?.map((account) => {
                      const rec = getReconciliationForAccount(account.accountId);
                      const status = rec?.status || "NOT_STARTED";
                      const config = statusConfig[status];
                      const StatusIcon = config.icon;

                      return (
                        <tr key={account.accountId} className="border-b last:border-0" data-testid={`table-row-${account.accountCode}`}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{account.accountCode}</div>
                            <div className="text-sm text-muted-foreground">{account.accountName}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{accountTypeLabels[account.accountType]}</Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {formatCurrency(rec?.glBalance || 0)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {rec?.variance !== undefined && rec.variance !== 0 ? (
                              <span className="text-destructive">{formatCurrency(rec.variance)}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={config.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {rec ? (
                              <Link href={`/reconciliations/workspace/${rec.reconciliationId}`}>
                                <Button size="sm" variant="outline" data-testid={`button-open-${account.accountId}`}>
                                  Open
                                </Button>
                              </Link>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                Start
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

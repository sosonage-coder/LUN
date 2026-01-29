import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Loader2, 
  AlertCircle,
  FileCheck,
  Clock,
  CheckCircle2,
  CircleDot,
  FileQuestion,
  DollarSign,
  TrendingUp,
  Building2,
  Layers,
  ChevronRight,
  ExternalLink,
  User
} from "lucide-react";
import {
  PivotViewSelector,
  PivotView,
  CollapsibleGridRow,
  DashboardKPICards,
  FilterBar,
  GridItemRow,
} from "@/components/pivot";
import type { 
  ReconciliationKPIs, 
  ReconciliationAccount, 
  Reconciliation,
  ReconciliationAccountType,
  ReconciliationAccountGroup,
  Entity
} from "@shared/schema";
import { accountGroupLabels, accountGroupToType } from "@shared/schema";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CircleDot }> = {
  NOT_STARTED: { label: "Not Started", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: CircleDot },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", icon: Clock },
  PENDING_REVIEW: { label: "Pending Review", color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300", icon: FileQuestion },
  REVIEWED: { label: "Reviewed", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300", icon: FileCheck },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", icon: CheckCircle2 },
  LOCKED: { label: "Locked", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", icon: CheckCircle2 },
};

const accountTypeLabels: Record<ReconciliationAccountType, string> = {
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

const accountTypeIcons: Record<ReconciliationAccountType, typeof DollarSign> = {
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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface AccountWithRecon {
  account: ReconciliationAccount;
  reconciliation: Reconciliation | undefined;
}

export default function ReconciliationGrid() {
  const [pivotView, setPivotView] = useState<PivotView>("by-type");
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period] = useState("2026-01");

  const { data: entities = [] } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const { data: kpis, isLoading: kpisLoading } = useQuery<ReconciliationKPIs>({
    queryKey: ["/api/reconciliations/kpis"],
  });

  const { data: accounts = [], isLoading: accountsLoading } = useQuery<ReconciliationAccount[]>({
    queryKey: ["/api/reconciliations/accounts"],
  });

  const { data: reconciliations = [], isLoading: recsLoading } = useQuery<Reconciliation[]>({
    queryKey: [`/api/reconciliations?period=${period}`],
  });

  const isLoading = kpisLoading || accountsLoading || recsLoading;

  const accountsWithRecs: AccountWithRecon[] = useMemo(() => {
    return accounts.map(account => ({
      account,
      reconciliation: reconciliations.find(r => r.accountId === account.accountId),
    }));
  }, [accounts, reconciliations]);

  const filteredAccounts = useMemo(() => {
    return accountsWithRecs.filter(({ account, reconciliation }) => {
      const matchesSearch = searchQuery === "" || 
        account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.accountCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEntity = entityFilter === "all" || account.entityId === entityFilter;
      const matchesStatus = statusFilter === "all" || 
        (reconciliation?.status === statusFilter) ||
        (statusFilter === "NOT_STARTED" && !reconciliation);
      return matchesSearch && matchesEntity && matchesStatus;
    });
  }, [accountsWithRecs, searchQuery, entityFilter, statusFilter]);

  const kpiCards = useMemo(() => {
    if (!kpis) return [];
    return [
      { title: "Total Accounts", value: kpis.totalAccounts, color: "default" as const },
      { 
        title: "Reconciled", 
        value: kpis.reconciledCount, 
        color: "success" as const, 
        subtitle: `${kpis.completionPercentage}% complete` 
      },
      { title: "Pending Review", value: kpis.pendingReviewCount, color: "warning" as const },
      { title: "Not Started", value: kpis.notStartedCount, color: "muted" as const },
    ];
  }, [kpis]);

  const getStatusBadges = (items: AccountWithRecon[]) => {
    const approved = items.filter(i => i.reconciliation?.status === "APPROVED" || i.reconciliation?.status === "LOCKED").length;
    const pending = items.filter(i => i.reconciliation?.status === "PENDING_REVIEW" || i.reconciliation?.status === "REVIEWED").length;
    const inProgress = items.filter(i => i.reconciliation?.status === "IN_PROGRESS").length;
    return [
      { label: "Approved", count: approved, color: "text-emerald-600" },
      { label: "Pending", count: pending, color: "text-amber-600" },
      { label: "In Progress", count: inProgress, color: "text-blue-600" },
    ];
  };

  const renderAccountRow = ({ account, reconciliation }: AccountWithRecon) => {
    const status = reconciliation?.status || "NOT_STARTED";
    const balance = reconciliation?.glBalance || 0;
    const variance = reconciliation?.variance || 0;
    
    return (
      <GridItemRow
        key={account.accountId}
        id={account.accountId}
        name={`${account.accountCode} - ${account.accountName}`}
        href={reconciliation ? `/reconciliations/workspace/${reconciliation.reconciliationId}` : "#"}
        status={statusConfig[status]}
        amount={balance}
        formatAmount={formatCurrency}
        secondaryInfo={variance !== 0 ? `Variance: ${formatCurrency(variance)}` : undefined}
        owner={reconciliation?.preparedBy || "Unassigned"}
        testId={`account-${account.accountId}`}
      />
    );
  };

  const renderByType = () => {
    const accountTypes = Array.from(new Set(accounts.map(a => a.accountType))) as ReconciliationAccountType[];
    
    return (
      <Card>
        <CardContent className="p-0">
          {accountTypes.map((type) => {
            const typeAccounts = filteredAccounts.filter(a => a.account.accountType === type);
            if (typeAccounts.length === 0) return null;
            
            const Icon = accountTypeIcons[type];
            const approved = typeAccounts.filter(a => 
              a.reconciliation?.status === "APPROVED" || a.reconciliation?.status === "LOCKED"
            ).length;
            const totalBalance = typeAccounts.reduce((sum, a) => sum + (a.reconciliation?.glBalance || 0), 0);
            
            const groupsForType = Array.from(new Set(typeAccounts.map(a => a.account.accountGroup))) as ReconciliationAccountGroup[];
            
            return (
              <CollapsibleGridRow
                key={type}
                title={accountTypeLabels[type]}
                icon={<Icon className="h-4 w-4" />}
                count={typeAccounts.length}
                completedCount={approved}
                totalAmount={totalBalance}
                formatAmount={formatCurrency}
                defaultOpen={typeAccounts.length <= 10}
                testId={`type-${type.toLowerCase()}`}
                statusBadges={getStatusBadges(typeAccounts)}
              >
                {groupsForType.map((group) => {
                  const groupAccounts = typeAccounts.filter(a => a.account.accountGroup === group);
                  const groupApproved = groupAccounts.filter(a => 
                    a.reconciliation?.status === "APPROVED" || a.reconciliation?.status === "LOCKED"
                  ).length;
                  const groupBalance = groupAccounts.reduce((sum, a) => sum + (a.reconciliation?.glBalance || 0), 0);
                  
                  return (
                    <CollapsibleGridRow
                      key={group}
                      title={accountGroupLabels[group]}
                      icon={<Layers className="h-3 w-3" />}
                      count={groupAccounts.length}
                      completedCount={groupApproved}
                      totalAmount={groupBalance}
                      formatAmount={formatCurrency}
                      level={1}
                      defaultOpen={groupAccounts.length <= 5}
                      testId={`group-${group.toLowerCase()}`}
                      statusBadges={getStatusBadges(groupAccounts)}
                    >
                      {groupAccounts.map(renderAccountRow)}
                    </CollapsibleGridRow>
                  );
                })}
              </CollapsibleGridRow>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const renderByGroup = () => {
    const groups = Array.from(new Set(filteredAccounts.map(a => a.account.accountGroup))) as ReconciliationAccountGroup[];
    
    return (
      <Card>
        <CardContent className="p-0">
          {groups.map((group) => {
            const groupAccounts = filteredAccounts.filter(a => a.account.accountGroup === group);
            const approved = groupAccounts.filter(a => 
              a.reconciliation?.status === "APPROVED" || a.reconciliation?.status === "LOCKED"
            ).length;
            const totalBalance = groupAccounts.reduce((sum, a) => sum + (a.reconciliation?.glBalance || 0), 0);
            
            return (
              <CollapsibleGridRow
                key={group}
                title={accountGroupLabels[group]}
                icon={<Layers className="h-4 w-4" />}
                count={groupAccounts.length}
                completedCount={approved}
                totalAmount={totalBalance}
                formatAmount={formatCurrency}
                defaultOpen={groupAccounts.length <= 8}
                testId={`group-${group.toLowerCase()}`}
                statusBadges={getStatusBadges(groupAccounts)}
              >
                {groupAccounts.map(renderAccountRow)}
              </CollapsibleGridRow>
            );
          })}
          {groups.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No accounts found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderByStatus = () => {
    const statuses = ["NOT_STARTED", "IN_PROGRESS", "PENDING_REVIEW", "REVIEWED", "APPROVED", "LOCKED"];
    
    return (
      <Card>
        <CardContent className="p-0">
          {statuses.map((status) => {
            const statusAccounts = filteredAccounts.filter(a => {
              const recStatus = a.reconciliation?.status || "NOT_STARTED";
              return recStatus === status;
            });
            if (statusAccounts.length === 0 && statusFilter !== "all") return null;
            
            const config = statusConfig[status];
            const Icon = config.icon;
            const totalBalance = statusAccounts.reduce((sum, a) => sum + (a.reconciliation?.glBalance || 0), 0);
            
            return (
              <CollapsibleGridRow
                key={status}
                title={config.label}
                icon={<Icon className="h-4 w-4" />}
                count={statusAccounts.length}
                totalAmount={totalBalance}
                formatAmount={formatCurrency}
                defaultOpen={statusAccounts.length > 0 && statusAccounts.length <= 10}
                testId={`status-${status.toLowerCase()}`}
              >
                {statusAccounts.map(renderAccountRow)}
                {statusAccounts.length === 0 && (
                  <div className="px-8 py-4 text-sm text-muted-foreground">
                    No accounts with this status
                  </div>
                )}
              </CollapsibleGridRow>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const renderByPreparer = () => {
    const preparerMap: Record<string, AccountWithRecon[]> = {};
    
    filteredAccounts.forEach((item) => {
      const preparer = item.reconciliation?.preparedBy || "Unassigned";
      if (!preparerMap[preparer]) preparerMap[preparer] = [];
      preparerMap[preparer].push(item);
    });
    
    const sortedPreparers = Object.entries(preparerMap).sort((a, b) => b[1].length - a[1].length);
    
    return (
      <Card>
        <CardContent className="p-0">
          {sortedPreparers.map(([preparer, items]) => {
            const approved = items.filter(a => 
              a.reconciliation?.status === "APPROVED" || a.reconciliation?.status === "LOCKED"
            ).length;
            const totalBalance = items.reduce((sum, a) => sum + (a.reconciliation?.glBalance || 0), 0);
            
            return (
              <CollapsibleGridRow
                key={preparer}
                title={preparer}
                icon={<User className="h-4 w-4" />}
                count={items.length}
                completedCount={approved}
                totalAmount={totalBalance}
                formatAmount={formatCurrency}
                defaultOpen={items.length <= 10}
                testId={`preparer-${preparer.replace(/\s+/g, "-").toLowerCase()}`}
                statusBadges={getStatusBadges(items)}
              >
                {items.map(renderAccountRow)}
              </CollapsibleGridRow>
            );
          })}
          {sortedPreparers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No accounts found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderByVariance = () => {
    const noVariance = filteredAccounts.filter(a => a.reconciliation?.variance === 0);
    const smallVariance = filteredAccounts.filter(a => {
      const v = Math.abs(a.reconciliation?.variance || 0);
      return v > 0 && v < 1000;
    });
    const mediumVariance = filteredAccounts.filter(a => {
      const v = Math.abs(a.reconciliation?.variance || 0);
      return v >= 1000 && v < 10000;
    });
    const largeVariance = filteredAccounts.filter(a => {
      const v = Math.abs(a.reconciliation?.variance || 0);
      return v >= 10000;
    });
    const notReconciled = filteredAccounts.filter(a => !a.reconciliation);
    
    const groups = [
      { key: "large", label: "Large Variance (≥$10K)", items: largeVariance, color: "text-red-600" },
      { key: "medium", label: "Medium Variance ($1K-$10K)", items: mediumVariance, color: "text-amber-600" },
      { key: "small", label: "Small Variance (<$1K)", items: smallVariance, color: "text-blue-600" },
      { key: "zero", label: "No Variance", items: noVariance, color: "text-emerald-600" },
      { key: "not-started", label: "Not Reconciled", items: notReconciled, color: "text-muted-foreground" },
    ];
    
    return (
      <Card>
        <CardContent className="p-0">
          {groups.map(({ key, label, items, color }) => {
            if (items.length === 0) return null;
            const totalVariance = items.reduce((sum, a) => sum + Math.abs(a.reconciliation?.variance || 0), 0);
            
            return (
              <CollapsibleGridRow
                key={key}
                title={label}
                icon={<TrendingUp className={`h-4 w-4 ${color}`} />}
                count={items.length}
                totalAmount={totalVariance}
                formatAmount={(a) => `${formatCurrency(a)} variance`}
                defaultOpen={key === "large" || key === "medium"}
                testId={`variance-${key}`}
              >
                {items.map(renderAccountRow)}
              </CollapsibleGridRow>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    switch (pivotView) {
      case "by-type":
        return renderByType();
      case "by-group":
        return renderByGroup();
      case "by-status":
        return renderByStatus();
      case "by-preparer":
        return renderByPreparer();
      case "by-variance":
        return renderByVariance();
      default:
        return renderByType();
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setEntityFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="p-6 space-y-6" data-testid="reconciliation-grid">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="page-title">Reconciliations</h1>
            <p className="text-muted-foreground">
              Account reconciliation workspace - {period}
            </p>
          </div>
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
      ) : (
        <>
          <DashboardKPICards cards={kpiCards} columns={4} testIdPrefix="recon-kpi" />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <PivotViewSelector
              value={pivotView}
              onChange={setPivotView}
              module="reconciliations"
            />
            <FilterBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search accounts..."
              onClearAll={clearFilters}
              filters={[
                {
                  key: "entity",
                  label: "Entity",
                  value: entityFilter,
                  onChange: setEntityFilter,
                  options: entities.map(e => ({ value: e.id, label: e.name })),
                },
                {
                  key: "status",
                  label: "Status",
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: Object.entries(statusConfig).map(([k, v]) => ({ 
                    value: k, 
                    label: v.label 
                  })),
                },
              ]}
            />
          </div>

          {renderContent()}
        </>
      )}
    </div>
  );
}

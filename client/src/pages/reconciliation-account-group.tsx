import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  AlertCircle,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  CircleDot,
  FileCheck,
  FileQuestion,
  DollarSign,
  Building2,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import type { 
  ReconciliationAccount, 
  Reconciliation,
  ReconciliationAccountGroup,
  ReconciliationAccountType,
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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ReconciliationAccountGroupPage() {
  const { group } = useParams<{ group: string }>();
  const accountGroup = group?.toUpperCase().replace(/-/g, "_") as ReconciliationAccountGroup;
  const groupLabel = accountGroupLabels[accountGroup] || group || "Unknown Group";
  const parentType = accountGroupToType[accountGroup];
  const parentTypeLabel = parentType ? accountTypeLabels[parentType] : "Unknown";

  const { data: accounts = [], isLoading: accountsLoading, isError: accountsError } = useQuery<ReconciliationAccount[]>({
    queryKey: ["/api/reconciliations/accounts"],
  });

  const { data: reconciliations = [] } = useQuery<Reconciliation[]>({
    queryKey: ["/api/reconciliations"],
  });

  const { data: entities = [] } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const entityMap = new Map(entities.map(e => [e.id, e.name]));

  const filteredAccounts = accounts.filter(acc => acc.accountGroup === accountGroup);

  const getReconForAccount = (accountId: string): Reconciliation | undefined => {
    return reconciliations.find(r => r.accountId === accountId);
  };

  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-state">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (accountsError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2" data-testid="error-state">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Failed to load accounts</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="account-group-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reconciliations">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Reconciliations</span>
              <ChevronRight className="h-3 w-3" />
              <span>{parentTypeLabel}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{groupLabel}</span>
            </div>
            <h1 className="text-2xl font-bold" data-testid="page-title">{groupLabel}</h1>
            <p className="text-muted-foreground">
              {filteredAccounts.length} account{filteredAccounts.length !== 1 ? "s" : ""} in this group
            </p>
          </div>
        </div>
        <Button data-testid="button-add-account">
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredAccounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No accounts in this group yet</p>
              <Button variant="outline" data-testid="button-create-first">
                <Plus className="h-4 w-4 mr-2" />
                Create First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredAccounts.map(account => {
            const recon = getReconForAccount(account.accountId);
            const status = recon?.status || "NOT_STARTED";
            const statusInfo = statusConfig[status];
            const StatusIcon = statusInfo.icon;
            const entityName = entityMap.get(account.entityId) || account.entityId;
            const variance = recon?.variance || 0;

            return (
              <Link 
                key={account.accountId} 
                href={`/reconciliations/workspace/${account.accountId}`}
              >
                <Card 
                  className="hover-elevate cursor-pointer transition-all"
                  data-testid={`account-card-${account.accountCode}`}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      <div className="flex-1 p-4 flex items-center gap-4">
                        <div className="flex-shrink-0 w-24">
                          <span className="font-mono text-sm font-medium">{account.accountCode}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{account.accountName}</h3>
                          <p className="text-sm text-muted-foreground">{entityName}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">GL Balance</p>
                            <p className="font-mono font-medium">
                              {recon ? formatCurrency(recon.glBalance) : "—"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Variance</p>
                            <p className={`font-mono font-medium ${variance !== 0 ? "text-destructive" : "text-green-600"}`}>
                              {recon ? formatCurrency(variance) : "—"}
                            </p>
                          </div>
                          <Badge className={`${statusInfo.color} flex items-center gap-1.5`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4 border-l flex items-center">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

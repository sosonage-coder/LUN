import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Loader2, 
  AlertCircle,
  Wallet,
  Building,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  FileCheck,
  Coins,
  CreditCard,
  ChevronRight
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
  PrepaidSchedule, 
  FixedAsset, 
  AccrualSchedule,
  DebtSchedule,
  Entity
} from "@shared/schema";

type ScheduleType = "PREPAIDS" | "FIXED_ASSETS" | "ACCRUALS" | "DEBT";

interface UnifiedSchedule {
  id: string;
  name: string;
  type: ScheduleType;
  entityId: string;
  status: string;
  evidence: string;
  amount: number;
  owner: string;
  href: string;
}

const scheduleTypeConfig: Record<ScheduleType, { label: string; icon: typeof Wallet; color: string }> = {
  PREPAIDS: { label: "Prepaids", icon: Wallet, color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  FIXED_ASSETS: { label: "Fixed Assets", icon: Building, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" },
  ACCRUALS: { label: "Accruals", icon: Clock, color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  DEBT: { label: "Debt", icon: CreditCard, color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Active", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
  ON_HOLD: { label: "On Hold", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  COMPLETED: { label: "Completed", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  PERFORMING: { label: "Performing", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
  NON_PERFORMING: { label: "Non-Performing", color: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
  RESTRUCTURED: { label: "Restructured", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  MATURED: { label: "Matured", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};

const evidenceConfig: Record<string, { label: string; color: string }> = {
  ATTACHED: { label: "Attached", color: "text-emerald-600 dark:text-emerald-400" },
  MISSING: { label: "Missing", color: "text-red-600 dark:text-red-400" },
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function transformPrepaid(s: PrepaidSchedule): UnifiedSchedule {
  return {
    id: s.id,
    name: s.name,
    type: "PREPAIDS",
    entityId: s.entityId,
    status: s.status,
    evidence: s.evidence,
    amount: s.remainingBalance,
    owner: s.owner,
    href: `/prepaids/${s.subcategory.toLowerCase()}/schedule/${s.id}`,
  };
}

function transformFixedAsset(a: FixedAsset): UnifiedSchedule {
  return {
    id: a.id,
    name: a.name,
    type: "FIXED_ASSETS",
    entityId: a.entityId,
    status: a.status,
    evidence: a.evidence,
    amount: a.netBookValue,
    owner: a.owner,
    href: `/fixed-assets/${a.assetClass.toLowerCase()}/asset/${a.id}`,
  };
}

function transformAccrual(s: AccrualSchedule): UnifiedSchedule {
  return {
    id: s.id,
    name: s.name,
    type: "ACCRUALS",
    entityId: s.entityId,
    status: s.lifecycleState,
    evidence: s.evidence,
    amount: s.accrualAmount,
    owner: s.owner,
    href: `/accruals/${s.category.toLowerCase()}/schedule/${s.id}`,
  };
}

function transformDebt(s: DebtSchedule): UnifiedSchedule {
  return {
    id: s.id,
    name: s.instrumentName,
    type: "DEBT",
    entityId: s.entityId,
    status: s.lifecycleState,
    evidence: s.principalEvidenceStatus,
    amount: s.outstandingPrincipal,
    owner: s.owner,
    href: `/debt/${s.category.toLowerCase()}/instrument/${s.id}`,
  };
}

export default function ScheduleStudioGrid() {
  const [pivotView, setPivotView] = useState<PivotView>("by-type");
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: entities = [] } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const { data: prepaids = [], isLoading: prepaidsLoading } = useQuery<PrepaidSchedule[]>({
    queryKey: ["/api/prepaids"],
  });

  const { data: fixedAssets = [], isLoading: assetsLoading } = useQuery<FixedAsset[]>({
    queryKey: ["/api/fixed-assets"],
  });

  const { data: accruals = [], isLoading: accrualsLoading } = useQuery<AccrualSchedule[]>({
    queryKey: ["/api/accruals"],
  });

  const { data: debts = [], isLoading: debtsLoading } = useQuery<DebtSchedule[]>({
    queryKey: ["/api/debt"],
  });

  const isLoading = prepaidsLoading || assetsLoading || accrualsLoading || debtsLoading;

  const allSchedules = useMemo(() => {
    const items: UnifiedSchedule[] = [
      ...prepaids.map(transformPrepaid),
      ...fixedAssets.map(transformFixedAsset),
      ...accruals.map(transformAccrual),
      ...debts.map(transformDebt),
    ];
    return items;
  }, [prepaids, fixedAssets, accruals, debts]);

  const filteredSchedules = useMemo(() => {
    return allSchedules.filter((s) => {
      const matchesSearch = searchQuery === "" || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEntity = entityFilter === "all" || s.entityId === entityFilter;
      const matchesType = typeFilter === "all" || s.type === typeFilter;
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesEntity && matchesType && matchesStatus;
    });
  }, [allSchedules, searchQuery, entityFilter, typeFilter, statusFilter]);

  const groupSchedules = (schedules: UnifiedSchedule[], key: keyof UnifiedSchedule) => {
    const groups: Record<string, UnifiedSchedule[]> = {};
    schedules.forEach((s) => {
      const groupKey = String(s[key]) || "Unknown";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(s);
    });
    return groups;
  };

  const kpiCards = useMemo(() => {
    const activeCount = filteredSchedules.filter(s => 
      s.status === "ACTIVE" || s.status === "PERFORMING"
    ).length;
    const missingEvidence = filteredSchedules.filter(s => s.evidence === "MISSING").length;
    const totalAmount = filteredSchedules.reduce((sum, s) => sum + s.amount, 0);
    
    return [
      { title: "Total Schedules", value: filteredSchedules.length, color: "default" as const },
      { title: "Active", value: activeCount, color: "success" as const, subtitle: `${Math.round((activeCount / Math.max(filteredSchedules.length, 1)) * 100)}% of total` },
      { title: "Missing Evidence", value: missingEvidence, color: missingEvidence > 0 ? "danger" as const : "muted" as const },
      { title: "Total Value", value: formatCurrency(totalAmount), color: "default" as const },
    ];
  }, [filteredSchedules]);

  const renderByType = () => {
    const grouped = groupSchedules(filteredSchedules, "type");
    return (
      <Card>
        <CardContent className="p-0">
          {(Object.keys(scheduleTypeConfig) as ScheduleType[]).map((type) => {
            const items = grouped[type] || [];
            if (items.length === 0 && typeFilter !== "all") return null;
            const config = scheduleTypeConfig[type];
            const Icon = config.icon;
            const completed = items.filter(i => i.status === "COMPLETED" || i.status === "MATURED").length;
            const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
            
            return (
              <CollapsibleGridRow
                key={type}
                title={config.label}
                icon={<Icon className="h-4 w-4" />}
                count={items.length}
                completedCount={completed}
                totalAmount={totalAmount}
                formatAmount={formatCurrency}
                defaultOpen={items.length > 0 && items.length <= 10}
                testId={`group-${type.toLowerCase()}`}
                statusBadges={[
                  { label: "Active", count: items.filter(i => i.status === "ACTIVE" || i.status === "PERFORMING").length, color: "text-emerald-600" },
                  { label: "Missing", count: items.filter(i => i.evidence === "MISSING").length, color: "text-red-600" },
                ]}
              >
                {items.map((item) => (
                  <GridItemRow
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    href={item.href}
                    status={statusConfig[item.status]}
                    evidence={evidenceConfig[item.evidence]}
                    amount={item.amount}
                    formatAmount={formatCurrency}
                    owner={item.owner}
                    testId={`schedule-${item.id}`}
                  />
                ))}
                {items.length === 0 && (
                  <div className="px-8 py-4 text-sm text-muted-foreground">
                    No {config.label.toLowerCase()} schedules found
                  </div>
                )}
              </CollapsibleGridRow>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const renderByEntity = () => {
    const grouped = groupSchedules(filteredSchedules, "entityId");
    return (
      <Card>
        <CardContent className="p-0">
          {Object.entries(grouped).map(([entityId, items]) => {
            const entity = entities.find(e => e.id === entityId);
            const entityName = entity?.name || entityId;
            const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
            
            return (
              <CollapsibleGridRow
                key={entityId}
                title={entityName}
                icon={<Building className="h-4 w-4" />}
                count={items.length}
                totalAmount={totalAmount}
                formatAmount={formatCurrency}
                defaultOpen={items.length <= 10}
                testId={`entity-${entityId}`}
              >
                {items.map((item) => {
                  const typeConfig = scheduleTypeConfig[item.type];
                  return (
                    <GridItemRow
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      href={item.href}
                      status={statusConfig[item.status]}
                      amount={item.amount}
                      formatAmount={formatCurrency}
                      secondaryInfo={typeConfig.label}
                      owner={item.owner}
                      testId={`schedule-${item.id}`}
                    />
                  );
                })}
              </CollapsibleGridRow>
            );
          })}
          {Object.keys(grouped).length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No schedules found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderByOwner = () => {
    const grouped = groupSchedules(filteredSchedules, "owner");
    return (
      <Card>
        <CardContent className="p-0">
          {Object.entries(grouped)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([owner, items]) => {
              const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
              const missingCount = items.filter(i => i.evidence === "MISSING").length;
              
              return (
                <CollapsibleGridRow
                  key={owner}
                  title={owner}
                  count={items.length}
                  totalAmount={totalAmount}
                  formatAmount={formatCurrency}
                  defaultOpen={items.length <= 10}
                  testId={`owner-${owner.replace(/\s+/g, "-").toLowerCase()}`}
                  statusBadges={[
                    { label: "Missing Evidence", count: missingCount, color: missingCount > 0 ? "text-red-600" : "text-muted-foreground" },
                  ]}
                >
                  {items.map((item) => {
                    const typeConfig = scheduleTypeConfig[item.type];
                    return (
                      <GridItemRow
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        href={item.href}
                        status={statusConfig[item.status]}
                        evidence={evidenceConfig[item.evidence]}
                        amount={item.amount}
                        formatAmount={formatCurrency}
                        secondaryInfo={typeConfig.label}
                        testId={`schedule-${item.id}`}
                      />
                    );
                  })}
                </CollapsibleGridRow>
              );
            })}
          {Object.keys(grouped).length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No schedules found matching your filters
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderByEvidence = () => {
    const withEvidence = filteredSchedules.filter(s => s.evidence === "ATTACHED");
    const missingEvidence = filteredSchedules.filter(s => s.evidence === "MISSING");
    
    return (
      <Card>
        <CardContent className="p-0">
          <CollapsibleGridRow
            title="Evidence Attached"
            icon={<Shield className="h-4 w-4 text-emerald-600" />}
            count={withEvidence.length}
            totalAmount={withEvidence.reduce((sum, i) => sum + i.amount, 0)}
            formatAmount={formatCurrency}
            defaultOpen={false}
            testId="evidence-attached"
          >
            {withEvidence.map((item) => (
              <GridItemRow
                key={item.id}
                id={item.id}
                name={item.name}
                href={item.href}
                status={statusConfig[item.status]}
                amount={item.amount}
                formatAmount={formatCurrency}
                secondaryInfo={scheduleTypeConfig[item.type].label}
                owner={item.owner}
                testId={`schedule-${item.id}`}
              />
            ))}
          </CollapsibleGridRow>
          <CollapsibleGridRow
            title="Evidence Missing"
            icon={<AlertCircle className="h-4 w-4 text-red-600" />}
            count={missingEvidence.length}
            totalAmount={missingEvidence.reduce((sum, i) => sum + i.amount, 0)}
            formatAmount={formatCurrency}
            defaultOpen={missingEvidence.length > 0}
            testId="evidence-missing"
          >
            {missingEvidence.map((item) => (
              <GridItemRow
                key={item.id}
                id={item.id}
                name={item.name}
                href={item.href}
                status={statusConfig[item.status]}
                amount={item.amount}
                formatAmount={formatCurrency}
                secondaryInfo={scheduleTypeConfig[item.type].label}
                owner={item.owner}
                testId={`schedule-${item.id}`}
              />
            ))}
            {missingEvidence.length === 0 && (
              <div className="px-8 py-4 text-sm text-emerald-600 flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                All schedules have evidence attached
              </div>
            )}
          </CollapsibleGridRow>
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    switch (pivotView) {
      case "by-type":
        return renderByType();
      case "by-entity":
        return renderByEntity();
      case "by-owner":
        return renderByOwner();
      case "by-evidence":
        return renderByEvidence();
      default:
        return renderByType();
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setEntityFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="p-6 space-y-6" data-testid="schedule-studio-grid">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="page-title">Schedule Studio</h1>
            <p className="text-muted-foreground">
              Unified view of all financial schedules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/schedules/new">
            <Button data-testid="button-new-schedule">
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <DashboardKPICards cards={kpiCards} columns={4} testIdPrefix="schedule-kpi" />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <PivotViewSelector
              value={pivotView}
              onChange={setPivotView}
              module="schedules"
            />
            <FilterBar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search schedules..."
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
                  key: "type",
                  label: "Type",
                  value: typeFilter,
                  onChange: setTypeFilter,
                  options: (Object.keys(scheduleTypeConfig) as ScheduleType[]).map(t => ({ 
                    value: t, 
                    label: scheduleTypeConfig[t].label 
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

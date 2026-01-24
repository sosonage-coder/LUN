import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingDown,
  Plus, 
  Download, 
  DollarSign, 
  AlertTriangle,
  PieChart,
  BarChart3,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Landmark,
  Building2,
  RefreshCw,
  FileCheck,
  Truck,
  Package,
  Eye,
  Percent,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import type { 
  DebtDashboardKPIs, 
  DebtCategorySummary, 
  DebtTrendPoint,
  PrincipalInterestSplit,
  DebtMixBreakdown,
  DebtRiskPanel,
  Entity,
  DebtCategory
} from "@shared/schema";

const categoryIcons: Record<DebtCategory, typeof CreditCard> = {
  TERM_LOANS: CreditCard,
  REVOLVING_CREDIT: RefreshCw,
  BONDS_NOTES: FileCheck,
  INTERCOMPANY_LOANS: Building2,
  LEASE_LIABILITIES: Truck,
  OTHER: Package,
};

const categoryLabels: Record<DebtCategory, string> = {
  TERM_LOANS: "Term Loans",
  REVOLVING_CREDIT: "Revolving Credit",
  BONDS_NOTES: "Bonds & Notes",
  INTERCOMPANY_LOANS: "Intercompany Loans",
  LEASE_LIABILITIES: "Lease Liabilities",
  OTHER: "Other",
};

const categoryColors: Record<DebtCategory, string> = {
  TERM_LOANS: "bg-blue-500",
  REVOLVING_CREDIT: "bg-emerald-500",
  BONDS_NOTES: "bg-purple-500",
  INTERCOMPANY_LOANS: "bg-amber-500",
  LEASE_LIABILITIES: "bg-rose-500",
  OTHER: "bg-slate-500",
};

const riskColors: Record<string, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-amber-500",
  LOW: "bg-emerald-500",
};

const reviewColors: Record<string, string> = {
  REVIEWED: "bg-emerald-600",
  NOT_REVIEWED: "bg-amber-500",
};

const severityColors: Record<string, string> = {
  HIGH: "text-red-500",
  MEDIUM: "text-amber-500",
  LOW: "text-blue-500",
};

const severityIcons: Record<string, typeof AlertCircle> = {
  HIGH: AlertCircle,
  MEDIUM: AlertTriangle,
  LOW: Clock,
};

const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function DebtDashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2026-01");

  const { data: entities = [] } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const buildQueryString = (params: Record<string, string | undefined>) => {
    const filtered = Object.entries(params).filter(([_, v]) => v && v !== "all");
    return filtered.length > 0 
      ? "?" + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join("&")
      : "";
  };

  const kpisUrl = `/api/debt/kpis${buildQueryString({ entityId: selectedEntity, period: selectedPeriod })}`;
  const { data: kpis } = useQuery<DebtDashboardKPIs>({
    queryKey: [kpisUrl],
  });

  const categoriesUrl = `/api/debt/categories${buildQueryString({ entityId: selectedEntity })}`;
  const { data: categories = [], isLoading } = useQuery<DebtCategorySummary[]>({
    queryKey: [categoriesUrl],
  });

  const trendUrl = `/api/debt/trend${buildQueryString({ entityId: selectedEntity })}`;
  const { data: trend = [] } = useQuery<DebtTrendPoint[]>({
    queryKey: [trendUrl],
  });

  const splitUrl = `/api/debt/split${buildQueryString({ entityId: selectedEntity })}`;
  const { data: split = [] } = useQuery<PrincipalInterestSplit[]>({
    queryKey: [splitUrl],
  });

  const mixUrl = `/api/debt/mix${buildQueryString({ entityId: selectedEntity })}`;
  const { data: mix = [] } = useQuery<DebtMixBreakdown[]>({
    queryKey: [mixUrl],
  });

  const risksUrl = `/api/debt/risks${buildQueryString({ entityId: selectedEntity })}`;
  const { data: riskPanels = [] } = useQuery<DebtRiskPanel[]>({
    queryKey: [risksUrl],
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">Loan & Debt Amortization</h1>
              <p className="text-muted-foreground">
                Principal and interest tracking by debt category · Amortization basis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger className="w-[180px]" data-testid="select-entity">
                <SelectValue placeholder="Select Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px]" data-testid="select-period">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-01">Jan 2026</SelectItem>
                <SelectItem value="2025-12">Dec 2025</SelectItem>
                <SelectItem value="2025-11">Nov 2025</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
              Accrued
            </Badge>

            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              Open
            </Badge>

            <Button variant="outline" size="sm" data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" data-testid="button-template">
              <FileText className="h-4 w-4 mr-2" />
              New Template
            </Button>
            <Button size="sm" data-testid="button-new-debt">
              <Plus className="h-4 w-4 mr-2" />
              New Debt Schedule
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          <Card className="hover-elevate cursor-pointer" data-testid="kpi-outstanding-principal">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                Outstanding Principal
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.outstandingPrincipal) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total liability</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-principal-repaid">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <ArrowDown className="h-4 w-4" />
                Principal Repaid
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                {kpis ? formatCurrency(kpis.principalRepaidPeriod) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">This period</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-interest-incurred">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Percent className="h-4 w-4" />
                Interest Incurred
              </div>
              <div className="text-2xl font-bold text-amber-500">
                {kpis ? formatCurrency(kpis.interestIncurredPeriod) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">This period</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-accrued-interest">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Accrued Interest
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.accruedInterest) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Unpaid balance</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-active-instruments">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CheckCircle2 className="h-4 w-4" />
                Active Instruments
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.activeDebtInstruments : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Currently servicing</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-high-risk">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <AlertTriangle className="h-4 w-4" />
                High-Risk Debt
              </div>
              <div className={`text-2xl font-bold ${kpis && kpis.highRiskDebt > 0 ? "text-amber-500" : ""}`}>
                {kpis ? kpis.highRiskDebt : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Variable / override</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5" />
                Outstanding Principal Trend
              </CardTitle>
              <CardDescription>Rolling 6 periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trend.map((point, idx) => {
                  const maxPrincipal = Math.max(...trend.map(t => t.outstandingPrincipal));
                  const widthPercent = maxPrincipal > 0 ? (point.outstandingPrincipal / maxPrincipal) * 100 : 0;
                  return (
                    <div key={point.period} className="flex items-center gap-3" data-testid={`trend-bar-${idx}`}>
                      <span className="w-16 text-sm font-mono text-muted-foreground">{point.period}</span>
                      <div className="flex-1">
                        <div 
                          className="h-6 bg-blue-500/80 rounded-sm flex items-center justify-end pr-2"
                          style={{ width: `${widthPercent}%`, minWidth: '60px' }}
                        >
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(point.outstandingPrincipal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-5 w-5" />
                Debt Mix by Category
              </CardTitle>
              <CardDescription>Outstanding principal by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mix.map((item) => {
                  const Icon = categoryIcons[item.category];
                  return (
                    <div key={item.category} className="space-y-2" data-testid={`mix-${item.category.toLowerCase().replace(/_/g, '-')}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${categoryColors[item.category]}`} />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{categoryLabels[item.category]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono">{formatCurrency(item.amount)}</span>
                          <Badge variant="secondary" className="text-xs">{item.percentage.toFixed(0)}%</Badge>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Percent className="h-5 w-5" />
                Principal vs Interest Split
              </CardTitle>
              <CardDescription>Payment composition by period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {split.slice(-4).map((point) => (
                  <div key={point.period} className="space-y-2" data-testid={`split-${point.period}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">{point.period}</span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <ArrowDown className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-600">{formatCurrency(point.principalRepaid)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <ArrowUp className="h-3 w-3 text-amber-500" />
                          <span className="text-amber-600">{formatCurrency(point.interestIncurred)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 h-4">
                      <div 
                        className="bg-emerald-500/60 rounded-l-sm" 
                        style={{ width: `${(point.principalRepaid / (point.principalRepaid + point.interestIncurred)) * 100}%` }}
                      />
                      <div 
                        className="bg-amber-500/60 rounded-r-sm" 
                        style={{ width: `${(point.interestIncurred / (point.principalRepaid + point.interestIncurred)) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Principal</span>
                      <span>Interest</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {riskPanels.length > 0 && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Risk & Control Panels
              </CardTitle>
              <CardDescription>Surface amortization and interest recognition risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {riskPanels.map((panel) => {
                  const SeverityIcon = severityIcons[panel.severity];
                  return (
                    <div 
                      key={panel.type} 
                      className="p-4 rounded-lg border bg-background"
                      data-testid={`risk-panel-${panel.type.toLowerCase().replace(/_/g, '-')}`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <SeverityIcon className={`h-5 w-5 mt-0.5 ${severityColors[panel.severity]}`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{panel.title}</div>
                          <Badge 
                            variant="secondary" 
                            className={`mt-1 ${panel.severity === "HIGH" ? "bg-red-500/10 text-red-500" : panel.severity === "MEDIUM" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`}
                          >
                            {panel.severity}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {panel.categories.slice(0, 3).map(({ category, count }) => (
                          <div key={category} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{categoryLabels[category]}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3" data-testid={`view-${panel.type.toLowerCase().replace(/_/g, '-')}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Category
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Debt Category Summary</CardTitle>
                <CardDescription>
                  {categories.length} categories with outstanding debt · Click to drilldown
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active debt schedules for this period</p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button variant="outline">View Archived Debt</Button>
                  <Button>Create Debt Schedule</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table data-testid="categories-table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Active Instruments</TableHead>
                      <TableHead className="text-right">Outstanding Principal</TableHead>
                      <TableHead className="text-right">Principal Repaid</TableHead>
                      <TableHead className="text-right">Interest Incurred</TableHead>
                      <TableHead className="text-center">Risk Level</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => {
                      const Icon = categoryIcons[cat.category];
                      return (
                        <TableRow key={cat.category} data-testid={`category-row-${cat.category.toLowerCase().replace(/_/g, '-')}`} className="hover-elevate">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${categoryColors[cat.category]}`} />
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <Link href={`/debt/${cat.category.toLowerCase().replace(/_/g, '-')}`} className="font-medium hover:underline">
                                {categoryLabels[cat.category]}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{cat.activeCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            {formatCurrency(cat.outstandingPrincipal)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-emerald-500">
                            {formatCurrency(cat.principalRepaid)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-amber-500">
                            {formatCurrency(cat.interestIncurred)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={riskColors[cat.riskLevel]} variant="secondary">
                              {cat.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={reviewColors[cat.reviewStatus]} variant="secondary">
                              {cat.reviewStatus === "REVIEWED" ? (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {cat.reviewStatus === "REVIEWED" ? "Reviewed" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/debt/${cat.category.toLowerCase().replace(/_/g, '-')}`}>
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
    </div>
  );
}

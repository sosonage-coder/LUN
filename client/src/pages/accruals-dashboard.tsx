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
  Landmark,
  Plus, 
  Download, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Layers,
  PieChart,
  BarChart3,
  ExternalLink,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  Briefcase,
  Server,
  Zap,
  MoreHorizontal,
  Eye
} from "lucide-react";
import type { 
  AccrualDashboardKPIs, 
  AccrualCategorySummary, 
  AccrualTrendPoint,
  AccrualRiskPanel,
  AccrualMixBreakdown,
  Entity,
  AccrualCategory
} from "@shared/schema";

const categoryIcons: Record<AccrualCategory, typeof Users> = {
  PAYROLL: Users,
  BONUSES_COMMISSIONS: DollarSign,
  PROFESSIONAL_FEES: Briefcase,
  HOSTING_SAAS: Server,
  UTILITIES: Zap,
  OTHER: MoreHorizontal,
};

const categoryLabels: Record<AccrualCategory, string> = {
  PAYROLL: "Payroll",
  BONUSES_COMMISSIONS: "Bonuses & Commissions",
  PROFESSIONAL_FEES: "Professional Fees",
  HOSTING_SAAS: "Hosting & SaaS",
  UTILITIES: "Utilities",
  OTHER: "Other",
};

const categoryColors: Record<AccrualCategory, string> = {
  PAYROLL: "bg-blue-500",
  BONUSES_COMMISSIONS: "bg-amber-500",
  PROFESSIONAL_FEES: "bg-emerald-500",
  HOSTING_SAAS: "bg-purple-500",
  UTILITIES: "bg-rose-500",
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

const formatTrueUp = (amount: number): string => {
  const prefix = amount >= 0 ? "+" : "";
  return prefix + formatCurrency(amount);
};

export default function AccrualsDashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2025-02");

  const { data: entities = [] } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const buildQueryString = (params: Record<string, string | undefined>) => {
    const filtered = Object.entries(params).filter(([_, v]) => v && v !== "all");
    return filtered.length > 0 
      ? "?" + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join("&")
      : "";
  };

  const kpisUrl = `/api/accruals/kpis${buildQueryString({ entityId: selectedEntity, period: selectedPeriod })}`;
  const { data: kpis } = useQuery<AccrualDashboardKPIs>({
    queryKey: [kpisUrl],
  });

  const categoriesUrl = `/api/accruals/categories${buildQueryString({ entityId: selectedEntity })}`;
  const { data: categories = [], isLoading } = useQuery<AccrualCategorySummary[]>({
    queryKey: [categoriesUrl],
  });

  const trendUrl = `/api/accruals/trend${buildQueryString({ entityId: selectedEntity })}`;
  const { data: trend = [] } = useQuery<AccrualTrendPoint[]>({
    queryKey: [trendUrl],
  });

  const risksUrl = `/api/accruals/risks${buildQueryString({ entityId: selectedEntity })}`;
  const { data: riskPanels = [] } = useQuery<AccrualRiskPanel[]>({
    queryKey: [risksUrl],
  });

  const mixUrl = `/api/accruals/mix${buildQueryString({ entityId: selectedEntity })}`;
  const { data: mix = [] } = useQuery<AccrualMixBreakdown[]>({
    queryKey: [mixUrl],
  });

  const totalMixAmount = mix.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">Accruals</h1>
              <p className="text-muted-foreground">
                Current-period exposure and risk by category · Time Horizon: Current + 12mo trend
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
                <SelectItem value="2025-02">Feb 2025</SelectItem>
                <SelectItem value="2025-01">Jan 2025</SelectItem>
                <SelectItem value="2024-12">Dec 2024</SelectItem>
              </SelectContent>
            </Select>

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
            <Button size="sm" data-testid="button-new-accrual">
              <Plus className="h-4 w-4 mr-2" />
              New Accrual
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <Card className="hover-elevate cursor-pointer" data-testid="kpi-ending-balance">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                Ending Accrual Balance
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.endingAccrualBalance) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Active + Dormant</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-active-categories">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Layers className="h-4 w-4" />
                Active Categories
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.activeCategories : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">With active accruals</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-true-up">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                Net True-Up (Period)
              </div>
              <div className={`text-2xl font-bold ${kpis && kpis.netTrueUpPeriod > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {kpis ? formatTrueUp(kpis.netTrueUpPeriod) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Period adjustments</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-high-risk">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <AlertTriangle className="h-4 w-4" />
                High-Risk Categories
              </div>
              <div className={`text-2xl font-bold ${kpis && kpis.highRiskCategories > 0 ? "text-red-500" : ""}`}>
                {kpis ? kpis.highRiskCategories : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Flagged for review</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-dormant">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Dormant Accruals
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.dormantAccruals : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Temporarily inactive</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5" />
                Accrual Balance Trend
              </CardTitle>
              <CardDescription>Rolling 6 periods aggregated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trend.map((point, idx) => {
                  const maxBalance = Math.max(...trend.map(t => t.balance));
                  const widthPercent = maxBalance > 0 ? (point.balance / maxBalance) * 100 : 0;
                  return (
                    <div key={point.period} className="flex items-center gap-3" data-testid={`trend-bar-${idx}`}>
                      <span className="w-16 text-sm font-mono text-muted-foreground">{point.period}</span>
                      <div className="flex-1">
                        <div 
                          className="h-6 bg-primary/80 rounded-sm flex items-center justify-end pr-2"
                          style={{ width: `${widthPercent}%`, minWidth: '60px' }}
                        >
                          <span className="text-xs text-primary-foreground font-medium">
                            {formatCurrency(point.balance)}
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
                <TrendingUp className="h-5 w-5" />
                True-Up Volatility by Category
              </CardTitle>
              <CardDescription>Period adjustments highlighting judgment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.filter(c => c.netTrueUp !== 0).slice(0, 5).map((cat) => {
                  const Icon = categoryIcons[cat.category];
                  const maxTrueUp = Math.max(...categories.map(c => Math.abs(c.netTrueUp)));
                  const widthPercent = maxTrueUp > 0 ? (Math.abs(cat.netTrueUp) / maxTrueUp) * 100 : 0;
                  const isPositive = cat.netTrueUp > 0;
                  return (
                    <div key={cat.category} className="space-y-2" data-testid={`volatility-${cat.category.toLowerCase()}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${categoryColors[cat.category]}`} />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{categoryLabels[cat.category]}</span>
                        </div>
                        <span className={`text-sm font-mono ${isPositive ? "text-amber-500" : "text-emerald-500"}`}>
                          {formatTrueUp(cat.netTrueUp)}
                        </span>
                      </div>
                      <Progress 
                        value={widthPercent} 
                        className={`h-2 ${isPositive ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`} 
                      />
                    </div>
                  );
                })}
                {categories.filter(c => c.netTrueUp !== 0).length === 0 && (
                  <div className="text-center text-muted-foreground py-4">No true-ups this period</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-5 w-5" />
                Accrual Mix (Current Period)
              </CardTitle>
              <CardDescription>Active balance composition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mix.map((item) => {
                  const Icon = categoryIcons[item.category];
                  return (
                    <div key={item.category} className="space-y-2" data-testid={`mix-${item.category.toLowerCase()}`}>
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
        </div>

        {riskPanels.length > 0 && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Exceptions & Risk Panels
              </CardTitle>
              <CardDescription>What needs attention, not everything that exists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {riskPanels.map((panel) => {
                  const SeverityIcon = severityIcons[panel.severity];
                  return (
                    <div 
                      key={panel.type} 
                      className="p-4 rounded-lg border bg-background"
                      data-testid={`risk-panel-${panel.type.toLowerCase()}`}
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
                      <Button variant="outline" size="sm" className="w-full mt-3" data-testid={`view-${panel.type.toLowerCase()}`}>
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
                <CardTitle>Category Summary</CardTitle>
                <CardDescription>
                  {categories.length} categories with active or dormant accruals · Click to drilldown
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active accruals for this period</p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button variant="outline">View Archived Accruals</Button>
                  <Button>Create Accrual</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table data-testid="categories-table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Active Accruals</TableHead>
                      <TableHead className="text-center">Dormant</TableHead>
                      <TableHead className="text-right">Ending Balance</TableHead>
                      <TableHead className="text-right">Net True-Up</TableHead>
                      <TableHead className="text-center">Risk Level</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => {
                      const Icon = categoryIcons[cat.category];
                      return (
                        <TableRow key={cat.category} data-testid={`category-row-${cat.category.toLowerCase()}`} className="hover-elevate">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${categoryColors[cat.category]}`} />
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <Link href={`/accruals/${cat.category.toLowerCase().replace(/_/g, "-")}`} className="font-medium hover:underline">
                                {categoryLabels[cat.category]}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{cat.activeCount}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {cat.dormantCount > 0 ? (
                              <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                                {cat.dormantCount}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            {formatCurrency(cat.endingBalance)}
                          </TableCell>
                          <TableCell className={`text-right font-mono ${cat.netTrueUp > 0 ? "text-amber-500" : cat.netTrueUp < 0 ? "text-emerald-500" : ""}`}>
                            {formatTrueUp(cat.netTrueUp)}
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
                              <Link href={`/accruals/${cat.category.toLowerCase().replace(/_/g, "-")}`}>
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

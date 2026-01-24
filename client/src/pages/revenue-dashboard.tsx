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
  Receipt,
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
  RefreshCw,
  Server,
  Target,
  Award,
  Package,
  MoreHorizontal,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import type { 
  RevenueDashboardKPIs, 
  RevenueCategorySummary, 
  RevenueTrendPoint,
  DeferredRevenueRollforward,
  RevenueMixBreakdown,
  RevenueRiskPanel,
  Entity,
  RevenueCategory
} from "@shared/schema";

const categoryIcons: Record<RevenueCategory, typeof RefreshCw> = {
  SUBSCRIPTIONS: RefreshCw,
  SUPPORT_MAINTENANCE: Server,
  USAGE_BASED: BarChart3,
  MILESTONE_BASED: Target,
  LICENSING: Award,
  OTHER: Package,
};

const categoryLabels: Record<RevenueCategory, string> = {
  SUBSCRIPTIONS: "Subscriptions",
  SUPPORT_MAINTENANCE: "Support & Maintenance",
  USAGE_BASED: "Usage-Based",
  MILESTONE_BASED: "Milestone-Based",
  LICENSING: "Licensing",
  OTHER: "Other",
};

const categoryColors: Record<RevenueCategory, string> = {
  SUBSCRIPTIONS: "bg-blue-500",
  SUPPORT_MAINTENANCE: "bg-emerald-500",
  USAGE_BASED: "bg-amber-500",
  MILESTONE_BASED: "bg-purple-500",
  LICENSING: "bg-rose-500",
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

export default function RevenueDashboard() {
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

  const kpisUrl = `/api/revenue/kpis${buildQueryString({ entityId: selectedEntity, period: selectedPeriod })}`;
  const { data: kpis } = useQuery<RevenueDashboardKPIs>({
    queryKey: [kpisUrl],
  });

  const categoriesUrl = `/api/revenue/categories${buildQueryString({ entityId: selectedEntity })}`;
  const { data: categories = [], isLoading } = useQuery<RevenueCategorySummary[]>({
    queryKey: [categoriesUrl],
  });

  const trendUrl = `/api/revenue/trend${buildQueryString({ entityId: selectedEntity })}`;
  const { data: trend = [] } = useQuery<RevenueTrendPoint[]>({
    queryKey: [trendUrl],
  });

  const rollforwardUrl = `/api/revenue/rollforward${buildQueryString({ entityId: selectedEntity })}`;
  const { data: rollforward = [] } = useQuery<DeferredRevenueRollforward[]>({
    queryKey: [rollforwardUrl],
  });

  const risksUrl = `/api/revenue/risks${buildQueryString({ entityId: selectedEntity })}`;
  const { data: riskPanels = [] } = useQuery<RevenueRiskPanel[]>({
    queryKey: [risksUrl],
  });

  const mixUrl = `/api/revenue/mix${buildQueryString({ entityId: selectedEntity })}`;
  const { data: mix = [] } = useQuery<RevenueMixBreakdown[]>({
    queryKey: [mixUrl],
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">Revenue & Contracts</h1>
              <p className="text-muted-foreground">
                Recognition state and risk by contract category · ASC 606 / IFRS 15 compliant
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

            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
              ASC 606
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
            <Button size="sm" data-testid="button-new-revenue">
              <Plus className="h-4 w-4 mr-2" />
              New Revenue Schedule
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          <Card className="hover-elevate cursor-pointer" data-testid="kpi-recognized">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                Revenue Recognized
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                {kpis ? formatCurrency(kpis.revenueRecognizedPeriod) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">This period</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-deferred">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                Deferred Revenue
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.deferredRevenueEnding) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Ending balance</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-contract-assets">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Layers className="h-4 w-4" />
                Contract Assets
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.contractAssets) : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Unbilled / recognized-not-billed</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-active">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CheckCircle2 className="h-4 w-4" />
                Active Contracts
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.activeContracts : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">With remaining POs</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-dormant">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Dormant Contracts
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.dormantContracts : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Paused recognition</div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-high-judgment">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <AlertTriangle className="h-4 w-4" />
                High-Judgment
              </div>
              <div className={`text-2xl font-bold ${kpis && kpis.highJudgmentContracts > 0 ? "text-amber-500" : ""}`}>
                {kpis ? kpis.highJudgmentContracts : "-"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Manual allocations</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5" />
                Revenue Recognition Trend
              </CardTitle>
              <CardDescription>Rolling 6 periods by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trend.map((point, idx) => {
                  const maxRecognized = Math.max(...trend.map(t => t.recognized));
                  const widthPercent = maxRecognized > 0 ? (point.recognized / maxRecognized) * 100 : 0;
                  return (
                    <div key={point.period} className="flex items-center gap-3" data-testid={`trend-bar-${idx}`}>
                      <span className="w-16 text-sm font-mono text-muted-foreground">{point.period}</span>
                      <div className="flex-1">
                        <div 
                          className="h-6 bg-emerald-500/80 rounded-sm flex items-center justify-end pr-2"
                          style={{ width: `${widthPercent}%`, minWidth: '60px' }}
                        >
                          <span className="text-xs text-white font-medium">
                            {formatCurrency(point.recognized)}
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
                Deferred Revenue Rollforward
              </CardTitle>
              <CardDescription>Opening → Additions → Recognition → Ending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rollforward.slice(-3).map((period) => (
                  <div key={period.period} className="space-y-2" data-testid={`rollforward-${period.period}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">{period.period}</span>
                      <span className="text-sm font-medium">{formatCurrency(period.endingBalance)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatCurrency(period.openingBalance)}</span>
                      <ArrowUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">+{formatCurrency(period.additions)}</span>
                      <ArrowDown className="h-3 w-3 text-blue-500" />
                      <span className="text-blue-500">-{formatCurrency(period.recognition)}</span>
                    </div>
                    <Progress 
                      value={(period.recognition / (period.openingBalance + period.additions)) * 100} 
                      className="h-2 [&>div]:bg-blue-500" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart className="h-5 w-5" />
                Revenue Mix by Category
              </CardTitle>
              <CardDescription>Recognition this period</CardDescription>
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
                Risk & Completeness Panels
              </CardTitle>
              <CardDescription>Expose revenue risk early — timing, completeness, and judgment</CardDescription>
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
                <CardTitle>Category / Contract Summary</CardTitle>
                <CardDescription>
                  {categories.length} categories with active contracts · Click to drilldown
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No active revenue schedules for this period</p>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button variant="outline">View Archived Contracts</Button>
                  <Button>Create Revenue Schedule</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table data-testid="categories-table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Active Schedules</TableHead>
                      <TableHead className="text-right">Revenue Recognized</TableHead>
                      <TableHead className="text-right">Deferred Revenue</TableHead>
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
                              <Link href={`/revenue/${cat.category.toLowerCase().replace(/_/g, "-")}`} className="font-medium hover:underline">
                                {categoryLabels[cat.category]}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{cat.activeCount}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium text-emerald-500">
                            {formatCurrency(cat.revenueRecognized)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(cat.deferredRevenue)}
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
                              <Link href={`/revenue/${cat.category.toLowerCase().replace(/_/g, "-")}`}>
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

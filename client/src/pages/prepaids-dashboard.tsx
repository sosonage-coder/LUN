import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Plus, 
  Download, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  Wallet,
  PieChart,
  BarChart3,
  ExternalLink,
  Shield,
  Building,
  Monitor,
  Layers
} from "lucide-react";
import type { 
  PrepaidSchedule, 
  PrepaidDashboardKPIs, 
  PrepaidCategoryBreakdown, 
  AmortizationTrendPoint,
  Entity,
  PrepaidSubcategory
} from "@shared/schema";

const subcategoryIcons: Record<PrepaidSubcategory, typeof Shield> = {
  INSURANCE: Shield,
  RENT: Building,
  SOFTWARE: Monitor,
  OTHER: Layers,
};

const subcategoryColors: Record<PrepaidSubcategory, string> = {
  INSURANCE: "bg-blue-500",
  RENT: "bg-emerald-500",
  SOFTWARE: "bg-purple-500",
  OTHER: "bg-slate-500",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-600",
  COMPLETED: "bg-slate-500",
  ON_HOLD: "bg-amber-500",
};

const evidenceColors: Record<string, string> = {
  ATTACHED: "bg-emerald-600",
  MISSING: "bg-red-500",
};

const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function PrepaidsDashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2025-02");
  const [searchQuery, setSearchQuery] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");

  const { data: entities = [] } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const buildQueryString = (params: Record<string, string | undefined>) => {
    const filtered = Object.entries(params).filter(([_, v]) => v && v !== "all");
    return filtered.length > 0 
      ? "?" + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join("&")
      : "";
  };

  const kpisUrl = `/api/prepaids/kpis${buildQueryString({ entityId: selectedEntity, period: selectedPeriod })}`;
  const { data: kpis } = useQuery<PrepaidDashboardKPIs>({
    queryKey: [kpisUrl],
  });

  const breakdownUrl = `/api/prepaids/breakdown${buildQueryString({ entityId: selectedEntity })}`;
  const { data: breakdown = [] } = useQuery<PrepaidCategoryBreakdown[]>({
    queryKey: [breakdownUrl],
  });

  const trendUrl = `/api/prepaids/trend${buildQueryString({ entityId: selectedEntity })}`;
  const { data: trend = [] } = useQuery<AmortizationTrendPoint[]>({
    queryKey: [trendUrl],
  });

  const schedulesUrl = `/api/prepaids${buildQueryString({ entityId: selectedEntity, subcategory: subcategoryFilter })}`;
  const { data: schedules = [], isLoading } = useQuery<PrepaidSchedule[]>({
    queryKey: [schedulesUrl],
  });

  const filteredSchedules = schedules.filter((s) => {
    const matchesSearch = searchQuery === "" || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubcategory = subcategoryFilter === "all" || s.subcategory === subcategoryFilter;
    const matchesEntity = selectedEntity === "all" || s.entityId === selectedEntity;
    return matchesSearch && matchesSubcategory && matchesEntity;
  });

  const missingEvidence = schedules.filter(s => s.evidence === "MISSING" && s.status === "ACTIVE").length;
  const totalBreakdownAmount = breakdown.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">Prepaids</h1>
              <p className="text-muted-foreground">
                Period-aware snapshot of prepaid balances and expense recognition
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

            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              In Progress
            </Badge>

            <Button variant="outline" size="sm" data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" data-testid="button-new-schedule">
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <Card className="hover-elevate cursor-pointer" data-testid="kpi-total-balance">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                Total Prepaid Balance
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.totalPrepaidBalance) : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-active-schedules">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                Active Schedules
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.activeSchedules : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-expense-period">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                Expense This Period
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.expenseThisPeriod) : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-remaining">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Wallet className="h-4 w-4" />
                Balance Remaining
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.remainingBalance) : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-expirations">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Expiring (90 days)
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.upcomingExpirations : "-"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5" />
                Amortization Trend
              </CardTitle>
              <CardDescription>Expense recognized over last 6 periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trend.map((point, idx) => {
                  const maxExpense = Math.max(...trend.map(t => t.expense));
                  const widthPercent = maxExpense > 0 ? (point.expense / maxExpense) * 100 : 0;
                  return (
                    <div key={point.period} className="flex items-center gap-3" data-testid={`trend-bar-${idx}`}>
                      <span className="w-16 text-sm font-mono text-muted-foreground">{point.period}</span>
                      <div className="flex-1">
                        <div 
                          className="h-6 bg-primary/80 rounded-sm flex items-center justify-end pr-2"
                          style={{ width: `${widthPercent}%`, minWidth: '40px' }}
                        >
                          <span className="text-xs text-primary-foreground font-medium">
                            {formatCurrency(point.expense)}
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
                Balance by Category
              </CardTitle>
              <CardDescription>Remaining balance composition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {breakdown.map((cat) => {
                  const Icon = subcategoryIcons[cat.category];
                  const percent = totalBreakdownAmount > 0 ? (cat.amount / totalBreakdownAmount) * 100 : 0;
                  return (
                    <div key={cat.category} className="space-y-2" data-testid={`category-${cat.category.toLowerCase()}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${subcategoryColors[cat.category]}`} />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{cat.category}</span>
                          <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                        </div>
                        <span className="text-sm font-mono">{formatCurrency(cat.amount)}</span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {missingEvidence > 0 && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div className="flex-1">
                  <span className="font-medium">{missingEvidence} schedules</span>
                  <span className="text-muted-foreground"> missing evidence documentation</span>
                </div>
                <Button variant="outline" size="sm" data-testid="button-view-missing">
                  View Affected
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Prepaid Schedules</CardTitle>
                <CardDescription>
                  {filteredSchedules.length} schedules · Click to view details
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schedules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[200px]"
                    data-testid="input-search"
                  />
                </div>
                <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-subcategory">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="INSURANCE">Insurance</SelectItem>
                    <SelectItem value="RENT">Rent</SelectItem>
                    <SelectItem value="SOFTWARE">Software</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading schedules...</div>
            ) : filteredSchedules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No schedules found matching your filters.
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table data-testid="schedules-table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Schedule Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Original</TableHead>
                      <TableHead className="text-right">Monthly</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Evidence</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((schedule) => {
                      const Icon = subcategoryIcons[schedule.subcategory];
                      const progressPercent = schedule.originalAmount > 0 
                        ? ((schedule.originalAmount - schedule.remainingBalance) / schedule.originalAmount) * 100 
                        : 0;
                      return (
                        <TableRow key={schedule.id} data-testid={`schedule-row-${schedule.id}`} className="hover-elevate">
                          <TableCell>
                            <Link href={`/prepaids/${schedule.id}`} className="font-medium hover:underline">
                              {schedule.name}
                            </Link>
                            <div className="w-full mt-1">
                              <Progress value={progressPercent} className="h-1" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${subcategoryColors[schedule.subcategory]}`} />
                              <Icon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{schedule.subcategory}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(schedule.startDate)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(schedule.endDate)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(schedule.originalAmount, schedule.currency)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(schedule.monthlyExpense, schedule.currency)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            {formatCurrency(schedule.remainingBalance, schedule.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[schedule.status]} variant="secondary">
                              {schedule.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={evidenceColors[schedule.evidence]} variant="secondary">
                              {schedule.evidence}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {schedule.owner}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/prepaids/${schedule.id}`}>
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

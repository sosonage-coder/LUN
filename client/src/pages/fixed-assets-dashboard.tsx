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
  HardDrive,
  Plus, 
  Download, 
  DollarSign, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  PieChart,
  BarChart3,
  ExternalLink,
  Monitor,
  Sofa,
  Building,
  Car,
  Cog,
  Layers,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import type { 
  FixedAsset, 
  FixedAssetDashboardKPIs, 
  AssetClassBreakdown, 
  DepreciationTrendPoint,
  UsefulLifeDistribution,
  ControlFlag,
  Entity,
  AssetClass
} from "@shared/schema";

const assetClassIcons: Record<AssetClass, typeof Monitor> = {
  IT: Monitor,
  FURNITURE: Sofa,
  LEASEHOLD: Building,
  VEHICLES: Car,
  MACHINERY: Cog,
  OTHER: Layers,
};

const assetClassLabels: Record<AssetClass, string> = {
  IT: "Computers & IT",
  FURNITURE: "Furniture & Fixtures",
  LEASEHOLD: "Leasehold Improvements",
  VEHICLES: "Vehicles",
  MACHINERY: "Machinery & Equipment",
  OTHER: "Other",
};

const assetClassColors: Record<AssetClass, string> = {
  IT: "bg-blue-500",
  FURNITURE: "bg-amber-500",
  LEASEHOLD: "bg-emerald-500",
  VEHICLES: "bg-purple-500",
  MACHINERY: "bg-rose-500",
  OTHER: "bg-slate-500",
};

const statusColors: Record<string, string> = {
  IN_SERVICE: "bg-emerald-600",
  FULLY_DEPRECIATED: "bg-slate-500",
  DISPOSED: "bg-red-500",
  NOT_IN_SERVICE: "bg-amber-500",
};

const statusLabels: Record<string, string> = {
  IN_SERVICE: "In Service",
  FULLY_DEPRECIATED: "Fully Depreciated",
  DISPOSED: "Disposed",
  NOT_IN_SERVICE: "Not In Service",
};

const evidenceColors: Record<string, string> = {
  ATTACHED: "bg-emerald-600",
  MISSING: "bg-red-500",
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

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatUsefulLife = (months: number): string => {
  if (months >= 12) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} yrs`;
  }
  return `${months} mos`;
};

export default function FixedAssetsDashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2025-02");
  const [searchQuery, setSearchQuery] = useState("");
  const [assetClassFilter, setAssetClassFilter] = useState<string>("all");

  const { data: entities = [] } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const buildQueryString = (params: Record<string, string | undefined>) => {
    const filtered = Object.entries(params).filter(([_, v]) => v && v !== "all");
    return filtered.length > 0 
      ? "?" + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join("&")
      : "";
  };

  const kpisUrl = `/api/fixed-assets/kpis${buildQueryString({ entityId: selectedEntity, period: selectedPeriod })}`;
  const { data: kpis } = useQuery<FixedAssetDashboardKPIs>({
    queryKey: [kpisUrl],
  });

  const breakdownUrl = `/api/fixed-assets/breakdown${buildQueryString({ entityId: selectedEntity })}`;
  const { data: breakdown = [] } = useQuery<AssetClassBreakdown[]>({
    queryKey: [breakdownUrl],
  });

  const trendUrl = `/api/fixed-assets/trend${buildQueryString({ entityId: selectedEntity })}`;
  const { data: trend = [] } = useQuery<DepreciationTrendPoint[]>({
    queryKey: [trendUrl],
  });

  const lifecycleUrl = `/api/fixed-assets/lifecycle${buildQueryString({ entityId: selectedEntity })}`;
  const { data: lifecycle = [] } = useQuery<UsefulLifeDistribution[]>({
    queryKey: [lifecycleUrl],
  });

  const flagsUrl = `/api/fixed-assets/flags${buildQueryString({ entityId: selectedEntity })}`;
  const { data: controlFlags = [] } = useQuery<ControlFlag[]>({
    queryKey: [flagsUrl],
  });

  const assetsUrl = `/api/fixed-assets${buildQueryString({ entityId: selectedEntity, assetClass: assetClassFilter })}`;
  const { data: assets = [], isLoading } = useQuery<FixedAsset[]>({
    queryKey: [assetsUrl],
  });

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = searchQuery === "" || 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = assetClassFilter === "all" || a.assetClass === assetClassFilter;
    const matchesEntity = selectedEntity === "all" || a.entityId === selectedEntity;
    return matchesSearch && matchesClass && matchesEntity;
  });

  const totalBreakdownAmount = breakdown.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">Fixed Assets</h1>
              <p className="text-muted-foreground">
                Period-aware view of capitalized assets, depreciation, and control risks
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
            <Button variant="outline" size="sm" data-testid="button-import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button size="sm" data-testid="button-new-asset">
              <Plus className="h-4 w-4 mr-2" />
              New Asset
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          <Card className="hover-elevate cursor-pointer" data-testid="kpi-gross-value">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                Gross Asset Value
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.grossAssetValue) : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-accumulated">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingDown className="h-4 w-4" />
                Accumulated Depr.
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.accumulatedDepreciation) : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-nbv">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <HardDrive className="h-4 w-4" />
                Net Book Value
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.netBookValue) : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-depreciation">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <BarChart3 className="h-4 w-4" />
                Depr. This Period
              </div>
              <div className="text-2xl font-bold">
                {kpis ? formatCurrency(kpis.depreciationThisPeriod) : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-in-service">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CheckCircle2 className="h-4 w-4" />
                In Service
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.assetsInService : "-"}
              </div>
            </CardContent>
          </Card>

          <Card className="hover-elevate cursor-pointer" data-testid="kpi-fully-depreciated">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Fully Depreciated
              </div>
              <div className="text-2xl font-bold">
                {kpis ? kpis.assetsFullyDepreciated : "-"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5" />
                Depreciation Trend
              </CardTitle>
              <CardDescription>Expense recognized over last 6 periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trend.map((point, idx) => {
                  const maxDepreciation = Math.max(...trend.map(t => t.depreciation));
                  const widthPercent = maxDepreciation > 0 ? (point.depreciation / maxDepreciation) * 100 : 0;
                  return (
                    <div key={point.period} className="flex items-center gap-3" data-testid={`trend-bar-${idx}`}>
                      <span className="w-16 text-sm font-mono text-muted-foreground">{point.period}</span>
                      <div className="flex-1">
                        <div 
                          className="h-6 bg-primary/80 rounded-sm flex items-center justify-end pr-2"
                          style={{ width: `${widthPercent}%`, minWidth: '40px' }}
                        >
                          <span className="text-xs text-primary-foreground font-medium">
                            {formatCurrency(point.depreciation)}
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
                Asset Mix by Class
              </CardTitle>
              <CardDescription>Net book value composition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {breakdown.map((cat) => {
                  const Icon = assetClassIcons[cat.assetClass];
                  const percent = totalBreakdownAmount > 0 ? (cat.amount / totalBreakdownAmount) * 100 : 0;
                  return (
                    <div key={cat.assetClass} className="space-y-2" data-testid={`class-${cat.assetClass.toLowerCase()}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${assetClassColors[cat.assetClass]}`} />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{assetClassLabels[cat.assetClass]}</span>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5" />
                Remaining Useful Life
              </CardTitle>
              <CardDescription>Distribution of assets by life remaining</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lifecycle.map((item) => {
                  const maxCount = Math.max(...lifecycle.map(l => l.count));
                  const widthPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                  return (
                    <div key={item.range} className="space-y-2" data-testid={`lifecycle-${item.range.replace(/\s+/g, '-')}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.range}</span>
                        <Badge variant="secondary" className="text-xs">{item.count} assets</Badge>
                      </div>
                      <Progress value={widthPercent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {controlFlags.length > 0 && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Control Flags
              </CardTitle>
              <CardDescription>Compliance and risk indicators requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {controlFlags.map((flag) => {
                  const SeverityIcon = severityIcons[flag.severity];
                  return (
                    <div 
                      key={flag.type} 
                      className="flex items-center gap-3 p-3 rounded-md border bg-background"
                      data-testid={`flag-${flag.type.toLowerCase()}`}
                    >
                      <SeverityIcon className={`h-5 w-5 ${severityColors[flag.severity]}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{flag.count} assets</div>
                        <div className="text-xs text-muted-foreground">{flag.description}</div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
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
                <CardTitle>Fixed Asset Register</CardTitle>
                <CardDescription>
                  {filteredAssets.length} assets · Click to view details
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[200px]"
                    data-testid="input-search"
                  />
                </div>
                <Select value={assetClassFilter} onValueChange={setAssetClassFilter}>
                  <SelectTrigger className="w-[180px]" data-testid="select-class">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Asset Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="IT">Computers & IT</SelectItem>
                    <SelectItem value="FURNITURE">Furniture & Fixtures</SelectItem>
                    <SelectItem value="LEASEHOLD">Leasehold Improvements</SelectItem>
                    <SelectItem value="VEHICLES">Vehicles</SelectItem>
                    <SelectItem value="MACHINERY">Machinery & Equipment</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading assets...</div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No assets found matching your filters.
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table data-testid="assets-table">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>In-Service Date</TableHead>
                      <TableHead>Useful Life</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead className="text-right">Accum. Depr.</TableHead>
                      <TableHead className="text-right">NBV</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Evidence</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => {
                      const Icon = assetClassIcons[asset.assetClass];
                      const depreciationPercent = asset.cost > 0 
                        ? (asset.accumulatedDepreciation / asset.cost) * 100 
                        : 0;
                      return (
                        <TableRow key={asset.id} data-testid={`asset-row-${asset.id}`} className="hover-elevate">
                          <TableCell>
                            <Link href={`/fixed-assets/${asset.id}`} className="font-medium hover:underline">
                              {asset.name}
                            </Link>
                            <div className="w-full mt-1">
                              <Progress value={depreciationPercent} className="h-1" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${assetClassColors[asset.assetClass]}`} />
                              <Icon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{asset.assetClass}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(asset.inServiceDate)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatUsefulLife(asset.usefulLifeMonths)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {asset.depreciationMethod === "STRAIGHT_LINE" ? "SL" : 
                             asset.depreciationMethod === "DOUBLE_DECLINING" ? "DDB" : 
                             asset.depreciationMethod}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(asset.cost, asset.currency)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
                            {formatCurrency(asset.accumulatedDepreciation, asset.currency)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            {formatCurrency(asset.netBookValue, asset.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[asset.status]} variant="secondary">
                              {statusLabels[asset.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={evidenceColors[asset.evidence]} variant="secondary">
                              {asset.evidence}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {asset.owner}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/fixed-assets/${asset.id}`}>
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

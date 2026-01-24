import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Plus, 
  Download, 
  AlertTriangle,
  FileText,
  Calendar,
  History,
  Paperclip,
  Shield,
  Edit,
  TrendingDown
} from "lucide-react";
import type { 
  FixedAsset,
  AssetClass
} from "@shared/schema";

const categoryLabels: Record<AssetClass, string> = {
  IT: "IT Equipment",
  FURNITURE: "Furniture & Fixtures",
  LEASEHOLD: "Leasehold Improvements",
  VEHICLES: "Vehicles",
  MACHINERY: "Machinery & Equipment",
  OTHER: "Other Assets",
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

const methodLabels: Record<string, string> = {
  STRAIGHT_LINE: "Straight Line",
  DOUBLE_DECLINING: "Double Declining",
  UNITS_OF_PRODUCTION: "Units of Production",
  CUSTOM: "Custom",
};

const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

interface PeriodLine {
  period: string;
  state: string;
  depreciation: number;
  cumulative: number;
  nbv: number;
}

export default function FixedAssetsWorkspace() {
  const params = useParams<{ category: string; id: string }>();
  
  const { data: asset, isLoading } = useQuery<FixedAsset>({
    queryKey: ["/api/fixed-assets", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/fixed-assets/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch asset");
      return res.json();
    },
    enabled: !!params.id,
  });

  const mockPeriodLines: PeriodLine[] = [
    { period: "2025-07", state: "CLOSED", depreciation: 2500, cumulative: 2500, nbv: 147500 },
    { period: "2025-08", state: "CLOSED", depreciation: 2500, cumulative: 5000, nbv: 145000 },
    { period: "2025-09", state: "CLOSED", depreciation: 2500, cumulative: 7500, nbv: 142500 },
    { period: "2025-10", state: "SYSTEM_BASE", depreciation: 2500, cumulative: 10000, nbv: 140000 },
    { period: "2025-11", state: "SYSTEM_BASE", depreciation: 2500, cumulative: 12500, nbv: 137500 },
    { period: "2025-12", state: "SYSTEM_BASE", depreciation: 2500, cumulative: 15000, nbv: 135000 },
  ];

  const stateColors: Record<string, string> = {
    CLOSED: "bg-slate-600",
    SYSTEM_BASE: "bg-blue-500",
    SYSTEM_ADJUSTED: "bg-amber-500",
    EXTERNAL: "bg-purple-500",
  };

  const stateLabels: Record<string, string> = {
    CLOSED: "Closed",
    SYSTEM_BASE: "Base",
    SYSTEM_ADJUSTED: "Adjusted",
    EXTERNAL: "External",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Asset not found
          </CardContent>
        </Card>
      </div>
    );
  }

  const depreciationPercent = (asset.accumulatedDepreciation / asset.cost) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/fixed-assets/${params.category}`}>
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" data-testid="asset-name">{asset.name}</h1>
              <Badge className={statusColors[asset.status]} variant="secondary">
                {statusLabels[asset.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {categoryLabels[asset.assetClass]} • {methodLabels[asset.depreciationMethod]} • {asset.owner}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" data-testid="button-edit">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" data-testid="button-add-event">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card data-testid="kpi-cost">
          <CardHeader className="pb-2">
            <CardDescription>Cost</CardDescription>
            <CardTitle className="text-xl">
              {formatCurrency(asset.cost, asset.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-accumulated">
          <CardHeader className="pb-2">
            <CardDescription>Accumulated Depr.</CardDescription>
            <CardTitle className="text-xl text-amber-500">
              {formatCurrency(asset.accumulatedDepreciation, asset.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-nbv">
          <CardHeader className="pb-2">
            <CardDescription>Net Book Value</CardDescription>
            <CardTitle className="text-xl text-emerald-500">
              {formatCurrency(asset.netBookValue, asset.currency)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-useful-life">
          <CardHeader className="pb-2">
            <CardDescription>Useful Life</CardDescription>
            <CardTitle className="text-xl">
              {asset.usefulLifeMonths} months
            </CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-evidence">
          <CardHeader className="pb-2">
            <CardDescription>Evidence</CardDescription>
            <CardTitle className="text-xl">
              <Badge className={evidenceColors[asset.evidence]} variant="secondary">
                {asset.evidence}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Depreciation Progress</span>
            <span className="text-sm text-muted-foreground">{depreciationPercent.toFixed(1)}% depreciated</span>
          </div>
          <Progress value={depreciationPercent} className="h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="periods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="periods" data-testid="tab-periods">
            <Calendar className="h-4 w-4 mr-2" />
            Depreciation Schedule
          </TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">
            <History className="h-4 w-4 mr-2" />
            Event History
          </TabsTrigger>
          <TabsTrigger value="evidence" data-testid="tab-evidence">
            <Paperclip className="h-4 w-4 mr-2" />
            Evidence
          </TabsTrigger>
          <TabsTrigger value="audit" data-testid="tab-audit">
            <Shield className="h-4 w-4 mr-2" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="periods">
          <Card>
            <CardHeader>
              <CardTitle>Depreciation Schedule</CardTitle>
              <CardDescription>
                Monthly depreciation from in-service date {asset.inServiceDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table data-testid="period-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Depreciation</TableHead>
                    <TableHead className="text-right">Cumulative</TableHead>
                    <TableHead className="text-right">Net Book Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPeriodLines.map((line) => (
                    <TableRow key={line.period} data-testid={`period-row-${line.period}`}>
                      <TableCell className="font-mono">{line.period}</TableCell>
                      <TableCell>
                        <Badge className={stateColors[line.state]} variant="secondary">
                          {stateLabels[line.state]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-amber-500">
                        {formatCurrency(line.depreciation)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(line.cumulative)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-emerald-500">
                        {formatCurrency(line.nbv)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event History</CardTitle>
              <CardDescription>
                Append-only log of all modifications to this asset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="events-list">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-2 h-2 rounded-full mt-2 bg-emerald-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">PLACED_IN_SERVICE</Badge>
                      <span className="text-sm text-muted-foreground font-mono">{asset.inServiceDate.substring(0, 7)}</span>
                    </div>
                    <p className="mt-1">Asset placed in service with cost of {formatCurrency(asset.cost, asset.currency)}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {formatDate(asset.createdAt)} by {asset.owner}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle>Evidence & Attachments</CardTitle>
              <CardDescription>
                Supporting documentation for this asset
              </CardDescription>
            </CardHeader>
            <CardContent>
              {asset.evidence === "ATTACHED" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover-elevate">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Purchase_Invoice.pdf</p>
                      <p className="text-sm text-muted-foreground">Uploaded {formatDate(asset.createdAt)}</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No evidence attached to this asset</p>
                  <Button>
                    <Paperclip className="h-4 w-4 mr-2" />
                    Upload Evidence
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete history of all changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table data-testid="audit-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">{formatDate(asset.createdAt)}</TableCell>
                    <TableCell><Badge variant="outline">Created</Badge></TableCell>
                    <TableCell>{asset.owner}</TableCell>
                    <TableCell className="text-muted-foreground">Asset record created</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

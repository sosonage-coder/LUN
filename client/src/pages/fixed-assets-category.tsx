import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft,
  Plus, 
  Download, 
  Laptop,
  Armchair,
  Home,
  Car,
  Cog,
  MoreHorizontal,
  FileText,
  Eye,
  ExternalLink
} from "lucide-react";
import type { 
  FixedAsset,
  AssetClass
} from "@shared/schema";

const categoryIcons: Record<AssetClass, typeof Laptop> = {
  IT: Laptop,
  FURNITURE: Armchair,
  LEASEHOLD: Home,
  VEHICLES: Car,
  MACHINERY: Cog,
  OTHER: MoreHorizontal,
};

const categoryLabels: Record<AssetClass, string> = {
  IT: "IT Equipment",
  FURNITURE: "Furniture & Fixtures",
  LEASEHOLD: "Leasehold Improvements",
  VEHICLES: "Vehicles",
  MACHINERY: "Machinery & Equipment",
  OTHER: "Other Assets",
};

const categoryColors: Record<AssetClass, string> = {
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

const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FixedAssetsCategory() {
  const params = useParams<{ category: string }>();
  const categoryKey = params.category?.toUpperCase().replace(/-/g, "_") as AssetClass;
  
  const { data: assets = [], isLoading } = useQuery<FixedAsset[]>({
    queryKey: ["/api/fixed-assets", categoryKey],
    queryFn: async () => {
      const res = await fetch(`/api/fixed-assets?assetClass=${categoryKey}`);
      if (!res.ok) throw new Error("Failed to fetch assets");
      return res.json();
    },
    enabled: !!categoryKey,
  });

  const inServiceAssets = assets.filter(a => a.status === "IN_SERVICE");
  const totalNBV = inServiceAssets.reduce((sum, a) => sum + a.netBookValue, 0);
  const totalCost = inServiceAssets.reduce((sum, a) => sum + a.cost, 0);
  
  const CategoryIcon = categoryIcons[categoryKey] || MoreHorizontal;
  const categoryLabel = categoryLabels[categoryKey] || params.category;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/fixed-assets">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${categoryColors[categoryKey]} flex items-center justify-center`}>
              <CategoryIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">{categoryLabel}</h1>
              <p className="text-muted-foreground">Fixed assets in this class</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" data-testid="button-new-asset">
            <Plus className="h-4 w-4 mr-2" />
            New Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="kpi-in-service">
          <CardHeader className="pb-2">
            <CardDescription>In Service</CardDescription>
            <CardTitle className="text-2xl">{inServiceAssets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-gross-cost">
          <CardHeader className="pb-2">
            <CardDescription>Gross Cost</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalCost)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-net-book-value">
          <CardHeader className="pb-2">
            <CardDescription>Net Book Value</CardDescription>
            <CardTitle className="text-2xl text-emerald-500">{formatCurrency(totalNBV)}</CardTitle>
          </CardHeader>
        </Card>
        <Card data-testid="kpi-missing-evidence">
          <CardHeader className="pb-2">
            <CardDescription>Missing Evidence</CardDescription>
            <CardTitle className="text-2xl text-red-500">
              {inServiceAssets.filter(a => a.evidence === "MISSING").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fixed Assets</CardTitle>
          <CardDescription>
            All assets in {categoryLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table data-testid="assets-table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>In Service Date</TableHead>
                <TableHead>Useful Life</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Accum. Depr.</TableHead>
                <TableHead className="text-right">Net Book Value</TableHead>
                <TableHead>Evidence</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No assets in this class
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id} data-testid={`asset-row-${asset.id}`} className="hover-elevate">
                    <TableCell>
                      <Link 
                        href={`/fixed-assets/${params.category}/asset/${asset.id}`}
                        className="font-medium hover:underline flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {asset.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[asset.status]} variant="secondary">
                        {statusLabels[asset.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{asset.inServiceDate}</TableCell>
                    <TableCell>{asset.usefulLifeMonths} months</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(asset.cost, asset.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-amber-500">
                      {formatCurrency(asset.accumulatedDepreciation, asset.currency)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-emerald-500">
                      {formatCurrency(asset.netBookValue, asset.currency)}
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
                      <div className="flex items-center gap-1">
                        <Link href={`/fixed-assets/${params.category}/asset/${asset.id}`}>
                          <Button variant="ghost" size="icon" data-testid={`button-view-${asset.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" data-testid={`button-external-${asset.id}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

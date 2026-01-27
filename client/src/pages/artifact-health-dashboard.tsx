import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText,
  Check,
  Clock,
  AlertTriangle,
  AlertCircle,
  Shield,
  Calendar,
  Building,
  TrendingUp,
  ChevronRight,
  Eye,
  FileWarning,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import type { 
  ArtifactHealthMetrics,
  EntityCoverageSummary,
  PeriodCoverageSummary,
  Entity,
  ArtifactStatus,
} from "@shared/schema";

const statusColors: Record<ArtifactStatus, string> = {
  DRAFT: "bg-gray-500",
  PENDING: "bg-yellow-500",
  REVIEWED: "bg-blue-500",
  APPROVED: "bg-green-500",
  ARCHIVED: "bg-slate-400",
};

export default function ArtifactHealthDashboard() {
  const [selectedEntity, setSelectedEntity] = useState<string>("ALL");

  const { data: healthMetrics, isLoading: metricsLoading } = useQuery<ArtifactHealthMetrics>({
    queryKey: ["/api/artifacts/health", selectedEntity === "ALL" ? undefined : selectedEntity],
  });

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const { data: entityCoverage, isLoading: coverageLoading } = useQuery<EntityCoverageSummary[]>({
    queryKey: ["/api/artifacts/coverage/entities"],
  });

  const totalArtifacts = healthMetrics?.totalArtifacts ?? 0;
  const requiredComplete = healthMetrics?.requiredComplete ?? 0;
  const requiredTotal = healthMetrics?.requiredArtifacts ?? 0;
  const completionRate = requiredTotal > 0 ? Math.round((requiredComplete / requiredTotal) * 100) : 100;
  const auditReadyRate = (healthMetrics?.auditRelevant ?? 0) > 0 
    ? Math.round(((healthMetrics?.auditRelevantApproved ?? 0) / healthMetrics!.auditRelevant) * 100) 
    : 100;

  return (
    <div className="p-6 space-y-6" data-testid="artifact-health-dashboard">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documentation Health</h1>
          <p className="text-muted-foreground mt-1">
            Period completeness, aging alerts, and audit readiness signals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-[180px]" data-testid="select-entity-filter">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Entities</SelectItem>
              {entities?.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link href="/artifacts">
            <Button variant="outline" data-testid="button-view-all-artifacts">
              <Eye className="h-4 w-4 mr-2" />
              View All Artifacts
            </Button>
          </Link>
        </div>
      </div>

      {metricsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <Badge variant="outline">{totalArtifacts} total</Badge>
                </div>
                <p className="text-2xl font-semibold mt-3">
                  {requiredComplete}/{requiredTotal}
                </p>
                <p className="text-sm text-muted-foreground">Required Complete</p>
                <Progress value={completionRate} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  {(healthMetrics?.unreviewed ?? 0) > 5 && (
                    <Badge variant="destructive">Action Needed</Badge>
                  )}
                </div>
                <p className="text-2xl font-semibold mt-3">{healthMetrics?.unreviewed ?? 0}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>Draft: {healthMetrics?.byStatus?.DRAFT ?? 0}</span>
                  <span>|</span>
                  <span>Pending: {healthMetrics?.byStatus?.PENDING ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  {(healthMetrics?.staleArtifacts ?? 0) > 0 && (
                    <Badge variant="destructive">{healthMetrics?.staleArtifacts} stale</Badge>
                  )}
                </div>
                <p className="text-2xl font-semibold mt-3">{healthMetrics?.staleArtifacts ?? 0}</p>
                <p className="text-sm text-muted-foreground">Stale (90+ days)</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3" />
                  <span>Recently modified: {healthMetrics?.recentlyModified ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <Badge variant="outline">{auditReadyRate}% ready</Badge>
                </div>
                <p className="text-2xl font-semibold mt-3">
                  {healthMetrics?.auditRelevantApproved ?? 0}/{healthMetrics?.auditRelevant ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Audit Relevant Approved</p>
                <Progress value={auditReadyRate} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Contract Alerts
                </CardTitle>
                <CardDescription>Expiring and expired contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
                    <div className="flex items-center gap-3">
                      <FileWarning className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-sm">Expiring Soon</p>
                        <p className="text-xs text-muted-foreground">Within 30 days</p>
                      </div>
                    </div>
                    <span className="text-xl font-semibold text-orange-600">
                      {healthMetrics?.expiringContracts ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">Expired</p>
                        <p className="text-xs text-muted-foreground">Past due date</p>
                      </div>
                    </div>
                    <span className="text-xl font-semibold text-red-600">
                      {healthMetrics?.expiredContracts ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Status Distribution
                </CardTitle>
                <CardDescription>Artifact breakdown by review status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(healthMetrics?.byStatus ?? {}).map(([status, count]) => (
                    <div key={status} className="text-center p-3 rounded-lg bg-muted/50">
                      <Badge className={`${statusColors[status as ArtifactStatus]} text-white mb-2`}>
                        {status}
                      </Badge>
                      <p className="text-2xl font-semibold">{count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-500" />
                Entity Coverage
              </CardTitle>
              <CardDescription>Documentation completeness by entity</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {coverageLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : entityCoverage && entityCoverage.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity</TableHead>
                    <TableHead>Completeness</TableHead>
                    <TableHead>Periods</TableHead>
                    <TableHead>Critical Gaps</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entityCoverage.map((entity) => (
                    <TableRow key={entity.entityId} data-testid={`entity-row-${entity.entityId}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{entity.entityName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-[150px]">
                          <Progress value={entity.overallCompleteness} className="h-2 flex-1" />
                          <span className="text-sm font-medium w-12">
                            {entity.overallCompleteness}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{entity.periods.length} periods</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {entity.criticalGaps > 0 ? (
                          <Badge variant="destructive">{entity.criticalGaps} gaps</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/artifacts?entityId=${entity.entityId}`}>
                          <Button size="sm" variant="ghost" data-testid={`button-view-${entity.entityId}`}>
                            View
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No entity coverage data available</p>
              <p className="text-sm">Upload artifacts to see coverage metrics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

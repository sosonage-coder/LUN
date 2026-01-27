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
  Eye,
  FileWarning,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import type { 
  ArtifactHealthMetrics,
  EntityCoverageSummary,
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

  const healthUrl = selectedEntity === "ALL" 
    ? "/api/artifacts/health" 
    : `/api/artifacts/health?entityId=${selectedEntity}`;

  const { data: healthMetrics, isLoading: metricsLoading } = useQuery<ArtifactHealthMetrics>({
    queryKey: ["/api/artifacts/health", selectedEntity],
    queryFn: async () => {
      const res = await fetch(healthUrl);
      if (!res.ok) throw new Error("Failed to fetch health metrics");
      return res.json();
    },
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
          <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-page-title">Documentation Health</h1>
          <p className="text-muted-foreground mt-1" data-testid="text-page-description">
            Period completeness, aging alerts, and audit readiness signals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedEntity} onValueChange={setSelectedEntity}>
            <SelectTrigger className="w-[180px]" data-testid="select-entity-filter">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" data-testid="select-item-all-entities">All Entities</SelectItem>
              {entities?.map((entity) => (
                <SelectItem key={entity.id} value={entity.id} data-testid={`select-item-entity-${entity.id}`}>
                  {entity.name}
                </SelectItem>
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
            <Skeleton key={i} className="h-32" data-testid={`skeleton-card-${i}`} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card data-testid="card-required-complete">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <Badge variant="outline" data-testid="badge-total-artifacts">{totalArtifacts} total</Badge>
                </div>
                <p className="text-2xl font-semibold mt-3" data-testid="text-required-complete-value">
                  {requiredComplete}/{requiredTotal}
                </p>
                <p className="text-sm text-muted-foreground">Required Complete</p>
                <Progress value={completionRate} className="h-2 mt-2" data-testid="progress-completion" />
              </CardContent>
            </Card>

            <Card data-testid="card-pending-review">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  {(healthMetrics?.unreviewed ?? 0) > 5 && (
                    <Badge variant="destructive" data-testid="badge-action-needed">Action Needed</Badge>
                  )}
                </div>
                <p className="text-2xl font-semibold mt-3" data-testid="text-pending-review-value">{healthMetrics?.unreviewed ?? 0}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span data-testid="text-draft-count">Draft: {healthMetrics?.byStatus?.DRAFT ?? 0}</span>
                  <span>|</span>
                  <span data-testid="text-pending-count">Pending: {healthMetrics?.byStatus?.PENDING ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stale-artifacts">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  {(healthMetrics?.staleArtifacts ?? 0) > 0 && (
                    <Badge variant="destructive" data-testid="badge-stale-count">{healthMetrics?.staleArtifacts} stale</Badge>
                  )}
                </div>
                <p className="text-2xl font-semibold mt-3" data-testid="text-stale-value">{healthMetrics?.staleArtifacts ?? 0}</p>
                <p className="text-sm text-muted-foreground">Stale (90+ days)</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3" />
                  <span data-testid="text-recently-modified">Recently modified: {healthMetrics?.recentlyModified ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-audit-readiness">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <Badge variant="outline" data-testid="badge-audit-rate">{auditReadyRate}% ready</Badge>
                </div>
                <p className="text-2xl font-semibold mt-3" data-testid="text-audit-value">
                  {healthMetrics?.auditRelevantApproved ?? 0}/{healthMetrics?.auditRelevant ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Audit Relevant Approved</p>
                <Progress value={auditReadyRate} className="h-2 mt-2" data-testid="progress-audit" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1" data-testid="card-contract-alerts">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Contract Alerts
                </CardTitle>
                <CardDescription>Expiring and expired contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900"
                    data-testid="alert-expiring-contracts"
                  >
                    <div className="flex items-center gap-3">
                      <FileWarning className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium text-sm">Expiring Soon</p>
                        <p className="text-xs text-muted-foreground">Within 30 days</p>
                      </div>
                    </div>
                    <span className="text-xl font-semibold text-orange-600" data-testid="text-expiring-count">
                      {healthMetrics?.expiringContracts ?? 0}
                    </span>
                  </div>
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                    data-testid="alert-expired-contracts"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">Expired</p>
                        <p className="text-xs text-muted-foreground">Past due date</p>
                      </div>
                    </div>
                    <span className="text-xl font-semibold text-red-600" data-testid="text-expired-count">
                      {healthMetrics?.expiredContracts ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2" data-testid="card-status-distribution">
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
                    <div 
                      key={status} 
                      className="text-center p-3 rounded-lg bg-muted/50"
                      data-testid={`status-card-${status.toLowerCase()}`}
                    >
                      <Badge className={`${statusColors[status as ArtifactStatus]} text-white mb-2`}>
                        {status}
                      </Badge>
                      <p className="text-2xl font-semibold" data-testid={`text-status-count-${status.toLowerCase()}`}>{count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Card data-testid="card-entity-coverage">
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
                <Skeleton key={i} className="h-16 w-full" data-testid={`skeleton-coverage-${i}`} />
              ))}
            </div>
          ) : entityCoverage && entityCoverage.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead data-testid="th-entity">Entity</TableHead>
                    <TableHead data-testid="th-completeness">Completeness</TableHead>
                    <TableHead data-testid="th-periods">Periods</TableHead>
                    <TableHead data-testid="th-gaps">Critical Gaps</TableHead>
                    <TableHead className="w-[100px]" data-testid="th-actions">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entityCoverage.map((entity) => (
                    <TableRow key={entity.entityId} data-testid={`row-entity-${entity.entityId}`}>
                      <TableCell data-testid={`cell-entity-name-${entity.entityId}`}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{entity.entityName}</span>
                        </div>
                      </TableCell>
                      <TableCell data-testid={`cell-completeness-${entity.entityId}`}>
                        <div className="flex items-center gap-3 min-w-[150px]">
                          <Progress value={entity.overallCompleteness} className="h-2 flex-1" />
                          <span className="text-sm font-medium w-12" data-testid={`text-completeness-value-${entity.entityId}`}>
                            {entity.overallCompleteness}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell data-testid={`cell-periods-${entity.entityId}`}>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm" data-testid={`text-periods-count-${entity.entityId}`}>{entity.periods.length} periods</span>
                        </div>
                      </TableCell>
                      <TableCell data-testid={`cell-gaps-${entity.entityId}`}>
                        {entity.criticalGaps > 0 ? (
                          <Badge variant="destructive" data-testid={`badge-gaps-${entity.entityId}`}>{entity.criticalGaps} gaps</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600" data-testid={`badge-complete-${entity.entityId}`}>
                            <Check className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/artifacts?entityId=${entity.entityId}`}>
                          <Button size="sm" variant="ghost" data-testid={`button-view-entity-${entity.entityId}`}>
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
            <div className="text-center py-8 text-muted-foreground" data-testid="empty-coverage-state">
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

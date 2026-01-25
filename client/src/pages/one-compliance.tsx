import { useState, useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  FileText,
  Users,
  Globe,
  Sparkles,
  Target,
  DollarSign,
  BarChart3,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  MapPin,
  Briefcase,
  Scale,
  Gavel,
  BookOpen,
  UserCheck,
  Building,
  Network,
  FileCheck,
  ClipboardList,
  Eye,
  Lock,
  Lightbulb,
  Activity,
  PieChart,
  Layers,
  ExternalLink,
  Coins,
  CircleDollarSign,
  Receipt,
  LayoutGrid,
  Rocket,
  FileSpreadsheet,
  Award,
  Percent,
  Timer,
  Wallet,
  LayoutDashboard,
  FolderArchive,
  Link2,
  PenTool,
  FileClock,
  MessageSquare,
  GitMerge,
  Archive,
  Camera,
  ClipboardCheck,
  BarChart2,
  FileBarChart,
  Plug,
} from "lucide-react";
import {
  getEntities,
  getObligations,
  getComplianceMetrics,
  getJurisdictionHeatmap,
  getTimeline,
  getAIInsights,
  getRisks,
  getPolicies,
  getAdvisors,
  getMeetings,
  getResolutions,
  getSignatories,
  getChanges,
  getSnapshots,
  getOfficers,
  getJurisdictions,
  getShareholders,
  getShareClasses,
  getEquityEvents,
  getDividends,
  getEquityMetrics,
  getFundingRounds,
  getFundingRoundInvestors,
  getConvertibleInstruments,
  getOptionPools,
  getOptionGrants,
  getStartupEquityMetrics,
  getFilingRequirements,
  getFilingRequirementMetrics,
  FIELD_METADATA,
  type FieldMeta,
  type FieldCaptureMode,
  type Entity,
  type Obligation,
  type TimelineItem,
  type AIInsight,
  type ComplianceRisk,
  type Policy,
  type ThirdPartyAdvisor,
  type Meeting,
  type Resolution,
  type AuthorizedSignatory,
  type EntityChange,
  type JurisdictionHeatmapCell,
  type FilingRequirement,
} from "@/lib/one-compliance-data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ================================
// Field Capture Indicators
// ================================

function FieldIndicator({ 
  mode, 
  label, 
  description,
  showLabel = true 
}: { 
  mode: FieldCaptureMode; 
  label?: string;
  description?: string;
  showLabel?: boolean;
}) {
  const isManual = mode === "MANUAL";
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span 
          className={`inline-flex items-center gap-1 text-xs ${isManual ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}
          data-testid={`field-indicator-${mode.toLowerCase()}`}
        >
          {isManual ? (
            <PenTool className="h-3 w-3" />
          ) : (
            <Activity className="h-3 w-3" />
          )}
          {showLabel && label && <span className="font-medium">{label}</span>}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="text-xs">
          <div className="font-medium mb-1">
            {isManual ? "Manual Entry" : "System Generated"}
          </div>
          {description && <div className="text-muted-foreground">{description}</div>}
          {!description && (
            <div className="text-muted-foreground">
              {isManual 
                ? "This field is entered by users" 
                : "This field is automatically calculated or derived by the system"}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function FieldLabel({ 
  interfaceName, 
  fieldName,
  children 
}: { 
  interfaceName: keyof typeof FIELD_METADATA; 
  fieldName: string;
  children?: React.ReactNode;
}) {
  const metadata = FIELD_METADATA[interfaceName];
  const fieldMeta = metadata?.[fieldName as keyof typeof metadata] as FieldMeta | undefined;
  
  if (!fieldMeta) {
    return <span className="text-sm font-medium">{children || fieldName}</span>;
  }
  
  return (
    <span className="inline-flex items-center gap-1.5">
      <FieldIndicator 
        mode={fieldMeta.mode} 
        label={fieldMeta.label}
        description={fieldMeta.description}
        showLabel={false}
      />
      <span className="text-sm font-medium">{children || fieldMeta.label}</span>
    </span>
  );
}

function DataCaptureLegend({ compact = false, sectionId }: { compact?: boolean; sectionId?: string }) {
  return (
    <div 
      className={`flex items-center gap-4 ${compact ? "text-xs" : "text-sm"} text-muted-foreground`}
      data-testid={`data-capture-legend${sectionId ? `-${sectionId}` : ""}`}
    >
      <div className="flex items-center gap-1.5">
        <PenTool className={`${compact ? "h-3 w-3" : "h-4 w-4"} text-blue-600 dark:text-blue-400`} />
        <span>Manual Entry</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Activity className={`${compact ? "h-3 w-3" : "h-4 w-4"} text-muted-foreground`} />
        <span>System Generated</span>
      </div>
    </div>
  );
}

function StatusBadge({ status, variant }: { status: string; variant?: "default" | "success" | "warning" | "destructive" }) {
  const getVariant = () => {
    if (variant) return variant;
    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "FILED":
      case "APPROVED":
      case "COMPLETED":
      case "EXECUTED":
        return "default";
      case "PENDING":
      case "PENDING_APPROVAL":
      case "SCHEDULED":
      case "DRAFT":
        return "secondary";
      case "OVERDUE":
      case "CRITICAL":
      case "HIGH":
      case "REJECTED":
        return "destructive";
      case "DORMANT":
      case "EXPIRING_SOON":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getVariant() as "default" | "secondary" | "destructive" | "outline"} data-testid={`badge-status-${status.toLowerCase()}`}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendLabel,
  variant = "default" 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const bgClass = {
    default: "bg-card",
    success: "bg-green-500/10 dark:bg-green-500/20",
    warning: "bg-yellow-500/10 dark:bg-yellow-500/20",
    danger: "bg-red-500/10 dark:bg-red-500/20",
  }[variant];

  const iconClass = {
    default: "text-primary",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  }[variant];

  return (
    <Card className={bgClass} data-testid={`metric-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={`p-2 rounded-md ${bgClass}`}>
            <Icon className={`h-5 w-5 ${iconClass}`} />
          </div>
        </div>
        {trend && trendLabel && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3 w-3 text-red-600" />
            ) : null}
            <span className={trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"}>
              {trendLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HealthScoreGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 90) return "text-green-600 dark:text-green-400";
    if (s >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="flex flex-col items-center justify-center p-6" data-testid="health-score-gauge">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted/20"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={`${score * 3.52} 352`}
            className={getColor(score)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getColor(score)}`}>{score}</span>
          <span className="text-xs text-muted-foreground">Health Score</span>
        </div>
      </div>
    </div>
  );
}

function RiskHeatmap({ data }: { data: JurisdictionHeatmapCell[] }) {
  const getHeatColor = (score: number) => {
    if (score >= 90) return "bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-300";
    if (score >= 80) return "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400";
    if (score >= 70) return "bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:text-yellow-300";
    if (score >= 60) return "bg-orange-500/20 border-orange-500/30 text-orange-700 dark:text-orange-300";
    return "bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-300";
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2" data-testid="risk-heatmap">
      {data.map((cell) => (
        <div
          key={cell.jurisdictionCode}
          className={`p-3 rounded-lg border ${getHeatColor(cell.healthScore)} hover-elevate cursor-pointer transition-all`}
          title={`${cell.jurisdictionName}: ${cell.entityCount} entities, ${cell.healthScore}% health`}
          data-testid={`heatmap-cell-${cell.jurisdictionCode.toLowerCase()}`}
        >
          <div className="text-xs font-medium truncate">{cell.jurisdictionCode}</div>
          <div className="text-lg font-bold">{cell.healthScore}%</div>
          <div className="text-xs opacity-70">{cell.entityCount} entities</div>
          {cell.overdueCount > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              {cell.overdueCount} overdue
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TimelineView({ items }: { items: TimelineItem[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "border-l-red-500 bg-red-500/5";
      case "HIGH": return "border-l-orange-500 bg-orange-500/5";
      case "MEDIUM": return "border-l-yellow-500 bg-yellow-500/5";
      default: return "border-l-green-500 bg-green-500/5";
    }
  };

  return (
    <ScrollArea className="h-[400px]" data-testid="timeline-view">
      <div className="space-y-2 pr-4">
        {items.slice(0, 15).map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border-l-4 ${getPriorityColor(item.priority)} hover-elevate cursor-pointer`}
            data-testid={`timeline-item-${item.id}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{item.title}</span>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate">{item.entityName}</span>
                  <span className="opacity-50">|</span>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.dueDate)}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                {item.daysUntilDue < 0 ? (
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {Math.abs(item.daysUntilDue)}d overdue
                  </span>
                ) : item.daysUntilDue === 0 ? (
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    Due today
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {item.daysUntilDue}d
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function AIInsightsPanel({ insights }: { insights: AIInsight[] }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RISK": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "OPPORTUNITY": return <Lightbulb className="h-4 w-4 text-green-500" />;
      case "PREDICTION": return <Activity className="h-4 w-4 text-blue-500" />;
      case "RECOMMENDATION": return <Target className="h-4 w-4 text-purple-500" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-3" data-testid="ai-insights-panel">
      {insights.map((insight) => (
        <Card key={insight.id} className="hover-elevate" data-testid={`insight-${insight.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getTypeIcon(insight.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{insight.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={insight.impact === "HIGH" ? "destructive" : insight.impact === "MEDIUM" ? "secondary" : "outline"}>
                    {insight.impact} impact
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {insight.affectedEntities.length} entities affected
                  </span>
                </div>
              </div>
            </div>
            {insight.suggestedAction && (
              <div className="mt-3 p-2 rounded bg-muted/50 text-xs">
                <span className="font-medium">Suggested: </span>
                {insight.suggestedAction}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EntityGrid({ entities }: { entities: Entity[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="entity-grid">
      {entities.map((entity) => (
        <Card key={entity.id} className="hover-elevate" data-testid={`entity-card-${entity.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="flex items-center gap-1">
                    <FieldIndicator mode="MANUAL" showLabel={false} description="Entity name is manually entered" />
                    <h4 className="font-medium text-sm">{entity.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{entity.legalName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Status updated by lifecycle events" />
                <StatusBadge status={entity.status} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span>{entity.jurisdictionCode}</span>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span>{entity.entityType}</span>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{formatDate(entity.incorporationDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <span>{entity.localCurrency}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Health score calculated from compliance data" />
                <span className="text-xs text-muted-foreground">Health:</span>
                <Progress value={entity.healthScore} className="w-16 h-2" />
                <span className={`text-xs font-medium ${entity.healthScore >= 80 ? "text-green-600" : entity.healthScore >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                  {entity.healthScore}%
                </span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ObligationsTable({ obligations }: { obligations: Obligation[] }) {
  return (
    <div className="rounded-md border" data-testid="obligations-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                Obligation
              </span>
            </TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                Type
              </span>
            </TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Calculated from frequency" />
                Due Date
              </span>
            </TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Updated by system" />
                Status
              </span>
            </TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                Assigned
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {obligations.slice(0, 10).map((obl) => {
            const entity = getEntities().find(e => e.id === obl.entityId);
            return (
              <TableRow key={obl.id} className="hover-elevate cursor-pointer" data-testid={`obligation-row-${obl.id}`}>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{obl.name}</div>
                    <div className="text-xs text-muted-foreground">{obl.authority}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{entity?.name || obl.entityId}</TableCell>
                <TableCell>
                  <Badge variant="outline">{obl.obligationType}</Badge>
                </TableCell>
                <TableCell className="text-sm">{formatDate(obl.dueDate)}</TableCell>
                <TableCell>
                  <StatusBadge status={obl.filingStatus} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {obl.assignedTo.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{obl.assignedTo}</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function RisksPanel({ risks }: { risks: ComplianceRisk[] }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "border-l-red-600 bg-red-500/5";
      case "HIGH": return "border-l-orange-500 bg-orange-500/5";
      case "MEDIUM": return "border-l-yellow-500 bg-yellow-500/5";
      default: return "border-l-green-500 bg-green-500/5";
    }
  };

  return (
    <div className="space-y-3" data-testid="risks-panel">
      {risks.map((risk) => (
        <Card key={risk.id} className={`border-l-4 ${getSeverityColor(risk.severity)}`} data-testid={`risk-${risk.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} description="Risk title is manually entered" />
                  <h4 className="font-medium text-sm">{risk.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Severity is system-assessed" />
                <Badge variant={risk.severity === "CRITICAL" || risk.severity === "HIGH" ? "destructive" : "secondary"}>
                  {risk.severity}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <Users className="h-3 w-3" />
                <span>{risk.owner}</span>
              </div>
              {risk.dueDate && (
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  <Calendar className="h-3 w-3" />
                  <span>Due: {formatDate(risk.dueDate)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Status based on mitigation" />
                <StatusBadge status={risk.status} />
              </div>
            </div>
            {risk.mitigationPlan && (
              <div className="mt-3 p-2 rounded bg-muted/50 text-xs">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <span className="font-medium"> Mitigation: </span>
                {risk.mitigationPlan}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PoliciesPanel({ policies }: { policies: Policy[] }) {
  return (
    <div className="space-y-3" data-testid="policies-panel">
      {policies.map((policy) => (
        <Card key={policy.id} className="hover-elevate" data-testid={`policy-${policy.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} description="Policy name is manually entered" />
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm">{policy.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{policy.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Status based on review cycle" />
                <StatusBadge status={policy.status} />
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <Badge variant="outline">{policy.category}</Badge>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <span>v{policy.version}</span>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                <span>Owner: {policy.owner}</span>
              </div>
            </div>
            {policy.requiresAcknowledgement && (
              <div className="flex items-center gap-2 mt-3">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Counted from responses" />
                <Progress 
                  value={(policy.acknowledgementCount / policy.totalApplicable) * 100} 
                  className="flex-1 h-2" 
                />
                <span className="text-xs text-muted-foreground">
                  {policy.acknowledgementCount}/{policy.totalApplicable} acknowledged
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdvisorsPanel({ advisors }: { advisors: ThirdPartyAdvisor[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2" data-testid="advisors-panel">
      {advisors.map((advisor) => (
        <Card key={advisor.id} className="hover-elevate" data-testid={`advisor-${advisor.id}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {advisor.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <FieldIndicator mode="MANUAL" showLabel={false} description="Advisor name is manually entered" />
                    <h4 className="font-medium text-sm">{advisor.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{advisor.companyName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Status based on dates" />
                <StatusBadge status={advisor.status} />
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  Type:
                </span>
                <Badge variant="outline">{advisor.advisorType.replace(/_/g, " ")}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  Jurisdiction:
                </span>
                <span>{advisor.jurisdiction}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  Annual Fee:
                </span>
                <span className="font-medium">{formatCurrency(advisor.annualFee, advisor.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  Entities:
                </span>
                <span>{advisor.assignedEntities.length} assigned</span>
              </div>
              {advisor.renewalDate && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Calculated from dates" />
                    Renewal:
                  </span>
                  <span>{formatDate(advisor.renewalDate)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MeetingsPanel({ meetings }: { meetings: Meeting[] }) {
  return (
    <div className="space-y-3" data-testid="meetings-panel">
      {meetings.map((meeting) => {
        const entity = getEntities().find(e => e.id === meeting.entityId);
        return (
          <Card key={meeting.id} className="hover-elevate" data-testid={`meeting-${meeting.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FieldIndicator mode="MANUAL" showLabel={false} description="Meeting title is manually entered" />
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm">{meeting.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{entity?.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Based on date and completion" />
                  <StatusBadge status={meeting.status} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  <Badge variant="outline">{meeting.meetingType}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  <span>{formatDate(meeting.scheduledDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  <span>{meeting.location}</span>
                </div>
              </div>
              {meeting.status === "COMPLETED" && (
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Calculated from attendance" />
                    <span className={meeting.isQuorumMet ? "text-green-600" : "text-red-600"}>
                      {meeting.isQuorumMet ? "Quorum met" : "No quorum"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FieldIndicator mode="MANUAL" showLabel={false} />
                    <span className={meeting.minutesApproved ? "text-green-600" : "text-muted-foreground"}>
                      {meeting.minutesApproved ? "Minutes approved" : "Minutes pending"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ResolutionsPanel({ resolutions }: { resolutions: Resolution[] }) {
  return (
    <div className="space-y-3" data-testid="resolutions-panel">
      {resolutions.map((resolution) => {
        const entity = getEntities().find(e => e.id === resolution.entityId);
        return (
          <Card key={resolution.id} className="hover-elevate" data-testid={`resolution-${resolution.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1">
                    <FieldIndicator mode="MANUAL" showLabel={false} description="Resolution title is manually entered" />
                    <h4 className="font-medium text-sm">{resolution.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{entity?.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Status updated by voting" />
                  <StatusBadge status={resolution.status} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  <Badge variant="outline">{resolution.resolutionType}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  <span>Proposed: {formatDate(resolution.proposedDate)}</span>
                </div>
                {resolution.approvedDate && (
                  <div className="flex items-center gap-1">
                    <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Set when approved" />
                    <span>Approved: {formatDate(resolution.approvedDate)}</span>
                  </div>
                )}
              </div>
              {resolution.status === "APPROVED" || resolution.status === "EXECUTED" ? (
                <div className="flex items-center gap-4 mt-2 text-xs text-green-600">
                  <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Vote counts are calculated" />
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Votes: {resolution.votesFor} for, {resolution.votesAgainst} against</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function SignatoriesPanel({ signatories }: { signatories: AuthorizedSignatory[] }) {
  return (
    <div className="rounded-md border" data-testid="signatories-panel">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                Officer
              </span>
            </TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                Authority
              </span>
            </TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                Limit
              </span>
            </TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="MANUAL" showLabel={false} />
                Co-Signer
              </span>
            </TableHead>
            <TableHead>
              <span className="flex items-center gap-1">
                <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Based on dates and role status" />
                Status
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signatories.map((sig) => {
            const entity = getEntities().find(e => e.id === sig.entityId);
            return (
              <TableRow key={sig.id} data-testid={`signatory-row-${sig.id}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {sig.officerName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{sig.officerName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{entity?.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{sig.authorityType}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {sig.signingLimit ? formatCurrency(sig.signingLimit, sig.currency) : "Unlimited"}
                </TableCell>
                <TableCell className="text-sm">
                  {sig.requiresCoSigner ? sig.coSignerRequired : "No"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={sig.isActive ? "ACTIVE" : "INACTIVE"} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ChangesPanel({ changes }: { changes: EntityChange[] }) {
  return (
    <div className="space-y-3" data-testid="changes-panel">
      {changes.map((change) => {
        const entity = getEntities().find(e => e.id === change.entityId);
        return (
          <Card key={change.id} className="hover-elevate" data-testid={`change-${change.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <FieldIndicator mode="MANUAL" showLabel={false} description="Change type is manually selected" />
                      <Badge variant="outline">{change.changeType.replace(/_/g, " ")}</Badge>
                    </div>
                    <h4 className="font-medium text-sm">{change.description}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{entity?.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Status based on workflow" />
                  <StatusBadge status={change.status} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  <span>Effective: {formatDate(change.effectiveDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FieldIndicator mode="MANUAL" showLabel={false} />
                  <span>Requested by: {change.requestedBy}</span>
                </div>
              </div>
              {change.oldValue && change.newValue && (
                <div className="mt-2 p-2 rounded bg-muted/50 text-xs">
                  <div className="flex items-center gap-1">
                    <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Captured by system" />
                    <span className="font-medium">From:</span> {change.oldValue}
                  </div>
                  <div className="flex items-center gap-1">
                    <FieldIndicator mode="MANUAL" showLabel={false} />
                    <span className="font-medium">To:</span> {change.newValue}
                  </div>
                </div>
              )}
              {change.filingRequired && (
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Based on change type" />
                  <FileText className="h-3 w-3" />
                  <span className={change.filingCompleted ? "text-green-600" : "text-muted-foreground"}>
                    Filing {change.filingCompleted ? "completed" : "required"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function AuditReadinessCenter() {
  const metrics = getComplianceMetrics();
  const snapshots = getSnapshots();
  
  return (
    <div className="space-y-6" data-testid="audit-readiness-center">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Audit Readiness"
          value={`${metrics.auditReadiness}%`}
          subtitle="Evidence completeness"
          icon={Shield}
          variant="success"
        />
        <MetricCard
          title="Locked Periods"
          value={snapshots.filter(s => s.isLocked).length}
          subtitle="Immutable records"
          icon={Lock}
        />
        <MetricCard
          title="Filed On Time"
          value={`${Math.round((snapshots[0]?.filedOnTime / snapshots[0]?.totalObligations) * 100)}%`}
          subtitle="Last period"
          icon={CheckCircle2}
          variant="success"
        />
        <MetricCard
          title="Documentation"
          value="94%"
          subtitle="Complete"
          icon={FileCheck}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Period Snapshots</CardTitle>
          <CardDescription>Immutable compliance records by period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Entities</TableHead>
                  <TableHead>Obligations</TableHead>
                  <TableHead>On Time</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshots.map((snapshot) => (
                  <TableRow key={snapshot.id}>
                    <TableCell className="font-medium">{snapshot.period}</TableCell>
                    <TableCell>{snapshot.entityCount}</TableCell>
                    <TableCell>{snapshot.totalObligations}</TableCell>
                    <TableCell className="text-green-600">{snapshot.filedOnTime}</TableCell>
                    <TableCell className="text-red-600">{snapshot.filedLate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={snapshot.overallComplianceScore} className="w-16 h-2" />
                        <span className="text-sm">{snapshot.overallComplianceScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {snapshot.isLocked ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Lock className="h-3 w-3" />
                          <span className="text-xs">Locked</span>
                        </div>
                      ) : (
                        <Badge variant="secondary">Open</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ROIMetricsPanel() {
  const metrics = getComplianceMetrics();
  
  return (
    <div className="space-y-6" data-testid="roi-metrics-panel">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Annual Savings"
          value={formatCurrency(metrics.savingsGenerated)}
          subtitle="Automation & efficiency"
          icon={DollarSign}
          variant="success"
          trend="up"
          trendLabel="+23% vs last year"
        />
        <MetricCard
          title="Time Saved"
          value="1,240"
          subtitle="Hours per year"
          icon={Clock}
          trend="up"
          trendLabel="+18% efficiency"
        />
        <MetricCard
          title="Late Filing Fees Avoided"
          value={formatCurrency(45000)}
          subtitle="Penalties prevented"
          icon={Shield}
          variant="success"
        />
        <MetricCard
          title="Audit Prep Time"
          value="-65%"
          subtitle="Reduction"
          icon={BarChart3}
          trend="up"
          trendLabel="From 4 weeks to 1.4 weeks"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Efficiency Gains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Filing automation</span>
                <div className="flex items-center gap-2">
                  <Progress value={78} className="w-32 h-2" />
                  <span className="text-sm font-medium">78%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Document generation</span>
                <div className="flex items-center gap-2">
                  <Progress value={92} className="w-32 h-2" />
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">E-signature adoption</span>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="w-32 h-2" />
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Centralized tracking</span>
                <div className="flex items-center gap-2">
                  <Progress value={100} className="w-32 h-2" />
                  <span className="text-sm font-medium">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Missed deadlines</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">-89%</span>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Compliance incidents</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">-76%</span>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Audit findings</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">-82%</span>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Manual errors</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">-94%</span>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrgChart({ entities }: { entities: Entity[] }) {
  const parent = entities.find(e => !e.parentEntityId);
  const children = entities.filter(e => e.parentEntityId === parent?.id);
  const grandchildren = entities.filter(e => children.some(c => c.id === e.parentEntityId));

  return (
    <div className="p-6" data-testid="org-chart">
      <div className="flex flex-col items-center">
        {parent && (
          <Card className="w-64 mb-8 hover-elevate">
            <CardContent className="p-4 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">{parent.name}</h3>
              <p className="text-xs text-muted-foreground">{parent.jurisdictionCode}</p>
              <Badge className="mt-2">{parent.status}</Badge>
            </CardContent>
          </Card>
        )}

        <div className="w-px h-8 bg-border" />
        
        <div className="flex flex-wrap justify-center gap-4">
          {children.map((child) => {
            const subChildren = entities.filter(e => e.parentEntityId === child.id);
            return (
              <div key={child.id} className="flex flex-col items-center">
                <Card className="w-48 hover-elevate">
                  <CardContent className="p-3 text-center">
                    <Building className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <h4 className="font-medium text-sm">{child.name}</h4>
                    <p className="text-xs text-muted-foreground">{child.jurisdictionCode}</p>
                    {child.ownershipPercentage && (
                      <Badge variant="outline" className="mt-1">{child.ownershipPercentage}%</Badge>
                    )}
                  </CardContent>
                </Card>
                {subChildren.length > 0 && (
                  <>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex gap-2">
                      {subChildren.slice(0, 3).map((sub) => (
                        <Card key={sub.id} className="w-36 hover-elevate">
                          <CardContent className="p-2 text-center">
                            <h5 className="font-medium text-xs truncate">{sub.name}</h5>
                            <p className="text-xs text-muted-foreground">{sub.jurisdictionCode}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ShareholdersPanel({ shareholders }: { shareholders: ReturnType<typeof getShareholders> }) {
  if (shareholders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No shareholders on record</p>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shareholder</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Shares</TableHead>
          <TableHead className="text-right">Ownership %</TableHead>
          <TableHead>Share Class</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shareholders.map((sh) => (
          <TableRow key={sh.id} data-testid={`row-shareholder-${sh.id}`}>
            <TableCell className="font-medium">{sh.name}</TableCell>
            <TableCell><Badge variant="outline">{sh.shareholderType}</Badge></TableCell>
            <TableCell className="text-right">{sh.sharesHeld.toLocaleString()}</TableCell>
            <TableCell className="text-right">{sh.ownershipPercentage.toFixed(2)}%</TableCell>
            <TableCell>{sh.shareClass}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OfficersPanel({ officers }: { officers: ReturnType<typeof getOfficers> }) {
  if (officers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No officers on record</p>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Entity</TableHead>
          <TableHead>Appointed</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {officers.map((officer) => (
          <TableRow key={officer.id} data-testid={`row-officer-${officer.id}`}>
            <TableCell className="font-medium">{officer.name}</TableCell>
            <TableCell>{officer.role}</TableCell>
            <TableCell>{officer.entityId}</TableCell>
            <TableCell>{formatDate(officer.appointmentDate)}</TableCell>
            <TableCell>
              <Badge variant={!officer.resignationDate ? "default" : "secondary"}>
                {!officer.resignationDate ? "Active" : "Resigned"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function FilingRequirementsPanel({ requirements }: { requirements: FilingRequirement[] }) {
  if (requirements.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No filing requirements</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filing</TableHead>
            <TableHead>Jurisdiction</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Lead Time</TableHead>
            <TableHead>Penalty Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirements.slice(0, 20).map((req) => (
            <TableRow key={req.id} data-testid={`row-filing-${req.id}`}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{req.filingName}</span>
                  <span className="text-xs text-muted-foreground">{req.regulation}</span>
                </div>
              </TableCell>
              <TableCell>{req.jurisdiction}</TableCell>
              <TableCell>{req.industry}</TableCell>
              <TableCell><Badge variant="outline">{req.frequency}</Badge></TableCell>
              <TableCell>{typeof req.leadTimeDays === "number" ? `${req.leadTimeDays} days` : req.leadTimeDays}</TableCell>
              <TableCell>
                <Badge variant={req.penaltyLevel === "Critical" ? "destructive" : req.penaltyLevel === "High" ? "destructive" : "secondary"}>
                  {req.penaltyLevel}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {requirements.length > 20 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing 20 of {requirements.length} filing requirements
        </p>
      )}
    </div>
  );
}

function StartupEquitySection({
  fundingRounds,
  convertibles,
  optionPools,
  optionGrants,
  startupMetrics,
  entities,
}: {
  fundingRounds: ReturnType<typeof getFundingRounds>;
  convertibles: ReturnType<typeof getConvertibleInstruments>;
  optionPools: ReturnType<typeof getOptionPools>;
  optionGrants: ReturnType<typeof getOptionGrants>;
  startupMetrics: ReturnType<typeof getStartupEquityMetrics>;
  entities: Entity[];
}) {
  const [subTab, setSubTab] = useState("funding-rounds");

  return (
    <div className="space-y-6">
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="mb-4" data-testid="startup-equity-subtabs">
          <TabsTrigger value="funding-rounds" data-testid="subtab-funding-rounds">
            <Rocket className="h-4 w-4 mr-2" />
            Funding Rounds
          </TabsTrigger>
          <TabsTrigger value="convertibles" data-testid="subtab-convertibles">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Convertibles
          </TabsTrigger>
          <TabsTrigger value="options" data-testid="subtab-options">
            <Award className="h-4 w-4 mr-2" />
            Options
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funding-rounds" className="mt-0 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Raised"
              value={formatCurrency(startupMetrics.totalRaised, "USD")}
              subtitle={`${startupMetrics.closedRounds} closed rounds`}
              icon={Wallet}
              variant="success"
            />
            <MetricCard
              title="Latest Valuation"
              value={formatCurrency(startupMetrics.latestValuation, "USD")}
              subtitle="Post-money valuation"
              icon={TrendingUp}
            />
            <MetricCard
              title="Active Rounds"
              value={startupMetrics.activeRoundsCount}
              subtitle="Currently fundraising"
              icon={Rocket}
              variant={startupMetrics.activeRoundsCount > 0 ? "warning" : "default"}
            />
            <MetricCard
              title="Total Rounds"
              value={startupMetrics.totalFundingRounds}
              subtitle="Funding history"
              icon={BarChart3}
            />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Funding Round History</CardTitle>
                <CardDescription>Track fundraising rounds with valuations</CardDescription>
              </div>
              <DataCaptureLegend compact sectionId="funding-rounds" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Round
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Type
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Based on dates and activity" />
                        Status
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Sum of investments" />
                        Raised
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Calculated from pre-money + raised" />
                        Post-Money
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Lead Investor
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fundingRounds.map((round) => (
                    <TableRow key={round.id} data-testid={`row-funding-round-${round.id}`}>
                      <TableCell className="font-medium">{round.roundName}</TableCell>
                      <TableCell><Badge variant="outline">{round.roundType.replace("_", " ")}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={round.status === "CLOSED" ? "default" : round.status === "OPEN" ? "secondary" : "outline"}>
                          {round.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(round.raisedAmount, round.currency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(round.postMoneyValuation, round.currency)}</TableCell>
                      <TableCell>{round.leadInvestor || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convertibles" className="mt-0 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Active Convertibles"
              value={startupMetrics.activeConvertiblesCount}
              icon={FileSpreadsheet}
            />
            <MetricCard
              title="Total Principal"
              value={formatCurrency(startupMetrics.totalConvertiblePrincipal, "USD")}
              icon={DollarSign}
            />
            <MetricCard
              title="SAFEs"
              value={convertibles.filter(c => c.instrumentType === "SAFE").length}
              icon={FileText}
            />
            <MetricCard
              title="Convertible Notes"
              value={convertibles.filter(c => c.instrumentType === "CONVERTIBLE_NOTE").length}
              icon={Receipt}
            />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Convertible Instruments</CardTitle>
                <CardDescription>SAFE and convertible note management</CardDescription>
              </div>
              <DataCaptureLegend compact sectionId="convertibles" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Type
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Investor
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Principal
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Cap
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Based on conversion/repayment" />
                        Status
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {convertibles.map((conv) => (
                    <TableRow key={conv.id} data-testid={`row-convertible-${conv.id}`}>
                      <TableCell><Badge variant="outline">{conv.instrumentType.replace("_", " ")}</Badge></TableCell>
                      <TableCell>{conv.investorName}</TableCell>
                      <TableCell className="text-right">{formatCurrency(conv.principalAmount, conv.currency)}</TableCell>
                      <TableCell className="text-right">{conv.valuationCap ? formatCurrency(conv.valuationCap, conv.currency) : "No cap"}</TableCell>
                      <TableCell>
                        <Badge variant={conv.status === "CONVERTED" ? "default" : conv.status === "ACTIVE" ? "secondary" : "outline"}>
                          {conv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="options" className="mt-0 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Option Pools"
              value={optionPools.length}
              icon={PieChart}
            />
            <MetricCard
              title="Total Authorized"
              value={optionPools.reduce((sum, p) => sum + p.authorizedShares, 0).toLocaleString()}
              subtitle="Shares"
              icon={Target}
            />
            <MetricCard
              title="Granted"
              value={optionGrants.reduce((sum, g) => sum + g.sharesGranted, 0).toLocaleString()}
              subtitle="Options issued"
              icon={Award}
            />
            <MetricCard
              title="Available"
              value={optionPools.reduce((sum, p) => sum + p.availableShares, 0).toLocaleString()}
              subtitle="Remaining"
              icon={Layers}
              variant="success"
            />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Option Grants</CardTitle>
                <CardDescription>Employee and advisor option grants</CardDescription>
              </div>
              <DataCaptureLegend compact sectionId="option-grants" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Grantee
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Role
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Shares
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Exercise Price
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="MANUAL" showLabel={false} />
                        Vesting Schedule
                      </span>
                    </TableHead>
                    <TableHead>
                      <span className="flex items-center gap-1">
                        <FieldIndicator mode="AUTOMATIC" showLabel={false} description="Based on vesting/exercise" />
                        Status
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optionGrants.map((grant) => (
                    <TableRow key={grant.id} data-testid={`row-option-grant-${grant.id}`}>
                      <TableCell className="font-medium">{grant.granteeName}</TableCell>
                      <TableCell><Badge variant="outline">{grant.granteeRole}</Badge></TableCell>
                      <TableCell className="text-right">{grant.sharesGranted.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(grant.exercisePrice, "USD")}</TableCell>
                      <TableCell>{grant.vestingSchedule.replace(/_/g, " ")}</TableCell>
                      <TableCell>
                        <Badge variant={grant.status === "FULLY_VESTED" ? "default" : grant.status === "VESTING" ? "secondary" : "outline"}>
                          {grant.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const validTabs = ["entities", "compliance", "governance", "changes", "risk-oversight", "documents", "insights", "integrations"];

const sectionToTab: Record<string, string> = {
  "entities": "entities",
  "compliance": "compliance",
  "governance": "governance",
  "changes": "changes",
  "risk-oversight": "risk-oversight",
  "documents": "documents",
  "insights": "insights",
  "integrations": "integrations",
};

const tabToSection: Record<string, string> = {
  "entities": "entities",
  "compliance": "compliance",
  "governance": "governance",
  "changes": "changes",
  "risk-oversight": "risk-oversight",
  "documents": "documents",
  "insights": "insights",
  "integrations": "integrations",
};

export default function OneCompliancePage() {
  const [, params] = useRoute("/compliance/:section");
  const [, setLocation] = useLocation();
  
  const sectionFromUrl = params?.section || "";
  const initialTab = sectionToTab[sectionFromUrl] || "insights";
  
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [entitiesSubTab, setEntitiesSubTab] = useState("profile");
  const [complianceSubTab, setComplianceSubTab] = useState("obligations");
  const [governanceSubTab, setGovernanceSubTab] = useState("authority");
  const [changesSubTab, setChangesSubTab] = useState("lifecycle");
  const [riskSubTab, setRiskSubTab] = useState("risk-register");
  const [documentsSubTab, setDocumentsSubTab] = useState("governance-docs");
  const [insightsSubTab, setInsightsSubTab] = useState("dashboard");
  const [integrationsSubTab, setIntegrationsSubTab] = useState("esignature");

  useEffect(() => {
    const newTab = sectionToTab[sectionFromUrl] || "insights";
    if (newTab !== selectedTab) {
      setSelectedTab(newTab);
    }
  }, [sectionFromUrl]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    const section = tabToSection[tab] || "insights";
    if (section === "insights") {
      setLocation("/compliance");
    } else {
      setLocation(`/compliance/${section}`);
    }
  };

  const metrics = getComplianceMetrics();
  const entities = getEntities();
  const obligations = getObligations();
  const heatmap = getJurisdictionHeatmap();
  const timeline = getTimeline(90);
  const insights = getAIInsights();
  const risks = getRisks();
  const policies = getPolicies();
  const advisors = getAdvisors();
  const meetings = getMeetings();
  const resolutions = getResolutions();
  const signatories = getSignatories();
  const changes = getChanges();
  const officers = getOfficers(selectedEntity || undefined);
  const filingRequirements = getFilingRequirements();
  const shareholders = getShareholders(selectedEntity || undefined);
  const shareClasses = getShareClasses(selectedEntity || undefined);
  const equityEvents = getEquityEvents(selectedEntity || undefined);
  const dividendsData = getDividends(selectedEntity || undefined);
  const equityMetrics = getEquityMetrics();
  
  const fundingRounds = getFundingRounds(selectedEntity || undefined);
  const convertibles = getConvertibleInstruments(selectedEntity || undefined);
  const optionPools = getOptionPools(selectedEntity || undefined);
  const optionGrants = getOptionGrants(selectedEntity || undefined);
  const startupMetrics = getStartupEquityMetrics(selectedEntity || undefined);

  const filteredEntities = selectedEntity 
    ? entities.filter(e => e.id === selectedEntity)
    : entities;

  return (
    <div className="flex flex-col h-full" data-testid="one-compliance-page">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold" data-testid="page-title">One Compliance</h1>
              <p className="text-sm text-muted-foreground">
                Entity governance, compliance, and statutory execution system
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedEntity || "all"} onValueChange={(v) => setSelectedEntity(v === "all" ? "" : v)}>
                <SelectTrigger className="w-48" data-testid="entity-filter">
                  <SelectValue placeholder="All Entities" />
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
              <Button data-testid="button-new-obligation">
                <FileText className="h-4 w-4 mr-2" />
                New Obligation
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start gap-1 flex-wrap" data-testid="main-tabs">
              <TabsTrigger value="entities" data-testid="tab-entities">
                <Building2 className="h-4 w-4 mr-2" />
                Entities
              </TabsTrigger>
              <TabsTrigger value="compliance" data-testid="tab-compliance">
                <ClipboardList className="h-4 w-4 mr-2" />
                Compliance
              </TabsTrigger>
              <TabsTrigger value="governance" data-testid="tab-governance">
                <Gavel className="h-4 w-4 mr-2" />
                Governance
              </TabsTrigger>
              <TabsTrigger value="changes" data-testid="tab-changes">
                <GitMerge className="h-4 w-4 mr-2" />
                Changes
              </TabsTrigger>
              <TabsTrigger value="risk-oversight" data-testid="tab-risk-oversight">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Risk & Oversight
              </TabsTrigger>
              <TabsTrigger value="documents" data-testid="tab-documents">
                <FolderArchive className="h-4 w-4 mr-2" />
                Documents & Evidence
              </TabsTrigger>
              <TabsTrigger value="insights" data-testid="tab-insights">
                <BarChart2 className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
              <TabsTrigger value="integrations" data-testid="tab-integrations">
                <Plug className="h-4 w-4 mr-2" />
                Integrations
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="container py-6">
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
            {/* 1. ENTITIES TAB */}
            <TabsContent value="entities" className="mt-0 space-y-6">
              <Tabs value={entitiesSubTab} onValueChange={setEntitiesSubTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="profile">Entity Profile</TabsTrigger>
                  <TabsTrigger value="ownership">Ownership & Structure</TabsTrigger>
                  <TabsTrigger value="officers">Officers & Directors</TabsTrigger>
                  <TabsTrigger value="orgchart">Org Chart</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      title="Total Entities"
                      value={entities.length}
                      subtitle={`${entities.filter(e => e.status === "ACTIVE").length} active`}
                      icon={Building2}
                    />
                    <MetricCard
                      title="Jurisdictions"
                      value={new Set(entities.map(e => e.jurisdictionCode)).size}
                      subtitle="Countries/regions"
                      icon={Globe}
                    />
                    <MetricCard
                      title="Avg Health Score"
                      value={`${Math.round(entities.reduce((sum, e) => sum + e.healthScore, 0) / entities.length)}%`}
                      icon={Activity}
                    />
                    <MetricCard
                      title="Dormant"
                      value={entities.filter(e => e.status === "DORMANT").length}
                      subtitle="Review recommended"
                      icon={Clock}
                      variant="warning"
                    />
                  </div>
                  <EntityGrid entities={filteredEntities} />
                </TabsContent>
                
                <TabsContent value="ownership" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ownership Structure</CardTitle>
                      <CardDescription>Share structure and ownership details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ShareholdersPanel shareholders={shareholders} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="officers" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Officers & Directors Registry</CardTitle>
                      <CardDescription>All registered officers and directors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <OfficersPanel officers={officers} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orgchart" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Organization Structure</CardTitle>
                      <CardDescription>Interactive ownership hierarchy</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <OrgChart entities={entities} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* 2. COMPLIANCE TAB */}
            <TabsContent value="compliance" className="mt-0 space-y-6">
              <Tabs value={complianceSubTab} onValueChange={setComplianceSubTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="obligations">Obligations Registry</TabsTrigger>
                  <TabsTrigger value="calendar">Compliance Calendar</TabsTrigger>
                  <TabsTrigger value="filings">Filings & Submissions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="obligations" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      title="Total Obligations"
                      value={obligations.length}
                      icon={ClipboardList}
                    />
                    <MetricCard
                      title="Filed"
                      value={obligations.filter(o => o.filingStatus === "FILED").length}
                      icon={CheckCircle2}
                      variant="success"
                    />
                    <MetricCard
                      title="Pending"
                      value={obligations.filter(o => o.filingStatus === "PENDING").length}
                      icon={Clock}
                    />
                    <MetricCard
                      title="Overdue"
                      value={obligations.filter(o => o.filingStatus === "OVERDUE").length}
                      icon={AlertTriangle}
                      variant="danger"
                    />
                  </div>
                  <ObligationsTable obligations={obligations} />
                </TabsContent>
                
                <TabsContent value="calendar" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance Calendar</CardTitle>
                      <CardDescription>Upcoming deadlines and filing dates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TimelineView items={timeline} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="filings" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Filing Requirements Library</CardTitle>
                      <CardDescription>Regulatory filings across jurisdictions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FilingRequirementsPanel requirements={filingRequirements} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* 3. GOVERNANCE TAB */}
            <TabsContent value="governance" className="mt-0 space-y-6">
              <Tabs value={governanceSubTab} onValueChange={setGovernanceSubTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="authority">Authority & DoA</TabsTrigger>
                  <TabsTrigger value="board">Board & Committees</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                  <TabsTrigger value="capital">Capital & Equity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="authority" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      title="Authorized Signatories"
                      value={signatories.length}
                      icon={UserCheck}
                    />
                    <MetricCard
                      title="Active"
                      value={signatories.filter(s => s.isActive).length}
                      icon={CheckCircle2}
                      variant="success"
                    />
                    <MetricCard
                      title="Unlimited Authority"
                      value={signatories.filter(s => !s.signingLimit).length}
                      icon={Scale}
                    />
                    <MetricCard
                      title="Requires Co-Signer"
                      value={signatories.filter(s => s.requiresCoSigner).length}
                      icon={Users}
                    />
                  </div>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                      <div>
                        <CardTitle>Authority & Delegation Register</CardTitle>
                        <CardDescription>Authorized signatories and signing limits</CardDescription>
                      </div>
                      <DataCaptureLegend compact sectionId="authority-delegation" />
                    </CardHeader>
                    <CardContent>
                      <SignatoriesPanel signatories={signatories} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="board" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      title="Scheduled Meetings"
                      value={meetings.filter(m => m.status === "SCHEDULED").length}
                      icon={Calendar}
                    />
                    <MetricCard
                      title="Pending Resolutions"
                      value={resolutions.filter(r => r.status === "PENDING" || r.status === "DRAFT").length}
                      icon={FileText}
                    />
                    <MetricCard
                      title="Approved"
                      value={resolutions.filter(r => r.status === "APPROVED" || r.status === "EXECUTED").length}
                      icon={CheckCircle2}
                      variant="success"
                    />
                    <MetricCard
                      title="Total Resolutions"
                      value={resolutions.length}
                      icon={Gavel}
                    />
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between gap-2">
                        <div>
                          <CardTitle>Meetings</CardTitle>
                          <CardDescription>Board and shareholder meetings</CardDescription>
                        </div>
                        <DataCaptureLegend compact sectionId="meetings" />
                      </CardHeader>
                      <CardContent>
                        <MeetingsPanel meetings={meetings} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between gap-2">
                        <div>
                          <CardTitle>Resolutions</CardTitle>
                          <CardDescription>Board and shareholder resolutions</CardDescription>
                        </div>
                        <DataCaptureLegend compact sectionId="resolutions" />
                      </CardHeader>
                      <CardContent>
                        <ResolutionsPanel resolutions={resolutions} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="policies" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      title="Active Policies"
                      value={policies.filter(p => p.status === "ACTIVE").length}
                      icon={BookOpen}
                    />
                    <MetricCard
                      title="Under Review"
                      value={policies.filter(p => p.status === "UNDER_REVIEW").length}
                      icon={Eye}
                    />
                    <MetricCard
                      title="Pending Acknowledgement"
                      value={policies.filter(p => p.requiresAcknowledgement && p.acknowledgementCount < p.totalApplicable).length}
                      icon={Clock}
                      variant="warning"
                    />
                    <MetricCard
                      title="Categories"
                      value={new Set(policies.map(p => p.category)).size}
                      icon={Layers}
                    />
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Policies & Procedures</CardTitle>
                      <CardDescription>Corporate policies and acknowledgement tracking</CardDescription>
                      <DataCaptureLegend compact sectionId="policies" />
                    </CardHeader>
                    <CardContent>
                      <PoliciesPanel policies={policies} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="capital" className="mt-0 space-y-6">
                  <StartupEquitySection 
                    fundingRounds={fundingRounds}
                    convertibles={convertibles}
                    optionPools={optionPools}
                    optionGrants={optionGrants}
                    startupMetrics={startupMetrics}
                    entities={entities}
                  />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* 4. CHANGES TAB */}
            <TabsContent value="changes" className="mt-0 space-y-6">
              <Tabs value={changesSubTab} onValueChange={setChangesSubTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="lifecycle">Entity Lifecycle</TabsTrigger>
                  <TabsTrigger value="amendments">Amendments</TabsTrigger>
                  <TabsTrigger value="ma">M&A / Dissolution</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lifecycle" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      title="Pending Changes"
                      value={changes.filter(c => c.status === "PENDING").length}
                      icon={Clock}
                    />
                    <MetricCard
                      title="Approved"
                      value={changes.filter(c => c.status === "APPROVED").length}
                      icon={CheckCircle2}
                      variant="success"
                    />
                    <MetricCard
                      title="Rejected"
                      value={changes.filter(c => c.status === "REJECTED").length}
                      icon={AlertCircle}
                      variant="danger"
                    />
                    <MetricCard
                      title="Total Changes"
                      value={changes.length}
                      icon={Activity}
                    />
                  </div>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-2">
                      <div>
                        <CardTitle>Lifecycle Changes</CardTitle>
                        <CardDescription>Entity changes and approvals</CardDescription>
                      </div>
                      <DataCaptureLegend compact sectionId="lifecycle-changes" />
                    </CardHeader>
                    <CardContent>
                      <ChangesPanel changes={changes} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="amendments" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Amendments Register</CardTitle>
                      <CardDescription>Name, address, officer changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChangesPanel changes={changes.filter(c => c.changeType === "NAME_CHANGE" || c.changeType === "ADDRESS_CHANGE" || c.changeType === "OFFICER_CHANGE")} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="ma" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>M&A / Dissolution</CardTitle>
                      <CardDescription>Mergers, restructurings, and wind-downs</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChangesPanel changes={changes.filter(c => c.changeType === "MERGER" || c.changeType === "DISSOLUTION")} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* 5. RISK & OVERSIGHT TAB */}
            <TabsContent value="risk-oversight" className="mt-0 space-y-6">
              <Tabs value={riskSubTab} onValueChange={setRiskSubTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="risk-register">Risk Register</TabsTrigger>
                  <TabsTrigger value="correspondence">Regulatory Correspondence</TabsTrigger>
                  <TabsTrigger value="escalations">Issues & Escalations</TabsTrigger>
                </TabsList>
                
                <TabsContent value="risk-register" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      title="Open Risks"
                      value={risks.filter(r => r.status === "OPEN").length}
                      icon={AlertTriangle}
                      variant="warning"
                    />
                    <MetricCard
                      title="Critical/High"
                      value={risks.filter(r => r.severity === "CRITICAL" || r.severity === "HIGH").length}
                      icon={AlertCircle}
                      variant="danger"
                    />
                    <MetricCard
                      title="Mitigated"
                      value={risks.filter(r => r.status === "MITIGATED").length}
                      icon={Shield}
                      variant="success"
                    />
                    <MetricCard
                      title="Accepted"
                      value={risks.filter(r => r.status === "ACCEPTED").length}
                      icon={CheckCircle2}
                    />
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Register</CardTitle>
                      <CardDescription>Compliance and operational risks</CardDescription>
                      <DataCaptureLegend compact sectionId="risk-register" />
                    </CardHeader>
                    <CardContent>
                      <RisksPanel risks={risks} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="correspondence" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Regulatory Correspondence</CardTitle>
                      <CardDescription>Regulator notices, requests, and responses</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No regulatory correspondence on file</p>
                      <Button variant="outline" className="mt-4">
                        <FileText className="h-4 w-4 mr-2" />
                        Log Correspondence
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="escalations" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Issues & Escalations</CardTitle>
                      <CardDescription>Active issues requiring attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RisksPanel risks={risks.filter(r => r.status === "OPEN" && (r.severity === "CRITICAL" || r.severity === "HIGH"))} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* 6. DOCUMENTS & EVIDENCE TAB */}
            <TabsContent value="documents" className="mt-0 space-y-6">
              <Tabs value={documentsSubTab} onValueChange={setDocumentsSubTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="governance-docs">Governance Docs</TabsTrigger>
                  <TabsTrigger value="vault">Evidence Vault</TabsTrigger>
                  <TabsTrigger value="snapshots">Period Snapshots</TabsTrigger>
                  <TabsTrigger value="audit">Audit Readiness</TabsTrigger>
                </TabsList>
                
                <TabsContent value="governance-docs" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Governance Documents</CardTitle>
                      <CardDescription>Board resolutions, minutes, and statutory registers</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground py-8">
                      <FolderArchive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Document management coming soon</p>
                      <Button variant="outline" className="mt-4">
                        <FileText className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="vault" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Evidence Vault</CardTitle>
                      <CardDescription>Immutable evidence storage</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground py-8">
                      <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Evidence vault coming soon</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="snapshots" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Period Snapshots</CardTitle>
                      <CardDescription>Historical entity states</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground py-8">
                      <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Period snapshots coming soon</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="audit" className="mt-0 space-y-6">
                  <AuditReadinessCenter />
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* 7. INSIGHTS TAB */}
            <TabsContent value="insights" className="mt-0 space-y-6">
              <Tabs value={insightsSubTab} onValueChange={setInsightsSubTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="dashboard">Health Dashboard</TabsTrigger>
                  <TabsTrigger value="compliance-status">Compliance Status</TabsTrigger>
                  <TabsTrigger value="reports">Board Reports</TabsTrigger>
                  <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                      title="Health Score"
                      value={metrics.healthScore}
                      subtitle="Across all entities"
                      icon={Activity}
                      variant={metrics.healthScore >= 80 ? "success" : metrics.healthScore >= 60 ? "warning" : "danger"}
                    />
                    <MetricCard
                      title="Entities at Risk"
                      value={metrics.entitiesAtRisk}
                      subtitle="Below 80% health"
                      icon={AlertTriangle}
                      variant={metrics.entitiesAtRisk > 0 ? "warning" : "success"}
                    />
                    <MetricCard
                      title="Upcoming Deadlines"
                      value={metrics.upcomingDeadlines}
                      subtitle="Next 30 days"
                      icon={Calendar}
                    />
                    <MetricCard
                      title="Overdue"
                      value={metrics.overdueObligations}
                      subtitle="Requires attention"
                      icon={AlertCircle}
                      variant={metrics.overdueObligations > 0 ? "danger" : "success"}
                    />
                  </div>
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Jurisdiction Risk Heatmap</CardTitle>
                        <CardDescription>Entity health by jurisdiction</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RiskHeatmap data={heatmap} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Overall Health</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HealthScoreGauge score={metrics.healthScore} />
                        <div className="grid grid-cols-2 gap-4 mt-4 text-center text-sm">
                          <div>
                            <p className="text-2xl font-bold text-green-600">{entities.filter(e => e.status === "ACTIVE").length}</p>
                            <p className="text-muted-foreground">Active</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-yellow-600">{entities.filter(e => e.status === "DORMANT").length}</p>
                            <p className="text-muted-foreground">Dormant</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between gap-2">
                        <div>
                          <CardTitle>90-Day Timeline</CardTitle>
                          <CardDescription>Upcoming obligations and deadlines</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                          View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <TimelineView items={timeline} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between gap-2">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-500" />
                            AI Insights
                          </CardTitle>
                          <CardDescription>Intelligent compliance recommendations</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <AIInsightsPanel insights={insights} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="compliance-status" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance Status Overview</CardTitle>
                      <CardDescription>Entity compliance across jurisdictions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RiskHeatmap data={heatmap} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reports" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Board Reports</CardTitle>
                      <CardDescription>Executive summaries and governance reports</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground py-8">
                      <FileBarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Report generation coming soon</p>
                      <Button variant="outline" className="mt-4">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="roi" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>ROI Analysis</CardTitle>
                      <CardDescription>Return on investment for compliance activities</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground py-8">
                      <BarChart2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>ROI analysis coming soon</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* 8. INTEGRATIONS TAB */}
            <TabsContent value="integrations" className="mt-0 space-y-6">
              <Tabs value={integrationsSubTab} onValueChange={setIntegrationsSubTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="esignature">E-Signature</TabsTrigger>
                  <TabsTrigger value="advisors">Registered Agents & Advisors</TabsTrigger>
                  <TabsTrigger value="intersettle">Intersettle</TabsTrigger>
                </TabsList>
                
                <TabsContent value="esignature" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>E-Signature Integration</CardTitle>
                      <CardDescription>DocuSign and e-signature workflows</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground py-8">
                      <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>E-signature integration coming soon</p>
                      <Button variant="outline" className="mt-4">
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect DocuSign
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="advisors" className="mt-0 space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricCard
                      title="Active Advisors"
                      value={advisors.filter(a => a.status === "ACTIVE").length}
                      icon={Briefcase}
                    />
                    <MetricCard
                      title="Expiring Soon"
                      value={advisors.filter(a => a.status === "EXPIRING_SOON").length}
                      icon={Clock}
                      variant="warning"
                    />
                    <MetricCard
                      title="Annual Spend"
                      value={formatCurrency(advisors.reduce((sum, a) => sum + a.annualFee, 0))}
                      icon={DollarSign}
                    />
                    <MetricCard
                      title="Jurisdictions"
                      value={new Set(advisors.map(a => a.jurisdiction)).size}
                      icon={Globe}
                    />
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Professional Advisors</CardTitle>
                      <CardDescription>External advisors and service providers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdvisorsPanel advisors={advisors} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="intersettle" className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Intersettle Integration</CardTitle>
                      <CardDescription>Link governance to intercompany control</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground py-8">
                      <Plug className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Intersettle integration coming soon</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}

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
                  <h4 className="font-medium text-sm">{entity.name}</h4>
                  <p className="text-xs text-muted-foreground">{entity.legalName}</p>
                </div>
              </div>
              <StatusBadge status={entity.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span>{entity.jurisdictionCode}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span>{entity.entityType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{formatDate(entity.incorporationDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-muted-foreground" />
                <span>{entity.localCurrency}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
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
            <TableHead>Obligation</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned</TableHead>
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
                <h4 className="font-medium text-sm">{risk.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
              </div>
              <Badge variant={risk.severity === "CRITICAL" || risk.severity === "HIGH" ? "destructive" : "secondary"}>
                {risk.severity}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{risk.owner}</span>
              </div>
              {risk.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {formatDate(risk.dueDate)}</span>
                </div>
              )}
              <StatusBadge status={risk.status} />
            </div>
            {risk.mitigationPlan && (
              <div className="mt-3 p-2 rounded bg-muted/50 text-xs">
                <span className="font-medium">Mitigation: </span>
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
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-sm">{policy.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{policy.description}</p>
              </div>
              <StatusBadge status={policy.status} />
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
              <Badge variant="outline">{policy.category}</Badge>
              <span>v{policy.version}</span>
              <span>Owner: {policy.owner}</span>
            </div>
            {policy.requiresAcknowledgement && (
              <div className="flex items-center gap-2 mt-3">
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
                  <h4 className="font-medium text-sm">{advisor.name}</h4>
                  <p className="text-xs text-muted-foreground">{advisor.companyName}</p>
                </div>
              </div>
              <StatusBadge status={advisor.status} />
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline">{advisor.advisorType.replace(/_/g, " ")}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Jurisdiction:</span>
                <span>{advisor.jurisdiction}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Annual Fee:</span>
                <span className="font-medium">{formatCurrency(advisor.annualFee, advisor.currency)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Entities:</span>
                <span>{advisor.assignedEntities.length} assigned</span>
              </div>
              {advisor.renewalDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Renewal:</span>
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
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium text-sm">{meeting.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{entity?.name}</p>
                </div>
                <StatusBadge status={meeting.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <Badge variant="outline">{meeting.meetingType}</Badge>
                <span>{formatDate(meeting.scheduledDate)}</span>
                <span>{meeting.location}</span>
              </div>
              {meeting.status === "COMPLETED" && (
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className={meeting.isQuorumMet ? "text-green-600" : "text-red-600"}>
                    {meeting.isQuorumMet ? "Quorum met" : "No quorum"}
                  </span>
                  <span className={meeting.minutesApproved ? "text-green-600" : "text-muted-foreground"}>
                    {meeting.minutesApproved ? "Minutes approved" : "Minutes pending"}
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
                  <h4 className="font-medium text-sm">{resolution.title}</h4>
                  <p className="text-xs text-muted-foreground">{entity?.name}</p>
                </div>
                <StatusBadge status={resolution.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <Badge variant="outline">{resolution.resolutionType}</Badge>
                <span>Proposed: {formatDate(resolution.proposedDate)}</span>
                {resolution.approvedDate && <span>Approved: {formatDate(resolution.approvedDate)}</span>}
              </div>
              {resolution.status === "APPROVED" || resolution.status === "EXECUTED" ? (
                <div className="flex items-center gap-4 mt-2 text-xs text-green-600">
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
            <TableHead>Officer</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Authority</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Co-Signer</TableHead>
            <TableHead>Status</TableHead>
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
                    <Badge variant="outline">{change.changeType.replace(/_/g, " ")}</Badge>
                    <h4 className="font-medium text-sm">{change.description}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{entity?.name}</p>
                </div>
                <StatusBadge status={change.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                <span>Effective: {formatDate(change.effectiveDate)}</span>
                <span>Requested by: {change.requestedBy}</span>
              </div>
              {change.oldValue && change.newValue && (
                <div className="mt-2 p-2 rounded bg-muted/50 text-xs">
                  <div><span className="font-medium">From:</span> {change.oldValue}</div>
                  <div><span className="font-medium">To:</span> {change.newValue}</div>
                </div>
              )}
              {change.filingRequired && (
                <div className="flex items-center gap-2 mt-2 text-xs">
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

const validTabs = ["dashboard", "entity-registry", "obligations", "governance", "startup-equity"];

const sectionToTab: Record<string, string> = {
  "dashboard": "dashboard",
  "entity-registry": "entity-registry",
  "obligations": "obligations",
  "governance": "governance",
  "startup-equity": "startup-equity",
};

const tabToSection: Record<string, string> = {
  "dashboard": "dashboard",
  "entity-registry": "entity-registry",
  "obligations": "obligations",
  "governance": "governance",
  "startup-equity": "startup-equity",
};

export default function OneCompliancePage() {
  const [, params] = useRoute("/compliance/:section");
  const [, setLocation] = useLocation();
  
  const sectionFromUrl = params?.section || "";
  const initialTab = sectionToTab[sectionFromUrl] || "dashboard";
  
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [selectedEntity, setSelectedEntity] = useState<string>("");

  useEffect(() => {
    const newTab = sectionToTab[sectionFromUrl] || "dashboard";
    if (newTab !== selectedTab) {
      setSelectedTab(newTab);
    }
  }, [sectionFromUrl]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    const section = tabToSection[tab] || "dashboard";
    if (section === "dashboard") {
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
            <TabsList className="w-full justify-start gap-1" data-testid="main-tabs">
              <TabsTrigger value="dashboard" data-testid="tab-dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="entity-registry" data-testid="tab-entity-registry">
                <Building2 className="h-4 w-4 mr-2" />
                Entity Registry
              </TabsTrigger>
              <TabsTrigger value="obligations" data-testid="tab-obligations">
                <ClipboardList className="h-4 w-4 mr-2" />
                Obligations
              </TabsTrigger>
              <TabsTrigger value="governance" data-testid="tab-governance">
                <Gavel className="h-4 w-4 mr-2" />
                Board & Governance
              </TabsTrigger>
              <TabsTrigger value="startup-equity" data-testid="tab-startup-equity">
                <Rocket className="h-4 w-4 mr-2" />
                Startup Equity
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="container py-6">
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
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
                  <CardHeader className="flex flex-row items-center justify-between">
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        AI Insights
                      </CardTitle>
                      <CardDescription>Automated risk detection and recommendations</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <AIInsightsPanel insights={insights} />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="entity-registry" className="mt-0 space-y-6">
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

              <Card>
                <CardHeader>
                  <CardTitle>Organization Structure</CardTitle>
                  <CardDescription>Interactive ownership hierarchy</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrgChart entities={entities} />
                </CardContent>
              </Card>

              <EntityGrid entities={filteredEntities} />
            </TabsContent>

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

            <TabsContent value="governance" className="mt-0 space-y-6">
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
                  title="Pending Changes"
                  value={changes.filter(c => c.status === "PENDING").length}
                  icon={Activity}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Meetings</CardTitle>
                    <CardDescription>Board and shareholder meetings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MeetingsPanel meetings={meetings} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resolutions</CardTitle>
                    <CardDescription>Board and shareholder resolutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResolutionsPanel resolutions={resolutions} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Lifecycle Changes</CardTitle>
                  <CardDescription>Entity changes and approvals</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangesPanel changes={changes} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Startup Equity Tab */}
            <TabsContent value="startup-equity" className="mt-0 space-y-6">
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
        </div>
      </ScrollArea>
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    Funding Round History
                  </CardTitle>
                  <CardDescription>
                    Track fundraising rounds with valuations, investor participation, and terms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Round</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Target</TableHead>
                        <TableHead className="text-right">Raised</TableHead>
                        <TableHead className="text-right">Pre-Money</TableHead>
                        <TableHead className="text-right">Post-Money</TableHead>
                        <TableHead>Lead Investor</TableHead>
                        <TableHead>Close Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fundingRounds.map((round) => {
                        const entity = entities.find(e => e.id === round.entityId);
                        const investors = getFundingRoundInvestors(round.id);
                        return (
                          <TableRow key={round.id} data-testid={`row-funding-round-${round.id}`}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{round.roundName}</span>
                                <Badge variant="outline" className="w-fit mt-1">
                                  {round.roundType.replace("_", " ")}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{entity?.name || round.entityId}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  round.status === "CLOSED" ? "default" : 
                                  round.status === "OPEN" || round.status === "CLOSING" ? "secondary" : 
                                  "outline"
                                }
                              >
                                {round.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(round.targetAmount, round.currency)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(round.raisedAmount, round.currency)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-muted-foreground">
                              {formatCurrency(round.preMoneyValuation, round.currency)}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(round.postMoneyValuation, round.currency)}
                            </TableCell>
                            <TableCell>
                              {round.leadInvestor ? (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3 text-muted-foreground" />
                                  <span>{round.leadInvestor}</span>
                                  {investors.length > 1 && (
                                    <Badge variant="secondary" className="ml-1">
                                      +{investors.length - 1}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No lead yet</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {round.closeDate ? formatDate(round.closeDate) : "Open"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Convertibles Tab */}
            <TabsContent value="convertibles" className="mt-0 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Active Convertibles"
                  value={startupMetrics.activeConvertiblesCount}
                  subtitle="SAFEs & Notes outstanding"
                  icon={FileSpreadsheet}
                  variant={startupMetrics.activeConvertiblesCount > 0 ? "warning" : "default"}
                />
                <MetricCard
                  title="Outstanding Principal"
                  value={formatCurrency(startupMetrics.totalConvertiblePrincipal, "USD")}
                  subtitle="Total unconverted amount"
                  icon={DollarSign}
                />
                <MetricCard
                  title="SAFEs"
                  value={convertibles.filter(c => c.instrumentType === "SAFE").length}
                  subtitle="Simple agreements"
                  icon={FileText}
                />
                <MetricCard
                  title="Conv. Notes"
                  value={convertibles.filter(c => c.instrumentType === "CONVERTIBLE_NOTE").length}
                  subtitle="With interest accrual"
                  icon={Receipt}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Convertible Instruments
                  </CardTitle>
                  <CardDescription>
                    SAFEs, convertible notes, and their conversion terms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Investor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Principal</TableHead>
                        <TableHead className="text-right">Val Cap</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Converted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {convertibles.map((conv) => {
                        const entity = entities.find(e => e.id === conv.entityId);
                        return (
                          <TableRow key={conv.id} data-testid={`row-convertible-${conv.id}`}>
                            <TableCell>
                              <Badge variant={conv.instrumentType === "SAFE" ? "default" : "secondary"}>
                                {conv.instrumentType === "SAFE" ? "SAFE" : "Note"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{entity?.name || conv.entityId}</TableCell>
                            <TableCell>{conv.investorName}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  conv.status === "CONVERTED" ? "default" : 
                                  conv.status === "ACTIVE" ? "secondary" : 
                                  "outline"
                                }
                              >
                                {conv.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(conv.principalAmount, conv.currency)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-muted-foreground">
                              {conv.valuationCap ? formatCurrency(conv.valuationCap, conv.currency) : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              {conv.discountRate ? (
                                <span className="flex items-center justify-end gap-1">
                                  <Percent className="h-3 w-3" />
                                  {conv.discountRate}%
                                </span>
                              ) : "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(conv.issueDate)}
                            </TableCell>
                            <TableCell>
                              {conv.status === "CONVERTED" && conv.convertedDate ? (
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {conv.convertedShares?.toLocaleString()} shares
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(conv.convertedDate)}
                                  </span>
                                </div>
                              ) : conv.instrumentType === "CONVERTIBLE_NOTE" && conv.maturityDate ? (
                                <span className="text-xs text-muted-foreground">
                                  Matures: {formatDate(conv.maturityDate)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Options Tab */}
            <TabsContent value="options" className="mt-0 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Pool Authorized"
                  value={startupMetrics.totalOptionsAuthorized.toLocaleString()}
                  subtitle={`${startupMetrics.optionPoolUtilization}% utilized`}
                  icon={Layers}
                />
                <MetricCard
                  title="Options Issued"
                  value={startupMetrics.totalOptionsIssued.toLocaleString()}
                  subtitle={`${startupMetrics.totalOptionsAvailable.toLocaleString()} available`}
                  icon={Award}
                />
                <MetricCard
                  title="Vested"
                  value={startupMetrics.totalVestedOptions.toLocaleString()}
                  subtitle={`${startupMetrics.totalExercisedOptions.toLocaleString()} exercised`}
                  icon={CheckCircle2}
                  variant="success"
                />
                <MetricCard
                  title="Active Grantees"
                  value={startupMetrics.activeGrantees}
                  subtitle="Team members with options"
                  icon={Users}
                />
              </div>

              {/* Option Pools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Option Pools
                  </CardTitle>
                  <CardDescription>
                    Equity incentive plans and pool utilization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pool Name</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead className="text-right">Authorized</TableHead>
                        <TableHead className="text-right">Issued</TableHead>
                        <TableHead className="text-right">Reserved</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Expiration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {optionPools.map((pool) => {
                        const entity = entities.find(e => e.id === pool.entityId);
                        const utilization = pool.authorizedShares > 0 
                          ? Math.round((pool.issuedShares / pool.authorizedShares) * 100) 
                          : 0;
                        return (
                          <TableRow key={pool.id} data-testid={`row-option-pool-${pool.id}`}>
                            <TableCell className="font-medium">{pool.poolName}</TableCell>
                            <TableCell>{entity?.name || pool.entityId}</TableCell>
                            <TableCell className="text-right font-mono">
                              {pool.authorizedShares.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {pool.issuedShares.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-mono text-muted-foreground">
                              {pool.reservedShares.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right font-mono font-medium">
                              {pool.availableShares.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={utilization} className="w-16 h-2" />
                                <span className="text-sm text-muted-foreground">{utilization}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {pool.expirationDate ? formatDate(pool.expirationDate) : "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Option Grants */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Option Grants
                  </CardTitle>
                  <CardDescription>
                    Individual grants with vesting schedules and exercise tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grantee</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Granted</TableHead>
                        <TableHead className="text-right">Vested</TableHead>
                        <TableHead className="text-right">Exercised</TableHead>
                        <TableHead className="text-right">Strike Price</TableHead>
                        <TableHead>Vesting</TableHead>
                        <TableHead>Grant Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {optionGrants.map((grant) => {
                        const vestedPct = grant.sharesGranted > 0 
                          ? Math.round((grant.sharesVested / grant.sharesGranted) * 100) 
                          : 0;
                        return (
                          <TableRow key={grant.id} data-testid={`row-option-grant-${grant.id}`}>
                            <TableCell className="font-medium">{grant.granteeName}</TableCell>
                            <TableCell className="text-muted-foreground">{grant.granteeRole}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  grant.status === "FULLY_VESTED" ? "default" : 
                                  grant.status === "VESTING" ? "secondary" : 
                                  grant.status === "EXERCISED" ? "default" :
                                  "outline"
                                }
                              >
                                {grant.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {grant.sharesGranted.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="font-mono">{grant.sharesVested.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground">({vestedPct}%)</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {grant.sharesExercised > 0 ? (
                                <span className="font-medium">
                                  {grant.sharesExercised.toLocaleString()}
                                </span>
                              ) : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(grant.exercisePrice, "USD")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Timer className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">
                                  {grant.vestingSchedule.replace(/_/g, " ").toLowerCase()}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(grant.grantDate)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </div>
  );
}

function LayoutDashboard(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

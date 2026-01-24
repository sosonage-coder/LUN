import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle,
  FileCheck,
  Users,
  Lock,
  Unlock
} from "lucide-react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Certification, CertificationKPIs, SoDViolation, SoDPolicyRule } from "@shared/schema";

function CertificationStatusBadge({ status }: { status: string }) {
  const config = {
    CERTIFIED: { label: "Certified", variant: "default" as const, className: "bg-green-600" },
    PENDING: { label: "Pending", variant: "secondary" as const, className: "bg-amber-500" },
    NOT_CERTIFIED: { label: "Not Certified", variant: "outline" as const, className: "" },
    DECERTIFIED: { label: "Decertified", variant: "destructive" as const, className: "" },
  };
  const { label, className } = config[status as keyof typeof config] || config.NOT_CERTIFIED;
  return <Badge className={className}>{label}</Badge>;
}

function SeverityBadge({ severity }: { severity: string }) {
  const config = {
    CRITICAL: { className: "bg-red-600 text-white" },
    HIGH: { className: "bg-orange-500 text-white" },
    MEDIUM: { className: "bg-amber-500 text-white" },
    LOW: { className: "bg-blue-500 text-white" },
  };
  const { className } = config[severity as keyof typeof config] || { className: "" };
  return <Badge className={className}>{severity}</Badge>;
}

function ViolationStatusBadge({ status }: { status: string }) {
  const config = {
    ACTIVE: { label: "Active", className: "bg-red-600" },
    OVERRIDDEN: { label: "Overridden", className: "bg-amber-500" },
    RESOLVED: { label: "Resolved", className: "bg-green-600" },
  };
  const { label, className } = config[status as keyof typeof config] || { label: status, className: "" };
  return <Badge className={className}>{label}</Badge>;
}

export default function CloseControlCertificationPage() {
  const { toast } = useToast();

  const { data: kpis, isLoading: kpisLoading } = useQuery<CertificationKPIs>({
    queryKey: ["/api/close-control/certifications/kpis"],
  });

  const { data: certifications = [], isLoading: certLoading } = useQuery<Certification[]>({
    queryKey: ["/api/close-control/certifications"],
  });

  const { data: violations = [], isLoading: violationsLoading } = useQuery<SoDViolation[]>({
    queryKey: ["/api/close-control/sod/violations"],
  });

  const { data: rules = [], isLoading: rulesLoading } = useQuery<SoDPolicyRule[]>({
    queryKey: ["/api/close-control/sod/rules"],
  });

  const overrideMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return apiRequest("POST", `/api/close-control/sod/violations/${id}/override`, { reason });
    },
    onSuccess: () => {
      toast({ title: "Violation Overridden", description: "The SoD violation has been overridden with documentation." });
      queryClient.invalidateQueries({ queryKey: ["/api/close-control/sod/violations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/close-control/certifications/kpis"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to override violation", variant: "destructive" });
    },
  });

  const isLoading = kpisLoading || certLoading || violationsLoading || rulesLoading;

  const tasklistCerts = certifications.filter(c => c.objectType === "TASKLIST");
  const scheduleCerts = certifications.filter(c => c.objectType === "SCHEDULE");
  const activeViolations = violations.filter(v => v.status === "ACTIVE");

  return (
    <div className="p-6 space-y-6" data-testid="certification-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="page-title">
            <Shield className="h-6 w-6" />
            Certification & Controls
          </h1>
          <p className="text-muted-foreground">Manage certifications and segregation of duties</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/close-control">Back to Close Control</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Tasklists</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="kpi-total-tasklists">
              {isLoading ? "-" : kpis?.totalTasklists || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Certified</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-green-600" data-testid="kpi-certified">
              {isLoading ? "-" : kpis?.certifiedTasklists || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-amber-500" data-testid="kpi-pending">
              {isLoading ? "-" : kpis?.pendingCertification || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Expiring Soon</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-orange-500" data-testid="kpi-expiring">
              {isLoading ? "-" : kpis?.expiringSoon || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-muted-foreground">SoD Violations</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-red-600" data-testid="kpi-violations">
              {isLoading ? "-" : kpis?.sodViolationsActive || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Overridden</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="kpi-overridden">
              {isLoading ? "-" : kpis?.sodViolationsOverridden || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certifications" data-testid="tab-certifications">Certifications</TabsTrigger>
          <TabsTrigger value="violations" data-testid="tab-violations">
            SoD Violations
            {activeViolations.length > 0 && (
              <Badge variant="destructive" className="ml-2">{activeViolations.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="policies" data-testid="tab-policies">SoD Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasklist Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tasklist Certifications</CardTitle>
                <CardDescription>Sign-off status for individual tasklists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasklistCerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tasklist certifications found</p>
                  ) : (
                    tasklistCerts.map((cert) => (
                      <div 
                        key={cert.id} 
                        className="flex items-center justify-between p-3 border rounded-md"
                        data-testid={`cert-tasklist-${cert.objectId}`}
                      >
                        <div>
                          <p className="font-medium">{cert.objectName}</p>
                          <p className="text-sm text-muted-foreground">Period: {cert.period}</p>
                          {cert.certifiedByName && (
                            <p className="text-xs text-muted-foreground">
                              By {cert.certifiedByName} on {new Date(cert.certifiedAt!).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <CertificationStatusBadge status={cert.status} />
                          {cert.status === "CERTIFIED" && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schedule Certifications</CardTitle>
                <CardDescription>Full close schedule sign-offs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduleCerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No schedule certifications found</p>
                  ) : (
                    scheduleCerts.map((cert) => (
                      <div 
                        key={cert.id} 
                        className="flex items-center justify-between p-3 border rounded-md"
                        data-testid={`cert-schedule-${cert.objectId}`}
                      >
                        <div>
                          <p className="font-medium">{cert.objectName}</p>
                          <p className="text-sm text-muted-foreground">Period: {cert.period}</p>
                          {cert.certifiedByName && (
                            <p className="text-xs text-muted-foreground">
                              By {cert.certifiedByName} on {new Date(cert.certifiedAt!).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <CertificationStatusBadge status={cert.status} />
                          {cert.status === "CERTIFIED" && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Active SoD Violations
              </CardTitle>
              <CardDescription>
                Segregation of duties conflicts that require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {violations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
                  <p>No SoD violations detected</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {violations.map((violation) => (
                    <div 
                      key={violation.id}
                      className="p-4 border rounded-lg space-y-3"
                      data-testid={`violation-${violation.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{violation.policyRuleName}</p>
                            <SeverityBadge severity={violation.severity} />
                            <ViolationStatusBadge status={violation.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Task: {violation.taskName}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">User:</span>
                          <span className="ml-2 font-medium">{violation.userName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conflict:</span>
                          <span className="ml-2">
                            <Badge variant="outline" className="mr-1">{violation.conflictingRole1}</Badge>
                            +
                            <Badge variant="outline" className="ml-1">{violation.conflictingRole2}</Badge>
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Detected:</span>
                          <span className="ml-2">{new Date(violation.detectedAt).toLocaleString()}</span>
                        </div>
                        {violation.status === "OVERRIDDEN" && (
                          <div>
                            <span className="text-muted-foreground">Override by:</span>
                            <span className="ml-2">{violation.overriddenBy}</span>
                          </div>
                        )}
                      </div>

                      {violation.overrideReason && (
                        <div className="bg-muted p-2 rounded text-sm">
                          <span className="text-muted-foreground">Override Reason: </span>
                          {violation.overrideReason}
                        </div>
                      )}

                      {violation.status === "ACTIVE" && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const reason = prompt("Enter override reason (min 10 characters):");
                              if (reason && reason.length >= 10) {
                                overrideMutation.mutate({ id: violation.id, reason });
                              }
                            }}
                            data-testid={`button-override-${violation.id}`}
                          >
                            <Unlock className="h-4 w-4 mr-1" />
                            Override with Reason
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SoD Policy Rules</CardTitle>
              <CardDescription>
                Define which role combinations are prohibited
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div 
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`rule-${rule.id}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{rule.name}</p>
                        <SeverityBadge severity={rule.severity} />
                        {!rule.isActive && (
                          <Badge variant="outline">Disabled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Conflict:</span>
                        <Badge variant="outline">{rule.conflictingRoles[0]}</Badge>
                        <span>cannot also be</span>
                        <Badge variant="outline">{rule.conflictingRoles[1]}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {rule.allowOverride && (
                        <Badge variant="secondary">Override Allowed</Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        {rule.isActive ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

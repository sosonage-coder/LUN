import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft,
  CheckCircle2,
  Clock,
  Plus,
  FileCheck,
  ChevronDown,
  ChevronRight,
  Loader2,
  Paperclip,
  Send,
  AlertTriangle,
  LayoutTemplate,
  Check
} from "lucide-react";
import type { Reconciliation, ReconciliationAccount, ReconciliationTemplate } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Accrual12MonthGrid } from "@/components/accrual-12month-grid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig = {
  NOT_STARTED: { label: "Not Started", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", nextAction: "Start", nextStatus: "IN_PROGRESS" as const },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", nextAction: "Submit for Review", nextStatus: "PENDING_REVIEW" as const },
  PENDING_REVIEW: { label: "Pending Review", color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300", nextAction: "Mark Reviewed", nextStatus: "REVIEWED" as const },
  REVIEWED: { label: "Reviewed", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300", nextAction: "Approve", nextStatus: "APPROVED" as const },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", nextAction: "Lock", nextStatus: "LOCKED" as const },
  LOCKED: { label: "Locked", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", nextAction: null, nextStatus: null },
};

const sectionTypeConfig: Record<string, { color: string }> = {
  OPENING_BALANCE: { color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" },
  CLOSING_BALANCE: { color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" },
  ADDITIONS: { color: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800" },
  DISPOSALS: { color: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800" },
  ADJUSTMENTS: { color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800" },
  SUBLEDGER_DETAIL: { color: "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800" },
  BANK_TRANSACTIONS: { color: "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800" },
  OUTSTANDING_ITEMS: { color: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800" },
  VARIANCE_ANALYSIS: { color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800" },
  SUPPORTING_DOCUMENTATION: { color: "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800" },
  CUSTOM: { color: "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800" },
  FX_REVALUATION: { color: "bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800" },
  BANK_NOT_IN_GL: { color: "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800" },
  GL_NOT_IN_BANK: { color: "bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800" },
  ACCRUAL_LINE_DETAIL: { color: "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800" },
  FX_EXCEPTION: { color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800" },
  SUMMARY_TIE_OUT: { color: "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800" },
};

interface ReconciliationData {
  reconciliation: Reconciliation;
  account: ReconciliationAccount;
  template: ReconciliationTemplate;
}

export default function ReconciliationWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<ReconciliationData>({
    queryKey: ["/api/reconciliations", id],
  });

  const { data: templates = [] } = useQuery<ReconciliationTemplate[]>({
    queryKey: ["/api/reconciliations/templates"],
  });

  const applyTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      return apiRequest("PATCH", `/api/reconciliations/${id}/template`, { templateId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reconciliations", id] });
      setIsTemplateDialogOpen(false);
      setSelectedTemplateId(null);
      toast({
        title: "Template applied",
        description: "The reconciliation template has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to apply template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      return apiRequest("PATCH", `/api/reconciliations/${id}/status`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reconciliations", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/reconciliations/kpis"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reconciliations?period=2026-01"] });
      toast({
        title: "Status updated",
        description: "The reconciliation status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96" data-testid="loading-workspace">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6" data-testid="error-workspace">
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Reconciliation Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested reconciliation could not be found.
            </p>
            <Link href="/reconciliations">
              <Button data-testid="button-back-to-list">Back to Reconciliations</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { reconciliation, account, template } = data;
  const config = statusConfig[reconciliation.status];
  const hasVariance = reconciliation.variance !== 0;

  return (
    <div className="p-6 space-y-6" data-testid="reconciliation-workspace">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/reconciliations">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{account.accountCode}</h1>
              <Badge className={config.color}>{config.label}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {account.accountName} - {reconciliation.period}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {config.nextAction && (
            <Button 
              onClick={() => config.nextStatus && updateStatusMutation.mutate(config.nextStatus)}
              disabled={updateStatusMutation.isPending}
              data-testid="button-advance-status"
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {config.nextAction}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GL Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="gl-balance">
              {formatCurrency(reconciliation.glBalance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reconciled Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono" data-testid="reconciled-balance">
              {formatCurrency(reconciliation.reconciledBalance)}
            </div>
          </CardContent>
        </Card>
        <Card className={hasVariance ? "border-red-200 dark:border-red-800" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-mono ${hasVariance ? "text-red-600" : "text-green-600"}`} data-testid="variance">
              {formatCurrency(reconciliation.variance)}
            </div>
            {hasVariance && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Requires investigation
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="attachment-count">{reconciliation.attachmentCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Reconciliation Sections
                  </CardTitle>
                  <CardDescription>
                    Template: {template?.name || "Unknown"}
                  </CardDescription>
                </div>
                <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="button-change-template">
                      <LayoutTemplate className="h-4 w-4 mr-2" />
                      Change Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Select Template</DialogTitle>
                      <DialogDescription>
                        Choose a template to apply to this reconciliation. The sections will be updated based on the template structure.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Select 
                        value={selectedTemplateId || undefined} 
                        onValueChange={setSelectedTemplateId}
                      >
                        <SelectTrigger data-testid="select-template">
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((t) => (
                            <SelectItem 
                              key={t.templateId} 
                              value={t.templateId}
                              data-testid={`template-option-${t.templateId}`}
                            >
                              {t.name}{t.templateId === template?.templateId ? " (Current)" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedTemplateId && (
                        <div className="rounded-md border p-3 bg-muted/30">
                          <h4 className="font-medium text-sm mb-2">Template Preview</h4>
                          {(() => {
                            const previewTemplate = templates.find(t => t.templateId === selectedTemplateId);
                            if (!previewTemplate) return null;
                            return (
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">{previewTemplate.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {previewTemplate.sections.map((section, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {section.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsTemplateDialogOpen(false);
                            setSelectedTemplateId(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => selectedTemplateId && applyTemplateMutation.mutate(selectedTemplateId)}
                          disabled={!selectedTemplateId || applyTemplateMutation.isPending}
                          data-testid="button-apply-template"
                        >
                          {applyTemplateMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Apply Template
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {template?.templateVariant === "ACCRUAL_12M_ROLLFORWARD" ? (
                <div className="text-sm text-muted-foreground">
                  See the 12-Month Rollforward grid below for accrual line details.
                </div>
              ) : reconciliation.sections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No sections populated yet. Start by adding items to each section.</p>
                </div>
              ) : (
                reconciliation.sections.map((section) => {
                  const isExpanded = expandedSections.has(section.sectionId);
                  const sectionConfig = sectionTypeConfig[section.sectionType] || sectionTypeConfig.CUSTOM;
                  
                  return (
                    <Collapsible 
                      key={section.sectionId} 
                      open={isExpanded} 
                      onOpenChange={() => toggleSection(section.sectionId)}
                    >
                      <Card className={`border ${sectionConfig.color}`}>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer py-3 transition-colors" data-testid={`section-header-${section.sectionId}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <div>
                                  <CardTitle className="text-sm font-medium">{section.name}</CardTitle>
                                  <p className="text-xs text-muted-foreground">{section.items.length} items</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="font-mono font-medium">{formatCurrency(section.subtotal)}</div>
                                </div>
                                {section.isComplete ? (
                                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Complete
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            {section.items.length > 0 ? (
                              <div className="rounded-md border overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b bg-muted/50">
                                      <th className="px-3 py-2 text-left font-medium">Description</th>
                                      <th className="px-3 py-2 text-left font-medium">Reference</th>
                                      <th className="px-3 py-2 text-left font-medium">Date</th>
                                      <th className="px-3 py-2 text-right font-medium">Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {section.items.map((item) => (
                                      <tr key={item.itemId} className="border-b last:border-0" data-testid={`item-${item.itemId}`}>
                                        <td className="px-3 py-2">
                                          <div>{item.description}</div>
                                          {item.notes && (
                                            <div className="text-xs text-muted-foreground">{item.notes}</div>
                                          )}
                                        </td>
                                        <td className="px-3 py-2 text-muted-foreground">{item.reference || "-"}</td>
                                        <td className="px-3 py-2 text-muted-foreground">{item.date || "-"}</td>
                                        <td className="px-3 py-2 text-right font-mono">
                                          <span className={item.amount < 0 ? "text-red-600" : ""}>
                                            {formatCurrency(item.amount)}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground text-sm">
                                No items in this section
                              </div>
                            )}
                            <div className="mt-3 flex justify-end">
                              <Button variant="outline" size="sm" data-testid={`button-add-item-${section.sectionId}`}>
                                <Plus className="h-3 w-3 mr-1" />
                                Add Item
                              </Button>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  );
                })
              )}
            </CardContent>
          </Card>
          
          {template?.templateVariant === "ACCRUAL_12M_ROLLFORWARD" && (
            <Accrual12MonthGrid 
              sections={reconciliation.sections}
              period={reconciliation.period}
              glBalance={reconciliation.glBalance}
            />
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prepared By</span>
                  <span>{reconciliation.preparedBy || "-"}</span>
                </div>
                {reconciliation.preparedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prepared At</span>
                    <span>{new Date(reconciliation.preparedAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reviewed By</span>
                  <span>{reconciliation.reviewedBy || "-"}</span>
                </div>
                {reconciliation.reviewedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reviewed At</span>
                    <span>{new Date(reconciliation.reviewedAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Approved By</span>
                  <span>{reconciliation.approvedBy || "-"}</span>
                </div>
                {reconciliation.approvedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Approved At</span>
                    <span>{new Date(reconciliation.approvedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reconciliation.attachmentCount > 0 ? (
                <div className="text-sm text-muted-foreground">
                  {reconciliation.attachmentCount} file(s) attached
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">No attachments</p>
                  <Button variant="outline" size="sm" data-testid="button-add-attachment">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Attachment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {reconciliation.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{reconciliation.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

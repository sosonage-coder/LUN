import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileCheck, 
  Plus, 
  ArrowLeft,
  ListTree,
  Loader2,
  Lock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Copy,
  Settings,
  CheckCircle2,
  Building2
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ReconciliationTemplate } from "@shared/schema";

const accountTypeLabels: Record<string, string> = {
  CASH: "Cash",
  ACCOUNTS_RECEIVABLE: "AR",
  ACCOUNTS_PAYABLE: "AP",
  PREPAID: "Prepaid",
  FIXED_ASSET: "Fixed Assets",
  ACCRUAL: "Accruals",
  INVENTORY: "Inventory",
  INTERCOMPANY: "Intercompany",
  DEBT: "Debt",
  EQUITY: "Equity",
  OTHER: "Other",
};

const sectionTypeLabels: Record<string, string> = {
  OPENING_BALANCE: "Opening Balance",
  CLOSING_BALANCE: "Closing Balance",
  ADDITIONS: "Additions",
  DISPOSALS: "Disposals",
  ADJUSTMENTS: "Adjustments",
  SUBLEDGER_DETAIL: "Subledger Detail",
  BANK_TRANSACTIONS: "Bank Transactions",
  OUTSTANDING_ITEMS: "Outstanding Items",
  VARIANCE_ANALYSIS: "Variance Analysis",
  SUPPORTING_DOCUMENTATION: "Documentation",
  CUSTOM: "Custom",
};

const sectionTypeColors: Record<string, string> = {
  OPENING_BALANCE: "bg-blue-500",
  CLOSING_BALANCE: "bg-green-500",
  ADDITIONS: "bg-emerald-500",
  DISPOSALS: "bg-red-500",
  ADJUSTMENTS: "bg-amber-500",
  SUBLEDGER_DETAIL: "bg-purple-500",
  BANK_TRANSACTIONS: "bg-cyan-500",
  OUTSTANDING_ITEMS: "bg-orange-500",
  VARIANCE_ANALYSIS: "bg-pink-500",
  SUPPORTING_DOCUMENTATION: "bg-gray-500",
  CUSTOM: "bg-slate-500",
};

export default function ReconciliationTemplatesPage() {
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());
  const [previewTemplate, setPreviewTemplate] = useState<ReconciliationTemplate | null>(null);
  
  const { data: templates, isLoading, error } = useQuery<ReconciliationTemplate[]>({
    queryKey: ["/api/reconciliations/templates"],
  });

  const systemTemplates = templates?.filter(t => t.isSystemTemplate) || [];
  const customTemplates = templates?.filter(t => !t.isSystemTemplate) || [];

  const toggleTemplate = (templateId: string) => {
    const newExpanded = new Set(expandedTemplates);
    if (newExpanded.has(templateId)) {
      newExpanded.delete(templateId);
    } else {
      newExpanded.add(templateId);
    }
    setExpandedTemplates(newExpanded);
  };

  const TemplateCard = ({ template, isSystem }: { template: ReconciliationTemplate; isSystem: boolean }) => {
    const isExpanded = expandedTemplates.has(template.templateId);
    
    return (
      <Collapsible 
        open={isExpanded} 
        onOpenChange={() => toggleTemplate(template.templateId)}
      >
        <Card 
          className="overflow-hidden transition-all" 
          data-testid={`template-${template.templateId}`}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover-elevate pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                      <FileCheck className="h-4 w-4 text-primary" />
                    </div>
                    {template.name}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </div>
                {isSystem && (
                  <Badge variant="outline" className="shrink-0">
                    <Lock className="h-3 w-3 mr-1" />
                    System
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {template.accountTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {accountTypeLabels[type]}
                  </Badge>
                ))}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="border-t pt-4">
                <div className="text-sm font-medium flex items-center gap-2 mb-3">
                  <ListTree className="h-4 w-4" />
                  Template Sections ({template.sections.length})
                </div>
                <div className="space-y-2">
                  {template.sections.map((section, index) => (
                    <div 
                      key={section.sectionId}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium">
                        {index + 1}
                      </div>
                      <div 
                        className={`h-2 w-2 rounded-full ${sectionTypeColors[section.sectionType] || 'bg-gray-500'}`} 
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{section.name}</div>
                        <div className="text-xs text-muted-foreground">{sectionTypeLabels[section.sectionType]}</div>
                      </div>
                      {section.isRequired && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}
                  data-testid={`button-preview-${template.templateId}`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                {!isSystem && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    data-testid={`button-edit-${template.templateId}`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  data-testid={`button-duplicate-${template.templateId}`}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  };

  return (
    <div className="p-6 space-y-6" data-testid="reconciliation-templates-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/reconciliations">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reconciliation Templates</h1>
            <p className="text-muted-foreground mt-1">
              Template library for structured account reconciliations
            </p>
          </div>
        </div>
        <Button data-testid="button-new-template">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card className="border-destructive" data-testid="error-state">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Failed to Load Templates</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Unable to load reconciliation templates. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()} data-testid="button-retry">
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">System Templates</h2>
              <Badge variant="secondary">{systemTemplates.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemTemplates.map((template) => (
                <TemplateCard key={template.templateId} template={template} isSystem={true} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileCheck className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Custom Templates</h2>
              <Badge variant="secondary">{customTemplates.length}</Badge>
            </div>
            {customTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customTemplates.map((template) => (
                  <TemplateCard key={template.templateId} template={template} isSystem={false} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                    <FileCheck className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Custom Templates</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Create custom templates to define your own reconciliation structures
                    tailored to your organization's needs.
                  </p>
                  <Button data-testid="button-create-template">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              {previewTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              {previewTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          {previewTemplate && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Account Types</h4>
                <div className="flex flex-wrap gap-1">
                  {previewTemplate.accountTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {accountTypeLabels[type]}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Sections Structure</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {previewTemplate.sections.map((section, index) => (
                    <div 
                      key={section.sectionId}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium">
                        {index + 1}
                      </div>
                      <div 
                        className={`h-3 w-3 rounded-full ${sectionTypeColors[section.sectionType] || 'bg-gray-500'}`} 
                      />
                      <div className="flex-1">
                        <div className="font-medium">{section.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {sectionTypeLabels[section.sectionType]}
                          {section.description && ` - ${section.description}`}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {section.isRequired && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button className="flex-1" data-testid="button-use-template">
                  Use Template
                </Button>
                <Button variant="outline" data-testid="button-duplicate-preview">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

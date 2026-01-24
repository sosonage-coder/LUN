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
  AlertCircle
} from "lucide-react";
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

export default function ReconciliationTemplatesPage() {
  const { data: templates, isLoading, error } = useQuery<ReconciliationTemplate[]>({
    queryKey: ["/api/reconciliations/templates"],
  });

  const systemTemplates = templates?.filter(t => t.isSystemTemplate) || [];
  const customTemplates = templates?.filter(t => !t.isSystemTemplate) || [];

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
            <FileCheck className="h-12 w-12 text-destructive mb-4" />
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
            <h2 className="text-lg font-medium mb-4">System Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemTemplates.map((template) => (
                <Card key={template.templateId} className="hover-elevate cursor-pointer" data-testid={`template-${template.templateId}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileCheck className="h-4 w-4" />
                          {template.name}
                        </CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        <Lock className="h-3 w-3 mr-1" />
                        System
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {template.accountTypes.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {accountTypeLabels[type]}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <ListTree className="h-3 w-3" />
                        Sections ({template.sections.length})
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {template.sections.slice(0, 4).map((section) => (
                          <div key={section.sectionId} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                            {section.name}
                          </div>
                        ))}
                        {template.sections.length > 4 && (
                          <div className="text-muted-foreground">
                            +{template.sections.length - 4} more sections
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {customTemplates.length > 0 && (
            <div>
              <h2 className="text-lg font-medium mb-4">Custom Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customTemplates.map((template) => (
                  <Card key={template.templateId} className="hover-elevate cursor-pointer" data-testid={`template-${template.templateId}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileCheck className="h-4 w-4" />
                        {template.name}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {template.accountTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {accountTypeLabels[type]}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {template.sections.length} sections
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {customTemplates.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
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
        </>
      )}
    </div>
  );
}

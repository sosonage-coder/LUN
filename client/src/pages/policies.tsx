import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, 
  Plus, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight
} from "lucide-react";

const policies = [
  { name: "Prepaid Expense Recognition", category: "Prepaids", status: "approved", version: "v2.1", lastUpdated: "2024-01-15" },
  { name: "Fixed Asset Capitalization", category: "Fixed Assets", status: "approved", version: "v1.4", lastUpdated: "2024-01-10" },
  { name: "Revenue Recognition Standards", category: "Revenue", status: "pending", version: "v3.0", lastUpdated: "2024-01-20" },
  { name: "Accrual Estimation Methods", category: "Accruals", status: "approved", version: "v1.2", lastUpdated: "2023-12-05" },
  { name: "Cash Management Controls", category: "Cash", status: "draft", version: "v1.0", lastUpdated: "2024-01-22" },
  { name: "Intercompany Transfer Pricing", category: "Intercompany", status: "approved", version: "v2.0", lastUpdated: "2023-11-30" },
];

const statusConfig = {
  approved: { label: "Approved", color: "bg-green-600", icon: CheckCircle2 },
  pending: { label: "Pending Review", color: "bg-amber-500", icon: Clock },
  draft: { label: "Draft", color: "bg-gray-500", icon: FileText },
};

export default function PoliciesPage() {
  return (
    <div className="p-6 space-y-6" data-testid="policies-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Policies</h1>
          <p className="text-muted-foreground mt-1">
            Policy documentation, versioning, and approval workflows
          </p>
        </div>
        <Button data-testid="button-new-policy">
          <Plus className="h-4 w-4 mr-2" />
          New Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due for Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">5</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Policy Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {policies.map((policy) => {
              const status = statusConfig[policy.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              return (
                <div
                  key={policy.name}
                  className="flex items-center justify-between p-3 rounded-lg border hover-elevate cursor-pointer"
                  data-testid={`policy-${policy.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{policy.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{policy.category}</span>
                        <span>•</span>
                        <span>{policy.version}</span>
                        <span>•</span>
                        <span>Updated {policy.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            Full policy management with version control, approval workflows, 
            attestation tracking, and automated review reminders are under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

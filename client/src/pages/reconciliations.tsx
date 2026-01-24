import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight 
} from "lucide-react";

const categories = [
  { name: "Cash", count: 12, pending: 3 },
  { name: "Accounts Receivable", count: 8, pending: 1 },
  { name: "Accounts Payable", count: 15, pending: 4 },
  { name: "Prepaids", count: 6, pending: 0 },
  { name: "Fixed Assets", count: 10, pending: 2 },
  { name: "Accruals", count: 9, pending: 1 },
  { name: "Intercompany", count: 4, pending: 0 },
];

export default function ReconciliationsPage() {
  return (
    <div className="p-6 space-y-6" data-testid="reconciliations-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reconciliations</h1>
          <p className="text-muted-foreground mt-1">
            Account reconciliation workflows and queue management
          </p>
        </div>
        <Button data-testid="button-new-reconciliation">
          <Plus className="h-4 w-4 mr-2" />
          New Reconciliation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">11</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">53</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Exceptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Reconciliation Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-3 rounded-lg border hover-elevate cursor-pointer"
                data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center gap-3">
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary">{category.count} accounts</Badge>
                </div>
                <div className="flex items-center gap-3">
                  {category.pending > 0 ? (
                    <div className="flex items-center gap-1 text-amber-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{category.pending} pending</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Complete</span>
                    </div>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
          <p className="text-muted-foreground max-w-md">
            Full reconciliation workflows with automated matching, variance analysis, 
            and approval routing are under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

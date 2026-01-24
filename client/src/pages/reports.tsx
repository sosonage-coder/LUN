import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Plus, 
  FileBarChart,
  Download,
  Calendar,
  AlertCircle,
  ArrowRight,
  TrendingUp
} from "lucide-react";

const reports = [
  { name: "Monthly Close Summary", category: "Close", frequency: "Monthly", lastRun: "2024-01-15", status: "ready" },
  { name: "Prepaid Amortization Schedule", category: "Prepaids", frequency: "Monthly", lastRun: "2024-01-15", status: "ready" },
  { name: "Fixed Asset Register", category: "Fixed Assets", frequency: "Quarterly", lastRun: "2024-01-01", status: "ready" },
  { name: "Revenue Recognition Detail", category: "Revenue", frequency: "Monthly", lastRun: "2024-01-15", status: "ready" },
  { name: "Accrual Reconciliation", category: "Accruals", frequency: "Monthly", lastRun: "2024-01-15", status: "ready" },
  { name: "Cash Flow Analysis", category: "Cash", frequency: "Weekly", lastRun: "2024-01-22", status: "processing" },
];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6" data-testid="reports-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Financial reports, analytics, and scheduled report generation
          </p>
        </div>
        <Button data-testid="button-new-report">
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Generated Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">1</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {reports.map((report) => (
              <div
                key={report.name}
                className="flex items-center justify-between p-3 rounded-lg border hover-elevate cursor-pointer"
                data-testid={`report-${report.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center gap-3">
                  <FileBarChart className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">{report.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{report.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.frequency}
                      </span>
                      <span>•</span>
                      <span>Last run {report.lastRun}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.status === "ready" ? (
                    <Badge className="bg-green-600">Ready</Badge>
                  ) : (
                    <Badge className="bg-amber-500">Processing</Badge>
                  )}
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
            Charts and analytics coming soon
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center h-full">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              Custom report builder, scheduled generation, export options, 
              and interactive dashboards are under development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

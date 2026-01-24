import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck, 
  Plus, 
  Play,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Users
} from "lucide-react";

const walkthroughs = [
  { name: "Q4 Revenue Recognition", category: "Revenue", status: "in_progress", assignee: "Sarah Chen", dueDate: "2024-01-31" },
  { name: "Prepaid Insurance Review", category: "Prepaids", status: "completed", assignee: "Mike Johnson", dueDate: "2024-01-15" },
  { name: "Fixed Asset Additions", category: "Fixed Assets", status: "scheduled", assignee: "Emily Davis", dueDate: "2024-02-05" },
  { name: "AP Cutoff Testing", category: "Accounts Payable", status: "in_progress", assignee: "John Smith", dueDate: "2024-01-28" },
  { name: "Cash Controls Testing", category: "Cash", status: "completed", assignee: "Lisa Wong", dueDate: "2024-01-10" },
  { name: "Intercompany Eliminations", category: "Intercompany", status: "scheduled", assignee: "Tom Brown", dueDate: "2024-02-10" },
];

const statusConfig = {
  completed: { label: "Completed", color: "bg-green-600", icon: CheckCircle2 },
  in_progress: { label: "In Progress", color: "bg-blue-600", icon: Play },
  scheduled: { label: "Scheduled", color: "bg-gray-500", icon: Clock },
};

export default function WalkthroughsPage() {
  return (
    <div className="p-6 space-y-6" data-testid="walkthroughs-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Walkthroughs</h1>
          <p className="text-muted-foreground mt-1">
            Process walkthroughs, testing procedures, and audit documentation
          </p>
        </div>
        <Button data-testid="button-new-walkthrough">
          <Plus className="h-4 w-4 mr-2" />
          New Walkthrough
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Walkthroughs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Active Walkthroughs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {walkthroughs.map((walkthrough) => {
              const status = statusConfig[walkthrough.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              return (
                <div
                  key={walkthrough.name}
                  className="flex items-center justify-between p-3 rounded-lg border hover-elevate cursor-pointer"
                  data-testid={`walkthrough-${walkthrough.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-medium">{walkthrough.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{walkthrough.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {walkthrough.assignee}
                        </span>
                        <span>•</span>
                        <span>Due {walkthrough.dueDate}</span>
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
            Full walkthrough management with step-by-step procedures, evidence collection, 
            testing documentation, and audit trail are under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users,
  Building2,
  Shield,
  Database,
  Bell,
  Key,
  ArrowRight,
  AlertCircle
} from "lucide-react";

const adminSections = [
  { 
    name: "User Management", 
    icon: Users, 
    description: "Manage users, roles, and permissions",
    count: "24 users",
  },
  { 
    name: "Organization Settings", 
    icon: Building2, 
    description: "Company profile, subsidiaries, and entities",
    count: "3 entities",
  },
  { 
    name: "Security & Access", 
    icon: Shield, 
    description: "SSO, MFA, and access policies",
    count: "Active",
  },
  { 
    name: "Data Management", 
    icon: Database, 
    description: "Import, export, and data retention",
    count: "2.4 GB",
  },
  { 
    name: "Notifications", 
    icon: Bell, 
    description: "Email templates and notification rules",
    count: "12 rules",
  },
  { 
    name: "API & Integrations", 
    icon: Key, 
    description: "API keys and third-party integrations",
    count: "5 active",
  },
];

export default function AdminPage() {
  return (
    <div className="p-6 space-y-6" data-testid="admin-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Administration</h1>
          <p className="text-muted-foreground mt-1">
            System settings, user management, and configuration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-600">Operational</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Administration Sections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.name}
                  className="flex items-center justify-between p-4 rounded-lg border hover-elevate cursor-pointer"
                  data-testid={`admin-${section.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-medium">{section.name}</span>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{section.count}</Badge>
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
            Full administration panel with user management, role configuration, 
            audit logs, and system settings are under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

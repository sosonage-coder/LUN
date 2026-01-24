import { useLocation, Link } from "wouter";
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Settings,
  Building2,
  Clock,
  Calculator,
  Wallet,
  HardDrive,
  Landmark,
  Receipt,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Banknote,
  Shield,
  ListChecks,
  ClipboardCheck
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "My Tasks",
    url: "/my-tasks",
    icon: ClipboardCheck,
  },
  {
    title: "Calendar View",
    url: "/close-control/calendar",
    icon: Calendar,
  },
  {
    title: "Schedules",
    url: "/schedules",
    icon: Clock,
  },
  {
    title: "Prepaid Calculator",
    url: "/prepaid-calculator",
    icon: Calculator,
  },
  {
    title: "Entities",
    url: "/entities",
    icon: Building2,
  },
];

const categoryItems = [
  {
    title: "Prepaids",
    url: "/prepaids",
    icon: Wallet,
    subItems: [
      { title: "Insurance", url: "/prepaids/insurance" },
      { title: "Rent", url: "/prepaids/rent" },
      { title: "Software", url: "/prepaids/software" },
      { title: "Other", url: "/prepaids/other" },
    ],
  },
  {
    title: "Fixed Assets",
    url: "/fixed-assets",
    icon: HardDrive,
    subItems: [
      { title: "IT Equipment", url: "/fixed-assets/it" },
      { title: "Furniture", url: "/fixed-assets/furniture" },
      { title: "Leasehold", url: "/fixed-assets/leasehold" },
      { title: "Vehicles", url: "/fixed-assets/vehicles" },
      { title: "Machinery", url: "/fixed-assets/machinery" },
      { title: "Other", url: "/fixed-assets/other" },
    ],
  },
  {
    title: "Accruals",
    url: "/accruals",
    icon: Landmark,
    subItems: [
      { title: "Payroll", url: "/accruals/payroll" },
      { title: "Bonuses & Commissions", url: "/accruals/bonuses-commissions" },
      { title: "Professional Fees", url: "/accruals/professional-fees" },
      { title: "Hosting & SaaS", url: "/accruals/hosting-saas" },
      { title: "Utilities", url: "/accruals/utilities" },
      { title: "Other", url: "/accruals/other" },
    ],
  },
  {
    title: "Revenue & Contracts",
    url: "/revenue",
    icon: Receipt,
    subItems: [
      { title: "Subscriptions", url: "/revenue/subscriptions" },
      { title: "Support & Maintenance", url: "/revenue/support-maintenance" },
      { title: "Usage-Based", url: "/revenue/usage-based" },
      { title: "Milestone-Based", url: "/revenue/milestone-based" },
      { title: "Licensing", url: "/revenue/licensing" },
    ],
  },
  {
    title: "Investment Income",
    url: "/investment-income",
    icon: TrendingUp,
    subItems: [
      { title: "Interest Bearing", url: "/investment-income/interest-bearing" },
      { title: "Dividends", url: "/investment-income/dividends" },
      { title: "Fixed Income", url: "/investment-income/fixed-income" },
      { title: "Equity Method", url: "/investment-income/equity-method" },
      { title: "Other", url: "/investment-income/other" },
    ],
  },
  {
    title: "Loan & Debt",
    url: "/debt",
    icon: TrendingDown,
    subItems: [
      { title: "Term Loans", url: "/debt/term-loans" },
      { title: "Revolving Credit", url: "/debt/revolving-credit" },
      { title: "Bonds & Notes", url: "/debt/bonds-notes" },
      { title: "Intercompany Loans", url: "/debt/intercompany-loans" },
      { title: "Lease Liabilities", url: "/debt/lease-liabilities" },
      { title: "Other", url: "/debt/other" },
    ],
  },
  {
    title: "Cash",
    url: "/cash",
    icon: Banknote,
    subItems: [
      { title: "Customer Receipts", url: "/cash/customer-receipts" },
      { title: "Vendor Payments", url: "/cash/vendor-payments" },
      { title: "Ops Expenses", url: "/cash/ops-expenses" },
      { title: "Other", url: "/cash/other" },
      { title: "Manual Tagging", url: "/cash/manual-tagging" },
    ],
  },
];

const systemItems = [
  {
    title: "Period Status",
    url: "/periods",
    icon: Clock,
  },
  {
    title: "Audit Log",
    url: "/audit",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Schedule Engine</h1>
            <p className="text-xs text-muted-foreground">Non-Monetary v1.0</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Close Control</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Collapsible 
                  defaultOpen={location.startsWith("/close-control")}
                  className="group/collapsible w-full"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      isActive={location === "/close-control"}
                      data-testid="nav-close-control"
                      tooltip="Close Control"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Close Schedules</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={location === "/close-control"}
                          data-testid="nav-close-control-dashboard"
                        >
                          <Link href="/close-control">
                            <span className="text-muted-foreground">Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={location === "/close-control/templates"}
                          data-testid="nav-close-control-templates"
                        >
                          <Link href="/close-control/templates">
                            <span>Templates</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={location === "/close-control/certification"}
                          data-testid="nav-close-control-certification"
                        >
                          <Link href="/close-control/certification">
                            <span>Certification & SoD</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {(() => {
                        const scheduleMatch = location.match(/\/close-control\/schedule\/([^/]+)/);
                        if (scheduleMatch) {
                          const scheduleId = scheduleMatch[1];
                          return (
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={true}
                                data-testid="nav-close-control-schedule"
                              >
                                <Link href={`/close-control/schedule/${scheduleId}`}>
                                  <span>Schedule ({scheduleId})</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        }
                        return null;
                      })()}
                      {(() => {
                        const tasklistMatch = location.match(/\/close-control\/tasklist\/([^/]+)/);
                        if (tasklistMatch) {
                          const tasklistId = tasklistMatch[1];
                          return (
                            <>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton 
                                  asChild
                                  isActive={false}
                                  data-testid="nav-close-control-schedule-parent"
                                >
                                  <Link href="/close-control">
                                    <span className="text-muted-foreground">Schedule</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton 
                                  asChild
                                  isActive={true}
                                  data-testid="nav-close-control-tasklist"
                                >
                                  <Link href={`/close-control/tasklist/${tasklistId}`}>
                                    <ListChecks className="h-3 w-3 mr-1" />
                                    <span>Tasklist ({tasklistId})</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </>
                          );
                        }
                        return null;
                      })()}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categoryItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== "/" && location.startsWith(item.url));
                const isSubItemActive = item.subItems?.some(sub => location === sub.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <Collapsible 
                      defaultOpen={isActive || isSubItemActive}
                      className="group/collapsible w-full"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          isActive={isActive && !isSubItemActive}
                          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-').replace('&', '')}`}
                          tooltip={item.title}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton 
                              asChild 
                              isActive={location === item.url}
                              data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-').replace('&', '')}-dashboard`}
                            >
                              <Link href={item.url}>
                                <span className="text-muted-foreground">Dashboard</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {item.subItems?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={location === subItem.url}
                                data-testid={`nav-sub-${subItem.title.toLowerCase().replace(/\s+/g, '-').replace('&', '')}`}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Base Spec v1.0
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

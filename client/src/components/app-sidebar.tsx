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
  ClipboardCheck,
  Users,
  FileCheck,
  CalendarDays
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
import { useProduct } from "@/contexts/product-context";

const scheduleStudioNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Schedules", url: "/schedules", icon: Clock },
  { title: "Prepaid Calculator", url: "/prepaid-calculator", icon: Calculator },
  { title: "Entities", url: "/entities", icon: Building2 },
];

const scheduleStudioCategories = [
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

const oneCloseNav = [
  { title: "Dashboard", url: "/close-control", icon: LayoutDashboard },
  { title: "My Tasks", url: "/my-tasks", icon: ClipboardCheck },
  { title: "Calendar View", url: "/close-control/calendar", icon: CalendarDays },
  { title: "Templates", url: "/close-control/templates", icon: FileText },
  { title: "Certification & SoD", url: "/close-control/certification", icon: Shield },
];

const reconciliationsNav = [
  { title: "Dashboard", url: "/reconciliations", icon: LayoutDashboard },
  { title: "Templates", url: "/reconciliations/templates", icon: FileText },
];

const accountCategories = [
  { title: "Cash", key: "CASH", icon: Banknote },
  { title: "Accounts Receivable", key: "ACCOUNTS_RECEIVABLE", icon: TrendingUp },
  { title: "Accounts Payable", key: "ACCOUNTS_PAYABLE", icon: TrendingDown },
  { title: "Prepaid Expenses", key: "PREPAID", icon: Clock },
  { title: "Fixed Assets", key: "FIXED_ASSET", icon: Building2 },
  { title: "Accruals", key: "ACCRUAL", icon: Receipt },
  { title: "Inventory", key: "INVENTORY", icon: HardDrive },
  { title: "Intercompany", key: "INTERCOMPANY", icon: Users },
  { title: "Debt", key: "DEBT", icon: Landmark },
];

const systemItems = [
  { title: "Period Status", url: "/periods", icon: Clock },
  { title: "Audit Log", url: "/audit", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

const productInfo = {
  "schedule-studio": { name: "Schedule Studio", icon: Calculator, description: "Cost Allocation" },
  "oneclose": { name: "OneClose", icon: Shield, description: "Close Management" },
  "reconciliations": { name: "Reconciliations", icon: FileCheck, description: "Account Reconciliation" },
  "policies": { name: "Policies", icon: FileText, description: "Coming Soon" },
  "walkthroughs": { name: "Walkthroughs", icon: ClipboardCheck, description: "Coming Soon" },
  "reports": { name: "Reports", icon: FileText, description: "Coming Soon" },
  "admin": { name: "Admin", icon: Settings, description: "Coming Soon" },
};

export function AppSidebar() {
  const [location] = useLocation();
  const { activeProduct } = useProduct();
  
  const info = productInfo[activeProduct] || productInfo["schedule-studio"];
  const ProductIcon = info.icon;

  const renderScheduleStudio = () => (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {scheduleStudioNav.map((item) => {
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
        <SidebarGroupLabel>Categories</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {scheduleStudioCategories.map((item) => {
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
    </>
  );

  const renderOneClose = () => (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {oneCloseNav.map((item) => {
              const isActive = location === item.url || 
                (item.url !== "/close-control" && location.startsWith(item.url));
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
        <SidebarGroupLabel>Active Close</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {(() => {
              const scheduleMatch = location.match(/\/close-control\/schedule\/([^/]+)/);
              const tasklistMatch = location.match(/\/close-control\/tasklist\/([^/]+)/);
              
              if (scheduleMatch) {
                const scheduleId = scheduleMatch[1];
                return (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild
                      isActive={true}
                      data-testid="nav-close-control-schedule"
                    >
                      <Link href={`/close-control/schedule/${scheduleId}`}>
                        <Calendar className="h-4 w-4" />
                        <span>Schedule ({scheduleId})</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
              
              if (tasklistMatch) {
                const tasklistId = tasklistMatch[1];
                return (
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild
                      isActive={true}
                      data-testid="nav-close-control-tasklist"
                    >
                      <Link href={`/close-control/tasklist/${tasklistId}`}>
                        <ListChecks className="h-4 w-4" />
                        <span>Tasklist ({tasklistId})</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
              
              return (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled className="text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>No active schedule</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })()}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );

  const renderReconciliations = () => (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {reconciliationsNav.map((item) => {
              const isActive = location === item.url || 
                (item.url !== "/reconciliations" && location.startsWith(item.url));
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    data-testid={`nav-reconciliations-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
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
        <SidebarGroupLabel>Account Categories</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton data-testid="nav-account-categories">
                    <FileCheck className="h-4 w-4" />
                    <span>All Categories</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {accountCategories.map((category) => (
                      <SidebarMenuSubItem key={category.key}>
                        <SidebarMenuSubButton 
                          asChild
                          data-testid={`nav-category-${category.key.toLowerCase()}`}
                        >
                          <Link href={`/reconciliations?category=${category.key}`}>
                            <category.icon className="h-4 w-4" />
                            <span>{category.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );

  const renderComingSoon = () => (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <ProductIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-sm font-medium mb-1">{info.name}</h3>
          <p className="text-xs text-muted-foreground">
            This module is under development
          </p>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ProductIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">{info.name}</h1>
            <p className="text-xs text-muted-foreground">{info.description}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {activeProduct === "schedule-studio" && renderScheduleStudio()}
        {activeProduct === "oneclose" && renderOneClose()}
        {activeProduct === "reconciliations" && renderReconciliations()}
        {!["schedule-studio", "oneclose", "reconciliations"].includes(activeProduct) && renderComingSoon()}
        
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

import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
  ChevronDown,
  Banknote,
  Shield,
  ListChecks,
  ClipboardCheck,
  Users,
  FileCheck,
  CalendarDays,
  Loader2,
  Globe,
  Gavel,
  UserCheck,
  AlertTriangle,
  BookOpen,
  Briefcase,
  Sparkles,
  Activity,
  Target,
  Layers,
  DollarSign,
  CircleDollarSign,
  Coins,
  Rocket,
  FileSpreadsheet,
  Award,
  Scale,
  ArrowDownUp,
  Table2,
  Edit3,
  FolderOpen,
  Upload,
  GitBranch,
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
import type { ReconciliationAccount, ReconciliationAccountGroup } from "@shared/schema";
import { accountGroupLabels, accountGroupToType } from "@shared/schema";

const scheduleStudioNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "All Schedules", url: "/schedule-studio", icon: Layers },
  { title: "Schedules List", url: "/schedules", icon: Clock },
  { title: "Prepaid Calculator", url: "/prepaid-calculator", icon: Calculator },
  { title: "Entities", url: "/entities", icon: Building2 },
];

const artifactNav = [
  { title: "Artifact Registry", url: "/artifacts", icon: FolderOpen },
  { title: "Documentation Health", url: "/artifacts/health", icon: Activity },
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

const accountGroupsByType: Record<string, ReconciliationAccountGroup[]> = {
  CASH: ["OPERATING_CASH", "RESTRICTED_CASH"],
  ACCOUNTS_RECEIVABLE: ["TRADE_RECEIVABLES", "OTHER_RECEIVABLES"],
  ACCOUNTS_PAYABLE: ["TRADE_PAYABLES", "OTHER_PAYABLES"],
  PREPAID: ["SHORT_TERM_PREPAIDS", "LONG_TERM_PREPAIDS"],
  FIXED_ASSET: ["LAND_AND_BUILDINGS", "EQUIPMENT", "INTANGIBLES", "ACCUMULATED_DEPRECIATION"],
  ACCRUAL: ["COMPENSATION_ACCRUALS", "TAX_ACCRUALS", "OTHER_ACCRUALS"],
  INVENTORY: ["RAW_MATERIALS", "FINISHED_GOODS", "WORK_IN_PROGRESS"],
  INTERCOMPANY: ["IC_RECEIVABLES", "IC_PAYABLES"],
  DEBT: ["SHORT_TERM_DEBT", "LONG_TERM_DEBT"],
  EQUITY: ["CAPITAL_STOCK", "RETAINED_EARNINGS"],
  OTHER: ["MISCELLANEOUS"],
};

const systemItems = [
  { title: "Period Status", url: "/periods", icon: Clock },
  { title: "Audit Log", url: "/audit", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

const oneComplianceNav = [
  { title: "Dashboard", url: "/compliance", icon: LayoutDashboard },
  { title: "Entities", url: "/compliance/entities", icon: Building2 },
  { title: "Obligations", url: "/compliance/obligations", icon: ClipboardCheck },
  { title: "Governance", url: "/compliance/governance", icon: Gavel },
  { title: "Authority", url: "/compliance/authority", icon: UserCheck },
  { title: "Risks", url: "/compliance/risks", icon: AlertTriangle },
  { title: "Policies", url: "/compliance/policies", icon: BookOpen },
  { title: "Advisors", url: "/compliance/advisors", icon: Briefcase },
  { title: "Audit Readiness", url: "/compliance/audit", icon: Shield },
  { title: "AI Insights", url: "/compliance/insights", icon: Sparkles },
  { title: "ROI Metrics", url: "/compliance/roi", icon: Target },
];

const equityTrackerNav = [
  { title: "Shareholders", url: "/compliance/shareholders", icon: Users },
  { title: "Cap Table", url: "/compliance/captable", icon: Layers },
  { title: "Equity Events", url: "/compliance/equity-events", icon: Coins },
  { title: "Dividends", url: "/compliance/dividends", icon: CircleDollarSign },
];

const startupEquityNav = [
  { title: "Funding Rounds", url: "/compliance/funding-rounds", icon: Rocket },
  { title: "Convertibles", url: "/compliance/convertibles", icon: FileSpreadsheet },
  { title: "Options", url: "/compliance/options", icon: Award },
];

const closeTasksNav = [
  { title: "Calendar", url: "/close-tasks", icon: CalendarDays },
  { title: "Task List", url: "/close-tasks", icon: ListChecks },
  { title: "My Tasks", url: "/close-tasks", icon: ClipboardCheck },
  { title: "Control Checklist", url: "/close-tasks", icon: FileCheck },
  { title: "Dashboard", url: "/close-tasks", icon: LayoutDashboard },
  { title: "Setup", url: "/close-tasks", icon: Settings },
];

const productInfo = {
  "schedule-studio": { name: "Schedule Studio", icon: Calculator, description: "Cost Allocation" },
  "oneclose": { name: "OneClose", icon: Shield, description: "Close Management" },
  "close-tasks": { name: "Close Tasks", icon: ListChecks, description: "Task & Control" },
  "reconciliations": { name: "Reconciliations", icon: FileCheck, description: "Account Reconciliation" },
  "onecompliance": { name: "One Compliance", icon: Globe, description: "Entity Governance" },
  "nettool": { name: "NetTool", icon: FileSpreadsheet, description: "FS Disclosures" },
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

      <SidebarGroup>
        <SidebarGroupLabel>Document Registry</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {artifactNav.map((item) => {
              const isActive = location === item.url || 
                (item.url !== "/" && location.startsWith(item.url) && !location.includes("/health") || location === item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
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

  const { data: allAccounts = [], isLoading: accountsLoading, isError: accountsError } = useQuery<ReconciliationAccount[]>({
    queryKey: ["/api/reconciliations/accounts"],
    enabled: activeProduct === "reconciliations",
  });

  const getAccountsForCategory = (categoryKey: string) => {
    return allAccounts.filter(acc => acc.accountType === categoryKey);
  };

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
            {accountCategories.map((category) => {
              const groups = accountGroupsByType[category.key] || [];
              const categoryAccounts = getAccountsForCategory(category.key);
              const accountCount = categoryAccounts.length;
              
              return (
                <Collapsible key={category.key} className="group/category">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton data-testid={`nav-category-${category.key.toLowerCase()}`}>
                        <category.icon className="h-4 w-4" />
                        <span className="flex-1">{category.title}</span>
                        {accountsLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : accountCount > 0 && (
                          <Badge variant="secondary">
                            {accountCount}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/category:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {groups.map((groupKey) => {
                          const groupLabel = accountGroupLabels[groupKey] || groupKey;
                          const groupAccounts = allAccounts.filter(acc => acc.accountGroup === groupKey);
                          const groupUrl = `/reconciliations/group/${groupKey.toLowerCase().replace(/_/g, "-")}`;
                          const isGroupActive = location === groupUrl;
                          
                          return (
                            <SidebarMenuSubItem key={groupKey}>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={isGroupActive}
                                data-testid={`nav-group-${groupKey.toLowerCase()}`}
                              >
                                <Link href={groupUrl}>
                                  <span className="truncate">{groupLabel}</span>
                                  {groupAccounts.length > 0 && (
                                    <Badge variant="outline" className="ml-auto">
                                      {groupAccounts.length}
                                    </Badge>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );

  const renderOneCompliance = () => (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {oneComplianceNav.map((item) => {
              const isActive = location === item.url || 
                (item.url !== "/compliance" && location.startsWith(item.url));
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    data-testid={`nav-compliance-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
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
        <SidebarGroupLabel>Equity Tracker</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {equityTrackerNav.map((item) => {
              const isActive = location === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    data-testid={`nav-equity-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
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
        <SidebarGroupLabel>Startup Equity</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {startupEquityNav.map((item) => {
              const isActive = location === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    data-testid={`nav-startup-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
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
    </>
  );

  // Financial Statements section
  const financialStatementsNav = [
    { title: "Company Profile", url: "/nettool/fs/company-profile", icon: Building2 },
    { title: "Auditor's Opinion", url: "/nettool/fs/auditor-opinion", icon: FileCheck },
    { title: "Balance Sheet", url: "/nettool/fs/balance-sheet", icon: Scale },
    { title: "Income Statement", url: "/nettool/fs/income-statement", icon: TrendingUp },
    { title: "Comprehensive Income", url: "/nettool/fs/comprehensive-income", icon: Activity },
    { title: "Changes in Equity", url: "/nettool/fs/equity-statement", icon: Users },
    { title: "Cash Flow Statement", url: "/nettool/fs/cash-flow", icon: ArrowDownUp },
  ];
  
  // Working Papers & Data section
  const workingPapersNav = [
    { title: "Templates", url: "/nettool/templates", icon: FolderOpen },
    { title: "TB Import", url: "/tb-import", icon: Upload },
    { title: "Master Mapping", url: "/master-mapping", icon: GitBranch },
    { title: "TB Adjustments", url: "/nettool/tb-adjustments-workspace", icon: Edit3 },
    { title: "Final TB", url: "/nettool/fs/trial-balance", icon: Calculator },
    { title: "Working Papers", url: "/nettool/working-papers", icon: Table2 },
    { title: "Disclosures", url: "/nettool/disclosures", icon: FileText },
    { title: "Schedules", url: "/nettool/schedules", icon: FileSpreadsheet },
    { title: "Narratives", url: "/nettool/narratives", icon: BookOpen },
  ];

  // Notes & Policies section
  const notesPoliciesNav = [
    { title: "Basis of Preparation", url: "/nettool/notes/basis-of-preparation", icon: FileText },
    { title: "Accounting Policies", url: "/nettool/notes/accounting-policies", icon: BookOpen },
    { title: "MD&A", url: "/nettool/notes/mda", icon: Briefcase },
  ];
  
  // Review & Finalize section
  const reviewFinalizeNav = [
    { title: "Review", url: "/nettool/review", icon: ClipboardCheck },
    { title: "Audit View", url: "/nettool/audit", icon: Users },
    { title: "Exports", url: "/nettool/exports", icon: FileCheck },
  ];

  const [fsExpanded, setFsExpanded] = useState(location.startsWith("/nettool/fs") && !location.includes("trial-balance"));
  const [wpExpanded, setWpExpanded] = useState(
    location.includes("trial-balance") || 
    location.includes("tb-adjustments-workspace") ||
    location.includes("templates") ||
    location.includes("working-papers") || 
    location.includes("disclosures") || 
    location.includes("schedules") || 
    location.includes("narratives") ||
    location.includes("tb-import") ||
    location.includes("master-mapping")
  );
  const [notesExpanded, setNotesExpanded] = useState(location.startsWith("/nettool/notes"));
  const [reviewExpanded, setReviewExpanded] = useState(
    location.includes("review") || 
    location.includes("audit") || 
    location.includes("exports")
  );

  const renderNetTool = () => (
    <>
      {/* Dashboard */}
      <SidebarGroup>
        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={location === "/nettool"}
                data-testid="nav-nettool-dashboard"
              >
                <Link href="/nettool">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Financial Statements - Collapsible */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible open={fsExpanded} onOpenChange={setFsExpanded}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    data-testid="nav-nettool-financial-statements"
                    className="w-full"
                  >
                    <Scale className="h-4 w-4" />
                    <span className="flex-1 text-left">Financial Statements</span>
                    {fsExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {financialStatementsNav.map((item) => {
                      const isActive = location === item.url;
                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isActive}
                            data-testid={`nav-nettool-fs-${item.title.toLowerCase().replace(/['\s]+/g, '-')}`}
                          >
                            <Link href={item.url}>
                              <item.icon className="h-3.5 w-3.5" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Working Papers & Data - Collapsible */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible open={wpExpanded} onOpenChange={setWpExpanded}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    data-testid="nav-nettool-working-papers-section"
                    className="w-full"
                  >
                    <Table2 className="h-4 w-4" />
                    <span className="flex-1 text-left">Working Papers & Data</span>
                    {wpExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {workingPapersNav.map((item) => {
                      const isActive = location === item.url || 
                        (item.url !== "/nettool" && location.startsWith(item.url));
                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isActive}
                            data-testid={`nav-nettool-wp-${item.title.toLowerCase().replace(/['\s]+/g, '-')}`}
                          >
                            <Link href={item.url}>
                              <item.icon className="h-3.5 w-3.5" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Notes & Policies - Collapsible */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible open={notesExpanded} onOpenChange={setNotesExpanded}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    data-testid="nav-nettool-notes-section"
                    className="w-full"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="flex-1 text-left">Notes & Policies</span>
                    {notesExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {notesPoliciesNav.map((item) => {
                      const isActive = location === item.url || location.startsWith(item.url);
                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isActive}
                            data-testid={`nav-nettool-notes-${item.title.toLowerCase().replace(/[&'\s]+/g, '-')}`}
                          >
                            <Link href={item.url}>
                              <item.icon className="h-3.5 w-3.5" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Review & Finalize - Collapsible */}
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible open={reviewExpanded} onOpenChange={setReviewExpanded}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    data-testid="nav-nettool-review-section"
                    className="w-full"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    <span className="flex-1 text-left">Review & Finalize</span>
                    {reviewExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {reviewFinalizeNav.map((item) => {
                      const isActive = location === item.url || location.startsWith(item.url);
                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isActive}
                            data-testid={`nav-nettool-review-${item.title.toLowerCase().replace(/['\s]+/g, '-')}`}
                          >
                            <Link href={item.url}>
                              <item.icon className="h-3.5 w-3.5" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );

  const renderCloseTasks = () => (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {closeTasksNav.map((item) => {
              const isActive = location === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    data-testid={`nav-close-tasks-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
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
        {activeProduct === "close-tasks" && renderCloseTasks()}
        {activeProduct === "reconciliations" && renderReconciliations()}
        {activeProduct === "onecompliance" && renderOneCompliance()}
        {activeProduct === "nettool" && renderNetTool()}
        {!["schedule-studio", "oneclose", "close-tasks", "reconciliations", "onecompliance", "nettool"].includes(activeProduct) && renderComingSoon()}
        
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

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";
import { ProductProvider } from "@/contexts/product-context";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Landing from "@/pages/landing";
import ReconciliationsPage from "@/pages/reconciliations";
import PoliciesPage from "@/pages/policies";
import WalkthroughsPage from "@/pages/walkthroughs";
import ReportsPage from "@/pages/reports";
import AdminPage from "@/pages/admin";
import SchedulesList from "@/pages/schedules-list";
import ScheduleDetail from "@/pages/schedule-detail";
import CreateSchedule from "@/pages/create-schedule";
import PrepaidCalculator from "@/pages/prepaid-calculator";
import PrepaidsDashboard from "@/pages/prepaids-dashboard";
import PrepaidsCategory from "@/pages/prepaids-category";
import PrepaidsWorkspace from "@/pages/prepaids-workspace";
import FixedAssetsDashboard from "@/pages/fixed-assets-dashboard";
import FixedAssetsCategory from "@/pages/fixed-assets-category";
import FixedAssetsWorkspace from "@/pages/fixed-assets-workspace";
import AccrualsDashboard from "@/pages/accruals-dashboard";
import AccrualsCategory from "@/pages/accruals-category";
import AccrualsWorkspace from "@/pages/accruals-workspace";
import RevenueDashboard from "@/pages/revenue-dashboard";
import RevenueCategory from "@/pages/revenue-category";
import RevenueWorkspace from "@/pages/revenue-workspace";
import InvestmentIncomeDashboard from "@/pages/investment-income-dashboard";
import InvestmentIncomeCategory from "@/pages/investment-income-category";
import InvestmentIncomeWorkspace from "@/pages/investment-income-workspace";
import DebtDashboard from "@/pages/debt-dashboard";
import DebtCategoryPage from "@/pages/debt-category";
import DebtWorkspace from "@/pages/debt-workspace";
import CashDashboard from "@/pages/cash-dashboard";
import CashCategoryPage from "@/pages/cash-category";
import CashMovementDetailPage from "@/pages/cash-movement-detail";
import CashOpsExpensesPage from "@/pages/cash-ops-expenses";
import CashManualTaggingPage from "@/pages/cash-manual-tagging";
import CloseControlDashboard from "@/pages/close-control-dashboard";
import CloseControlSchedulePage from "@/pages/close-control-schedule";
import CloseControlTasklistPage from "@/pages/close-control-tasklist";
import CloseControlTemplatesPage from "@/pages/close-control-templates";
import CloseControlTemplateEditorPage from "@/pages/close-control-template-editor";
import CloseControlKanbanPage from "@/pages/close-control-kanban";
import CloseControlCalendarPage from "@/pages/close-control-calendar";
import CloseControlNewPage from "@/pages/close-control-new";
import CloseControlCertificationPage from "@/pages/close-control-certification";
import MyTasksPage from "@/pages/my-tasks";
import ReconciliationTemplatesPage from "@/pages/reconciliation-templates";
import ReconciliationWorkspacePage from "@/pages/reconciliation-workspace";
import OneCompliancePage from "@/pages/one-compliance";
import CloseTasksPage from "@/pages/close-tasks";
import NetToolPage from "@/pages/nettool";
import MasterMappingPage from "@/pages/master-mapping";
import TBImportPage from "@/pages/tb-import";
import ArtifactRegistryPage from "@/pages/artifact-registry";
import ArtifactHealthDashboard from "@/pages/artifact-health-dashboard";
import ScheduleStudioGrid from "@/pages/schedule-studio-grid";
import ReconciliationGrid from "@/pages/reconciliation-grid";
import ReconciliationAccountGroupPage from "@/pages/reconciliation-account-group";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/schedule-studio" component={ScheduleStudioGrid} />
      <Route path="/reconciliations" component={ReconciliationGrid} />
      <Route path="/reconciliations/group/:group" component={ReconciliationAccountGroupPage} />
      <Route path="/reconciliations/legacy" component={ReconciliationsPage} />
      <Route path="/reconciliations/templates" component={ReconciliationTemplatesPage} />
      <Route path="/reconciliations/workspace/:id" component={ReconciliationWorkspacePage} />
      <Route path="/compliance" component={OneCompliancePage} />
      <Route path="/compliance/:section" component={OneCompliancePage} />
      <Route path="/policies" component={PoliciesPage} />
      <Route path="/walkthroughs" component={WalkthroughsPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/close-tasks" component={CloseTasksPage} />
      <Route path="/nettool" component={NetToolPage} />
      <Route path="/nettool/fs/:fsSection" component={NetToolPage} />
      <Route path="/nettool/notes/:notesSection" component={NetToolPage} />
      <Route path="/nettool/:section" component={NetToolPage} />
      <Route path="/master-mapping" component={MasterMappingPage} />
      <Route path="/tb-import" component={TBImportPage} />
      <Route path="/artifacts" component={ArtifactRegistryPage} />
      <Route path="/artifacts/health" component={ArtifactHealthDashboard} />
      <Route path="/close-control" component={CloseControlDashboard} />
      <Route path="/close-control/templates" component={CloseControlTemplatesPage} />
      <Route path="/close-control/templates/:id" component={CloseControlTemplateEditorPage} />
      <Route path="/close-control/schedule/:id" component={CloseControlSchedulePage} />
      <Route path="/close-control/tasklist/:id" component={CloseControlTasklistPage} />
      <Route path="/close-control/tasklist/:id/kanban" component={CloseControlKanbanPage} />
      <Route path="/close-control/calendar" component={CloseControlCalendarPage} />
      <Route path="/close-control/new" component={CloseControlNewPage} />
      <Route path="/close-control/certification" component={CloseControlCertificationPage} />
      <Route path="/my-tasks" component={MyTasksPage} />
      <Route path="/schedules" component={SchedulesList} />
      <Route path="/schedules/new" component={CreateSchedule} />
      <Route path="/schedules/:id" component={ScheduleDetail} />
      <Route path="/prepaid-calculator" component={PrepaidCalculator} />
      <Route path="/prepaids" component={PrepaidsDashboard} />
      <Route path="/prepaids/:category" component={PrepaidsCategory} />
      <Route path="/prepaids/:category/schedule/:id" component={PrepaidsWorkspace} />
      <Route path="/fixed-assets" component={FixedAssetsDashboard} />
      <Route path="/fixed-assets/:category" component={FixedAssetsCategory} />
      <Route path="/fixed-assets/:category/asset/:id" component={FixedAssetsWorkspace} />
      <Route path="/accruals" component={AccrualsDashboard} />
      <Route path="/accruals/:category" component={AccrualsCategory} />
      <Route path="/accruals/:category/schedule/:id" component={AccrualsWorkspace} />
      <Route path="/revenue" component={RevenueDashboard} />
      <Route path="/revenue/:category" component={RevenueCategory} />
      <Route path="/revenue/:category/contract/:id" component={RevenueWorkspace} />
      <Route path="/investment-income" component={InvestmentIncomeDashboard} />
      <Route path="/investment-income/:category" component={InvestmentIncomeCategory} />
      <Route path="/investment-income/:category/investment/:id" component={InvestmentIncomeWorkspace} />
      <Route path="/debt" component={DebtDashboard} />
      <Route path="/debt/:category" component={DebtCategoryPage} />
      <Route path="/debt/:category/instrument/:id" component={DebtWorkspace} />
      <Route path="/cash" component={CashDashboard} />
      <Route path="/cash/ops-expenses" component={CashOpsExpensesPage} />
      <Route path="/cash/ops-expenses/movement/:id" component={CashMovementDetailPage} />
      <Route path="/cash/manual-tagging" component={CashManualTaggingPage} />
      <Route path="/cash/:category" component={CashCategoryPage} />
      <Route path="/cash/:category/movement/:id" component={CashMovementDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <ProductProvider>
      <div className="flex flex-col h-screen w-full">
        <TopNav />
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex flex-1 w-full overflow-hidden">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between gap-4 px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </ProductProvider>
  );
}

function AppContent() {
  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="schedule-engine-theme">
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

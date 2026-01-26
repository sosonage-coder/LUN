import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  TrendingUp, 
  Calculator, 
  FileText, 
  Shield, 
  Clock, 
  BarChart3,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Lunari</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" asChild data-testid="button-login">
              <a href="/api/login">Sign In</a>
            </Button>
            <Button asChild data-testid="button-get-started">
              <a href="/api/login">Get Started</a>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-6">
            Financial Close Management,{" "}
            <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Lunari provides deterministic cost allocation, audit-ready financial schedules, 
            and comprehensive close management for modern finance teams.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" asChild data-testid="button-hero-start">
              <a href="/api/login">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-hero-demo">
              <a href="/api/login">View Demo</a>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free forever plan
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Schedule Studio</h3>
              <p className="text-muted-foreground text-sm">
                Manage prepaid expenses, fixed assets, accruals, revenue recognition, 
                and debt amortization with deterministic allocation algorithms.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">OneClose</h3>
              <p className="text-muted-foreground text-sm">
                Streamline your financial close with task management, certification workflows, 
                and segregation of duties controls.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Reconciliations</h3>
              <p className="text-muted-foreground text-sm">
                Template-driven balance sheet reconciliations with multi-level 
                certification and tie-out validation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">NetTool</h3>
              <p className="text-muted-foreground text-sm">
                Financial statement notes, disclosure management, and working papers 
                with TB linking and rollforward automation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">One Compliance</h3>
              <p className="text-muted-foreground text-sm">
                Entity governance, regulatory filing tracking, board meeting management, 
                and startup equity administration.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Cash Scheduler</h3>
              <p className="text-muted-foreground text-sm">
                Track cash flows, movement patterns, and reconcile bank statements 
                with automated categorization.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Ready to streamline your financial close?</h2>
          <p className="text-muted-foreground mb-6">
            Join finance teams who trust Lunari for accurate, auditable financial management.
          </p>
          <Button size="lg" asChild data-testid="button-cta-start">
            <a href="/api/login">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Lunari. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

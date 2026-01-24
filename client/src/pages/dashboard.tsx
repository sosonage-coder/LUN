import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { ScheduleTypeBadge } from "@/components/schedule-type-badge";
import { CurrencyDisplay } from "@/components/currency-display";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Plus,
  ArrowRight,
  Receipt,
  Landmark
} from "lucide-react";
import type { ScheduleMaster, ScheduleSummary } from "@shared/schema";

export default function Dashboard() {
  const { data: schedules, isLoading: schedulesLoading } = useQuery<ScheduleMaster[]>({
    queryKey: ["/api/schedules"],
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<ScheduleSummary>({
    queryKey: ["/api/schedules/summary"],
  });

  const recentSchedules = schedules?.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6" data-testid="dashboard-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Next Engine Overview
          </p>
        </div>
        <Link href="/schedules/new">
          <Button data-testid="button-new-schedule">
            <Plus className="h-4 w-4 mr-2" />
            New Schedule
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Total Schedules"
              value={summary?.totalSchedules || 0}
              icon={Calendar}
            />
            <StatCard
              title="Active Schedules"
              value={summary?.activeSchedules || 0}
              icon={TrendingUp}
            />
            <StatCard
              title="Prepaid Expenses"
              value={summary?.schedulesByType?.PREPAID || 0}
              icon={Receipt}
            />
            <StatCard
              title="Fixed Assets"
              value={summary?.schedulesByType?.FIXED_ASSET || 0}
              icon={Landmark}
            />
          </>
        )}
      </div>

      {/* Core Principles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Core Engine Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
              <DollarSign className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Reporting Currency is Truth</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All calculations occur in reporting currency
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Time Drives Allocation</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Progress by period, not by FX movements
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
              <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">FX is Derived</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  FX = reporting amount / local amount
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
              <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Append-Only Events</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All changes are recorded, never deleted
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Schedules */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">Recent Schedules</CardTitle>
          {recentSchedules.length > 0 && (
            <Link href="/schedules">
              <Button variant="ghost" size="sm" data-testid="button-view-all-schedules">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {schedulesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-40 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : recentSchedules.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No schedules yet"
              description="Create your first schedule to start allocating costs over time."
              action={{
                label: "Create Schedule",
                onClick: () => window.location.href = "/schedules/new",
              }}
            />
          ) : (
            <div className="space-y-2">
              {recentSchedules.map((schedule) => (
                <Link key={schedule.scheduleId} href={`/schedules/${schedule.scheduleId}`}>
                  <div 
                    className="flex items-center gap-4 p-3 rounded-md hover-elevate cursor-pointer"
                    data-testid={`schedule-row-${schedule.scheduleId}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      {schedule.scheduleType === "PREPAID" ? (
                        <Receipt className="h-5 w-5 text-primary" />
                      ) : (
                        <Landmark className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {schedule.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {schedule.entityId} • {schedule.startDate} to {schedule.endDate || "Ongoing"}
                      </p>
                    </div>
                    <div className="text-right">
                      <CurrencyDisplay 
                        amount={schedule.totalAmountReportingInitial}
                        currency={schedule.reportingCurrency}
                        className="text-sm font-medium"
                      />
                    </div>
                    <ScheduleTypeBadge type={schedule.scheduleType} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

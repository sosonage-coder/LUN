import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScheduleTypeBadge } from "@/components/schedule-type-badge";
import { CurrencyDisplay } from "@/components/currency-display";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Calendar,
  ArrowUpDown,
  Eye
} from "lucide-react";
import { useState, useMemo } from "react";
import type { ScheduleMaster, ScheduleType } from "@shared/schema";

export default function SchedulesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ScheduleType | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"created" | "amount" | "start">("created");

  const { data: schedules, isLoading } = useQuery<ScheduleMaster[]>({
    queryKey: ["/api/schedules"],
  });

  const filteredSchedules = useMemo(() => {
    if (!schedules) return [];
    
    let result = [...schedules];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.description.toLowerCase().includes(query) ||
        s.scheduleId.toLowerCase().includes(query) ||
        s.entityId.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== "ALL") {
      result = result.filter(s => s.scheduleType === typeFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.totalAmountReportingInitial - a.totalAmountReportingInitial;
        case "start":
          return a.startDate.localeCompare(b.startDate);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [schedules, searchQuery, typeFilter, sortBy]);

  return (
    <div className="p-6 space-y-6" data-testid="schedules-list-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Schedules</h1>
          <p className="text-muted-foreground mt-1">
            Manage cost allocation schedules
          </p>
        </div>
        <Link href="/schedules/new">
          <Button data-testid="button-new-schedule">
            <Plus className="h-4 w-4 mr-2" />
            New Schedule
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schedules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-schedules"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ScheduleType | "ALL")}>
          <SelectTrigger className="w-40" data-testid="select-type-filter">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="PREPAID">Prepaid</SelectItem>
            <SelectItem value="FIXED_ASSET">Fixed Asset</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
          <SelectTrigger className="w-40" data-testid="select-sort">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="start">Start Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="p-6">
              {schedules?.length === 0 ? (
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
                <EmptyState
                  icon={Search}
                  title="No matches found"
                  description="Try adjusting your search or filters."
                />
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Periods</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow 
                    key={schedule.scheduleId}
                    data-testid={`schedule-row-${schedule.scheduleId}`}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{schedule.description}</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {schedule.scheduleId.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ScheduleTypeBadge type={schedule.scheduleType} />
                    </TableCell>
                    <TableCell className="text-sm">{schedule.entityId}</TableCell>
                    <TableCell className="text-sm font-mono">
                      {schedule.startDate} to {schedule.endDate || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <CurrencyDisplay 
                        amount={schedule.totalAmountReportingInitial}
                        currency={schedule.reportingCurrency}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {schedule.recognitionPeriods}
                    </TableCell>
                    <TableCell>
                      <Link href={`/schedules/${schedule.scheduleId}`}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          data-testid={`button-view-${schedule.scheduleId}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

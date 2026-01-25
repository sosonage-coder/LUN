import { useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  FileText,
  FileSpreadsheet,
  BookOpen,
  ClipboardCheck,
  Users,
  Download,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Lock,
  Unlock,
  Eye,
  Edit3,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileDown,
  ChevronRight,
  Settings,
  Trash2,
  MoreHorizontal,
  PlusCircle,
  MinusCircle,
  LayoutDashboard,
} from "lucide-react";
import {
  sampleNotes,
  sampleSchedules,
  sampleNarratives,
  sampleTemplates,
  sampleReviews,
  samplePeriods,
  sampleStatementLines,
  calculateDashboardKPIs,
  formatCurrency,
  getLayoutTypeLabel,
  getStatusColor,
  getFrameworkLabel,
  sampleCompanyProfile,
  sampleAuditorOpinion,
  sampleBalanceSheet,
  sampleIncomeStatement,
  sampleEquityStatement,
  sampleCashFlowStatement,
  sampleTBWorkspace,
  sampleGLAccounts,
  fsCategoryLabels,
  sampleTBFootnotes,
  sampleSplitDeclarations,
  sampleWorkingPapers,
  sampleComprehensiveIncome,
  sampleBasisOfPreparation,
  sampleAccountingPolicies,
  sampleMDA,
  sampleTBAdjustmentsWorkspace,
  sampleFinalTBView,
} from "@/lib/nettool-data";
import type { DisclosureNote, DisclosureSchedule, NarrativeBlock, DisclosureTemplate, ScheduleLayoutType, FSLineItem, TBLine, TBColumn, FSCategory, TBFootnote, SplitDeclaration, SplitComponent, WorkingPaper, WorkingPaperRow, WorkingPaperColumn, AccountingPolicy, MDASection, TBAdjustmentAccountLine, TBAdjustmentEntry, TBAdjustmentColumn, FinalTBLine } from "@shared/schema";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EyeOff } from "lucide-react";

export default function NetToolPage() {
  const [, params] = useRoute("/nettool/:section");
  const [, fsParams] = useRoute("/nettool/fs/:fsSection");
  const [, notesParams] = useRoute("/nettool/notes/:notesSection");
  const section = fsParams?.fsSection 
    ? `fs-${fsParams.fsSection}` 
    : notesParams?.notesSection 
      ? `notes-${notesParams.notesSection}` 
      : (params?.section || "dashboard");
  
  const [selectedNote, setSelectedNote] = useState<DisclosureNote | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<DisclosureSchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateNoteDialog, setShowCreateNoteDialog] = useState(false);
  const [showCreateScheduleDialog, setShowCreateScheduleDialog] = useState(false);
  
  // Trial Balance state
  const [tbLines, setTbLines] = useState<TBLine[]>(sampleTBWorkspace.lines);
  const [tbColumns, setTbColumns] = useState<TBColumn[]>(sampleTBWorkspace.columns);
  const [tbFootnotes] = useState<TBFootnote[]>(sampleTBWorkspace.footnotes);
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
  const [showAddRowDialog, setShowAddRowDialog] = useState(false);
  const [newColumnLabel, setNewColumnLabel] = useState("");
  const [newRowAccountCode, setNewRowAccountCode] = useState("");
  const [newRowAccountName, setNewRowAccountName] = useState("");
  const [editingCell, setEditingCell] = useState<{ lineId: string; columnId: string } | null>(null);
  const [editingFsCategory, setEditingFsCategory] = useState<string | null>(null);
  const [editingFootnotes, setEditingFootnotes] = useState<string | null>(null);
  
  // Split Declaration state
  const [selectedLineForSplit, setSelectedLineForSplit] = useState<TBLine | null>(null);
  const [splitDeclarations, setSplitDeclarations] = useState<SplitDeclaration[]>(sampleSplitDeclarations);
  
  // Working Papers state
  const [workingPapers, setWorkingPapers] = useState<WorkingPaper[]>(sampleWorkingPapers);
  const [selectedWorkingPaper, setSelectedWorkingPaper] = useState<WorkingPaper | null>(null);
  
  // TB Adjustments Workspace state
  const [adjLines, setAdjLines] = useState<TBAdjustmentAccountLine[]>(sampleTBAdjustmentsWorkspace.lines);
  const [adjRJEColumns] = useState<TBAdjustmentColumn[]>(sampleTBAdjustmentsWorkspace.rjeColumns);
  const [adjAJEColumns] = useState<TBAdjustmentColumn[]>(sampleTBAdjustmentsWorkspace.ajeColumns);
  const [adjEntries] = useState<TBAdjustmentEntry[]>(sampleTBAdjustmentsWorkspace.entries);
  const [editingAdjCell, setEditingAdjCell] = useState<{ lineId: string; columnId: string } | null>(null);
  const [editingAdjFsCategory, setEditingAdjFsCategory] = useState<string | null>(null);
  const [showAddAdjEntryDialog, setShowAddAdjEntryDialog] = useState(false);
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState<TBAdjustmentEntry | null>(null);
  
  // Final TB View state
  const [finalTBLines] = useState<FinalTBLine[]>(sampleFinalTBView.lines);
  
  // Print/Export Engine state
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: "pdf" as "pdf" | "excel" | "word",
    includeNotes: true,
    includeSchedules: true,
    includeWorkingPapers: false,
    lockPeriod: false,
    watermark: false,
    selectedStatements: ["balance-sheet", "income-statement", "equity-statement", "cash-flow"] as string[]
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const kpis = calculateDashboardKPIs(sampleNotes, sampleSchedules, sampleNarratives, sampleReviews);
  const activePeriod = samplePeriods.find(p => p.state !== "FINAL") || samplePeriods[0];
  
  const filteredNotes = sampleNotes.filter(note => {
    const matchesSearch = note.noteTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.noteNumber.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || note.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScheduleForNote = (noteId: string) => {
    return sampleSchedules.filter(s => s.noteId === noteId);
  };

  const getNarrativesForNote = (noteId: string) => {
    return sampleNarratives.filter(n => n.noteId === noteId);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-nettool-title">Disclosure Workspace</h1>
          <p className="text-muted-foreground">Notes to Financial Statements</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Clock className="h-3 w-3 mr-1" />
            {activePeriod.periodLabel}
          </Badge>
          <Badge className={getStatusColor(activePeriod.state)}>
            {activePeriod.state.replace("_", " ")}
          </Badge>
          <Button onClick={() => setShowExportDialog(true)} data-testid="button-generate-fs">
            <FileDown className="h-4 w-4 mr-2" />
            Generate Financials
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-kpi-total-notes">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalNotes}</div>
            <p className="text-xs text-muted-foreground">
              {kpis.publishedNotes} published
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-kpi-schedules">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Schedules</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalSchedules}</div>
            <p className="text-xs text-muted-foreground">
              Across all notes
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-kpi-narratives">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Narratives</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalNarratives}</div>
            <p className="text-xs text-muted-foreground">
              MD&A blocks
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-kpi-pending-reviews">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>Notes by workflow status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Draft</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{kpis.draftNotes}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ width: `${(kpis.draftNotes / kpis.totalNotes) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Under Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{kpis.underReviewNotes}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${(kpis.underReviewNotes / kpis.totalNotes) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{kpis.approvedNotes}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${(kpis.approvedNotes / kpis.totalNotes) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Published</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{kpis.publishedNotes}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500" 
                      style={{ width: `${(kpis.publishedNotes / kpis.totalNotes) * 100}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates to disclosures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleNotes.slice(0, 4).map((note) => (
                <div key={note.noteId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {note.noteNumber}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{note.noteTitle}</p>
                      <p className="text-xs text-muted-foreground">{note.owner}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(note.status)} variant="secondary">
                    {note.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setShowCreateNoteDialog(true)}>
              <Plus className="h-5 w-5" />
              <span>Create New Note</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <FileDown className="h-5 w-5" />
              <span>Export All Notes</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Settings className="h-5 w-5" />
              <span>Manage Templates</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDisclosures = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Disclosure Notes</h1>
          <p className="text-muted-foreground">Manage notes to financial statements</p>
        </div>
        <Button onClick={() => setShowCreateNoteDialog(true)} data-testid="button-create-note">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-notes"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" data-testid="select-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredNotes.map((note) => {
          const schedules = getScheduleForNote(note.noteId);
          const narratives = getNarrativesForNote(note.noteId);
          return (
            <Card 
              key={note.noteId} 
              className="hover-elevate cursor-pointer"
              onClick={() => setSelectedNote(note)}
              data-testid={`card-note-${note.noteNumber}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary text-lg font-semibold">
                      {note.noteNumber}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{note.noteTitle}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getFrameworkLabel(note.framework)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Owner: {note.owner}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileSpreadsheet className="h-3 w-3" />
                          {schedules.length} schedule{schedules.length !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {narratives.length} narrative{narratives.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(note.status)}>
                      {note.status.replace("_", " ")}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedNote && (
        <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                  {selectedNote.noteNumber}
                </div>
                <div>
                  <DialogTitle>{selectedNote.noteTitle}</DialogTitle>
                  <DialogDescription>
                    {getFrameworkLabel(selectedNote.framework)} | Owner: {selectedNote.owner}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4">
              <Tabs defaultValue="schedules" className="w-full">
                <TabsList>
                  <TabsTrigger value="schedules">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Schedules
                  </TabsTrigger>
                  <TabsTrigger value="narratives">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Narratives
                  </TabsTrigger>
                  <TabsTrigger value="links">
                    <FileText className="h-4 w-4 mr-2" />
                    Statement Links
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="schedules" className="space-y-4 mt-4">
                  {getScheduleForNote(selectedNote.noteId).map((schedule) => (
                    <Card key={schedule.scheduleId}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{schedule.scheduleTitle}</CardTitle>
                            <CardDescription>{getLayoutTypeLabel(schedule.layoutType)}</CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSchedule(schedule);
                            }}
                          >
                            <Edit3 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-40">Row</TableHead>
                                {schedule.columns.filter(c => !c.hidden).map((col) => (
                                  <TableHead 
                                    key={col.columnId} 
                                    className="text-right"
                                    style={{ width: col.widthPx }}
                                  >
                                    <div className="flex items-center justify-end gap-1">
                                      {col.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                                      {col.label}
                                    </div>
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {schedule.rows.filter(r => !r.hidden).map((row) => (
                                <TableRow 
                                  key={row.rowId}
                                  className={row.role === "TOTAL" ? "font-semibold bg-muted/50" : ""}
                                >
                                  <TableCell className="font-medium">
                                    {row.locked && <Lock className="h-3 w-3 inline mr-1 text-muted-foreground" />}
                                    {row.label}
                                  </TableCell>
                                  {schedule.columns.filter(c => !c.hidden).map((col) => {
                                    const value = schedule.cellValues[row.rowId]?.[col.columnId];
                                    return (
                                      <TableCell key={col.columnId} className="text-right tabular-nums">
                                        {typeof value === "number" ? formatCurrency(value) : value || "-"}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setShowCreateScheduleDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Schedule
                  </Button>
                </TabsContent>
                <TabsContent value="narratives" className="space-y-4 mt-4">
                  {getNarrativesForNote(selectedNote.noteId).map((narrative) => (
                    <Card key={narrative.narrativeId}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(narrative.status)} variant="secondary">
                            {narrative.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {narrative.owner}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{narrative.content}</p>
                        {narrative.linkedScheduleIds.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-muted-foreground">
                              Linked to {narrative.linkedScheduleIds.length} schedule(s)
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Narrative
                  </Button>
                </TabsContent>
                <TabsContent value="links" className="mt-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {selectedNote.linkedStatementLines.map((lineId) => {
                          const line = sampleStatementLines.find(l => l.lineId === lineId);
                          return line ? (
                            <div key={lineId} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{line.statementType.replace("_", " ")}</Badge>
                                <span className="text-sm">{line.lineLabel}</span>
                              </div>
                              <span className="text-sm font-medium tabular-nums">
                                {formatCurrency(line.amount)}
                              </span>
                            </div>
                          ) : null;
                        })}
                        {selectedNote.linkedStatementLines.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No statement lines linked
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  const renderSchedules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Schedules</h1>
          <p className="text-muted-foreground">Disclosure schedule grids</p>
        </div>
        <Button onClick={() => setShowCreateScheduleDialog(true)} data-testid="button-create-schedule">
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </Button>
      </div>

      <div className="grid gap-4">
        {sampleSchedules.map((schedule) => {
          const note = sampleNotes.find(n => n.noteId === schedule.noteId);
          return (
            <Card 
              key={schedule.scheduleId}
              className="hover-elevate cursor-pointer"
              onClick={() => setSelectedSchedule(schedule)}
              data-testid={`card-schedule-${schedule.scheduleId}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{schedule.scheduleTitle}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Note {note?.noteNumber}: {note?.noteTitle}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <Badge variant="outline">{getLayoutTypeLabel(schedule.layoutType)}</Badge>
                      <span>{schedule.rows.length} rows</span>
                      <span>{schedule.columns.length} columns</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSchedule && (
        <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{selectedSchedule.scheduleTitle}</DialogTitle>
                  <DialogDescription>
                    {getLayoutTypeLabel(selectedSchedule.layoutType)}
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Row
                  </Button>
                  <Button variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Column
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="flex-1">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48 sticky left-0 bg-background">Description</TableHead>
                      {selectedSchedule.columns.filter(c => !c.hidden).map((col) => (
                        <TableHead 
                          key={col.columnId} 
                          className="text-right min-w-[100px]"
                        >
                          <div className="flex items-center justify-end gap-1">
                            {col.role === "SYSTEM" && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>System column (locked)</TooltipContent>
                              </Tooltip>
                            )}
                            {col.label}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSchedule.textBlocks.filter(tb => tb.position === 0).map((tb) => (
                      <TableRow key={tb.textBlockId} className="bg-muted/30">
                        <TableCell 
                          colSpan={selectedSchedule.columns.filter(c => !c.hidden).length + 1}
                          className="font-semibold text-xs uppercase tracking-wide text-muted-foreground"
                        >
                          {tb.content}
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedSchedule.rows.filter(r => !r.hidden).map((row) => (
                      <TableRow 
                        key={row.rowId}
                        className={row.role === "TOTAL" ? "font-semibold bg-muted/50" : ""}
                      >
                        <TableCell className="font-medium sticky left-0 bg-background">
                          <div className="flex items-center gap-2">
                            {row.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                            {row.label}
                          </div>
                        </TableCell>
                        {selectedSchedule.columns.filter(c => !c.hidden).map((col) => {
                          const value = selectedSchedule.cellValues[row.rowId]?.[col.columnId];
                          const isEditable = !col.locked && !row.locked && row.role !== "TOTAL";
                          return (
                            <TableCell 
                              key={col.columnId} 
                              className={`text-right tabular-nums ${isEditable ? "cursor-text hover:bg-muted/50" : "bg-muted/20"}`}
                            >
                              {typeof value === "number" ? formatCurrency(value) : value || "-"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
            <DialogFooter className="flex-shrink-0 border-t pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>System columns and total rows are locked</span>
              </div>
              <div className="flex-1" />
              <Button variant="outline" onClick={() => setSelectedSchedule(null)}>Close</Button>
              <Button>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  const renderNarratives = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Narratives</h1>
          <p className="text-muted-foreground">MD&A and disclosure text blocks</p>
        </div>
        <Button data-testid="button-create-narrative">
          <Plus className="h-4 w-4 mr-2" />
          New Narrative
        </Button>
      </div>

      <div className="grid gap-4">
        {sampleNarratives.map((narrative) => {
          const note = sampleNotes.find(n => n.noteId === narrative.noteId);
          return (
            <Card key={narrative.narrativeId} data-testid={`card-narrative-${narrative.narrativeId}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Note {note?.noteNumber}</Badge>
                    <span className="font-medium">{note?.noteTitle}</span>
                  </div>
                  <Badge className={getStatusColor(narrative.status)}>
                    {narrative.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{narrative.content}</p>
                <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>Owner: {narrative.owner}</span>
                  <span>
                    Linked to {narrative.linkedScheduleIds.length} schedule(s)
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Review</h1>
          <p className="text-muted-foreground">Approval workflow and sign-off</p>
        </div>
      </div>

      <div className="grid gap-4">
        {sampleReviews.map((review) => {
          const target = review.targetType === "NOTE" 
            ? sampleNotes.find(n => n.noteId === review.targetId)
            : review.targetType === "SCHEDULE"
            ? sampleSchedules.find(s => s.scheduleId === review.targetId)
            : sampleNarratives.find(n => n.narrativeId === review.targetId);
          
          return (
            <Card key={review.reviewId} data-testid={`card-review-${review.reviewId}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{review.targetType}</Badge>
                      <span className="font-medium">
                        {review.targetType === "NOTE" && (target as DisclosureNote)?.noteTitle}
                        {review.targetType === "SCHEDULE" && (target as DisclosureSchedule)?.scheduleTitle}
                        {review.targetType === "NARRATIVE" && "Narrative Block"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reviewer: {review.reviewer}
                    </p>
                    {review.comments.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {review.comments.length} comment(s)
                        {review.comments.filter(c => c.isResolved).length > 0 && (
                          <span className="text-green-600">
                            ({review.comments.filter(c => c.isResolved).length} resolved)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(review.approvalStatus)}>
                      {review.approvalStatus}
                    </Badge>
                    {review.approvalStatus === "PENDING" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderAuditView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Audit View</h1>
          <p className="text-muted-foreground">Read-only access for auditors</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Eye className="h-3 w-3 mr-1" />
          View Only
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Disclosure Notes</CardTitle>
          <CardDescription>Complete list of notes for audit review</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Note #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Schedules</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleNotes.map((note) => (
                <TableRow key={note.noteId}>
                  <TableCell className="font-medium">{note.noteNumber}</TableCell>
                  <TableCell>{note.noteTitle}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getFrameworkLabel(note.framework)}</Badge>
                  </TableCell>
                  <TableCell>{note.owner}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(note.status)}>
                      {note.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{note.scheduleIds.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderExports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Exports</h1>
          <p className="text-muted-foreground">Generate publishable outputs</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>PDF Export</CardTitle>
            <CardDescription>Export notes as formatted PDF document</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Notes</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose notes to export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
                  <SelectItem value="published">Published Only</SelectItem>
                  <SelectItem value="approved">Approved & Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Word Export</CardTitle>
            <CardDescription>Export notes as editable Word document</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Notes</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose notes to export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
                  <SelectItem value="published">Published Only</SelectItem>
                  <SelectItem value="approved">Approved & Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export to Word
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
          <CardDescription>Recent document exports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileDown className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No exports yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== FINANCIAL STATEMENTS SECTIONS =====

  const renderCompanyProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-fs-company-profile-title">Company Profile</h1>
          <p className="text-muted-foreground">Entity information and context</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Lock className="h-3 w-3 mr-1" />
          Read-Only
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Legal Entity Information</CardTitle>
          <CardDescription>Front page of financial statements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Legal Entity Name</label>
                <p className="text-lg font-semibold" data-testid="text-entity-name">{sampleCompanyProfile.legalEntityName}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Registered Address</label>
                <p className="text-sm" data-testid="text-address">{sampleCompanyProfile.registeredAddress}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Jurisdiction</label>
                <p className="text-sm" data-testid="text-jurisdiction">{sampleCompanyProfile.jurisdiction}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Entity Type</label>
                <p className="text-sm" data-testid="text-entity-type">{sampleCompanyProfile.entityType}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Reporting Period</label>
                <p className="text-sm" data-testid="text-period">{sampleCompanyProfile.reportingPeriod}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Period Dates</label>
                <p className="text-sm" data-testid="text-dates">{sampleCompanyProfile.periodStartDate} to {sampleCompanyProfile.periodEndDate}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Functional Currency</label>
                <p className="text-sm">{sampleCompanyProfile.functionalCurrency}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Presentation Currency</label>
                <p className="text-sm">{sampleCompanyProfile.presentationCurrency}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Framework</label>
                <Badge variant="outline">{sampleCompanyProfile.framework === "US_GAAP" ? "US GAAP" : "IFRS"}</Badge>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase">Consolidation Status</label>
                <Badge>{sampleCompanyProfile.consolidationStatus}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAuditorOpinion = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-fs-auditor-opinion-title">Auditor's Opinion</h1>
          <p className="text-muted-foreground">Signed audit opinion for the financial statements</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {sampleAuditorOpinion.isLocked ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
          {sampleAuditorOpinion.isLocked ? "Locked" : "Draft"}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Auditor</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold" data-testid="text-auditor-name">{sampleAuditorOpinion.auditorName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Opinion Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={sampleAuditorOpinion.opinionType === "UNQUALIFIED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800"} data-testid="badge-opinion-type">
              {sampleAuditorOpinion.opinionType}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Opinion Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold" data-testid="text-opinion-date">{sampleAuditorOpinion.opinionDate}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opinion Text</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed" data-testid="text-opinion-content">
            {sampleAuditorOpinion.opinionText}
          </div>
        </CardContent>
      </Card>

      {sampleAuditorOpinion.signedDocumentName && (
        <Card>
          <CardHeader>
            <CardTitle>Signed Document</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{sampleAuditorOpinion.signedDocumentName}</p>
                <p className="text-xs text-muted-foreground">Uploaded signed audit opinion</p>
              </div>
              <Button variant="outline" size="sm" data-testid="button-download-opinion">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderFSLineItems = (items: FSLineItem[], showNoteRef: boolean = true) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40%]">Line Item</TableHead>
          {showNoteRef && <TableHead className="w-[10%] text-center">Note</TableHead>}
          <TableHead className="text-right">{sampleBalanceSheet.currentPeriodLabel}</TableHead>
          <TableHead className="text-right">{sampleBalanceSheet.priorPeriodLabel}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.filter(item => !(item.isBold && item.currentYearAmount === 0 && item.priorYearAmount === 0 && !item.isSubtotal && !item.isTotal)).map((item) => (
          <TableRow 
            key={item.lineId}
            className={item.isTotal ? "bg-muted/50 font-bold" : item.isSubtotal ? "font-semibold" : ""}
          >
            <TableCell 
              className={item.isBold ? "font-semibold" : ""}
              style={{ paddingLeft: `${(item.indentLevel * 1.5) + 1}rem` }}
            >
              {item.lineLabel}
            </TableCell>
            {showNoteRef && (
              <TableCell className="text-center">
                {item.noteRefs.length > 0 && (
                  <Badge variant="outline" className="text-xs cursor-pointer hover-elevate">
                    {item.lineNumber || item.noteRefs.map(n => sampleNotes.find(note => note.noteId === n)?.noteNumber).filter(Boolean).join(", ")}
                  </Badge>
                )}
              </TableCell>
            )}
            <TableCell className="text-right font-mono">
              {item.currentYearAmount !== 0 ? formatCurrency(item.currentYearAmount) : "-"}
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {item.priorYearAmount !== 0 ? formatCurrency(item.priorYearAmount) : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderBalanceSheet = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-fs-balance-sheet-title">Balance Sheet</h1>
          <p className="text-muted-foreground">Consolidated Statement of Financial Position</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Lock className="h-3 w-3 mr-1" />
            System-Calculated
          </Badge>
          {sampleBalanceSheet.balanceCheck ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Balanced
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Out of Balance
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {renderFSLineItems([...sampleBalanceSheet.sections.currentAssets, ...sampleBalanceSheet.sections.nonCurrentAssets])}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Total Assets</CardTitle>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{sampleBalanceSheet.currentPeriodLabel}</p>
              <p className="text-xl font-bold font-mono" data-testid="text-total-assets-current">{formatCurrency(sampleBalanceSheet.totalAssets.current)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{sampleBalanceSheet.priorPeriodLabel}</p>
              <p className="text-xl font-bold font-mono text-muted-foreground">{formatCurrency(sampleBalanceSheet.totalAssets.prior)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liabilities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {renderFSLineItems([...sampleBalanceSheet.sections.currentLiabilities, ...sampleBalanceSheet.sections.nonCurrentLiabilities])}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stockholders' Equity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {renderFSLineItems(sampleBalanceSheet.sections.equity)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Total Liabilities & Equity</CardTitle>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{sampleBalanceSheet.currentPeriodLabel}</p>
              <p className="text-xl font-bold font-mono" data-testid="text-total-le-current">{formatCurrency(sampleBalanceSheet.totalLiabilities.current + sampleBalanceSheet.totalEquity.current)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{sampleBalanceSheet.priorPeriodLabel}</p>
              <p className="text-xl font-bold font-mono text-muted-foreground">{formatCurrency(sampleBalanceSheet.totalLiabilities.prior + sampleBalanceSheet.totalEquity.prior)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );

  const renderIncomeStatement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-fs-income-statement-title">Income Statement</h1>
          <p className="text-muted-foreground">Consolidated Statement of Operations</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Lock className="h-3 w-3 mr-1" />
          System-Calculated
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0 pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Line Item</TableHead>
                <TableHead className="w-[10%] text-center">Note</TableHead>
                <TableHead className="text-right">{sampleIncomeStatement.currentPeriodLabel}</TableHead>
                <TableHead className="text-right">{sampleIncomeStatement.priorPeriodLabel}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleIncomeStatement.lines.map((item) => (
                <TableRow 
                  key={item.lineId}
                  className={item.isTotal ? "bg-muted/50 font-bold border-t-2" : item.isSubtotal ? "font-semibold bg-muted/30" : ""}
                >
                  <TableCell 
                    className={item.isBold ? "font-semibold" : ""}
                    style={{ paddingLeft: `${(item.indentLevel * 1.5) + 1}rem` }}
                  >
                    {item.lineLabel}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.noteRefs.length > 0 && (
                      <Badge variant="outline" className="text-xs cursor-pointer hover-elevate">
                        {item.lineNumber}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className={`text-right font-mono ${item.currentYearAmount < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                    {item.currentYearAmount !== 0 ? formatCurrency(item.currentYearAmount) : "-"}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-muted-foreground ${item.priorYearAmount < 0 ? "text-red-400" : ""}`}>
                    {item.priorYearAmount !== 0 ? formatCurrency(item.priorYearAmount) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Net Income</CardTitle>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{sampleIncomeStatement.currentPeriodLabel}</p>
              <p className="text-xl font-bold font-mono text-green-600" data-testid="text-net-income-current">{formatCurrency(sampleIncomeStatement.netIncome.current)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{sampleIncomeStatement.priorPeriodLabel}</p>
              <p className="text-xl font-bold font-mono text-muted-foreground">{formatCurrency(sampleIncomeStatement.netIncome.prior)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );

  // Calculate OCI totals
  const reclassifiableOCI = sampleComprehensiveIncome.ociItems.filter(i => i.isReclassifiable);
  const nonReclassifiableOCI = sampleComprehensiveIncome.ociItems.filter(i => !i.isReclassifiable);
  const totalReclassifiableCurrent = reclassifiableOCI.reduce((sum, i) => sum + i.current, 0);
  const totalReclassifiablePrior = reclassifiableOCI.reduce((sum, i) => sum + i.prior, 0);
  const totalNonReclassifiableCurrent = nonReclassifiableOCI.reduce((sum, i) => sum + i.current, 0);
  const totalNonReclassifiablePrior = nonReclassifiableOCI.reduce((sum, i) => sum + i.prior, 0);
  const totalOCICurrent = totalReclassifiableCurrent + totalNonReclassifiableCurrent;
  const totalOCIPrior = totalReclassifiablePrior + totalNonReclassifiablePrior;
  const totalCompIncCurrent = sampleComprehensiveIncome.netIncome.current + totalOCICurrent;
  const totalCompIncPrior = sampleComprehensiveIncome.netIncome.prior + totalOCIPrior;

  const renderComprehensiveIncome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-fs-comprehensive-income-title">Statement of Comprehensive Income</h1>
          <p className="text-muted-foreground">Net income and other comprehensive income</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Lock className="h-3 w-3 mr-1" />
          System-Calculated
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0 pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Line Item</TableHead>
                <TableHead className="text-right">{sampleComprehensiveIncome.currentPeriodLabel}</TableHead>
                <TableHead className="text-right">{sampleComprehensiveIncome.priorPeriodLabel}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-semibold bg-muted/30">
                <TableCell>Net income</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(sampleComprehensiveIncome.netIncome.current)}</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(sampleComprehensiveIncome.netIncome.prior)}</TableCell>
              </TableRow>
              
              <TableRow className="bg-muted/20">
                <TableCell colSpan={3} className="font-semibold">Other comprehensive income (loss):</TableCell>
              </TableRow>
              
              <TableRow className="bg-muted/10">
                <TableCell className="pl-4 italic text-sm text-muted-foreground">Items that may be reclassified to profit or loss:</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              
              {reclassifiableOCI.map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell className="pl-8">{item.label}</TableCell>
                  <TableCell className={`text-right font-mono ${item.current < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                    {formatCurrency(item.current)}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-muted-foreground ${item.prior < 0 ? "text-red-400" : ""}`}>
                    {formatCurrency(item.prior)}
                  </TableCell>
                </TableRow>
              ))}
              
              <TableRow className="bg-muted/10">
                <TableCell className="pl-4 italic text-sm text-muted-foreground">Items that will not be reclassified to profit or loss:</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
              
              {nonReclassifiableOCI.map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell className="pl-8">{item.label}</TableCell>
                  <TableCell className={`text-right font-mono ${item.current < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                    {formatCurrency(item.current)}
                  </TableCell>
                  <TableCell className={`text-right font-mono text-muted-foreground ${item.prior < 0 ? "text-red-400" : ""}`}>
                    {formatCurrency(item.prior)}
                  </TableCell>
                </TableRow>
              ))}
              
              <TableRow className="font-semibold border-t">
                <TableCell className="pl-4">Total other comprehensive income (loss)</TableCell>
                <TableCell className={`text-right font-mono ${totalOCICurrent < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                  {formatCurrency(totalOCICurrent)}
                </TableCell>
                <TableCell className={`text-right font-mono text-muted-foreground ${totalOCIPrior < 0 ? "text-red-400" : ""}`}>
                  {formatCurrency(totalOCIPrior)}
                </TableCell>
              </TableRow>
              
              <TableRow className="font-bold bg-muted/50 border-t-2">
                <TableCell>Total comprehensive income</TableCell>
                <TableCell className="text-right font-mono text-green-600">{formatCurrency(totalCompIncCurrent)}</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(totalCompIncPrior)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderEquityStatement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-fs-equity-statement-title">Statement of Changes in Equity</h1>
          <p className="text-muted-foreground">Movements in stockholders' equity</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Lock className="h-3 w-3 mr-1" />
          System-Calculated
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0 pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Component / Movement</TableHead>
                <TableHead className="text-right">{sampleEquityStatement.currentPeriodLabel}</TableHead>
                <TableHead className="text-right">{sampleEquityStatement.priorPeriodLabel}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleEquityStatement.components.map((component) => (
                <>
                  <TableRow key={`${component.componentId}-header`} className="bg-muted/30">
                    <TableCell colSpan={3} className="font-semibold">
                      {component.componentName}
                      {component.noteRefs.length > 0 && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Note {sampleNotes.find(n => n.noteId === component.noteRefs[0])?.noteNumber}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow key={`${component.componentId}-opening`}>
                    <TableCell className="pl-6">Opening balance</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(component.openingBalance.current)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(component.openingBalance.prior)}</TableCell>
                  </TableRow>
                  {component.movements.map((movement, idx) => (
                    <TableRow key={`${component.componentId}-movement-${idx}`}>
                      <TableCell className="pl-8 text-muted-foreground">{movement.description}</TableCell>
                      <TableCell className={`text-right font-mono ${movement.current < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                        {movement.current !== 0 ? formatCurrency(movement.current) : "-"}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-muted-foreground ${movement.prior < 0 ? "text-red-400" : ""}`}>
                        {movement.prior !== 0 ? formatCurrency(movement.prior) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow key={`${component.componentId}-closing`} className="font-semibold">
                    <TableCell className="pl-6">Closing balance</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(component.closingBalance.current)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(component.closingBalance.prior)}</TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Total Equity</CardTitle>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{sampleEquityStatement.currentPeriodLabel}</p>
              <p className="text-xl font-bold font-mono" data-testid="text-total-equity-current">{formatCurrency(sampleEquityStatement.totalEquity.current)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{sampleEquityStatement.priorPeriodLabel}</p>
              <p className="text-xl font-bold font-mono text-muted-foreground">{formatCurrency(sampleEquityStatement.totalEquity.prior)}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );

  const renderCashFlowStatement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-fs-cash-flow-title">Cash Flow Statement</h1>
          <p className="text-muted-foreground">Consolidated Statement of Cash Flows ({sampleCashFlowStatement.method} Method)</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            <Lock className="h-3 w-3 mr-1" />
            System-Calculated
          </Badge>
          {sampleCashFlowStatement.reconciliationCheck ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Reconciled
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Reconciled
            </Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Operating Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {renderFSLineItems(sampleCashFlowStatement.operatingActivities)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investing Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {renderFSLineItems(sampleCashFlowStatement.investingActivities)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financing Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {renderFSLineItems(sampleCashFlowStatement.financingActivities)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cash Reconciliation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-1">Opening Cash</p>
              <p className="text-lg font-bold font-mono">{formatCurrency(sampleCashFlowStatement.openingCash.current)}</p>
              <p className="text-sm text-muted-foreground font-mono">{formatCurrency(sampleCashFlowStatement.openingCash.prior)}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-1">Net Change</p>
              <p className={`text-lg font-bold font-mono ${sampleCashFlowStatement.netCashChange.current >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(sampleCashFlowStatement.netCashChange.current)}
              </p>
              <p className="text-sm text-muted-foreground font-mono">{formatCurrency(sampleCashFlowStatement.netCashChange.prior)}</p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
              <p className="text-xs text-muted-foreground uppercase mb-1">Closing Cash</p>
              <p className="text-lg font-bold font-mono" data-testid="text-closing-cash-current">{formatCurrency(sampleCashFlowStatement.closingCash.current)}</p>
              <p className="text-sm text-muted-foreground font-mono">{formatCurrency(sampleCashFlowStatement.closingCash.prior)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Trial Balance helper functions
  const calculateTBTotals = () => {
    let totalOpeningBalance = 0;
    let totalClosingBalance = 0;
    
    tbLines.forEach(line => {
      totalOpeningBalance += line.openingBalance;
      totalClosingBalance += line.closingBalance;
    });
    
    return { totalOpeningBalance, totalClosingBalance };
  };

  const handleAddColumn = () => {
    if (!newColumnLabel.trim()) return;
    const newColumn: TBColumn = {
      columnId: `col-user-${Date.now()}`,
      columnLabel: newColumnLabel,
      columnType: "ADJUSTMENT",
      isLocked: false,
      isVisible: true,
      orderIndex: tbColumns.length,
    };
    
    // Insert before NET_MOVEMENT and CLOSING columns
    const beforeNetMove = tbColumns.filter(c => c.columnType !== "NET_MOVEMENT" && c.columnType !== "CLOSING");
    const netMoveCol = tbColumns.find(c => c.columnType === "NET_MOVEMENT");
    const closingCol = tbColumns.find(c => c.columnType === "CLOSING");
    const reorderedColumns = [...beforeNetMove, newColumn];
    if (netMoveCol) reorderedColumns.push(netMoveCol);
    if (closingCol) reorderedColumns.push(closingCol);
    setTbColumns(reorderedColumns);
    
    // Add empty amounts for this column to all lines (net amount = 0)
    setTbLines(tbLines.map(line => ({
      ...line,
      amounts: { ...line.amounts, [newColumn.columnId]: 0 }
    })));
    
    setNewColumnLabel("");
    setShowAddColumnDialog(false);
  };

  const handleAddRow = () => {
    if (!newRowAccountCode.trim() || !newRowAccountName.trim()) return;
    const movementCols = tbColumns.filter(c => 
      c.columnType === "MOVEMENT" || c.columnType === "ADJUSTMENT" || c.columnType === "USER"
    );
    const newLine: TBLine = {
      lineId: `tb-${Date.now()}`,
      accountId: `gl-${Date.now()}`,
      accountCode: newRowAccountCode,
      accountName: newRowAccountName,
      fsCategory: null,
      footnoteIds: [],
      footnoteDescription: null,
      normalBalance: "DEBIT",
      openingBalance: 0,
      amounts: movementCols.reduce((acc, col) => ({ ...acc, [col.columnId]: 0 }), {}),
      closingBalance: 0,
      orderIndex: tbLines.length + 1,
    };
    
    setTbLines([...tbLines, newLine]);
    setNewRowAccountCode("");
    setNewRowAccountName("");
    setShowAddRowDialog(false);
  };

  // Update cell with net amount (DR positive, CR negative)
  const handleCellUpdate = (lineId: string, columnId: string, value: number) => {
    setTbLines(tbLines.map(line => {
      if (line.lineId !== lineId) return line;
      
      const updatedAmounts = { ...line.amounts, [columnId]: value };
      
      // Recalculate closing balance based on net movements
      // Net movement = sum of all movement columns
      const netMovement = Object.entries(updatedAmounts)
        .filter(([colId]) => {
          const col = tbColumns.find(c => c.columnId === colId);
          return col && (col.columnType === "MOVEMENT" || col.columnType === "ADJUSTMENT" || col.columnType === "USER");
        })
        .reduce((sum, [, amt]) => sum + (amt as number), 0);
      
      // Opening + Net Movement = Closing (net amount format)
      const closingBalance = line.openingBalance + netMovement;
      
      return { ...line, amounts: updatedAmounts, closingBalance };
    }));
    setEditingCell(null);
  };

  const handleFsCategoryUpdate = (lineId: string, category: FSCategory | null) => {
    setTbLines(tbLines.map(line => 
      line.lineId === lineId ? { ...line, fsCategory: category } : line
    ));
    setEditingFsCategory(null);
  };

  const handleFootnoteUpdate = (lineId: string, footnoteIds: string[]) => {
    setTbLines(tbLines.map(line => 
      line.lineId === lineId ? { ...line, footnoteIds } : line
    ));
    setEditingFootnotes(null);
  };

  const handleFootnoteDescriptionUpdate = (lineId: string, description: string | null) => {
    setTbLines(tbLines.map(line => 
      line.lineId === lineId ? { ...line, footnoteDescription: description } : line
    ));
  };

  const toggleColumnVisibility = (columnId: string) => {
    setTbColumns(tbColumns.map(col => 
      col.columnId === columnId ? { ...col, isVisible: !col.isVisible } : col
    ));
  };

  // Calculate net movement for a line (sum of all adjustment/movement columns)
  const calculateNetMovement = (line: TBLine): number => {
    return Object.entries(line.amounts)
      .filter(([colId]) => {
        const col = tbColumns.find(c => c.columnId === colId);
        return col && (col.columnType === "MOVEMENT" || col.columnType === "ADJUSTMENT" || col.columnType === "USER");
      })
      .reduce((sum, [, amt]) => sum + (amt as number), 0);
  };

  const getFsCategoryColor = (category: FSCategory | null): string => {
    if (!category) return "bg-muted text-muted-foreground";
    switch (category) {
      case "CURRENT_ASSETS":
      case "NON_CURRENT_ASSETS":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "CURRENT_LIABILITIES":
      case "NON_CURRENT_LIABILITIES":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "EQUITY":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "REVENUE":
      case "OTHER_INCOME":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "COST_OF_SALES":
      case "OPERATING_EXPENSES":
      case "OTHER_EXPENSES":
      case "TAX_EXPENSE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Cross-Reference Trail Generator - uses explicit IDs for accurate linking
  const getReferenceTrail = (line: TBLine): { nodeType: string; label: string; amount?: number }[] => {
    const trail: { nodeType: string; label: string; amount?: number }[] = [];
    
    // GL Account (always present) - linked by accountId
    trail.push({
      nodeType: "GL",
      label: `GL ${line.accountCode}`,
      amount: line.closingBalance
    });
    
    // Check for Split Declaration - linked by explicit accountId match
    const split = splitDeclarations.find(s => s.accountId === line.accountId);
    if (split) {
      trail.push({
        nodeType: "SPLIT",
        label: split.isComplete ? "Split Declaration (Complete)" : "Split Declaration (Incomplete)",
        amount: split.totalAssigned
      });
    }
    
    // Check for linked Working Paper - uses explicit linkedTbAccountIds if available, 
    // otherwise falls back to footnote ID matching for backwards compatibility
    const linkedWps = workingPapers.filter(wp => {
      // Check if working paper has explicit linked TB account IDs
      if ((wp as any).linkedTbAccountIds?.includes(line.accountId)) {
        return true;
      }
      // Fall back to footnote ID matching (working papers linked to notes that are linked to this TB line)
      return wp.linkedNotes.some(noteId => line.footnoteIds.includes(noteId));
    });
    
    linkedWps.forEach(wp => {
      trail.push({
        nodeType: "WP",
        label: wp.name,
      });
    });
    
    // Check for linked Notes - explicit footnoteId matching
    if (line.footnoteIds.length > 0) {
      line.footnoteIds.forEach(fnId => {
        const footnote = tbFootnotes.find(fn => fn.footnoteId === fnId);
        if (footnote) {
          trail.push({
            nodeType: "NOTE",
            label: `${footnote.footnoteCode}: ${footnote.footnoteTitle}`,
          });
        }
      });
    }
    
    return trail;
  };

  const getWpStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "IN_REVIEW": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "LOCKED": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getWpTypeLabel = (type: string) => {
    switch (type) {
      case "LINEAR": return "Linear";
      case "AGING": return "Aging";
      case "ROLLFORWARD": return "Rollforward";
      case "CUSTOM": return "Custom";
      default: return type;
    }
  };

  const handleGenerateFinancialStatements = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    const steps = [
      "Validating data integrity...",
      "Compiling financial statements...",
      "Generating disclosure notes...",
      "Adding schedules and working papers...",
      "Applying formatting...",
      "Finalizing document..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      setExportProgress(Math.round(((i + 1) / steps.length) * 100));
    }
    
    if (exportOptions.lockPeriod) {
      console.log("Period locked for:", activePeriod.periodLabel);
    }
    
    setIsExporting(false);
    setShowExportDialog(false);
    setExportProgress(0);
  };

  const toggleStatementSelection = (statement: string) => {
    setExportOptions(prev => ({
      ...prev,
      selectedStatements: prev.selectedStatements.includes(statement)
        ? prev.selectedStatements.filter(s => s !== statement)
        : [...prev.selectedStatements, statement]
    }));
  };

  const renderWorkingPapers = () => {
    if (selectedWorkingPaper) {
      return renderWorkingPaperGrid(selectedWorkingPaper);
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-wp-title">Working Papers</h1>
            <p className="text-muted-foreground">Structured calculations and supporting schedules</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" data-testid="button-wp-new">
              <Plus className="w-4 h-4 mr-1" />
              New Working Paper
            </Button>
          </div>
        </div>

        {/* Working Papers List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">All Working Papers</CardTitle>
            <CardDescription>{workingPapers.length} working papers for {sampleTBWorkspace.periodLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Linked FS</TableHead>
                  <TableHead>Linked Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workingPapers.map((wp) => (
                  <TableRow 
                    key={wp.workingPaperId} 
                    className="cursor-pointer hover-elevate"
                    onClick={() => setSelectedWorkingPaper(wp)}
                    data-testid={`row-wp-${wp.workingPaperId}`}
                  >
                    <TableCell className="font-medium">{wp.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getWpTypeLabel(wp.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      {wp.linkedFsLines.length > 0 ? (
                        <Badge variant="secondary" className="text-xs">
                          {wp.linkedFsLines.length} line(s)
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {wp.linkedNotes.length > 0 ? (
                        <div className="flex gap-1">
                          {wp.linkedNotes.map((noteId) => {
                            const footnote = tbFootnotes.find(fn => fn.footnoteId === noteId);
                            return (
                              <Badge key={noteId} variant="outline" className="text-xs">
                                {footnote?.footnoteCode || noteId}
                              </Badge>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getWpStatusColor(wp.status)}>{wp.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(wp.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderWorkingPaperGrid = (wp: WorkingPaper) => {
    const sortedRows = [...wp.rows].sort((a, b) => a.orderIndex - b.orderIndex);
    const sortedCols = [...wp.columns].sort((a, b) => a.orderIndex - b.orderIndex);
    
    const formatWpValue = (value: string | number | undefined): string => {
      if (value === undefined || value === null) return "-";
      if (typeof value === "number") {
        if (value < 0) return `(${formatCurrency(Math.abs(value))})`;
        return formatCurrency(value);
      }
      return String(value);
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground" data-testid="breadcrumb-wp">
          <button 
            onClick={() => setSelectedWorkingPaper(null)} 
            className="hover:text-foreground transition-colors"
            data-testid="breadcrumb-wp-list"
          >
            Working Papers
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">{wp.name}</span>
        </nav>

        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedWorkingPaper(null)}
              data-testid="button-wp-back"
            >
              <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold" data-testid="text-wp-grid-title">{wp.name}</h1>
              <p className="text-muted-foreground">{getWpTypeLabel(wp.type)} Working Paper</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getWpStatusColor(wp.status)}>{wp.status}</Badge>
            <Button variant="outline" size="sm" data-testid="button-wp-add-row">
              <Plus className="w-4 h-4 mr-1" />
              Add Row
            </Button>
            <Button variant="outline" size="sm" data-testid="button-wp-add-column">
              <Plus className="w-4 h-4 mr-1" />
              Add Column
            </Button>
          </div>
        </div>

        {/* Working Paper Grid */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Grid View</CardTitle>
                <CardDescription>
                  {wp.rows.length} rows × {wp.columns.length} columns
                  {wp.frozenRows > 0 && ` · ${wp.frozenRows} frozen header row(s)`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {wp.linkedNotes.map((noteId) => {
                  const footnote = tbFootnotes.find(fn => fn.footnoteId === noteId);
                  return (
                    <Badge key={noteId} variant="outline" className="text-xs">
                      {footnote?.footnoteCode}: {footnote?.footnoteTitle}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {sortedCols.map((col) => (
                      <TableHead 
                        key={col.columnId}
                        className={`min-w-[${col.widthPx}px] ${col.isLocked ? "bg-muted" : ""}`}
                        style={{ minWidth: col.widthPx }}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                          {col.formula && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-[10px] px-1">fx</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-mono text-xs">{col.formula}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRows.map((row) => (
                    <TableRow 
                      key={row.rowId}
                      className={`
                        ${row.rowType === "HEADER" ? "bg-muted/30 font-semibold" : ""}
                        ${row.rowType === "TOTAL" ? "bg-primary/5 font-bold border-t-2" : ""}
                        ${row.rowType === "SUBTOTAL" ? "bg-muted/20 font-medium" : ""}
                        ${row.isLocked ? "opacity-80" : ""}
                      `}
                      data-testid={`row-wp-grid-${row.rowId}`}
                    >
                      {sortedCols.map((col) => {
                        const value = row.values[col.columnId];
                        const isNumeric = typeof value === "number";
                        return (
                          <TableCell 
                            key={col.columnId}
                            className={`
                              ${isNumeric ? "text-right font-mono" : ""}
                              ${col.isLocked ? "bg-muted/30" : ""}
                              ${typeof value === "number" && value < 0 ? "text-red-600 dark:text-red-400" : ""}
                            `}
                          >
                            {formatWpValue(value)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Text Blocks */}
        {wp.textBlocks.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notes & Annotations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wp.textBlocks.map((block) => (
                  <div key={block.blockId} className="p-3 bg-muted/30 rounded-md">
                    <p className={`
                      ${block.style === "HEADING" ? "font-bold text-lg" : ""}
                      ${block.style === "SUBHEADING" ? "font-semibold" : ""}
                      ${block.style === "NOTE" ? "text-sm text-muted-foreground italic" : ""}
                    `}>
                      {block.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Working Paper Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created By</span>
                <p className="font-medium">{wp.createdBy}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created</span>
                <p className="font-medium">{new Date(wp.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated By</span>
                <p className="font-medium">{wp.updatedBy}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated</span>
                <p className="font-medium">{new Date(wp.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // TB Adjustments Workspace - where all adjustments are made
  const renderTBAdjustmentsWorkspace = () => {
    const formatNetAmount = (amount: number): string => {
      if (amount === 0) return "-";
      const formatted = formatCurrency(Math.abs(amount));
      return amount < 0 ? `(${formatted})` : formatted;
    };

    const calculateAdjTotals = () => {
      let totalInitial = 0;
      let totalFinal = 0;
      let totalRJE = 0;
      let totalAJE = 0;
      let totalNetMove = 0;
      
      adjLines.forEach(line => {
        totalInitial += line.initialBalance;
        totalFinal += line.finalBalance;
        totalRJE += line.totalRJE;
        totalAJE += line.totalAJE;
        totalNetMove += line.netMovement;
      });
      
      return { totalInitial, totalFinal, totalRJE, totalAJE, totalNetMove };
    };

    const adjTotals = calculateAdjTotals();
    const isBalanced = Math.abs(adjTotals.totalFinal) < 0.01;

    const handleAdjFsCategoryUpdate = (lineId: string, category: FSCategory | null) => {
      setAdjLines(lines => lines.map(l => 
        l.lineId === lineId ? { ...l, fsCategory: category } : l
      ));
      setEditingAdjFsCategory(null);
    };

    const handleAdjFootnoteUpdate = (lineId: string, footnoteIds: string[]) => {
      setAdjLines(lines => lines.map(l => 
        l.lineId === lineId ? { ...l, footnoteIds } : l
      ));
    };

    const getEntryStatusBadge = (status: TBAdjustmentEntry["status"]) => {
      switch (status) {
        case "APPROVED":
          return <Badge variant="default" data-testid="badge-entry-approved"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
        case "PENDING_REVIEW":
          return <Badge variant="secondary" data-testid="badge-entry-pending"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
        case "DRAFT":
          return <Badge variant="outline" data-testid="badge-entry-draft"><Edit3 className="w-3 h-3 mr-1" />Draft</Badge>;
        case "REJECTED":
          return <Badge variant="destructive" data-testid="badge-entry-rejected"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-adj-ws-title">TB Adjustments Workspace</h1>
            <p className="text-muted-foreground">{sampleTBAdjustmentsWorkspace.entityName} - {sampleTBAdjustmentsWorkspace.periodLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            {isBalanced ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" data-testid="badge-adj-balanced">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Balanced
              </Badge>
            ) : (
              <Badge variant="destructive" data-testid="badge-adj-unbalanced">
                <AlertCircle className="w-3 h-3 mr-1" />
                Out of Balance
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowAddAdjEntryDialog(true)} data-testid="button-add-adjustment">
              <Plus className="w-4 h-4 mr-1" />
              Add Entry
            </Button>
          </div>
        </div>

        {/* Adjustment Entries Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-lg">Adjustment Entries</CardTitle>
                <CardDescription>Reclassification (RJE) and Adjusting (AJE) Journal Entries</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600 dark:text-blue-400" data-testid="badge-rje-count">
                  RJE: {adjEntries.filter(e => e.entryType === "RJE").length}
                </Badge>
                <Badge variant="outline" className="text-purple-600 dark:text-purple-400" data-testid="badge-aje-count">
                  AJE: {adjEntries.filter(e => e.entryType === "AJE").length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {adjEntries.map(entry => (
                <div 
                  key={entry.entryId} 
                  className="p-3 border rounded-md hover-elevate cursor-pointer"
                  onClick={() => setSelectedEntryForDetail(entry)}
                  data-testid={`card-entry-${entry.entryLabel}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={entry.entryType === "RJE" ? "secondary" : "default"} data-testid={`badge-type-${entry.entryLabel}`}>
                      {entry.entryLabel}
                    </Badge>
                    {getEntryStatusBadge(entry.status)}
                  </div>
                  <p className="text-sm font-medium truncate">{entry.description}</p>
                  <p className="text-sm font-mono text-muted-foreground">{formatCurrency(entry.amount)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ref: {entry.reference}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main TB Adjustments Grid */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-lg">Trial Balance Adjustments</CardTitle>
                <CardDescription>Initial TB with RJE/AJE adjustments, FS Category & Footnote tagging</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-20 sticky left-0 bg-muted/50 z-10">Code</TableHead>
                    <TableHead className="min-w-[180px] sticky left-20 bg-muted/50 z-10">Account Name</TableHead>
                    <TableHead className="w-32">FS Category</TableHead>
                    <TableHead className="w-28">Footnote</TableHead>
                    <TableHead className="text-center w-28 bg-slate-100 dark:bg-slate-800">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">Initial TB</span>
                        <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                      </div>
                    </TableHead>
                    {/* RJE Columns */}
                    {adjRJEColumns.filter(c => c.isVisible).map(col => (
                      <TableHead key={col.columnId} className="text-center w-24 bg-blue-50 dark:bg-blue-950">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-blue-700 dark:text-blue-300">{col.columnLabel}</span>
                          <span className="text-[10px] text-muted-foreground">DR(+)/CR(-)</span>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center w-24 bg-blue-100 dark:bg-blue-900">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Total RJE</span>
                        <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                      </div>
                    </TableHead>
                    {/* AJE Columns */}
                    {adjAJEColumns.filter(c => c.isVisible).map(col => (
                      <TableHead key={col.columnId} className="text-center w-24 bg-purple-50 dark:bg-purple-950">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-purple-700 dark:text-purple-300">{col.columnLabel}</span>
                          <span className="text-[10px] text-muted-foreground">DR(+)/CR(-)</span>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center w-24 bg-purple-100 dark:bg-purple-900">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Total AJE</span>
                        <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-24 bg-amber-100 dark:bg-amber-900">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">Net Move</span>
                        <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-28 bg-green-100 dark:bg-green-900">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">Final Balance</span>
                        <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjLines.map(line => (
                    <TableRow key={line.lineId} className="hover-elevate" data-testid={`row-adj-${line.accountCode}`}>
                      <TableCell className="font-mono text-sm sticky left-0 bg-background z-10" data-testid={`cell-adj-code-${line.accountCode}`}>
                        {line.accountCode}
                      </TableCell>
                      <TableCell className="sticky left-20 bg-background z-10 text-sm">{line.accountName}</TableCell>
                      {/* FS Category */}
                      <TableCell>
                        {editingAdjFsCategory === line.lineId ? (
                          <Select
                            value={line.fsCategory || ""}
                            onValueChange={(value) => handleAdjFsCategoryUpdate(line.lineId, value === "none" ? null : value as FSCategory)}
                          >
                            <SelectTrigger className="h-7 text-xs" data-testid={`select-adj-fs-${line.accountCode}`}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {Object.entries(fsCategoryLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className={`text-xs cursor-pointer ${getFsCategoryColor(line.fsCategory)}`}
                            onClick={() => setEditingAdjFsCategory(line.lineId)}
                            data-testid={`badge-adj-fs-${line.accountCode}`}
                          >
                            {line.fsCategory ? fsCategoryLabels[line.fsCategory] : "Tag"}
                          </Badge>
                        )}
                      </TableCell>
                      {/* Footnote Tag */}
                      <TableCell>
                        <Select
                          value={line.footnoteIds[0] || "none"}
                          onValueChange={(value) => handleAdjFootnoteUpdate(line.lineId, value === "none" ? [] : [value])}
                        >
                          <SelectTrigger className="h-7 text-xs" data-testid={`select-adj-fn-${line.accountCode}`}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {sampleTBAdjustmentsWorkspace.footnotes.map((fn) => (
                              <SelectItem key={fn.footnoteId} value={fn.footnoteId}>{fn.footnoteCode}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {/* Initial TB Balance */}
                      <TableCell className={`text-right font-mono text-sm bg-slate-50 dark:bg-slate-900 ${line.initialBalance < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                        {formatNetAmount(line.initialBalance)}
                      </TableCell>
                      {/* RJE Columns */}
                      {adjRJEColumns.filter(c => c.isVisible).map(col => {
                        const amount = line.adjustments[col.columnId] || 0;
                        return (
                          <TableCell key={col.columnId} className={`text-right font-mono text-sm bg-blue-50/50 dark:bg-blue-950/50 ${amount < 0 ? "text-red-600 dark:text-red-400" : amount > 0 ? "text-blue-600 dark:text-blue-400" : ""}`}>
                            {formatNetAmount(amount)}
                          </TableCell>
                        );
                      })}
                      {/* Total RJE */}
                      <TableCell className={`text-right font-mono text-sm bg-blue-100/50 dark:bg-blue-900/50 font-semibold ${line.totalRJE < 0 ? "text-red-600 dark:text-red-400" : line.totalRJE > 0 ? "text-blue-600 dark:text-blue-400" : ""}`}>
                        {formatNetAmount(line.totalRJE)}
                      </TableCell>
                      {/* AJE Columns */}
                      {adjAJEColumns.filter(c => c.isVisible).map(col => {
                        const amount = line.adjustments[col.columnId] || 0;
                        return (
                          <TableCell key={col.columnId} className={`text-right font-mono text-sm bg-purple-50/50 dark:bg-purple-950/50 ${amount < 0 ? "text-red-600 dark:text-red-400" : amount > 0 ? "text-purple-600 dark:text-purple-400" : ""}`}>
                            {formatNetAmount(amount)}
                          </TableCell>
                        );
                      })}
                      {/* Total AJE */}
                      <TableCell className={`text-right font-mono text-sm bg-purple-100/50 dark:bg-purple-900/50 font-semibold ${line.totalAJE < 0 ? "text-red-600 dark:text-red-400" : line.totalAJE > 0 ? "text-purple-600 dark:text-purple-400" : ""}`}>
                        {formatNetAmount(line.totalAJE)}
                      </TableCell>
                      {/* Net Movement */}
                      <TableCell className={`text-right font-mono text-sm bg-amber-50 dark:bg-amber-950 font-semibold ${line.netMovement < 0 ? "text-red-600 dark:text-red-400" : line.netMovement > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                        {formatNetAmount(line.netMovement)}
                      </TableCell>
                      {/* Final Balance */}
                      <TableCell className={`text-right font-mono text-sm bg-green-50 dark:bg-green-950 font-semibold ${line.finalBalance < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                        {formatNetAmount(line.finalBalance)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-muted font-bold border-t-2">
                    <TableCell className="sticky left-0 bg-muted z-10" colSpan={2}>TOTALS</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className={`text-right font-mono ${adjTotals.totalInitial < 0 ? "text-red-600 dark:text-red-400" : ""}`} data-testid="text-adj-initial-total">
                      {formatNetAmount(adjTotals.totalInitial)}
                    </TableCell>
                    {adjRJEColumns.filter(c => c.isVisible).map(col => {
                      const colTotal = adjLines.reduce((sum, line) => sum + (line.adjustments[col.columnId] || 0), 0);
                      return (
                        <TableCell key={`${col.columnId}-total`} className={`text-right font-mono ${colTotal < 0 ? "text-red-600 dark:text-red-400" : colTotal > 0 ? "text-blue-600 dark:text-blue-400" : ""}`}>
                          {formatNetAmount(colTotal)}
                        </TableCell>
                      );
                    })}
                    <TableCell className={`text-right font-mono bg-blue-100/50 dark:bg-blue-900/50 ${adjTotals.totalRJE < 0 ? "text-red-600 dark:text-red-400" : adjTotals.totalRJE > 0 ? "text-blue-600 dark:text-blue-400" : ""}`}>
                      {formatNetAmount(adjTotals.totalRJE)}
                    </TableCell>
                    {adjAJEColumns.filter(c => c.isVisible).map(col => {
                      const colTotal = adjLines.reduce((sum, line) => sum + (line.adjustments[col.columnId] || 0), 0);
                      return (
                        <TableCell key={`${col.columnId}-total`} className={`text-right font-mono ${colTotal < 0 ? "text-red-600 dark:text-red-400" : colTotal > 0 ? "text-purple-600 dark:text-purple-400" : ""}`}>
                          {formatNetAmount(colTotal)}
                        </TableCell>
                      );
                    })}
                    <TableCell className={`text-right font-mono bg-purple-100/50 dark:bg-purple-900/50 ${adjTotals.totalAJE < 0 ? "text-red-600 dark:text-red-400" : adjTotals.totalAJE > 0 ? "text-purple-600 dark:text-purple-400" : ""}`}>
                      {formatNetAmount(adjTotals.totalAJE)}
                    </TableCell>
                    <TableCell className={`text-right font-mono bg-amber-100/50 dark:bg-amber-900/50 ${adjTotals.totalNetMove < 0 ? "text-red-600 dark:text-red-400" : adjTotals.totalNetMove > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                      {formatNetAmount(adjTotals.totalNetMove)}
                    </TableCell>
                    <TableCell className={`text-right font-mono bg-green-100/50 dark:bg-green-900/50 ${adjTotals.totalFinal < 0 ? "text-red-600 dark:text-red-400" : ""}`} data-testid="text-adj-final-total">
                      {formatNetAmount(adjTotals.totalFinal)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Entry Detail Sheet */}
        <Sheet open={!!selectedEntryForDetail} onOpenChange={() => setSelectedEntryForDetail(null)}>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {selectedEntryForDetail && (
                  <>
                    <Badge variant={selectedEntryForDetail.entryType === "RJE" ? "secondary" : "default"}>
                      {selectedEntryForDetail.entryLabel}
                    </Badge>
                    {getEntryStatusBadge(selectedEntryForDetail.status)}
                  </>
                )}
              </SheetTitle>
              <SheetDescription>{selectedEntryForDetail?.description}</SheetDescription>
            </SheetHeader>
            {selectedEntryForDetail && (
              <div className="py-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount</span>
                    <p className="font-mono font-semibold text-lg">{formatCurrency(selectedEntryForDetail.amount)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reference</span>
                    <p className="font-medium">{selectedEntryForDetail.reference || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Debit Account</span>
                    <p className="font-mono">{selectedEntryForDetail.debitAccountId || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Credit Account</span>
                    <p className="font-mono">{selectedEntryForDetail.creditAccountId || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Prepared By</span>
                    <p className="font-medium">{selectedEntryForDetail.preparedBy}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reviewed By</span>
                    <p className="font-medium">{selectedEntryForDetail.reviewedBy || "Pending"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created</span>
                    <p className="font-medium">{new Date(selectedEntryForDetail.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Approved</span>
                    <p className="font-medium">{selectedEntryForDetail.approvedAt ? new Date(selectedEntryForDetail.approvedAt).toLocaleDateString() : "Pending"}</p>
                  </div>
                </div>
                <div className="pt-4 border-t flex gap-2">
                  <Button variant="outline" size="sm" data-testid="button-edit-entry">
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-view-wp">
                    <FileSpreadsheet className="w-4 h-4 mr-1" />
                    View Working Paper
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  };

  // Final TB View - Read-only comparative view (Prior Year vs Current Year)
  const renderTrialBalance = () => {
    const formatNetAmount = (amount: number): string => {
      if (amount === 0) return "-";
      const formatted = formatCurrency(Math.abs(amount));
      return amount < 0 ? `(${formatted})` : formatted;
    };

    const totalPrior = finalTBLines.reduce((sum, l) => sum + l.priorYearClosing, 0);
    const totalCurrent = finalTBLines.reduce((sum, l) => sum + l.currentYearFinal, 0);
    const isBalanced = Math.abs(totalCurrent) < 0.01;

    const getVarianceColor = (variance: number, variancePercent: number | null): string => {
      if (variance === 0) return "";
      if (Math.abs(variancePercent || 0) > 25) return "text-amber-600 dark:text-amber-400";
      return "";
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-tb-title">Final Trial Balance</h1>
            <p className="text-muted-foreground">{sampleFinalTBView.entityName} - Comparative View</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground" data-testid="badge-tb-readonly">
              <Lock className="w-3 h-3 mr-1" />
              Read Only
            </Badge>
            <Badge variant="secondary" data-testid="badge-tb-lookup">
              <FileSpreadsheet className="w-3 h-3 mr-1" />
              Lookup from Adjustments WS
            </Badge>
            {isBalanced ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" data-testid="badge-tb-balanced">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Balanced
              </Badge>
            ) : (
              <Badge variant="destructive" data-testid="badge-tb-unbalanced">
                <AlertCircle className="w-3 h-3 mr-1" />
                Out of Balance
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-lg">Prior Year vs Current Year Comparison</CardTitle>
                <CardDescription>Read-only view - Current Year Final is linked from TB Adjustments Workspace</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" data-testid="badge-prior-period">
                  {sampleFinalTBView.priorPeriodLabel}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <Badge variant="default" data-testid="badge-current-period">
                  {sampleFinalTBView.currentPeriodLabel}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-20 sticky left-0 bg-muted/50 z-10">Code</TableHead>
                    <TableHead className="min-w-[180px] sticky left-20 bg-muted/50 z-10">Account Name</TableHead>
                    <TableHead className="w-32">FS Category</TableHead>
                    <TableHead className="text-center w-32 bg-slate-100 dark:bg-slate-800">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">{sampleFinalTBView.priorPeriodLabel}</span>
                        <span className="text-[10px] text-muted-foreground">Closing</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-32 bg-green-100 dark:bg-green-900">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">{sampleFinalTBView.currentPeriodLabel}</span>
                        <span className="text-[10px] text-muted-foreground">Final</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-28">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">Variance</span>
                        <span className="text-[10px] text-muted-foreground">Amount</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-20">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">%</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalTBLines.map(line => (
                    <TableRow key={line.lineId} className="hover-elevate" data-testid={`row-ftb-${line.accountCode}`}>
                      <TableCell className="font-mono text-sm sticky left-0 bg-background z-10" data-testid={`cell-ftb-code-${line.accountCode}`}>
                        {line.accountCode}
                      </TableCell>
                      <TableCell className="sticky left-20 bg-background z-10 text-sm">{line.accountName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getFsCategoryColor(line.fsCategory)}`}>
                          {line.fsCategory ? fsCategoryLabels[line.fsCategory] : "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-mono text-sm bg-slate-50 dark:bg-slate-900 ${line.priorYearClosing < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                        {formatNetAmount(line.priorYearClosing)}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-sm font-semibold bg-green-50 dark:bg-green-950 ${line.currentYearFinal < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                        {formatNetAmount(line.currentYearFinal)}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-sm ${getVarianceColor(line.variance, line.variancePercent)} ${line.variance < 0 ? "text-red-600 dark:text-red-400" : line.variance > 0 ? "text-green-600 dark:text-green-400" : ""}`}>
                        {line.variance === 0 ? "-" : formatNetAmount(line.variance)}
                      </TableCell>
                      <TableCell className={`text-right font-mono text-sm ${getVarianceColor(line.variance, line.variancePercent)}`}>
                        {line.variancePercent === null || line.variancePercent === 0 ? "-" : `${line.variancePercent.toFixed(1)}%`}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-muted font-bold border-t-2">
                    <TableCell className="sticky left-0 bg-muted z-10" colSpan={2}>TOTALS</TableCell>
                    <TableCell></TableCell>
                    <TableCell className={`text-right font-mono bg-slate-100 dark:bg-slate-800 ${totalPrior < 0 ? "text-red-600 dark:text-red-400" : ""}`} data-testid="text-ftb-prior-total">
                      {formatNetAmount(totalPrior)}
                    </TableCell>
                    <TableCell className={`text-right font-mono bg-green-100 dark:bg-green-900 ${totalCurrent < 0 ? "text-red-600 dark:text-red-400" : ""}`} data-testid="text-ftb-current-total">
                      {formatNetAmount(totalCurrent)}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${(totalCurrent - totalPrior) < 0 ? "text-red-600 dark:text-red-400" : (totalCurrent - totalPrior) > 0 ? "text-green-600 dark:text-green-400" : ""}`}>
                      {formatNetAmount(totalCurrent - totalPrior)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* FS Category Summary - Read Only */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Statement Category Summary</CardTitle>
            <CardDescription>Current year balances by FS category (from Adjustments Workspace)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(fsCategoryLabels).slice(0, 8).map(([key, label]) => {
                const categoryLines = finalTBLines.filter(l => l.fsCategory === key);
                const netAmount = categoryLines.reduce((sum, l) => sum + l.currentYearFinal, 0);
                
                return (
                  <div key={key} className="p-3 border rounded-md">
                    <Badge variant="outline" className={`text-xs ${getFsCategoryColor(key as FSCategory)}`}>
                      {label}
                    </Badge>
                    <p className="text-lg font-bold font-mono mt-2">
                      {formatCurrency(Math.abs(netAmount))}
                    </p>
                    <p className="text-xs text-muted-foreground">{categoryLines.length} accounts</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Note about data source */}
        <Card className="bg-muted/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Data Source</p>
                <p className="text-sm text-muted-foreground">
                  Current Year Final balances are calculated in the TB Adjustments Workspace where RJE/AJE entries, 
                  FS Category tagging, and Footnote tagging are managed. This view is read-only for comparison purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBasisOfPreparation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-basis-of-preparation-title">Basis of Preparation</h1>
          <p className="text-muted-foreground">Reporting framework and measurement basis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {sampleBasisOfPreparation.isLocked ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
            {sampleBasisOfPreparation.isLocked ? "Locked" : "Editable"}
          </Badge>
          <Button size="sm" variant="outline" data-testid="button-edit-basis">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reporting Framework</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Framework</p>
              <Badge variant="secondary" className="text-sm">
                {sampleBasisOfPreparation.reportingFramework === "US_GAAP" ? "US GAAP" : 
                 sampleBasisOfPreparation.reportingFramework === "IFRS" ? "IFRS" : "Local GAAP"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Framework Statement</p>
              <p className="text-sm">{sampleBasisOfPreparation.frameworkStatement}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Currencies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Functional Currency</p>
                <Badge variant="outline">{sampleBasisOfPreparation.functionalCurrency}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Presentation Currency</p>
                <Badge variant="outline">{sampleBasisOfPreparation.presentationCurrency}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Rounding Policy</p>
              <p className="text-sm">{sampleBasisOfPreparation.roundingPolicy}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Measurement Basis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{sampleBasisOfPreparation.measurementBasis}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Going Concern Assessment
              <Badge 
                variant={
                  sampleBasisOfPreparation.goingConcern.status === "CONFIRMED" ? "default" :
                  sampleBasisOfPreparation.goingConcern.status === "MATERIAL_UNCERTAINTY" ? "destructive" :
                  "secondary"
                }
                data-testid="badge-going-concern-status"
              >
                {sampleBasisOfPreparation.goingConcern.status === "CONFIRMED" ? "Confirmed" :
                 sampleBasisOfPreparation.goingConcern.status === "MATERIAL_UNCERTAINTY" ? "Material Uncertainty" :
                 "N/A"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{sampleBasisOfPreparation.goingConcern.statement}</p>
          </CardContent>
        </Card>

        {sampleBasisOfPreparation.consolidationStatement && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Consolidation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{sampleBasisOfPreparation.consolidationStatement}</p>
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Comparative Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{sampleBasisOfPreparation.comparativeStatement}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAccountingPolicies = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-accounting-policies-title">Accounting Policies</h1>
          <p className="text-muted-foreground">Significant accounting policies and methods</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" data-testid="button-add-policy">
            <Plus className="h-4 w-4 mr-2" />
            Add Policy
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-sm">Policy Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 p-2">
              {Array.from(new Set(sampleAccountingPolicies.map(p => p.category))).map(category => (
                <Button
                  key={category}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  data-testid={`button-category-${category.toLowerCase()}`}
                >
                  {category}
                  <Badge variant="secondary" className="ml-auto">
                    {sampleAccountingPolicies.filter(p => p.category === category).length}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-4">
          {sampleAccountingPolicies.map(policy => (
            <Card key={policy.policyId} data-testid={`card-policy-${policy.policyId}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {policy.policyName}
                    <Badge variant="secondary" className="text-xs">{policy.category}</Badge>
                    {policy.isBoilerplate && <Badge variant="outline" className="text-xs">Template</Badge>}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Version {policy.version} - Effective from {policy.effectiveFrom}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      policy.status === "ACTIVE" ? "default" :
                      policy.status === "DRAFT" ? "secondary" :
                      "outline"
                    }
                    data-testid={`badge-policy-status-${policy.policyId}`}
                  >
                    {policy.status}
                  </Badge>
                  <Button size="icon" variant="ghost" data-testid={`button-edit-policy-${policy.policyId}`}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm whitespace-pre-line text-muted-foreground line-clamp-4">
                  {policy.policyText}
                </div>
                {policy.linkedNotes.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">Linked to:</span>
                    {policy.linkedNotes.map(noteId => (
                      <Badge 
                        key={noteId} 
                        variant="outline" 
                        className="text-xs cursor-pointer hover-elevate"
                        data-testid={`badge-policy-note-${policy.policyId}-${noteId}`}
                      >
                        {sampleNotes.find(n => n.noteId === noteId)?.noteNumber || noteId}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMDA = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-mda-title">Management Discussion & Analysis</h1>
          <p className="text-muted-foreground">{sampleMDA.documentTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={
              sampleMDA.status === "FINAL" ? "default" :
              sampleMDA.status === "REVIEWED" ? "secondary" :
              "outline"
            }
            data-testid="badge-mda-status"
          >
            {sampleMDA.status}
          </Badge>
          <Button size="sm" variant="outline" data-testid="button-add-mda-section">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {sampleMDA.sections.map(section => (
          <Card key={section.sectionId} data-testid={`card-mda-${section.sectionId}`}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">{section.sectionTitle}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Last updated: {new Date(section.lastUpdated).toLocaleDateString()} by {section.updatedBy}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    section.status === "APPROVED" ? "default" :
                    section.status === "REVIEWED" ? "secondary" :
                    "outline"
                  }
                  data-testid={`badge-mda-section-status-${section.sectionId}`}
                >
                  {section.status}
                </Badge>
                <Button size="icon" variant="ghost" data-testid={`button-edit-mda-section-${section.sectionId}`}>
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {section.narrativeText.split('\n\n').map((para, idx) => (
                  <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                    {para.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
              
              {(section.linkedFsLines.length > 0 || section.linkedNotes.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                  {section.linkedFsLines.length > 0 && (
                    <>
                      <span className="text-xs text-muted-foreground">FS Lines:</span>
                      {section.linkedFsLines.map(lineId => (
                        <Badge 
                          key={lineId} 
                          variant="outline" 
                          className="text-xs"
                          data-testid={`badge-mda-fs-line-${section.sectionId}-${lineId}`}
                        >
                          {lineId}
                        </Badge>
                      ))}
                    </>
                  )}
                  {section.linkedNotes.length > 0 && (
                    <>
                      <span className="text-xs text-muted-foreground ml-2">Notes:</span>
                      {section.linkedNotes.map(noteId => (
                        <Badge 
                          key={noteId} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover-elevate"
                          data-testid={`badge-mda-note-${section.sectionId}-${noteId}`}
                        >
                          {sampleNotes.find(n => n.noteId === noteId)?.noteNumber || noteId}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case "disclosures":
        return renderDisclosures();
      case "schedules":
        return renderSchedules();
      case "narratives":
        return renderNarratives();
      case "review":
        return renderReview();
      case "audit":
        return renderAuditView();
      case "exports":
        return renderExports();
      case "fs-company-profile":
        return renderCompanyProfile();
      case "fs-auditor-opinion":
        return renderAuditorOpinion();
      case "fs-balance-sheet":
        return renderBalanceSheet();
      case "fs-income-statement":
        return renderIncomeStatement();
      case "fs-comprehensive-income":
        return renderComprehensiveIncome();
      case "fs-equity-statement":
        return renderEquityStatement();
      case "fs-cash-flow":
        return renderCashFlowStatement();
      case "tb-adjustments-workspace":
        return renderTBAdjustmentsWorkspace();
      case "fs-trial-balance":
        return renderTrialBalance();
      case "working-papers":
        return renderWorkingPapers();
      case "notes-basis-of-preparation":
        return renderBasisOfPreparation();
      case "notes-accounting-policies":
        return renderAccountingPolicies();
      case "notes-mda":
        return renderMDA();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {renderContent()}

      <Dialog open={showCreateNoteDialog} onOpenChange={setShowCreateNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Disclosure Note</DialogTitle>
            <DialogDescription>Add a new note to the financial statements</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="text-sm font-medium">Note #</label>
                <Input placeholder="e.g., 15" data-testid="input-note-number" />
              </div>
              <div className="col-span-3">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="e.g., Related Party Transactions" data-testid="input-note-title" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Framework</label>
              <Select>
                <SelectTrigger data-testid="select-framework">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOTH">IFRS / US GAAP</SelectItem>
                  <SelectItem value="IFRS">IFRS Only</SelectItem>
                  <SelectItem value="US_GAAP">US GAAP Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Owner</label>
              <Input placeholder="Assignee name" data-testid="input-owner" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateNoteDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateNoteDialog(false)}>Create Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateScheduleDialog} onOpenChange={setShowCreateScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>Add a disclosure schedule grid</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Schedule Title</label>
              <Input placeholder="e.g., Fixed Assets Rollforward" data-testid="input-schedule-title" />
            </div>
            <div>
              <label className="text-sm font-medium">Layout Type</label>
              <Select>
                <SelectTrigger data-testid="select-layout-type">
                  <SelectValue placeholder="Select schedule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROLLFORWARD">Rollforward</SelectItem>
                  <SelectItem value="MOVEMENT_BY_CATEGORY">Movement by Category</SelectItem>
                  <SelectItem value="TIMING_MATURITY">Timing / Maturity</SelectItem>
                  <SelectItem value="GROSS_TO_NET">Gross to Net</SelectItem>
                  <SelectItem value="COMPOSITION">Composition / Breakdown</SelectItem>
                  <SelectItem value="RECONCILIATION">Reconciliation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Template (Optional)</label>
              <Select>
                <SelectTrigger data-testid="select-template">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Template</SelectItem>
                  {sampleTemplates.map((template) => (
                    <SelectItem key={template.templateId} value={template.templateId}>
                      {template.templateName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateScheduleDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateScheduleDialog(false)}>Create Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print/Export Engine Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-lg" data-testid="dialog-export">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Generate Financial Statements
            </DialogTitle>
            <DialogDescription>
              Export complete financial statements package for {activePeriod.periodLabel}
            </DialogDescription>
          </DialogHeader>
          
          {!isExporting ? (
            <div className="space-y-6 py-4">
              {/* Format Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Output Format</label>
                <div className="flex gap-2">
                  <Button
                    variant={exportOptions.format === "pdf" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportOptions(prev => ({ ...prev, format: "pdf" }))}
                    data-testid="button-format-pdf"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant={exportOptions.format === "excel" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportOptions(prev => ({ ...prev, format: "excel" }))}
                    data-testid="button-format-excel"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                  <Button
                    variant={exportOptions.format === "word" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportOptions(prev => ({ ...prev, format: "word" }))}
                    data-testid="button-format-word"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Word
                  </Button>
                </div>
              </div>

              {/* Statements Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Include Statements</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "balance-sheet", label: "Balance Sheet" },
                    { id: "income-statement", label: "Income Statement" },
                    { id: "equity-statement", label: "Changes in Equity" },
                    { id: "cash-flow", label: "Cash Flow Statement" }
                  ].map(stmt => (
                    <Button
                      key={stmt.id}
                      variant={exportOptions.selectedStatements.includes(stmt.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleStatementSelection(stmt.id)}
                      className="justify-start"
                      data-testid={`button-stmt-${stmt.id}`}
                    >
                      {exportOptions.selectedStatements.includes(stmt.id) && (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      {stmt.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content Options */}
              <div>
                <label className="text-sm font-medium mb-2 block">Additional Content</label>
                <div className="space-y-2">
                  <Button
                    variant={exportOptions.includeNotes ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setExportOptions(prev => ({ ...prev, includeNotes: !prev.includeNotes }))}
                    data-testid="button-include-notes"
                  >
                    {exportOptions.includeNotes && <CheckCircle2 className="w-4 h-4 mr-2" />}
                    <FileText className="w-4 h-4 mr-2" />
                    Include Disclosure Notes
                  </Button>
                  <Button
                    variant={exportOptions.includeSchedules ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setExportOptions(prev => ({ ...prev, includeSchedules: !prev.includeSchedules }))}
                    data-testid="button-include-schedules"
                  >
                    {exportOptions.includeSchedules && <CheckCircle2 className="w-4 h-4 mr-2" />}
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Include Schedules
                  </Button>
                  <Button
                    variant={exportOptions.includeWorkingPapers ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setExportOptions(prev => ({ ...prev, includeWorkingPapers: !prev.includeWorkingPapers }))}
                    data-testid="button-include-wp"
                  >
                    {exportOptions.includeWorkingPapers && <CheckCircle2 className="w-4 h-4 mr-2" />}
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Include Working Papers
                  </Button>
                </div>
              </div>

              {/* Period Lock Option */}
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                <Button
                  variant={exportOptions.lockPeriod ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setExportOptions(prev => ({ ...prev, lockPeriod: !prev.lockPeriod }))}
                  data-testid="button-lock-period"
                >
                  {exportOptions.lockPeriod ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                  Lock Period After Export
                </Button>
                <p className="text-xs text-muted-foreground mt-1 ml-1">
                  Prevent further changes to {activePeriod.periodLabel}
                </p>
              </div>

              {/* Watermark Option */}
              <Button
                variant={exportOptions.watermark ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => setExportOptions(prev => ({ ...prev, watermark: !prev.watermark }))}
                data-testid="button-watermark"
              >
                {exportOptions.watermark && <CheckCircle2 className="w-4 h-4 mr-2" />}
                <AlertCircle className="w-4 h-4 mr-2" />
                Add DRAFT watermark
              </Button>
            </div>
          ) : (
            /* Export Progress */
            <div className="py-8 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <FileDown className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="font-semibold text-lg">Generating Financial Statements</h3>
                <p className="text-sm text-muted-foreground mt-1">Please wait while we compile your documents...</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">{exportProgress}% complete</p>
            </div>
          )}

          {!isExporting && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleGenerateFinancialStatements}
                disabled={exportOptions.selectedStatements.length === 0}
                data-testid="button-export-generate"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate {exportOptions.format.toUpperCase()}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

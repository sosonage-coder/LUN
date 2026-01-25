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
} from "@/lib/nettool-data";
import type { DisclosureNote, DisclosureSchedule, NarrativeBlock, DisclosureTemplate, ScheduleLayoutType, FSLineItem, TBLine, TBColumn, FSCategory, TBFootnote } from "@shared/schema";
import { EyeOff } from "lucide-react";

export default function NetToolPage() {
  const [, params] = useRoute("/nettool/:section");
  const [, fsParams] = useRoute("/nettool/fs/:fsSection");
  const section = fsParams?.fsSection ? `fs-${fsParams.fsSection}` : (params?.section || "dashboard");
  
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
    let totalOpeningDebit = 0;
    let totalOpeningCredit = 0;
    let totalClosingDebit = 0;
    let totalClosingCredit = 0;
    
    tbLines.forEach(line => {
      totalOpeningDebit += line.openingDebit;
      totalOpeningCredit += line.openingCredit;
      totalClosingDebit += line.closingDebit;
      totalClosingCredit += line.closingCredit;
    });
    
    return { totalOpeningDebit, totalOpeningCredit, totalClosingDebit, totalClosingCredit };
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
      normalBalance: "DEBIT",
      openingDebit: 0,
      openingCredit: 0,
      amounts: movementCols.reduce((acc, col) => ({ ...acc, [col.columnId]: 0 }), {}),
      closingDebit: 0,
      closingCredit: 0,
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
      
      // Opening + Net Movement = Closing
      // For debit normal: positive movement increases debit
      // For credit normal: negative movement increases credit
      let closingDebit = line.openingDebit;
      let closingCredit = line.openingCredit;
      
      if (line.normalBalance === "DEBIT") {
        closingDebit = Math.max(0, line.openingDebit + netMovement);
        closingCredit = Math.max(0, line.openingCredit - netMovement);
      } else {
        closingCredit = Math.max(0, line.openingCredit - netMovement);
        closingDebit = Math.max(0, line.openingDebit + netMovement);
      }
      
      return { ...line, amounts: updatedAmounts, closingDebit, closingCredit };
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

  const renderTrialBalance = () => {
    const totals = calculateTBTotals();
    const isBalanced = Math.abs(totals.totalClosingDebit - totals.totalClosingCredit) < 0.01;
    
    // Get adjustment columns (MOVEMENT, ADJUSTMENT, USER) - these show net amounts
    const adjustmentColumns = tbColumns.filter(c => 
      c.columnType === "MOVEMENT" || c.columnType === "ADJUSTMENT" || c.columnType === "USER"
    );
    const visibleAdjColumns = adjustmentColumns.filter(c => c.isVisible);
    const hasNetMoveCol = tbColumns.some(c => c.columnType === "NET_MOVEMENT");

    // Format net amount (positive = DR, negative = CR)
    const formatNetAmount = (amount: number): string => {
      if (amount === 0) return "-";
      const formatted = formatCurrency(Math.abs(amount));
      return amount < 0 ? `(${formatted})` : formatted;
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-tb-title">Trial Balance</h1>
            <p className="text-muted-foreground">{sampleTBWorkspace.entityName} - {sampleTBWorkspace.periodLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground" data-testid="badge-tb-readonly">
              <Lock className="w-3 h-3 mr-1" />
              Opening Locked
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
                <CardTitle className="text-lg">Trial Balance Workspace</CardTitle>
                <CardDescription>Manage GL accounts, add adjustments, and tag for FS/Footnotes</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Column visibility toggles */}
                {adjustmentColumns.length > 0 && (
                  <div className="flex items-center gap-1 border rounded-md p-1">
                    <span className="text-xs text-muted-foreground px-1">Show:</span>
                    {adjustmentColumns.map(col => (
                      <Button
                        key={col.columnId}
                        variant={col.isVisible ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 text-xs px-2"
                        onClick={() => toggleColumnVisibility(col.columnId)}
                        data-testid={`toggle-col-${col.columnId}`}
                      >
                        {col.isVisible ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        {col.columnLabel}
                      </Button>
                    ))}
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={() => setShowAddColumnDialog(true)} data-testid="button-add-column">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Column
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAddRowDialog(true)} data-testid="button-add-row">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Row
                </Button>
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
                    <TableHead className="w-32">Footnotes</TableHead>
                    <TableHead className="text-center w-28" colSpan={2}>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Opening Balance</span>
                        <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                      </div>
                    </TableHead>
                    {/* Visible adjustment columns - single net column each */}
                    {visibleAdjColumns.map(col => (
                      <TableHead key={col.columnId} className="text-center w-24">
                        <div className="flex flex-col items-center">
                          <span className="text-xs">{col.columnLabel}</span>
                          <span className="text-[10px] text-muted-foreground">DR(+)/CR(-)</span>
                        </div>
                      </TableHead>
                    ))}
                    {/* Net Movement column */}
                    {hasNetMoveCol && (
                      <TableHead className="text-center w-24 bg-accent/30">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-semibold">Net Move</span>
                          <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                        </div>
                      </TableHead>
                    )}
                    <TableHead className="text-center w-28" colSpan={2}>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">Closing Balance</span>
                        <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                      </div>
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableHead className="sticky left-0 bg-muted/30 z-10"></TableHead>
                    <TableHead className="sticky left-20 bg-muted/30 z-10"></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead className="text-right text-xs">Debit</TableHead>
                    <TableHead className="text-right text-xs">Credit</TableHead>
                    {visibleAdjColumns.map(col => (
                      <TableHead key={`${col.columnId}-net`} className="text-right text-xs">Net</TableHead>
                    ))}
                    {hasNetMoveCol && <TableHead className="text-right text-xs bg-accent/30">Net</TableHead>}
                    <TableHead className="text-right text-xs font-semibold">Debit</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tbLines.map(line => {
                    const netMovement = calculateNetMovement(line);
                    const lineFootnotes = tbFootnotes.filter(fn => line.footnoteIds.includes(fn.footnoteId));
                    
                    return (
                      <TableRow key={line.lineId} className="hover-elevate" data-testid={`row-tb-${line.accountCode}`}>
                        <TableCell className="font-mono text-sm sticky left-0 bg-background z-10">{line.accountCode}</TableCell>
                        <TableCell className="sticky left-20 bg-background z-10 text-sm">{line.accountName}</TableCell>
                        {/* FS Category */}
                        <TableCell>
                          {editingFsCategory === line.lineId ? (
                            <Select
                              value={line.fsCategory || ""}
                              onValueChange={(value) => handleFsCategoryUpdate(line.lineId, value === "none" ? null : value as FSCategory)}
                            >
                              <SelectTrigger className="h-7 text-xs" data-testid={`select-fs-category-${line.accountCode}`}>
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
                              onClick={() => setEditingFsCategory(line.lineId)}
                              data-testid={`badge-fs-category-${line.accountCode}`}
                            >
                              {line.fsCategory ? fsCategoryLabels[line.fsCategory] : "Tag"}
                            </Badge>
                          )}
                        </TableCell>
                        {/* Footnotes */}
                        <TableCell>
                          {editingFootnotes === line.lineId ? (
                            <Select
                              value={line.footnoteIds[0] || ""}
                              onValueChange={(value) => handleFootnoteUpdate(line.lineId, value ? [value] : [])}
                            >
                              <SelectTrigger className="h-7 text-xs" data-testid={`select-footnote-${line.accountCode}`}>
                                <SelectValue placeholder="Add note" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {tbFootnotes.map((fn) => (
                                  <SelectItem key={fn.footnoteId} value={fn.footnoteId}>{fn.footnoteCode}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div 
                              className="flex flex-wrap gap-1 cursor-pointer"
                              onClick={() => setEditingFootnotes(line.lineId)}
                              data-testid={`footnotes-${line.accountCode}`}
                            >
                              {lineFootnotes.length > 0 ? (
                                lineFootnotes.map(fn => (
                                  <Badge key={fn.footnoteId} variant="outline" className="text-[10px] px-1">
                                    {fn.footnoteCode}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="text-[10px] text-muted-foreground px-1">
                                  + Note
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        {/* Opening Balance - Locked */}
                        <TableCell className="text-right font-mono text-sm bg-muted/20">
                          {line.openingDebit > 0 ? formatCurrency(line.openingDebit) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm bg-muted/20">
                          {line.openingCredit > 0 ? formatCurrency(line.openingCredit) : "-"}
                        </TableCell>
                        {/* Adjustment Columns - Net Amount (editable) */}
                        {visibleAdjColumns.map(col => {
                          const amount = (line.amounts[col.columnId] as number) || 0;
                          return (
                            <TableCell key={col.columnId} className="text-right font-mono text-sm">
                              {editingCell?.lineId === line.lineId && editingCell?.columnId === col.columnId ? (
                                <Input
                                  type="number"
                                  className="h-6 w-20 text-right text-xs"
                                  defaultValue={amount}
                                  autoFocus
                                  onBlur={(e) => handleCellUpdate(line.lineId, col.columnId, parseFloat(e.target.value) || 0)}
                                  onKeyDown={(e) => e.key === "Enter" && handleCellUpdate(line.lineId, col.columnId, parseFloat((e.target as HTMLInputElement).value) || 0)}
                                  data-testid={`input-tb-${line.accountCode}-${col.columnId}`}
                                />
                              ) : (
                                <span 
                                  className={`cursor-pointer hover:bg-muted rounded px-1 ${amount < 0 ? "text-red-600 dark:text-red-400" : ""}`}
                                  onClick={() => !col.isLocked && setEditingCell({ lineId: line.lineId, columnId: col.columnId })}
                                >
                                  {formatNetAmount(amount)}
                                </span>
                              )}
                            </TableCell>
                          );
                        })}
                        {/* Net Movement - Calculated */}
                        {hasNetMoveCol && (
                          <TableCell className={`text-right font-mono text-sm bg-accent/30 font-semibold ${netMovement < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                            {formatNetAmount(netMovement)}
                          </TableCell>
                        )}
                        {/* Closing Balance - Calculated */}
                        <TableCell className="text-right font-mono text-sm font-semibold bg-primary/5">
                          {line.closingDebit > 0 ? formatCurrency(line.closingDebit) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-semibold bg-primary/5">
                          {line.closingCredit > 0 ? formatCurrency(line.closingCredit) : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Totals Row */}
                  <TableRow className="bg-muted font-bold border-t-2">
                    <TableCell className="sticky left-0 bg-muted z-10" colSpan={2}>TOTALS</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-mono" data-testid="text-tb-opening-debit-total">{formatCurrency(totals.totalOpeningDebit)}</TableCell>
                    <TableCell className="text-right font-mono" data-testid="text-tb-opening-credit-total">{formatCurrency(totals.totalOpeningCredit)}</TableCell>
                    {visibleAdjColumns.map(col => {
                      const colTotal = tbLines.reduce((sum, line) => sum + ((line.amounts[col.columnId] as number) || 0), 0);
                      return (
                        <TableCell key={`${col.columnId}-total`} className={`text-right font-mono ${colTotal < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                          {formatNetAmount(colTotal)}
                        </TableCell>
                      );
                    })}
                    {hasNetMoveCol && (
                      <TableCell className="text-right font-mono bg-accent/30">
                        {formatNetAmount(tbLines.reduce((sum, line) => sum + calculateNetMovement(line), 0))}
                      </TableCell>
                    )}
                    <TableCell className="text-right font-mono bg-primary/10" data-testid="text-tb-closing-debit-total">{formatCurrency(totals.totalClosingDebit)}</TableCell>
                    <TableCell className="text-right font-mono bg-primary/10" data-testid="text-tb-closing-credit-total">{formatCurrency(totals.totalClosingCredit)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* FS Category Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Statement Category Summary</CardTitle>
            <CardDescription>Auto-population mapping for financial statements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(fsCategoryLabels).slice(0, 8).map(([key, label]) => {
                const categoryLines = tbLines.filter(l => l.fsCategory === key);
                const totalDebit = categoryLines.reduce((sum, l) => sum + l.closingDebit, 0);
                const totalCredit = categoryLines.reduce((sum, l) => sum + l.closingCredit, 0);
                const netAmount = totalDebit - totalCredit;
                
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

        {/* Add Column Dialog */}
        <Dialog open={showAddColumnDialog} onOpenChange={setShowAddColumnDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Adjustment Column</DialogTitle>
              <DialogDescription>Add a new adjustment column (net amount: DR positive, CR negative)</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Column Label</label>
                <Input 
                  placeholder="e.g., Tax Adjustments" 
                  value={newColumnLabel}
                  onChange={(e) => setNewColumnLabel(e.target.value)}
                  data-testid="input-new-column-label"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddColumnDialog(false)}>Cancel</Button>
              <Button onClick={handleAddColumn} data-testid="button-confirm-add-column">Add Column</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Row Dialog */}
        <Dialog open={showAddRowDialog} onOpenChange={setShowAddRowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Account Row</DialogTitle>
              <DialogDescription>Add a new GL account to the trial balance</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Account Code</label>
                <Input 
                  placeholder="e.g., 1400" 
                  value={newRowAccountCode}
                  onChange={(e) => setNewRowAccountCode(e.target.value)}
                  data-testid="input-new-row-code"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Account Name</label>
                <Input 
                  placeholder="e.g., Other Receivables" 
                  value={newRowAccountName}
                  onChange={(e) => setNewRowAccountName(e.target.value)}
                  data-testid="input-new-row-name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddRowDialog(false)}>Cancel</Button>
              <Button onClick={handleAddRow} data-testid="button-confirm-add-row">Add Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

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
      case "fs-equity-statement":
        return renderEquityStatement();
      case "fs-cash-flow":
        return renderCashFlowStatement();
      case "fs-trial-balance":
        return renderTrialBalance();
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
    </div>
  );
}

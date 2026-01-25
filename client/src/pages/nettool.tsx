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
} from "@/lib/nettool-data";
import type { DisclosureNote, DisclosureSchedule, NarrativeBlock, DisclosureTemplate, ScheduleLayoutType } from "@shared/schema";

export default function NetToolPage() {
  const [, params] = useRoute("/nettool/:section");
  const section = params?.section || "dashboard";
  
  const [selectedNote, setSelectedNote] = useState<DisclosureNote | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<DisclosureSchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateNoteDialog, setShowCreateNoteDialog] = useState(false);
  const [showCreateScheduleDialog, setShowCreateScheduleDialog] = useState(false);
  
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

import { useState } from "react";
import { useRoute } from "wouter";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
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
  Edit,
  CheckCircle,
  Table2,
  Link2,
  Paperclip,
  FileIcon,
  Upload,
  ExternalLink,
  AlertTriangle,
  CircleDot,
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
  
  const { toast } = useToast();
  
  const [selectedNote, setSelectedNote] = useState<DisclosureNote | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<DisclosureSchedule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateNoteDialog, setShowCreateNoteDialog] = useState(false);
  const [showCreateScheduleDialog, setShowCreateScheduleDialog] = useState(false);
  
  // CRUD State Management for Schedules, Notes, Narratives
  const [schedules, setSchedules] = useState<DisclosureSchedule[]>(sampleSchedules);
  const [notes, setNotes] = useState<DisclosureNote[]>(sampleNotes);
  const [narratives, setNarratives] = useState<NarrativeBlock[]>(sampleNarratives);
  
  // Schedule CRUD dialogs
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [showEditScheduleDialog, setShowEditScheduleDialog] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<DisclosureSchedule | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<DisclosureSchedule | null>(null);
  const [showDeleteScheduleDialog, setShowDeleteScheduleDialog] = useState(false);
  const [newScheduleTitle, setNewScheduleTitle] = useState("");
  const [newScheduleLayout, setNewScheduleLayout] = useState<ScheduleLayoutType>("ROLLFORWARD");
  const [newScheduleNoteId, setNewScheduleNoteId] = useState("");
  
  // Note CRUD dialogs
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showEditNoteDialog, setShowEditNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<DisclosureNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<DisclosureNote | null>(null);
  const [showDeleteNoteDialog, setShowDeleteNoteDialog] = useState(false);
  const [newNoteNumber, setNewNoteNumber] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteFramework, setNewNoteFramework] = useState<"IFRS" | "US_GAAP" | "BOTH">("BOTH");
  
  // Narrative CRUD dialogs
  const [showAddNarrativeDialog, setShowAddNarrativeDialog] = useState(false);
  const [showEditNarrativeDialog, setShowEditNarrativeDialog] = useState(false);
  const [narrativeToEdit, setNarrativeToEdit] = useState<NarrativeBlock | null>(null);
  const [narrativeToDelete, setNarrativeToDelete] = useState<NarrativeBlock | null>(null);
  const [showDeleteNarrativeDialog, setShowDeleteNarrativeDialog] = useState(false);
  const [newNarrativeContent, setNewNarrativeContent] = useState("");
  const [newNarrativeNoteId, setNewNarrativeNoteId] = useState("");
  
  // Working Paper CRUD dialogs
  const [showAddWPDialog, setShowAddWPDialog] = useState(false);
  const [showEditWPDialog, setShowEditWPDialog] = useState(false);
  const [wpToEdit, setWpToEdit] = useState<WorkingPaper | null>(null);
  const [wpToDelete, setWpToDelete] = useState<WorkingPaper | null>(null);
  const [showDeleteWPDialog, setShowDeleteWPDialog] = useState(false);
  const [newWPName, setNewWPName] = useState("");
  const [newWPType, setNewWPType] = useState<"ROLLFORWARD" | "AGING" | "LINEAR" | "CUSTOM">("ROLLFORWARD");
  
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
  const [showLinkTBDialog, setShowLinkTBDialog] = useState(false);
  const [showAddWPNoteDialog, setShowAddWPNoteDialog] = useState(false);
  const [newWPNoteContent, setNewWPNoteContent] = useState("");
  const [showAddAttachmentDialog, setShowAddAttachmentDialog] = useState(false);
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentDesc, setNewAttachmentDesc] = useState("");
  const [selectedTBAccounts, setSelectedTBAccounts] = useState<string[]>([]);
  
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
  
  // Template Repository state
  const [templates, setTemplates] = useState<DisclosureTemplate[]>(sampleTemplates);
  const [templateTab, setTemplateTab] = useState<"disclosure" | "working-paper" | "reconciliation" | "close-control">("disclosure");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DisclosureTemplate | null>(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateLayout, setNewTemplateLayout] = useState<ScheduleLayoutType>("ROLLFORWARD");
  const [newTemplateFramework, setNewTemplateFramework] = useState<"IFRS" | "US_GAAP" | "BOTH">("BOTH");
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<{
    name: string;
    type: string;
    category: "disclosure" | "working-paper" | "reconciliation" | "close-control";
    layoutType?: ScheduleLayoutType;
    framework?: string;
    description: string;
    columns: string[];
    sampleData?: { [key: string]: string | number }[];
  } | null>(null);
  
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
  
  const kpis = calculateDashboardKPIs(notes, schedules, narratives, sampleReviews);
  const activePeriod = samplePeriods.find(p => p.state !== "FINAL") || samplePeriods[0];
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.noteTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.noteNumber.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || note.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScheduleForNote = (noteId: string) => {
    return schedules.filter(s => s.noteId === noteId);
  };

  const getNarrativesForNote = (noteId: string) => {
    return narratives.filter(n => n.noteId === noteId);
  };

  // ===== SCHEDULE CRUD HANDLERS =====
  const handleAddSchedule = () => {
    if (!newScheduleTitle.trim()) {
      toast({ title: "Error", description: "Schedule title is required", variant: "destructive" });
      return;
    }
    const newSchedule: DisclosureSchedule = {
      scheduleId: crypto.randomUUID(),
      noteId: newScheduleNoteId || notes[0]?.noteId || "",
      scheduleTitle: newScheduleTitle,
      layoutType: newScheduleLayout,
      columns: [],
      rows: [],
      textBlocks: [],
      cellValues: {},
      templateId: null,
      supportAttachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSchedules(prev => [...prev, newSchedule]);
    setShowAddScheduleDialog(false);
    setNewScheduleTitle("");
    setNewScheduleLayout("ROLLFORWARD");
    setNewScheduleNoteId("");
    toast({ title: "Success", description: "Schedule created successfully" });
  };

  const handleEditSchedule = () => {
    if (!scheduleToEdit) return;
    setSchedules(prev => prev.map(s => 
      s.scheduleId === scheduleToEdit.scheduleId ? scheduleToEdit : s
    ));
    setShowEditScheduleDialog(false);
    setScheduleToEdit(null);
    toast({ title: "Success", description: "Schedule updated successfully" });
  };

  const handleDeleteSchedule = () => {
    if (!scheduleToDelete) return;
    setSchedules(prev => prev.filter(s => s.scheduleId !== scheduleToDelete.scheduleId));
    setShowDeleteScheduleDialog(false);
    setScheduleToDelete(null);
    toast({ title: "Success", description: "Schedule deleted successfully" });
  };

  // ===== NOTE CRUD HANDLERS =====
  const handleAddNote = () => {
    if (!newNoteNumber.trim() || !newNoteTitle.trim()) {
      toast({ title: "Error", description: "Note number and title are required", variant: "destructive" });
      return;
    }
    const newNote: DisclosureNote = {
      noteId: crypto.randomUUID(),
      noteNumber: newNoteNumber,
      noteTitle: newNoteTitle,
      periodId: activePeriod.periodId,
      framework: newNoteFramework,
      status: "DRAFT",
      owner: "Current User",
      scheduleIds: [],
      narrativeBlockIds: [],
      linkedStatementLines: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [...prev, newNote]);
    setShowAddNoteDialog(false);
    setNewNoteNumber("");
    setNewNoteTitle("");
    setNewNoteFramework("BOTH");
    toast({ title: "Success", description: "Note created successfully" });
  };

  const handleEditNote = () => {
    if (!noteToEdit) return;
    setNotes(prev => prev.map(n => 
      n.noteId === noteToEdit.noteId ? noteToEdit : n
    ));
    setShowEditNoteDialog(false);
    setNoteToEdit(null);
    toast({ title: "Success", description: "Note updated successfully" });
  };

  const handleDeleteNote = () => {
    if (!noteToDelete) return;
    setNotes(prev => prev.filter(n => n.noteId !== noteToDelete.noteId));
    setShowDeleteNoteDialog(false);
    setNoteToDelete(null);
    toast({ title: "Success", description: "Note deleted successfully" });
  };

  // ===== NARRATIVE CRUD HANDLERS =====
  const handleAddNarrative = () => {
    if (!newNarrativeContent.trim()) {
      toast({ title: "Error", description: "Narrative content is required", variant: "destructive" });
      return;
    }
    const newNarrative: NarrativeBlock = {
      narrativeId: crypto.randomUUID(),
      noteId: newNarrativeNoteId || notes[0]?.noteId || "",
      content: newNarrativeContent,
      status: "DRAFT",
      owner: "Current User",
      linkedScheduleIds: [],
      linkedMovements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNarratives(prev => [...prev, newNarrative]);
    setShowAddNarrativeDialog(false);
    setNewNarrativeContent("");
    setNewNarrativeNoteId("");
    toast({ title: "Success", description: "Narrative created successfully" });
  };

  const handleEditNarrative = () => {
    if (!narrativeToEdit) return;
    setNarratives(prev => prev.map(n => 
      n.narrativeId === narrativeToEdit.narrativeId ? narrativeToEdit : n
    ));
    setShowEditNarrativeDialog(false);
    setNarrativeToEdit(null);
    toast({ title: "Success", description: "Narrative updated successfully" });
  };

  const handleDeleteNarrative = () => {
    if (!narrativeToDelete) return;
    setNarratives(prev => prev.filter(n => n.narrativeId !== narrativeToDelete.narrativeId));
    setShowDeleteNarrativeDialog(false);
    setNarrativeToDelete(null);
    toast({ title: "Success", description: "Narrative deleted successfully" });
  };

  // ===== WORKING PAPER CRUD HANDLERS =====
  const handleAddWorkingPaper = () => {
    if (!newWPName.trim()) {
      toast({ title: "Error", description: "Working paper name is required", variant: "destructive" });
      return;
    }
    const newWP: WorkingPaper = {
      workingPaperId: crypto.randomUUID(),
      name: newWPName,
      type: newWPType,
      periodId: activePeriod.periodId,
      columns: [],
      rows: [],
      textBlocks: [],
      linkedFsLines: [],
      linkedNotes: [],
      frozenRows: 0,
      status: "DRAFT",
      linkedAccountCodes: [],
      tbSourceAmount: null,
      wpTotalAmount: null,
      variance: null,
      tieOutStatus: "INCOMPLETE",
      wpNotes: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
      lastUpdated: new Date().toISOString(),
      updatedBy: "Current User",
    };
    setWorkingPapers(prev => [...prev, newWP]);
    setShowAddWPDialog(false);
    setNewWPName("");
    setNewWPType("ROLLFORWARD");
    toast({ title: "Success", description: "Working paper created successfully" });
  };

  const handleEditWorkingPaper = () => {
    if (!wpToEdit) return;
    setWorkingPapers(prev => prev.map(wp => 
      wp.workingPaperId === wpToEdit.workingPaperId ? wpToEdit : wp
    ));
    setShowEditWPDialog(false);
    setWpToEdit(null);
    toast({ title: "Success", description: "Working paper updated successfully" });
  };

  const handleDeleteWorkingPaper = () => {
    if (!wpToDelete) return;
    setWorkingPapers(prev => prev.filter(wp => wp.workingPaperId !== wpToDelete.workingPaperId));
    setShowDeleteWPDialog(false);
    setWpToDelete(null);
    toast({ title: "Success", description: "Working paper deleted successfully" });
  };

  const handleAddWPNote = () => {
    if (!selectedWorkingPaper || !newWPNoteContent.trim()) return;
    
    const newNote = {
      noteId: `wn-${Date.now()}`,
      content: newWPNoteContent.trim(),
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
    };
    
    setWorkingPapers(prev => prev.map(wp => 
      wp.workingPaperId === selectedWorkingPaper.workingPaperId
        ? { ...wp, wpNotes: [...(wp.wpNotes || []), newNote] }
        : wp
    ));
    
    setSelectedWorkingPaper(prev => 
      prev ? { ...prev, wpNotes: [...(prev.wpNotes || []), newNote] } : null
    );
    
    setNewWPNoteContent("");
    setShowAddWPNoteDialog(false);
    toast({ title: "Success", description: "Note added successfully" });
  };

  const handleAddAttachment = () => {
    if (!selectedWorkingPaper || !newAttachmentName.trim()) return;
    
    const newAttachment = {
      attachmentId: `att-${Date.now()}`,
      fileName: newAttachmentName.trim(),
      fileType: "application/pdf",
      fileSize: Math.floor(Math.random() * 500000) + 50000,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Current User",
      description: newAttachmentDesc.trim() || undefined,
    };
    
    setWorkingPapers(prev => prev.map(wp => 
      wp.workingPaperId === selectedWorkingPaper.workingPaperId
        ? { ...wp, attachments: [...(wp.attachments || []), newAttachment] }
        : wp
    ));
    
    setSelectedWorkingPaper(prev => 
      prev ? { ...prev, attachments: [...(prev.attachments || []), newAttachment] } : null
    );
    
    setNewAttachmentName("");
    setNewAttachmentDesc("");
    setShowAddAttachmentDialog(false);
    toast({ title: "Success", description: "Attachment uploaded successfully" });
  };

  const handleLinkTB = () => {
    if (!selectedWorkingPaper) return;
    
    // Calculate TB source amount from linked accounts
    const totalFromTB = selectedTBAccounts.reduce((sum, code) => {
      const line = adjLines.find(l => l.accountCode === code);
      return sum + (line?.finalBalance || 0);
    }, 0);
    
    // Get WP total from last TOTAL row
    const sortedRows = [...selectedWorkingPaper.rows].sort((a, b) => a.orderIndex - b.orderIndex);
    const totalRow = sortedRows.find(r => r.rowType === "TOTAL");
    let wpTotal = 0;
    if (totalRow) {
      // Find the closing/total column value
      const closingCols = ["col-closing", "col-total", "col-cy"];
      for (const colId of closingCols) {
        if (typeof totalRow.values[colId] === "number") {
          wpTotal = totalRow.values[colId] as number;
          break;
        }
      }
    }
    
    const variance = totalFromTB - wpTotal;
    const tieOutStatus = selectedTBAccounts.length === 0 
      ? "INCOMPLETE" as const
      : variance === 0 
        ? "TIED" as const 
        : "VARIANCE" as const;
    
    const updatedWP = {
      ...selectedWorkingPaper,
      linkedAccountCodes: selectedTBAccounts,
      tbSourceAmount: selectedTBAccounts.length > 0 ? totalFromTB : null,
      wpTotalAmount: wpTotal,
      variance: selectedTBAccounts.length > 0 ? variance : null,
      tieOutStatus,
    };
    
    setWorkingPapers(prev => prev.map(wp => 
      wp.workingPaperId === selectedWorkingPaper.workingPaperId ? updatedWP : wp
    ));
    
    setSelectedWorkingPaper(updatedWP);
    setShowLinkTBDialog(false);
    toast({ 
      title: "Success", 
      description: `Linked ${selectedTBAccounts.length} TB account(s). Status: ${tieOutStatus}` 
    });
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
        <Button onClick={() => setShowAddNoteDialog(true)} data-testid="button-create-note">
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
          const noteSchedules = getScheduleForNote(note.noteId);
          const noteNarratives = getNarrativesForNote(note.noteId);
          return (
            <Card 
              key={note.noteId} 
              className="hover-elevate cursor-pointer"
              data-testid={`card-note-${note.noteNumber}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="flex items-start gap-4 flex-1 cursor-pointer"
                    onClick={() => setSelectedNote(note)}
                  >
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
                          {noteSchedules.length} schedule{noteSchedules.length !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {noteNarratives.length} narrative{noteNarratives.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(note.status)}>
                      {note.status.replace("_", " ")}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToEdit(note);
                        setShowEditNoteDialog(true);
                      }}
                      data-testid={`button-edit-note-${note.noteNumber}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToDelete(note);
                        setShowDeleteNoteDialog(true);
                      }}
                      data-testid={`button-delete-note-${note.noteNumber}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
        <Button onClick={() => setShowAddScheduleDialog(true)} data-testid="button-create-schedule">
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </Button>
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule) => {
          const note = notes.find(n => n.noteId === schedule.noteId);
          return (
            <Card 
              key={schedule.scheduleId}
              className="hover-elevate cursor-pointer"
              data-testid={`card-schedule-${schedule.scheduleId}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="space-y-1 flex-1 cursor-pointer"
                    onClick={() => setSelectedSchedule(schedule)}
                  >
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
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setScheduleToEdit(schedule);
                        setShowEditScheduleDialog(true);
                      }}
                      data-testid={`button-edit-schedule-${schedule.scheduleId}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setScheduleToDelete(schedule);
                        setShowDeleteScheduleDialog(true);
                      }}
                      data-testid={`button-delete-schedule-${schedule.scheduleId}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
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
        <Button onClick={() => setShowAddNarrativeDialog(true)} data-testid="button-create-narrative">
          <Plus className="h-4 w-4 mr-2" />
          New Narrative
        </Button>
      </div>

      <div className="grid gap-4">
        {narratives.map((narrative) => {
          const note = notes.find(n => n.noteId === narrative.noteId);
          return (
            <Card key={narrative.narrativeId} data-testid={`card-narrative-${narrative.narrativeId}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Note {note?.noteNumber}</Badge>
                    <span className="font-medium">{note?.noteTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(narrative.status)}>
                      {narrative.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setNarrativeToEdit(narrative);
                        setShowEditNarrativeDialog(true);
                      }}
                      data-testid={`button-edit-narrative-${narrative.narrativeId}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setNarrativeToDelete(narrative);
                        setShowDeleteNarrativeDialog(true);
                      }}
                      data-testid={`button-delete-narrative-${narrative.narrativeId}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
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
    
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const marginLeft = 15;
      const marginRight = 15;
      const pageWidth = pdf.internal.pageSize.width - marginLeft - marginRight;
      
      // Add title
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Financial Statements - ${activePeriod.periodLabel}`, marginLeft, yPosition);
      
      // Add company name
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      yPosition += 10;
      pdf.text(sampleCompanyProfile.legalEntityName, marginLeft, yPosition);
      
      // Add watermark if requested
      if (exportOptions.watermark) {
        pdf.setFontSize(60);
        pdf.setTextColor(200, 200, 200);
        pdf.setFont("helvetica", "bold");
        pdf.text("DRAFT", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });
        pdf.setTextColor(0, 0, 0);
      }
      
      yPosition += 15;
      
      // Balance Sheet
      if (exportOptions.selectedStatements.includes("balance-sheet")) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(20);
        
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Balance Sheet", marginLeft, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`As of ${sampleBalanceSheet.currentPeriodLabel}`, marginLeft, yPosition);
        yPosition += 8;
        
        const balanceSheetData: any[] = [];
        balanceSheetData.push(["", "Current Year", "Prior Year"]);
        
        // Assets
        balanceSheetData.push(["ASSETS", "", ""]);
        sampleBalanceSheet.sections.currentAssets.forEach(line => {
          balanceSheetData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        balanceSheetData.push(["", "", ""]);
        sampleBalanceSheet.sections.nonCurrentAssets.forEach(line => {
          balanceSheetData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        // Liabilities and Equity
        balanceSheetData.push(["", "", ""]);
        balanceSheetData.push(["LIABILITIES", "", ""]);
        
        sampleBalanceSheet.sections.currentLiabilities.forEach(line => {
          balanceSheetData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        balanceSheetData.push(["", "", ""]);
        sampleBalanceSheet.sections.nonCurrentLiabilities.forEach(line => {
          balanceSheetData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        // Equity
        balanceSheetData.push(["", "", ""]);
        balanceSheetData.push(["STOCKHOLDERS' EQUITY", "", ""]);
        sampleBalanceSheet.sections.equity.forEach(line => {
          balanceSheetData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        autoTable(pdf, {
          startY: yPosition,
          head: [["Description", "Current Year", "Prior Year"]],
          body: balanceSheetData,
          margin: { left: marginLeft, right: marginRight },
          columnStyles: {
            0: { cellWidth: pageWidth * 0.5 },
            1: { cellWidth: pageWidth * 0.25, halign: "right" },
            2: { cellWidth: pageWidth * 0.25, halign: "right" }
          }
        });
        
        yPosition = (pdf as any).lastAutoTable?.finalY + 15 || yPosition + 100;
      }
      
      // Check if we need a new page
      if (yPosition > pageHeight - 40 && exportOptions.selectedStatements.length > 1) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Income Statement
      if (exportOptions.selectedStatements.includes("income-statement")) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(40);
        
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Income Statement", marginLeft, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`For the ${sampleIncomeStatement.currentPeriodLabel}`, marginLeft, yPosition);
        yPosition += 8;
        
        const incomeData: any[] = [];
        incomeData.push(["", "Current Year", "Prior Year"]);
        
        sampleIncomeStatement.lines.forEach(line => {
          incomeData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        autoTable(pdf, {
          startY: yPosition,
          head: [["Description", "Current Year", "Prior Year"]],
          body: incomeData,
          margin: { left: marginLeft, right: marginRight },
          columnStyles: {
            0: { cellWidth: pageWidth * 0.5 },
            1: { cellWidth: pageWidth * 0.25, halign: "right" },
            2: { cellWidth: pageWidth * 0.25, halign: "right" }
          }
        });
        
        yPosition = (pdf as any).lastAutoTable?.finalY + 15 || yPosition + 100;
      }
      
      // Check if we need a new page
      if (yPosition > pageHeight - 40 && exportOptions.selectedStatements.length > 2) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Statement of Changes in Equity
      if (exportOptions.selectedStatements.includes("equity-statement")) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(60);
        
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Statement of Changes in Stockholders' Equity", marginLeft, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`For the Year Ended December 31, 2024`, marginLeft, yPosition);
        yPosition += 8;
        
        const equityData: any[] = [];
        equityData.push(["Component", "2024", "2023"]);
        
        sampleEquityStatement.components.forEach(component => {
          equityData.push([
            component.componentName,
            formatCurrency(component.closingBalance.current),
            formatCurrency(component.closingBalance.prior)
          ]);
        });
        
        equityData.push(["Total Stockholders' Equity", 
          formatCurrency(sampleEquityStatement.totalEquity.current),
          formatCurrency(sampleEquityStatement.totalEquity.prior)
        ]);
        
        autoTable(pdf, {
          startY: yPosition,
          head: [["Component", "2024", "2023"]],
          body: equityData,
          margin: { left: marginLeft, right: marginRight },
          columnStyles: {
            0: { cellWidth: pageWidth * 0.5 },
            1: { cellWidth: pageWidth * 0.25, halign: "right" },
            2: { cellWidth: pageWidth * 0.25, halign: "right" }
          }
        });
        
        yPosition = (pdf as any).lastAutoTable?.finalY + 15 || yPosition + 100;
      }
      
      // Check if we need a new page
      if (yPosition > pageHeight - 40 && exportOptions.selectedStatements.length > 3) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Cash Flow Statement
      if (exportOptions.selectedStatements.includes("cash-flow")) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(80);
        
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Cash Flow Statement", marginLeft, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`For the ${sampleCashFlowStatement.currentPeriodLabel}`, marginLeft, yPosition);
        yPosition += 8;
        
        const cashFlowData: any[] = [];
        cashFlowData.push(["", "Current Year", "Prior Year"]);
        
        sampleCashFlowStatement.operatingActivities.forEach(line => {
          cashFlowData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        sampleCashFlowStatement.investingActivities.forEach(line => {
          cashFlowData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        sampleCashFlowStatement.financingActivities.forEach(line => {
          cashFlowData.push([
            line.lineLabel,
            line.currentYearAmount ? formatCurrency(line.currentYearAmount) : "",
            line.priorYearAmount ? formatCurrency(line.priorYearAmount) : ""
          ]);
        });
        
        autoTable(pdf, {
          startY: yPosition,
          head: [["Description", "Current Year", "Prior Year"]],
          body: cashFlowData,
          margin: { left: marginLeft, right: marginRight },
          columnStyles: {
            0: { cellWidth: pageWidth * 0.5 },
            1: { cellWidth: pageWidth * 0.25, halign: "right" },
            2: { cellWidth: pageWidth * 0.25, halign: "right" }
          }
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportProgress(100);
      
      // Generate filename
      const filename = `Financial_Statements_${activePeriod.periodId}.pdf`;
      
      // Download PDF
      pdf.save(filename);
      
      if (exportOptions.lockPeriod) {
        console.log("Period locked for:", activePeriod.periodLabel);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsExporting(false);
      setShowExportDialog(false);
      setExportProgress(0);
    }
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
            <Button variant="outline" size="sm" onClick={() => setShowAddWPDialog(true)} data-testid="button-wp-new">
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workingPapers.map((wp) => (
                  <TableRow 
                    key={wp.workingPaperId} 
                    className="cursor-pointer hover-elevate"
                    data-testid={`row-wp-${wp.workingPaperId}`}
                  >
                    <TableCell 
                      className="font-medium cursor-pointer"
                      onClick={() => setSelectedWorkingPaper(wp)}
                    >
                      {wp.name}
                    </TableCell>
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
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWpToEdit(wp);
                            setShowEditWPDialog(true);
                          }}
                          data-testid={`button-edit-wp-${wp.workingPaperId}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWpToDelete(wp);
                            setShowDeleteWPDialog(true);
                          }}
                          data-testid={`button-delete-wp-${wp.workingPaperId}`}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedWorkingPaper(wp)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSelectedTBAccounts(wp.linkedAccountCodes || []);
                setShowLinkTBDialog(true);
              }}
              data-testid="button-wp-link-tb"
            >
              <Link2 className="w-4 h-4 mr-1" />
              Link to TB
            </Button>
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

        {/* Tie-Out Status Card */}
        <Card className={`border-l-4 ${
          wp.tieOutStatus === "TIED" ? "border-l-green-500" : 
          wp.tieOutStatus === "VARIANCE" ? "border-l-red-500" : "border-l-yellow-500"
        }`} data-testid="card-wp-tieout">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  wp.tieOutStatus === "TIED" ? "bg-green-100 dark:bg-green-900/30" : 
                  wp.tieOutStatus === "VARIANCE" ? "bg-red-100 dark:bg-red-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"
                }`}>
                  {wp.tieOutStatus === "TIED" ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : wp.tieOutStatus === "VARIANCE" ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <CircleDot className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">TB Tie-Out Status:</span>
                    <Badge 
                      variant={wp.tieOutStatus === "TIED" ? "default" : wp.tieOutStatus === "VARIANCE" ? "destructive" : "secondary"}
                      data-testid="badge-wp-tieout-status"
                    >
                      {wp.tieOutStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {wp.linkedAccountCodes?.length || 0} TB account(s) linked
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <p className="text-muted-foreground">TB Source</p>
                  <p className="font-mono font-semibold" data-testid="text-wp-tb-source">
                    {wp.tbSourceAmount !== null ? formatCurrency(wp.tbSourceAmount) : "-"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">WP Total</p>
                  <p className="font-mono font-semibold" data-testid="text-wp-total">
                    {wp.wpTotalAmount !== null ? formatCurrency(wp.wpTotalAmount) : "-"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Variance</p>
                  <p className={`font-mono font-semibold ${
                    wp.variance !== null && wp.variance !== 0 ? "text-red-600 dark:text-red-400" : ""
                  }`} data-testid="text-wp-variance">
                    {wp.variance !== null ? (wp.variance === 0 ? "-" : formatCurrency(wp.variance)) : "-"}
                  </p>
                </div>
              </div>
            </div>
            {wp.linkedAccountCodes && wp.linkedAccountCodes.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Linked Account Codes:</p>
                <div className="flex gap-1 flex-wrap">
                  {wp.linkedAccountCodes.map((code) => (
                    <Badge key={code} variant="outline" className="text-xs font-mono">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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

        {/* Analyst Notes Section */}
        <Card data-testid="card-wp-notes">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Analyst Notes
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddWPNoteDialog(true)}
                data-testid="button-wp-add-note"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Note
              </Button>
            </div>
            <CardDescription>
              {wp.wpNotes?.length || 0} note(s) recorded
            </CardDescription>
          </CardHeader>
          <CardContent>
            {wp.wpNotes && wp.wpNotes.length > 0 ? (
              <div className="space-y-3">
                {wp.wpNotes.map((note) => (
                  <div 
                    key={note.noteId} 
                    className="p-3 bg-muted/30 rounded-md border"
                    data-testid={`wp-note-${note.noteId}`}
                  >
                    <p className="text-sm">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{note.createdBy}</span>
                      <span>•</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No notes yet. Add notes to document observations and methodology.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Attachments Section */}
        <Card data-testid="card-wp-attachments">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Paperclip className="w-5 h-5" />
                Supporting Documents
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddAttachmentDialog(true)}
                data-testid="button-wp-add-attachment"
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
            </div>
            <CardDescription>
              {wp.attachments?.length || 0} attachment(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {wp.attachments && wp.attachments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wp.attachments.map((att) => (
                    <TableRow key={att.attachmentId} data-testid={`wp-attachment-${att.attachmentId}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileIcon className="w-4 h-4 text-muted-foreground" />
                          {att.fileName}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {att.description || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {(att.fileSize / 1024).toFixed(1)} KB
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(att.uploadedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" data-testid={`button-view-attachment-${att.attachmentId}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-download-attachment-${att.attachmentId}`}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No attachments yet. Upload invoices, contracts, or other supporting documents.
              </p>
            )}
          </CardContent>
        </Card>

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
      let totalSum = 0;
      
      adjLines.forEach(line => {
        totalInitial += line.initialBalance;
        totalFinal += line.finalBalance;
        // Sum is the total of all adjustments (RJE + AJE = netMovement)
        totalSum += line.netMovement;
      });
      
      return { totalInitial, totalFinal, totalSum };
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
                    <TableHead className="w-40">Footnote</TableHead>
                    <TableHead className="text-center w-28 bg-slate-100 dark:bg-slate-800">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">Initial TB</span>
                        <Lock className="w-3 h-3 mt-1 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead className="text-center w-28 bg-amber-100 dark:bg-amber-900">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold">Sum</span>
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
                      {/* Footnote Tag - Dropdown using disclosure notes */}
                      <TableCell>
                        <Select
                          value={line.footnoteIds[0] || "none"}
                          onValueChange={(value) => handleAdjFootnoteUpdate(line.lineId, value === "none" ? [] : [value])}
                        >
                          <SelectTrigger className="h-7 text-xs" data-testid={`select-adj-fn-${line.accountCode}`}>
                            <SelectValue placeholder="Select Note" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {notes.map((note) => (
                              <SelectItem key={note.noteId} value={note.noteId}>
                                Note {note.noteNumber}: {note.noteTitle.length > 25 ? note.noteTitle.substring(0, 25) + "..." : note.noteTitle}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {/* Initial TB Balance */}
                      <TableCell className={`text-right font-mono text-sm bg-slate-50 dark:bg-slate-900 ${line.initialBalance < 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                        {formatNetAmount(line.initialBalance)}
                      </TableCell>
                      {/* Sum (Total of all adjustments) */}
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
                    <TableCell className={`text-right font-mono bg-amber-100/50 dark:bg-amber-900/50 ${adjTotals.totalSum < 0 ? "text-red-600 dark:text-red-400" : adjTotals.totalSum > 0 ? "text-amber-600 dark:text-amber-400" : ""}`} data-testid="text-adj-sum-total">
                      {formatNetAmount(adjTotals.totalSum)}
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

  // Template Repository handlers
  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setNewTemplateName("");
    setNewTemplateLayout("ROLLFORWARD");
    setNewTemplateFramework("BOTH");
    setShowTemplateDialog(true);
  };

  const handleEditTemplate = (template: DisclosureTemplate) => {
    setEditingTemplate(template);
    setNewTemplateName(template.templateName);
    setNewTemplateLayout(template.layoutType);
    setNewTemplateFramework(template.framework);
    setShowTemplateDialog(true);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.templateId === editingTemplate.templateId 
          ? { ...t, templateName: newTemplateName, layoutType: newTemplateLayout, framework: newTemplateFramework }
          : t
      ));
    } else {
      const newTemplate: DisclosureTemplate = {
        templateId: `tmpl-${Date.now()}`,
        templateName: newTemplateName,
        layoutType: newTemplateLayout,
        framework: newTemplateFramework,
        defaultColumns: [],
        defaultRows: [],
        defaultTextBlocks: [],
        hiddenColumns: [],
        createdAt: new Date().toISOString(),
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setShowTemplateDialog(false);
    setEditingTemplate(null);
    setNewTemplateName("");
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.templateId !== templateId));
  };

  const handlePreviewTemplate = (template: {
    name: string;
    type: string;
    category: "disclosure" | "working-paper" | "reconciliation" | "close-control";
    layoutType?: ScheduleLayoutType;
    framework?: string;
    description: string;
    columns: string[];
    sampleData?: { [key: string]: string | number }[];
  }) => {
    setPreviewTemplate(template);
    setShowTemplatePreview(true);
  };

  const getTemplatePreviewData = (layoutType: ScheduleLayoutType): { columns: string[]; sampleData: { [key: string]: string | number }[] } => {
    switch (layoutType) {
      case "ROLLFORWARD":
        return {
          columns: ["Description", "Opening Balance", "Additions", "Disposals", "Transfers", "Revaluations", "Closing Balance"],
          sampleData: [
            { Description: "Land", "Opening Balance": 500000, Additions: 0, Disposals: 0, Transfers: 0, Revaluations: 25000, "Closing Balance": 525000 },
            { Description: "Buildings", "Opening Balance": 1200000, Additions: 150000, Disposals: 0, Transfers: 0, Revaluations: 0, "Closing Balance": 1350000 },
            { Description: "Equipment", "Opening Balance": 450000, Additions: 75000, Disposals: -25000, Transfers: 10000, Revaluations: 0, "Closing Balance": 510000 },
          ]
        };
      case "MOVEMENT_BY_CATEGORY":
        return {
          columns: ["Category", "Prior Year", "Current Year", "Change", "% Change"],
          sampleData: [
            { Category: "Operating Revenue", "Prior Year": 2500000, "Current Year": 2750000, Change: 250000, "% Change": "10%" },
            { Category: "Interest Income", "Prior Year": 45000, "Current Year": 52000, Change: 7000, "% Change": "16%" },
            { Category: "Other Income", "Prior Year": 12000, "Current Year": 8500, Change: -3500, "% Change": "-29%" },
          ]
        };
      case "TIMING_MATURITY":
        return {
          columns: ["Item", "< 1 Year", "1-2 Years", "2-5 Years", "> 5 Years", "Total"],
          sampleData: [
            { Item: "Trade Receivables", "< 1 Year": 850000, "1-2 Years": 0, "2-5 Years": 0, "> 5 Years": 0, Total: 850000 },
            { Item: "Lease Liabilities", "< 1 Year": 120000, "1-2 Years": 115000, "2-5 Years": 280000, "> 5 Years": 85000, Total: 600000 },
            { Item: "Long-term Debt", "< 1 Year": 50000, "1-2 Years": 50000, "2-5 Years": 150000, "> 5 Years": 250000, Total: 500000 },
          ]
        };
      case "GROSS_TO_NET":
        return {
          columns: ["Description", "Gross Amount", "Allowance", "Net Amount"],
          sampleData: [
            { Description: "Trade Receivables", "Gross Amount": 920000, Allowance: -45000, "Net Amount": 875000 },
            { Description: "Notes Receivable", "Gross Amount": 150000, Allowance: -12000, "Net Amount": 138000 },
            { Description: "Other Receivables", "Gross Amount": 35000, Allowance: -5000, "Net Amount": 30000 },
          ]
        };
      case "COMPOSITION":
        return {
          columns: ["Component", "Amount", "% of Total"],
          sampleData: [
            { Component: "Cash on Hand", Amount: 25000, "% of Total": "2%" },
            { Component: "Bank Accounts", Amount: 1250000, "% of Total": "83%" },
            { Component: "Money Market", Amount: 200000, "% of Total": "13%" },
            { Component: "Petty Cash", Amount: 5000, "% of Total": "<1%" },
          ]
        };
      case "RECONCILIATION":
        return {
          columns: ["Description", "Amount"],
          sampleData: [
            { Description: "Balance per Bank Statement", Amount: 1285000 },
            { Description: "Add: Deposits in Transit", Amount: 45000 },
            { Description: "Less: Outstanding Checks", Amount: -32000 },
            { Description: "Adjusted Bank Balance", Amount: 1298000 },
            { Description: "Balance per Books", Amount: 1298000 },
          ]
        };
      default:
        return { columns: ["Column 1", "Column 2", "Column 3"], sampleData: [] };
    }
  };

  const getWorkingPaperPreviewData = (type: string): { columns: string[]; sampleData: { [key: string]: string | number }[] } => {
    switch (type) {
      case "Rollforward":
        return {
          columns: ["Account", "Opening", "Debits", "Credits", "Adjustments", "Closing"],
          sampleData: [
            { Account: "Prepaid Insurance", Opening: 48000, Debits: 0, Credits: -4000, Adjustments: 0, Closing: 44000 },
            { Account: "Prepaid Rent", Opening: 72000, Debits: 0, Credits: -6000, Adjustments: 0, Closing: 66000 },
          ]
        };
      case "Aging Schedule":
        return {
          columns: ["Customer", "Current", "31-60 Days", "61-90 Days", "Over 90 Days", "Total"],
          sampleData: [
            { Customer: "ABC Corp", Current: 45000, "31-60 Days": 12000, "61-90 Days": 0, "Over 90 Days": 0, Total: 57000 },
            { Customer: "XYZ Ltd", Current: 32000, "31-60 Days": 8000, "61-90 Days": 5000, "Over 90 Days": 2000, Total: 47000 },
          ]
        };
      case "Linear Analysis":
        return {
          columns: ["Line Item", "Jan", "Feb", "Mar", "Q1 Total"],
          sampleData: [
            { "Line Item": "Revenue", Jan: 125000, Feb: 132000, Mar: 145000, "Q1 Total": 402000 },
            { "Line Item": "COGS", Jan: 75000, Feb: 78000, Mar: 85000, "Q1 Total": 238000 },
          ]
        };
      default:
        return {
          columns: ["Column A", "Column B", "Column C", "Formula"],
          sampleData: [
            { "Column A": "Row 1", "Column B": 100, "Column C": 200, Formula: 300 },
          ]
        };
    }
  };

  const getReconciliationPreviewData = (type: string): { columns: string[]; sampleData: { [key: string]: string | number }[] } => {
    switch (type) {
      case "CASH":
        return {
          columns: ["Description", "Per Bank", "Per Books", "Difference"],
          sampleData: [
            { Description: "Ending Balance", "Per Bank": 1250000, "Per Books": 1250000, Difference: 0 },
            { Description: "Outstanding Checks", "Per Bank": "", "Per Books": -32000, Difference: 32000 },
            { Description: "Deposits in Transit", "Per Bank": "", "Per Books": 45000, Difference: -45000 },
          ]
        };
      case "PREPAID":
        return {
          columns: ["Vendor", "Original Amount", "Monthly Expense", "YTD Expense", "Balance"],
          sampleData: [
            { Vendor: "Insurance Co", "Original Amount": 48000, "Monthly Expense": 4000, "YTD Expense": 8000, Balance: 40000 },
            { Vendor: "Landlord LLC", "Original Amount": 72000, "Monthly Expense": 6000, "YTD Expense": 12000, Balance: 60000 },
          ]
        };
      default:
        return {
          columns: ["Item", "Opening", "Additions", "Reductions", "Closing"],
          sampleData: [
            { Item: "Account 1", Opening: 100000, Additions: 25000, Reductions: -15000, Closing: 110000 },
          ]
        };
    }
  };

  const renderTemplateRepository = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Template Repository</h1>
          <p className="text-sm text-muted-foreground">Manage disclosure, working paper, reconciliation, and close control templates</p>
        </div>
        <Button onClick={handleAddTemplate} data-testid="button-add-template">
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <Tabs value={templateTab} onValueChange={(v) => setTemplateTab(v as typeof templateTab)}>
        <TabsList data-testid="tabs-template-types">
          <TabsTrigger value="disclosure" data-testid="tab-disclosure">Disclosure Templates</TabsTrigger>
          <TabsTrigger value="working-paper" data-testid="tab-working-paper">Working Paper Templates</TabsTrigger>
          <TabsTrigger value="reconciliation" data-testid="tab-reconciliation">Reconciliation Templates</TabsTrigger>
          <TabsTrigger value="close-control" data-testid="tab-close-control">Close Control Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="disclosure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Disclosure Templates
              </CardTitle>
              <CardDescription>Templates for financial statement disclosure schedules and notes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Layout Type</TableHead>
                    <TableHead>Framework</TableHead>
                    <TableHead>Columns</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.templateId} data-testid={`row-template-${template.templateId}`}>
                      <TableCell className="font-medium">{template.templateName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getLayoutTypeLabel(template.layoutType)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.framework === "BOTH" ? "default" : "secondary"}>
                          {getFrameworkLabel(template.framework)}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.defaultColumns.length}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const previewData = getTemplatePreviewData(template.layoutType);
                              handlePreviewTemplate({
                                name: template.templateName,
                                type: getLayoutTypeLabel(template.layoutType),
                                category: "disclosure",
                                layoutType: template.layoutType,
                                framework: getFrameworkLabel(template.framework),
                                description: `Disclosure template using ${getLayoutTypeLabel(template.layoutType)} layout`,
                                columns: previewData.columns,
                                sampleData: previewData.sampleData,
                              });
                            }}
                            data-testid={`button-preview-template-${template.templateId}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditTemplate(template)}
                            data-testid={`button-edit-template-${template.templateId}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTemplate(template.templateId)}
                            data-testid={`button-delete-template-${template.templateId}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {templates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No disclosure templates found. Click "Add Template" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="working-paper" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table2 className="h-5 w-5" />
                Working Paper Templates
              </CardTitle>
              <CardDescription>Templates for rollforward, aging, and custom working papers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Rollforward", "Aging Schedule", "Linear Analysis", "Custom Grid"].map((type, idx) => {
                  const description = type === "Rollforward" ? "Track opening to closing balance movements" :
                    type === "Aging Schedule" ? "Analyze receivables/payables by age bucket" :
                    type === "Linear Analysis" ? "Simple columnar analysis worksheets" :
                    "Flexible grid with custom columns and formulas";
                  const previewData = getWorkingPaperPreviewData(type);
                  return (
                    <Card key={type} className="hover-elevate" data-testid={`card-wp-template-${idx}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{type}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handlePreviewTemplate({
                              name: type,
                              type: "Working Paper",
                              category: "working-paper",
                              description,
                              columns: previewData.columns,
                              sampleData: previewData.sampleData,
                            })}
                            data-testid={`button-preview-wp-${idx}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline">System</Badge>
                          <span className="text-xs text-muted-foreground">Default template</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Reconciliation Templates
              </CardTitle>
              <CardDescription>Templates for balance sheet account reconciliations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Cash Reconciliation", desc: "Bank to book reconciliation with outstanding items", type: "CASH" },
                  { name: "Prepaid Schedule", desc: "Anchored to Schedule Studio prepaid schedules", type: "PREPAID" },
                  { name: "Accrual 12M Rollforward", desc: "Monthly accrual tracking with 12-month view", type: "ACCRUAL" },
                  { name: "Fixed Asset Rollforward", desc: "Asset additions, disposals, and depreciation", type: "FIXED_ASSET" },
                  { name: "Intercompany Recon", desc: "IC balance matching and elimination entries", type: "INTERCOMPANY" },
                ].map((template, idx) => {
                  const previewData = getReconciliationPreviewData(template.type);
                  return (
                    <Card key={template.type} className="hover-elevate" data-testid={`card-recon-template-${idx}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handlePreviewTemplate({
                              name: template.name,
                              type: "Reconciliation",
                              category: "reconciliation",
                              description: template.desc,
                              columns: previewData.columns,
                              sampleData: previewData.sampleData,
                            })}
                            data-testid={`button-preview-recon-${idx}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{template.desc}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="secondary">{template.type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="close-control" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Close Control Templates
              </CardTitle>
              <CardDescription>Checklist and task templates for period close management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Month-End Close Checklist", tasks: 24, category: "Monthly Close", sampleTasks: ["Reconcile bank accounts", "Post depreciation entries", "Accrue payroll expense", "Review open POs", "Post intercompany entries"] },
                  { name: "Quarter-End Close Checklist", tasks: 42, category: "Quarterly Close", sampleTasks: ["Complete month-end close", "Prepare interim financials", "Review contingencies", "Update lease schedules", "Prepare board package"] },
                  { name: "Year-End Close Checklist", tasks: 68, category: "Annual Close", sampleTasks: ["Complete quarterly close", "Year-end audit prep", "Tax provision calculation", "Goodwill impairment test", "Disclosure notes review"] },
                  { name: "Consolidation Tasks", tasks: 18, category: "Consolidation", sampleTasks: ["Collect subsidiary data", "Currency translation", "Elimination entries", "Minority interest calc", "Consolidated financials"] },
                  { name: "Intercompany Elimination", tasks: 12, category: "Eliminations", sampleTasks: ["Match IC transactions", "Eliminate IC revenue/expense", "Eliminate IC receivables", "Eliminate IC inventory profit", "Post elimination JEs"] },
                  { name: "External Audit Prep", tasks: 32, category: "Audit", sampleTasks: ["Prepare PBC list", "Schedule confirmations", "Prepare lead schedules", "Document roll-forwards", "Compile support files"] },
                ].map((template, idx) => (
                  <Card key={template.name} className="hover-elevate" data-testid={`card-close-template-${idx}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handlePreviewTemplate({
                              name: template.name,
                              type: "Close Control",
                              category: "close-control",
                              description: `${template.category} checklist with ${template.tasks} tasks`,
                              columns: ["Task", "Owner", "Due Date", "Status", "Notes"],
                              sampleData: template.sampleTasks.map((task, i) => ({
                                Task: task,
                                Owner: i % 2 === 0 ? "Controller" : "Accounting Manager",
                                "Due Date": `Day ${i + 1}`,
                                Status: i === 0 ? "Completed" : i === 1 ? "In Progress" : "Pending",
                                Notes: "",
                              })),
                            })}
                            data-testid={`button-preview-close-${idx}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Badge>{template.tasks} tasks</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{template.category}</Badge>
                        <span className="text-xs text-muted-foreground">System template</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? "Update template properties" : "Add a new template to the repository"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input 
                placeholder="e.g., Revenue Recognition Rollforward" 
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                data-testid="input-template-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Layout Type</label>
              <Select value={newTemplateLayout} onValueChange={(v) => setNewTemplateLayout(v as ScheduleLayoutType)}>
                <SelectTrigger data-testid="select-template-layout">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROLLFORWARD">Rollforward</SelectItem>
                  <SelectItem value="MOVEMENT_BY_CATEGORY">Movement by Category</SelectItem>
                  <SelectItem value="TIMING_MATURITY">Timing / Maturity</SelectItem>
                  <SelectItem value="GROSS_TO_NET">Gross to Net</SelectItem>
                  <SelectItem value="COMPOSITION">Composition</SelectItem>
                  <SelectItem value="RECONCILIATION">Reconciliation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Framework</label>
              <Select value={newTemplateFramework} onValueChange={(v) => setNewTemplateFramework(v as "IFRS" | "US_GAAP" | "BOTH")}>
                <SelectTrigger data-testid="select-template-framework">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOTH">IFRS / US GAAP</SelectItem>
                  <SelectItem value="IFRS">IFRS Only</SelectItem>
                  <SelectItem value="US_GAAP">US GAAP Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)} data-testid="button-cancel-template">
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} data-testid="button-save-template">
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTemplatePreview} onOpenChange={setShowTemplatePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Template Preview: {previewTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Preview how this template will look when applied
            </DialogDescription>
          </DialogHeader>
          
          {previewTemplate && (
            <div className="flex-1 overflow-auto space-y-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Category</p>
                  <Badge className="mt-1">{previewTemplate.category.replace("-", " ")}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Type</p>
                  <p className="font-medium">{previewTemplate.type}</p>
                </div>
                {previewTemplate.layoutType && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Layout</p>
                    <Badge variant="outline">{getLayoutTypeLabel(previewTemplate.layoutType)}</Badge>
                  </div>
                )}
                {previewTemplate.framework && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Framework</p>
                    <p className="font-medium">{previewTemplate.framework}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                <p className="text-sm">{previewTemplate.description}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Column Structure ({previewTemplate.columns.length} columns)</p>
                <div className="flex flex-wrap gap-2">
                  {previewTemplate.columns.map((col, idx) => (
                    <Badge key={idx} variant="secondary">{col}</Badge>
                  ))}
                </div>
              </div>

              {previewTemplate.sampleData && previewTemplate.sampleData.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Sample Data Preview</p>
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              {previewTemplate.columns.map((col, idx) => (
                                <TableHead key={idx} className="whitespace-nowrap text-xs font-semibold">{col}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewTemplate.sampleData.map((row, rowIdx) => (
                              <TableRow key={rowIdx}>
                                {previewTemplate.columns.map((col, colIdx) => (
                                  <TableCell key={colIdx} className="whitespace-nowrap text-sm">
                                    {typeof row[col] === "number" 
                                      ? row[col].toLocaleString()
                                      : row[col] || "-"}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplatePreview(false)} data-testid="button-close-preview">
              Close Preview
            </Button>
            <Button data-testid="button-use-template">
              <Plus className="h-4 w-4 mr-2" />
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      case "templates":
        return renderTemplateRepository();
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

      {/* ===== CRUD DIALOGS ===== */}
      
      {/* Add Schedule Dialog */}
      <Dialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>Add a new disclosure schedule</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-title">Schedule Title</Label>
              <Input
                id="schedule-title"
                value={newScheduleTitle}
                onChange={(e) => setNewScheduleTitle(e.target.value)}
                placeholder="e.g., Property, Plant & Equipment Rollforward"
                data-testid="input-schedule-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-layout">Layout Type</Label>
              <Select value={newScheduleLayout} onValueChange={(v) => setNewScheduleLayout(v as ScheduleLayoutType)}>
                <SelectTrigger data-testid="select-schedule-layout">
                  <SelectValue placeholder="Select layout type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROLLFORWARD">Rollforward</SelectItem>
                  <SelectItem value="GROSS_TO_NET">Gross to Net</SelectItem>
                  <SelectItem value="TIMING_MATURITY">Timing/Maturity</SelectItem>
                  <SelectItem value="COMPOSITION">Composition</SelectItem>
                  <SelectItem value="RECONCILIATION">Reconciliation</SelectItem>
                  <SelectItem value="MOVEMENT_BY_CATEGORY">Movement by Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-note">Linked Note</Label>
              <Select value={newScheduleNoteId} onValueChange={setNewScheduleNoteId}>
                <SelectTrigger data-testid="select-schedule-note">
                  <SelectValue placeholder="Select note" />
                </SelectTrigger>
                <SelectContent>
                  {notes.map((note) => (
                    <SelectItem key={note.noteId} value={note.noteId}>
                      Note {note.noteNumber}: {note.noteTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddScheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleAddSchedule} data-testid="button-save-schedule">Create Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={showEditScheduleDialog} onOpenChange={setShowEditScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>Update schedule details</DialogDescription>
          </DialogHeader>
          {scheduleToEdit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-title">Schedule Title</Label>
                <Input
                  id="edit-schedule-title"
                  value={scheduleToEdit.scheduleTitle}
                  onChange={(e) => setScheduleToEdit({ ...scheduleToEdit, scheduleTitle: e.target.value })}
                  data-testid="input-edit-schedule-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-layout">Layout Type</Label>
                <Select 
                  value={scheduleToEdit.layoutType} 
                  onValueChange={(v) => setScheduleToEdit({ ...scheduleToEdit, layoutType: v as ScheduleLayoutType })}
                >
                  <SelectTrigger data-testid="select-edit-schedule-layout">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROLLFORWARD">Rollforward</SelectItem>
                    <SelectItem value="GROSS_TO_NET">Gross to Net</SelectItem>
                    <SelectItem value="TIMING_MATURITY">Timing/Maturity</SelectItem>
                    <SelectItem value="COMPOSITION">Composition</SelectItem>
                    <SelectItem value="RECONCILIATION">Reconciliation</SelectItem>
                    <SelectItem value="MOVEMENT_BY_CATEGORY">Movement by Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-schedule-note">Linked Note</Label>
                <Select 
                  value={scheduleToEdit.noteId} 
                  onValueChange={(v) => setScheduleToEdit({ ...scheduleToEdit, noteId: v })}
                >
                  <SelectTrigger data-testid="select-edit-schedule-note">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {notes.map((note) => (
                      <SelectItem key={note.noteId} value={note.noteId}>
                        Note {note.noteNumber}: {note.noteTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditScheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleEditSchedule} data-testid="button-update-schedule">Update Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Schedule AlertDialog */}
      <AlertDialog open={showDeleteScheduleDialog} onOpenChange={setShowDeleteScheduleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{scheduleToDelete?.scheduleTitle}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-schedule">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSchedule} data-testid="button-confirm-delete-schedule">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>Add a new disclosure note</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-number">Note Number</Label>
              <Input
                id="note-number"
                value={newNoteNumber}
                onChange={(e) => setNewNoteNumber(e.target.value)}
                placeholder="e.g., 15"
                data-testid="input-note-number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-title">Note Title</Label>
              <Input
                id="note-title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="e.g., Property, Plant and Equipment"
                data-testid="input-note-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-framework">Framework</Label>
              <Select value={newNoteFramework} onValueChange={(v) => setNewNoteFramework(v as "IFRS" | "US_GAAP" | "BOTH")}>
                <SelectTrigger data-testid="select-note-framework">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IFRS">IFRS</SelectItem>
                  <SelectItem value="US_GAAP">US GAAP</SelectItem>
                  <SelectItem value="BOTH">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNoteDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNote} data-testid="button-save-note">Create Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={showEditNoteDialog} onOpenChange={setShowEditNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Update note details</DialogDescription>
          </DialogHeader>
          {noteToEdit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-note-number">Note Number</Label>
                <Input
                  id="edit-note-number"
                  value={noteToEdit.noteNumber}
                  onChange={(e) => setNoteToEdit({ ...noteToEdit, noteNumber: e.target.value })}
                  data-testid="input-edit-note-number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-title">Note Title</Label>
                <Input
                  id="edit-note-title"
                  value={noteToEdit.noteTitle}
                  onChange={(e) => setNoteToEdit({ ...noteToEdit, noteTitle: e.target.value })}
                  data-testid="input-edit-note-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-framework">Framework</Label>
                <Select 
                  value={noteToEdit.framework} 
                  onValueChange={(v) => setNoteToEdit({ ...noteToEdit, framework: v as "IFRS" | "US_GAAP" | "BOTH" })}
                >
                  <SelectTrigger data-testid="select-edit-note-framework">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IFRS">IFRS</SelectItem>
                    <SelectItem value="US_GAAP">US GAAP</SelectItem>
                    <SelectItem value="BOTH">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditNoteDialog(false)}>Cancel</Button>
            <Button onClick={handleEditNote} data-testid="button-update-note">Update Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Note AlertDialog */}
      <AlertDialog open={showDeleteNoteDialog} onOpenChange={setShowDeleteNoteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete Note {noteToDelete?.noteNumber}: "{noteToDelete?.noteTitle}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-note">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} data-testid="button-confirm-delete-note">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Narrative Dialog */}
      <Dialog open={showAddNarrativeDialog} onOpenChange={setShowAddNarrativeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Narrative</DialogTitle>
            <DialogDescription>Add a new narrative block</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="narrative-note">Linked Note</Label>
              <Select value={newNarrativeNoteId} onValueChange={setNewNarrativeNoteId}>
                <SelectTrigger data-testid="select-narrative-note">
                  <SelectValue placeholder="Select note" />
                </SelectTrigger>
                <SelectContent>
                  {notes.map((note) => (
                    <SelectItem key={note.noteId} value={note.noteId}>
                      Note {note.noteNumber}: {note.noteTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="narrative-content">Content</Label>
              <Textarea
                id="narrative-content"
                value={newNarrativeContent}
                onChange={(e) => setNewNarrativeContent(e.target.value)}
                placeholder="Enter narrative content..."
                rows={6}
                data-testid="textarea-narrative-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNarrativeDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNarrative} data-testid="button-save-narrative">Create Narrative</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Narrative Dialog */}
      <Dialog open={showEditNarrativeDialog} onOpenChange={setShowEditNarrativeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Narrative</DialogTitle>
            <DialogDescription>Update narrative details</DialogDescription>
          </DialogHeader>
          {narrativeToEdit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-narrative-note">Linked Note</Label>
                <Select 
                  value={narrativeToEdit.noteId} 
                  onValueChange={(v) => setNarrativeToEdit({ ...narrativeToEdit, noteId: v })}
                >
                  <SelectTrigger data-testid="select-edit-narrative-note">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {notes.map((note) => (
                      <SelectItem key={note.noteId} value={note.noteId}>
                        Note {note.noteNumber}: {note.noteTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-narrative-content">Content</Label>
                <Textarea
                  id="edit-narrative-content"
                  value={narrativeToEdit.content}
                  onChange={(e) => setNarrativeToEdit({ ...narrativeToEdit, content: e.target.value })}
                  rows={6}
                  data-testid="textarea-edit-narrative-content"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditNarrativeDialog(false)}>Cancel</Button>
            <Button onClick={handleEditNarrative} data-testid="button-update-narrative">Update Narrative</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Narrative AlertDialog */}
      <AlertDialog open={showDeleteNarrativeDialog} onOpenChange={setShowDeleteNarrativeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Narrative</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this narrative? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-narrative">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNarrative} data-testid="button-confirm-delete-narrative">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Working Paper Dialog */}
      <Dialog open={showAddWPDialog} onOpenChange={setShowAddWPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Working Paper</DialogTitle>
            <DialogDescription>Add a new working paper</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wp-name">Working Paper Name</Label>
              <Input
                id="wp-name"
                value={newWPName}
                onChange={(e) => setNewWPName(e.target.value)}
                placeholder="e.g., Fixed Assets Rollforward"
                data-testid="input-wp-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wp-type">Type</Label>
              <Select value={newWPType} onValueChange={(v) => setNewWPType(v as "ROLLFORWARD" | "AGING" | "LINEAR" | "CUSTOM")}>
                <SelectTrigger data-testid="select-wp-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROLLFORWARD">Rollforward</SelectItem>
                  <SelectItem value="AGING">Aging</SelectItem>
                  <SelectItem value="LINEAR">Linear</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWPDialog(false)}>Cancel</Button>
            <Button onClick={handleAddWorkingPaper} data-testid="button-save-wp">Create Working Paper</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Working Paper Dialog */}
      <Dialog open={showEditWPDialog} onOpenChange={setShowEditWPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Working Paper</DialogTitle>
            <DialogDescription>Update working paper details</DialogDescription>
          </DialogHeader>
          {wpToEdit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-wp-name">Working Paper Name</Label>
                <Input
                  id="edit-wp-name"
                  value={wpToEdit.name}
                  onChange={(e) => setWpToEdit({ ...wpToEdit, name: e.target.value })}
                  data-testid="input-edit-wp-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-wp-type">Type</Label>
                <Select 
                  value={wpToEdit.type} 
                  onValueChange={(v) => setWpToEdit({ ...wpToEdit, type: v as "ROLLFORWARD" | "AGING" | "LINEAR" | "CUSTOM" })}
                >
                  <SelectTrigger data-testid="select-edit-wp-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROLLFORWARD">Rollforward</SelectItem>
                    <SelectItem value="AGING">Aging</SelectItem>
                    <SelectItem value="LINEAR">Linear</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditWPDialog(false)}>Cancel</Button>
            <Button onClick={handleEditWorkingPaper} data-testid="button-update-wp">Update Working Paper</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Working Paper AlertDialog */}
      <AlertDialog open={showDeleteWPDialog} onOpenChange={setShowDeleteWPDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Working Paper</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{wpToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-wp">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWorkingPaper} data-testid="button-confirm-delete-wp">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Link to TB Dialog */}
      <Dialog open={showLinkTBDialog} onOpenChange={setShowLinkTBDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Link to Trial Balance</DialogTitle>
            <DialogDescription>
              Select TB account codes to link to this working paper. The system will auto-calculate tie-out status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Available TB Accounts</Label>
              <ScrollArea className="h-[250px] border rounded-md p-2">
                <div className="space-y-2">
                  {adjLines.map((line) => (
                    <div 
                      key={line.accountCode}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                      onClick={() => {
                        setSelectedTBAccounts(prev => 
                          prev.includes(line.accountCode)
                            ? prev.filter(c => c !== line.accountCode)
                            : [...prev, line.accountCode]
                        );
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedTBAccounts.includes(line.accountCode)}
                        onChange={() => {}}
                        className="h-4 w-4"
                      />
                      <span className="font-mono text-sm">{line.accountCode}</span>
                      <span className="text-sm flex-1">{line.accountName}</span>
                      <span className="font-mono text-sm text-right">
                        {formatCurrency(line.finalBalance)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm">
                <strong>Selected:</strong> {selectedTBAccounts.length} account(s)
              </p>
              <p className="text-sm font-mono">
                <strong>Total:</strong> {formatCurrency(
                  selectedTBAccounts.reduce((sum, code) => {
                    const line = adjLines.find(l => l.accountCode === code);
                    return sum + (line?.finalBalance || 0);
                  }, 0)
                )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkTBDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkTB} data-testid="button-confirm-link-tb">
              Link Accounts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add WP Note Dialog */}
      <Dialog open={showAddWPNoteDialog} onOpenChange={setShowAddWPNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add an analyst note to document observations, methodology, or follow-ups.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="wp-note-content">Note Content</Label>
              <Textarea
                id="wp-note-content"
                placeholder="Enter your note..."
                value={newWPNoteContent}
                onChange={(e) => setNewWPNoteContent(e.target.value)}
                rows={4}
                data-testid="input-wp-note-content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWPNoteDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddWPNote} 
              disabled={!newWPNoteContent.trim()}
              data-testid="button-confirm-add-wp-note"
            >
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Attachment Dialog */}
      <Dialog open={showAddAttachmentDialog} onOpenChange={setShowAddAttachmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Attachment</DialogTitle>
            <DialogDescription>
              Upload invoices, contracts, or other supporting documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="attachment-name">File Name</Label>
              <Input
                id="attachment-name"
                placeholder="e.g., Invoice_Dec2024.pdf"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                data-testid="input-attachment-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachment-desc">Description (optional)</Label>
              <Input
                id="attachment-desc"
                placeholder="Brief description of the document"
                value={newAttachmentDesc}
                onChange={(e) => setNewAttachmentDesc(e.target.value)}
                data-testid="input-attachment-desc"
              />
            </div>
            <div className="border-2 border-dashed rounded-md p-6 text-center text-muted-foreground">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Drag and drop file here, or click to browse</p>
              <p className="text-xs mt-1">Supported: PDF, Excel, Images (max 10MB)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAttachmentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddAttachment} 
              disabled={!newAttachmentName.trim()}
              data-testid="button-confirm-add-attachment"
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

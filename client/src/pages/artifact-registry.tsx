import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useSearch } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  FileText, 
  FileSpreadsheet,
  File,
  Image,
  Link2,
  Filter,
  Upload,
  Eye,
  Edit,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  FolderOpen,
  Building,
  Calendar,
  Tag,
} from "lucide-react";
import type { 
  FinancialArtifact, 
  ArtifactPurpose, 
  ArtifactStatus, 
  ArtifactFileType,
  Entity,
  ArtifactHealthMetrics,
} from "@shared/schema";

const purposeLabels: Record<ArtifactPurpose, string> = {
  GENERAL: "General",
  SUPPORTING_WORKPAPER: "Supporting Workpaper",
  CONTRACT: "Contract",
  GOVERNANCE: "Governance",
  CORRESPONDENCE: "Correspondence",
  EVIDENCE: "Evidence",
  CUSTOM: "Custom",
};

const statusColors: Record<ArtifactStatus, string> = {
  DRAFT: "bg-gray-500",
  PENDING: "bg-yellow-500",
  REVIEWED: "bg-blue-500",
  APPROVED: "bg-green-500",
  ARCHIVED: "bg-slate-400",
};

const fileTypeIcons: Record<ArtifactFileType, typeof FileText> = {
  EXCEL: FileSpreadsheet,
  PDF: FileText,
  WORD: FileText,
  IMAGE: Image,
  CSV: FileSpreadsheet,
  TEXT: FileText,
  LINK: Link2,
  OTHER: File,
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArtifactRegistryPage() {
  const { toast } = useToast();
  const searchString = useSearch();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [purposeFilter, setPurposeFilter] = useState<ArtifactPurpose | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<ArtifactStatus | "ALL">("ALL");
  const [entityFilter, setEntityFilter] = useState<string>("ALL");
  const [periodFilter, setPeriodFilter] = useState<string>("");
  const [linkedAccountFilter, setLinkedAccountFilter] = useState<string>("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<FinancialArtifact | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const accountCode = params.get("accountCode");
    const linkedSchedule = params.get("linkedSchedule");
    const entity = params.get("entityId");
    const period = params.get("period");
    
    if (accountCode) setLinkedAccountFilter(accountCode);
    if (linkedSchedule) setSearchQuery(linkedSchedule);
    if (entity) setEntityFilter(entity);
    if (period) setPeriodFilter(period);
  }, [searchString]);

  const { data: artifacts, isLoading: artifactsLoading } = useQuery<FinancialArtifact[]>({
    queryKey: ["/api/artifacts"],
  });

  const { data: entities } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const { data: healthMetrics } = useQuery<ArtifactHealthMetrics>({
    queryKey: ["/api/artifacts/health"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<FinancialArtifact>) => {
      return apiRequest("POST", "/api/artifacts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts/health"] });
      setShowUploadDialog(false);
      toast({ title: "Artifact created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create artifact", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FinancialArtifact> }) => {
      return apiRequest("PATCH", `/api/artifacts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts/health"] });
      setShowEditDialog(false);
      setSelectedArtifact(null);
      toast({ title: "Artifact updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update artifact", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/artifacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/artifacts/health"] });
      toast({ title: "Artifact deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete artifact", variant: "destructive" });
    },
  });

  const filteredArtifacts = useMemo(() => {
    if (!artifacts) return [];
    
    let result = [...artifacts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.fileName.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.owner.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (purposeFilter !== "ALL") {
      result = result.filter(a => a.purpose === purposeFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter(a => a.status === statusFilter);
    }

    if (entityFilter !== "ALL") {
      result = result.filter(a => a.entityId === entityFilter);
    }

    if (periodFilter) {
      result = result.filter(a => a.period === periodFilter);
    }

    if (linkedAccountFilter) {
      const accountQuery = linkedAccountFilter.toLowerCase();
      result = result.filter(a => {
        const codes = a.linkedAccountCodes ?? [];
        return codes.some(code => code.toLowerCase().includes(accountQuery));
      });
    }

    return result;
  }, [artifacts, searchQuery, purposeFilter, statusFilter, entityFilter, periodFilter, linkedAccountFilter]);

  return (
    <div className="p-6 space-y-6" data-testid="artifact-registry-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Artifact Registry</h1>
          <p className="text-muted-foreground mt-1">
            Governed document storage for period-based financial artifacts
          </p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button data-testid="button-upload-artifact">
              <Upload className="h-4 w-4 mr-2" />
              Upload Artifact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <ArtifactForm 
              entities={entities || []}
              onSubmit={(data) => createMutation.mutate(data)}
              isPending={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Artifacts</p>
                <p className="text-2xl font-semibold">{healthMetrics?.totalArtifacts ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Required Complete</p>
                <p className="text-2xl font-semibold">
                  {healthMetrics?.requiredComplete ?? 0}/{healthMetrics?.requiredArtifacts ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-semibold">{healthMetrics?.unreviewed ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stale (90+ days)</p>
                <p className="text-2xl font-semibold">{healthMetrics?.staleArtifacts ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-base">All Artifacts</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredArtifacts.length} items
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-artifacts"
              />
            </div>
            <Select value={purposeFilter} onValueChange={(v) => setPurposeFilter(v as ArtifactPurpose | "ALL")}>
              <SelectTrigger className="w-[160px]" data-testid="select-purpose-filter">
                <SelectValue placeholder="Purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Purposes</SelectItem>
                {Object.entries(purposeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ArtifactStatus | "ALL")}>
              <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[160px]" data-testid="select-entity-filter">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Entities</SelectItem>
                {entities?.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="month"
              placeholder="Period"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-[160px]"
              data-testid="input-period-filter"
            />
            <div className="relative min-w-[160px]">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Linked account..."
                value={linkedAccountFilter}
                onChange={(e) => setLinkedAccountFilter(e.target.value)}
                className="pl-9"
                data-testid="input-linked-account-filter"
              />
            </div>
          </div>

          {artifactsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredArtifacts.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title="No artifacts found"
              description={artifacts?.length === 0 
                ? "Upload your first artifact to get started" 
                : "Try adjusting your filters"}
            />
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]" data-testid="th-file">File</TableHead>
                    <TableHead data-testid="th-purpose">Purpose</TableHead>
                    <TableHead data-testid="th-entity">Entity</TableHead>
                    <TableHead data-testid="th-period">Period</TableHead>
                    <TableHead data-testid="th-linked-accounts">Linked Accounts</TableHead>
                    <TableHead data-testid="th-status">Status</TableHead>
                    <TableHead data-testid="th-owner">Owner</TableHead>
                    <TableHead data-testid="th-uploaded">Uploaded</TableHead>
                    <TableHead className="w-[100px]" data-testid="th-actions">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArtifacts.map((artifact) => {
                    const FileIcon = fileTypeIcons[artifact.fileType] || File;
                    const entity = entities?.find(e => e.id === artifact.entityId);
                    return (
                      <TableRow key={artifact.artifactId} data-testid={`artifact-row-${artifact.artifactId}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                              <FileIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium truncate max-w-[200px]">{artifact.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(artifact.fileSize)}
                                {artifact.tags.length > 0 && (
                                  <span className="ml-2">
                                    <Tag className="h-3 w-3 inline mr-1" />
                                    {artifact.tags.slice(0, 2).join(", ")}
                                    {artifact.tags.length > 2 && "..."}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {purposeLabels[artifact.purpose]}
                          </Badge>
                          {artifact.isRequired && (
                            <Badge variant="secondary" className="ml-1 text-xs">Required</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{entity?.name ?? artifact.entityId}</span>
                          </div>
                        </TableCell>
                        <TableCell data-testid={`cell-period-${artifact.artifactId}`}>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{artifact.period}</span>
                          </div>
                        </TableCell>
                        <TableCell data-testid={`cell-linked-accounts-${artifact.artifactId}`}>
                          {(artifact.linkedAccountCodes ?? []).length > 0 ? (
                            <div className="flex items-center gap-1 flex-wrap">
                              <Link2 className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className="text-sm text-muted-foreground">
                                {(artifact.linkedAccountCodes ?? []).slice(0, 2).join(", ")}
                                {(artifact.linkedAccountCodes ?? []).length > 2 && (
                                  <span className="text-xs"> +{(artifact.linkedAccountCodes ?? []).length - 2}</span>
                                )}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell data-testid={`cell-status-${artifact.artifactId}`}>
                          <Badge className={`${statusColors[artifact.status]} text-white text-xs`}>
                            {artifact.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm" data-testid={`cell-owner-${artifact.artifactId}`}>{artifact.owner}</TableCell>
                        <TableCell className="text-sm text-muted-foreground" data-testid={`cell-uploaded-${artifact.artifactId}`}>
                          {formatDate(artifact.uploadedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => {
                                setSelectedArtifact(artifact);
                                setShowEditDialog(true);
                              }}
                              data-testid={`button-edit-${artifact.artifactId}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => {
                                if (confirm("Delete this artifact?")) {
                                  deleteMutation.mutate(artifact.artifactId);
                                }
                              }}
                              data-testid={`button-delete-${artifact.artifactId}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          {selectedArtifact && (
            <ArtifactForm 
              entities={entities || []}
              artifact={selectedArtifact}
              onSubmit={(data) => updateMutation.mutate({ id: selectedArtifact.artifactId, data })}
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ArtifactFormProps {
  entities: Entity[];
  artifact?: FinancialArtifact;
  onSubmit: (data: Partial<FinancialArtifact>) => void;
  isPending: boolean;
}

function ArtifactForm({ entities, artifact, onSubmit, isPending }: ArtifactFormProps) {
  const [formData, setFormData] = useState({
    fileName: artifact?.fileName ?? "",
    fileType: artifact?.fileType ?? "OTHER" as ArtifactFileType,
    fileSize: artifact?.fileSize ?? 0,
    filePath: artifact?.filePath ?? "/uploads/placeholder",
    period: artifact?.period ?? "",
    entityId: artifact?.entityId ?? "",
    purpose: artifact?.purpose ?? "GENERAL" as ArtifactPurpose,
    description: artifact?.description ?? "",
    owner: artifact?.owner ?? "Current User",
    status: artifact?.status ?? "DRAFT" as ArtifactStatus,
    isRequired: artifact?.isRequired ?? false,
    isAuditRelevant: artifact?.isAuditRelevant ?? false,
    tags: artifact?.tags?.join(", ") ?? "",
    virtualFolderPath: artifact?.virtualFolderPath ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{artifact ? "Edit Artifact" : "Upload Artifact"}</DialogTitle>
        <DialogDescription>
          {artifact ? "Update artifact metadata" : "Add a new governed artifact to the registry"}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fileName">File Name</Label>
            <Input
              id="fileName"
              value={formData.fileName}
              onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
              placeholder="document.pdf"
              required
              data-testid="input-file-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fileType">File Type</Label>
            <Select 
              value={formData.fileType} 
              onValueChange={(v) => setFormData({ ...formData, fileType: v as ArtifactFileType })}
            >
              <SelectTrigger data-testid="select-file-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXCEL">Excel</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="WORD">Word</SelectItem>
                <SelectItem value="IMAGE">Image</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="LINK">Link</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Input
              id="period"
              type="month"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              required
              data-testid="input-period"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entityId">Entity</Label>
            <Select 
              value={formData.entityId} 
              onValueChange={(v) => setFormData({ ...formData, entityId: v })}
            >
              <SelectTrigger data-testid="select-entity">
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Select 
              value={formData.purpose} 
              onValueChange={(v) => setFormData({ ...formData, purpose: v as ArtifactPurpose })}
            >
              <SelectTrigger data-testid="select-purpose">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(purposeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v) => setFormData({ ...formData, status: v as ArtifactStatus })}
            >
              <SelectTrigger data-testid="select-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the purpose of this artifact..."
            required
            data-testid="input-description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="audit, insurance, 2024"
            data-testid="input-tags"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="virtualFolderPath">Virtual Folder Path (optional)</Label>
          <Input
            id="virtualFolderPath"
            value={formData.virtualFolderPath}
            onChange={(e) => setFormData({ ...formData, virtualFolderPath: e.target.value })}
            placeholder="/Prepaids/Insurance"
            data-testid="input-folder-path"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isRequired"
              checked={formData.isRequired}
              onCheckedChange={(checked) => setFormData({ ...formData, isRequired: !!checked })}
              data-testid="checkbox-required"
            />
            <Label htmlFor="isRequired" className="text-sm">Required artifact</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isAuditRelevant"
              checked={formData.isAuditRelevant}
              onCheckedChange={(checked) => setFormData({ ...formData, isAuditRelevant: !!checked })}
              data-testid="checkbox-audit-relevant"
            />
            <Label htmlFor="isAuditRelevant" className="text-sm">Audit relevant</Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isPending} data-testid="button-submit-artifact">
          {isPending ? "Saving..." : artifact ? "Update Artifact" : "Create Artifact"}
        </Button>
      </DialogFooter>
    </form>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileSpreadsheet, Search, Filter, Save } from "lucide-react";
import type { GLMasterMapping, BSPLCategory } from "@shared/schema";

export default function MasterMappingPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<BSPLCategory | "all">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<GLMasterMapping | null>(null);
  const [formData, setFormData] = useState<Partial<GLMasterMapping>>({
    glDescriptionCategory: "",
    bsPlCategory: "BS",
    footnoteNumber: "",
    footnoteDescription: "",
    subNote: null,
    wpName: "",
    isActive: true,
    orderIndex: 0,
  });

  const { data: mappings = [], isLoading } = useQuery<GLMasterMapping[]>({
    queryKey: ["/api/gl-mappings"],
  });

  const { data: wpNames = [] } = useQuery<string[]>({
    queryKey: ["/api/gl-mappings/wp-names"],
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<GLMasterMapping>) => 
      apiRequest("POST", "/api/gl-mappings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gl-mappings"] });
      setShowAddDialog(false);
      resetForm();
      toast({ title: "Success", description: "Mapping created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create mapping", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GLMasterMapping> }) =>
      apiRequest("PATCH", `/api/gl-mappings/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gl-mappings"] });
      setShowEditDialog(false);
      setSelectedMapping(null);
      resetForm();
      toast({ title: "Success", description: "Mapping updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update mapping", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/gl-mappings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gl-mappings"] });
      toast({ title: "Success", description: "Mapping deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete mapping", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      glDescriptionCategory: "",
      bsPlCategory: "BS",
      footnoteNumber: "",
      footnoteDescription: "",
      subNote: null,
      wpName: "",
      isActive: true,
      orderIndex: 0,
    });
  };

  const handleEdit = (mapping: GLMasterMapping) => {
    setSelectedMapping(mapping);
    setFormData({
      glDescriptionCategory: mapping.glDescriptionCategory,
      bsPlCategory: mapping.bsPlCategory,
      footnoteNumber: mapping.footnoteNumber || "",
      footnoteDescription: mapping.footnoteDescription,
      subNote: mapping.subNote,
      wpName: mapping.wpName || "",
      isActive: mapping.isActive,
      orderIndex: mapping.orderIndex,
    });
    setShowEditDialog(true);
  };

  const handleSubmit = () => {
    if (!formData.glDescriptionCategory || !formData.footnoteDescription) {
      toast({ title: "Error", description: "Please fill required fields", variant: "destructive" });
      return;
    }
    const data = {
      ...formData,
      wpName: formData.wpName || formData.footnoteDescription,
    };
    if (selectedMapping) {
      updateMutation.mutate({ id: selectedMapping.mappingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredMappings = mappings.filter(m => {
    const matchesSearch = searchTerm === "" || 
      m.glDescriptionCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.footnoteDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.wpName && m.wpName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || m.bsPlCategory === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const bsCount = mappings.filter(m => m.bsPlCategory === "BS" && m.isActive).length;
  const plCount = mappings.filter(m => m.bsPlCategory === "PL" && m.isActive).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Master Mapping</h1>
          <p className="text-muted-foreground">
            Configure GL description to Working Paper mapping rules
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-mapping">
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Mappings</CardDescription>
            <CardTitle className="text-2xl">{mappings.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Balance Sheet</CardDescription>
            <CardTitle className="text-2xl">{bsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Profit & Loss</CardDescription>
            <CardTitle className="text-2xl">{plCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Working Papers</CardDescription>
            <CardTitle className="text-2xl">{wpNames.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                GL Account Mappings
              </CardTitle>
              <CardDescription>Map GL descriptions to footnotes and working papers</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[200px]"
                  data-testid="input-search-mappings"
                />
              </div>
              <Select value={filterCategory || "all"} onValueChange={(v) => setFilterCategory(v as BSPLCategory | "all")}>
                <SelectTrigger className="w-[120px]" data-testid="select-filter-category">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="BS">Balance Sheet</SelectItem>
                  <SelectItem value="PL">Profit & Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading mappings...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GL Description</TableHead>
                  <TableHead>BS/PL</TableHead>
                  <TableHead>Note #</TableHead>
                  <TableHead>Footnote Description</TableHead>
                  <TableHead>Sub-Note</TableHead>
                  <TableHead>WP Name</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMappings.map((mapping) => (
                  <TableRow key={mapping.mappingId}>
                    <TableCell className="font-medium">{mapping.glDescriptionCategory}</TableCell>
                    <TableCell>
                      <Badge variant={mapping.bsPlCategory === "BS" ? "default" : "secondary"}>
                        {mapping.bsPlCategory}
                      </Badge>
                    </TableCell>
                    <TableCell>{mapping.footnoteNumber || "-"}</TableCell>
                    <TableCell>{mapping.footnoteDescription}</TableCell>
                    <TableCell>{mapping.subNote || "-"}</TableCell>
                    <TableCell>{mapping.wpName || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={mapping.isActive ? "default" : "outline"}>
                        {mapping.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(mapping)}
                          data-testid={`button-edit-mapping-${mapping.mappingId}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(mapping.mappingId)}
                          data-testid={`button-delete-mapping-${mapping.mappingId}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMappings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No mappings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setSelectedMapping(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMapping ? "Edit Mapping" : "Add New Mapping"}</DialogTitle>
            <DialogDescription>
              Configure how GL accounts map to footnotes and working papers
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="glDesc">GL Description Category *</Label>
              <Input
                id="glDesc"
                value={formData.glDescriptionCategory || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, glDescriptionCategory: e.target.value }))}
                placeholder="e.g., Cash, Trade Receivables"
                data-testid="input-gl-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bspl">BS / PL Category *</Label>
                <Select
                  value={formData.bsPlCategory || "BS"}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, bsPlCategory: v as BSPLCategory }))}
                >
                  <SelectTrigger data-testid="select-bspl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BS">Balance Sheet</SelectItem>
                    <SelectItem value="PL">Profit & Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noteNum">Footnote Number</Label>
                <Input
                  id="noteNum"
                  value={formData.footnoteNumber || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, footnoteNumber: e.target.value }))}
                  placeholder="e.g., 3"
                  data-testid="input-footnote-number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="footnoteDesc">Footnote Description *</Label>
              <Input
                id="footnoteDesc"
                value={formData.footnoteDescription || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, footnoteDescription: e.target.value }))}
                placeholder="e.g., Cash and cash equivalents"
                data-testid="input-footnote-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subNote">Sub-Note (Optional)</Label>
              <Input
                id="subNote"
                value={formData.subNote || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, subNote: e.target.value || null }))}
                placeholder="e.g., Insurance, Buildings"
                data-testid="input-sub-note"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wpName">Working Paper Name</Label>
              <Input
                id="wpName"
                value={formData.wpName || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, wpName: e.target.value }))}
                placeholder="Defaults to footnote description"
                data-testid="input-wp-name"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                data-testid="switch-is-active"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setShowEditDialog(false);
              setSelectedMapping(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-mapping"
            >
              <Save className="h-4 w-4 mr-2" />
              {selectedMapping ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

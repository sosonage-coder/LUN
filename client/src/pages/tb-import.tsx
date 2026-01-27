import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, Trash2, CheckCircle, AlertCircle, Download, Eye, Plus, File, Wand2 } from "lucide-react";
import type { Entity } from "@shared/schema";

interface TBImportEntry {
  id: string;
  accountCode: string;
  accountName: string;
  openingBalance: number;
  closingBalance: number;
  debitAmount: number;
  creditAmount: number;
  fsCategory: string | null;
  normalBalance: "DEBIT" | "CREDIT";
  importedAt: string;
  periodId: string;
}

interface TBImportBatch {
  batchId: string;
  periodId: string;
  entityId: string;
  importedAt: string;
  importedBy: string;
  fileName: string;
  recordCount: number;
  entries: TBImportEntry[];
}

interface ParsedRow {
  accountCode: string;
  accountName: string;
  openingBalance: number;
  closingBalance: number;
  debitAmount: number;
  creditAmount: number;
  normalBalance: "DEBIT" | "CREDIT";
}

export default function TBImportPage() {
  const { toast } = useToast();
  const [selectedEntityId, setSelectedEntityId] = useState<string>("CORP-001");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2026-01");
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [showBatchDetail, setShowBatchDetail] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<TBImportBatch | null>(null);
  const [activeTab, setActiveTab] = useState("import");

  const { data: entities = [] } = useQuery<Entity[]>({
    queryKey: ["/api/entities"],
  });

  const { data: batches = [], isLoading: loadingBatches } = useQuery<TBImportBatch[]>({
    queryKey: ["/api/tb-imports", selectedEntityId, selectedPeriod],
  });

  const importMutation = useMutation({
    mutationFn: (data: { periodId: string; entityId: string; fileName: string; entries: ParsedRow[] }) =>
      apiRequest("POST", "/api/tb-imports", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tb-imports"] });
      setParsedData([]);
      setFileName("");
      setShowPreview(false);
      toast({ title: "Success", description: "Trial balance imported successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to import trial balance", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (batchId: string) =>
      apiRequest("DELETE", `/api/tb-imports/${batchId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tb-imports"] });
      toast({ title: "Success", description: "Import batch deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete import batch", variant: "destructive" });
    },
  });

  const autoPopulateMutation = useMutation({
    mutationFn: (data: { periodId: string; entityId: string }) =>
      apiRequest("POST", "/api/working-papers/auto-populate", data),
    onSuccess: async (response) => {
      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/working-papers"] });
      toast({ 
        title: "Working Papers Populated", 
        description: result.message || `Created ${result.wpCount} working papers` 
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to populate working papers", variant: "destructive" });
    },
  });

  const handleAutoPopulate = () => {
    autoPopulateMutation.mutate({
      periodId: selectedPeriod,
      entityId: selectedEntityId,
    });
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter(line => line.trim());
        
        if (lines.length < 2) {
          toast({ title: "Error", description: "File must contain header row and data", variant: "destructive" });
          return;
        }

        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const codeIdx = headers.findIndex(h => h.includes("code") || h.includes("account") && h.includes("no"));
        const nameIdx = headers.findIndex(h => h.includes("name") || h.includes("description"));
        const openIdx = headers.findIndex(h => h.includes("open") || h.includes("begin"));
        const closeIdx = headers.findIndex(h => h.includes("close") || h.includes("end") || h.includes("balance"));
        const debitIdx = headers.findIndex(h => h.includes("debit") || h === "dr");
        const creditIdx = headers.findIndex(h => h.includes("credit") || h === "cr");

        const parsed: ParsedRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
          if (values.length < 2) continue;

          const accountCode = values[codeIdx >= 0 ? codeIdx : 0] || "";
          const accountName = values[nameIdx >= 0 ? nameIdx : 1] || "";
          const openingBalance = parseFloat(values[openIdx >= 0 ? openIdx : 2]) || 0;
          const closingBalance = parseFloat(values[closeIdx >= 0 ? closeIdx : 3]) || 0;
          const debitAmount = parseFloat(values[debitIdx >= 0 ? debitIdx : 4]) || 0;
          const creditAmount = parseFloat(values[creditIdx >= 0 ? creditIdx : 5]) || 0;

          if (!accountCode && !accountName) continue;

          parsed.push({
            accountCode,
            accountName,
            openingBalance,
            closingBalance,
            debitAmount,
            creditAmount,
            normalBalance: debitAmount >= creditAmount ? "DEBIT" : "CREDIT",
          });
        }

        if (parsed.length === 0) {
          toast({ title: "Error", description: "No valid data rows found", variant: "destructive" });
          return;
        }

        setParsedData(parsed);
        setShowPreview(true);
        toast({ title: "File Parsed", description: `Found ${parsed.length} accounts` });
      } catch (error) {
        toast({ title: "Error", description: "Failed to parse file", variant: "destructive" });
      }
    };

    reader.readAsText(file);
  }, [toast]);

  const handleImport = () => {
    if (parsedData.length === 0) {
      toast({ title: "Error", description: "No data to import", variant: "destructive" });
      return;
    }
    importMutation.mutate({
      periodId: selectedPeriod,
      entityId: selectedEntityId,
      fileName,
      entries: parsedData,
    });
  };

  const handleViewBatch = (batch: TBImportBatch) => {
    setSelectedBatch(batch);
    setShowBatchDetail(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const periods = [
    { value: "2026-01", label: "January 2026" },
    { value: "2025-12", label: "December 2025" },
    { value: "2025-11", label: "November 2025" },
    { value: "2025-10", label: "October 2025" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Trial Balance Import</h1>
          <p className="text-muted-foreground">
            Import trial balance data from CSV or Excel files
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Imports</CardDescription>
            <CardTitle className="text-2xl">{batches.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Accounts</CardDescription>
            <CardTitle className="text-2xl">
              {batches.reduce((sum, b) => sum + b.recordCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Period</CardDescription>
            <CardTitle className="text-2xl">{selectedPeriod}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Entity</CardDescription>
            <CardTitle className="text-2xl">{selectedEntityId}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex gap-4">
        <Select value={selectedEntityId} onValueChange={setSelectedEntityId}>
          <SelectTrigger className="w-[200px]" data-testid="select-entity">
            <SelectValue placeholder="Select entity" />
          </SelectTrigger>
          <SelectContent>
            {entities.map((entity) => (
              <SelectItem key={entity.id} value={entity.id}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[200px]" data-testid="select-period">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="import" data-testid="tab-import">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">
            <File className="h-4 w-4 mr-2" />
            Import History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Trial Balance File
              </CardTitle>
              <CardDescription>
                Upload a CSV or Excel file containing trial balance data. Supported columns: Account Code, Account Name, Opening Balance, Closing Balance, Debit, Credit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  data-testid="input-file-upload"
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground" />
                  <span className="text-lg font-medium">Click to upload or drag and drop</span>
                  <span className="text-sm text-muted-foreground">CSV or Excel files supported</span>
                </Label>
              </div>
              {fileName && (
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Loaded: {fileName}</span>
                  <Badge>{parsedData.length} accounts</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {parsedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview Data
                </CardTitle>
                <CardDescription>
                  Review the parsed data before importing. First 10 rows shown.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead className="text-right">Opening Balance</TableHead>
                      <TableHead className="text-right">Closing Balance</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{row.accountCode}</TableCell>
                        <TableCell>{row.accountName}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.openingBalance)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.closingBalance)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.debitAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.creditAmount)}</TableCell>
                        <TableCell>
                          <Badge variant={row.normalBalance === "DEBIT" ? "default" : "secondary"}>
                            {row.normalBalance}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {parsedData.length > 10 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ... and {parsedData.length - 10} more rows
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedData([]);
                    setFileName("");
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importMutation.isPending}
                  data-testid="button-import"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import {parsedData.length} Accounts
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    Import History
                  </CardTitle>
                  <CardDescription>
                    Previously imported trial balance batches
                  </CardDescription>
                </div>
                {batches.length > 0 && (
                  <Button
                    onClick={handleAutoPopulate}
                    disabled={autoPopulateMutation.isPending}
                    data-testid="button-auto-populate"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {autoPopulateMutation.isPending ? "Populating..." : "Auto-Populate Working Papers"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loadingBatches ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : batches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No imports found for selected entity and period
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>File Name</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Records</TableHead>
                      <TableHead>Imported By</TableHead>
                      <TableHead>Imported At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map((batch) => (
                      <TableRow key={batch.batchId}>
                        <TableCell className="font-mono">{batch.batchId}</TableCell>
                        <TableCell>{batch.fileName}</TableCell>
                        <TableCell>{batch.periodId}</TableCell>
                        <TableCell className="text-right">{batch.recordCount}</TableCell>
                        <TableCell>{batch.importedBy}</TableCell>
                        <TableCell>{formatDate(batch.importedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleViewBatch(batch)}
                              data-testid={`button-view-batch-${batch.batchId}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteMutation.mutate(batch.batchId)}
                              data-testid={`button-delete-batch-${batch.batchId}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showBatchDetail} onOpenChange={setShowBatchDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Import Batch: {selectedBatch?.batchId}</DialogTitle>
            <DialogDescription>
              {selectedBatch?.fileName} - {selectedBatch?.recordCount} records
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Opening</TableHead>
                  <TableHead className="text-right">Closing</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedBatch.entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono">{entry.accountCode}</TableCell>
                    <TableCell>{entry.accountName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.openingBalance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.closingBalance)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.debitAmount)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(entry.creditAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBatchDetail(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

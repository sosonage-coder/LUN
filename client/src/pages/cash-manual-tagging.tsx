import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Tag,
  AlertCircle,
  CheckCircle2,
  Save,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface UntaggedTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  direction: "INFLOW" | "OUTFLOW";
  bankReference: string;
  suggestedCategory: string | null;
}

const categoryOptions = [
  { value: "CUSTOMER_RECEIPTS", label: "Customer Receipts" },
  { value: "VENDOR_PAYMENTS", label: "Vendor Payments" },
  { value: "PAYROLL", label: "Payroll" },
  { value: "RENT", label: "Rent & Facilities" },
  { value: "TAXES", label: "Taxes" },
  { value: "UTILITIES", label: "Utilities" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "OTHER", label: "Other" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function CashManualTaggingPage() {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categoryAssignments, setCategoryAssignments] = useState<Record<string, string>>({});

  const { data: transactions, isLoading } = useQuery<UntaggedTransaction[]>({
    queryKey: ["/api/cash/untagged"],
  });

  const untaggedTransactions = transactions ?? [];
  const totalUntagged = untaggedTransactions.length;
  const totalAmount = untaggedTransactions.reduce((sum, t) => {
    return sum + (t.direction === "INFLOW" ? t.amount : -t.amount);
  }, 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(untaggedTransactions.map(t => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleCategoryChange = (id: string, category: string) => {
    setCategoryAssignments(prev => ({
      ...prev,
      [id]: category,
    }));
  };

  const handleSaveTags = () => {
    const tagsToSave = Array.from(selectedIds)
      .filter(id => categoryAssignments[id])
      .map(id => ({ id, category: categoryAssignments[id] }));
    
    if (tagsToSave.length === 0) {
      toast({
        title: "No categories assigned",
        description: "Please select transactions and assign categories before saving.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Tags saved",
      description: `Successfully tagged ${tagsToSave.length} transaction(s).`,
    });
    
    setSelectedIds(new Set());
    setCategoryAssignments({});
  };

  return (
    <div className="flex flex-col gap-6 p-6" data-testid="cash-manual-tagging-page">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cash">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold" data-testid="page-title">Manual Tagging</h1>
          <p className="text-muted-foreground">Categorize unclassified transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="kpi-untagged">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Untagged Transactions</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-amber-600" data-testid="value-untagged">
                {totalUntagged}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="kpi-selected">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Selected</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="value-selected">
              {selectedIds.size}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="kpi-net-amount">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Amount</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className={`text-2xl font-bold ${totalAmount >= 0 ? "text-emerald-500" : "text-red-500"}`} data-testid="value-net">
                {totalAmount >= 0 ? "+" : ""}{formatCurrency(totalAmount)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card data-testid="tagging-table-card">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Unclassified Transactions</CardTitle>
            <CardDescription>Select transactions and assign categories</CardDescription>
          </div>
          <Button 
            onClick={handleSaveTags} 
            disabled={selectedIds.size === 0}
            data-testid="button-save-tags"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Tags ({selectedIds.size})
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : untaggedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No untagged transactions to review.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table data-testid="tagging-table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.size === untaggedTransactions.length && untaggedTransactions.length > 0}
                        onCheckedChange={handleSelectAll}
                        data-testid="checkbox-select-all"
                      />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Bank Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Suggested</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {untaggedTransactions.map((transaction) => (
                    <TableRow key={transaction.id} data-testid={`transaction-row-${transaction.id}`}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(transaction.id)}
                          onCheckedChange={(checked) => handleSelectOne(transaction.id, checked as boolean)}
                          data-testid={`checkbox-${transaction.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{transaction.date}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{transaction.bankReference}</TableCell>
                      <TableCell className={`text-right font-mono ${transaction.direction === "INFLOW" ? "text-emerald-500" : "text-red-500"}`}>
                        {transaction.direction === "INFLOW" ? "+" : "-"}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {transaction.suggestedCategory ? (
                          <Badge variant="outline" className="text-xs">
                            {categoryOptions.find(c => c.value === transaction.suggestedCategory)?.label || transaction.suggestedCategory}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={categoryAssignments[transaction.id] || ""}
                          onValueChange={(value) => handleCategoryChange(transaction.id, value)}
                        >
                          <SelectTrigger className="w-[160px]" data-testid={`select-category-${transaction.id}`}>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

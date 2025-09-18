import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Search, Filter, Plus, Check, Send } from "lucide-react";
import {
  getLedgerEntries,
  calculateTotals,
  notifyAccountant,
} from "@/lib/ledger-operations";
import { useToast } from "@/hooks/use-toast";
import { LedgerEntry } from "@/components/ledger/types";
import { LedgerTable } from "@/components/ledger/LedgerTable";
import { LedgerSummary } from "@/components/ledger/LedgerSummary";
import { RequestApprovalDialog } from "@/components/ledger/RequestApprovalDialog";

export function LedgerView() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LedgerEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totals, setTotals] = useState({
    totalByCategory: {} as Record<string, number>,
    grandTotal: 0,
  });
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Default company for demo purposes
    const companyName = "Johnson Enterprises Ltd";

    // Load ledger entries
    const ledgerData = getLedgerEntries(companyName);
    setEntries(ledgerData);
    setFilteredEntries(ledgerData);

    // Calculate totals
    const calculatedTotals = calculateTotals(companyName);
    setTotals(calculatedTotals);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(
        (entry) =>
          entry.storeName.toLowerCase().includes(term) ||
          entry.date.toLowerCase().includes(term) ||
          entry.items.some((item) => item.name.toLowerCase().includes(term))
      );
      setFilteredEntries(filtered);
    }
  };

  const handleRequestApproval = (entry: LedgerEntry) => {
    setSelectedEntry(entry);
    setIsApprovalDialogOpen(true);
  };

  const handleSubmitApprovalRequest = async (note: string) => {
    if (!selectedEntry) return;

    try {
      // In a real app, this would create a request in the database
      await notifyAccountant("Johnson Enterprises Ltd", {
        ...selectedEntry,
        note,
      });

      toast({
        title: "Approval Requested",
        description: `Accountant has been notified about the entry from ${selectedEntry.storeName}`,
      });

      setIsApprovalDialogOpen(false);
      setSelectedEntry(null);
    } catch (error) {
      console.error("Error requesting approval:", error);
      toast({
        title: "Request Failed",
        description: "Failed to send approval request to accountant",
        variant: "destructive",
      });
    }
  };

  const navigateToOCR = () => {
    window.location.href = "/business-ocr";
  };

  return (
    <div className="space-y-6">
      {/* Ledger Summary Card */}
      <LedgerSummary totals={totals} />

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={navigateToOCR}>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger Entries</CardTitle>
          <CardDescription>
            Financial entries from processed receipts and invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LedgerTable
            entries={filteredEntries}
            onRequestApproval={handleRequestApproval}
          />
        </CardContent>
      </Card>

      {/* Approval Request Dialog */}
      <RequestApprovalDialog
        isOpen={isApprovalDialogOpen}
        onClose={() => setIsApprovalDialogOpen(false)}
        onSubmit={handleSubmitApprovalRequest}
        entry={selectedEntry}
      />
    </div>
  );
}

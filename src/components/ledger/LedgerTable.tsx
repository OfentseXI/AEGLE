import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Send, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { LedgerEntry } from "@/components/ledger/types";

interface LedgerTableProps {
  entries: LedgerEntry[];
  onRequestApproval: (entry: LedgerEntry) => void;
}

export function LedgerTable({ entries, onRequestApproval }: LedgerTableProps) {
  const [expandedEntries, setExpandedEntries] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (entryId: string) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [entryId]: !prev[entryId],
    }));
  };

  if (entries.length === 0) {
    return (
      <div className="py-6 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-2 text-lg font-semibold">No Entries Found</h3>
        <p className="text-muted-foreground">
          Process some receipts through OCR to see entries here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const entryId = `${entry.storeName}-${entry.date}`;
            const isExpanded = expandedEntries[entryId] || false;

            return (
              <>
                <TableRow key={entryId}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleExpand(entryId)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.storeName}</TableCell>
                  <TableCell>${entry.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open("/path/to/receipt-doc.pdf", "_blank")
                        }
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRequestApproval(entry)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded details */}
                {isExpanded && (
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={5} className="p-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Items</h4>
                        <div className="rounded-md border bg-background">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Category</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {entry.items.map((item, idx) => (
                                <TableRow key={`${entryId}-item-${idx}`}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.price}</TableCell>
                                  <TableCell>
                                    {item.category || "Uncategorized"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

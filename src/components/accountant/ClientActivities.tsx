import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAccountantSummary,
  getLedgerEntries,
  getNewEntriesForAccountant,
  markEntriesAsReviewed,
} from "@/lib/ledger-operations";
import {
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export function ClientActivities() {
  const [clientSummaries, setClientSummaries] = useState<
    Array<{
      companyName: string;
      totalEntries: number;
      newEntries: number;
      lastActivity: string;
      totalAmount: number;
    }>
  >([]);

  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clientEntries, setClientEntries] = useState<any[]>([]);
  const [newEntries, setNewEntries] = useState<any[]>([]);

  useEffect(() => {
    // Load client summaries
    const summaries = getAccountantSummary();
    setClientSummaries(summaries);

    // Auto-refresh every 10 seconds to check for new entries
    const interval = setInterval(() => {
      const updatedSummaries = getAccountantSummary();
      setClientSummaries(updatedSummaries);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleViewClient = (companyName: string) => {
    setSelectedClient(companyName);
    const entries = getLedgerEntries(companyName);
    const newClientEntries = getNewEntriesForAccountant(companyName);
    setClientEntries(entries);
    setNewEntries(newClientEntries);
  };

  const handleMarkAsReviewed = (companyName: string) => {
    markEntriesAsReviewed(companyName);
    setNewEntries([]);
    setClientSummaries(getAccountantSummary());
    toast.success(`Marked ${companyName} entries as reviewed`);
  };

  if (selectedClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {selectedClient} - Ledger Entries
            </h3>
            <p className="text-sm text-muted-foreground">
              {clientEntries.length} total entries, {newEntries.length} new
              entries
            </p>
          </div>
          <div className="flex gap-2">
            {newEntries.length > 0 && (
              <Button
                onClick={() => handleMarkAsReviewed(selectedClient)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Reviewed
              </Button>
            )}
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              Back to Clients
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {newEntries.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  New Entries Requiring Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {newEntries.map((entry, index) => (
                    <div key={index} className="p-3 bg-white rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{entry.storeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.date}
                          </div>
                          <div className="text-sm">
                            {entry.items.length} item(s) - Total:{" "}
                            <span className="font-medium">
                              ${entry.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-800"
                        >
                          New
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Ledger Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clientEntries.map((entry, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{entry.storeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.date}
                        </div>
                        <div className="text-sm">
                          {entry.items.length} item(s) - Total:{" "}
                          <span className="font-medium">
                            ${entry.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Items:{" "}
                          {entry.items.map((item: any) => item.name).join(", ")}
                        </div>
                      </div>
                      <Badge variant="secondary">Processed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Activities</CardTitle>
        <CardDescription>
          Monitor document uploads and ledger entries from your clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clientSummaries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No client activities yet. Clients will appear here after uploading
              documents.
            </div>
          ) : (
            clientSummaries.map((client) => (
              <div
                key={client.companyName}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => handleViewClient(client.companyName)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple" />
                  </div>
                  <div>
                    <div className="font-medium">{client.companyName}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.totalEntries} entries • Last activity:{" "}
                      {client.lastActivity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center text-sm font-medium">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {client.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Amount
                    </div>
                  </div>
                  {client.newEntries > 0 && (
                    <Badge variant="destructive" className="bg-orange-600">
                      {client.newEntries} new
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

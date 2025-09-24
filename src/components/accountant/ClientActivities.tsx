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
import { FileText, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/integrations/firebase/client";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface LedgerEntry {
  id: string;
  storeName: string;
  date: string;
  items: { name: string; amount: number }[];
  total: number;
  reviewed: boolean;
}

interface ClientSummary {
  companyName: string;
  totalEntries: number;
  newEntries: number;
  lastActivity: string;
  totalAmount: number;
}

export function ClientActivities() {
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clientEntries, setClientEntries] = useState<LedgerEntry[]>([]);
  const [newEntries, setNewEntries] = useState<LedgerEntry[]>([]);
  const [userId, setUserId] = useState<string>("");

  // Load user ID
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) setUserId(user.uid);
    });
  }, []);

  // Fetch client summaries
  useEffect(() => {
    if (!userId) return;

    const fetchSummaries = async () => {
      const clientsSnap = await getDocs(
        query(collection(db, "clients"), where("accountantId", "==", userId))
      );

      const summaries: ClientSummary[] = [];
      for (const clientDoc of clientsSnap.docs) {
        const clientData = clientDoc.data();
        const entriesSnap = await getDocs(
          query(
            collection(db, "ledgerEntries"),
            where("clientId", "==", clientDoc.id)
          )
        );

        const entries = entriesSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as LedgerEntry[];
        const newEntries = entries.filter((e) => !e.reviewed);
        const totalAmount = entries.reduce((sum, e) => sum + e.total, 0);
        const lastActivity = entries.length
          ? new Date(
              Math.max(...entries.map((e) => new Date(e.date).getTime()))
            ).toLocaleString()
          : "No activity";

        summaries.push({
          companyName: clientData.companyName,
          totalEntries: entries.length,
          newEntries: newEntries.length,
          lastActivity,
          totalAmount,
        });
      }
      setClientSummaries(summaries);
    };

    fetchSummaries();
    const interval = setInterval(fetchSummaries, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, [userId]);

  const handleViewClient = async (companyName: string) => {
    setSelectedClient(companyName);
    const clientDocSnap = await getDocs(
      query(
        collection(db, "clients"),
        where("accountantId", "==", userId),
        where("companyName", "==", companyName)
      )
    );
    if (clientDocSnap.empty) return;
    const clientId = clientDocSnap.docs[0].id;

    const entriesSnap = await getDocs(
      query(collection(db, "ledgerEntries"), where("clientId", "==", clientId))
    );
    const allEntries = entriesSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as LedgerEntry[];
    setClientEntries(allEntries);
    setNewEntries(allEntries.filter((e) => !e.reviewed));
  };

  const handleMarkAsReviewed = async (companyName: string) => {
    const clientDocSnap = await getDocs(
      query(
        collection(db, "clients"),
        where("accountantId", "==", userId),
        where("companyName", "==", companyName)
      )
    );
    if (clientDocSnap.empty) return;
    const clientId = clientDocSnap.docs[0].id;

    const entriesSnap = await getDocs(
      query(
        collection(db, "ledgerEntries"),
        where("clientId", "==", clientId),
        where("reviewed", "==", false)
      )
    );

    const batchUpdates = entriesSnap.docs.map((docSnap) =>
      updateDoc(doc(db, "ledgerEntries", docSnap.id), { reviewed: true })
    );
    await Promise.all(batchUpdates);

    setNewEntries([]);
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
                  <AlertCircle className="mr-2 h-5 w-5" /> New Entries Requiring
                  Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {newEntries.map((entry) => (
                    <div key={entry.id} className="p-3 bg-white rounded border">
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
                {clientEntries.map((entry) => (
                  <div key={entry.id} className="p-3 border rounded">
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
                          {entry.items.map((item) => item.name).join(", ")}
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

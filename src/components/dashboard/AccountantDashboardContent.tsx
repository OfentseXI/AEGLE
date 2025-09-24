/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, DollarSign, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClientActivities } from "@/components/accountant/ClientActivities";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

interface ClientSummary {
  companyName: string;
  totalEntries: number;
  newEntries: number;
  totalAmount: number;
}

export function AccountantDashboardContent() {
  const { t } = useLanguage();
  const [userId, setUserId] = useState<string>("");
  const [clientSummaries, setClientSummaries] = useState<ClientSummary[]>([]);

  // Get current user ID
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) setUserId(user.uid);
    });
  }, []);

  // Fetch client summaries
  useEffect(() => {
    if (!userId) return;

    const fetchClientSummaries = async () => {
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
        const entries = entriesSnap.docs.map((d) => d.data() as any);
        const newEntries = entries.filter((e: any) => !e.reviewed);
        const totalAmount = entries.reduce(
          (sum: number, e: any) => sum + e.total,
          0
        );

        summaries.push({
          companyName: clientData.companyName,
          totalEntries: entries.length,
          newEntries: newEntries.length,
          totalAmount,
        });
      }

      setClientSummaries(summaries);
    };

    fetchClientSummaries();
    const interval = setInterval(fetchClientSummaries, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [userId]);

  // Calculate overall stats
  const totalClients = clientSummaries.length;
  const totalDocuments = clientSummaries.reduce(
    (sum, c) => sum + c.totalEntries,
    0
  );
  const totalRevenue = clientSummaries.reduce(
    (sum, c) => sum + c.totalAmount,
    0
  );
  const pendingReviews = clientSummaries.reduce(
    (sum, c) => sum + c.newEntries,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t("accountant.dashboardTitle")}
        </h2>
        <p className="text-muted-foreground">
          {t("accountant.dashboardSubtitle")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("accountant.activeClients")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("accountant.documentsProcessed")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("accountant.totalRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("accountant.pendingReviews")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Client Activities */}
      <ClientActivities />
    </div>
  );
}

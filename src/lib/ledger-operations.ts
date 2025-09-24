/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/integrations/firebase/client";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from "firebase/firestore";

interface LedgerItem {
  name: string;
  price: string;
  category?: string;
}

export interface LedgerEntry {
  id?: string;
  companyName: string;
  date: string;
  storeName: string;
  total: number;
  items: LedgerItem[];
  createdAt?: Timestamp;
}

// Add a new ledger entry to Firestore
export async function addToLedger(entry: LedgerEntry): Promise<void> {
  try {
    const colRef = collection(db, "ledger_entries");
    await addDoc(colRef, {
      companyName: entry.companyName,
      date: entry.date,
      storeName: entry.storeName,
      total: entry.total,
      items: entry.items,
      createdAt: Timestamp.now(),
    });

    // Notify accountant (can later integrate with a notification collection)
    await notifyAccountant(entry.companyName, entry);

    console.log("Ledger entry added:", entry);
  } catch (error) {
    console.error("Error adding to ledger:", error);
    throw error;
  }
}

export async function calculateTotals(companyName: string): Promise<{
  totalByCategory: Record<string, number>;
  grandTotal: number;
}> {
  const entries = getLedgerEntries(companyName);
  const totalByCategory: Record<string, number> = {};
  let grandTotal = 0;

  (await entries).forEach((entry) => {
    grandTotal += entry.total;

    entry.items.forEach((item) => {
      const category = item.category || "other";
      const price = parseFloat(item.price.replace("$", ""));

      if (!isNaN(price)) {
        if (!totalByCategory[category]) {
          totalByCategory[category] = 0;
        }
        totalByCategory[category] += price;
      }
    });
  });

  return {
    totalByCategory,
    grandTotal,
  };
}

// Get all ledger entries for a company
export async function getLedgerEntries(
  companyName: string
): Promise<LedgerEntry[]> {
  try {
    const colRef = collection(db, "ledger_entries");
    const q = query(
      colRef,
      where("companyName", "==", companyName),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<LedgerEntry, "id">),
    }));
  } catch (error) {
    console.error("Error fetching ledger entries:", error);
    return [];
  }
}

// Notify accountant about new entries
export async function notifyAccountant(
  companyName: string,
  receiptData: any
): Promise<void> {
  try {
    console.log(
      `📨 Notifying accountant about new receipt from ${companyName}:`,
      receiptData
    );

    // Optional: later, write to a Firestore notifications collection
  } catch (error) {
    console.error("Error notifying accountant:", error);
  }
}

// Get all companies with ledger entries
export async function getAllCompaniesWithEntries(): Promise<string[]> {
  try {
    const colRef = collection(db, "ledger_entries");
    const snapshot = await getDocs(colRef);

    const companies = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const data = doc.data() as LedgerEntry;
      companies.add(data.companyName);
    });

    return Array.from(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

// Get summary for accountant dashboard
export async function getAccountantSummary(): Promise<
  Array<{
    companyName: string;
    totalEntries: number;
    lastActivity: string;
    totalAmount: number;
  }>
> {
  try {
    const companies = await getAllCompaniesWithEntries();

    const summary = await Promise.all(
      companies.map(async (companyName) => {
        const entries = await getLedgerEntries(companyName);
        const totalAmount = entries.reduce((sum, e) => sum + e.total, 0);
        const lastEntry = entries[0]; // already ordered by date desc

        return {
          companyName,
          totalEntries: entries.length,
          lastActivity: lastEntry?.date || "No activity",
          totalAmount,
        };
      })
    );

    return summary;
  } catch (error) {
    console.error("Error generating accountant summary:", error);
    return [];
  }
}

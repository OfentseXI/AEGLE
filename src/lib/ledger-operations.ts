//import { supabase } from "@/integrations/supabase/client";

interface LedgerItem {
  name: string;
  price: string;
  category?: string;
}

interface LedgerEntry {
  companyName: string;
  date: string;
  storeName: string;
  total: number;
  items: LedgerItem[];
}

// In-memory storage for now - in a real app would use Supabase or another database
const ledgerEntries: Record<string, LedgerEntry[]> = {};

// Track new entries for accountant notifications
const newEntriesForNotification: Record<string, LedgerEntry[]> = {};

export async function addToLedger(entry: LedgerEntry): Promise<void> {
  try {
    console.log("Adding to ledger:", entry);

    // Store in memory
    if (!ledgerEntries[entry.companyName]) {
      ledgerEntries[entry.companyName] = [];
    }

    ledgerEntries[entry.companyName].push(entry);

    // Track for accountant notification
    if (!newEntriesForNotification[entry.companyName]) {
      newEntriesForNotification[entry.companyName] = [];
    }
    newEntriesForNotification[entry.companyName].push(entry);

    // Auto-notify accountant about new entry
    await notifyAccountant(entry.companyName, entry);

    // In a real application, you'd save to Supabase like this:
    // const { error } = await supabase
    //   .from('ledger_entries')
    //   .insert({
    //     company_name: entry.companyName,
    //     entry_date: entry.date,
    //     vendor_name: entry.storeName,
    //     total_amount: entry.total,
    //     items: entry.items,
    //   });

    // if (error) throw error;

    console.log("Current ledger state:", ledgerEntries);
    return Promise.resolve();
  } catch (error) {
    console.error("Error adding to ledger:", error);
    return Promise.reject(error);
  }
}

export function getLedgerEntries(companyName: string): LedgerEntry[] {
  return ledgerEntries[companyName] || [];
}

export function getNewEntriesForAccountant(companyName: string): LedgerEntry[] {
  return newEntriesForNotification[companyName] || [];
}

export function markEntriesAsReviewed(companyName: string): void {
  newEntriesForNotification[companyName] = [];
}

export function calculateTotals(companyName: string): {
  totalByCategory: Record<string, number>;
  grandTotal: number;
} {
  const entries = getLedgerEntries(companyName);
  const totalByCategory: Record<string, number> = {};
  let grandTotal = 0;

  entries.forEach((entry) => {
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

// Function to notify accountant about new receipts
export async function notifyAccountant(
  companyName: string,
  receiptData: any
): Promise<void> {
  try {
    console.log(
      `📨 Notifying accountant about new receipt from ${companyName}:`,
      receiptData
    );

    // In a real app, this would integrate with a notification system
    // Either via email, in-app notifications, etc.

    // For now, we'll simulate the notification being sent
    // The accountant dashboard will check for new entries periodically

    // Example of how this might work with Supabase:
    // const { error } = await supabase
    //   .from('notifications')
    //   .insert({
    //     recipient_type: 'accountant',
    //     company_name: companyName,
    //     message: `New receipt processed for ${companyName} from ${receiptData.storeName}`,
    //     receipt_id: receiptData.id,
    //     read: false,
    //     created_at: new Date()
    //   });

    // if (error) throw error;

    return Promise.resolve();
  } catch (error) {
    console.error("Error notifying accountant:", error);
    return Promise.reject(error);
  }
}

// Get all companies with ledger entries (for accountant view)
export function getAllCompaniesWithEntries(): string[] {
  return Object.keys(ledgerEntries);
}

// Get summary data for accountant dashboard
export function getAccountantSummary(): Array<{
  companyName: string;
  totalEntries: number;
  newEntries: number;
  lastActivity: string;
  totalAmount: number;
}> {
  return Object.keys(ledgerEntries).map((companyName) => {
    const entries = ledgerEntries[companyName];
    const newEntries = newEntriesForNotification[companyName] || [];
    const totalAmount = entries.reduce((sum, entry) => sum + entry.total, 0);
    const lastEntry = entries[entries.length - 1];

    return {
      companyName,
      totalEntries: entries.length,
      newEntries: newEntries.length,
      lastActivity: lastEntry?.date || "No activity",
      totalAmount,
    };
  });
}

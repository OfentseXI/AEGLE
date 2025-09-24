import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { format } from "date-fns";

interface ManagementAccount {
  id: string;
  client_name: string;
  company_name: string;
  period_start: string;
  period_end: string;
  status: string;
  request_date: string;
  completion_date: string | null;
}

export function ManagementAccountsTable() {
  const [accounts, setAccounts] = useState<ManagementAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      // Example: fetch all management requests (adjust to filter by accountant if needed)
      const col = collection(db, "management_requests");
      const q = query(col, orderBy("request_date", "desc"));
      const snapshot = await getDocs(q);

      const data: ManagementAccount[] = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          client_name: docData.client_name || "Unknown",
          company_name: docData.company_name || "Unknown",
          period_start: docData.period_start,
          period_end: docData.period_end,
          status: docData.status,
          request_date: docData.request_date,
          completion_date: docData.completion_date || null,
        };
      });

      setAccounts(data);
    } catch (error) {
      console.error("Error fetching management accounts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  if (loading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Completion Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell>{account.client_name}</TableCell>
            <TableCell>{account.company_name}</TableCell>
            <TableCell>
              {format(new Date(account.period_start), "MMM yyyy")} -{" "}
              {format(new Date(account.period_end), "MMM yyyy")}
            </TableCell>
            <TableCell>{account.status}</TableCell>
            <TableCell>
              {format(new Date(account.request_date), "PP")}
            </TableCell>
            <TableCell>
              {account.completion_date
                ? format(new Date(account.completion_date), "PP")
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

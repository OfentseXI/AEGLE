import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
//import { supabase } from "@/integrations/supabase/client";
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
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["management-accounts"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("management_requests")
        .select(
          `
          *,
          profiles!management_requests_client_id_fkey(
            full_name,
            company_name
          )
        `
        )
        .eq("accountant_id", user.user.id)
        .order("request_date", { ascending: false });

      if (error) throw error;

      return data.map((account) => ({
        id: account.id,
        client_name: account.profiles?.full_name || "Unknown",
        company_name: account.profiles?.company_name || "Unknown",
        period_start: account.period_start,
        period_end: account.period_end,
        status: account.status,
        request_date: account.request_date,
        completion_date: account.completion_date,
      }));
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        {accounts?.map((account) => (
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

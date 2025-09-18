import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
//import { supabase } from "@/integrations/supabase/client";
import StatusBadge from "./StatusBadge";
import { ClientActionButtons } from "./ClientActionButtons";

interface Client {
  id: string;
  full_name: string;
  company_name: string;
  status: string;
}

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from("accountant_clients")
        .select(
          `
          client_id,
          status,
          profiles:client_id (
            id,
            full_name,
            company_name
          )
        `
        )
        .eq("accountant_id", user.user.id);

      if (error) throw error;

      setClients(
        data.map((item: any) => ({
          id: item.profiles.id,
          full_name: item.profiles.full_name || "N/A",
          company_name: item.profiles.company_name || "N/A",
          status: item.status,
        }))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateClientStatus = async (clientId: string, newStatus: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from("accountant_clients")
        .update({ status: newStatus })
        .match({ accountant_id: user.user.id, client_id: clientId });

      if (error) throw error;

      await fetchClients();
      toast({
        title: "Status Updated",
        description: "Client status has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (isLoading) {
    return <div>Loading clients...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.full_name}</TableCell>
            <TableCell>{client.company_name}</TableCell>
            <TableCell>
              <StatusBadge
                status={client.status as "pending" | "active" | "inactive"}
              />
            </TableCell>
            <TableCell>
              {client.status === "pending" && (
                <ClientActionButtons
                  clientId={client.id}
                  onUpdateStatus={updateClientStatus}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientActionButtons } from "./ClientActionButtons";
import StatusBadge from "./StatusBadge";

interface Client {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  status?: "pending" | "active" | "inactive";
}

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
}

export function ClientsTable({ clients, loading }: ClientsTableProps) {
  if (loading) {
    return <div>Loading clients...</div>;
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No clients found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.fullName}</TableCell>
            <TableCell>{client.companyName}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.phone || "-"}</TableCell>
            <TableCell>
              <StatusBadge status={client.status || "pending"} />
            </TableCell>
            <TableCell>
              {client.status === "pending" && (
                <ClientActionButtons
                  clientId={client.id} onUpdateStatus={function (clientId: string, newStatus: string): Promise<void> {
                    throw new Error("Function not implemented.");
                  } }                  // You can pass a callback to update status if needed
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

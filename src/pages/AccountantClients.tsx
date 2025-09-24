import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClientsTable } from "@/components/accountant/ClientsTable";
import { AddClientDialog } from "@/components/accountant/AddClientDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs } from "firebase/firestore";

interface Client {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
}

const AccountantClients = () => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const clientsCol = collection(db, "clients");
      const clientSnapshot = await getDocs(clientsCol);
      const clientList = clientSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Client[];
      setClients(clientList);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientAdded = () => {
    fetchClients(); // Refresh clients table after adding a client
  };

  return (
    <DashboardLayout
      userType="accountant"
      userId=""
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Button onClick={() => setIsAddClientDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        <ClientsTable clients={clients} loading={loading} />

        <AddClientDialog
          open={isAddClientDialogOpen}
          onOpenChange={setIsAddClientDialogOpen}
          onClientAdded={handleClientAdded}
        />
      </div>
    </DashboardLayout>
  );
};

export default AccountantClients;

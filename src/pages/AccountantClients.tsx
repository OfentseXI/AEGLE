import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ClientsTable } from "@/components/accountant/ClientsTable";
import { AddClientDialog } from "@/components/accountant/AddClientDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AccountantClients = () => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);

  const handleClientAdded = () => {
    // Refresh the clients table or handle the added client
    console.log("Client added successfully");
  };

  return (
    <DashboardLayout
      userType="accountant"
      userName="Sarah Wilson"
      companyName="Wilson & Associates"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Button onClick={() => setIsAddClientDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        <ClientsTable />

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

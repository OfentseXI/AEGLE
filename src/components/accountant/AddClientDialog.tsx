import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
//import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded: () => void;
}

export function AddClientDialog({
  open,
  onOpenChange,
  onClientAdded,
}: AddClientDialogProps) {
  const [clientEmail, setClientEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddClient = async () => {
    if (!clientEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a client email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get current user (accountant)
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Check if client exists in profiles
      const { data: clientProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", clientEmail)
        .limit(1);

      if (!clientProfile || clientProfile.length === 0) {
        toast({
          title: "Client not found",
          description: "The client email does not exist in the system",
          variant: "destructive",
        });
        return;
      }

      // Add client relationship
      const { error } = await supabase.from("accountant_clients").insert({
        accountant_id: userData.user.id,
        client_id: clientProfile[0].id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client added successfully",
      });

      setClientEmail("");
      onClientAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter the email address of the client you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="col-span-3"
              placeholder="client@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleAddClient}>
            {isLoading ? "Adding..." : "Add Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

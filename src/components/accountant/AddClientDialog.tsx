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
import { useToast } from "@/hooks/use-toast";

import { auth, db } from "@/integrations/firebase/client";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

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

    if (!auth.currentUser) {
      toast({
        title: "Error",
        description: "Not authenticated",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check if client exists in "profiles" collection
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("email", "==", clientEmail), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: "Client not found",
          description: "The client email does not exist in the system",
          variant: "destructive",
        });
        return;
      }

      const clientProfile = querySnapshot.docs[0].data();

      // 2️. Add accountant-client relationship
      await addDoc(collection(db, "accountant_clients"), {
        accountant_id: auth.currentUser.uid,
        client_id: clientProfile.id,
        created_at: serverTimestamp(), // Firestore timestamp
        status: "pending", // optional default
      });

      toast({
        title: "Success",
        description: "Client added successfully",
      });

      setClientEmail("");
      onClientAdded();
      onOpenChange(false);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to add client",
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

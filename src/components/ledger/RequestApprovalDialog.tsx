import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { LedgerEntry } from "@/components/ledger/types";

interface RequestApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
  entry: LedgerEntry | null;
}

export function RequestApprovalDialog({
  isOpen,
  onClose,
  onSubmit,
  entry,
}: RequestApprovalDialogProps) {
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onSubmit(note);
    setNote("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Accountant Approval</DialogTitle>
          <DialogDescription>
            Send this entry to your accountant for review and approval.
          </DialogDescription>
        </DialogHeader>

        {entry && (
          <div className="py-2 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Vendor:</div>
              <div>{entry.storeName}</div>
              <div className="font-medium">Date:</div>
              <div>{entry.date}</div>
              <div className="font-medium">Total:</div>
              <div>${entry.total.toFixed(2)}</div>
            </div>

            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Additional Notes (optional)
              </label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any special instructions or notes for the accountant..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Send Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ClientActionButtonsProps {
  clientId: string;
  onUpdateStatus: (clientId: string, newStatus: string) => Promise<void>;
}

export function ClientActionButtons({
  clientId,
  onUpdateStatus,
}: ClientActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => onUpdateStatus(clientId, "active")}>
        <Check className="h-4 w-4 mr-1" />
        Accept
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onUpdateStatus(clientId, "inactive")}
      >
        <X className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
}

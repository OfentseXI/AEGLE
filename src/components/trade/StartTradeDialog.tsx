import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Ship, Upload } from "lucide-react";

interface StartTradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StartTradeDialog = ({
  open,
  onOpenChange,
}: StartTradeDialogProps) => {
  const { toast } = useToast();
  const [tradeType, setTradeType] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [shipmentValue, setShipmentValue] = useState<string>("");

  const handleSubmit = () => {
    if (!tradeType || !country || !description || !shipmentValue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Trade Created Successfully",
      description: `Your ${tradeType} trade with ${country} has been initiated`,
    });

    // Reset form
    setTradeType("");
    setCountry("");
    setDescription("");
    setShipmentValue("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Start New Trade
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to initiate a new international trade
            transaction
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="trade-type">Trade Type *</Label>
            <Select value={tradeType} onValueChange={setTradeType}>
              <SelectTrigger id="trade-type">
                <SelectValue placeholder="Select trade type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="import">Import</SelectItem>
                <SelectItem value="export">Export</SelectItem>
                <SelectItem value="re-export">Re-export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="country">Destination/Origin Country *</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brazil">Brazil</SelectItem>
                <SelectItem value="russia">Russia</SelectItem>
                <SelectItem value="india">India</SelectItem>
                <SelectItem value="china">China</SelectItem>
                <SelectItem value="southAfrica">South Africa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shipment-value">Shipment Value (USD) *</Label>
            <Input
              id="shipment-value"
              type="number"
              placeholder="Enter value in USD"
              value={shipmentValue}
              onChange={(e) => setShipmentValue(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Goods Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the goods being traded..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="documents">Initial Documents (Optional)</Label>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "Document Upload",
                  description: "Document upload functionality coming soon",
                });
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Create Trade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

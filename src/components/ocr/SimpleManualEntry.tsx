import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ManualEntryData {
  storeName: string;
  date: string;
  total: string;
  description: string;
}

interface SimpleManualEntryProps {
  onSubmit: (data: ManualEntryData) => void;
}

export function SimpleManualEntry({ onSubmit }: SimpleManualEntryProps) {
  const [formData, setFormData] = useState<ManualEntryData>({
    storeName: "",
    date: "",
    total: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ storeName: "", date: "", total: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="storeName">Store/Vendor Name</Label>
        <Input
          id="storeName"
          value={formData.storeName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, storeName: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="total">Total Amount</Label>
        <Input
          id="total"
          type="number"
          step="0.01"
          value={formData.total}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, total: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Brief description of the purchase"
        />
      </div>

      <Button type="submit" className="w-full">
        Add Entry
      </Button>
    </form>
  );
}

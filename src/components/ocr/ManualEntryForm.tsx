import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface ReceiptItem {
  name: string;
  price: string;
  category?: string;
}

interface ManualEntryFormProps {
  initialData: {
    storeName?: string;
    date?: string;
    total?: string;
    items?: ReceiptItem[];
  };
  onSubmit: (data: {
    storeName?: string;
    date?: string;
    total?: string;
    items?: ReceiptItem[];
  }) => void;
  onCancel: () => void;
}

export function ManualEntryForm({
  initialData,
  onSubmit,
  onCancel,
}: ManualEntryFormProps) {
  const [storeName, setStoreName] = useState(initialData.storeName || "");
  const [date, setDate] = useState(initialData.date || "");
  const [total, setTotal] = useState(initialData.total || "");
  const [items, setItems] = useState<ReceiptItem[]>(initialData.items || []);

  const addItem = () => {
    setItems([...items, { name: "", price: "", category: "other" }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (
    index: number,
    field: keyof ReceiptItem,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      storeName: storeName || undefined,
      date: date || undefined,
      total: total || undefined,
      items:
        items.length > 0
          ? items.filter((item) => item.name.trim() && item.price.trim())
          : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="store-name">Store Name</Label>
          <Input
            id="store-name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter store name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="receipt-date">Date</Label>
          <Input
            id="receipt-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="MM/DD/YYYY"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="total-amount">Total Amount</Label>
          <Input
            id="total-amount"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Enter total amount"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {items.length === 0 ? (
            <div className="text-center py-3 text-sm text-muted-foreground">
              No items added yet
            </div>
          ) : (
            items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="Item name"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", e.target.value)}
                    placeholder="Price"
                  />
                </div>
                <div className="col-span-3">
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={item.category || "other"}
                    onChange={(e) =>
                      updateItem(index, "category", e.target.value)
                    }
                  >
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="asset">Asset</option>
                    <option value="communication">Communication</option>
                    <option value="office">Office</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
}

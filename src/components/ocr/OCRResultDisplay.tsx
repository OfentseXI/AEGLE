import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileCheck, Edit, Check, Save, Bell } from "lucide-react";

interface OCRResult {
  text: string;
  confidence: number;
  extractedData: {
    storeName?: string;
    date?: string;
    total?: string;
    items?: Array<{
      name: string;
      price: string;
      category?: string;
    }>;
  };
}

interface OCRResultDisplayProps {
  ocrResult: OCRResult;
  companyName: string;
  setCompanyName: (name: string) => void;
  accountantNotified: boolean;
  onSaveToLedger: () => void;
  onEditManually: () => void;
  onReset: () => void;
  onNotifyAccountant: () => void;
  notifyAccountant: boolean;
}

export function OCRResultDisplay({
  ocrResult,
  companyName,
  setCompanyName,
  accountantNotified,
  onSaveToLedger,
  onEditManually,
  onReset,
  onNotifyAccountant,
  notifyAccountant,
}: OCRResultDisplayProps) {
  const getCategoryBadge = (category: string = "other") => {
    const classes = {
      food: "bg-receipt-food text-green-800",
      transport: "bg-receipt-transport text-blue-800",
      asset: "bg-receipt-asset text-red-800",
      communication: "bg-receipt-communication text-orange-800",
      education: "bg-receipt-education text-purple-800",
      office: "bg-receipt-office text-cyan-800",
      other: "bg-receipt-other text-purple-800",
    };

    const type = category as keyof typeof classes;

    return (
      <Badge className={classes[type] || classes.other}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 mt-4 border-t pt-4">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <FileCheck className="mr-2 h-5 w-5 text-purple" />
          Extracted Information
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditManually}
            className="ml-auto"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit Manually
          </Button>
        </h3>
        <div className="text-sm text-muted-foreground">
          Confidence score: {ocrResult.confidence.toFixed(2)}%
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Store Name</Label>
          <div className="p-2 rounded-md bg-muted">
            {ocrResult.extractedData.storeName || "Not detected"}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <div className="p-2 rounded-md bg-muted">
            {ocrResult.extractedData.date || "Not detected"}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Total Amount</Label>
          <div className="p-2 rounded-md bg-muted">
            {ocrResult.extractedData.total
              ? `$${ocrResult.extractedData.total}`
              : "Not detected"}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Company</Label>
          <div className="p-2 rounded-md bg-muted flex justify-between items-center">
            <span>{companyName || "Not specified"}</span>
            {!companyName && (
              <Input
                placeholder="Enter company name"
                className="w-40"
                onChange={(e) => setCompanyName(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Detected Items</Label>
        <div className="rounded-md border">
          {ocrResult.extractedData.items &&
          ocrResult.extractedData.items.length > 0 ? (
            <div className="divide-y">
              {ocrResult.extractedData.items.map((item, index) => (
                <div
                  key={index}
                  className="p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.price}
                    </div>
                  </div>
                  <div>{getCategoryBadge(item.category)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              No items detected
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Raw OCR Text</Label>
        <Textarea
          readOnly
          className="font-mono text-xs h-32"
          value={ocrResult.text}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button
          onClick={onSaveToLedger}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="mr-2 h-4 w-4" />
          Save to Ledger & Generate PDF
        </Button>
        {notifyAccountant && !accountantNotified && (
          <Button
            onClick={onNotifyAccountant}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notify Accountant
          </Button>
        )}
      </div>

      <Alert className="bg-purple-50 border-purple-200">
        <Check className="h-4 w-4 text-purple" />
        <AlertTitle className="text-purple-dark">
          Processing Complete
        </AlertTitle>
        <AlertDescription className="text-purple-dark text-sm">
          OCR processing has completed. You can now save this information to the
          general ledger and export as PDF.
        </AlertDescription>
      </Alert>
    </div>
  );
}

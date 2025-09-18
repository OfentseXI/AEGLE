import React from "react";
import { Button } from "@/components/ui/button";
import { Scan, RefreshCw, FileCheck } from "lucide-react";
import { PDFPageInfo } from "@/hooks/usePdfProcessor";

interface SelectedReceiptPreviewProps {
  pdfPages: PDFPageInfo;
  selectedReceiptIndex: number;
  onProcessSelection: () => void;
  onViewResults: () => void;
}

export function SelectedReceiptPreview({
  pdfPages,
  selectedReceiptIndex,
  onProcessSelection,
  onViewResults,
}: SelectedReceiptPreviewProps) {
  const selection = pdfPages.selections[selectedReceiptIndex];

  return (
    <div className="border rounded-md p-4 bg-muted/30">
      <h3 className="text-sm font-medium mb-2">
        Selected Receipt {selectedReceiptIndex + 1}
      </h3>

      <div className="flex justify-center mb-4">
        <img
          src={selection.imageData}
          alt={`Receipt selection ${selectedReceiptIndex + 1}`}
          className="max-h-40 object-contain border rounded-md"
        />
      </div>

      {!selection.processed ? (
        <Button
          onClick={onProcessSelection}
          className="w-full bg-purple hover:bg-purple-dark"
        >
          <Scan className="mr-2 h-4 w-4" />
          Process This Receipt
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewResults} className="flex-1">
            <FileCheck className="mr-2 h-4 w-4" />
            View Results
          </Button>
          <Button onClick={onProcessSelection} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

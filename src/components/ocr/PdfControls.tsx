import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Crop, Check } from "lucide-react";
import { PDFPageInfo } from "@/hooks/usePdfProcessor";

interface PdfControlsProps {
  pdfPages: PDFPageInfo;
  selectionMode: boolean;
  selectedReceiptIndex: number | null;
  onChangePage: (direction: "next" | "prev") => void;
  onToggleSelectionMode: () => void;
  onSelectReceipt: (index: number) => void;
}

export function PdfControls({
  pdfPages,
  selectionMode,
  selectedReceiptIndex,
  onChangePage,
  onToggleSelectionMode,
  onSelectReceipt,
}: PdfControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => onChangePage("prev")}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {pdfPages.pageNumber} of {pdfPages.totalPages}
        </span>

        <Button variant="outline" onClick={() => onChangePage("next")}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-between">
        <Button
          variant={selectionMode ? "secondary" : "outline"}
          onClick={onToggleSelectionMode}
          className="flex gap-2"
        >
          <Crop className="h-4 w-4" />
          {selectionMode ? "Exit Selection Mode" : "Select Receipt Areas"}
        </Button>

        {pdfPages.selections.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-2 px-1">
            {pdfPages.selections.map((selection, index) => (
              <Button
                key={selection.id}
                variant={selectedReceiptIndex === index ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectReceipt(index)}
                className="flex gap-1"
              >
                Receipt {index + 1}
                {selection.processed && <Check className="h-3 w-3" />}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

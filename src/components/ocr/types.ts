export interface OCRResult {
  text: string;
  confidence: number;
  extractedData: {
    storeName?: string;
    date?: string;
    total?: string;
    items?: ReceiptItem[];
  };
}

export interface ReceiptItem {
  name: string;
  price: string;
  category?: string;
}

export interface PDFSelection {
  id: string;
  rect: { x: number; y: number; width: number; height: number };
  imageData: string;
  processed: boolean;
  result?: OCRResult;
}

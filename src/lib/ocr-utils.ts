import Tesseract from "tesseract.js";
import { OCRResult, ReceiptItem } from "@/components/ocr/types";

export async function processImageWithOCR(
  imageUrl: string
): Promise<OCRResult> {
  try {
    const result = await Tesseract.recognize(imageUrl, "eng", {
      logger: (data) => {
        // Return progress data that can be used by component
        if (data.status === "recognizing text") {
          return data.progress * 100;
        }
        return 0;
      },
    });

    const text = result.data.text;

    // Enhanced parsing/extraction logic with improved accuracy
    const extractedData: OCRResult["extractedData"] = {
      items: [],
    };

    // Store name extraction - using multiple approaches for better accuracy
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length > 0) {
      // Try to find a line that looks like a store name (usually at the top)
      // Often in all caps or larger text
      const potentialStoreNames = lines.slice(0, 3); // First 3 lines are likely candidates

      // Look for typical store name patterns (all caps, centered, etc.)
      const storeName =
        potentialStoreNames.find(
          (line) =>
            line.toUpperCase() === line && line.length > 3 && !line.match(/^\d/)
        ) || lines[0].trim();

      extractedData.storeName = storeName;
    }

    // Date extraction - multiple date formats
    const dateRegexes = [
      /\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}/, // MM/DD/YYYY or DD/MM/YYYY
      /\d{2,4}[\/\.-]\d{1,2}[\/\.-]\d{1,2}/, // YYYY/MM/DD
      /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{2,4}/i, // Month DD, YYYY
    ];

    let dateMatch = null;
    for (const regex of dateRegexes) {
      const match = text.match(regex);
      if (match) {
        dateMatch = match[0];
        break;
      }
    }

    if (dateMatch) {
      extractedData.date = dateMatch;
    }

    // Total extraction - more comprehensive patterns
    const totalRegexes = [
      /(?:total|amount|sum|balance due|grand total|payment)[:\s]*[$]?(\d+\.\d{2})/i,
      /(?:total|amount|sum)[:\s]*[$]?(\d+\,\d{2})/i,
      /[$]?(\d+\.\d{2})[\s\r\n]*(?:total|amount|sum)/i,
    ];

    let totalMatch = null;
    for (const regex of totalRegexes) {
      const match = text.match(regex);
      if (match) {
        totalMatch = match[1];
        break;
      }
    }

    if (totalMatch) {
      // Remove commas for consistent formatting
      extractedData.total = totalMatch.replace(",", ".");
    }

    // Item extraction - more comprehensive
    const itemRegexes = [
      /([A-Za-z0-9\s&']+)(?:\s+)(\$?\d+\.\d{2})/g, // Name followed by price with decimal
      /([A-Za-z0-9\s&']+)(?:\s+)(\$?\d+\,\d{2})/g, // Name followed by price with comma
    ];

    const items: ReceiptItem[] = [];

    for (const regex of itemRegexes) {
      let itemMatch;
      while ((itemMatch = regex.exec(text)) !== null) {
        const itemName = itemMatch[1].trim();
        const itemPrice = itemMatch[2].replace(",", ".");

        // Skip if it looks like a date or total match
        if (itemName.match(/^\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}$/)) continue;
        if (itemName.toLowerCase().includes("total")) continue;

        // Basic categorization based on keywords
        let category = "other";
        if (
          /food|meal|lunch|dinner|breakfast|coffee|burger|pizza|sandwich|grocery|fruit|vegetable|meat|fish/i.test(
            itemName
          )
        ) {
          category = "food";
        } else if (
          /fuel|gas|petrol|taxi|uber|lyft|transport|fare|travel|flight|train|bus/i.test(
            itemName
          )
        ) {
          category = "transport";
        } else if (
          /equipment|tool|hardware|device|computer|laptop|keyboard|mouse|software|license/i.test(
            itemName
          )
        ) {
          category = "asset";
        } else if (
          /phone|data|internet|airtime|call|mobile|wifi|cloud|hosting|domain/i.test(
            itemName
          )
        ) {
          category = "communication";
        } else if (
          /office|paper|pen|ink|toner|staple|clip|folder|binder/i.test(itemName)
        ) {
          category = "office";
        } else if (
          /training|course|seminar|conference|workshop|certification|book|subscription/i.test(
            itemName
          )
        ) {
          category = "education";
        }

        items.push({
          name: itemName,
          price: itemPrice.startsWith("$") ? itemPrice : `$${itemPrice}`,
          category,
        });
      }
    }

    // Filter out likely duplicate items
    const uniqueItems = items.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t.name === item.name && t.price === item.price)
    );

    extractedData.items = uniqueItems;

    return {
      text,
      confidence: result.data.confidence,
      extractedData,
    };
  } catch (error) {
    console.error("OCR Error:", error);
    throw error;
  }
}

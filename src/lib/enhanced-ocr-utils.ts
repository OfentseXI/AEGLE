export interface OCRResult {
  text: string;
  confidence: number;
  vendor?: string;
  date?: string;
  total?: number;
  processedText: string;
  fileName?: string;
  fileSize?: number;
  lastModified?: number;
  extractedNumbers?: number[];
  lineItems?: Array<{
    description: string;
    amount: number;
    confidence: number;
  }>;
}

// Enhanced number extraction with better accuracy
const extractNumbers = (text: string): number[] => {
  // Multiple regex patterns to catch various number formats
  const numberPatterns = [
    /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g, // $1,234.56 or $1234.56
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2}))\s*(?:USD|CAD|AUD)?/g, // 1,234.56 USD
    /(?:^|\s)(\d+\.\d{2})(?:\s|$)/g, // standalone 123.45
    /(?:total|amount|sum|balance|due|paid)[\s:]*\$?\s*(\d+\.?\d*)/gi, // total: $123.45
    /(\d+)\.(\d{2})(?!\d)/g, // exact decimal amounts
  ];

  const numbers: number[] = [];

  numberPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const numberStr = match[1] || match[0];
      const cleanNumber = numberStr.replace(/[$,\s]/g, "");
      const parsedNumber = parseFloat(cleanNumber);

      if (!isNaN(parsedNumber) && parsedNumber > 0) {
        numbers.push(parsedNumber);
      }
    }
  });

  // Remove duplicates and sort by value
  return [...new Set(numbers)].sort((a, b) => b - a);
};

// Enhanced vendor extraction
const extractVendor = (text: string): string => {
  const lines = text.split("\n").filter((line) => line.trim().length > 2);

  // Look for vendor patterns in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();

    // Skip lines that are clearly not vendor names
    if (
      /^\d+$/.test(line) ||
      /date|time|receipt|invoice/i.test(line) ||
      line.length < 3
    ) {
      continue;
    }

    // Vendor is likely to be in caps or be the first meaningful line
    if (line.toUpperCase() === line && line.length > 3) {
      return line;
    }

    // If no caps line found, use first non-date, non-number line
    if (!/^\d/.test(line) && !/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(line)) {
      return line;
    }
  }

  return lines[0] || "Unknown Vendor";
};

// Enhanced date extraction
const extractDate = (text: string): string | undefined => {
  const datePatterns = [
    /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g, // MM/DD/YYYY
    /\b(\d{2,4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/g, // YYYY/MM/DD
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{2,4})\b/gi, // Month DD, YYYY
    /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{2,4})\b/gi, // DD Month YYYY
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return undefined;
};

// Enhanced total amount extraction with confidence scoring
const extractTotal = (
  text: string,
  extractedNumbers: number[]
): { amount: number; confidence: number } => {
  // Look for total indicators with high confidence
  const totalPatterns = [
    /(?:total|grand\s*total|amount\s*due|balance\s*due|final\s*amount)[\s:]*\$?\s*(\d+\.?\d*)/gi,
    /(?:total|sum|amount)[\s:]*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/gi,
    /\$\s*(\d+\.\d{2})\s*(?:total|amount|due)/gi,
  ];

  let bestMatch = { amount: 0, confidence: 0 };

  // Check for explicit total mentions
  for (const pattern of totalPatterns) {
    const match = text.match(pattern);
    if (match) {
      const amountStr = match[1] || match[0];
      const amount = parseFloat(amountStr.replace(/[$,\s]/g, ""));
      if (!isNaN(amount)) {
        bestMatch = { amount, confidence: 95 };
        break;
      }
    }
  }

  // If no explicit total found, use heuristics with extracted numbers
  if (bestMatch.confidence === 0 && extractedNumbers.length > 0) {
    // Largest number is often the total
    const largestNumber = Math.max(...extractedNumbers);

    // Look for the largest number that appears at the end of the text
    const textLines = text.split("\n").reverse();
    for (let i = 0; i < Math.min(3, textLines.length); i++) {
      const line = textLines[i];
      if (line.includes(largestNumber.toString())) {
        bestMatch = { amount: largestNumber, confidence: 70 };
        break;
      }
    }

    // Fallback to largest number with lower confidence
    if (bestMatch.confidence === 0) {
      bestMatch = { amount: largestNumber, confidence: 50 };
    }
  }

  return bestMatch;
};

// Extract line items with amounts
const extractLineItems = (
  text: string
): Array<{ description: string; amount: number; confidence: number }> => {
  const lines = text.split("\n");
  const items: Array<{
    description: string;
    amount: number;
    confidence: number;
  }> = [];

  lines.forEach((line) => {
    // Pattern for line items: description followed by amount
    const itemPattern = /^(.+?)\s+\$?(\d+\.\d{2})$/;
    const match = line.trim().match(itemPattern);

    if (match) {
      const description = match[1].trim();
      const amount = parseFloat(match[2]);

      // Skip if description is too short or looks like a date/total
      if (
        description.length < 3 ||
        /^(total|subtotal|tax|date|time)/i.test(description) ||
        /^\d+$/.test(description)
      ) {
        return;
      }

      items.push({
        description,
        amount,
        confidence: 80,
      });
    }
  });

  return items;
};

// Real OCR processing using Tesseract.js
export const processOCRWithEnhancedLogic = async (
  imageUrl: string
): Promise<OCRResult> => {
  try {
    console.log("Processing OCR with real document analysis...");

    // Import Tesseract.js dynamically
    const Tesseract = await import("tesseract.js");

    // Process the image with Tesseract.js
    const { data } = await Tesseract.recognize(imageUrl, "eng", {
      logger: (m) => console.log("OCR Progress:", m),
    });

    const extractedText = data.text;
    const confidence = data.confidence;

    console.log("Extracted text:", extractedText);
    console.log("OCR confidence:", confidence);

    // Extract numbers with enhanced accuracy
    const extractedNumbers = extractNumbers(extractedText);
    console.log("Extracted numbers:", extractedNumbers);

    // Extract other information
    const vendor = extractVendor(extractedText);
    const date = extractDate(extractedText);
    const totalInfo = extractTotal(extractedText, extractedNumbers);
    const lineItems = extractLineItems(extractedText);

    console.log("Vendor:", vendor);
    console.log("Date:", date);
    console.log("Total info:", totalInfo);
    console.log("Line items:", lineItems);

    return {
      text: extractedText,
      confidence: confidence,
      vendor,
      date,
      total: totalInfo.amount,
      processedText: `Real OCR: ${vendor} - Total: $${totalInfo.amount} (${totalInfo.confidence}% confidence)`,
      extractedNumbers,
      lineItems,
    };
  } catch (error) {
    console.error("Real OCR processing error:", error);

    return {
      text: "OCR processing failed",
      confidence: 0,
      processedText: "Unable to process image with real OCR",
      extractedNumbers: [],
      lineItems: [],
    };
  }
};

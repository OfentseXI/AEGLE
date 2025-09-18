export interface LedgerItem {
  name: string;
  price: string;
  category?: string;
}

export interface LedgerEntry {
  companyName: string;
  date: string;
  storeName: string;
  total: number;
  items: LedgerItem[];
}

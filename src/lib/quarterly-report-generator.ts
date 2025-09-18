import { LedgerEntry } from "@/components/ledger/types";

export interface QuarterlyReportData {
  companyName: string;
  financialYear: string;
  quarterEndDate: string;
  monthlyData: {
    [month: string]: {
      openingBalance: number;
      salesRevenue: number;
      costOfSales: number;
      grossProfit: number;
      fundingIncome: number;
      serviceProvisionIncome: number;
      totalOperatingIncome: number;
      expenses: {
        bankCharges: number;
        webMaintenance: number;
        telephoneWifi: number;
        salariesExpense: number;
        subscriptionExpense: number;
        transportExpense: number;
        conferenceAndCatering: number;
        accountingFees: number;
        marketingExpenses: number;
        directCosts: number;
      };
    };
  };
  totals: {
    openingBalance: number;
    salesRevenue: number;
    costOfSales: number;
    grossProfit: number;
    fundingIncome: number;
    serviceProvisionIncome: number;
    totalOperatingIncome: number;
    expenses: {
      bankCharges: number;
      webMaintenance: number;
      telephoneWifi: number;
      salariesExpense: number;
      subscriptionExpense: number;
      transportExpense: number;
      conferenceAndCatering: number;
      accountingFees: number;
      marketingExpenses: number;
      directCosts: number;
    };
  };
}

const categorizeExpense = (itemName: string, itemPrice: number) => {
  const name = itemName.toLowerCase();

  if (
    name.includes("bank") ||
    name.includes("fee") ||
    name.includes("charge")
  ) {
    return { bankCharges: itemPrice };
  }
  if (
    name.includes("web") ||
    name.includes("website") ||
    name.includes("hosting")
  ) {
    return { webMaintenance: itemPrice };
  }
  if (
    name.includes("phone") ||
    name.includes("wifi") ||
    name.includes("internet") ||
    name.includes("mobile")
  ) {
    return { telephoneWifi: itemPrice };
  }
  if (
    name.includes("salary") ||
    name.includes("wage") ||
    name.includes("payroll")
  ) {
    return { salariesExpense: itemPrice };
  }
  if (
    name.includes("subscription") ||
    name.includes("software") ||
    name.includes("license")
  ) {
    return { subscriptionExpense: itemPrice };
  }
  if (
    name.includes("transport") ||
    name.includes("fuel") ||
    name.includes("travel") ||
    name.includes("taxi") ||
    name.includes("uber")
  ) {
    return { transportExpense: itemPrice };
  }
  if (
    name.includes("conference") ||
    name.includes("catering") ||
    name.includes("meeting") ||
    name.includes("event")
  ) {
    return { conferenceAndCatering: itemPrice };
  }
  if (
    name.includes("accounting") ||
    name.includes("bookkeeping") ||
    name.includes("audit")
  ) {
    return { accountingFees: itemPrice };
  }
  if (
    name.includes("marketing") ||
    name.includes("advertising") ||
    name.includes("promotion")
  ) {
    return { marketingExpenses: itemPrice };
  }

  return { directCosts: itemPrice };
};

export const generateQuarterlyReport = (
  ledgerEntries: LedgerEntry[],
  companyName: string,
  quarter: "Q1" | "Q2" | "Q3" | "Q4",
  financialYear: string
): QuarterlyReportData => {
  // Define quarter months
  const quarterMonths = {
    Q1: ["January", "February", "March"],
    Q2: ["April", "May", "June"],
    Q3: ["July", "August", "September"],
    Q4: ["October", "November", "December"],
  };

  const months = quarterMonths[quarter];
  const quarterEndMonth = months[2];

  // Initialize monthly data structure
  const monthlyData: QuarterlyReportData["monthlyData"] = {};

  months.forEach((month) => {
    monthlyData[month] = {
      openingBalance: 0,
      salesRevenue: 0,
      costOfSales: 0,
      grossProfit: 0,
      fundingIncome: 0,
      serviceProvisionIncome: 0,
      totalOperatingIncome: 0,
      expenses: {
        bankCharges: 0,
        webMaintenance: 0,
        telephoneWifi: 0,
        salariesExpense: 0,
        subscriptionExpense: 0,
        transportExpense: 0,
        conferenceAndCatering: 0,
        accountingFees: 0,
        marketingExpenses: 0,
        directCosts: 0,
      },
    };
  });

  // Process ledger entries
  ledgerEntries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    const entryMonth = entryDate.toLocaleString("en-US", { month: "long" });

    if (months.includes(entryMonth)) {
      const monthData = monthlyData[entryMonth];

      // Process each item in the entry
      entry.items.forEach((item) => {
        const price = parseFloat(item.price.replace("$", ""));
        const expenseCategory = categorizeExpense(item.name, price);

        // Add to appropriate expense category
        Object.entries(expenseCategory).forEach(([category, amount]) => {
          if (category in monthData.expenses) {
            (monthData.expenses as any)[category] += amount;
          }
        });
      });
    }
  });

  // Calculate totals
  const totals = {
    openingBalance: 0,
    salesRevenue: 0,
    costOfSales: 0,
    grossProfit: 0,
    fundingIncome: 0,
    serviceProvisionIncome: 0,
    totalOperatingIncome: 0,
    expenses: {
      bankCharges: 0,
      webMaintenance: 0,
      telephoneWifi: 0,
      salariesExpense: 0,
      subscriptionExpense: 0,
      transportExpense: 0,
      conferenceAndCatering: 0,
      accountingFees: 0,
      marketingExpenses: 0,
      directCosts: 0,
    },
  };

  months.forEach((month) => {
    const monthData = monthlyData[month];
    totals.openingBalance += monthData.openingBalance;
    totals.salesRevenue += monthData.salesRevenue;
    totals.costOfSales += monthData.costOfSales;
    totals.grossProfit += monthData.grossProfit;
    totals.fundingIncome += monthData.fundingIncome;
    totals.serviceProvisionIncome += monthData.serviceProvisionIncome;
    totals.totalOperatingIncome += monthData.totalOperatingIncome;

    Object.keys(totals.expenses).forEach((category) => {
      (totals.expenses as any)[category] += (monthData.expenses as any)[
        category
      ];
    });
  });

  return {
    companyName,
    financialYear,
    quarterEndDate: `${quarterEndMonth} ${new Date().getFullYear()}`,
    monthlyData,
    totals,
  };
};

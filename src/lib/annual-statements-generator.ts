import { LedgerEntry } from "@/components/ledger/types";

export interface AnnualFinancialStatementsData {
  companyName: string;
  financialYear: number;
  statementOfFinancialPosition: {
    assets: {
      currentAssets: {
        cashAndCashEquivalents: number;
        tradeReceivables: number;
        inventory: number;
        prepaidExpenses: number;
        otherCurrentAssets: number;
        totalCurrentAssets: number;
      };
      nonCurrentAssets: {
        propertyPlantEquipment: number;
        intangibleAssets: number;
        investments: number;
        deferredTaxAssets: number;
        otherNonCurrentAssets: number;
        totalNonCurrentAssets: number;
      };
      totalAssets: number;
    };
    liabilitiesAndEquity: {
      currentLiabilities: {
        tradePayables: number;
        shortTermBorrowings: number;
        accruedExpenses: number;
        currentTaxLiabilities: number;
        otherCurrentLiabilities: number;
        totalCurrentLiabilities: number;
      };
      nonCurrentLiabilities: {
        longTermBorrowings: number;
        deferredTaxLiabilities: number;
        provisions: number;
        otherNonCurrentLiabilities: number;
        totalNonCurrentLiabilities: number;
      };
      equity: {
        shareCapital: number;
        retainedEarnings: number;
        otherReserves: number;
        totalEquity: number;
      };
      totalLiabilitiesAndEquity: number;
    };
  };
  statementOfProfitOrLoss: {
    revenue: number;
    costOfSales: number;
    grossProfit: number;
    operatingExpenses: {
      administrativeExpenses: number;
      sellingExpenses: number;
      researchDevelopment: number;
      otherOperatingExpenses: number;
      totalOperatingExpenses: number;
    };
    operatingProfit: number;
    financeIncome: number;
    financeCosts: number;
    profitBeforeTax: number;
    taxExpense: number;
    profitAfterTax: number;
    earningsPerShare: number;
  };
  statementOfCashFlows: {
    operatingActivities: {
      profitBeforeTax: number;
      adjustments: {
        depreciation: number;
        interestExpense: number;
        other: number;
      };
      workingCapitalChanges: {
        tradeReceivables: number;
        inventory: number;
        tradePayables: number;
        other: number;
      };
      netCashFromOperating: number;
    };
    investingActivities: {
      propertyPlantEquipment: number;
      investments: number;
      other: number;
      netCashFromInvesting: number;
    };
    financingActivities: {
      borrowings: number;
      shareCapital: number;
      dividends: number;
      other: number;
      netCashFromFinancing: number;
    };
    netIncreaseInCash: number;
    cashAtBeginning: number;
    cashAtEnd: number;
  };
  notesToFinancialStatements: {
    accountingPolicies: string[];
    significantEstimates: string[];
    commitments: string[];
    contingencies: string[];
  };
}

const categorizeExpenseForAnnual = (itemName: string, itemPrice: number) => {
  const name = itemName.toLowerCase();

  if (
    name.includes("bank") ||
    name.includes("fee") ||
    name.includes("interest")
  ) {
    return { financeCosts: itemPrice };
  }
  if (
    name.includes("salary") ||
    name.includes("wage") ||
    name.includes("payroll")
  ) {
    return { administrativeExpenses: itemPrice };
  }
  if (
    name.includes("marketing") ||
    name.includes("advertising") ||
    name.includes("promotion")
  ) {
    return { sellingExpenses: itemPrice };
  }
  if (
    name.includes("research") ||
    name.includes("development") ||
    name.includes("r&d")
  ) {
    return { researchDevelopment: itemPrice };
  }

  return { otherOperatingExpenses: itemPrice };
};

export const generateAnnualFinancialStatements = (
  ledgerEntries: LedgerEntry[],
  companyName: string,
  financialYear: number
): AnnualFinancialStatementsData => {
  // Filter entries for the financial year
  const yearEntries = ledgerEntries.filter((entry) => {
    const entryYear = new Date(entry.date).getFullYear();
    return entryYear === financialYear;
  });

  // Calculate operating expenses from ledger entries
  let administrativeExpenses = 0;
  let sellingExpenses = 0;
  let researchDevelopment = 0;
  let otherOperatingExpenses = 0;
  let financeCosts = 0;

  yearEntries.forEach((entry) => {
    entry.items.forEach((item) => {
      const price = parseFloat(item.price.replace("$", ""));
      const expenseCategory = categorizeExpenseForAnnual(item.name, price);

      if (expenseCategory.administrativeExpenses)
        administrativeExpenses += expenseCategory.administrativeExpenses;
      if (expenseCategory.sellingExpenses)
        sellingExpenses += expenseCategory.sellingExpenses;
      if (expenseCategory.researchDevelopment)
        researchDevelopment += expenseCategory.researchDevelopment;
      if (expenseCategory.otherOperatingExpenses)
        otherOperatingExpenses += expenseCategory.otherOperatingExpenses;
      if (expenseCategory.financeCosts)
        financeCosts += expenseCategory.financeCosts;
    });
  });

  const totalOperatingExpenses =
    administrativeExpenses +
    sellingExpenses +
    researchDevelopment +
    otherOperatingExpenses;

  // For demonstration, using calculated expenses with estimated values for other items
  const revenue = totalOperatingExpenses * 3; // Assume revenue is 3x expenses for positive company
  const costOfSales = revenue * 0.4; // 40% cost of sales
  const grossProfit = revenue - costOfSales;
  const operatingProfit = grossProfit - totalOperatingExpenses;
  const profitBeforeTax = operatingProfit - financeCosts;
  const taxExpense = Math.max(0, profitBeforeTax * 0.2); // 20% tax rate
  const profitAfterTax = profitBeforeTax - taxExpense;

  // Estimated balance sheet figures
  const totalAssets = revenue * 0.8; // Assets roughly 80% of revenue
  const currentAssets = totalAssets * 0.6;
  const nonCurrentAssets = totalAssets * 0.4;

  const totalLiabilities = totalAssets * 0.4; // 40% debt-to-assets ratio
  const currentLiabilities = totalLiabilities * 0.7;
  const nonCurrentLiabilities = totalLiabilities * 0.3;
  const totalEquity = totalAssets - totalLiabilities;

  return {
    companyName,
    financialYear,
    statementOfFinancialPosition: {
      assets: {
        currentAssets: {
          cashAndCashEquivalents: currentAssets * 0.3,
          tradeReceivables: currentAssets * 0.4,
          inventory: currentAssets * 0.2,
          prepaidExpenses: currentAssets * 0.05,
          otherCurrentAssets: currentAssets * 0.05,
          totalCurrentAssets: currentAssets,
        },
        nonCurrentAssets: {
          propertyPlantEquipment: nonCurrentAssets * 0.7,
          intangibleAssets: nonCurrentAssets * 0.1,
          investments: nonCurrentAssets * 0.1,
          deferredTaxAssets: nonCurrentAssets * 0.05,
          otherNonCurrentAssets: nonCurrentAssets * 0.05,
          totalNonCurrentAssets: nonCurrentAssets,
        },
        totalAssets,
      },
      liabilitiesAndEquity: {
        currentLiabilities: {
          tradePayables: currentLiabilities * 0.5,
          shortTermBorrowings: currentLiabilities * 0.2,
          accruedExpenses: currentLiabilities * 0.2,
          currentTaxLiabilities: currentLiabilities * 0.05,
          otherCurrentLiabilities: currentLiabilities * 0.05,
          totalCurrentLiabilities: currentLiabilities,
        },
        nonCurrentLiabilities: {
          longTermBorrowings: nonCurrentLiabilities * 0.8,
          deferredTaxLiabilities: nonCurrentLiabilities * 0.1,
          provisions: nonCurrentLiabilities * 0.05,
          otherNonCurrentLiabilities: nonCurrentLiabilities * 0.05,
          totalNonCurrentLiabilities: nonCurrentLiabilities,
        },
        equity: {
          shareCapital: totalEquity * 0.3,
          retainedEarnings: totalEquity * 0.6,
          otherReserves: totalEquity * 0.1,
          totalEquity,
        },
        totalLiabilitiesAndEquity: totalAssets,
      },
    },
    statementOfProfitOrLoss: {
      revenue,
      costOfSales,
      grossProfit,
      operatingExpenses: {
        administrativeExpenses,
        sellingExpenses,
        researchDevelopment,
        otherOperatingExpenses,
        totalOperatingExpenses,
      },
      operatingProfit,
      financeIncome: 0,
      financeCosts,
      profitBeforeTax,
      taxExpense,
      profitAfterTax,
      earningsPerShare: profitAfterTax / 1000, // Assuming 1000 shares
    },
    statementOfCashFlows: {
      operatingActivities: {
        profitBeforeTax,
        adjustments: {
          depreciation: nonCurrentAssets * 0.1,
          interestExpense: financeCosts,
          other: 0,
        },
        workingCapitalChanges: {
          tradeReceivables: -revenue * 0.05,
          inventory: -costOfSales * 0.1,
          tradePayables: totalOperatingExpenses * 0.1,
          other: 0,
        },
        netCashFromOperating:
          profitBeforeTax + nonCurrentAssets * 0.1 + financeCosts,
      },
      investingActivities: {
        propertyPlantEquipment: -nonCurrentAssets * 0.2,
        investments: 0,
        other: 0,
        netCashFromInvesting: -nonCurrentAssets * 0.2,
      },
      financingActivities: {
        borrowings: totalLiabilities * 0.1,
        shareCapital: 0,
        dividends: -profitAfterTax * 0.3,
        other: 0,
        netCashFromFinancing: totalLiabilities * 0.1 - profitAfterTax * 0.3,
      },
      netIncreaseInCash: 0,
      cashAtBeginning: currentAssets * 0.2,
      cashAtEnd: currentAssets * 0.3,
    },
    notesToFinancialStatements: {
      accountingPolicies: [
        "The financial statements have been prepared in accordance with International Financial Reporting Standards (IFRS)",
        "Revenue is recognized when control of goods or services is transferred to the customer",
        "Property, plant and equipment is measured at cost less accumulated depreciation and impairment",
        "Financial instruments are initially measured at fair value",
      ],
      significantEstimates: [
        "Useful lives of property, plant and equipment",
        "Impairment of non-financial assets",
        "Provisions and contingent liabilities",
      ],
      commitments: [
        "Operating lease commitments",
        "Capital expenditure commitments",
      ],
      contingencies: ["Pending legal proceedings", "Warranty provisions"],
    },
  };
};

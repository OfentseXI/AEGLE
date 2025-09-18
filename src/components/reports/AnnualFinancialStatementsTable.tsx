import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AnnualFinancialStatementsData } from "@/lib/annual-statements-generator";

interface AnnualFinancialStatementsTableProps {
  statementsData: AnnualFinancialStatementsData;
}

export function AnnualFinancialStatementsTable({
  statementsData,
}: AnnualFinancialStatementsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Company Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{statementsData.companyName}</h1>
        <h2 className="text-lg font-semibold">Annual Financial Statements</h2>
        <p className="text-muted-foreground">
          For the year ended 31 December {statementsData.financialYear}
        </p>
        <p className="text-sm text-muted-foreground">
          (Prepared in accordance with IFRS)
        </p>
      </div>

      {/* Statement of Financial Position */}
      <Card>
        <CardHeader>
          <CardTitle>Statement of Financial Position</CardTitle>
          <CardDescription>
            As at 31 December {statementsData.financialYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4">ASSETS</TableHead>
                <TableHead className="text-right">
                  {statementsData.financialYear}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-medium">
                <TableCell>Current Assets</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">
                  Cash and cash equivalents
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .currentAssets.cashAndCashEquivalents
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Trade receivables</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .currentAssets.tradeReceivables
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Inventory</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .currentAssets.inventory
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Prepaid expenses</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .currentAssets.prepaidExpenses
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Other current assets</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .currentAssets.otherCurrentAssets
                  )}
                </TableCell>
              </TableRow>
              <TableRow className="font-medium border-t">
                <TableCell>Total Current Assets</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .currentAssets.totalCurrentAssets
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="font-medium">
                <TableCell>Non-Current Assets</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">
                  Property, plant and equipment
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .nonCurrentAssets.propertyPlantEquipment
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Intangible assets</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .nonCurrentAssets.intangibleAssets
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Investments</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .nonCurrentAssets.investments
                  )}
                </TableCell>
              </TableRow>
              <TableRow className="font-medium border-t">
                <TableCell>Total Non-Current Assets</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .nonCurrentAssets.totalNonCurrentAssets
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="font-bold text-lg border-t-2">
                <TableCell>TOTAL ASSETS</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition.assets
                      .totalAssets
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Separator className="my-6" />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4">LIABILITIES AND EQUITY</TableHead>
                <TableHead className="text-right">
                  {statementsData.financialYear}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-medium">
                <TableCell>Current Liabilities</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Trade payables</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.currentLiabilities.tradePayables
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Short-term borrowings</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.currentLiabilities
                      .shortTermBorrowings
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Accrued expenses</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.currentLiabilities.accruedExpenses
                  )}
                </TableCell>
              </TableRow>
              <TableRow className="font-medium border-t">
                <TableCell>Total Current Liabilities</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.currentLiabilities
                      .totalCurrentLiabilities
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="font-medium">
                <TableCell>Non-Current Liabilities</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Long-term borrowings</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.nonCurrentLiabilities
                      .longTermBorrowings
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Provisions</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.nonCurrentLiabilities.provisions
                  )}
                </TableCell>
              </TableRow>
              <TableRow className="font-medium border-t">
                <TableCell>Total Non-Current Liabilities</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.nonCurrentLiabilities
                      .totalNonCurrentLiabilities
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="font-medium">
                <TableCell>Equity</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Share capital</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.equity.shareCapital
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Retained earnings</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.equity.retainedEarnings
                  )}
                </TableCell>
              </TableRow>
              <TableRow className="font-medium border-t">
                <TableCell>Total Equity</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.equity.totalEquity
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="font-bold text-lg border-t-2">
                <TableCell>TOTAL LIABILITIES AND EQUITY</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfFinancialPosition
                      .liabilitiesAndEquity.totalLiabilitiesAndEquity
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Statement of Profit or Loss */}
      <Card>
        <CardHeader>
          <CardTitle>Statement of Profit or Loss</CardTitle>
          <CardDescription>
            For the year ended 31 December {statementsData.financialYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/4"></TableHead>
                <TableHead className="text-right">
                  {statementsData.financialYear}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="font-medium">
                <TableCell>Revenue</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.revenue
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cost of sales</TableCell>
                <TableCell className="text-right">
                  (
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.costOfSales
                  )}
                  )
                </TableCell>
              </TableRow>
              <TableRow className="font-medium border-t">
                <TableCell>Gross Profit</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.grossProfit
                  )}
                </TableCell>
              </TableRow>

              <TableRow className="font-medium">
                <TableCell>Operating Expenses</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Administrative expenses</TableCell>
                <TableCell className="text-right">
                  (
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.operatingExpenses
                      .administrativeExpenses
                  )}
                  )
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Selling expenses</TableCell>
                <TableCell className="text-right">
                  (
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.operatingExpenses
                      .sellingExpenses
                  )}
                  )
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Other operating expenses</TableCell>
                <TableCell className="text-right">
                  (
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.operatingExpenses
                      .otherOperatingExpenses
                  )}
                  )
                </TableCell>
              </TableRow>
              <TableRow className="font-medium border-t">
                <TableCell>Operating Profit</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.operatingProfit
                  )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Finance costs</TableCell>
                <TableCell className="text-right">
                  (
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.financeCosts
                  )}
                  )
                </TableCell>
              </TableRow>
              <TableRow className="font-medium border-t">
                <TableCell>Profit Before Tax</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.profitBeforeTax
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tax expense</TableCell>
                <TableCell className="text-right">
                  (
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.taxExpense
                  )}
                  )
                </TableCell>
              </TableRow>
              <TableRow className="font-bold text-lg border-t-2">
                <TableCell>Profit After Tax</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    statementsData.statementOfProfitOrLoss.profitAfterTax
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes to Financial Statements */}
      <Card>
        <CardHeader>
          <CardTitle>Notes to the Financial Statements</CardTitle>
          <CardDescription>IFRS Compliance and Key Information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Accounting Policies</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {statementsData.notesToFinancialStatements.accountingPolicies.map(
                (policy, index) => (
                  <li key={index}>{policy}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              2. Significant Estimates and Judgements
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {statementsData.notesToFinancialStatements.significantEstimates.map(
                (estimate, index) => (
                  <li key={index}>{estimate}</li>
                )
              )}
            </ul>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              These financial statements have been prepared in accordance with
              International Financial Reporting Standards (IFRS) to ensure
              accuracy, transparency, and comparability across global standards.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

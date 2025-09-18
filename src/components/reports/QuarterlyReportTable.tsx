import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuarterlyReportData } from "@/lib/quarterly-report-generator";

interface QuarterlyReportTableProps {
  reportData: QuarterlyReportData;
}

export function QuarterlyReportTable({
  reportData,
}: QuarterlyReportTableProps) {
  const months = Object.keys(reportData.monthlyData);

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-orange-500 text-white">
        <CardTitle className="text-xl font-bold text-center">
          Quarterly Management Account Statement
        </CardTitle>
        <div className="text-center space-y-1">
          <div className="font-semibold">
            Company Name: {reportData.companyName}
          </div>
          <div>
            Financial year: {reportData.financialYear} Financial Year, Quarter
            Ended {reportData.quarterEndDate}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Description</TableHead>
              {months.map((month) => (
                <TableHead key={month} className="font-bold text-center">
                  {month}
                </TableHead>
              ))}
              <TableHead className="font-bold text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Revenue Section */}
            <TableRow>
              <TableCell className="font-medium">Opening Balance</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(reportData.monthlyData[month].openingBalance)}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.openingBalance)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Sales/Revenue</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(reportData.monthlyData[month].salesRevenue)}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.salesRevenue)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cost of Sales</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(reportData.monthlyData[month].costOfSales)}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.costOfSales)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Gross profit</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(reportData.monthlyData[month].grossProfit)}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.grossProfit)}
              </TableCell>
            </TableRow>

            {/* Other Income Section */}
            <TableRow className="bg-gray-50">
              <TableCell className="font-medium" colSpan={months.length + 2}>
                Other income
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Funding income</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(reportData.monthlyData[month].fundingIncome)}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.fundingIncome)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Service Provision Income
              </TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].serviceProvisionIncome
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.serviceProvisionIncome)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Total Operating Income
              </TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].totalOperatingIncome
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.totalOperatingIncome)}
              </TableCell>
            </TableRow>

            {/* Operating Expenses Section */}
            <TableRow className="bg-gray-50">
              <TableCell className="font-medium" colSpan={months.length + 2}>
                Operating Expense
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Bank Charges</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.bankCharges
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.bankCharges)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Web Maintenance</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.webMaintenance
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.webMaintenance)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Telephone & WiFi</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.telephoneWifi
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.telephoneWifi)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Salaries Expense</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.salariesExpense
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.salariesExpense)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Subscription Expense
              </TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.subscriptionExpense
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.subscriptionExpense)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Transport Expense</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.transportExpense
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.transportExpense)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Conference and Catering
              </TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.conferenceAndCatering
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(
                  reportData.totals.expenses.conferenceAndCatering
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Accounting Fees</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.accountingFees
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.accountingFees)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Marketing expenses</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.marketingExpenses
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.marketingExpenses)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Direct Costs</TableCell>
              {months.map((month) => (
                <TableCell key={month} className="text-center">
                  {formatCurrency(
                    reportData.monthlyData[month].expenses.directCosts
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-medium">
                {formatCurrency(reportData.totals.expenses.directCosts)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

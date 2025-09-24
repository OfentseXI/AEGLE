/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, FileText, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManagementAccountsTable } from "./ManagementAccountsTable";
import { QuarterlyReportTable } from "./QuarterlyReportTable";
import { AnnualFinancialStatementsTable } from "./AnnualFinancialStatementsTable";
import { generateQuarterlyReport } from "@/lib/quarterly-report-generator";
import { generateAnnualFinancialStatements } from "@/lib/annual-statements-generator";
import { getLedgerEntries } from "@/lib/ledger-operations";
import { useState, useEffect } from "react";

interface ReportsContentProps {
  userType: "business" | "accountant";
}

export const ReportsContent = ({ userType }: ReportsContentProps) => {
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [showQuarterlyReport, setShowQuarterlyReport] = useState(false);
  const [showAnnualStatements, setShowAnnualStatements] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch ledger entries dynamically for the company
  const fetchLedgerEntries = async (companyName: string) => {
    setLoading(true);
    try {
      const entries = await getLedgerEntries(companyName);
      setLedgerEntries(entries);
    } catch (error) {
      console.error("Failed to fetch ledger entries:", error);
      setLedgerEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuarterlyReport = async () => {
    await fetchLedgerEntries("Johnson Enterprises Ltd");
    setShowQuarterlyReport(true);
  };

  const handleGenerateAnnualStatements = async () => {
    await fetchLedgerEntries("Johnson Enterprises Ltd");
    setShowAnnualStatements(true);
  };

  if (userType === "accountant") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Management Accounts
          </h2>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Management Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <ManagementAccountsTable />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) return <div>Loading ledger data...</div>;

  if (showQuarterlyReport) {
    const currentYear = new Date().getFullYear();
    const reportData = generateQuarterlyReport(
      ledgerEntries,
      "Johnson Enterprises Ltd",
      "Q1",
      `${currentYear}/${currentYear + 1}`
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Quarterly Management Account
          </h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuarterlyReport(false)}
            >
              Back to Reports
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>

        <QuarterlyReportTable reportData={reportData} />
      </div>
    );
  }

  if (showAnnualStatements) {
    const currentYear = new Date().getFullYear();
    const statementsData = generateAnnualFinancialStatements(
      ledgerEntries,
      "Johnson Enterprises Ltd",
      currentYear
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Annual Financial Statements
          </h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnnualStatements(false)}
            >
              Back to Reports
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>

        <AnnualFinancialStatementsTable statementsData={statementsData} />
      </div>
    );
  }

  const reports = [
    {
      title: "Annual Financial Statements",
      icon: FileText,
      description:
        "Yearly reports showing the company's financial performance and position. Prepared under IFRS, they ensure accuracy, transparency, and comparability across global standards.",
      action: handleGenerateAnnualStatements,
    },
    {
      title: "Quarterly Management Account",
      icon: FileSpreadsheet,
      description:
        "Generate quarterly management account statement from uploaded documents",
      action: handleGenerateQuarterlyReport,
    },
    {
      title: "Tax Report",
      icon: FileText,
      description: "Quarterly tax reports and summaries",
    },
    {
      title: "Expense Analysis",
      icon: FileSpreadsheet,
      description: "Detailed breakdown of expenses by category",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card
            key={report.title}
            className="hover:bg-accent/50 cursor-pointer transition-colors"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className="h-5 w-5" />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
              <div className="mt-4 flex gap-2">
                {report.action ? (
                  <Button size="sm" onClick={report.action}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                ) : (
                  <>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

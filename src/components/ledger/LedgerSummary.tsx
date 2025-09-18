import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

interface LedgerSummaryProps {
  totals: {
    totalByCategory: Record<string, number>;
    grandTotal: number;
  };
}

export function LedgerSummary({ totals }: LedgerSummaryProps) {
  const chartData = Object.entries(totals.totalByCategory).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#5DADE2",
    "#48C9B0",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totals.grandTotal.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total expenses from {Object.keys(totals.totalByCategory).length}{" "}
            categories
          </p>

          <div className="mt-4 space-y-2">
            {Object.entries(totals.totalByCategory).map(
              ([category, amount], i) => (
                <div className="flex items-center" key={category}>
                  <div
                    className="h-2 w-2 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <div className="flex-1 text-sm">{category}</div>
                  <div className="font-medium">${amount.toFixed(2)}</div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Expense Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {chartData.length > 0 ? (
              <ChartContainer config={{}} className="h-full w-full">
                {/* Pie Chart would go here - using recharts */}
                {chartData.length > 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Chart visualization available in full implementation
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      No data available
                    </p>
                  </div>
                )}
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No data available
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

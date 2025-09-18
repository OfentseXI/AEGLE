import { ReactNode } from "react";
import { MainNav } from "./MainNav";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "accountant" | "business";
  userName?: string;
  companyName?: string;
}

export function DashboardLayout({
  children,
  userType,
  userName = "Demo User",
  companyName = "Demo Company",
}: DashboardLayoutProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <MainNav userType={userType} />
      <div className="flex flex-col">
        <DashboardHeader
          userType={userType}
          userName={userName}
          companyName={companyName}
        />
        <main className="flex-1 p-6 bg-ledger-background">{children}</main>
      </div>
    </div>
  );
}

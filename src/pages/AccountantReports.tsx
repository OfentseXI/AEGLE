import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportsContent } from "@/components/reports/ReportsContent";

const AccountantReports = () => {
  return (
    <DashboardLayout
      userType="accountant"
      userName="Sarah Taylor"
      companyName="Taylor Accounting Services"
    >
      <ReportsContent userType="accountant" />
    </DashboardLayout>
  );
};

export default AccountantReports;

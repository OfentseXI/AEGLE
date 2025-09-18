import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AccountantDashboardContent } from "@/components/dashboard/AccountantDashboardContent";

const AccountantDashboard = () => {
  return (
    <DashboardLayout
      userType="accountant"
      userName="Sarah Taylor"
      companyName="Taylor Accounting Services"
    >
      <AccountantDashboardContent />
    </DashboardLayout>
  );
};

export default AccountantDashboard;

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BusinessDashboardContent } from "@/components/dashboard/BusinessDashboardContent";

const BusinessDashboard = () => {
  return (
    <DashboardLayout
      userType="business"
      userName="Alex Johnson"
      companyName="Johnson Enterprises Ltd"
    >
      <BusinessDashboardContent />
    </DashboardLayout>
  );
};

export default BusinessDashboard;

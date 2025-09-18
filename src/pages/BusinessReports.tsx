import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportsContent } from "@/components/reports/ReportsContent";

const BusinessReports = () => {
  return (
    <DashboardLayout
      userType="business"
      userName="John Doe"
      companyName="Business Corp"
    >
      <ReportsContent userType="business" />
    </DashboardLayout>
  );
};

export default BusinessReports;

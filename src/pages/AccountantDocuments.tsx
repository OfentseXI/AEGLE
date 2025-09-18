import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DocumentsTable } from "@/components/documents/DocumentsTable";

const AccountantDocuments = () => {
  return (
    <DashboardLayout
      userType="accountant"
      userName="Sarah Taylor"
      companyName="Taylor Accounting Services"
    >
      <DocumentsTable userType="accountant" />
    </DashboardLayout>
  );
};

export default AccountantDocuments;

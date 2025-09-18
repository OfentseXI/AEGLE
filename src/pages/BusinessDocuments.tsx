import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DocumentsTable } from "@/components/documents/DocumentsTable";

const BusinessDocuments = () => {
  return (
    <DashboardLayout
      userType="business"
      userName="Alex Johnson"
      companyName="Johnson Enterprises Ltd"
    >
      <DocumentsTable userType="business" />
    </DashboardLayout>
  );
};

export default BusinessDocuments;

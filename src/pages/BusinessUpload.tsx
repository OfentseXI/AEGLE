import { UploadDocuments } from "@/components/documents/UploadDocuments";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const BusinessUpload = () => {
  const navigateToLedger = () => {
    window.location.href = "/general-ledger";
  };

  return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Upload Documents</h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={navigateToLedger}
          >
            <FileText className="h-4 w-4" />
            View General Ledger
          </Button>
        </div>
        <UploadDocuments currentUserCompany={""} />
      </div>
  );
};

export default BusinessUpload;

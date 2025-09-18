import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OCRProcessor } from "@/components/ocr/OCRProcessor";
import { useLanguage } from "@/contexts/LanguageContext";

const BusinessOCR = () => {
  const { t } = useLanguage();

  return (
    <DashboardLayout
      userType="business"
      userName="Alex Johnson"
      companyName="Johnson Enterprises Ltd"
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">
            {t("business.ocrProcessingTitle")}
          </h1>
          <p className="text-muted-foreground">{t("common.uploadDesc")}</p>
        </div>
        <OCRProcessor />
      </div>
    </DashboardLayout>
  );
};

export default BusinessOCR;

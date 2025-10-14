import { OCRProcessor } from "@/components/ocr/OCRProcessor";
import { useLanguage } from "@/contexts/LanguageContext";

const BusinessOCR = () => {
  const { t } = useLanguage();

  return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">
            {t("business.ocrProcessingTitle")}
          </h1>
          <p className="text-muted-foreground">{t("common.uploadDesc")}</p>
        </div>
        <OCRProcessor />
      </div>

  );
};

export default BusinessOCR;

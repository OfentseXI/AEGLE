import { LedgerView } from "@/components/ledger/LedgerView";
import { useLanguage } from "@/contexts/LanguageContext";

const GeneralLedger = () => {
  const { t } = useLanguage();

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t("business.generalLedgerTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("business.generalLedgerSubtitle")}
          </p>
        </div>

        <LedgerView />
      </div>
  );
};

export default GeneralLedger;

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Calculator } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <div className="text-center mb-12">
          <Logo
            src="/uploads/logo1.png"
            alt="AEGL - Auditive Engine Generative Ledger logo"
            className="h-32 w-auto object-contain mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-teal-400 mb-4">
            {t("common.welcome")}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t("common.welcomeSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-slate-700 hover:border-teal-400 bg-slate-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-teal-400" />
              </div>
              <CardTitle className="text-2xl text-slate-100">
                {t("common.businessPortal")}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {t("common.businessDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/business-dashboard")}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                size="lg"
              >
                {t("common.getStarted")}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-slate-700 hover:border-purple-400 bg-slate-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-purple-400" />
              </div>
              <CardTitle className="text-2xl text-slate-100">
                {t("common.accountantPortal")}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {t("common.accountantDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/accountant-dashboard")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                {t("common.getStarted")}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => {
              // Open support or contact form
              console.log("Opening support...");
            }}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            {t("common.support")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

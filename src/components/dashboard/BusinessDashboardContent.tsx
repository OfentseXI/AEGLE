import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  BarChart3,
  BookOpen,
  Camera,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RequestManagementAccount } from "@/components/business/RequestManagementAccount";
import { useLanguage } from "@/contexts/LanguageContext";

export const BusinessDashboardContent = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const quickActions = [
    {
      title: t("business.uploadDocuments"),
      description: t("business.uploadDocumentsDesc"),
      icon: Upload,
      href: "/business-upload",
      color: "bg-blue-500",
    },
    {
      title: t("business.viewDocuments"),
      description: t("business.viewDocumentsDesc"),
      icon: FileText,
      href: "/business-documents",
      color: "bg-green-500",
    },
    {
      title: t("business.ocrScanner"),
      description: t("business.ocrScannerDesc"),
      icon: Camera,
      href: "/business-ocr",
      color: "bg-purple-500",
    },
    {
      title: t("business.generalLedger"),
      description: t("business.generalLedgerDesc"),
      icon: BookOpen,
      href: "/general-ledger",
      color: "bg-orange-500",
    },
    {
      title: t("business.reports"),
      description: t("business.reportsDesc"),
      icon: BarChart3,
      href: "/business-reports",
      color: "bg-red-500",
    },
    {
      title: t("business.profileSettings"),
      description: t("business.profileSettingsDesc"),
      icon: Settings,
      href: "/profile-settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("business.dashboardTitle")}
        </h2>
        <p className="text-muted-foreground">
          {t("business.dashboardSubtitle")}
        </p>
      </div>

      {/* Management Account Request Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <RequestManagementAccount />

        <Card>
          <CardHeader>
            <CardTitle>{t("common.recentActivity")}</CardTitle>
            <CardDescription>
              {t("business.recentActivitiesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>{t("common.noRecentActivity")}</p>
              <p className="text-sm">{t("common.uploadToSeeActivity")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {t("common.quickActions")}
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-md ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-3">
                  {action.description}
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(action.href)}
                  className="w-full"
                >
                  {t("common.access")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

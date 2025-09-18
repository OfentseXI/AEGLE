import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Upload,
  Bell,
  Users,
  Settings,
  FileSpreadsheet,
  HelpCircle,
  BookOpen,
  ScanText,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MainNavProps {
  userType: "accountant" | "business";
}

export function MainNav({ userType }: MainNavProps) {
  const location = useLocation();
  const { t } = useLanguage();

  const isAccountant = userType === "accountant";

  const navItems = isAccountant
    ? [
        {
          href: "/accountant-dashboard",
          icon: LayoutDashboard,
          label: t("nav.dashboard"),
        },
        { href: "/accountant-clients", icon: Users, label: t("nav.clients") },
        {
          href: "/accountant-documents",
          icon: FileText,
          label: t("nav.documents"),
        },
        {
          href: "/accountant-reports",
          icon: FileSpreadsheet,
          label: t("nav.reports"),
        },
        {
          href: "/accountant-notifications",
          icon: Bell,
          label: t("nav.notifications"),
        },
        {
          href: "/accountant-settings",
          icon: Settings,
          label: t("nav.settings"),
        },
      ]
    : [
        {
          href: "/business-dashboard",
          icon: LayoutDashboard,
          label: t("nav.dashboard"),
        },
        {
          href: "/business-documents",
          icon: FileText,
          label: t("nav.documents"),
        },
        {
          href: "/process-source-documents",
          icon: ScanText,
          label: t("nav.processSourceDocuments"),
        },
        {
          href: "/international-trade",
          icon: Globe,
          label: t("nav.internationalTrade"),
        },
        {
          href: "/business-reports",
          icon: FileSpreadsheet,
          label: t("nav.reports"),
        },
        {
          href: "/general-ledger",
          icon: BookOpen,
          label: t("nav.generalLedger"),
        },
        {
          href: "/business-notifications",
          icon: Bell,
          label: t("nav.notifications"),
        },
        {
          href: "/profile-settings",
          icon: Settings,
          label: t("nav.profileSettings"),
        },
      ];

  return (
    <div className="flex h-screen flex-col border-r border-green-200">
      <div className="flex h-14 items-center border-b border-green-200 px-4">
        <Link
          to={isAccountant ? "/accountant-dashboard" : "/business-dashboard"}
          className="flex items-center gap-2 font-semibold"
        >
          <img
            src="/uploads/logo.png"
            alt="AEGL Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
            Aegl.ai
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-purple",
                location.pathname === item.href
                  ? "bg-accent text-purple"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            {t("common.helpSupport")}
          </Button>
          {/* Removed Sign Out button for now */}
        </div>
      </div>
    </div>
  );
}

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardHeaderProps {
  userType: "accountant" | "business";
  userName: string;
  companyName: string;
}

export function DashboardHeader({
  userType,
  userName,
  companyName,
}: DashboardHeaderProps) {
  const { t } = useLanguage();
  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-ledger-border bg-background px-6 sticky top-0 z-10">
      <div className="w-full flex-1 flex items-center gap-2 md:gap-4">
        <form className="hidden md:flex-1 md:flex max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("common.search")}
              className="w-full appearance-none bg-background pl-8 shadow-none"
            />
          </div>
        </form>

        {/* Language Selector */}
        <LanguageSelector />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="relative h-8 w-8 rounded-full"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-[10px] bg-purple">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-background border"
          >
            <DropdownMenuLabel>{t("nav.notifications")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userType === "accountant" ? (
              <>
                <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                  <div className="font-medium">
                    {t("accountant.newDocumentUploaded")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("notifications.newDocumentUploadedDesc")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    2 {t("accountant.minutesAgo")}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                  <div className="font-medium">
                    {t("accountant.accountRequestSubmitted")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("notifications.accountRequestDesc")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    1 {t("accountant.hoursAgo")}
                  </div>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                  <div className="font-medium">
                    {t("accountant.reportReady")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("notifications.reportReadyDesc")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    10 {t("accountant.minutesAgo")}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                  <div className="font-medium">
                    {t("accountant.documentReviewComplete")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("notifications.documentReviewDesc")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    3 {t("accountant.hoursAgo")}
                  </div>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
              <div className="font-medium">{t("accountant.systemUpdate")}</div>
              <div className="text-xs text-muted-foreground">
                {t("notifications.systemUpdateDesc")}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                1 {t("accountant.dayAgo")}
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-purple cursor-pointer">
              {t("accountant.viewAllNotifications")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="bg-purple-light text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">
                  {companyName}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border">
            <DropdownMenuLabel>{t("common.account")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("common.profile")}</DropdownMenuItem>
            <DropdownMenuItem>{t("common.settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("common.signOut")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

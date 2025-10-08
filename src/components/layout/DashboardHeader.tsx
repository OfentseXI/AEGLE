import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { signOut } from "firebase/auth";
import { auth } from "@/integrations/firebase/client";

interface DashboardHeaderProps {
  userType: "accountant" | "business" | "admin";
  userName: string;
  companyName?: string;
}

export function DashboardHeader({
  userType,
  userName,
  companyName,
}: DashboardHeaderProps) {
  const { t } = useLanguage();

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = "/"; // redirect to landing page
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b border-ledger-border bg-background px-6 sticky top-0 z-10">
      <div className="w-full flex-1 flex items-center gap-2 md:gap-4">
        {/* Search */}
        <form className="hidden md:flex-1 md:flex max-w-sm">
          <div className="relative w-full">
            <input
              type="search"
              placeholder={t("common.search")}
              className="w-full pl-8 bg-background text-sm rounded-md"
            />
            <Bell className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </form>

        {/* Language selector */}
        <LanguageSelector />

        {/* Notifications */}
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
            <DropdownMenuItem>
              <div className="font-medium">System Update</div>
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

        {/* Account menu */}
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
                {companyName && (
                  <span className="text-xs text-muted-foreground">
                    {companyName}
                  </span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border">
            <DropdownMenuLabel>{t("common.account")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("common.profile")}</DropdownMenuItem>
            <DropdownMenuItem>{t("common.settings")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              {t("common.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

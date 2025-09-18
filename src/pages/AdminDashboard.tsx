import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
//import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAdminAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserName(profile.full_name || "");
          setCompanyName(profile.company_name || "");
          setIsAdmin(profile.is_admin || false);
        }
      }
    };
    checkAdminAccess();
  }, []);

  if (!isAdmin) {
    return (
      <DashboardLayout
        userType="business"
        userName={userName}
        companyName={companyName}
      >
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You do not have access to this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="business"
      userName={userName}
      companyName={companyName}
    >
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <AdminUserTable searchQuery={searchQuery} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

const AdminDashboard = () => {
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profileRef = doc(db, "profiles", user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const profileData = profileSnap.data();
            setUserName(profileData.full_name || "");
            setCompanyName(profileData.company_name || "");
            setIsAdmin(profileData.is_admin || false);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isAdmin) {
    return (
      <DashboardLayout
        userId=""
        userType="business"
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
      userId=""
      userType="business"
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

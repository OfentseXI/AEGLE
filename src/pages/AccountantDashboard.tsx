import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AccountantDashboardContent } from "@/components/dashboard/AccountantDashboardContent";
import { useToast } from "@/hooks/use-toast";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

const AccountantDashboard = () => {
  const { toast } = useToast();
  const [userName, setUserName] = useState<string>("Loading...");
  const [companyName, setCompanyName] = useState<string>("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        toast({
          title: "Not logged in",
          description: "Please sign in to access the dashboard",
          variant: "destructive",
        });
        setUserName("Unknown User");
        setCompanyName("Unknown Company");
        setLoading(false);
        return;
      }

      try {
        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setUserName(profileData.full_name || "Unknown User");
          setCompanyName(profileData.company_name || "Unknown Company");
        } else {
          setUserName("Unknown User");
          setCompanyName("Unknown Company");
        }
      } catch (err: unknown) {
        toast({
          title: "Error",
          description: "An unknown error has occured",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, [toast]);

  if (loading) {
    return (
      <DashboardLayout
        userType="accountant"
        userId=""
      >
        <div className="container mx-auto py-6 text-center text-gray-500">
          Loading dashboard...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="accountant"
      userId=""
    >
      <AccountantDashboardContent />
    </DashboardLayout>
  );
};

export default AccountantDashboard;

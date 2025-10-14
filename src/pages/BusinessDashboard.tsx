import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BusinessDashboardContent } from "@/components/dashboard/BusinessDashboardContent";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

const BusinessDashboard = () => {
  const [userName, setUserName] = useState("Loading...");
  const [companyName, setCompanyName] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "profiles", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const profileData = docSnap.data();
            setUserName(profileData.full_name || "Unknown User");
            setCompanyName(profileData.company_name || "Unknown Company");
          } else {
            console.warn("No profile found for user:", user.uid);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setUserName("Guest");
        setCompanyName("Guest Company");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Dashboard...
      </div>
    );
  }

  return (
      <BusinessDashboardContent />
  );
};

export default BusinessDashboard;

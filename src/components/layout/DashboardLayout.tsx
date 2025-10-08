import { ReactNode, useEffect, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { MainNav } from "./MainNav";
import { auth, db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";

interface DashboardLayoutProps {
  userType: "business" | "accountant" | "admin";
  userId: string;
  children: ReactNode;
}

interface UserProfile {
  full_name: string;
  company_name?: string;
}

export function DashboardLayout({
  userType,
  userId,
  children,
}: DashboardLayoutProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "profiles", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            full_name: data.full_name,
            company_name: data.company_name,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen">
      <MainNav userType={userType} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          userType={userType}
          userName={profile?.full_name || "User"}
          companyName={profile?.company_name}
        />
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

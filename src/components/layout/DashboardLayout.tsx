import { ReactNode, useEffect, useState } from "react";
import { MainNav } from "./MainNav";
import { DashboardHeader } from "./DashboardHeader";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase"; 

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "accountant" | "business";
  userId: string;
}

export function DashboardLayout({
  children,
  userType,
  userId,
}: DashboardLayoutProps) {
  const [userName, setUserName] = useState<string>("Loading...");
  const [companyName, setCompanyName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(firestore, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserName(data.name || "Unknown User");

          if (data.companyId) {
            const companyRef = doc(firestore, "companies", data.companyId);
            const companySnap = await getDoc(companyRef);
            if (companySnap.exists()) {
              setCompanyName(companySnap.data().name || "Unknown Company");
            } else {
              setCompanyName("Unknown Company");
            }
          } else {
            setCompanyName("No Company Assigned");
          }
        } else {
          setUserName("Unknown User");
          setCompanyName("Unknown Company");
        }
      } catch (error) {
        console.error("Error fetching user/company data:", error);
        setUserName("Error");
        setCompanyName("Error");
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <MainNav userType={userType} />
      <div className="flex flex-col">
        <DashboardHeader
          userType={userType}
          userName={userName}
          companyName={companyName}
        />
        <main className="flex-1 p-6 bg-ledger-background">{children}</main>
      </div>
    </div>
  );
}

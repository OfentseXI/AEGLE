import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const auth = getAuth();

    //  Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          //  Fetch profile from Firestore
          const profileRef = doc(db, "profiles", firebaseUser.uid);
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
            const profile = profileSnap.data();
            setUserName(profile.full_name || "");
            setCompanyName(profile.company_name || "");
          } else {
            toast({
              title: "Profile not found",
              description: "No profile data available for this user.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Could not load profile information.",
            variant: "destructive",
          });
        }
      } else {
        setUser(null);
        setUserName("");
        setCompanyName("");
      }
    });

    return () => unsubscribe(); // ✅ Clean up listener
  }, [toast]);

  return (
    <DashboardLayout
      userType="business"
      userId=""
    >
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <ProfileForm />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettings;

import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

type NotificationType = "email" | "in_app" | "both" | "none";

export function NotificationSettings() {
  const { toast } = useToast();
  const [notificationPreference, setNotificationPreference] =
    useState<NotificationType>("both");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          if (data.notification_preferences) {
            setNotificationPreference(
              data.notification_preferences as NotificationType
            );
          }
        }
      } catch (error) {
        console.error("Error loading notification settings:", error);
        toast({
          title: "Error",
          description: "Could not load your notification settings.",
          variant: "destructive",
        });
      }
    };

    loadSettings();
  }, [toast]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No user found");

      const profileRef = doc(db, "profiles", user.uid);

      // ensure profile doc exists
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        await updateDoc(profileRef, {
          notification_preferences: notificationPreference,
        });
      } else {
        await setDoc(profileRef, {
          notification_preferences: notificationPreference,
          email: user.email,
        });
      }

      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error: unknown) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Could not save settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Notification Preferences</h4>
        <RadioGroup
          value={notificationPreference}
          onValueChange={setNotificationPreference as (value: string) => void}
          className="grid gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email">Email only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in_app" id="in_app" />
            <Label htmlFor="in_app">In-app only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Both email and in-app</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">No notifications</Label>
          </div>
        </RadioGroup>
      </div>
      <Button onClick={onSubmit}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}

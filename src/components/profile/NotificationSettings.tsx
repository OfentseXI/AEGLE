import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
//import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type NotificationType = Database["public"]["Enums"]["notification_type"];

export function NotificationSettings() {
  const { toast } = useToast();
  const [notificationPreference, setNotificationPreference] =
    useState<NotificationType>("both");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("notification_preferences")
          .eq("id", user.id)
          .single();

        if (profile && profile.notification_preferences) {
          // Cast the value to ensure type safety
          setNotificationPreference(
            profile.notification_preferences as NotificationType
          );
        }
      }
    };
    loadSettings();
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: notificationPreference })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
});

export function ProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      company_name: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profile = profileSnap.data();
          form.reset({
            full_name: profile.full_name || "",
            company_name: profile.company_name || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Could not load your profile data.",
          variant: "destructive",
        });
      }
    };

    loadProfile();
  }, [form, toast]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("No user found");

      const profileRef = doc(db, "profiles", user.uid);

      // If profile exists, update. Otherwise, create new.
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        await updateDoc(profileRef, values);
      } else {
        await setDoc(profileRef, { ...values, email: user.email });
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error.message || "Could not save profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}

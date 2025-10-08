/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTypeSelect } from "./UserTypeSelect";
import { useToast } from "@/hooks/use-toast";

import { auth, db } from "@/integrations/firebase/client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Countries
const COUNTRIES = [
  { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R" },
  { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh" },
  { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
];

type UserType = "accountant" | "business" | null;

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  country: z.enum(COUNTRIES.map((c) => c.code) as [string, ...string[]]).optional(),
});

interface AuthFormProps {
  onLoginSuccess?: () => void;
}

export function AuthForm({ onLoginSuccess }: AuthFormProps) {
  const [authMode, setAuthMode] = useState<"login" | "register" | "select-type" | "forgot-password">("select-type");
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", name: "", companyName: "", country: undefined },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User already logged in:", user.email);
        onLoginSuccess?.(); // Trigger callback if user is already logged in
      }
    });
    return () => unsubscribe();
  }, [onLoginSuccess]);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setAuthMode("register");
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create profile if not exists
      const profileRef = doc(db, "profiles", user.uid);
      const profileSnap = await getDoc(profileRef);
      if (!profileSnap.exists()) {
        await setDoc(profileRef, {
          full_name: user.displayName || "",
          email: user.email,
          userType,
          created_at: serverTimestamp(),
        });
      }

      onLoginSuccess?.(); // Trigger callback
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, { url: `${window.location.origin}/reset-password` });
      toast({ title: "Password Reset", description: "Check your email for instructions." });
      setAuthMode("login");
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (authMode === "login") {
        const userCredential = await signInWithEmailAndPassword(auth, values.email.trim(), values.password);
        console.log("Login successful:", userCredential.user.email);
        onLoginSuccess?.(); // Trigger callback
      } else if (authMode === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email.trim(), values.password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "profiles", uid), {
          full_name: values.name || "",
          company_name: values.companyName || "",
          country: values.country || null,
          userType,
          created_at: serverTimestamp(),
        });

        toast({ title: "Registered", description: "Check email for verification." });
        form.reset();
        setAuthMode("login");
      } else if (authMode === "forgot-password") {
        await handleForgotPassword(values.email);
      }
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (authMode === "select-type") return <UserTypeSelect onSelect={handleUserTypeSelect} />;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-ledger-border bg-ledger-background">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-ledger-text-primary">
            {authMode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center text-ledger-text-secondary">
            {userType === "accountant" ? "Accounting Firm Portal" : "Business Account Portal"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              Continue with Google
            </Button>

            <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "register")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {authMode === "register" && (
                    <>
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl><input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{userType === "accountant" ? "Accounting Firm" : "Business Name"}</FormLabel>
                          <FormControl><input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </>
                  )}

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>

                  <Button type="submit" className="w-full bg-green-500">
                    {isLoading ? "Processing..." : authMode === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>
              </Form>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

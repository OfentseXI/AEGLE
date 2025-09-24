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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { auth, db } from "@/integrations/firebase/client"; // your firebase client file
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Countries with their respective currencies
const COUNTRIES = [
  { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R" },
  { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh" },
  { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
];

type UserType = "accountant" | "business" | null;

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(1, { message: "Name is required" }).optional(),
  companyName: z
    .string()
    .min(1, { message: "Company name is required" })
    .optional(),
  country: z
    .enum(COUNTRIES.map((c) => c.code) as [string, ...string[]])
    .optional(),
});

export function AuthForm() {
  const [authMode, setAuthMode] = useState<
    "login" | "register" | "select-type" | "forgot-password"
  >("select-type");
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      companyName: "",
      country: undefined,
    },
  });

  // ✅ Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User logged in:", user.email);
        navigate("/business-dashboard"); // default
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setAuthMode("register");
  };

  // ✅ Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if profile exists
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

      navigate("/business-dashboard");
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Forgot password
  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`,
      });

      toast({
        title: "Password Reset Email Sent",
        description:
          "Check your email for instructions to reset your password.",
      });

      setAuthMode("login");
    } catch (error: any) {
      console.error("Reset password exception:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (authMode === "forgot-password") {
      await handleForgotPassword(values.email);
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === "login") {
        // Login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email.trim(),
          values.password
        );
        console.log("Login successful:", userCredential.user.email);
        navigate("/business-dashboard");
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        // Registration
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email.trim(),
          values.password
        );
        const uid = userCredential.user.uid;

        // Store user profile
        await setDoc(doc(db, "profiles", uid), {
          full_name: values.name || "",
          company_name: values.companyName || "",
          country: values.country || null,
          userType,
          created_at: serverTimestamp(),
        });

        toast({
          title: "Registration Successful",
          description:
            "Please check your email to verify your account before signing in.",
        });

        form.reset();
        setAuthMode("login");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authMode === "select-type") {
    return <UserTypeSelect onSelect={handleUserTypeSelect} />;
  }

  if (authMode === "forgot-password") {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="border-ledger-border bg-ledger-background">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-ledger-text-primary">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-ledger-text-secondary">
              Enter your email address and we'll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => setAuthMode("login")}>
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-ledger-border bg-ledger-background">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-ledger-text-primary">
            {authMode === "login" ? "Welcome Back" : "Create Your Account"}
          </CardTitle>
          <CardDescription className="text-center text-ledger-text-secondary">
            {userType === "accountant"
              ? "Accounting Firm Portal"
              : "Business Account Portal"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <Tabs
              value={authMode}
              onValueChange={(v) => setAuthMode(v as "login" | "register")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-green-100">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {authMode === "register" && (
                    <>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {userType === "accountant"
                                ? "Accounting Firm Name"
                                : "Business Name"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  userType === "accountant"
                                    ? "ABC Accounting Services"
                                    : "XYZ Business Ltd"
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COUNTRIES.map((country) => (
                                  <SelectItem
                                    key={country.code}
                                    value={country.code}
                                  >
                                    {country.name} ({country.currency})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {authMode === "login" && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setAuthMode("forgot-password")}
                        className="p-0 h-auto text-sm text-green-600 hover:text-green-700"
                      >
                        Forgot password?
                      </Button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    {isLoading
                      ? "Processing..."
                      : authMode === "login"
                      ? "Sign In"
                      : "Create Account"}
                  </Button>
                </form>
              </Form>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setAuthMode("select-type")}>
            Change Account Type
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/integrations/firebase/client";

// Pages
import DashboardSelection from "./pages/DashboardSelection";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import BusinessDashboard from "./pages/BusinessDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import BusinessUpload from "./pages/BusinessUpload";
import BusinessDocuments from "./pages/BusinessDocuments";
import AccountantDocuments from "./pages/AccountantDocuments";
import BusinessOCR from "./pages/BusinessOCR";
import ProcessSourceDocuments from "./pages/ProcessSourceDocuments";
import BusinessReports from "./pages/BusinessReports";
import AccountantReports from "./pages/AccountantReports";
import ProfileSettings from "./pages/ProfileSettings";
import AdminDashboard from "./pages/AdminDashboard";
import AccountantClients from "./pages/AccountantClients";
import GeneralLedger from "./pages/GeneralLedger";
import ResetPassword from "./pages/ResetPassword";
import InternationalTrade from "./pages/InternationalTrade";

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AuthForm } from "./components/auth/AuthForm";

const queryClient = new QueryClient();

// Wrapper for Login to handle redirect after login
const LoginWrapper = () => {
  const { dashboard } = useParams<{ dashboard: string }>();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    switch (dashboard) {
      case "business":
        navigate("/business-dashboard");
        break;
      case "accountant":
        navigate("/accountant-dashboard");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  };

  return <AuthForm onLoginSuccess={handleLoginSuccess} />;
};

// Protected Route wrapper with optional layout
const ProtectedRoute = ({
  children,
  user,
  userType,
  useLayout = false,
}: {
  children: React.ReactNode;
  user: any;
  userType?: "business" | "accountant" | "admin";
  useLayout?: boolean;
}) => {
  if (!user) {
    return <Navigate to="/login/business" replace />;
  }

  if (useLayout && userType) {
    return (
      <DashboardLayout userType={userType} userId={user.uid}>
        {children}
      </DashboardLayout>
    );
  }

  return <>{children}</>;
};

const App = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login/:dashboard" element={<LoginWrapper />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute user={user} useLayout={false}>
                  <DashboardSelection />
                </ProtectedRoute>
              }
            />

            {/* Business Routes */}
            <Route
              path="/business-dashboard"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business-upload"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <BusinessUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business-documents"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <BusinessDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business-ocr"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <BusinessOCR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/process-source-documents"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <ProcessSourceDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business-reports"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <BusinessReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/general-ledger"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <GeneralLedger />
                </ProtectedRoute>
              }
            />
            <Route
              path="/international-trade"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <InternationalTrade />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile-settings"
              element={
                <ProtectedRoute
                  user={user}
                  userType="business"
                  useLayout={true}
                >
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />

            {/* Accountant Routes */}
            <Route
              path="/accountant-dashboard"
              element={
                <ProtectedRoute
                  user={user}
                  userType="accountant"
                  useLayout={true}
                >
                  <AccountantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant-clients"
              element={
                <ProtectedRoute
                  user={user}
                  userType="accountant"
                  useLayout={true}
                >
                  <AccountantClients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant-documents"
              element={
                <ProtectedRoute
                  user={user}
                  userType="accountant"
                  useLayout={true}
                >
                  <AccountantDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accountant-reports"
              element={
                <ProtectedRoute
                  user={user}
                  userType="accountant"
                  useLayout={true}
                >
                  <AccountantReports />
                </ProtectedRoute>
              }
            />

            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={user} userType="admin" useLayout={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

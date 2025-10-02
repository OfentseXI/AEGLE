import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />

          {/* Business Routes */}
          <Route path="/business-dashboard" element={<BusinessDashboard />} />
          <Route path="/business-upload" element={<BusinessUpload />} />
          <Route path="/business-documents" element={<BusinessDocuments />} />
          <Route path="/business-ocr" element={<BusinessOCR />} />
          <Route
            path="/process-source-documents"
            element={<ProcessSourceDocuments />}
          />
          <Route path="/business-reports" element={<BusinessReports />} />
          <Route path="/general-ledger" element={<GeneralLedger />} />
          <Route path="/international-trade" element={<InternationalTrade />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />

          {/* Accountant Routes */}
          <Route
            path="/accountant-dashboard"
            element={<AccountantDashboard />}
          />
          <Route path="/accountant-clients" element={<AccountantClients />} />
          <Route
            path="/accountant-documents"
            element={<AccountantDocuments />}
          />
          <Route path="/accountant-reports" element={<AccountantReports />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

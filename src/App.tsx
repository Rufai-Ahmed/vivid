import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/AuthPages/Login";
import Signup from "./pages/AuthPages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AdminAuth from "./pages/AdminAuth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import WorldCup from "./pages/WorldCup";
import VisaApplication from "./pages/VisaApplication";
import Hotels from "./pages/Hotels";
import RedeemTicket from "./pages/RedeemTicket";
import PaymentVerification from "./pages/PaymentVerification";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import BackToTopButton from "./components/bloc/BackToTopButton/BackToTopButton";
import Online from "./components/bloc/Online/Online";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BackToTopButton />
          <Online />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/login" element={<AdminAuth />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/redeem"
                element={
                  <ProtectedRoute>
                    <RedeemTicket />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/visa"
                element={
                  <ProtectedRoute>
                    <VisaApplication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/hotels"
                element={
                  <ProtectedRoute>
                    <Hotels />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/world-cup"
                element={
                  <ProtectedRoute>
                    <WorldCup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { DashboardLayout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import PendingHotels from "./pages/PendingHotels";
import Login from "./pages/Login";
import WithdrawRequests from "./pages/WithdrawRequests";
import SystemAttributes from "./pages/SystemAttributes";
import { AuthProvider, useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof Error && error.message === "Unauthorized") {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof Error && error.message === "Unauthorized") {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="pending-hotels" element={<PendingHotels />} />
                <Route path="hotels" element={<Hotels />} />
                <Route path="hotels/:hotelId" element={<HotelDetails />} />
                <Route path="users" element={<Users />} />
                <Route path="attributes" element={<SystemAttributes />} />
                <Route path="withdraw-requests" element={<WithdrawRequests />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

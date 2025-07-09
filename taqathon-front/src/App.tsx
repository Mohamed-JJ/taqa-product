import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AnomalyList from "./pages/AnomalyList";
import CreateAnomaly from "./pages/CreateAnomaly";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { Navigate, useLocation } from "react-router-dom";
import Verify from "./pages/Verify";
import Auth from "./pages/Auth";
import AnomalyDetails from "./pages/anomaly-details";
import { MaintenanceWindowDetails } from "./pages/MaintenanceWindowDetails";
import Settings from "./pages/Settings";
import Rex from "./pages/Rex";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    return token !== null;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

// Updated App.jsx
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/verify" element={<Verify />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="anomalies" element={<AnomalyList />} />
            <Route path="anomalies/create" element={<CreateAnomaly />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route
              path="maintenance/details/:id"
              element={<MaintenanceWindowDetails />}
            />

            {/* Placeholder routes - will be implemented in future iterations */}
            <Route path="anomalies/:id" element={<AnomalyDetails />} />
            <Route path="equipment" element={<Rex />} />
            <Route path="rex" element={<Rex />} />
            <Route
              path="reports"
              element={
                <div className="p-6 text-center text-muted-foreground">
                  {/* Reports & Analytics - Coming Soon */}
                </div>
              }
            />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

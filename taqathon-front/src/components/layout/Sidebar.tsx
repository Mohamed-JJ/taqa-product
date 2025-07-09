import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Plus,
  Calendar,
  Archive,
  BarChart3,
  Settings,
  X,
  Zap,
  Wrench,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { useNavigationTranslations } from "@/i18n/hooks/useTranslations";

import TaqaLogo from "@/assets/taqa-logo.svg";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const fetchAnomaliesCount = async () => {
  let count = 0;
  try {
    const fetch_res = await apiClient.get("/anomaly/count");
    return fetch_res.data;
  } catch (error: unknown) {
    toast("Failed fetching data");
  }
  return count;
};

const fetchMaintenanceWindowsCount = async () => {
  let count = 0;
  try {
    const fetch_res = await apiClient.get("/maintenance-windows/count");
    return fetch_res.data;
  } catch (error: unknown) {
    toast("Failed fetching data");
  }
  return count;
};

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const navT = useNavigationTranslations();
  const [anomaliesCount, setAnomaliesCount] = useState(0);
  const [maintenanceWindowsCount, setMaintenanceWindowsCount] = useState(0);
  const { maintenanceWindows } = useMaintenanceStore();

  useEffect(() => {
    const getCount = async () => {
      const [count, maintenanceWindowsCount] = await Promise.all([
        fetchAnomaliesCount(),
        fetchMaintenanceWindowsCount(),
      ]);
      setAnomaliesCount(count);
      setMaintenanceWindowsCount(maintenanceWindowsCount);
    };
    getCount();
  }, [maintenanceWindows]);

  const navigation = [
    {
      name: navT.dashboard,
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: navT.anomalies,
      href: "/anomalies",
      icon: AlertTriangle,
      badge: {
        count: anomaliesCount,
        variant: "destructive" as const,
      },
    },
    {
      name: navT.createAnomaly,
      href: "/anomalies/create",
      icon: Plus,
      badge: null,
    },
    {
      name: navT.maintenanceWindows,
      href: "/maintenance",
      icon: Calendar,
      badge: { count: maintenanceWindowsCount, variant: "secondary" as const },
    },
    {
      name: navT.rexArchive,
      href: "/rex",
      icon: Archive,
      badge: null,
    },
  ];

  const bottomNavigation = [
    {
      name: navT.settings,
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[#003D55] border-r border-white/10 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="rounded-lg flex items-center justify-center">
                <img src={TaqaLogo} alt="TAQA Logo" className="h-8 w-auto" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden text-white hover:text-white/70"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto industrial-scrollbar">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-md font-medium transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white hover:bg-white/10",
                  )}
                >
                  <item.icon className="h-3 w-3" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant={item.badge.variant} className="text-xs">
                      {item.badge.count}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom navigation */}
          <div className="p-4 border-t border-white/10 space-y-2">
            {bottomNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white hover:bg-white/10",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

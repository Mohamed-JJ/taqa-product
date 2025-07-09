import { create } from "zustand";
import { AnomalyStatus, MaintenanceWindow } from "@/types/anomaly";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { useAnomalyStore } from "./useAnomalyStore";

type MaintenanceStore = {
  maintenanceWindows: MaintenanceWindow[];
  setMaintenanceWindows: (windows: MaintenanceWindow[]) => void;
  selectedMaintenanceWindow: MaintenanceWindow | null;
  setSelectedMaintenanceWindow: (window: MaintenanceWindow) => void;
  getMaintenanceWindow: (id: string) => Promise<void>;
  addNewMaintenanceWindow: (windows: MaintenanceWindow) => Promise<void>;
  deleteMaintenanceWindow: (id: string) => Promise<void>;
  updateMaintenanceWindow: (id: string, data: MaintenanceWindow) => void;
  getMaintenanceWindows: () => Promise<void>;
  updateBothMaintenanceWindows: (
    sourceWindowId: string,
    draggedAnomalyId: number,
    targetWindowId: string,
    windows: {
      sourceWindow: MaintenanceWindow;
      targetWindow: MaintenanceWindow;
    },
  ) => Promise<void>;
  unassignAnomaly: (
    anomalyId: string,
    maintenanceWindowId: string,
  ) => Promise<void>;
  getMaintenanceWindowsNotSafe: () => Promise<void>;
  changeAnomalyStatusInMaintenanceWindow: (
    anomalyId: string,
    status: string,
  ) => Promise<void>;
};

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  maintenanceWindows: [],
  selectedMaintenanceWindow: null,

  setSelectedMaintenanceWindow: (window: MaintenanceWindow) => {
    set({ selectedMaintenanceWindow: window });
  },

  setMaintenanceWindows: (windows: MaintenanceWindow[]) => {
    set({ maintenanceWindows: windows });
  },

  getMaintenanceWindow: async (id: string) => {
    if (get().selectedMaintenanceWindow) return;
    try {
      const res = await apiClient.get(`/maintenance-windows/${id}`);
      set({ selectedMaintenanceWindow: res.data });
    } catch (err) {
      console.log(err);
      toast("Failed to get maintenance window");
    }
  },

  getMaintenanceWindows: async () => {
    if (get().maintenanceWindows.length > 0) return;
    try {
      const res = await apiClient.get("/maintenance-windows");
      set({ maintenanceWindows: res.data });
    } catch (err) {
      console.log("API Error:", err);
      toast("Failed to get maintenance windows");
    }
  },

  getMaintenanceWindowsNotSafe: async () => {
    try {
      const res = await apiClient.get("/maintenance-windows");
      set({ maintenanceWindows: res.data });
    } catch (err) {
      console.log(err);
      toast("Failed to get maintenance window");
    }
  },

  addNewMaintenanceWindow: async (windows: MaintenanceWindow) => {
    try {
      const formatDateToISO = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString();
      };

      const formattedWindows = {
        scheduleStart: formatDateToISO(windows.scheduleStart),
        scheduleEnd: formatDateToISO(windows.scheduleEnd),
        title: windows.title,
        type: windows.type,
      };

      const res1 = await apiClient.post(
        "/maintenance-windows",
        formattedWindows,
      );
      console.log(res1);
      get().getMaintenanceWindowsNotSafe();

      toast(
        res1.status === 201
          ? "Maintenance window added successfully"
          : "Failed to add maintenance window",
      );
    } catch (err) {
      console.log(err);
      toast.error(
        err.response.data.message || "Failed to add maintenance window",
      );
    }
  },

  deleteMaintenanceWindow: async (id: string) => {
    try {
      const res = await apiClient.delete(`/maintenance-windows/${id}`);
      toast(
        res.status === 200
          ? "Maintenance window deleted successfully"
          : "Failed to delete maintenance window",
      );

      const maintenanceWindow = get().maintenanceWindows;
      set({
        maintenanceWindows: maintenanceWindow.filter(
          (window) => window.id !== id,
        ),
      });
    } catch (err) {
      console.log(err);
    }
  },

  unassignAnomaly: async (anomalyId: string, maintenanceWindowId: string) => {
    try {
      const anomalyIdNum = Number(anomalyId);
      const res = await apiClient.delete(
        `/maintenance-windows/${maintenanceWindowId}/anomalies`,
        { data: { anomalyIds: [anomalyIdNum] } },
      );
      if (res.status === 200) {
        const maintenanceWindows = get().maintenanceWindows;
        if (!maintenanceWindows) return;

        set({
          maintenanceWindows: maintenanceWindows.map((window) =>
            window.id === maintenanceWindowId
              ? {
                  ...window,
                  anomalies: window.anomalies.filter(
                    (anomaly) => anomaly.id !== parseInt(anomalyId),
                  ),
                }
              : window,
          ),
        });
        get().getMaintenanceWindowsNotSafe();

        toast(
          200 === 200
            ? "Anomaly unassigned successfully"
            : "Failed to unassign anomaly",
        );
      }
    } catch (err) {
      console.log(err);
      toast("Failed to unassign anomaly");
    }
  },

  updateBothMaintenanceWindows: async (
    sourceWindowId: string,
    draggedAnomalyId: number,
    targetWindowId: string,
    windows: {
      sourceWindow: MaintenanceWindow;
      targetWindow: MaintenanceWindow;
    },
  ) => {
    try {
      const movedAnomaly = windows.targetWindow.anomalies.find(
        (anomaly) =>
          !windows.sourceWindow.anomalies.some(
            (sourceAnomaly) => sourceAnomaly.id === anomaly.id,
          ),
      );

      if (!movedAnomaly) {
        toast("Error: Could not identify the anomaly being moved");
        return;
      }

      const targetWindowCopy = {
        ...windows.targetWindow,
        anomalies: windows.targetWindow.anomalies.filter(
          (anomaly) => anomaly.id !== movedAnomaly.id,
        ),
      };

      const availableTime = Math.round(
        (new Date(targetWindowCopy.scheduleEnd).getTime() -
          new Date(targetWindowCopy.scheduleStart).getTime()) /
          (1000 * 60 * 60),
      );

      const requiredTime = movedAnomaly.estimatedTime || 0;

      if (requiredTime > availableTime) {
        toast(
          `Insufficient time in target maintenance window. ` +
            `Required: ${requiredTime}h, Available: ${availableTime.toFixed(1)}h`,
        );
        return;
      }

      const maintenanceWindow = get().maintenanceWindows;
      const updatedMaintenanceWindows = maintenanceWindow.map((window) => {
        if (window.id === sourceWindowId) {
          return windows.sourceWindow;
        } else if (window.id === targetWindowId) {
          return windows.targetWindow;
        }
        return window;
      });

      const res = await apiClient.patch(
        `/maintenance-windows/${targetWindowId}/anomalies`,
        { anomalyIds: [draggedAnomalyId] },
      );

      if (res.status === 200) {
        set({ maintenanceWindows: updatedMaintenanceWindows });

        toast(
          `Anomaly moved successfully. Target window has ${(availableTime - requiredTime).toFixed(1)}h remaining.`,
        );
      }
    } catch (err) {
      console.log(err);
      toast("Failed to move anomaly");
    }
  },

  changeAnomalyStatusInMaintenanceWindow: async (
    anomalyId: string,
    status: string,
  ) => {
    try {
      // Prepare payload with timestamp fields based on status transition
      const payload: any = { status };
      const currentDateTime = new Date().toISOString();

      if (status === "TREATED" || status === "traitee") {
        payload.treatedAt = currentDateTime;
      } else if (status === "CLOSED" || status === "cloture") {
        payload.closedAt = currentDateTime;
      }

      const res = await apiClient.patch(`/anomaly/${anomalyId}`, payload);
      if (res.status === 200) {
        const maintenanceWindows = get().maintenanceWindows;
        const { anomaly, setAnomaly } = useAnomalyStore.getState();

        if (anomaly) {
          setAnomaly({ ...anomaly, status: status as AnomalyStatus });
        }
        if (maintenanceWindows) {
          set({
            maintenanceWindows: maintenanceWindows.map((window) =>
              window.anomalies.some(
                (anomaly) => anomaly.id === Number(anomalyId),
              )
                ? {
                    ...window,
                    anomalies: window.anomalies.map((anomaly) =>
                      anomaly.id === Number(anomalyId)
                        ? { ...anomaly, status }
                        : anomaly,
                    ),
                  }
                : window,
            ),
          });
        }

        toast("Status updated successfully");
      } else {
        toast("Failed to update status");
      }
    } catch (err) {
      console.log(err);
      toast("Failed to change anomaly status");
    }
  },

  updateMaintenanceWindow: async (id: string, data: MaintenanceWindow) => {
    try {
      const formatDateToISO = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString();
      };

      const formattedWindows = {
        scheduleStart: formatDateToISO(data.scheduleStart),
        scheduleEnd: formatDateToISO(data.scheduleEnd),
        title: data.title,
        type: data.type,
      };
      const res = await apiClient.patch(
        `/maintenance-windows/${id}`,
        formattedWindows,
      );
      toast(
        res.status === 200
          ? "Maintenance window updated successfully"
          : "Failed to update maintenance window",
      );
      const maintenanceWindow = get().maintenanceWindows;
      const selectedMaintenanceWindow = get().selectedMaintenanceWindow;
      if (selectedMaintenanceWindow) {
        get().setSelectedMaintenanceWindow(data);
      }
      set({
        maintenanceWindows: maintenanceWindow.map((window) =>
          window.id === id ? { ...window, ...data } : window,
        ),
      });
    } catch (err) {
      console.log(err);
    }
  },
}));

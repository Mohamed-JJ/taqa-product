import { create } from "zustand";
import { Anomaly } from "@/types/anomaly";
import apiClient from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { useMaintenanceStore } from "./useMaintenanceStore";
interface AnomalyStore {
  anomalies: any;
  anomaliesOLD: any;
  anomaly: Anomaly | null;
  loading: boolean;
  getAnomalies: () => Promise<void>;
  searchAnomalies: (filters: {
    search?: string;
    status?: string;
    criticality?: string;
    description?: string;
    equipment?: string;
    system?: string;
    service?: string;
    sysShutDownRequired?: boolean;
    detectionDate?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  filterAnomalies: (
    searchTerm: string,
    statusFilter: string,
    criticalityFilter: string,
    descriptionFilter?: string,
    equipmentFilter?: string,
    systemFilter?: string,
    serviceFilter?: string,
    shutdownFilter?: string,
    detectionDate?: Date,
  ) => void;
  getAnomalyById: (id: string) => Promise<void>;
  updateAnomaly: (
    anomaly: Anomaly,
    data: Anomaly[],
    status: string,
    sysShutDownRequired: boolean,
    estimatedTime?: number,
    processSafety?: number,
    disponibility?: number,
    integrity?: number,
    userFeedBack?: boolean,
  ) => Promise<void>;
  editAnomaly: (anomalyId: string | number, updateData: any) => Promise<void>;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setAnomaly: (anomaly: Anomaly) => void;
  addAnomaly: (anomaly: any) => Promise<void>;
  extraData: {
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    anomaliesData?: {
      criticalAnomalies: number;
      treatedAnomalies: number;
      closedAnomalies: number;
    };
  } | null;
}

export const useAnomalyStore = create<AnomalyStore>((set, get) => ({
  anomalies: [],
  anomaliesOLD: [],
  anomaly: null,
  loading: false,
  page: 1,
  limit: 10,
  extraData: null,

  setAnomaly: (anomaly: Anomaly) => set({ anomaly }),

  setPage: (page: number) => set({ page }),
  setLimit: (limit: number) => set({ limit }),
  getAnomalies: async () => {
    set({ loading: true });
    try {
      console.log(`📊 Fetching anomalies: page=${get().page}, limit=${get().limit}`);
      
      const res = await apiClient.get(
        `/anomaly?page=${get().page}&limit=${get().limit}`,
      );
      const { data, ...rest } = res.data;
      
      console.log("✅ Anomalies fetched successfully:", {
        count: data?.length || 0,
        page: get().page,
        totalPages: rest.totalPages,
        totalCount: rest.totalCount,
      });

      set({
        anomalies: data,
        anomaliesOLD: data,
        extraData: rest,
        loading: false,
      });
    } catch (err: any) {
      console.error("❌ Error fetching anomalies:", {
        error: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        page: get().page,
        limit: get().limit,
      });
      
      toast("Error fetching anomalies");
      set({ loading: false });
    }
  },

  searchAnomalies: async (filters) => {
    set({ loading: true });
    
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add pagination
    params.set("page", (filters.page || get().page).toString());
    params.set("limit", (filters.limit || get().limit).toString());
    
    // Add filter parameters only if they have values
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status !== "all") params.set("status", filters.status);
    if (filters.description) params.set("description", filters.description);
    if (filters.equipment) params.set("equipment", filters.equipment);
    if (filters.system) params.set("system", filters.system);
    if (filters.service && filters.service !== "all") params.set("service", filters.service);
    if (filters.sysShutDownRequired !== undefined) params.set("sysShutDownRequired", filters.sysShutDownRequired.toString());
    if (filters.detectionDate) params.set("detectionDate", filters.detectionDate);
    
    const queryString = params.toString();
    console.log(`🔍 Searching anomalies with filters:`, {
      filters,
      queryString,
      url: `/anomaly/search?${queryString}`,
    });

    try {
      const res = await apiClient.get(`/anomaly/search?${queryString}`);
      const { data, ...rest } = res.data;

      console.log("✅ Anomaly search successful:", {
        resultsCount: data?.length || 0,
        filters: filters,
        totalPages: rest.totalPages,
        totalCount: rest.total,
      });

      set({
        anomalies: data,
        anomaliesOLD: data,
        extraData: rest,
        loading: false,
      });
    } catch (err: any) {
      console.error("❌ Error searching anomalies:", {
        error: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        filters,
        queryParams: queryString,
      });
      
      toast("Error searching anomalies");
      set({ loading: false });
    }
  },

  filterAnomalies: (
    searchTerm: string,
    statusFilter: string,
    criticalityFilter: string,
    descriptionFilter = "",
    equipmentFilter = "",
    systemFilter = "",
    serviceFilter = "all",
    shutdownFilter = "all",
    detectionDate?: Date,
  ) => {
    let filtered = get().anomaliesOLD;

    // General search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (anomaly) =>
          anomaly.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          anomaly.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (typeof anomaly.equipment === "string"
            ? anomaly.equipment.toLowerCase().includes(searchTerm.toLowerCase())
            : anomaly.equipment?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              anomaly.equipment?.equipmentNumber
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())),
      );
    }

    // Description filter
    if (descriptionFilter) {
      filtered = filtered.filter((anomaly) =>
        anomaly.description
          ?.toLowerCase()
          .includes(descriptionFilter.toLowerCase()),
      );
    }

    // Equipment filter
    if (equipmentFilter) {
      filtered = filtered.filter((anomaly) => {
        const equipment =
          typeof anomaly.equipment === "string"
            ? anomaly.equipment
            : anomaly.equipment?.name ||
              anomaly.equipment?.equipmentNumber ||
              "";
        return equipment.toLowerCase().includes(equipmentFilter.toLowerCase());
      });
    }

    // System filter
    if (systemFilter) {
      filtered = filtered.filter(
        (anomaly) =>
          anomaly.system?.toLowerCase().includes(systemFilter.toLowerCase()) ||
          anomaly.unit?.toLowerCase().includes(systemFilter.toLowerCase()) ||
          anomaly.currentSystemStatus
            ?.toLowerCase()
            .includes(systemFilter.toLowerCase()),
      );
    }

    // Service filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter(
        (anomaly) => anomaly.responsibleSection === serviceFilter,
      );
    }

    // System shutdown filter
    if (shutdownFilter !== "all") {
      const shutdownRequired = shutdownFilter === "true";
      filtered = filtered.filter(
        (anomaly) => Boolean(anomaly.sysShutDownRequired) === shutdownRequired,
      );
    }

    // Detection date filter
    if (detectionDate) {
      const filterDate = new Date(detectionDate);
      filterDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((anomaly) => {
        const anomalyDate = new Date(anomaly.detectionDate);
        anomalyDate.setHours(0, 0, 0, 0);
        return anomalyDate.getTime() === filterDate.getTime();
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((anomaly) => anomaly.status === statusFilter);
    }

    // Criticality filter - using combined criticality scores
    if (criticalityFilter !== "all") {
      filtered = filtered.filter((anomaly) => {
        // Use user feedback metrics if available, otherwise use predicted metrics
        const disponibilityScore = anomaly.userFeedBack && anomaly.disponibility !== undefined 
          ? anomaly.disponibility 
          : (anomaly.predictedDisponibility || 0);
        
        const integrityScore = anomaly.userFeedBack && anomaly.integrity !== undefined 
          ? anomaly.integrity 
          : (anomaly.predictedIntegrity || 0);
        
        const processSafetyScore = anomaly.userFeedBack && anomaly.processSafety !== undefined 
          ? anomaly.processSafety 
          : (anomaly.predictedProcessSafety || 0);

        const totalCriticality =
          Math.ceil(disponibilityScore) +
          Math.ceil(integrityScore) +
          Math.ceil(processSafetyScore);

        switch (criticalityFilter) {
          case "critical":
            return totalCriticality > 12;
          case "high":
            return totalCriticality > 9 && totalCriticality <= 12;
          case "medium":
            return totalCriticality > 5 && totalCriticality <= 9;
          case "low":
            return totalCriticality > 0 && totalCriticality <= 5;
          case "very-low":
            return totalCriticality === 0;
          default:
            return true;
        }
      });
    }

    set({ anomalies: filtered });
  },

  addAnomaly: async (anomaly: any) => {
    try {
      console.log(`➕ Adding new anomaly:`, {
        title: anomaly.title,
        service: anomaly.service,
        equipment: anomaly.equipment,
      });
      
      const res = await apiClient.post("/anomaly", anomaly);
      
      console.log(`✅ Anomaly added successfully:`, {
        anomalyId: res.data.id,
        title: res.data.title,
      });
      
      set({ anomalies: [...get().anomalies, res.data] });
    } catch (error: any) {
      console.error("❌ Error adding anomaly:", {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        anomalyData: anomaly,
      });
    }
  },

  getAnomalyById: async (id: string) => {
    try {
      console.log(`🔍 Fetching anomaly by ID: ${id}`);
      
      const res = await apiClient.get(`/anomaly/${id}`);
      
      console.log(`✅ Anomaly fetched successfully:`, {
        anomalyId: id,
        title: res.data.title,
        status: res.data.status,
        service: res.data.responsibleSection,
      });
      
      set({ anomaly: res.data });
    } catch (error: any) {
      console.error(`❌ Error fetching anomaly ${id}:`, {
        anomalyId: id,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            `Failed to fetch anomaly: ${error.response.data.message || error.message}`,
          );
        } else if (error.request) {
          toast.error("No response received from server");
        }
      } else {
        toast.error("failed to fetch anomaly details");
      }
    }
  },

  updateAnomaly: async (
    anomaly: Anomaly,
    data: Anomaly[],
    status: string,
    sysShutDownRequired: boolean,
    estimatedTime?: number,
    processSafety?: number,
    disponibility?: number,
    integrity?: number,
    userFeedBack?: boolean,
  ) => {
    try {
      const actionPlan = anomaly.actionPlans
        ? [...anomaly.actionPlans, ...data]
        : data;

      // Prepare payload with timestamp fields based on status transition
      const payload: any = {
        actionPlan,
        status,
        sysShutDownRequired,
      };

      // Add estimatedTime to payload if provided
      if (estimatedTime !== undefined) {
        payload.estimatedTime = estimatedTime;
      }

      // Add metrics to payload if provided
      if (processSafety !== undefined) {
        payload.processSafety = processSafety;
      }
      if (disponibility !== undefined) {
        payload.disponibility = disponibility;
      }
      if (integrity !== undefined) {
        payload.integrity = integrity;
      }
      if (userFeedBack !== undefined) {
        payload.userFeedBack = userFeedBack;
      }

      const currentDateTime = new Date().toISOString();

      if (status === "TREATED" || status === "traitee") {
        payload.treatedAt = currentDateTime;
      } else if (status === "CLOSED" || status === "cloture") {
        payload.closedAt = currentDateTime;
      }


      const res = await apiClient.patch(`/anomaly/${anomaly.id}`, payload);
      
      const newAnomaly = res.data;

      const anomalies = get().anomalies;
      console.log("Anomalies : ", anomalies);
      if (anomalies.length > 0) {
        set({
          anomalies: anomalies.map((anomaly: any) => {
            if (anomaly.id === newAnomaly.id) {
              return newAnomaly;
            }
            return anomaly;
          }),
        });
      }

      const {
        maintenanceWindows,
        setMaintenanceWindows,
        getMaintenanceWindowsNotSafe,
      } = useMaintenanceStore.getState();

      if (maintenanceWindows.length > 0) {
        const updatedAnomaly = maintenanceWindows.map((window) => {
          if (window.id.toString() === anomaly?.maintenanceWindowId?.toString()) {
            return {
              ...window,
              anomalies: [...window.anomalies, anomaly],
            };
          }
          return window;
        });
        setMaintenanceWindows(updatedAnomaly);
      }
    } catch (error: any) {
      console.error(`❌ Error updating anomaly ${anomaly.id}:`, {
        anomalyId: anomaly.id,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestPayload: {
          actionPlan: data.length,
          status,
          sysShutDownRequired,
        },
      });
      
      toast.error("Failed to update anomaly");
      throw error;
    }
  },

  editAnomaly: async (anomalyId: string | number, updateData: any) => {
    try {
      const payload: any = {
        description: updateData.description,
        equipment: updateData.equipment,
        system: updateData.system,
        service: updateData.service,
        status: updateData.status,
        sysShutDownRequired: updateData.sysShutDownRequired,
      };

      if (updateData.estimatedTime !== undefined) {
        payload.estimatedTime = updateData.estimatedTime;
      }

      // Add timestamp fields based on status transition
      const currentDateTime = new Date().toISOString();

      if (updateData.status === "TREATED" || updateData.status === "traitee") {
        payload.treatedAt = currentDateTime;
      } else if (
        updateData.status === "CLOSED" ||
        updateData.status === "cloture"
      ) {
        payload.closedAt = currentDateTime;
      }

      console.log(`✏️ Editing anomaly ${anomalyId}:`, {
        anomalyId,
        updateData: payload,
      });

      const res = await apiClient.patch(`/anomaly/${anomalyId}`, payload);
      
      console.log(`✅ Anomaly ${anomalyId} edited successfully:`, {
        anomalyId,
        responseData: res.data,
      });
      
      // Update the anomaly in the local state
      const anomalies = get().anomalies;
      const anomaliesOLD = get().anomaliesOLD;

      if (anomalies.length > 0) {
        set({
          anomalies: anomalies.map((anomaly: any) => {
            if (anomaly.id === anomalyId) {
              return { ...anomaly, ...payload };
            }
            return anomaly;
          }),
          anomaliesOLD: anomaliesOLD.map((anomaly: any) => {
            if (anomaly.id === anomalyId) {
              return { ...anomaly, ...payload };
            }
            return anomaly;
          }),
        });
      }

      // Update the current anomaly if it's the one being edited
      const currentAnomaly = get().anomaly;
      if (currentAnomaly && currentAnomaly.id === anomalyId) {
        set({ anomaly: { ...currentAnomaly, ...payload } });
      }

      toast.success("Anomaly updated successfully");
    } catch (error: any) {
      console.error(`❌ Error editing anomaly ${anomalyId}:`, {
        anomalyId,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        updateData,
      });
      
      toast.error("Failed to update anomaly");
      throw error;
    }
  },
}));

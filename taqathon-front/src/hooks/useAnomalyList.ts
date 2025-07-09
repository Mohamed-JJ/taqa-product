import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAnomalyStore } from "@/(zustand)/useAnomalyStore";
import apiClient from "@/lib/api";
import { Anomaly, Equipment } from "@/types/anomaly";
import {
  useCommonTranslations,
  useAnomalyTranslations,
  useAnomalyStatusTranslations,
  useAnomalyListTranslations,
  useTranslations,
  formatDate as formatDateWithLocale,
  translateStatus,
} from "@/i18n/hooks/useTranslations";

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getEquipmentName = (equipment: string | Equipment): string => {
  if (typeof equipment === "string") {
    return equipment;
  }
  return equipment?.name || equipment?.equipmentNumber || "Unknown Equipment";
};

const getCriticalityFromTotal = (total: number) => {
  if (total > 12) return "critical";
  if (total > 9) return "high";
  if (total > 5) return "medium";
  if (total > 0) return "low";
  return "very-low";
};

export const useAnomalyList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states initialized from URL parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [criticalityFilter, setCriticalityFilter] = useState<string>(searchParams.get("criticality") || "all");
  const [descriptionFilter, setDescriptionFilter] = useState(searchParams.get("description") || "");
  const [equipmentFilter, setEquipmentFilter] = useState(searchParams.get("equipment") || "");
  const [systemFilter, setSystemFilter] = useState(searchParams.get("system") || "");
  const [serviceFilter, setServiceFilter] = useState<string>(searchParams.get("service") || "all");
  const [shutdownFilter, setShutdownFilter] = useState<string>(searchParams.get("shutdown") || "all");
  const [detectionDate, setDetectionDate] = useState<Date | undefined>(
    searchParams.get("detectionDate") ? new Date(searchParams.get("detectionDate")!) : undefined
  );
  
  // UI states
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(
    localStorage.getItem("anomaly-filters-expanded") !== "false"
  );
  const [isAnomalyCommentDialogOpen, setIsAnomalyCommentDialogOpen] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);

  // Store and translations
  const { anomalies, getAnomalies, anomaliesOLD, extraData, loading, filterAnomalies, searchAnomalies, page, setPage } = useAnomalyStore();
  const commonT = useCommonTranslations();
  const anomalyT = useAnomalyTranslations();
  const statusT = useAnomalyStatusTranslations();
  const listT = useAnomalyListTranslations();
  const { t, language } = useTranslations();

  // Update URL parameters
  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (criticalityFilter !== "all") params.set("criticality", criticalityFilter);
    if (descriptionFilter) params.set("description", descriptionFilter);
    if (equipmentFilter) params.set("equipment", equipmentFilter);
    if (systemFilter) params.set("system", systemFilter);
    if (serviceFilter !== "all") params.set("service", serviceFilter);
    if (shutdownFilter !== "all") params.set("shutdown", shutdownFilter);
    if (detectionDate) params.set("detectionDate", detectionDate.toISOString());
    
    setSearchParams(params);
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    const newState = !isFiltersExpanded;
    setIsFiltersExpanded(newState);
    localStorage.setItem("anomaly-filters-expanded", newState.toString());
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCriticalityFilter("all");
    setDescriptionFilter("");
    setEquipmentFilter("");
    setSystemFilter("");
    setServiceFilter("all");
    setShutdownFilter("all");
    setDetectionDate(undefined);
    setSearchParams(new URLSearchParams());
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (criticalityFilter !== "all") count++;
    if (descriptionFilter) count++;
    if (equipmentFilter) count++;
    if (systemFilter) count++;
    if (serviceFilter !== "all") count++;
    if (shutdownFilter !== "all") count++;
    if (detectionDate) count++;
    return count;
  };

  // Comment dialog handlers
  const handleOpenCommentDialog = (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
    setIsAnomalyCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setIsAnomalyCommentDialogOpen(false);
    setSelectedAnomaly(null);
  };

  const handleSubmitComment = async (comment: string, author: string) => {
    if (!selectedAnomaly) return;

    console.log("Adding comment:", {
      content: comment,
      author: author,
      anomalyId: selectedAnomaly.id,
    });

    try {
      const response = await apiClient.post("/comments", {
        content: comment,
        author: author,
        anomalyId: selectedAnomaly.id,
      });
      console.log("Comment added successfully:", response);
    } catch (err) {
      console.log("Error adding comment:", err);
      toast.error(t("messages.failedToAddComment"));
    }
  };

  // Effects
  useEffect(() => {
    // Initial load with no filters
    if (getActiveFilterCount() === 0) {
      getAnomalies();
    } else {
      // Load with filters applied
      searchAnomalies({
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        description: descriptionFilter || undefined,
        equipment: equipmentFilter || undefined,
        system: systemFilter || undefined,
        service: serviceFilter !== "all" ? serviceFilter : undefined,
        sysShutDownRequired: shutdownFilter !== "all" ? shutdownFilter === "true" : undefined,
        detectionDate: detectionDate ? detectionDate.toISOString().split('T')[0] : undefined,
        page,
      });
    }
  }, [page]);

  useEffect(() => {
    // Use server-side search instead of client-side filtering
    if (getActiveFilterCount() === 0) {
      // No filters, load all anomalies
      getAnomalies();
    } else {
      // Apply filters through API search
      searchAnomalies({
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        description: descriptionFilter || undefined,
        equipment: equipmentFilter || undefined,
        system: systemFilter || undefined,
        service: serviceFilter !== "all" ? serviceFilter : undefined,
        sysShutDownRequired: shutdownFilter !== "all" ? shutdownFilter === "true" : undefined,
        detectionDate: detectionDate ? detectionDate.toISOString().split('T')[0] : undefined,
        page: 1, // Reset to first page when filters change
      });
      // Reset page to 1 when filters change
      if (page !== 1) {
        setPage(1);
      }
    }
    updateURLParams();
  }, [
    searchTerm,
    statusFilter,
    criticalityFilter,
    descriptionFilter,
    equipmentFilter,
    systemFilter,
    serviceFilter,
    shutdownFilter,
    detectionDate,
  ]);

  return {
    // Data
    anomalies,
    anomaliesOLD,
    extraData,
    loading,
    page,
    selectedAnomaly,

    // Filter states
    searchTerm,
    statusFilter,
    criticalityFilter,
    descriptionFilter,
    equipmentFilter,
    systemFilter,
    serviceFilter,
    shutdownFilter,
    detectionDate,

    // UI states
    isFiltersExpanded,
    isAnomalyCommentDialogOpen,

    // Filter handlers
    setSearchTerm,
    setStatusFilter,
    setCriticalityFilter,
    setDescriptionFilter,
    setEquipmentFilter,
    setSystemFilter,
    setServiceFilter,
    setShutdownFilter,
    setDetectionDate,

    // Actions
    setPage,
    toggleFilters,
    clearAllFilters,
    getActiveFilterCount,
    handleOpenCommentDialog,
    handleCloseCommentDialog,
    handleSubmitComment,

    // Translations
    commonT,
    anomalyT,
    statusT,
    listT,
    t,
    language,

    // Utilities
    formatDate,
    formatDateWithLocale,
    getEquipmentName,
    getCriticalityFromTotal,
    translateStatus,
  };
}; 
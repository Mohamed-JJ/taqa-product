import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnomalyStore } from "@/(zustand)/useAnomalyStore";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { useAnomalyTranslations, useCommonTranslations, useTimeTranslations, useTranslations, formatDate as formatDateWithLocale } from "@/i18n/hooks/useTranslations";
import { toast } from "sonner";
import { CriticalityLevel } from "@/types/anomaly";
import apiClient from "@/lib/api";

export interface MetricsForm {
  processSafety: number;
  disponibility: number;
  integrity: number;
}

export interface RexForm {
  summary: string;
  rootCause: string;
  correctionAction: string;
  preventiveAction: string;
  attachments: File[];
}

export const useAnomalyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { anomaly, getAnomalyById, updateAnomaly } = useAnomalyStore();
  const { changeAnomalyStatusInMaintenanceWindow } = useMaintenanceStore();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActionPlanModalOpen, setIsActionPlanModalOpen] = useState(false);
  const [isRexUploadModalOpen, setIsRexUploadModalOpen] = useState(false);
  const [isPendingApprovalDialogOpen, setIsPendingApprovalDialogOpen] = useState(false);
  const [selectedActionPlan, setSelectedActionPlan] = useState<any>(null);
  const [isActionPlanDetailDialogOpen, setIsActionPlanDetailDialogOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [isRexReminderOpen, setIsRexReminderOpen] = useState(false);
  const [isMetricsEditOpen, setIsMetricsEditOpen] = useState(false);
  
  const [metricsForm, setMetricsForm] = useState<MetricsForm>({
    processSafety: 0,
    disponibility: 0,
    integrity: 0
  });
  
  const [rexForm, setRexForm] = useState<RexForm>({
    summary: "",
    rootCause: "",
    correctionAction: "",
    preventiveAction: "",
    attachments: []
  });

  // Translation hooks
  const anomalyT = useAnomalyTranslations();
  const commonT = useCommonTranslations();
  const timeT = useTimeTranslations();
  const { language, t } = useTranslations();

  // Status states mapping
  const states: { [key: string]: string } = {
    'en_cours': 'en cours',
    'traitee': 'traitee',
    'cloture': 'cloture',
    'IN_PROGRESS': 'en cours',
    'TREATED': 'traitee',
    'CLOSED': 'cloture'
  };

  // Utility functions
  const formatDate = (date: string | Date) => {
    if (!date) return anomalyT.notSet;
    return formatDateWithLocale(date, language);
  };

  const formatEstimatedTime = (hours?: number) => {
    if (!hours) return anomalyT.notEstimated;
    if (hours < 24) return `${hours} ${timeT.hours}`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0
      ? `${days}d ${remainingHours}h`
      : `${days} ${timeT.days}`;
  };

  const getCriticalityFromScore = (score?: number): CriticalityLevel => {
    if (!score) return "very-low";
    if (score >= 13) return "critical";    // 13-15
    if (score >= 10) return "high";        // 10-12
    if (score >= 7) return "medium";       // 7-9
    if (score >= 4) return "low";          // 4-6
    return "very-low";                     // 3 (minimum possible)
  };

  const getNextStatus = (currentStatus: string) => {
    const statusProgression: Record<string, string> = {
      "IN_PROGRESS": "TREATED",
      "TREATED": "CLOSED"
    };
    return statusProgression[currentStatus] || currentStatus;
  };

  const getStatusButtonText = (currentStatus: string) => {
    switch (currentStatus) {
      case "IN_PROGRESS":
        return anomalyT.markAsTreated;
      case "TREATED":
        return anomalyT.closeAnomaly;
      default:
        return anomalyT.markResolved;
    }
  };

  const getStatusButtonColor = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    switch (nextStatus) {
      case "TREATED":
        return "bg-orange-500 hover:bg-orange-600 text-white";
      case "CLOSED":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "text-[#003D55] bg-white hover:text-[#003D55] hover:bg-white/90";
    }
  };

  // Status management
  const handleStatusUpdate = async () => {
    if (!anomaly) return;

    const nextStatus = getNextStatus(anomaly.status);
    if (nextStatus === anomaly.status) {
      toast.info(anomalyT.anomalyAlreadyFinalStatus);
      return;
    }

    // Show PendingApprovalDialog for IN_PROGRESS -> TREATED transition
    if ((anomaly.status === "IN_PROGRESS" || anomaly.status === "in-progress") && 
        (nextStatus === "TREATED" || nextStatus === "traitee")) {
      setIsPendingApprovalDialogOpen(true);
      return;
    }

    // Check for REX requirement before closing (TREATED -> CLOSED transition)
    if ((anomaly.status === "TREATED" || anomaly.status === "traitee") && 
        (nextStatus === "CLOSED" || nextStatus === "cloture")) {
      // Check if REX is uploaded
      if (!anomaly.rex && !anomaly.rexFilePath) {
        toast.error(anomalyT.rexRequiredForClosure);
        // Highlight REX card or open REX upload dialog
        setIsRexUploadModalOpen(true);
        return;
      }
    }

    // Direct status update for other transitions
    setIsStatusUpdating(true);
    try {
      await changeAnomalyStatusInMaintenanceWindow(anomaly.id.toString(), nextStatus);
      toast.success(anomalyT.statusUpdatedSuccessfully);
      await getAnomalyById(id!);
    } catch (error) {
      toast.error(anomalyT.statusUpdateFailed);
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handlePendingApprovalSuccess = async () => {
    await getAnomalyById(id!);
    setIsPendingApprovalDialogOpen(false);
  };

  // REX management
  const handleRexSubmit = async () => {
    if (!anomaly) {
      toast.error("No anomaly data available");
      return;
    }

    if (!rexForm.attachments || rexForm.attachments.length === 0) {
      toast.error("Please select at least one document file to upload");
      return;
    }

    // Additional validation for file types and sizes
    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const allowedExtensions = ['txt', 'pdf', 'doc', 'docx'];
    
    for (const file of rexForm.attachments) {
      const fileExtension = file.name.toLowerCase().split('.').pop();
      
      if (!allowedExtensions.includes(fileExtension || '')) {
        toast.error(`Invalid file type: ${file.name}. Only text documents are allowed (TXT, PDF, DOC, DOCX).`);
        return;
      }
      
      if (file.size > maxSizeInBytes) {
        toast.error(`File too large: ${file.name}. Maximum size is ${maxSizeInMB}MB.`);
        return;
      }
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add file attachments
      rexForm.attachments.forEach((file, index) => {
        formData.append(`file`, file);
      });

      // Make API call to the new endpoint
      console.log(`📄 Uploading REX for anomaly ${anomaly.id}:`, {
        anomalyId: anomaly.id,
        fileCount: rexForm.attachments.length,
        files: rexForm.attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
      });

      const response = await apiClient.post(`/attachements/${anomaly.id}/rex-attachements`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ REX upload successful:", response.data);
      toast.success(anomalyT.rexUploadedSuccessfully);
      setIsRexUploadModalOpen(false);
      setRexForm({
        summary: "",
        rootCause: "",
        correctionAction: "",
        preventiveAction: "",
        attachments: []
      });
      await getAnomalyById(id!);
    } catch (error: any) {
      console.error("❌ REX upload failed:", {
        anomalyId: anomaly.id,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestConfig: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
      
      const errorMessage = error.response?.data?.message || anomalyT.rexUploadFailed;
      toast.error(errorMessage);
    }
  };

  const downloadRexTemplate = () => {
    const template = `# Modèle REX (Retour d'Expérience)

## Résumé
[Décrivez brièvement l'anomalie et sa résolution]

## Cause racine
[Identifiez la cause principale de l'anomalie]

## Action corrective
[Décrivez les actions prises pour corriger le problème]

## Action préventive
[Décrivez les mesures mises en place pour éviter la récurrence]

## Documents annexes
[Listez les documents, photos, rapports techniques joints]
`;
    
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REX_Template_Anomaly_${anomaly?.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Metrics management
  const handleMetricsSubmit = async () => {
    try {
      toast.success("Metrics feedback submitted successfully. Thank you for helping improve our AI model!");
      await updateAnomaly(
        anomaly!, 
        [], 
        anomaly!.status, 
        anomaly!.sysShutDownRequired, 
        anomaly!.estimatedTime,
        metricsForm.processSafety,
        metricsForm.disponibility,
        metricsForm.integrity,
        true // Set userFeedBack to true when user provides feedback
      );
      await getAnomalyById(id!);
      setIsMetricsEditOpen(false);
    } catch (error) {
      toast.error("Failed to submit metrics feedback. Please try again.");
    }
  };

  // Data fetching
  useEffect(() => {
    const fetchAnomaly = async () => {
      if (id) {
        setIsLoading(true);
        await getAnomalyById(id);
        setIsLoading(false);
      }
    };
    fetchAnomaly();
  }, [id, getAnomalyById]);

  // Initialize metrics form when anomaly loads
  useEffect(() => {
    if (anomaly) {
      setMetricsForm({
        processSafety: anomaly.processSafety || Math.min(5, Math.max(1, Math.ceil(anomaly.predictedProcessSafety) || 1)),
        disponibility: anomaly.disponibility || Math.min(5, Math.max(1, Math.ceil(anomaly.predictedDisponibility) || 1)),
        integrity: anomaly.integrity || Math.min(5, Math.max(1, Math.ceil(anomaly.predictedIntegrity) || 1))
      });
    }
  }, [anomaly]);

  // Note: REX reminder removed since we now prevent closing without REX upload

  // Computed values
  const safetyScore = anomaly?.processSafety || Math.min(5, Math.max(1, Math.ceil(anomaly?.predictedProcessSafety || 0) || 1));
  const availabilityScore = anomaly?.disponibility || Math.min(5, Math.max(1, Math.ceil(anomaly?.predictedDisponibility || 0) || 1));
  const integrityScore = anomaly?.integrity || Math.min(5, Math.max(1, Math.ceil(anomaly?.predictedIntegrity || 0) || 1));
  const criticalityScore = safetyScore + availabilityScore + integrityScore;
  const criticalityLevel = getCriticalityFromScore(criticalityScore);

  return {
    // Data
    anomaly,
    id,
    navigate,
    
    // State
    isLoading,
    isEditModalOpen,
    setIsEditModalOpen,
    isActionPlanModalOpen,
    setIsActionPlanModalOpen,
    isRexUploadModalOpen,
    setIsRexUploadModalOpen,
    isPendingApprovalDialogOpen,
    setIsPendingApprovalDialogOpen,
    selectedActionPlan,
    setSelectedActionPlan,
    isActionPlanDetailDialogOpen,
    setIsActionPlanDetailDialogOpen,
    isStatusUpdating,
    isRexReminderOpen,
    setIsRexReminderOpen,
    isMetricsEditOpen,
    setIsMetricsEditOpen,
    metricsForm,
    setMetricsForm,
    rexForm,
    setRexForm,
    
    // Computed values
    safetyScore,
    availabilityScore,
    integrityScore,
    criticalityScore,
    criticalityLevel,
    
    // Utility functions
    formatDate,
    formatEstimatedTime,
    getCriticalityFromScore,
    getNextStatus,
    getStatusButtonText,
    getStatusButtonColor,
    states,
    
    // Event handlers
    handleStatusUpdate,
    handlePendingApprovalSuccess,
    handleRexSubmit,
    downloadRexTemplate,
    handleMetricsSubmit,
    
    // Translations
    anomalyT,
    commonT,
    timeT,
    t,
  };
}; 
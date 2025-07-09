import { EditAnomalyDialog } from "@/components/anomalies/EditAnomalyDialog";
import { AddActionPlanDialog } from "@/components/anomalies/AddActionPlanDialog";
import { PendingApprovalDialog } from "@/components/maintenance/PendingApprovalDialog";
import {
  useAnomalyDetails,
  LoadingSpinner,
  AnomalyNotFound,
  StatusUpdateOverlay,
  AnomalyDetailHeader,
  AnomalyMetricsSection,
  MaintenanceWindowCard,
  StatusProgressCard,
  RexCard,
  ActionPlanCard,
} from "@/components/anomalies/detail";
import {
  ActionPlanDetailDialog,
  RexUploadDialog,
  MetricsFeedbackDialog,
  RexReminderDialog,
} from "@/components/anomalies/detail/dialogs";

const AnomalyDetails = () => {
  const {
    // Data
    anomaly,
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
  } = useAnomalyDetails();

  // Loading state
  if (isLoading) {
    return <LoadingSpinner message={anomalyT.loadingAnomalyDetails} />;
  }

  // Not found state
  if (!anomaly) {
    return (
      <AnomalyNotFound
        onBackClick={() => navigate("/anomalies")}
        title={anomalyT.anomalyNotFound}
        message={anomalyT.anomalyNotFoundMessage}
        backButtonText={anomalyT.backToAnomalies}
      />
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Status Update Overlay */}
      <StatusUpdateOverlay isVisible={isStatusUpdating} />

      {/* Header Section */}
      <AnomalyDetailHeader
        anomaly={anomaly}
        states={states}
        criticalityScore={criticalityScore}
        criticalityLevel={criticalityLevel}
        onBackClick={() => navigate("/anomalies")}
        onEditClick={() => setIsEditModalOpen(true)}
        onStatusUpdate={handleStatusUpdate}
        getStatusButtonText={getStatusButtonText}
        getStatusButtonColor={getStatusButtonColor}
        isStatusUpdating={isStatusUpdating}
        anomalyT={anomalyT}
        commonT={commonT}
      />

      {/* AI Metrics Section */}
      <AnomalyMetricsSection
        anomaly={anomaly}
        safetyScore={safetyScore}
        availabilityScore={availabilityScore}
        integrityScore={integrityScore}
        formatEstimatedTime={formatEstimatedTime}
        onMetricsEditClick={() => setIsMetricsEditOpen(true)}
        anomalyT={anomalyT}
      />

      {/* Maintenance Window Card */}
      <MaintenanceWindowCard
        anomaly={anomaly}
        anomalyT={anomalyT}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Status & Progress Card */}
        <StatusProgressCard
          anomaly={anomaly}
          formatDate={formatDate}
          anomalyT={anomalyT}
          timeT={timeT}
          t={t}
        />

        {/* REX Card - Only shows when closed */}
        <RexCard
          anomaly={anomaly}
          onRexUploadClick={() => setIsRexUploadModalOpen(true)}
          anomalyT={anomalyT}
        />

        {/* Action Plan Card */}
        <ActionPlanCard
          anomaly={anomaly}
          isLoading={isLoading}
          onActionPlanClick={(actionPlan) => {
            setSelectedActionPlan(actionPlan);
            setIsActionPlanDetailDialogOpen(true);
          }}
          onAddActionPlanClick={() => setIsActionPlanModalOpen(true)}
          anomalyT={anomalyT}
        />
      </div>

      {/* Existing Dialogs */}
      <EditAnomalyDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        anomaly={anomaly}
      />

      <AddActionPlanDialog
        open={isActionPlanModalOpen}
        onOpenChange={setIsActionPlanModalOpen}
        anomalyId={anomaly.id}
      />

      <PendingApprovalDialog
        isOpen={isPendingApprovalDialogOpen}
        onClose={() => setIsPendingApprovalDialogOpen(false)}
        anomaly={anomaly as any}
        onSubmitSuccess={handlePendingApprovalSuccess}
      />

      {/* New Component Dialogs */}
      <ActionPlanDetailDialog
        open={isActionPlanDetailDialogOpen}
        onOpenChange={setIsActionPlanDetailDialogOpen}
        actionPlan={selectedActionPlan}
        anomalyT={anomalyT}
        commonT={commonT}
        t={t}
      />

      <RexReminderDialog
        open={isRexReminderOpen}
        onOpenChange={setIsRexReminderOpen}
        onUploadNowClick={() => setIsRexUploadModalOpen(true)}
      />

      <RexUploadDialog
        open={isRexUploadModalOpen}
        onOpenChange={setIsRexUploadModalOpen}
        rexForm={rexForm}
        setRexForm={setRexForm}
        onSubmit={handleRexSubmit}
        onDownloadTemplate={downloadRexTemplate}
        anomalyT={anomalyT}
        commonT={commonT}
      />

      <MetricsFeedbackDialog
        open={isMetricsEditOpen}
        onOpenChange={setIsMetricsEditOpen}
        anomaly={anomaly}
        metricsForm={metricsForm}
        setMetricsForm={setMetricsForm}
        onSubmit={handleMetricsSubmit}
        getCriticalityFromScore={getCriticalityFromScore}
      />
    </div>
  );
};

export default AnomalyDetails;

import { CommentDialog } from "@/components/ui/comment-dialog";
import { useAnomalyList } from "@/hooks/useAnomalyList";
import {
  AnomalyListHeader,
  AnomalyStatsSection,
  AnomalyFiltersSection,
  AnomalyResultsSection,
  AnomalyPagination,
} from "@/components/anomalies/list";

const AnomalyList = () => {
  const {
    // Data
    anomalies,
    anomaliesOLD,
    extraData,
    loading,
    page,
    selectedAnomaly,

    // Filter states
    descriptionFilter,
    equipmentFilter,
    systemFilter,
    statusFilter,
    criticalityFilter,
    serviceFilter,
    shutdownFilter,
    detectionDate,

    // UI states
    isFiltersExpanded,
    isAnomalyCommentDialogOpen,

    // Filter handlers
    setDescriptionFilter,
    setEquipmentFilter,
    setSystemFilter,
    setStatusFilter,
    setCriticalityFilter,
    setServiceFilter,
    setShutdownFilter,
    setDetectionDate,

    // Actions
    setPage,
    toggleFilters,
    clearAllFilters,
    getActiveFilterCount,
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
  } = useAnomalyList();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <AnomalyListHeader listT={listT} t={t} />

      {/* Stats Section */}
      {!loading && (
        <AnomalyStatsSection
          anomalies={anomalies}
          extraData={extraData}
          listT={listT}
          statusT={statusT}
          getCriticalityFromTotal={getCriticalityFromTotal}
        />
      )}

      {/* Filters Section */}
      {!loading && (
        <AnomalyFiltersSection
          // Filter states
          descriptionFilter={descriptionFilter}
          equipmentFilter={equipmentFilter}
          systemFilter={systemFilter}
          statusFilter={statusFilter}
          criticalityFilter={criticalityFilter}
          serviceFilter={serviceFilter}
          shutdownFilter={shutdownFilter}
          detectionDate={detectionDate}

          // Filter handlers
          setDescriptionFilter={setDescriptionFilter}
          setEquipmentFilter={setEquipmentFilter}
          setSystemFilter={setSystemFilter}
          setStatusFilter={setStatusFilter}
          setCriticalityFilter={setCriticalityFilter}
          setServiceFilter={setServiceFilter}
          setShutdownFilter={setShutdownFilter}
          setDetectionDate={setDetectionDate}

          // UI states and handlers
          isFiltersExpanded={isFiltersExpanded}
          toggleFilters={toggleFilters}
          clearAllFilters={clearAllFilters}
          getActiveFilterCount={getActiveFilterCount}

          // Translations
          t={t}
          listT={listT}
          anomalyT={anomalyT}
          commonT={commonT}

          // Utilities
          formatDate={formatDate}
        />
      )}

      {/* Results Section */}
      <AnomalyResultsSection
        loading={loading}
        anomalies={anomalies}
        anomaliesOLD={anomaliesOLD}
        getCriticalityFromTotal={getCriticalityFromTotal}
        getEquipmentName={getEquipmentName}
        formatDateWithLocale={formatDateWithLocale}
        translateStatus={translateStatus}
        anomalyT={anomalyT}
        commonT={commonT}
        t={t}
        language={language}
        extraData={extraData}
      />

      {/* Pagination */}
      {!loading && (
        <AnomalyPagination
          page={page}
          extraData={extraData}
          setPage={setPage}
          listT={listT}
          t={t}
        />
      )}

      {/* Comment Dialog */}
      {selectedAnomaly && (
        <CommentDialog
          isOpen={isAnomalyCommentDialogOpen}
          onClose={handleCloseCommentDialog}
          anomalyId={selectedAnomaly.id.toString()}
          anomalyTitle={selectedAnomaly.title}
          onSubmit={handleSubmitComment}
        />
      )}
    </div>
  );
};

export default AnomalyList;

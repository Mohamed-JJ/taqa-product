import { useTranslation } from "react-i18next";
import { useLanguage } from "../LanguageContext";

// Main translation hook
export const useTranslations = () => {
  const { t, i18n } = useTranslation();
  const { language, isRTL, changeLanguage } = useLanguage();

  return {
    t,
    i18n,
    language,
    isRTL,
    changeLanguage,
  };
};

// Specialized hooks for different sections
export const useCommonTranslations = () => {
  const { t } = useTranslation();

  return {
    loading: t("common.loading"),
    error: t("common.error"),
    success: t("common.success"),
    cancel: t("common.cancel"),
    save: t("common.save"),
    edit: t("common.edit"),
    delete: t("common.delete"),
    create: t("common.create"),
    back: t("common.back"),
    next: t("common.next"),
    previous: t("common.previous"),
    search: t("common.search"),
    filter: t("common.filter"),
    all: t("common.all"),
    none: t("common.none"),
    yes: t("common.yes"),
    no: t("common.no"),
    confirm: t("common.confirm"),
    close: t("common.close"),
    open: t("common.open"),
    download: t("common.download"),
    upload: t("common.upload"),
    view: t("common.view"),
    submit: t("common.submit"),
    required: t("common.required"),
    optional: t("common.optional"),
    searchAnomalies: t("common.searchAnomalies"),
  };
};

export const useNavigationTranslations = () => {
  const { t } = useTranslation();

  return {
    dashboard: t("navigation.dashboard"),
    anomalies: t("navigation.anomalies"),
    maintenance: t("navigation.maintenance"),
    reports: t("navigation.reports"),
    settings: t("navigation.settings"),
    logout: t("navigation.logout"),
    profile: t("navigation.profile"),
    help: t("navigation.help"),
    createAnomaly: t("navigation.createAnomaly"),
    maintenanceWindows: t("navigation.maintenanceWindows"),
    equipment: t("navigation.equipment"),
    rexArchive: t("navigation.rexArchive"),
    documentation: t("navigation.documentation"),
    maintenanceTools: t("navigation.maintenanceTools"),
    anomalyManagement: t("navigation.anomalyManagement"),
  };
};

export const useAuthTranslations = () => {
  const { t } = useTranslation();

  return {
    login: t("auth.login"),
    register: t("auth.register"),
    email: t("auth.email"),
    password: t("auth.password"),
    confirmPassword: t("auth.confirmPassword"),
    firstName: t("auth.firstName"),
    lastName: t("auth.lastName"),
    userName: t("auth.userName"),
    forgotPassword: t("auth.forgotPassword"),
    loginSuccess: t("auth.loginSuccess"),
    loginFailed: t("auth.loginFailed"),
    registerSuccess: t("auth.registerSuccess"),
    registerFailed: t("auth.registerFailed"),
    authenticationFailed: t("auth.authenticationFailed"),
    redirectingToLogin: t("auth.redirectingToLogin"),
    generatingApp: t("auth.generatingApp"),
    watchChatForUpdates: t("auth.watchChatForUpdates"),
  };
};

export const useAnomalyTranslations = () => {
  const { t } = useTranslation();

  return {
    title: t("anomaly.title"),
    description: t("anomaly.description"),
    equipment: t("anomaly.equipment"),
    detectionDate: t("anomaly.detectionDate"),
    responsiblePerson: t("anomaly.responsiblePerson"),
    status: t("anomaly.status"),
    estimatedTime: t("anomaly.estimatedTime"),
    criticality: t("anomaly.criticality"),
    priority: t("anomaly.priority"),
    unit: t("anomaly.unit"),
    responsibleSection: t("anomaly.responsibleSection"),
    workOrderReference: t("anomaly.workOrderReference"),
    systemStatus: t("anomaly.systemStatus"),
    origin: t("anomaly.origin"),
    priorityLevel: t("anomaly.priorityLevel"),
    tags: t("anomaly.tags"),
    comments: t("anomaly.comments"),
    attachments: t("anomaly.attachments"),
    changeHistory: t("anomaly.changeHistory"),
    overview: t("anomaly.overview"),
    technicalDetails: t("anomaly.technicalDetails"),
    criticalityAssessment: t("anomaly.criticalityAssessment"),
    safety: t("anomaly.safety"),
    availability: t("anomaly.availability"),
    integrity: t("anomaly.integrity"),
    maintenanceWindow: t("anomaly.maintenanceWindow"),
    windowId: t("anomaly.windowId"),
    noRisk: t("anomaly.noRisk"),
    minorRisk: t("anomaly.minorRisk"),
    majorRisk: t("anomaly.majorRisk"),
    noImpact: t("anomaly.noImpact"),
    partialImpact: t("anomaly.partialImpact"),
    significantImpact: t("anomaly.significantImpact"),
    assetConditionImpact: t("anomaly.assetConditionImpact"),
    absolutePriority: t("anomaly.absolutePriority"),
    scheduleShutdown: t("anomaly.scheduleShutdown"),
    activeMonitoring: t("anomaly.activeMonitoring"),
    planAccordingly: t("anomaly.planAccordingly"),
    handleLater: t("anomaly.handleLater"),
    systemShutdownRequired: t("anomaly.systemShutdownRequired"),
    systemShutdownWarning: t("anomaly.systemShutdownWarning"),
    anomalyNotFound: t("anomaly.anomalyNotFound"),
    anomalyNotFoundMessage: t("anomaly.anomalyNotFoundMessage"),
    backToAnomalies: t("anomaly.backToAnomalies"),
    markResolved: t("anomaly.markResolved"),
    loadingAnomalyDetails: t("anomaly.loadingAnomalyDetails"),
    notSet: t("anomaly.notSet"),
    notAssigned: t("anomaly.notAssigned"),
    notSpecified: t("anomaly.notSpecified"),
    notEstimated: t("anomaly.notEstimated"),
    unknown: t("anomaly.unknown"),
    noCommentsYet: t("anomaly.noCommentsYet"),
    noAttachments: t("anomaly.noAttachments"),
    editAnomaly: t("anomaly.editAnomaly"),
    selectStatus: t("anomaly.selectStatus"),
    statusOpen: t("anomaly.statusOpen"),
    statusInProgress: t("anomaly.statusInProgress"),
    statusResolved: t("anomaly.statusResolved"),
    selectPriority: t("anomaly.selectPriority"),
    priorityLow: t("anomaly.priorityLow"),
    priorityMedium: t("anomaly.priorityMedium"),
    priorityHigh: t("anomaly.priorityHigh"),
    actionPlan: t("anomaly.actionPlan"),
    rex: t("anomaly.rex"),
    summary: t("anomaly.summary"),
    rootCause: t("anomaly.rootCause"),
    correctionAction: t("anomaly.correctionAction"),
    preventiveAction: t("anomaly.preventiveAction"),
    noRex: t("anomaly.noRex"),
    addActionPlan: t("anomaly.addActionPlan"),
    action: t("anomaly.action"),
    responsible: t("anomaly.responsible"),
    pdrsAvailable: t("anomaly.pdrsAvailable"),
    internalResources: t("anomaly.internalResources"),
    externalResources: t("anomaly.externalResources"),
    noActionPlans: t("anomaly.noActionPlans"),
    actionPlaceholder: t("anomaly.actionPlaceholder"),
    selectResponsible: t("anomaly.selectResponsible"),
    pdrsPlaceholder: t("anomaly.pdrsPlaceholder"),
    internalResourcesPlaceholder: t("anomaly.internalResourcesPlaceholder"),
    externalResourcesPlaceholder: t("anomaly.externalResourcesPlaceholder"),
    statusPending: t("anomaly.statusPending"),
    statusCompleted: t("anomaly.statusCompleted"),
    statusCancelled: t("anomaly.statusCancelled"),
    anomalyDetails: t("anomaly.anomalyDetails"),
    safetyLevel: t("anomaly.safetyLevel"),
    resolutionTimeEstimate: t("anomaly.resolutionTimeEstimate"),
    statusAndProgress: t("anomaly.statusAndProgress"),
    unknownEquipment: t("anomaly.unknownEquipment"),
    requiresShutdown: t("anomaly.requiresShutdown"),
    selectYesOrNo: t("anomaly.selectYesOrNo"),
    requiresUnitShutdown: t("anomaly.requiresUnitShutdown"),
    yes: t("anomaly.yes"),
    no: t("anomaly.no"),
    anomalyDetailsNumber: t("anomaly.anomalyDetailsNumber"),
    startProcessing: t("anomaly.startProcessing"),
    markAsTreated: t("anomaly.markAsTreated"),
    closeAnomaly: t("anomaly.closeAnomaly"),
    moveToInProgress: t("anomaly.moveToInProgress"),
    uploadRex: t("anomaly.uploadRex"),
    downloadRexTemplate: t("anomaly.downloadRexTemplate"),
    uploadRexTitle: t("anomaly.uploadRexTitle"),
    uploadRexDescription: t("anomaly.uploadRexDescription"),
    rexSummaryLabel: t("anomaly.rexSummaryLabel"),
    rexRootCauseLabel: t("anomaly.rexRootCauseLabel"),
    rexCorrectionLabel: t("anomaly.rexCorrectionLabel"),
    rexPreventionLabel: t("anomaly.rexPreventionLabel"),
    rexAttachmentsLabel: t("anomaly.rexAttachmentsLabel"),
    rexSummaryPlaceholder: t("anomaly.rexSummaryPlaceholder"),
    rexRootCausePlaceholder: t("anomaly.rexRootCausePlaceholder"),
    rexCorrectionPlaceholder: t("anomaly.rexCorrectionPlaceholder"),
    rexPreventionPlaceholder: t("anomaly.rexPreventionPlaceholder"),
    rexAcceptedFormats: t("anomaly.rexAcceptedFormats"),
    criticalityScore: t("anomaly.criticalityScore"),
    anomalyAlreadyFinalStatus: t("anomaly.anomalyAlreadyFinalStatus"),
    statusUpdatedSuccessfully: t("anomaly.statusUpdatedSuccessfully"),
    statusUpdateFailed: t("anomaly.statusUpdateFailed"),
    rexUploadedSuccessfully: t("anomaly.rexUploadedSuccessfully"),
    rexUploadFailed: t("anomaly.rexUploadFailed"),
    rexRequiredForClosure: t("anomaly.rexRequiredForClosure"),
    actionPlanDetails: t("anomaly.actionPlanDetails"),
    actionPlanDetailsDescription: t("anomaly.actionPlanDetailsDescription"),
    actionDescription: t("anomaly.actionDescription"),
    metricsAnalysis: t("anomaly.metricsAnalysis"),
    aiMetricsAnalysis: t("anomaly.aiMetricsAnalysis"),
    userFeedback: t("anomaly.userFeedback"),
    aiGenerated: t("anomaly.aiGenerated"),
    provideFeedback: t("anomaly.provideFeedback"),
    criticalRisk: t("anomaly.criticalRisk"),
    highRisk: t("anomaly.highRisk"),
    mediumRisk: t("anomaly.mediumRisk"),
    lowRisk: t("anomaly.lowRisk"),
    veryLowRisk: t("anomaly.veryLowRisk"),
    immediateActionRequired: t("anomaly.immediateActionRequired"),
    urgentAttentionNeeded: t("anomaly.urgentAttentionNeeded"),
    scheduleMaintenanceSoon: t("anomaly.scheduleMaintenanceSoon"),
    monitorAndPlan: t("anomaly.monitorAndPlan"),
    noImmediateConcerns: t("anomaly.noImmediateConcerns"),
    howThisHelps: t("anomaly.howThisHelps"),
    feedbackDescription: t("anomaly.feedbackDescription"),
    submitFeedback: t("anomaly.submitFeedback"),
    aiMetricsFeedback: t("anomaly.aiMetricsFeedback"),
    improveAiModel: t("anomaly.improveAiModel"),
    rexDocumentViewer: t("anomaly.rexDocumentViewer"),
    viewingRexDocument: t("anomaly.viewingRexDocument"),
    downloadDocument: t("anomaly.downloadDocument"),
    openInNewTab: t("anomaly.openInNewTab"),
    rexUploadRequired: t("anomaly.rexUploadRequired"),
    rexUploadRequiredMessage: t("anomaly.rexUploadRequiredMessage"),
    remindMeLater: t("anomaly.remindMeLater"),
    uploadRexNow: t("anomaly.uploadRexNow"),
    cannotEditClosed: t("anomaly.cannotEditClosed"),
    cannotUpdateClosed: t("anomaly.cannotUpdateClosed"),
    anomalyClosed: t("anomaly.anomalyClosed"),
    updating: t("anomaly.updating"),
    service: t("anomaly.service"),
    system: t("anomaly.system"),
    statusProgress: t("anomaly.statusProgress"),
    detectionInfo: t("anomaly.detectionInfo"),
    detectedOn: t("anomaly.detectedOn"),
    detectedBy: t("anomaly.detectedBy"),
    lastUpdate: t("anomaly.lastUpdate"),
    estimatedResolution: t("anomaly.estimatedResolution"),
    progressTracking: t("anomaly.progressTracking"),
    currentPhase: t("anomaly.currentPhase"),
    nextActions: t("anomaly.nextActions"),
    assignedTo: t("anomaly.assignedTo"),
    maintenanceInfo: t("anomaly.maintenanceInfo"),
    scheduledWindow: t("anomaly.scheduledWindow"),
    noMaintenanceScheduled: t("anomaly.noMaintenanceScheduled"),
    viewWindow: t("anomaly.viewWindow"),
    scheduleFor: t("anomaly.scheduleFor"),
    rexDocumentation: t("anomaly.rexDocumentation"),
    experienceDocumentation: t("anomaly.experienceDocumentation"),
    completionRequired: t("anomaly.completionRequired"),
    documentExperience: t("anomaly.documentExperience"),
    viewRexDocument: t("anomaly.viewRexDocument"),
    planDetails: t("anomaly.planDetails"),
    resourceRequirements: t("anomaly.resourceRequirements"),
    spareParts: t("anomaly.spareParts"),
    teamMembers: t("anomaly.teamMembers"),
    externalSupport: t("anomaly.externalSupport"),
    executionPlan: t("anomaly.executionPlan"),
    viewFullPlan: t("anomaly.viewFullPlan"),
  };
};

export const useAnomalyStatusTranslations = () => {
  const { t } = useTranslation();

  return {
    open: t("anomalyStatus.open"),
    inProgress: t("anomalyStatus.inProgress"),
    resolved: t("anomalyStatus.resolved"),
    waitingUnitShutdown: t("anomalyStatus.waitingUnitShutdown"),
    pendingParts: t("anomalyStatus.pendingParts"),
    pendingApproval: t("anomalyStatus.pendingApproval"),
    closed: t("anomalyStatus.closed"),
    cancelled: t("anomalyStatus.cancelled"),
  };
};

export const useMaintenanceTranslations = () => {
  const { t } = useTranslation();

  return {
    // Main titles
    title: t("maintenance.title"),
    maintenanceWindow: t("maintenance.maintenanceWindow"),
    maintenanceWindows: t("maintenance.maintenanceWindows"),
    createMaintenanceWindow: t("maintenance.createMaintenanceWindow"),
    windowManagement: t("maintenance.windowManagement"),
    windowManagementDescription: t("maintenance.windowManagementDescription"),

    // Form fields
    addNewMaintenanceWindow: t("maintenance.addNewMaintenanceWindow"),
    enterTitle: t("maintenance.enterTitle"),
    startDate: t("maintenance.startDate"),
    endDate: t("maintenance.endDate"),
    windowTitle: t("maintenance.windowTitle"),

    // Actions
    update: t("maintenance.update"),
    delete: t("maintenance.delete"),
    unassign: t("maintenance.unassign"),
    cancel: t("maintenance.cancel"),
    createWindow: t("maintenance.createWindow"),

    // Views
    calendarView: t("maintenance.calendarView"),
    listView: t("maintenance.listView"),

    // Anomaly management
    assignedAnomalies: t("maintenance.assignedAnomalies"),
    noAnomaliesAssigned: t("maintenance.noAnomaliesAssigned"),
    viewDetails: t("maintenance.viewDetails"),

    // Status
    scheduled: t("maintenance.scheduled"),
    inProgress: t("maintenance.inProgress"),
    completed: t("maintenance.completed"),

    // Window details
    maintenanceWindowSummary: t("maintenance.maintenanceWindowSummary"),
    totalAnomalies: t("maintenance.totalAnomalies"),
    criticalIssues: t("maintenance.criticalIssues"),
    shutdownRequired: t("maintenance.shutdownRequired"),
    totalEstTime: t("maintenance.totalEstTime"),
    equipmentInvolved: t("maintenance.equipmentInvolved"),
    statusBreakdown: t("maintenance.statusBreakdown"),
    systemShutdownRequired: t("maintenance.systemShutdownRequired"),

    // Time and duration
    duration: t("maintenance.duration"),
    to: t("maintenance.to"),
    windowDuration: t("maintenance.windowDuration"),
    estimatedWork: t("maintenance.estimatedWork"),
    criticalIssuesCount: t("maintenance.criticalIssuesCount"),

    // Drag and drop
    dropAnomalyHere: t("maintenance.dropAnomalyHere"),

    // Empty states
    noMaintenanceWindows: t("maintenance.noMaintenanceWindows"),
    createFirstWindow: t("maintenance.createFirstWindow"),

    // Sidebar
    maintenanceOverview: t("maintenance.maintenanceOverview"),
    totalWindows: t("maintenance.totalWindows"),
    upcomingWindows: t("maintenance.upcomingWindows"),
    allWindows: t("maintenance.allWindows"),
    selectedWindow: t("maintenance.selectedWindow"),

    // Calendar
    calendarLegend: t("maintenance.calendarLegend"),
    tipHover: t("maintenance.tipHover"),

    // Validation messages
    startDateRequired: t("maintenance.startDateRequired"),
    minimumDuration: t("maintenance.minimumDuration"),

    // Common
    anomalies: t("maintenance.anomalies"),
    more: t("maintenance.more"),
    windowId: t("maintenance.windowId"),

    // Enhanced maintenance planning
    industrialMaintenancePlanning: t("maintenance.industrialMaintenancePlanning"),
    realTimeOverview: t("maintenance.realTimeOverview"),
    yearWindows: t("maintenance.yearWindows"),
    total: t("maintenance.total"),
    active: t("maintenance.active"),
    planned: t("maintenance.planned"),
    done: t("maintenance.done"),
    filterWindows: t("maintenance.filterWindows"),
    upcomingMaintenanceWindows: t("maintenance.upcomingMaintenanceWindows"),
    currentlyActiveWindows: t("maintenance.currentlyActiveWindows"),
    finishedMaintenanceWindows: t("maintenance.finishedMaintenanceWindows"),
    criticalAnomaliesAssigned: t("maintenance.criticalAnomaliesAssigned"),
    workHours: t("maintenance.workHours"),
    
    // Resource and approval management
    responsibleRequired: t("maintenance.responsibleRequired"),
    sparepartsRequired: t("maintenance.sparepartsRequired"),
    internalResourcesRequired: t("maintenance.internalResourcesRequired"),
    externalResourcesRequired: t("maintenance.externalResourcesRequired"),
    pleaseAddActionPlan: t("maintenance.pleaseAddActionPlan"),
    pleaseFillAllFields: t("maintenance.pleaseFillAllFields"),
    configureDetailsForApproval: t("maintenance.configureDetailsForApproval"),
    actionDescription: t("maintenance.actionDescription"),
    describeDetailedAction: t("maintenance.describeDetailedAction"),
    estimatedTimeHours: t("maintenance.estimatedTimeHours"),
    exampleTime: t("maintenance.exampleTime"),
    actionPlanNumber: t("maintenance.actionPlanNumber"),
    availableSpareparts: t("maintenance.availableSpareparts"),
    addActionPlan: t("maintenance.addActionPlan"),
    anomalyStatusUpdatedSuccessfully: t("maintenance.anomalyStatusUpdatedSuccessfully"),
    estimatedTimeRequired: t("maintenance.estimatedTimeRequired"),
    
    // Shutdown and service management
    shutdownType: t("maintenance.shutdownType"),
    selectShutdownType: t("maintenance.selectShutdownType"),
    minor: t("maintenance.minor"),
    major: t("maintenance.major"),
    sevendays: t("maintenance.sevendays"),
    forced: t("maintenance.forced"),
    service: t("maintenance.service"),
    selectService: t("maintenance.selectService"),
    
    // Resource planning
    sparePartsRequired: t("maintenance.sparePartsRequired"),
    sparePartsDescription: t("maintenance.sparePartsDescription"),
    internalResources: t("maintenance.internalResources"),
    internalResourcesDescription: t("maintenance.internalResourcesDescription"),
    externalResources: t("maintenance.externalResources"),
    externalResourcesDescription: t("maintenance.externalResourcesDescription"),
    removeActionPlan: t("maintenance.removeActionPlan"),
    atleastOneActionPlan: t("maintenance.atleastOneActionPlan"),
  };
};

export const useDashboardTranslations = () => {
  const { t } = useTranslation();

  return {
    totalAnomalies: t("dashboard.totalAnomalies"),
    openAnomalies: t("dashboard.openAnomalies"),
    criticalAnomalies: t("dashboard.criticalAnomalies"),
    highPriorityAnomalies: t("dashboard.highPriorityAnomalies"),
    averageResolutionTime: t("dashboard.averageResolutionTime"),
    anomaliesByStatus: t("dashboard.anomaliesByStatus"),
    anomaliesByCriticality: t("dashboard.anomaliesByCriticality"),
    anomaliesByUnit: t("dashboard.anomaliesByUnit"),
    safetyImpactMetrics: t("dashboard.safetyImpactMetrics"),
    availabilityImpactMetrics: t("dashboard.availabilityImpactMetrics"),
    trendAnalysis: t("dashboard.trendAnalysis"),
    recentAnomalies: t("dashboard.recentAnomalies"),
    upcomingMaintenance: t("dashboard.upcomingMaintenance"),
    maintenanceWindowUtilization: t("dashboard.maintenanceWindowUtilization"),
    welcomeTitle: t("dashboard.welcomeTitle"),
    welcomeDescription: t("dashboard.welcomeDescription"),
    reportAnomaly: t("dashboard.reportAnomaly"),
    viewAll: t("dashboard.viewAll"),
    criticalAlert: t("dashboard.criticalAlert"),
    criticalAlertMessage: t("dashboard.criticalAlertMessage"),
    viewCritical: t("dashboard.viewCritical"),
    thisMonth: t("dashboard.thisMonth"),
    safetyImpact: t("dashboard.safetyImpact"),
    majorRiskAnomalies: t("dashboard.majorRiskAnomalies"),
    minor: t("dashboard.minor"),
    safe: t("dashboard.safe"),
    criticalityMatrix: t("dashboard.criticalityMatrix"),
    safetyAvailabilityRisk: t("dashboard.safetyAvailabilityRisk"),
    currentDistribution: t("dashboard.currentDistribution"),
    matrixLegend: t("dashboard.matrixLegend"),
    safetyLevel: t("dashboard.safetyLevel"),
    workflowStatus: t("dashboard.workflowStatus"),
    currentAnomalyDistribution: t("dashboard.currentAnomalyDistribution"),
    latestReportedIssues: t("dashboard.latestReportedIssues"),
    viewSchedule: t("dashboard.viewSchedule"),
    closedAnomalies: t("dashboard.closedAnomalies"),
    withinTargetRange: t("dashboard.withinTargetRange"),
  };
};

export const useCriticalityTranslations = () => {
  const { t } = useTranslation();

  return {
    critical: t("criticality.critical"),
    high: t("criticality.high"),
    medium: t("criticality.medium"),
    low: t("criticality.low"),
    veryLow: t("criticality.veryLow"),
    overallCriticality: t("criticality.overallCriticality"),
  };
};

export const useTimeTranslations = () => {
  const { t } = useTranslation();

  return {
    hours: t("time.hours"),
    days: t("time.days"),
    created: t("time.created"),
    updated: t("time.updated"),
    resolved: t("time.resolved"),
    treated: t("time.treated"),
    closed: t("time.closed"),
    inProgress: t("time.inProgress"),
  };
};

export const useValidationTranslations = () => {
  const { t } = useTranslation();

  return {
    required: t("validation.required"),
    invalidEmail: t("validation.invalidEmail"),
    passwordTooShort: t("validation.passwordTooShort"),
    passwordsDoNotMatch: t("validation.passwordsDoNotMatch"),
    invalidDate: t("validation.invalidDate"),
    titleRequired: t("validation.titleRequired"),
    descriptionRequired: t("validation.descriptionRequired"),
    equipmentRequired: t("validation.equipmentRequired"),
    detectionDateRequired: t("validation.detectionDateRequired"),
    statusRequired: t("validation.statusRequired"),
    criticalityRequired: t("validation.criticalityRequired"),
    estimatedTimeRequired: t("validation.estimatedTimeRequired"),
    tagsRequired: t("validation.tagsRequired"),
    startDateRequired: t("validation.startDateRequired"),
    endDateRequired: t("validation.endDateRequired"),
  };
};

// Utility functions
export const formatDate = (date: string | Date, language: string) => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleString(
    language === "ar" ? "ar-SA" : language === "fr" ? "fr-FR" : "en-US",
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};

export const getCalendarLocale = (language: string) => {
  switch (language) {
    case "ar":
      return "ar-SA";
    case "fr":
      return "fr-FR";
    default:
      return "en-US";
  }
};

export const formatNumber = (number: number, language: string) => {
  return number.toLocaleString(language === "ar" ? "ar-SA" : "en-US");
};

// Status translation helper
export const useCalendarTranslations = () => {
  const { t } = useTranslation();

  return {
    previousMonth: t("calendar.previousMonth"),
    nextMonth: t("calendar.nextMonth"),
    previousYear: t("calendar.previousYear"),
    nextYear: t("calendar.nextYear"),
    today: t("calendar.today"),
    selectDate: t("calendar.selectDate"),
    months: {
      january: t("calendar.months.january"),
      february: t("calendar.months.february"),
      march: t("calendar.months.march"),
      april: t("calendar.months.april"),
      may: t("calendar.months.may"),
      june: t("calendar.months.june"),
      july: t("calendar.months.july"),
      august: t("calendar.months.august"),
      september: t("calendar.months.september"),
      october: t("calendar.months.october"),
      november: t("calendar.months.november"),
      december: t("calendar.months.december"),
    },
    monthsShort: {
      jan: t("calendar.monthsShort.jan"),
      feb: t("calendar.monthsShort.feb"),
      mar: t("calendar.monthsShort.mar"),
      apr: t("calendar.monthsShort.apr"),
      may: t("calendar.monthsShort.may"),
      jun: t("calendar.monthsShort.jun"),
      jul: t("calendar.monthsShort.jul"),
      aug: t("calendar.monthsShort.aug"),
      sep: t("calendar.monthsShort.sep"),
      oct: t("calendar.monthsShort.oct"),
      nov: t("calendar.monthsShort.nov"),
      dec: t("calendar.monthsShort.dec"),
    },
    weekdays: {
      sunday: t("calendar.weekdays.sunday"),
      monday: t("calendar.weekdays.monday"),
      tuesday: t("calendar.weekdays.tuesday"),
      wednesday: t("calendar.weekdays.wednesday"),
      thursday: t("calendar.weekdays.thursday"),
      friday: t("calendar.weekdays.friday"),
      saturday: t("calendar.weekdays.saturday"),
    },
    weekdaysShort: {
      sun: t("calendar.weekdaysShort.sun"),
      mon: t("calendar.weekdaysShort.mon"),
      tue: t("calendar.weekdaysShort.tue"),
      wed: t("calendar.weekdaysShort.wed"),
      thu: t("calendar.weekdaysShort.thu"),
      fri: t("calendar.weekdaysShort.fri"),
      sat: t("calendar.weekdaysShort.sat"),
    },
    weekdaysNarrow: {
      s: t("calendar.weekdaysNarrow.s"),
      m: t("calendar.weekdaysNarrow.m"),
      t: t("calendar.weekdaysNarrow.t"),
      w: t("calendar.weekdaysNarrow.w"),
      th: t("calendar.weekdaysNarrow.th"),
      f: t("calendar.weekdaysNarrow.f"),
      sa: t("calendar.weekdaysNarrow.sa"),
    },
  };
};

export const useAnomalyListTranslations = () => {
  const { t } = useTranslation();

  return {
    manageAndTrack: t("anomalyList.manageAndTrack"),
    reportNewAnomaly: t("anomalyList.reportNewAnomaly"),
    searchAndFilters: t("anomalyList.searchAndFilters"),
    searchAnomalies: t("anomalyList.searchAnomalies"),
    allStatus: t("anomalyList.allStatus"),
    allLevels: t("anomalyList.allLevels"),
    criticalHigh: t("anomalyList.criticalHigh"),
    high: t("anomalyList.high"),
    medium: t("anomalyList.medium"),
    low: t("anomalyList.low"),
    veryLow: t("anomalyList.veryLow"),
    addActionPlan: t("anomalyList.addActionPlan"),
    assignToMaintenance: t("anomalyList.assignToMaintenance"),
    noAnomaliesFound: t("anomalyList.noAnomaliesFound"),
    tryAdjustingFilters: t("anomalyList.tryAdjustingFilters"),
    industrialAnomalyManagement: t("anomalyList.industrialAnomalyManagement"),
    criticalIssues: t("anomalyList.criticalIssues"),
    requireImmediateAttention: t("anomalyList.requireImmediateAttention"),
    totalAnomalies: t("anomalyList.totalAnomalies"),
    totalAnomaliesFound: t("anomalyList.totalAnomaliesFound"),
    inProgress: t("anomalyList.inProgress"),
    currentlyBeingResolved: t("anomalyList.currentlyBeingResolved"),
    findAndFilterDescription: t("anomalyList.findAndFilterDescription"),
    view: t("anomalyList.view"),
    previous: t("anomalyList.previous"),
    next: t("anomalyList.next"),
    pageOfPages: t("anomalyList.pageOfPages"),
    filterByDescription: t("anomalyList.filterByDescription"),
    filterByEquipment: t("anomalyList.filterByEquipment"),
    filterByDetectionDate: t("anomalyList.filterByDetectionDate"),
    filterBySystem: t("anomalyList.filterBySystem"),
    filterByService: t("anomalyList.filterByService"),
    shutdownRequired: t("anomalyList.shutdownRequired"),
    allEquipment: t("anomalyList.allEquipment"),
    allSystems: t("anomalyList.allSystems"),
    allServices: t("anomalyList.allServices"),
    allShutdownOptions: t("anomalyList.allShutdownOptions"),
    shutdownYes: t("anomalyList.shutdownYes"),
    shutdownNo: t("anomalyList.shutdownNo"),
    fromDate: t("anomalyList.fromDate"),
    toDate: t("anomalyList.toDate"),
    clearFilters: t("anomalyList.clearFilters"),
    contentFilters: t("anomalyList.contentFilters"),
    categoryFilters: t("anomalyList.categoryFilters"),
    dateAndActions: t("anomalyList.dateAndActions"),
    quickSearch: t("anomalyList.quickSearch"),
    advancedFiltering: t("anomalyList.advancedFiltering"),
    activeFilter: t("anomalyList.activeFilter"),
    activeFilters: t("anomalyList.activeFilters"),
    filterByDescriptionPlaceholder: t("anomalyList.filterByDescriptionPlaceholder"),
    filterByEquipmentPlaceholder: t("anomalyList.filterByEquipmentPlaceholder"),
    filterBySystemPlaceholder: t("anomalyList.filterBySystemPlaceholder"),
    selectDetectionDate: t("anomalyList.selectDetectionDate"),
    selectService: t("anomalyList.selectService"),
    selectShutdown: t("anomalyList.selectShutdown"),
    systemShutdown: t("anomalyList.systemShutdown"),
  };
};

export const useCreateAnomalyTranslations = () => {
  const { t } = useTranslation();

  return {
    reportNewAnomaly: t("createAnomaly.reportNewAnomaly"),
    documentNewAnomaly: t("createAnomaly.documentNewAnomaly"),
    anomalyRegistrationForm: t("createAnomaly.anomalyRegistrationForm"),
    completeFormDescription: t("createAnomaly.completeFormDescription"),
    coreFieldsMandatory: t("createAnomaly.coreFieldsMandatory"),
    titleAndDescription: t("createAnomaly.titleAndDescription"),
    anomalyType: t("createAnomaly.anomalyType"),
    relatedEquipment: t("createAnomaly.relatedEquipment"),
    dateAndTime: t("createAnomaly.dateAndTime"),
    originSource: t("createAnomaly.originSource"),
    responsiblePersonAssignment: t("createAnomaly.responsiblePersonAssignment"),
    criticalityAssessment: t("createAnomaly.criticalityAssessment"),
    additionalFeatures: t("createAnomaly.additionalFeatures"),
    fileAttachments: t("createAnomaly.fileAttachments"),
    tagsForCategorization: t("createAnomaly.tagsForCategorization"),
    linkToMaintenance: t("createAnomaly.linkToMaintenance"),
    autoSuggestion: t("createAnomaly.autoSuggestion"),
    duplicateDetection: t("createAnomaly.duplicateDetection"),
    uploadAnomalies: t("createAnomaly.uploadAnomalies"),
    uploading: t("createAnomaly.uploading"),
    goBack: t("createAnomaly.goBack"),
    fileUploadSuccess: t("createAnomaly.fileUploadSuccess"),
    fileUploadFailed: t("createAnomaly.fileUploadFailed"),
    
    // Loading screen and processing
    processingYourFile: t("createAnomaly.processingYourFile"),
    aiAnalyzingData: t("createAnomaly.aiAnalyzingData"),
    fileUpload: t("createAnomaly.fileUpload"),
    fileReceivedSuccessfully: t("createAnomaly.fileReceivedSuccessfully"),
    uploadingYourFile: t("createAnomaly.uploadingYourFile"),
    aiAnalysis: t("createAnomaly.aiAnalysis"),
    analysisCompleted: t("createAnomaly.analysisCompleted"),
    classifyingAnomalyPatterns: t("createAnomaly.classifyingAnomalyPatterns"),
    assessmentCompleted: t("createAnomaly.assessmentCompleted"),
    predictingSeverityLevels: t("createAnomaly.predictingSeverityLevels"),
    complete: t("createAnomaly.complete"),
    processing: t("createAnomaly.processing"),
    fileUploadInProgress: t("createAnomaly.fileUploadInProgress"),
    aiAnalysisInProgress: t("createAnomaly.aiAnalysisInProgress"),
    classificationAndPredictionInProgress: t("createAnomaly.classificationAndPredictionInProgress"),
    processingCompleted: t("createAnomaly.processingCompleted"),
    
    // Header and main sections
    industrialAnomalyManagement: t("createAnomaly.industrialAnomalyManagement"),
    documentAndClassify: t("createAnomaly.documentAndClassify"),
    backToAnomalies: t("createAnomaly.backToAnomalies"),
    uploadFile: t("createAnomaly.uploadFile"),
    fileUploadAndAnalysis: t("createAnomaly.fileUploadAndAnalysis"),
    uploadTechnicalDocumentation: t("createAnomaly.uploadTechnicalDocumentation"),
    uploadTechnicalFile: t("createAnomaly.uploadTechnicalFile"),
    dragAndDropOrClick: t("createAnomaly.dragAndDropOrClick"),
    manualEntryForm: t("createAnomaly.manualEntryForm"),
    enterAnomalyDetailsManually: t("createAnomaly.enterAnomalyDetailsManually"),
    
    // Form fields
    anomalyTitle: t("createAnomaly.anomalyTitle"),
    enterDescriptiveTitle: t("createAnomaly.enterDescriptiveTitle"),
    description: t("createAnomaly.description"),
    provideDetailedDescription: t("createAnomaly.provideDetailedDescription"),
    criticalityLevel: t("createAnomaly.criticalityLevel"),
    selectLevel: t("createAnomaly.selectLevel"),
    critical: t("createAnomaly.critical"),
    high: t("createAnomaly.high"),
    medium: t("createAnomaly.medium"),
    low: t("createAnomaly.low"),
    veryLow: t("createAnomaly.veryLow"),
    equipmentType: t("createAnomaly.equipmentType"),
    selectEquipment: t("createAnomaly.selectEquipment"),
    pump: t("createAnomaly.pump"),
    valve: t("createAnomaly.valve"),
    motor: t("createAnomaly.motor"),
    sensor: t("createAnomaly.sensor"),
    other: t("createAnomaly.other"),
  };
};

export const useSettingsTranslations = () => {
  const { t } = useTranslation();

  return {
    userDetails: t("settings.userDetails"),
    updatePersonalInformation: t("settings.updatePersonalInformation"),
    firstName: t("settings.firstName"),
    lastName: t("settings.lastName"),
    emailAddress: t("settings.emailAddress"),
    phoneNumber: t("settings.phoneNumber"),
    role: t("settings.role"),
    department: t("settings.department"),
    saveChanges: t("settings.saveChanges"),
    userDetailsUpdated: t("settings.userDetailsUpdated"),
    enterFirstName: t("settings.enterFirstName"),
    enterLastName: t("settings.enterLastName"),
    enterEmailAddress: t("settings.enterEmailAddress"),
    enterPhoneNumber: t("settings.enterPhoneNumber"),
    selectRole: t("settings.selectRole"),
    selectDepartment: t("settings.selectDepartment"),
    administrator: t("settings.administrator"),
    engineer: t("settings.engineer"),
    technician: t("settings.technician"),
    manager: t("settings.manager"),
    it: t("settings.it"),
    hr: t("settings.hr"),
    engineering: t("settings.engineering"),
    operations: t("settings.operations"),
  };
};

export const useRexTranslations = () => {
  const { t } = useTranslation();

  return {
    title: t("rex.title"),
    subtitle: t("rex.subtitle"),
    createRex: t("rex.createRex"),
    createQuickRex: t("rex.createQuickRex"),
    createFullRex: t("rex.createFullRex"),
    viewAllRex: t("rex.viewAllRex"),
    rexOpportunity: t("rex.rexOpportunity"),
    knowledgeCapture: t("rex.knowledgeCapture"),
    maintenanceContext: t("rex.maintenanceContext"),
    executiveSummary: t("rex.executiveSummary"),
    rootCauseAnalysis: t("rex.rootCauseAnalysis"),
    correctiveActions: t("rex.correctiveActions"),
    preventiveActions: t("rex.preventiveActions"),
    lessonsLearned: t("rex.lessonsLearned"),
    recommendations: t("rex.recommendations"),
    impactLevel: t("rex.impactLevel"),
    category: t("rex.category"),
    lowImpact: t("rex.lowImpact"),
    mediumImpact: t("rex.mediumImpact"),
    highImpact: t("rex.highImpact"),
    criticalImpact: t("rex.criticalImpact"),
    technical: t("rex.technical"),
    procedural: t("rex.procedural"),
    organizational: t("rex.organizational"),
    safety: t("rex.safety"),
    quality: t("rex.quality"),
    totalRexRecords: t("rex.totalRexRecords"),
    completedWindows: t("rex.completedWindows"),
    rexCoverage: t("rex.rexCoverage"),
    avgImpact: t("rex.avgImpact"),
    searchRex: t("rex.searchRex"),
    rexRecords: t("rex.rexRecords"),
    analytics: t("rex.analytics"),
    opportunities: t("rex.opportunities"),
    noRexFound: t("rex.noRexFound"),
    startDocumenting: t("rex.startDocumenting"),
    analyticsComingSoon: t("rex.analyticsComingSoon"),
    rexOpportunities: t("rex.rexOpportunities"),
    completedMaintenanceWindows: t("rex.completedMaintenanceWindows"),
    noOpportunitiesYet: t("rex.noOpportunitiesYet"),
    completeMaintenanceWindows: t("rex.completeMaintenanceWindows"),
  };
};

export const translateStatus = (status: string, t: (key: string) => string) => {
  const statusMap: Record<string, string> = {
    // English status codes
    "IN_PROGRESS": "En cours",
    "TREATED": "Traitée", 
    "CLOSED": "Clôturée",
    
    // French status codes  
    "in-progress": "En cours",
    "en_cours": "En cours",
    "traitee": "Traitée",
    "cloture": "Clôturée",
    
    // Other statuses
    "open": t("anomalyStatus.open"),
    "pending-approval": t("anomalyStatus.pendingApproval"),
    "waiting-unit-shutdown": t("anomalyStatus.waitingUnitShutdown"),
    "pending-parts": t("anomalyStatus.pendingParts"),
    "cancelled": t("anomalyStatus.cancelled"),
    
    // Maintenance statuses
    "scheduled": t("maintenance.scheduled"),
    "completed": t("maintenance.completed"),
  };

  return statusMap[status] || status;
};

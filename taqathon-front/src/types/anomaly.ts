export interface Anomaly {
  id: number;
  title?: string;
  description: string;
  equipment: string | Equipment;
  equipementDescription?: string;
  detectionDate: Date;
  responsiblePerson?: string;
  status: AnomalyStatus;
  system: string;
  service?: string;
  estimatedTime?: number;
  disponibility?: number;
  integrity?: number;
  processSafety?: number;
  predictedDisponibility?: number;
  predictedIntegrity?: number;
  predictedProcessSafety?: number;
  criticality?: number;
  predictionsData?: {
    Disponibilité?: number;
    "Process Safety"?: number;
    "Fiabilité Intégrité"?: number;
    Criticité?: number;
  };
  rexFilePath?: string;
  sysShutDownRequired: boolean;
  forcedAssigned: boolean;
  feedBack?: string;
  userFeedBack?: boolean;
  createdAt: Date;
  updatedAt: Date;
  treatedAt?: Date;
  closedAt?: Date;
  maintenanceWindowId?: number;
  dateResolved?: string;
  origin?: AnomalyOrigin;
  responsibleSection?: string;
  workOrderReference?: string;
  unit?: string;
  currentSystemStatus?: string;
  level?: number;
  priority?: number;
  maintenanceWindow?: number;
  attachments?: Attachment[];
  attachements?: Attachment[];
  comments?: Comment[];
  rex?: ReturnOfExperience;
  changeHistory?: ChangeHistoryEntry[];
  tags?: string;
  actionPlans?: ActionPlan[];
  actionPlan?: ActionPlan[];
}

// availability: null;
// createdAt: "2025-07-06T16:06:21.747Z";
// criticality: 10;
// description: "Detected unusual temperature rise in motor bearing.";
// detectionDate: "2025-07-05T09:15:00.000Z";
// equipment: "Pump Unit B";
// estimatedTime: 2;
// id: 1;
// maintenanceWindowId: 1;
// reliability: null;
// responsiblePerson: null;
// safety: null;
// status: "open";
// sysShutDownRequired: true;
// tags: "temperature,bearing";
// title: "test7";
// updatedAt: "2025-07-06T16:15:07.080Z";

export interface Equipment {
  id: string;
  name: string;
  equipmentNumber: string;
  technicalDescription: string;
  code: string;
  location: string;
  type: string;
  unit: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
}

export interface MaintenanceWindow {
  id?: string;
  title: string;
  scheduleStart: string;
  scheduleEnd: string;
  status?: string;
  anomalies: any[];
  type?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ReturnOfExperience {
  id: string;
  summary: string;
  rootCause: string;
  correctionAction: string;
  preventiveAction: string;
  lessonsLearned: string;
  recommendations: string;
  attachments: Attachment[];
  createdBy: string;
  createdAt: Date;
}

export interface ChangeHistoryEntry {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}

export interface ActionPlan {
  id: string;
  action: string;
  responsible: string;
  pdrsAvailable: string;
  internalResources: string;
  externalResources: string;
  estimatedTime?: number;
  status?: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt?: Date;
  createdBy?: string;
}

export type AnomalyType =
  | "mechanical"
  | "electrical"
  | "instrumentation"
  | "safety"
  | "environmental"
  | "operational"
  | "maintenance"
  | "quality"
  | "other";

export type AnomalyOrigin =
  | "oracle"
  | "maximo"
  | "excel"
  | "inspection"
  | "operator-report"
  | "monitoring-system"
  | "maintenance-team"
  | "other";

export type AnomalyStatus =
  | "open"
  | "in-progress"
  | "traitee"
  | "cloture"
  | "pending-approval"
  | "closed"
  | "IN_PROGRESS"
  | "TREATED"
  | "CLOSED";

export type CriticalityLevel =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "very-low";

export interface CriticalityAssessment {
  safety: SafetyLevel; // 1-3 scale
  availability: AvailabilityLevel; // 1-3 scale
  score: number; // Safety × Availability (1-9)
  level: CriticalityLevel;
  autoSuggested?: CriticalityLevel;
  manualOverride?: boolean;
  reasoning?: string;
}

export type SafetyLevel = 1 | 2 | 3;
export type AvailabilityLevel = 1 | 2 | 3;

export const SAFETY_DESCRIPTIONS = {
  1: "No risk",
  2: "Minor risk to personnel/equipment",
  3: "Major risk or high potential danger",
} as const;

export const AVAILABILITY_DESCRIPTIONS = {
  1: "No production impact",
  2: "Partial performance reduction",
  3: "Significant loss or complete shutdown",
} as const;

export const CRITICALITY_MAPPING = {
  1: "very-low", // Gray - Handle later, no urgency
  2: "low", // Green - Plan accordingly
  3: "medium", // Yellow - Active monitoring
  4: "medium", // Yellow - Include in planning
  6: "high", // Orange - Schedule in upcoming shutdown
  9: "critical", // Red - Absolute priority treatment
} as const;

export interface Dashboard {
  totalAnomalies: number;
  openAnomalies: number;
  criticalAnomalies: number;
  highPriorityAnomalies: number;
  averageResolutionTime: number;
  anomaliesByStatus: Record<AnomalyStatus, number>;
  anomaliesByCriticality: Record<CriticalityLevel, number>;
  anomaliesByUnit: Record<string, number>;
  safetyImpactMetrics: {
    noRisk: number;
    minorRisk: number;
    majorRisk: number;
  };
  availabilityImpactMetrics: {
    noImpact: number;
    partialImpact: number;
    significantImpact: number;
  };
  trendAnalysis: {
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  recentAnomalies: Anomaly[];
  upcomingMaintenance: MaintenanceWindow[];
  maintenanceWindowUtilization: number;
}

export interface FilterOptions {
  status?: AnomalyStatus[];
  criticality?: CriticalityLevel[];
  type?: AnomalyType[];
  equipment?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  responsiblePerson?: string[];
  tags?: string[];
}

export interface SortOptions {
  field: keyof Anomaly;
  direction: "asc" | "desc";
}

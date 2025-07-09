import {
  CriticalityAssessment,
  SafetyLevel,
  AvailabilityLevel,
  CriticalityLevel,
  CRITICALITY_MAPPING,
  SAFETY_DESCRIPTIONS,
  AVAILABILITY_DESCRIPTIONS,
} from "@/types/anomaly";

export function calculateCriticalityScore(
  safety: SafetyLevel,
  availability: AvailabilityLevel,
): number {
  return safety * availability;
}

export function getCriticalityLevel(score: number): CriticalityLevel {
  return (
    CRITICALITY_MAPPING[score as keyof typeof CRITICALITY_MAPPING] || "low"
  );
}

export function createCriticalityAssessment(
  safety: SafetyLevel,
  availability: AvailabilityLevel,
  reasoning?: string,
): CriticalityAssessment {
  const score = calculateCriticalityScore(safety, availability);
  const level = getCriticalityLevel(score);

  return {
    safety,
    availability,
    score,
    level,
    reasoning,
  };
}

export function getCriticalityColor(level: CriticalityLevel): string {
  switch (level) {
    case "critical":
      return "bg-status-critical text-white";
    case "high":
      return "bg-status-high text-white";
    case "medium":
      return "bg-status-medium text-black";
    case "low":
      return "bg-status-low text-white";
    case "very-low":
      return "bg-status-very-low text-black";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function getCriticalityLabel(level: CriticalityLevel): string {
  switch (level) {
    case "critical":
      return `CRITICAL (${level})`;
    case "high":
      return `HIGH (${level})`;
    case "medium":
      return `MEDIUM (${level})`;
    case "low":
      return `LOW (${level})`;
    case "very-low":
      return `VERY LOW (${level})`;
    default:
      return "UNKNOWN";
  }
}

export function getCriticalityDescription(level: CriticalityLevel): string {
  switch (level) {
    case "critical":
      return "Absolute priority treatment required";
    case "high":
      return "Schedule in upcoming shutdown";
    case "medium":
      return "Active monitoring and planning";
    case "low":
      return "Plan accordingly";
    case "very-low":
      return "Handle later, no urgency";
    default:
      return "Assessment required";
  }
}

export function getSafetyDescription(level: SafetyLevel): string {
  return SAFETY_DESCRIPTIONS[level];
}

export function getAvailabilityDescription(level: AvailabilityLevel): string {
  return AVAILABILITY_DESCRIPTIONS[level];
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "critical":
      return "text-status-critical";
    case "high":
      return "text-status-high";
    case "medium":
      return "text-status-medium";
    case "low":
      return "text-status-low";
    case "very-low":
      return "text-status-very-low";
    case "in-progress":
      return "text-status-in-progress";
    case "resolved":
      return "text-status-resolved";
    case "new":
      return "text-status-new";
    case "waiting-unit-shutdown":
      return "text-status-waiting-shutdown";
    default:
      return "text-muted-foreground";
  }
}

export function getStatusBadgeColor(status: string): string {
  console.log(status);

  switch (status) {
    case "IN_PROGRESS":
    case "in-progress":
    case "en cours":
      return "bg-status-in-progress text-white text-[10px]";
    case "TREATED":
    case "traité":
    case "traitee":
    case "traite":
      return "bg-status-medium text-white text-[10px]";
    case "CLOSED":
    case "closed":
    case "cloturé":
    case "cloture":
      return "bg-muted text-muted-foreground text-[10px]";
    default:
      return "bg-muted text-muted-foreground text-[10px]";
  }
}

export const CRITICALITY_SCORE_MATRIX = [
  [1, 2, 3], // Safety Level 1 × Availability [1,2,3]
  [2, 4, 6], // Safety Level 2 × Availability [1,2,3]
  [3, 6, 9], // Safety Level 3 × Availability [1,2,3]
] as const;

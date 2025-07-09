import {
  Anomaly,
  Equipment,
  MaintenanceWindow,
  Dashboard,
  AnomalyStatus,
  CriticalityLevel,
  CRITICALITY_MAPPING,
} from "@/types/anomaly";

export const mockEquipment: Equipment[] = [
  {
    id: "eq-001",
    name: "Gas Turbine GT-01",
    equipmentNumber: "GT-U3-001",
    technicalDescription: "Siemens SGT-800 Industrial Gas Turbine - 47.5 MW",
    code: "GT-01",
    location: "Power Block A - Unit 3",
    type: "Gas Turbine",
    unit: "U3",
    manufacturer: "Siemens",
    model: "SGT-800",
    serialNumber: "GT3001-2023",
  },
  {
    id: "eq-002",
    name: "Steam Turbine ST-01",
    equipmentNumber: "ST-U3-001",
    technicalDescription: "Condensing Steam Turbine - 25 MW",
    code: "ST-01",
    location: "Power Block A - Unit 3",
    type: "Steam Turbine",
    unit: "U3",
    manufacturer: "Siemens",
    model: "SST-900",
    serialNumber: "ST3001-2023",
  },
  {
    id: "eq-003",
    name: "Generator GEN-01",
    equipmentNumber: "GEN-U3-001",
    technicalDescription: "Synchronous Generator - 75 MVA",
    code: "GEN-01",
    location: "Power Block A - Unit 3",
    type: "Generator",
    unit: "U3",
    manufacturer: "Siemens",
    model: "SGEN-2000P",
    serialNumber: "GEN3001-2023",
  },
  {
    id: "eq-004",
    name: "Heat Recovery Steam Generator HRSG-01",
    equipmentNumber: "HRSG-U3-001",
    technicalDescription: "Three-Pressure Level HRSG with Reheat",
    code: "HRSG-01",
    location: "Power Block A - Unit 3",
    type: "HRSG",
    unit: "U3",
    manufacturer: "HRSG Supplier",
    model: "HRSG-3P-RH",
    serialNumber: "HRSG3001-2023",
  },
  {
    id: "eq-005",
    name: "Cooling Tower CT-01",
    equipmentNumber: "CT-COM-001",
    technicalDescription: "Mechanical Draft Cooling Tower - 2 Cells",
    code: "CT-01",
    location: "Cooling System Area",
    type: "Cooling Tower",
    unit: "Common",
    manufacturer: "Cooling Tech",
    model: "MD-2CELL",
    serialNumber: "CT001-2023",
  },
  {
    id: "eq-006",
    name: "Transformer TR-01",
    equipmentNumber: "TR-U3-001",
    technicalDescription: "Main Power Transformer - 80 MVA",
    code: "TR-01",
    location: "Electrical Switchyard - Unit 3",
    type: "Transformer",
    unit: "U3",
    manufacturer: "ABB",
    model: "ATPU-80000",
    serialNumber: "TR3001-2023",
  },
];

export const mockMaintenanceWindows: MaintenanceWindow[] = [
  {
    id: "mw-001",
    title: "GT-01 Major Inspection - Unit 3 Shutdown",
    scheduleStart: "2025-07-15T08:00:00",
    scheduleEnd: "2025-07-17T18:00:00",
    anomalies: [
      {
        id: 1,
        title: "Bearing Vibration",
        criticality: 12,
        estimatedTime: 4,
        status: "in-progress",
        description: "High vibration detected in turbine bearing",
        equipment: "Gas Turbine GT-01",
        detectionDate: "2025-01-25T14:30:00",
        maintenanceWindowId: 1,
        createdAt: "2025-01-25T14:30:00",
        updatedAt: "2025-01-25T14:30:00",
        tags: "vibration,critical",
        sysShutDownRequired: true,
      },
    ],
  },
  {
    id: "mw-002",
    title: "Cooling System Winter Maintenance",
    scheduleStart: "2025-07-20T10:00:00",
    scheduleEnd: "2025-07-22T16:00:00",
    anomalies: [
      {
        id: 2,
        title: "Coolant Leak",
        criticality: 8,
        estimatedTime: 6,
        status: "in-progress",
        description: "Minor coolant leak detected in cooling tower",
        equipment: "Cooling Tower CT-01",
        detectionDate: "2025-01-20T10:15:00",
        maintenanceWindowId: 2,
        createdAt: "2025-01-20T10:15:00",
        updatedAt: "2025-01-20T10:15:00",
        tags: "coolant,leak",
        sysShutDownRequired: false,
      },
    ],
  },
  {
    id: "mw-003",
    title: "Emergency Generator Bearing Replacement",
    scheduleStart: "2025-07-25T14:00:00",
    scheduleEnd: "2025-07-27T22:00:00",
    anomalies: [
      {
        id: 3,
        title: "Generator Malfunction",
        criticality: 15,
        estimatedTime: 12,
        status: "closed",
        description: "Generator malfunction causing power fluctuations",
        equipment: "Generator GEN-01",
        detectionDate: "2025-01-15T09:00:00",
        maintenanceWindowId: 3,
        createdAt: "2025-01-15T09:00:00",
        updatedAt: "2025-01-15T09:00:00",
        tags: "generator,critical",
        sysShutDownRequired: true,
      },
    ],
  },
  {
    id: "mw-004",
    title: "Transformer Oil Analysis & Testing",
    scheduleStart: "2025-07-10T09:00:00",
    scheduleEnd: "2025-07-10T17:00:00",
    anomalies: [],
  },
  {
    id: "mw-005",
    title: "Weekly Turbine Inspection",
    scheduleStart: "2025-07-30T08:00:00",
    scheduleEnd: "2025-07-30T16:00:00",
    anomalies: [
      {
        id: 4,
        title: "Temperature Sensor Calibration",
        criticality: 5,
        estimatedTime: 3,
        status: "pending-approval",
        description: "Temperature sensors require calibration",
        equipment: "Steam Turbine ST-01",
        detectionDate: "2025-01-25T11:00:00",
        maintenanceWindowId: 5,
        createdAt: "2025-01-25T11:00:00",
        updatedAt: "2025-01-25T11:00:00",
        tags: "sensors,calibration",
        sysShutDownRequired: false,
      },
    ],
  },
  {
    id: "mw-006",
    title: "HRSG Annual Inspection",
    scheduleStart: "2025-08-05T06:00:00",
    scheduleEnd: "2025-08-07T20:00:00",
    anomalies: [
      {
        id: 5,
        title: "Steam Leak in HRSG",
        criticality: 10,
        estimatedTime: 8,
        status: "in-progress",
        description: "Small steam leak detected in HRSG piping",
        equipment: "Heat Recovery Steam Generator HRSG-01",
        detectionDate: "2025-01-26T13:45:00",
        maintenanceWindowId: 6,
        createdAt: "2025-01-26T13:45:00",
        updatedAt: "2025-01-26T13:45:00",
        tags: "steam,leak,pressure",
        sysShutDownRequired: true,
      },
      {
        id: 6,
        title: "Pressure Valve Replacement",
        criticality: 7,
        estimatedTime: 4,
        status: "pending-approval",
        description: "Safety pressure valve requires replacement",
        equipment: "Heat Recovery Steam Generator HRSG-01",
        detectionDate: "2025-01-22T16:20:00",
        maintenanceWindowId: 6,
        createdAt: "2025-01-22T16:20:00",
        updatedAt: "2025-01-22T16:20:00",
        tags: "pressure,valve,safety",
        sysShutDownRequired: true,
      },
    ],
  },
];

export const mockAnomalies: Anomaly[] = [
  {
    id: 1,
    title: "Compressor bearing vibration exceeding alarm limits",
    description:
      "During routine monitoring at 14:30, vibration levels on the compressor bearing #2 were detected at 8.2 mm/s, exceeding the alarm threshold of 7.1 mm/s. Temperature readings also show a gradual increase from 65°C to 72°C over the past 48 hours. This indicates potential bearing wear, misalignment, or lubrication issues requiring immediate investigation to prevent catastrophic failure.",
    type: "mechanical",
    equipment: mockEquipment[0],
    detectionDate: new Date("2025-01-25T14:30:00"),
    origin: "monitoring-system",
    responsiblePerson: "Ahmed Benali",
    responsibleSection: "Rotating Equipment Maintenance",
    workOrderReference: "WO-2025-001",
    unit: "U3",
    currentSystemStatus: "Online - Reduced Load",
    status: "in-progress",
    criticalityAssessment: {
      safety: 3, // Major risk - potential catastrophic failure
      availability: 3, // Complete shutdown if failure occurs
      score: 9, // 3 × 3
      level: "critical",
      reasoning:
        "High vibration on critical rotating equipment poses major safety risk and would cause complete unit shutdown",
    },
    priority: 1,
    maintenanceWindow: mockMaintenanceWindows[0],
    attachments: [
      {
        id: "att-001",
        name: "vibration_analysis_GT01_250125.pdf",
        type: "application/pdf",
        size: 2547834,
        url: "/attachments/vibration_analysis_GT01_250125.pdf",
        uploadedAt: new Date("2025-01-25T15:00:00"),
        uploadedBy: "Ahmed Benali",
      },
      {
        id: "att-002",
        name: "thermal_imaging_bearing2.jpg",
        type: "image/jpeg",
        size: 1234567,
        url: "/attachments/thermal_imaging_bearing2.jpg",
        uploadedAt: new Date("2025-01-25T16:30:00"),
        uploadedBy: "Fatima Zahra",
      },
    ],
    comments: [
      {
        id: "com-001",
        content:
          "Initial inspection confirms elevated bearing temperature. Thermal imaging shows hot spot on bearing housing. Recommend immediate oil analysis and consider load reduction.",
        author: "Fatima Zahra - Condition Monitoring",
        createdAt: new Date("2025-01-25T16:00:00"),
      },
      {
        id: "com-002",
        content:
          "Oil sample sent to lab. Bearing replacement parts ordered with emergency priority. Expected delivery 48 hours. Coordinating with operations for potential load reduction.",
        author: "Ahmed Benali - Maintenance Engineer",
        createdAt: new Date("2025-01-26T09:00:00"),
      },
    ],
    changeHistory: [
      {
        id: "ch-001",
        field: "status",
        oldValue: "new",
        newValue: "in-progress",
        changedBy: "Ahmed Benali",
        changedAt: new Date("2025-01-25T15:30:00"),
        reason: "Investigation started - vibration analysis initiated",
      },
      {
        id: "ch-002",
        field: "priority",
        oldValue: "2",
        newValue: "1",
        changedBy: "Hassan Alami - Operations Manager",
        changedAt: new Date("2025-01-25T17:00:00"),
        reason: "Elevated to critical priority due to safety implications",
      },
    ],
    tags: [
      "vibration",
      "bearing",
      "critical-equipment",
      "safety-critical",
      "u3",
    ],
  },
  {
    id: 2,
    title: "Cooling water outlet temperature trending high",
    description:
      "Cooling water outlet temperature from CT-01 Cell A has increased from normal operating range of 32-34°C to 37°C over the past 5 days. This gradual increase suggests fouling of heat exchanger surfaces or reduced cooling efficiency, potentially impacting overall plant thermal efficiency and performance.",
    type: "operational",
    equipment: mockEquipment[4],
    detectionDate: new Date("2025-01-24T10:15:00"),
    origin: "operator-report",
    responsiblePerson: "Youssef Alami",
    responsibleSection: "Cooling Systems",
    workOrderReference: "WO-2025-002",
    unit: "Common",
    currentSystemStatus: "Online - Monitoring",
    status: "closed",
    criticalityAssessment: {
      safety: 1, // No risk
      availability: 2, // Partial performance reduction
      score: 2, // 1 × 2
      level: "low",
      reasoning: "No safety impact, minor efficiency reduction",
    },
    priority: 3,
    dateResolved: new Date("2025-01-26T16:00:00"),
    attachments: [
      {
        id: "att-003",
        name: "cooling_water_trend_analysis.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 245678,
        url: "/attachments/cooling_water_trend_analysis.xlsx",
        uploadedAt: new Date("2025-01-24T11:00:00"),
        uploadedBy: "Youssef Alami",
      },
    ],
    comments: [
      {
        id: "com-003",
        content:
          "Investigation revealed partially blocked heat exchanger tubes due to bio-fouling. Chemical cleaning scheduled for tonight shift. Performance monitoring continues.",
        author: "Youssef Alami - Cooling Systems Engineer",
        createdAt: new Date("2025-01-24T14:00:00"),
      },
    ],
    rex: {
      id: "rex-001",
      summary:
        "Cooling water temperature anomaly resolved through targeted chemical cleaning of heat exchanger",
      rootCause:
        "Bio-fouling accumulation in heat exchanger tubes due to seasonal algae growth in cooling water system. Insufficient biocide treatment during warm weather period.",
      correctionAction:
        "Performed chemical cleaning using biodegradable cleaning solution. Restored heat transfer coefficient to design values. Temperature returned to normal range within 8 hours.",
      preventiveAction:
        "1) Implement weekly water quality testing during warm seasons. 2) Increase biocide treatment frequency. 3) Install online monitoring for heat exchanger performance. 4) Schedule quarterly preventive cleaning.",
      lessonsLearned:
        "Early detection through continuous temperature monitoring prevented significant efficiency loss. Seasonal bio-fouling patterns now better understood. Proactive water treatment more cost-effective than reactive cleaning.",
      recommendations:
        "1) Install automatic biocide dosing system. 2) Consider UV sterilization for cooling water treatment. 3) Develop seasonal maintenance protocols. 4) Train operators on early fouling indicators.",
      attachments: [
        {
          id: "att-rex-001",
          name: "heat_exchanger_cleaning_report.pdf",
          type: "application/pdf",
          size: 1876543,
          url: "/attachments/heat_exchanger_cleaning_report.pdf",
          uploadedAt: new Date("2025-01-26T17:30:00"),
          uploadedBy: "Youssef Alami",
        },
      ],
      createdBy: "Youssef Alami",
      createdAt: new Date("2025-01-26T17:00:00"),
    },
    changeHistory: [
      {
        id: "ch-003",
        field: "status",
        oldValue: "new",
        newValue: "in-progress",
        changedBy: "Youssef Alami",
        changedAt: new Date("2025-01-24T11:00:00"),
      },
      {
        id: "ch-004",
        field: "status",
        oldValue: "in-progress",
        newValue: "resolved",
        changedBy: "Youssef Alami",
        changedAt: new Date("2025-01-26T16:00:00"),
      },
    ],
    tags: ["cooling", "temperature", "efficiency", "heat-exchanger", "common"],
  },
  {
    id: 3,
    title: "Safety valve SV-125 failed lift pressure test",
    description:
      "During monthly safety valve testing on HRSG-01 superheater section, safety valve SV-125 (set pressure 180 bar) failed to lift at the required test pressure of 183.6 bar (102% of set pressure). Valve eventually lifted at 195 bar, representing an 8.3% overpressure condition. This exceeds ASME acceptable tolerance of ±3% and poses a serious safety risk.",
    type: "safety",
    equipment: mockEquipment[3],
    detectionDate: new Date("2025-01-27T08:00:00"),
    origin: "inspection",
    responsiblePerson: "Laila Bennani",
    responsibleSection: "Pressure Systems Safety",
    workOrderReference: "WO-2025-003",
    unit: "U3",
    currentSystemStatus: "Online - Safety Review",
    status: "pending-approval",
    criticalityAssessment: {
      safety: 3, // Major risk - safety system failure
      availability: 2, // Partial impact - requires shutdown for repair
      score: 6, // 3 × 2
      level: "high",
      reasoning:
        "Safety valve failure poses major safety risk, requires scheduled shutdown for replacement",
    },
    priority: 2,
    maintenanceWindow: mockMaintenanceWindows[0],
    attachments: [
      {
        id: "att-004",
        name: "safety_valve_test_results_SV125.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 157890,
        url: "/attachments/safety_valve_test_results_SV125.xlsx",
        uploadedAt: new Date("2025-01-27T08:30:00"),
        uploadedBy: "Laila Bennani",
      },
      {
        id: "att-005",
        name: "valve_inspection_photos.zip",
        type: "application/zip",
        size: 5678901,
        url: "/attachments/valve_inspection_photos.zip",
        uploadedAt: new Date("2025-01-27T10:00:00"),
        uploadedBy: "Mohamed Fassi",
      },
    ],
    comments: [
      {
        id: "com-004",
        content:
          "Safety valve failure confirmed. Visual inspection shows valve seat damage and spring corrosion. Immediate replacement required. Unit operation permitted under continuous monitoring until scheduled shutdown.",
        author: "Laila Bennani - Safety Engineer",
        createdAt: new Date("2025-01-27T09:00:00"),
      },
      {
        id: "com-005",
        content:
          "Replacement valve ordered as emergency procurement. Delivery expected within 5 days. Coordination with operations for next available shutdown window.",
        author: "Mohamed Fassi - Maintenance Planner",
        createdAt: new Date("2025-01-27T14:00:00"),
      },
    ],
    changeHistory: [
      {
        id: "ch-005",
        field: "status",
        oldValue: "new",
        newValue: "waiting-unit-shutdown",
        changedBy: "Laila Bennani",
        changedAt: new Date("2025-01-27T09:30:00"),
        reason:
          "Valve replacement requires unit shutdown - awaiting maintenance window",
      },
    ],
    tags: ["safety", "pressure-relief", "inspection", "HRSG", "u3"],
  },
  {
    id: "an-004",
    title: "Generator exciter bearing oil temperature trending upward",
    description:
      "Generator GEN-01 exciter bearing oil temperature has shown a gradual increase over the past 7 days, from normal operating temperature of 55°C to current reading of 62°C. While still within design limits (max 70°C), the consistent upward trend suggests potential lubrication degradation or cooling system reduction.",
    type: "mechanical",
    equipment: mockEquipment[2],
    detectionDate: new Date("2025-01-26T12:00:00"),
    origin: "monitoring-system",
    responsiblePerson: "Omar Fassi",
    responsibleSection: "Electrical Maintenance",
    workOrderReference: "WO-2025-004",
    unit: "U3",
    currentSystemStatus: "Online - Enhanced Monitoring",
    status: "in-progress",
    criticalityAssessment: {
      safety: 1, // No immediate risk
      availability: 2, // Potential performance impact
      score: 2, // 1 × 2
      level: "low",
      reasoning:
        "Early trending indicator, no immediate impact but requires monitoring",
    },
    priority: 4,
    attachments: [],
    comments: [
      {
        id: "com-006",
        content:
          "Oil analysis scheduled for tomorrow morning. Increased monitoring frequency to every 4 hours. Will track trend and compare with historical data patterns.",
        author: "Omar Fassi - Electrical Engineer",
        createdAt: new Date("2025-01-26T13:00:00"),
      },
    ],
    changeHistory: [],
    tags: ["oil-temperature", "trending", "bearing", "generator", "u3"],
  },
  {
    id: "an-005",
    title: "Main transformer cooling fan F-02 failed to start",
    description:
      "During routine transformer monitoring, cooling fan F-02 on transformer TR-01 failed to start automatically when oil temperature reached 65°C trigger point. Manual start attempt was unsuccessful. Transformer oil temperature has continued to rise to 68°C, approaching the 75°C alarm limit. Backup fans are operating normally.",
    type: "electrical",
    equipment: mockEquipment[5],
    detectionDate: new Date("2025-01-27T16:45:00"),
    origin: "monitoring-system",
    responsiblePerson: "Nadia El Mansouri",
    responsibleSection: "Electrical Maintenance",
    workOrderReference: "WO-2025-005",
    unit: "U3",
    currentSystemStatus: "Online - Degraded Cooling",
    status: "in-progress",
    criticalityAssessment: {
      safety: 2, // Minor risk if temperature continues rising
      availability: 2, // Partial performance reduction potential
      score: 4, // 2 × 2
      level: "medium",
      reasoning:
        "Reduced cooling capacity affects transformer reliability and loading capability",
    },
    priority: 3,
    attachments: [
      {
        id: "att-006",
        name: "transformer_temperature_log.csv",
        type: "text/csv",
        size: 45678,
        url: "/attachments/transformer_temperature_log.csv",
        uploadedAt: new Date("2025-01-27T17:00:00"),
        uploadedBy: "Nadia El Mansouri",
      },
    ],
    comments: [
      {
        id: "com-007",
        content:
          "Initial inspection shows motor control circuit fault. Testing contactors and thermal relays. May require motor replacement if windings are damaged.",
        author: "Nadia El Mansouri - Electrical Technician",
        createdAt: new Date("2025-01-27T18:00:00"),
      },
    ],
    changeHistory: [
      {
        id: "ch-006",
        field: "status",
        oldValue: "new",
        newValue: "in-progress",
        changedBy: "Nadia El Mansouri",
        changedAt: new Date("2025-01-27T17:30:00"),
        reason: "Electrical troubleshooting initiated",
      },
    ],
    tags: ["cooling-fan", "transformer", "electrical", "temperature", "u3"],
  },
];

export const mockDashboard: Dashboard = {
  totalAnomalies: 47,
  openAnomalies: 28,
  criticalAnomalies: 3,
  highPriorityAnomalies: 7,
  averageResolutionTime: 4.2,
  anomaliesByStatus: {
    new: 8,
    "in-progress": 12,
    "pending-approval": 1,
    resolved: 16,
    closed: 2,
    cancelled: 1,
  } as Record<AnomalyStatus, number>,
  anomaliesByCriticality: {
    "very-low": 5,
    low: 22,
    medium: 12,
    high: 7,
    critical: 3,
  } as Record<CriticalityLevel, number>,
  anomaliesByUnit: {
    U3: 35,
    U2: 8,
    Common: 4,
  },
  safetyImpactMetrics: {
    noRisk: 32, // Safety Level 1
    minorRisk: 12, // Safety Level 2
    majorRisk: 5, // Safety Level 3
  },
  availabilityImpactMetrics: {
    noImpact: 18, // Availability Level 1
    partialImpact: 21, // Availability Level 2
    significantImpact: 8, // Availability Level 3
  },
  trendAnalysis: {
    thisMonth: 47,
    lastMonth: 52,
    percentageChange: -9.6,
  },
  recentAnomalies: mockAnomalies.slice(0, 5),
  upcomingMaintenance: mockMaintenanceWindows,
  maintenanceWindowUtilization: 85.2,
};

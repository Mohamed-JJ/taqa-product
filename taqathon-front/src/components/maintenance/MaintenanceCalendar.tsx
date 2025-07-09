import { useNavigate } from "react-router-dom";
import { Clock, AlertCircle, Settings } from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { useMaintenanceStore } from "@/(zustand)/useMaintenanceStore";
import { getStatus } from "./types";
import "@/components/calendar-styles.css";

export const MaintenanceCalendar = () => {
  const navigate = useNavigate();
  const { maintenanceWindows, setSelectedMaintenanceWindow } =
    useMaintenanceStore();

  const calendarEvents = maintenanceWindows.map((window: any) => {
    const status = getStatus(window);
    let color = "#3b82f6"; // Default blue

    if (status === "in-progress") {
      color = "#f59e0b"; // Orange
    } else if (status === "completed") {
      color = "#10b981"; // Green
    } else if (status === "scheduled") {
      color = "#6366f1"; // Indigo
    }

    return {
      id: window.id,
      title: window.title,
      start: window.scheduleStart,
      end: window.scheduleEnd,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        status,
        anomaliesCount: window.anomalies?.length || 0,
        estimatedHours:
          window.anomalies?.reduce(
            (total: number, anomaly: any) =>
              total + (anomaly.estimatedTime || 0),
            0,
          ) || 0,
        window,
      },
    };
  });

  const handleEventClick = (clickInfo: any) => {
    const window = clickInfo.event.extendedProps.window;
    setSelectedMaintenanceWindow(window);
    navigate(`/maintenance/details/${window.id}`);
  };

  return (
    <div className="h-[700px] modern-calendar w-full">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={calendarEvents}
        eventClick={handleEventClick}
        height="100%"
        eventDisplay="block"
        dayMaxEvents={false}
        eventMinHeight={60}
        eventShortHeight={60}
        eventOverlap={false}
        slotEventOverlap={false}
        eventConstraint={{
          start: "00:00",
          end: "24:00",
        }}
        eventClassNames={(arg) => {
          return [`status-${arg.event.extendedProps.status}`];
        }}
        eventDidMount={(info) => {
          // Add detailed tooltip content
          const { status, anomaliesCount, estimatedHours, window } =
            info.event.extendedProps;
          const criticalCount =
            window.anomalies?.filter((a: any) => a.criticality > 12).length ||
            0;
          const shutdownRequired =
            window.anomalies?.filter((a: any) => a.sysShutDownRequired)
              .length || 0;
          const equipmentList = [
            ...new Set(window.anomalies?.map((a: any) => a.equipment) || []),
          ];

          const tooltipContent = [
            `Title: ${window.title}`,
            `Status: ${status}`,
            `Anomalies: ${anomaliesCount}`,
            estimatedHours > 0 ? `Estimated Work: ${estimatedHours}h` : "",
            criticalCount > 0 ? `Critical Issues: ${criticalCount}` : "",
            shutdownRequired > 0
              ? `Shutdown Required: ${shutdownRequired}`
              : "",
            equipmentList.length > 0
              ? `Equipment: ${equipmentList.slice(0, 3).join(", ")}${equipmentList.length > 3 ? "..." : ""}`
              : "",
            `Duration: ${new Date(window.scheduleStart).toLocaleDateString()} - ${new Date(window.scheduleEnd).toLocaleDateString()}`,
          ]
            .filter(Boolean)
            .join("\n");

          info.el.title = tooltipContent;
          info.el.setAttribute("data-status", status);
        }}
        eventContent={(eventInfo) => {
          const { status, anomaliesCount, estimatedHours, window } =
            eventInfo.event.extendedProps;
          const criticalCount =
            window.anomalies?.filter((a: any) => a.criticality > 12).length ||
            0;
          const shutdownRequired =
            window.anomalies?.filter((a: any) => a.sysShutDownRequired)
              .length || 0;
          const isYearView = eventInfo.view.type === "multiMonth";

          if (isYearView) {
            // Simple year view - return plain string to avoid any JSX complications
            return eventInfo.event.title;
          }

          // Professional detailed view for month/week/day
          return (
            <div className="h-full p-2 space-y-1">
              {/* Event Header */}
              <div className="font-medium text-white text-xs leading-tight truncate">
                {eventInfo.event.title}
              </div>

              {/* Event Meta */}
              <div className="flex items-center justify-between text-xs">
                <span className="capitalize text-white/90 font-medium">
                  {status.replace("-", " ")}
                </span>
                {anomaliesCount > 0 && (
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-white font-medium">
                    {anomaliesCount}
                  </span>
                )}
              </div>

              {/* Event Details */}
              {(estimatedHours > 0 ||
                criticalCount > 0 ||
                shutdownRequired > 0) && (
                <div className="flex items-center gap-1 text-xs text-white/90">
                  {estimatedHours > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {estimatedHours}h
                    </span>
                  )}
                  {criticalCount > 0 && (
                    <span className="flex items-center gap-1 text-red-200">
                      <AlertCircle className="h-3 w-3" />
                      {criticalCount}
                    </span>
                  )}
                  {shutdownRequired > 0 && (
                    <span className="flex items-center gap-1 text-orange-200">
                      <Settings className="h-3 w-3" />
                      {shutdownRequired}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        }}
        firstDay={1} // Start week on Monday
        weekends={true}
        selectable={false}
        selectMirror={true}
        weekNumbers={false}
        navLinks={true}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: "08:00",
          endTime: "18:00",
        }}
        views={{
          multiMonthYear: {
            type: "multiMonth",
            duration: { months: 12 },
            titleFormat: { year: "numeric" },
            buttonText: "Year",
            eventMinHeight: 30,
          },
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "long" },
            eventMinHeight: 60,
          },
          timeGridWeek: {
            titleFormat: { year: "numeric", month: "short", day: "numeric" },
            eventMinHeight: 40,
            allDaySlot: true,
            allDayText: "Maintenance",
            slotEventOverlap: false,
            eventOverlap: false,
          },
          timeGridDay: {
            titleFormat: {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            },
            eventMinHeight: 40,
            allDaySlot: true,
            allDayText: "Maintenance Windows",
            slotEventOverlap: false,
            eventOverlap: false,
          },
        }}
        multiMonthMaxColumns={3}
        multiMonthMinWidth={250}
        initialDate={new Date()}
      />
    </div>
  );
}; 
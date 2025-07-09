import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useCalendarTranslations, getCalendarLocale } from "@/i18n/hooks/useTranslations";
import { useLanguage } from "@/i18n/LanguageContext";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const calendarT = useCalendarTranslations();
  const { language, isRTL } = useLanguage();

  // Week starts on different days based on locale
  const weekStartsOn = language === 'ar' ? 6 : 1; // Saturday for Arabic, Monday for others

  // Create locale-specific labels  
  const labels = {
    labelPrevious: () => calendarT.previousMonth,
    labelNext: () => calendarT.nextMonth,
    labelMonthDropdown: () => calendarT.selectDate,
    labelYearDropdown: () => calendarT.selectDate,
  };

  // Create weekday labels array
  const weekdayLabels = [
    calendarT.weekdaysShort.sun,
    calendarT.weekdaysShort.mon,
    calendarT.weekdaysShort.tue,
    calendarT.weekdaysShort.wed,
    calendarT.weekdaysShort.thu,
    calendarT.weekdaysShort.fri,
    calendarT.weekdaysShort.sat,
  ];

  // Format month names
  const formatMonthCaption = (date: Date) => {
    const monthNames = [
      calendarT.months.january,
      calendarT.months.february,
      calendarT.months.march,
      calendarT.months.april,
      calendarT.months.may,
      calendarT.months.june,
      calendarT.months.july,
      calendarT.months.august,
      calendarT.months.september,
      calendarT.months.october,
      calendarT.months.november,
      calendarT.months.december,
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      dir={isRTL ? "rtl" : "ltr"}
      weekStartsOn={weekStartsOn as 0 | 1 | 2 | 3 | 4 | 5 | 6}
      labels={labels}
      formatters={{
        formatMonthCaption,
        formatWeekdayName: (date: Date) => {
          return weekdayLabels[date.getDay()];
        },
      }}
      classNames={{
        months: `flex flex-col sm:flex-row space-y-4 ${isRTL ? 'sm:space-x-reverse' : 'sm:space-x-4'} sm:space-y-0`,
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: `${isRTL ? 'space-x-reverse' : 'space-x-1'} flex items-center`,
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: `absolute ${isRTL ? 'right-1' : 'left-1'}`,
        nav_button_next: `absolute ${isRTL ? 'left-1' : 'right-1'}`,
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

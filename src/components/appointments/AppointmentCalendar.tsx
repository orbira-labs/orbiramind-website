"use client";

import { useState, useMemo } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths,
  isWeekend
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { clsx } from "clsx";
import { useCalendarAppointments } from "@/lib/hooks/useCalendarAppointments";
import type { AppointmentSlim } from "./AppointmentDetailModal";

interface AppointmentCalendarProps {
  onSelectAppointment: (apt: AppointmentSlim) => void;
  onCreateAppointment: (date?: Date) => void;
  onRefreshNeeded?: () => void;
}

const WEEKDAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const WEEKDAYS_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export function AppointmentCalendar({ 
  onSelectAppointment, 
  onCreateAppointment,
  onRefreshNeeded,
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { appointments, loading, refresh } = useCalendarAppointments(currentMonth);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, AppointmentSlim[]>();
    appointments.forEach(apt => {
      const dateKey = format(new Date(apt.starts_at), "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(apt as AppointmentSlim);
    });
    map.forEach((apts) => {
      apts.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
    });
    return map;
  }, [appointments]);

  const numWeeks = calendarDays.length / 7;

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getStatusStyle = (status: AppointmentSlim["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-[#D4856A] text-white";
      case "completed":
        return "bg-emerald-500 text-white";
      case "cancelled":
        return "bg-red-100 text-red-600 line-through";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#E5E0DB]/60 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E5E0DB]/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-[#2D3436] capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: tr })}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium text-[#D4856A] bg-[#D4856A]/10 hover:bg-[#D4856A]/15 rounded-lg transition-colors"
          >
            Bugün
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg text-[#6B7C85] hover:text-[#2D3436] hover:bg-[#F5F3EF] transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg text-[#6B7C85] hover:text-[#2D3436] hover:bg-[#F5F3EF] transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-[#E5E0DB]/50">
        {WEEKDAYS.map((day, i) => (
          <div 
            key={day} 
            className={clsx(
              "py-3 text-center text-xs font-semibold border-r border-[#E5E0DB]/40 last:border-r-0",
              i >= 5 ? "text-[#9CAAAF] bg-[#FAFAF7]" : "text-[#6B7C85]"
            )}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 min-h-0">
        <div
          className="h-full grid grid-cols-7"
          style={{ gridTemplateRows: `repeat(${numWeeks}, minmax(0, 1fr))` }}
        >
          {calendarDays.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayAppointments = appointmentsByDate.get(dateKey) || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isDayToday = isToday(day);
            const isWeekendDay = isWeekend(day);
            const rowIndex = Math.floor(index / 7);
            const isLastRow = rowIndex === numWeeks - 1;

            return (
              <div
                key={index}
                className={clsx(
                  "relative border-r border-b border-[#E5E0DB]/40 transition-colors group",
                  index % 7 === 6 && "border-r-0",
                  isLastRow && "border-b-0",
                  !isCurrentMonth && "bg-[#FAFAF7]",
                  isCurrentMonth && isDayToday && "bg-emerald-50",
                  isCurrentMonth && !isDayToday && isWeekendDay && "bg-[#FDFCFB]",
                  isCurrentMonth && !isDayToday && !isWeekendDay && "bg-white hover:bg-[#FDF8F6]"
                )}
              >
                {/* Gün Header */}
                <div className="flex items-center justify-between p-2 pb-1">
                  <span
                    className={clsx(
                      "inline-flex items-center justify-center h-7 w-7 rounded-full text-sm font-medium transition-all",
                      isDayToday && "text-emerald-700 font-semibold",
                      !isDayToday && isCurrentMonth && "text-[#2D3436]",
                      !isDayToday && !isCurrentMonth && "text-[#C4C4C4]"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  
                  {/* Quick Add - hover'da görünür */}
                  {isCurrentMonth && (
                    <button
                      onClick={() => onCreateAppointment(day)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-[#9CAAAF] hover:text-[#D4856A] hover:bg-[#D4856A]/10 transition-all"
                      title="Randevu ekle"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Randevular */}
                <div className="px-1.5 pb-1.5 space-y-0.5 overflow-hidden">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => onSelectAppointment(apt)}
                      className={clsx(
                        "w-full text-left px-2 py-1 rounded text-[11px] font-medium truncate transition-transform hover:scale-[1.02]",
                        getStatusStyle(apt.status)
                      )}
                      title={`${format(new Date(apt.starts_at), "HH:mm")} - ${apt.client?.first_name} ${apt.client?.last_name}`}
                    >
                      <span className="font-semibold">{format(new Date(apt.starts_at), "HH:mm")}</span>
                      <span className="ml-1 opacity-90">{apt.client?.first_name}</span>
                    </button>
                  ))}
                  
                  {dayAppointments.length > 3 && (
                    <button
                      onClick={() => {
                        const firstApt = dayAppointments[0];
                        if (firstApt) onSelectAppointment(firstApt);
                      }}
                      className="w-full text-center text-[10px] text-[#D4856A] hover:text-[#C97B5D] font-medium py-0.5"
                    >
                      +{dayAppointments.length - 3} daha
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-[#E5E0DB]/50 flex items-center gap-6 text-xs bg-[#FAFAF7]">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-[#D4856A]" />
          <span className="text-[#6B7C85]">Planlandı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-500" />
          <span className="text-[#6B7C85]">Tamamlandı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-red-200 border border-red-300" />
          <span className="text-[#6B7C85]">İptal</span>
        </div>
      </div>
    </div>
  );
}

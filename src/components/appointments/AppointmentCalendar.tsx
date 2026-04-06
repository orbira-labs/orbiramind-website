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
  isSameDay, 
  isToday,
  addMonths,
  subMonths
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { clsx } from "clsx";
import type { AppointmentSlim } from "./AppointmentDetailModal";

interface AppointmentCalendarProps {
  appointments: AppointmentSlim[];
  onSelectAppointment: (apt: AppointmentSlim) => void;
  onCreateAppointment: (date?: Date) => void;
}

const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export function AppointmentCalendar({ 
  appointments, 
  onSelectAppointment, 
  onCreateAppointment 
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
      map.get(dateKey)!.push(apt);
    });
    map.forEach((apts) => {
      apts.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
    });
    return map;
  }, [appointments]);

  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const getStatusColor = (status: AppointmentSlim["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-[var(--pro-appointment)] text-white";
      case "completed":
        return "bg-pro-success/20 text-pro-success border border-pro-success/30";
      case "cancelled":
        return "bg-pro-danger/20 text-pro-danger border border-pro-danger/30 line-through";
      default:
        return "bg-pro-surface-alt text-pro-text";
    }
  };

  return (
    <div className="bg-pro-surface rounded-2xl border border-pro-border overflow-hidden">
      {/* Calendar Header */}
      <div className="px-4 py-4 border-b border-pro-border bg-pro-surface-alt/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-pro-text capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: tr })}
            </h2>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-xs font-medium text-pro-primary bg-pro-primary-light/50 hover:bg-pro-primary-light rounded-lg transition-colors"
            >
              Bugün
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg text-pro-text-secondary hover:text-pro-text hover:bg-pro-surface-alt transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg text-pro-text-secondary hover:text-pro-text hover:bg-pro-surface-alt transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-pro-border bg-pro-surface-alt/30">
        {WEEKDAYS.map((day) => (
          <div 
            key={day} 
            className="py-3 text-center text-xs font-semibold text-pro-text-secondary uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayAppointments = appointmentsByDate.get(dateKey) || [];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isDayToday = isToday(day);

          return (
            <div
              key={index}
              className={clsx(
                "min-h-[120px] border-b border-r border-pro-border/50 p-2 transition-colors group",
                !isCurrentMonth && "bg-pro-surface-alt/30",
                isDayToday && "bg-pro-primary-light/70 border-l-2 border-l-pro-primary",
                isCurrentMonth && !isDayToday && "bg-pro-surface hover:bg-pro-surface-alt/20",
                index % 7 === 6 && "border-r-0"
              )}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={clsx(
                    "inline-flex items-center justify-center h-7 w-7 rounded-full text-sm font-medium transition-colors",
                    isDayToday && "bg-pro-primary text-white",
                    !isDayToday && isCurrentMonth && "text-pro-text",
                    !isDayToday && !isCurrentMonth && "text-pro-text-tertiary"
                  )}
                >
                  {format(day, "d")}
                </span>
                
                {/* Quick add button - shows on hover */}
                {isCurrentMonth && (
                  <button
                    onClick={() => onCreateAppointment(day)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-pro-text-tertiary hover:text-pro-primary hover:bg-pro-primary-light/50 transition-all"
                    title="Randevu ekle"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Appointments */}
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => onSelectAppointment(apt)}
                    className={clsx(
                      "w-full text-left px-2 py-1 rounded-md text-[11px] font-medium truncate transition-all hover:scale-[1.02] hover:shadow-sm",
                      getStatusColor(apt.status)
                    )}
                    title={`${format(new Date(apt.starts_at), "HH:mm")} - ${apt.client?.first_name} ${apt.client?.last_name}`}
                  >
                    <span className="font-bold mr-1">
                      {format(new Date(apt.starts_at), "HH:mm")}
                    </span>
                    <span className="opacity-90">
                      {apt.client?.first_name}
                    </span>
                  </button>
                ))}
                
                {dayAppointments.length > 3 && (
                  <button
                    onClick={() => {
                      const firstApt = dayAppointments[0];
                      if (firstApt) onSelectAppointment(firstApt);
                    }}
                    className="w-full text-center text-[10px] text-pro-text-tertiary hover:text-pro-primary py-0.5 transition-colors"
                  >
                    +{dayAppointments.length - 3} daha
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-pro-border bg-pro-surface-alt/30 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-[var(--pro-appointment)]" />
          <span className="text-pro-text-secondary">Planlandı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-pro-success/50 border border-pro-success/50" />
          <span className="text-pro-text-secondary">Tamamlandı</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-pro-danger/30 border border-pro-danger/30" />
          <span className="text-pro-text-secondary">İptal</span>
        </div>
      </div>
    </div>
  );
}

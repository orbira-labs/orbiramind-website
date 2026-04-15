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
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  isWeekend,
  isBefore,
  startOfDay
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar } from "lucide-react";
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
const WEEKDAYS_MOBILE = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];

export function AppointmentCalendar({ 
  onSelectAppointment, 
  onCreateAppointment,
  onRefreshNeeded,
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

  const goToPreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    const today = new Date();
    if (isSameMonth(newMonth, today)) {
      setSelectedDate(today);
    } else {
      setSelectedDate(startOfMonth(newMonth));
    }
  };
  
  const goToNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    const today = new Date();
    if (isSameMonth(newMonth, today)) {
      setSelectedDate(today);
    } else {
      setSelectedDate(startOfMonth(newMonth));
    }
  };
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

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

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const selectedDayAppointments = appointmentsByDate.get(selectedDateKey) || [];

  const mobileWeekDays = useMemo(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [selectedDate]);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          DESKTOP CALENDAR - Tam takvim grid
          ══════════════════════════════════════════════════════════ */}
      <div className="desktop-only h-full flex flex-col bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#E5E0DB]/60 overflow-hidden">
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
              const isPastDay = isBefore(startOfDay(day), startOfDay(new Date()));

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
                    
                    {/* Quick Add - hover'da görünür, geçmiş günlerde gizli */}
                    {isCurrentMonth && !isPastDay && (
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

      {/* ══════════════════════════════════════════════════════════
          MOBILE CALENDAR - Haftalık kompakt görünüm + günlük liste
          ══════════════════════════════════════════════════════════ */}
      <div className="mobile-only flex flex-col h-full">
        {/* Mobile Month Header */}
        <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-pro-border">
          <button
            onClick={goToPreviousMonth}
            className="p-2 -ml-2 rounded-lg text-pro-text-secondary active:bg-pro-surface-alt transition-colors touch-manipulation"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-pro-text capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: tr })}
            </h2>
            <button
              onClick={goToToday}
              className="px-2 py-1 text-xs font-medium text-[#D4856A] bg-[#D4856A]/10 rounded-md touch-manipulation"
            >
              Bugün
            </button>
          </div>
          <button
            onClick={goToNextMonth}
            className="p-2 -mr-2 rounded-lg text-pro-text-secondary active:bg-pro-surface-alt transition-colors touch-manipulation"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Week Selector */}
        <div className="bg-white border-b border-pro-border">
          {loading ? (
            <div className="grid grid-cols-7 gap-1 px-3 py-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center py-2">
                  <div className="h-3 w-5 bg-pro-border/50 rounded animate-pulse mb-1" />
                  <div className="h-5 w-5 bg-pro-border/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-7 gap-1 px-3 py-2">
            {mobileWeekDays.map((day, i) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayAppointments = appointmentsByDate.get(dateKey) || [];
              const isDayToday = isToday(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={clsx(
                    "flex flex-col items-center py-2 rounded-xl transition-all touch-manipulation",
                    isSelected && "bg-pro-primary text-white",
                    !isSelected && isDayToday && "bg-emerald-100",
                    !isSelected && !isDayToday && "active:bg-pro-surface-alt"
                  )}
                >
                  <span className={clsx(
                    "text-[10px] font-medium mb-1",
                    isSelected ? "text-white/80" : "text-pro-text-tertiary"
                  )}>
                    {WEEKDAYS_MOBILE[i]}
                  </span>
                  <span className={clsx(
                    "text-sm font-semibold",
                    isSelected ? "text-white" : isDayToday ? "text-emerald-700" : !isCurrentMonth ? "text-pro-text-tertiary" : "text-pro-text"
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayAppointments.length > 0 && !isSelected && (
                    <div className="flex gap-0.5 mt-1">
                      {dayAppointments.slice(0, 3).map((_, idx) => (
                        <div key={idx} className="h-1 w-1 rounded-full bg-[#D4856A]" />
                      ))}
                    </div>
                  )}
                  {dayAppointments.length > 0 && isSelected && (
                    <span className="text-[10px] text-white/80 mt-0.5">{dayAppointments.length}</span>
                  )}
                </button>
              );
            })}
          </div>
          )}
        </div>

        {/* Mobile Selected Day Header */}
        <div className="px-4 py-3 bg-pro-surface-alt flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-pro-text">
              {format(selectedDate, "d MMMM, EEEE", { locale: tr })}
            </p>
            <p className="text-xs text-pro-text-secondary">
              {selectedDayAppointments.length} randevu
            </p>
          </div>
          {!isBefore(startOfDay(selectedDate), startOfDay(new Date())) && (
            <button
              onClick={() => onCreateAppointment(selectedDate)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pro-primary text-white text-sm font-medium touch-manipulation active:scale-95 transition-transform"
            >
              <Plus className="h-4 w-4" />
              Ekle
            </button>
          )}
        </div>

        {/* Mobile Day Appointments List */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAF7]">
          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="mobile-card flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-pro-border/30 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-pro-border/30 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-pro-border/30 rounded animate-pulse" />
                  </div>
                  <div className="h-2 w-2 rounded-full bg-pro-border/30 animate-pulse" />
                </div>
              ))}
            </div>
          ) : selectedDayAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="h-14 w-14 rounded-full bg-pro-surface flex items-center justify-center mb-3">
                <Calendar className="h-7 w-7 text-pro-text-tertiary" />
              </div>
              <p className="text-sm font-medium text-pro-text mb-1">Bu günde randevu yok</p>
              {!isBefore(startOfDay(selectedDate), startOfDay(new Date())) ? (
                <>
                  <p className="text-xs text-pro-text-tertiary mb-4">Yeni bir randevu ekleyebilirsiniz</p>
                  <button
                    onClick={() => onCreateAppointment(selectedDate)}
                    className="mobile-btn min-h-[48px] flex items-center justify-center gap-2 px-6 rounded-xl bg-pro-primary text-white text-sm font-medium touch-manipulation"
                  >
                    <Plus className="h-5 w-5" />
                    Randevu Ekle
                  </button>
                </>
              ) : (
                <p className="text-xs text-pro-text-tertiary">Geçmiş günlere randevu eklenemez</p>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {selectedDayAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onSelectAppointment(apt)}
                  className="w-full mobile-card flex items-center gap-3 touch-manipulation active:scale-[0.98] transition-transform"
                >
                  {/* Time Badge */}
                  <div className={clsx(
                    "flex flex-col items-center justify-center w-14 h-14 rounded-xl",
                    apt.status === "scheduled" && "bg-[#D4856A]/10",
                    apt.status === "completed" && "bg-emerald-100",
                    apt.status === "cancelled" && "bg-red-100"
                  )}>
                    <Clock className={clsx(
                      "h-4 w-4 mb-0.5",
                      apt.status === "scheduled" && "text-[#D4856A]",
                      apt.status === "completed" && "text-emerald-600",
                      apt.status === "cancelled" && "text-red-500"
                    )} />
                    <span className={clsx(
                      "text-sm font-bold",
                      apt.status === "scheduled" && "text-[#D4856A]",
                      apt.status === "completed" && "text-emerald-600",
                      apt.status === "cancelled" && "text-red-500 line-through"
                    )}>
                      {format(new Date(apt.starts_at), "HH:mm")}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-pro-text truncate">
                      {apt.client?.first_name} {apt.client?.last_name}
                    </p>
                    <p className="text-xs text-pro-text-secondary mt-0.5">
                      {apt.duration_minutes} dakika
                    </p>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className={clsx(
                    "h-2 w-2 rounded-full shrink-0",
                    apt.status === "scheduled" && "bg-[#D4856A]",
                    apt.status === "completed" && "bg-emerald-500",
                    apt.status === "cancelled" && "bg-red-400"
                  )} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { SidebarBrand } from "./SidebarBrand";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FlaskConical,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useProContext } from "@/lib/context";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Ofisim", icon: LayoutDashboard, accent: false },
  { href: "/clients", label: "Danışanlar", icon: Users, accent: false },
  { href: "/appointments", label: "Randevular", icon: Calendar, accent: false },
  { href: "/tests", label: "Analizler", icon: FlaskConical, accent: true },
  { href: "/billing", label: "Satın Al", icon: CreditCard, accent: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { professional, signOut } = useProContext();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <aside
      className={clsx(
        "hidden lg:flex flex-col relative",
        "h-screen sticky top-0 transition-all duration-200",
        "bg-[#5B7B6A]",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "relative z-[1] shrink-0 flex items-center h-[68px] px-4",
          "border-b border-white/10",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && <SidebarBrand />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors",
            collapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>


      {/* Full neural mesh background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 260 800"
      >
        {/* Dense node grid */}
        <g fill="white">
          {/* Row 1 */}
          <circle cx="30" cy="30" r="2.5" />
          <circle cx="90" cy="20" r="2" />
          <circle cx="160" cy="40" r="2.5" />
          <circle cx="230" cy="25" r="2" />
          {/* Row 2 */}
          <circle cx="20" cy="90" r="2" />
          <circle cx="70" cy="80" r="2.5" />
          <circle cx="130" cy="95" r="2" />
          <circle cx="200" cy="85" r="2.5" />
          <circle cx="250" cy="100" r="2" />
          {/* Row 3 */}
          <circle cx="45" cy="145" r="2.5" />
          <circle cx="110" cy="140" r="2" />
          <circle cx="175" cy="155" r="2.5" />
          <circle cx="240" cy="145" r="2" />
          {/* Row 4 */}
          <circle cx="15" cy="205" r="2" />
          <circle cx="80" cy="200" r="2.5" />
          <circle cx="140" cy="210" r="2" />
          <circle cx="210" cy="195" r="2.5" />
          {/* Row 5 */}
          <circle cx="50" cy="260" r="2.5" />
          <circle cx="120" cy="265" r="2" />
          <circle cx="185" cy="255" r="2.5" />
          <circle cx="245" cy="270" r="2" />
          {/* Row 6 */}
          <circle cx="25" cy="320" r="2" />
          <circle cx="95" cy="315" r="2.5" />
          <circle cx="155" cy="325" r="2" />
          <circle cx="220" cy="310" r="2.5" />
          {/* Row 7 */}
          <circle cx="40" cy="375" r="2.5" />
          <circle cx="105" cy="380" r="2" />
          <circle cx="170" cy="370" r="2.5" />
          <circle cx="235" cy="385" r="2" />
          {/* Row 8 */}
          <circle cx="15" cy="435" r="2" />
          <circle cx="75" cy="440" r="2.5" />
          <circle cx="135" cy="430" r="2" />
          <circle cx="200" cy="445" r="2.5" />
          <circle cx="255" cy="430" r="2" />
          {/* Row 9 */}
          <circle cx="55" cy="495" r="2.5" />
          <circle cx="115" cy="490" r="2" />
          <circle cx="180" cy="500" r="2.5" />
          <circle cx="240" cy="488" r="2" />
          {/* Row 10 */}
          <circle cx="20" cy="550" r="2" />
          <circle cx="85" cy="555" r="2.5" />
          <circle cx="150" cy="545" r="2" />
          <circle cx="215" cy="560" r="2.5" />
          {/* Row 11 */}
          <circle cx="45" cy="610" r="2.5" />
          <circle cx="110" cy="615" r="2" />
          <circle cx="175" cy="605" r="2.5" />
          <circle cx="245" cy="620" r="2" />
          {/* Row 12 */}
          <circle cx="30" cy="670" r="2" />
          <circle cx="95" cy="675" r="2.5" />
          <circle cx="160" cy="665" r="2" />
          <circle cx="225" cy="680" r="2.5" />
          {/* Row 13 */}
          <circle cx="55" cy="730" r="2.5" />
          <circle cx="125" cy="735" r="2" />
          <circle cx="190" cy="725" r="2.5" />
          <circle cx="250" cy="740" r="2" />
          {/* Row 14 */}
          <circle cx="20" cy="785" r="2" />
          <circle cx="80" cy="790" r="2.5" />
          <circle cx="145" cy="780" r="2" />
          <circle cx="210" cy="795" r="2.5" />
        </g>

        {/* Dense connection lines */}
        <g stroke="white" strokeWidth="0.6" fill="none">
          {/* Row 1 → Row 2 */}
          <line x1="30" y1="30" x2="20" y2="90" />
          <line x1="30" y1="30" x2="70" y2="80" />
          <line x1="90" y1="20" x2="70" y2="80" />
          <line x1="90" y1="20" x2="130" y2="95" />
          <line x1="160" y1="40" x2="130" y2="95" />
          <line x1="160" y1="40" x2="200" y2="85" />
          <line x1="230" y1="25" x2="200" y2="85" />
          <line x1="230" y1="25" x2="250" y2="100" />
          {/* Row 2 → Row 3 */}
          <line x1="20" y1="90" x2="45" y2="145" />
          <line x1="70" y1="80" x2="45" y2="145" />
          <line x1="70" y1="80" x2="110" y2="140" />
          <line x1="130" y1="95" x2="110" y2="140" />
          <line x1="130" y1="95" x2="175" y2="155" />
          <line x1="200" y1="85" x2="175" y2="155" />
          <line x1="200" y1="85" x2="240" y2="145" />
          <line x1="250" y1="100" x2="240" y2="145" />
          {/* Row 3 → Row 4 */}
          <line x1="45" y1="145" x2="15" y2="205" />
          <line x1="45" y1="145" x2="80" y2="200" />
          <line x1="110" y1="140" x2="80" y2="200" />
          <line x1="110" y1="140" x2="140" y2="210" />
          <line x1="175" y1="155" x2="140" y2="210" />
          <line x1="175" y1="155" x2="210" y2="195" />
          <line x1="240" y1="145" x2="210" y2="195" />
          {/* Row 4 → Row 5 */}
          <line x1="15" y1="205" x2="50" y2="260" />
          <line x1="80" y1="200" x2="50" y2="260" />
          <line x1="80" y1="200" x2="120" y2="265" />
          <line x1="140" y1="210" x2="120" y2="265" />
          <line x1="140" y1="210" x2="185" y2="255" />
          <line x1="210" y1="195" x2="185" y2="255" />
          <line x1="210" y1="195" x2="245" y2="270" />
          {/* Row 5 → Row 6 */}
          <line x1="50" y1="260" x2="25" y2="320" />
          <line x1="50" y1="260" x2="95" y2="315" />
          <line x1="120" y1="265" x2="95" y2="315" />
          <line x1="120" y1="265" x2="155" y2="325" />
          <line x1="185" y1="255" x2="155" y2="325" />
          <line x1="185" y1="255" x2="220" y2="310" />
          <line x1="245" y1="270" x2="220" y2="310" />
          {/* Row 6 → Row 7 */}
          <line x1="25" y1="320" x2="40" y2="375" />
          <line x1="95" y1="315" x2="40" y2="375" />
          <line x1="95" y1="315" x2="105" y2="380" />
          <line x1="155" y1="325" x2="105" y2="380" />
          <line x1="155" y1="325" x2="170" y2="370" />
          <line x1="220" y1="310" x2="170" y2="370" />
          <line x1="220" y1="310" x2="235" y2="385" />
          {/* Row 7 → Row 8 */}
          <line x1="40" y1="375" x2="15" y2="435" />
          <line x1="40" y1="375" x2="75" y2="440" />
          <line x1="105" y1="380" x2="75" y2="440" />
          <line x1="105" y1="380" x2="135" y2="430" />
          <line x1="170" y1="370" x2="135" y2="430" />
          <line x1="170" y1="370" x2="200" y2="445" />
          <line x1="235" y1="385" x2="200" y2="445" />
          <line x1="235" y1="385" x2="255" y2="430" />
          {/* Row 8 → Row 9 */}
          <line x1="15" y1="435" x2="55" y2="495" />
          <line x1="75" y1="440" x2="55" y2="495" />
          <line x1="75" y1="440" x2="115" y2="490" />
          <line x1="135" y1="430" x2="115" y2="490" />
          <line x1="135" y1="430" x2="180" y2="500" />
          <line x1="200" y1="445" x2="180" y2="500" />
          <line x1="200" y1="445" x2="240" y2="488" />
          <line x1="255" y1="430" x2="240" y2="488" />
          {/* Row 9 → Row 10 */}
          <line x1="55" y1="495" x2="20" y2="550" />
          <line x1="55" y1="495" x2="85" y2="555" />
          <line x1="115" y1="490" x2="85" y2="555" />
          <line x1="115" y1="490" x2="150" y2="545" />
          <line x1="180" y1="500" x2="150" y2="545" />
          <line x1="180" y1="500" x2="215" y2="560" />
          <line x1="240" y1="488" x2="215" y2="560" />
          {/* Row 10 → Row 11 */}
          <line x1="20" y1="550" x2="45" y2="610" />
          <line x1="85" y1="555" x2="45" y2="610" />
          <line x1="85" y1="555" x2="110" y2="615" />
          <line x1="150" y1="545" x2="110" y2="615" />
          <line x1="150" y1="545" x2="175" y2="605" />
          <line x1="215" y1="560" x2="175" y2="605" />
          <line x1="215" y1="560" x2="245" y2="620" />
          {/* Row 11 → Row 12 */}
          <line x1="45" y1="610" x2="30" y2="670" />
          <line x1="45" y1="610" x2="95" y2="675" />
          <line x1="110" y1="615" x2="95" y2="675" />
          <line x1="110" y1="615" x2="160" y2="665" />
          <line x1="175" y1="605" x2="160" y2="665" />
          <line x1="175" y1="605" x2="225" y2="680" />
          <line x1="245" y1="620" x2="225" y2="680" />
          {/* Row 12 → Row 13 */}
          <line x1="30" y1="670" x2="55" y2="730" />
          <line x1="95" y1="675" x2="55" y2="730" />
          <line x1="95" y1="675" x2="125" y2="735" />
          <line x1="160" y1="665" x2="125" y2="735" />
          <line x1="160" y1="665" x2="190" y2="725" />
          <line x1="225" y1="680" x2="190" y2="725" />
          <line x1="225" y1="680" x2="250" y2="740" />
          {/* Row 13 → Row 14 */}
          <line x1="55" y1="730" x2="20" y2="785" />
          <line x1="55" y1="730" x2="80" y2="790" />
          <line x1="125" y1="735" x2="80" y2="790" />
          <line x1="125" y1="735" x2="145" y2="780" />
          <line x1="190" y1="725" x2="145" y2="780" />
          <line x1="190" y1="725" x2="210" y2="795" />
          <line x1="250" y1="740" x2="210" y2="795" />
          {/* Cross-connections for density */}
          <line x1="90" y1="20" x2="20" y2="90" />
          <line x1="160" y1="40" x2="250" y2="100" />
          <line x1="110" y1="140" x2="15" y2="205" />
          <line x1="240" y1="145" x2="245" y2="270" />
          <line x1="25" y1="320" x2="105" y2="380" />
          <line x1="220" y1="310" x2="255" y2="430" />
          <line x1="15" y1="435" x2="115" y2="490" />
          <line x1="240" y1="488" x2="245" y2="620" />
          <line x1="20" y1="550" x2="110" y2="615" />
          <line x1="30" y1="670" x2="125" y2="735" />
          <line x1="225" y1="680" x2="210" y2="795" />
        </g>
      </svg>

      {/* Middle section: nav */}
      <div className="flex flex-1 flex-col min-h-0 relative z-[1]">
        {/* Navigation links */}
        <nav className="shrink-0 py-4 px-2.5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = (pendingHref ?? pathname).startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setPendingHref(item.href)}
                className={clsx(
                  "group relative flex items-center gap-3 rounded-xl transition-all duration-200",
                  collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                  isActive
                    ? item.accent 
                      ? "bg-[#D4856A]/20 text-white font-medium backdrop-blur-sm"
                      : "bg-white/20 text-white font-medium backdrop-blur-sm"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && !collapsed && (
                  <div className={clsx(
                    "absolute left-0 w-[3px] h-5 rounded-r-full",
                    item.accent ? "bg-[#D4856A]" : "bg-[#D4856A]"
                  )} />
                )}
                <item.icon
                  className={clsx(
                    "h-5 w-5 shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110",
                    item.accent && isActive && "text-[#D4856A]"
                  )}
                />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Spacer to push bottom elements down */}
        <div className="flex-1" />
      </div>

      {/* Bottom section - subtle transition from main sidebar */}
      <div className="relative z-[1] shrink-0 bg-[#4A5D52]">
        {/* Subtle top border */}
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
        {/* Settings link */}
        <div className="p-2.5">
          <Link
            href="/settings"
            onClick={() => setPendingHref("/settings")}
            className={clsx(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/70 hover:bg-white/15 hover:text-white transition-all duration-200",
              collapsed && "justify-center px-2",
              (pendingHref ?? pathname).startsWith("/settings") && "bg-white/20 text-white"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="text-sm">Ayarlar</span>}
          </Link>
        </div>

        {/* User block */}
        <div className="border-t border-white/20 p-3.5">
          <div
            className={clsx(
              "flex items-center",
              collapsed ? "justify-center" : "gap-3"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-white/25 text-white text-xs font-semibold flex items-center justify-center">
              {professional
                ? `${professional.first_name.charAt(0)}${professional.last_name.charAt(0)}`
                : "U"}
            </div>
            {!collapsed && professional && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {professional.first_name} {professional.last_name}
                </p>
                <button
                  onClick={signOut}
                  className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1 mt-0.5"
                >
                  <LogOut className="h-3 w-3" />
                  Çıkış yap
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Powered by label */}
        {!collapsed && (
          <div className="relative px-4 pb-3 text-center">
            <span className="text-[10px] text-white/30 tracking-wide">
              Powered by <span className="font-medium text-[#D4856A]">Orbira Labs</span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

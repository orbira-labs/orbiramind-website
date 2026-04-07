"use client";

import { useEffect, useState } from "react";

/**
 * Arka plan dekorasyonu.
 * Önceki versiyonda 200+ SVG elementi + feGaussianBlur filtresi
 * vardı ve GPU-intensive animasyon çalışıyordu. Bu versiyon:
 * - Statik SVG mesh (animasyon yok, blur yok)
 * - CSS radial-gradient ile soft glow efektleri
 * - prefers-reduced-motion: animasyonlar tamamen kapalı
 */
export function PageDecoration() {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
      style={{ contain: "strict" }}
    >
      {/* Soft radial gradients — sadece CSS, GPU dostu */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(91, 123, 106, 0.06) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(91, 123, 106, 0.04) 0%, transparent 40%)",
        }}
      />

      {/* Statik hafif mesh — blur/animasyon yok */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1400 1000"
      >
        {/* Statik bağlantı çizgileri */}
        <g stroke="#5B7B6A" fill="none" opacity="0.07">
          <line x1="40" y1="25" x2="145" y2="72" strokeWidth="1.0" />
          <line x1="40" y1="25" x2="18" y2="125" strokeWidth="0.9" />
          <line x1="145" y1="72" x2="90" y2="155" strokeWidth="1.0" />
          <line x1="145" y1="72" x2="260" y2="42" strokeWidth="0.8" />
          <line x1="145" y1="72" x2="210" y2="178" strokeWidth="0.8" />
          <line x1="18" y1="125" x2="90" y2="155" strokeWidth="0.8" />
          <line x1="90" y1="155" x2="50" y2="250" strokeWidth="0.9" />
          <line x1="90" y1="155" x2="210" y2="178" strokeWidth="0.8" />
          <line x1="260" y1="42" x2="370" y2="80" strokeWidth="0.7" />
          <line x1="210" y1="178" x2="320" y2="165" strokeWidth="0.7" />
          <line x1="210" y1="178" x2="155" y2="295" strokeWidth="0.7" />
          <line x1="50" y1="250" x2="155" y2="295" strokeWidth="0.8" />
          <line x1="320" y1="165" x2="440" y2="200" strokeWidth="0.6" />
          <line x1="370" y1="80" x2="490" y2="58" strokeWidth="0.6" />
          <line x1="155" y1="295" x2="280" y2="290" strokeWidth="0.7" />
          <line x1="280" y1="290" x2="385" y2="325" strokeWidth="0.6" />
          <line x1="440" y1="200" x2="550" y2="168" strokeWidth="0.5" />
          <line x1="490" y1="58" x2="620" y2="95" strokeWidth="0.5" />
          <line x1="550" y1="168" x2="680" y2="210" strokeWidth="0.5" />
          <line x1="620" y1="95" x2="760" y2="78" strokeWidth="0.4" />
          <line x1="680" y1="210" x2="810" y2="240" strokeWidth="0.4" />
          <line x1="760" y1="78" x2="900" y2="115" strokeWidth="0.35" />
          <line x1="810" y1="240" x2="960" y2="225" strokeWidth="0.35" />
          <line x1="900" y1="115" x2="1030" y2="88" strokeWidth="0.3" />
          <line x1="960" y1="225" x2="1100" y2="190" strokeWidth="0.3" />
          <line x1="1030" y1="88" x2="1170" y2="68" strokeWidth="0.25" />
          <line x1="1100" y1="190" x2="1220" y2="215" strokeWidth="0.25" />
          <line x1="385" y1="325" x2="540" y2="475" strokeWidth="0.5" />
          <line x1="540" y1="475" x2="670" y2="455" strokeWidth="0.45" />
          <line x1="670" y1="455" x2="800" y2="505" strokeWidth="0.4" />
          <line x1="800" y1="505" x2="940" y2="465" strokeWidth="0.35" />
          <line x1="940" y1="465" x2="1080" y2="455" strokeWidth="0.3" />
        </g>

        {/* Statik node'lar */}
        <g fill="#5B7B6A" opacity="0.10">
          <circle cx="40" cy="25" r="4" />
          <circle cx="145" cy="72" r="4.5" />
          <circle cx="18" cy="125" r="3.5" />
          <circle cx="90" cy="155" r="4" />
          <circle cx="260" cy="42" r="3.5" />
          <circle cx="210" cy="178" r="4" />
          <circle cx="50" cy="250" r="3.5" />
          <circle cx="155" cy="295" r="3.5" />
          <circle cx="320" cy="165" r="3" />
          <circle cx="370" cy="80" r="3" />
          <circle cx="440" cy="200" r="3" />
          <circle cx="280" cy="290" r="3" />
          <circle cx="490" cy="58" r="3" />
          <circle cx="550" cy="168" r="3" />
          <circle cx="620" cy="95" r="2.5" />
          <circle cx="680" cy="210" r="2.5" />
          <circle cx="760" cy="78" r="2" />
          <circle cx="810" cy="240" r="2" />
          <circle cx="900" cy="115" r="2" />
          <circle cx="960" cy="225" r="2" />
          <circle cx="1030" cy="88" r="1.5" />
          <circle cx="1100" cy="190" r="1.5" />
          <circle cx="1170" cy="68" r="1.2" />
          <circle cx="1220" cy="215" r="1.2" />
          <circle cx="385" cy="325" r="2.5" />
          <circle cx="540" cy="475" r="2.5" />
          <circle cx="670" cy="455" r="2.5" />
          <circle cx="800" cy="505" r="2" />
          <circle cx="940" cy="465" r="2" />
          <circle cx="1080" cy="455" r="1.5" />
        </g>

        {/* Parlayan node'lar — sadece client mount sonrası ve motion tercih yoksa */}
        {mounted && !reduceMotion && (
          <>
            {/* blur filter kullanmadan opacity animasyonu */}
            <circle cx="550" cy="168" r="6" fill="#8B5CF6" opacity="0">
              <animate
                attributeName="opacity"
                values="0;0;0.25;0.25;0;0"
                keyTimes="0;0.65;0.8;0.88;0.97;1"
                dur="14s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="385" cy="325" r="5" fill="#34D399" opacity="0">
              <animate
                attributeName="opacity"
                values="0;0;0.2;0.2;0;0"
                keyTimes="0;0.65;0.8;0.88;0.97;1"
                dur="17s"
                repeatCount="indefinite"
                begin="9s"
              />
            </circle>
            <circle cx="810" cy="240" r="5" fill="#4A90D9" opacity="0">
              <animate
                attributeName="opacity"
                values="0;0;0.2;0.2;0;0"
                keyTimes="0;0.65;0.8;0.88;0.97;1"
                dur="16s"
                repeatCount="indefinite"
                begin="6s"
              />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}

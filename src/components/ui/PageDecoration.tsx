"use client";

export function PageDecoration() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Soft radial gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(91, 123, 106, 0.05) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(91, 123, 106, 0.04) 0%, transparent 40%)",
        }}
      />

      {/* 
        3D perspective neural mesh:
        - Vanishing point roughly at bottom-right
        - Near (top-left): large nodes, thick lines, dense
        - Far (bottom-right): tiny nodes, thin lines, sparse
        - SVG uses perspective-like trapezoid distortion via manual placement
      */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1400 1000"
      >
        {/* ═══ LAYER 1: Static mesh lines ═══ */}
        <g stroke="#5B7B6A" fill="none" opacity="0.10">
          {/* Near zone — thick, dense */}
          <line x1="40" y1="25" x2="145" y2="72" strokeWidth="1.2" />
          <line x1="40" y1="25" x2="18" y2="125" strokeWidth="1.1" />
          <line x1="145" y1="72" x2="90" y2="155" strokeWidth="1.2" />
          <line x1="145" y1="72" x2="260" y2="42" strokeWidth="1" />
          <line x1="145" y1="72" x2="210" y2="178" strokeWidth="1" />
          <line x1="18" y1="125" x2="90" y2="155" strokeWidth="1" />
          <line x1="90" y1="155" x2="50" y2="250" strokeWidth="1.1" />
          <line x1="90" y1="155" x2="210" y2="178" strokeWidth="1" />
          <line x1="260" y1="42" x2="210" y2="178" strokeWidth="0.9" />
          <line x1="260" y1="42" x2="370" y2="80" strokeWidth="0.9" />
          <line x1="210" y1="178" x2="320" y2="165" strokeWidth="0.9" />
          <line x1="210" y1="178" x2="155" y2="295" strokeWidth="0.9" />
          <line x1="50" y1="250" x2="155" y2="295" strokeWidth="1" />
          <line x1="50" y1="250" x2="25" y2="360" strokeWidth="0.9" />
          <line x1="320" y1="165" x2="370" y2="80" strokeWidth="0.8" />
          <line x1="320" y1="165" x2="440" y2="200" strokeWidth="0.8" />
          <line x1="320" y1="165" x2="280" y2="290" strokeWidth="0.8" />
          <line x1="370" y1="80" x2="490" y2="58" strokeWidth="0.8" />
          <line x1="370" y1="80" x2="440" y2="200" strokeWidth="0.8" />
          <line x1="155" y1="295" x2="280" y2="290" strokeWidth="0.9" />
          <line x1="155" y1="295" x2="105" y2="400" strokeWidth="0.8" />
          <line x1="280" y1="290" x2="385" y2="325" strokeWidth="0.8" />
          <line x1="280" y1="290" x2="225" y2="405" strokeWidth="0.8" />
          <line x1="440" y1="200" x2="550" y2="168" strokeWidth="0.7" />
          <line x1="440" y1="200" x2="385" y2="325" strokeWidth="0.7" />
          <line x1="440" y1="200" x2="520" y2="290" strokeWidth="0.7" />

          {/* Mid zone */}
          <line x1="490" y1="58" x2="620" y2="95" strokeWidth="0.7" />
          <line x1="490" y1="58" x2="550" y2="168" strokeWidth="0.6" />
          <line x1="550" y1="168" x2="620" y2="95" strokeWidth="0.6" />
          <line x1="550" y1="168" x2="520" y2="290" strokeWidth="0.7" />
          <line x1="550" y1="168" x2="680" y2="210" strokeWidth="0.6" />
          <line x1="620" y1="95" x2="760" y2="78" strokeWidth="0.55" />
          <line x1="620" y1="95" x2="680" y2="210" strokeWidth="0.55" />
          <line x1="520" y1="290" x2="385" y2="325" strokeWidth="0.7" />
          <line x1="520" y1="290" x2="600" y2="365" strokeWidth="0.6" />
          <line x1="520" y1="290" x2="680" y2="210" strokeWidth="0.6" />
          <line x1="680" y1="210" x2="760" y2="78" strokeWidth="0.5" />
          <line x1="680" y1="210" x2="810" y2="240" strokeWidth="0.55" />
          <line x1="680" y1="210" x2="720" y2="335" strokeWidth="0.55" />
          <line x1="385" y1="325" x2="600" y2="365" strokeWidth="0.6" />
          <line x1="385" y1="325" x2="345" y2="445" strokeWidth="0.55" />
          <line x1="600" y1="365" x2="720" y2="335" strokeWidth="0.55" />
          <line x1="600" y1="365" x2="540" y2="475" strokeWidth="0.55" />
          <line x1="720" y1="335" x2="810" y2="240" strokeWidth="0.5" />
          <line x1="720" y1="335" x2="850" y2="385" strokeWidth="0.5" />
          <line x1="720" y1="335" x2="670" y2="455" strokeWidth="0.5" />
          <line x1="25" y1="360" x2="105" y2="400" strokeWidth="0.7" />
          <line x1="105" y1="400" x2="225" y2="405" strokeWidth="0.7" />
          <line x1="225" y1="405" x2="345" y2="445" strokeWidth="0.6" />
          <line x1="105" y1="400" x2="65" y2="510" strokeWidth="0.6" />
          <line x1="225" y1="405" x2="185" y2="525" strokeWidth="0.6" />

          {/* Far zone — thin, wider spacing */}
          <line x1="760" y1="78" x2="900" y2="115" strokeWidth="0.45" />
          <line x1="760" y1="78" x2="810" y2="240" strokeWidth="0.45" />
          <line x1="900" y1="115" x2="1030" y2="88" strokeWidth="0.4" />
          <line x1="900" y1="115" x2="960" y2="225" strokeWidth="0.4" />
          <line x1="900" y1="115" x2="810" y2="240" strokeWidth="0.4" />
          <line x1="810" y1="240" x2="960" y2="225" strokeWidth="0.4" />
          <line x1="810" y1="240" x2="850" y2="385" strokeWidth="0.4" />
          <line x1="960" y1="225" x2="1030" y2="88" strokeWidth="0.35" />
          <line x1="960" y1="225" x2="1100" y2="190" strokeWidth="0.35" />
          <line x1="960" y1="225" x2="1020" y2="345" strokeWidth="0.4" />
          <line x1="1030" y1="88" x2="1100" y2="190" strokeWidth="0.35" />
          <line x1="1030" y1="88" x2="1170" y2="68" strokeWidth="0.3" />
          <line x1="1100" y1="190" x2="1170" y2="68" strokeWidth="0.3" />
          <line x1="1100" y1="190" x2="1220" y2="215" strokeWidth="0.3" />
          <line x1="1100" y1="190" x2="1140" y2="325" strokeWidth="0.35" />
          <line x1="1100" y1="190" x2="1020" y2="345" strokeWidth="0.35" />
          <line x1="850" y1="385" x2="1020" y2="345" strokeWidth="0.4" />
          <line x1="850" y1="385" x2="800" y2="505" strokeWidth="0.4" />
          <line x1="850" y1="385" x2="940" y2="465" strokeWidth="0.35" />
          <line x1="1020" y1="345" x2="1140" y2="325" strokeWidth="0.35" />
          <line x1="1020" y1="345" x2="940" y2="465" strokeWidth="0.35" />
          <line x1="1140" y1="325" x2="1220" y2="215" strokeWidth="0.3" />
          <line x1="1140" y1="325" x2="1270" y2="365" strokeWidth="0.3" />
          <line x1="1140" y1="325" x2="1080" y2="455" strokeWidth="0.3" />
          <line x1="1220" y1="215" x2="1330" y2="175" strokeWidth="0.25" />
          <line x1="1220" y1="215" x2="1270" y2="365" strokeWidth="0.25" />
          <line x1="1170" y1="68" x2="1330" y2="175" strokeWidth="0.25" />

          {/* Bottom sprawl */}
          <line x1="345" y1="445" x2="540" y2="475" strokeWidth="0.55" />
          <line x1="345" y1="445" x2="300" y2="575" strokeWidth="0.5" />
          <line x1="540" y1="475" x2="670" y2="455" strokeWidth="0.5" />
          <line x1="540" y1="475" x2="495" y2="595" strokeWidth="0.5" />
          <line x1="670" y1="455" x2="800" y2="505" strokeWidth="0.45" />
          <line x1="670" y1="455" x2="630" y2="585" strokeWidth="0.45" />
          <line x1="800" y1="505" x2="940" y2="465" strokeWidth="0.4" />
          <line x1="800" y1="505" x2="755" y2="615" strokeWidth="0.4" />
          <line x1="940" y1="465" x2="1080" y2="455" strokeWidth="0.35" />
          <line x1="940" y1="465" x2="890" y2="585" strokeWidth="0.35" />
          <line x1="1080" y1="455" x2="1270" y2="365" strokeWidth="0.3" />
          <line x1="1080" y1="455" x2="1030" y2="575" strokeWidth="0.3" />
          <line x1="65" y1="510" x2="185" y2="525" strokeWidth="0.55" />
          <line x1="65" y1="510" x2="45" y2="630" strokeWidth="0.5" />
          <line x1="185" y1="525" x2="300" y2="575" strokeWidth="0.5" />
          <line x1="185" y1="525" x2="145" y2="655" strokeWidth="0.45" />
          <line x1="300" y1="575" x2="495" y2="595" strokeWidth="0.5" />
          <line x1="300" y1="575" x2="260" y2="695" strokeWidth="0.45" />
          <line x1="495" y1="595" x2="630" y2="585" strokeWidth="0.45" />
          <line x1="495" y1="595" x2="455" y2="715" strokeWidth="0.4" />
          <line x1="630" y1="585" x2="755" y2="615" strokeWidth="0.4" />
          <line x1="630" y1="585" x2="585" y2="720" strokeWidth="0.4" />
          <line x1="755" y1="615" x2="890" y2="585" strokeWidth="0.35" />
          <line x1="755" y1="615" x2="715" y2="735" strokeWidth="0.35" />
          <line x1="890" y1="585" x2="1030" y2="575" strokeWidth="0.3" />
          <line x1="890" y1="585" x2="845" y2="715" strokeWidth="0.3" />
          <line x1="1030" y1="575" x2="975" y2="705" strokeWidth="0.25" />
          <line x1="1030" y1="575" x2="1160" y2="595" strokeWidth="0.25" />

          {/* Deep bottom */}
          <line x1="45" y1="630" x2="145" y2="655" strokeWidth="0.4" />
          <line x1="145" y1="655" x2="260" y2="695" strokeWidth="0.4" />
          <line x1="260" y1="695" x2="455" y2="715" strokeWidth="0.4" />
          <line x1="455" y1="715" x2="585" y2="720" strokeWidth="0.35" />
          <line x1="585" y1="720" x2="715" y2="735" strokeWidth="0.35" />
          <line x1="715" y1="735" x2="845" y2="715" strokeWidth="0.3" />
          <line x1="845" y1="715" x2="975" y2="705" strokeWidth="0.25" />
          <line x1="975" y1="705" x2="1160" y2="595" strokeWidth="0.2" />
          <line x1="1270" y1="365" x2="1320" y2="495" strokeWidth="0.2" />
          <line x1="1320" y1="495" x2="1160" y2="595" strokeWidth="0.2" />
          <line x1="45" y1="630" x2="15" y2="760" strokeWidth="0.35" />
          <line x1="145" y1="655" x2="110" y2="790" strokeWidth="0.35" />
          <line x1="260" y1="695" x2="210" y2="820" strokeWidth="0.3" />
          <line x1="455" y1="715" x2="405" y2="840" strokeWidth="0.3" />
          <line x1="585" y1="720" x2="545" y2="850" strokeWidth="0.25" />
          <line x1="715" y1="735" x2="680" y2="860" strokeWidth="0.25" />
          <line x1="845" y1="715" x2="810" y2="850" strokeWidth="0.2" />
          <line x1="975" y1="705" x2="940" y2="830" strokeWidth="0.2" />
          <line x1="1160" y1="595" x2="1120" y2="740" strokeWidth="0.18" />
          <line x1="15" y1="760" x2="110" y2="790" strokeWidth="0.3" />
          <line x1="110" y1="790" x2="210" y2="820" strokeWidth="0.3" />
          <line x1="210" y1="820" x2="405" y2="840" strokeWidth="0.25" />
          <line x1="405" y1="840" x2="545" y2="850" strokeWidth="0.25" />
          <line x1="545" y1="850" x2="680" y2="860" strokeWidth="0.2" />
          <line x1="680" y1="860" x2="810" y2="850" strokeWidth="0.2" />
          <line x1="810" y1="850" x2="940" y2="830" strokeWidth="0.18" />
          <line x1="940" y1="830" x2="1120" y2="740" strokeWidth="0.15" />
        </g>

        {/* ═══ LAYER 2: Static nodes — size = depth ═══ */}
        <g fill="#5B7B6A" opacity="0.12">
          {/* Near — big */}
          <circle cx="40" cy="25" r="5" />
          <circle cx="145" cy="72" r="5.5" />
          <circle cx="18" cy="125" r="4.5" />
          <circle cx="90" cy="155" r="5" />
          <circle cx="260" cy="42" r="4.5" />
          <circle cx="210" cy="178" r="5" />
          <circle cx="50" cy="250" r="4.5" />
          <circle cx="155" cy="295" r="4.5" />
          <circle cx="320" cy="165" r="4" />
          <circle cx="370" cy="80" r="4" />
          <circle cx="440" cy="200" r="4" />
          <circle cx="280" cy="290" r="4" />
          <circle cx="385" cy="325" r="3.5" />
          <circle cx="520" cy="290" r="3.5" />
          <circle cx="25" cy="360" r="4" />
          <circle cx="105" cy="400" r="3.5" />
          <circle cx="225" cy="405" r="3.5" />

          {/* Mid */}
          <circle cx="490" cy="58" r="3.5" />
          <circle cx="550" cy="168" r="3.5" />
          <circle cx="620" cy="95" r="3" />
          <circle cx="680" cy="210" r="3" />
          <circle cx="600" cy="365" r="3" />
          <circle cx="720" cy="335" r="3" />
          <circle cx="345" cy="445" r="3" />
          <circle cx="540" cy="475" r="3" />
          <circle cx="670" cy="455" r="3" />

          {/* Far — small */}
          <circle cx="760" cy="78" r="2.5" />
          <circle cx="900" cy="115" r="2.5" />
          <circle cx="810" cy="240" r="2.5" />
          <circle cx="960" cy="225" r="2.5" />
          <circle cx="850" cy="385" r="2.5" />
          <circle cx="1030" cy="88" r="2" />
          <circle cx="1100" cy="190" r="2" />
          <circle cx="1020" cy="345" r="2" />
          <circle cx="1140" cy="325" r="2" />
          <circle cx="940" cy="465" r="2.5" />
          <circle cx="1080" cy="455" r="2" />
          <circle cx="800" cy="505" r="2.5" />

          {/* Very far — tiny */}
          <circle cx="1170" cy="68" r="1.5" />
          <circle cx="1220" cy="215" r="1.5" />
          <circle cx="1270" cy="365" r="1.5" />
          <circle cx="1330" cy="175" r="1.5" />
          <circle cx="1320" cy="495" r="1.5" />
          <circle cx="1160" cy="595" r="1.5" />

          {/* Bottom */}
          <circle cx="65" cy="510" r="3" />
          <circle cx="185" cy="525" r="3" />
          <circle cx="300" cy="575" r="3" />
          <circle cx="495" cy="595" r="2.5" />
          <circle cx="630" cy="585" r="2.5" />
          <circle cx="755" cy="615" r="2.5" />
          <circle cx="890" cy="585" r="2" />
          <circle cx="1030" cy="575" r="2" />
          <circle cx="45" cy="630" r="2.5" />
          <circle cx="145" cy="655" r="2.5" />
          <circle cx="260" cy="695" r="2.5" />
          <circle cx="455" cy="715" r="2" />
          <circle cx="585" cy="720" r="2" />
          <circle cx="715" cy="735" r="2" />
          <circle cx="845" cy="715" r="1.5" />
          <circle cx="975" cy="705" r="1.5" />
          <circle cx="1120" cy="740" r="1.5" />

          {/* Deep bottom */}
          <circle cx="15" cy="760" r="2" />
          <circle cx="110" cy="790" r="2" />
          <circle cx="210" cy="820" r="1.5" />
          <circle cx="405" cy="840" r="1.5" />
          <circle cx="545" cy="850" r="1.5" />
          <circle cx="680" cy="860" r="1.5" />
          <circle cx="810" cy="850" r="1.5" />
          <circle cx="940" cy="830" r="1.5" />
        </g>

        {/* ═══ LAYER 3: Breathing shines — grow from tiny + fade in, then shrink + fade out ═══ */}
        <defs>
          <filter id="shineGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Purple — upper-mid */}
        <circle cx="550" cy="168" fill="#8B5CF6" opacity="0" filter="url(#shineGlow)">
          <animate attributeName="r" values="2;2;20;20;2;2" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="14s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;0.35;0.35;0;0" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="14s" repeatCount="indefinite" />
        </circle>

        {/* Blue — center-right */}
        <circle cx="850" cy="385" fill="#4A90D9" opacity="0" filter="url(#shineGlow)">
          <animate attributeName="r" values="2;2;18;18;2;2" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="16s" repeatCount="indefinite" begin="6s" />
          <animate attributeName="opacity" values="0;0;0.3;0.3;0;0" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="16s" repeatCount="indefinite" begin="6s" />
        </circle>

        {/* Pink — lower-left */}
        <circle cx="300" cy="575" fill="#EC4899" opacity="0" filter="url(#shineGlow)">
          <animate attributeName="r" values="2;2;20;20;2;2" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="15s" repeatCount="indefinite" begin="3s" />
          <animate attributeName="opacity" values="0;0;0.3;0.3;0;0" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="15s" repeatCount="indefinite" begin="3s" />
        </circle>

        {/* Green — mid-left */}
        <circle cx="385" cy="325" fill="#34D399" opacity="0" filter="url(#shineGlow)">
          <animate attributeName="r" values="2;2;16;16;2;2" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="17s" repeatCount="indefinite" begin="9s" />
          <animate attributeName="opacity" values="0;0;0.3;0.3;0;0" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="17s" repeatCount="indefinite" begin="9s" />
        </circle>

        {/* Purple — bottom-center */}
        <circle cx="715" cy="735" fill="#A78BFA" opacity="0" filter="url(#shineGlow)">
          <animate attributeName="r" values="2;2;15;15;2;2" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="15s" repeatCount="indefinite" begin="12s" />
          <animate attributeName="opacity" values="0;0;0.28;0.28;0;0" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="15s" repeatCount="indefinite" begin="12s" />
        </circle>

        {/* Blue — far right */}
        <circle cx="1020" cy="345" fill="#5B8FD4" opacity="0" filter="url(#shineGlow)">
          <animate attributeName="r" values="2;2;14;14;2;2" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="16s" repeatCount="indefinite" begin="4.5s" />
          <animate attributeName="opacity" values="0;0;0.28;0.28;0;0" keyTimes="0;0.65;0.8;0.88;0.97;1" dur="16s" repeatCount="indefinite" begin="4.5s" />
        </circle>
      </svg>
    </div>
  );
}

import confetti from "canvas-confetti";

const BRAND_COLORS = ["#5B7B6A", "#7A9A8A", "#C4956A", "#22C55E", "#FFD700"];

export function celebrateCompletion() {
  const duration = 2500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: BRAND_COLORS,
      zIndex: 9999,
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: BRAND_COLORS,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function celebrateBurst() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.6 },
    colors: BRAND_COLORS,
    zIndex: 9999,
  });
}

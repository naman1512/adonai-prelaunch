// ────────────────────────────────────────────────────────────────────────────────
// Adonai Reserve — Design Tokens
// Single source of truth for colours, fonts, spacing, and shadows.
// ────────────────────────────────────────────────────────────────────────────────

export const theme = {
  colors: {
    black:           "#050505",
    surface:         "#0a0a0a",
    surfaceElevated: "#111111",
    surfaceCard:     "#141414",
    surfaceHover:    "#1a1a1a",

    textPrimary:     "#f0ece4",
    textSecondary:   "#a8a29e",
    textMuted:       "#6b6560",
    textDisabled:    "#3d3a37",

    accent:          "#c9a96e",
    accentHover:     "#ddbf88",
    accentMuted:     "#8b7a52",
    accentSubtle:    "rgba(201, 169, 110, 0.12)",

    success:         "#4ade80",
    successBg:       "rgba(74, 222, 128, 0.1)",
    warning:         "#fbbf24",
    warningBg:       "rgba(251, 191, 36, 0.1)",
    info:            "#60a5fa",
    infoBg:          "rgba(96, 165, 250, 0.1)",
    danger:          "#f87171",
    dangerBg:        "rgba(248, 113, 113, 0.08)",

    border:          "rgba(255, 255, 255, 0.07)",
    borderSubtle:    "rgba(255, 255, 255, 0.04)",
    borderAccent:    "rgba(201, 169, 110, 0.25)",
  },

  fonts: {
    display: "var(--font-display), Georgia, serif",
    body:    "var(--font-body), system-ui, sans-serif",
    mono:    "var(--font-mono), 'Courier New', monospace",
  },

  spacing: {
    navHeight:         80,
    navHeightScrolled: 64,
    sectionPadY:       "clamp(5rem, 8vw, 8rem)",
    containerMaxW:     "1400px",
    containerPadX:     "clamp(1.5rem, 4vw, 3.5rem)",
  },

  shadows: {
    card:      "0 4px 24px rgba(0, 0, 0, 0.4)",
    cardHover: "0 8px 40px rgba(0, 0, 0, 0.5)",
    modal:     "0 0 80px rgba(201, 169, 110, 0.06), 0 40px 80px rgba(0, 0, 0, 0.6)",
    dropdown:  "0 20px 50px rgba(0, 0, 0, 0.5)",
  },

  ease: {
    expo: [0.22, 1, 0.36, 1] as [number, number, number, number],
    out:  [0, 0, 0.2, 1]     as [number, number, number, number],
  },
} as const;

export type Theme = typeof theme;

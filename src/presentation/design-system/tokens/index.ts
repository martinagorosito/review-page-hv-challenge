// Design System — HomeVision v1.0
// Source: Claude Design handoff (home-vision-ds.dc.html)
// Typeface: Inter (300–800) + JetBrains Mono (400–500) via Google Fonts

// ─── Colors ───────────────────────────────────────────────────────────────────

export const colors = {
  // Brand — Indigo scale (★ = primary usage)
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    300: '#a5b4fc',
    500: '#6366f1',
    600: '#4f46e5', // ★ primary CTA, active states
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Text — from site CSS variables
  text: {
    black: '#18181b',  // headings, body primary
    grey: '#71717a',   // body secondary, muted
    slate: '#334155',  // quotes, medium contrast
  },

  // Backgrounds — from site CSS variables
  bg: {
    page: '#f8fafc',         // page background
    lightGrey: '#e4e4e7',    // borders, dividers
    buttonHover: '#1d15ad',  // primary button hover
  },

  // Semantic
  semantic: {
    success: '#16a34a',
    warning: '#d97706',
    error: '#ea384c',
    info: '#4f46e5',
  },

  // Semantic backgrounds (alerts, badges)
  semanticBg: {
    success: '#dcfce7',
    warning: '#fef3c7',
    error: '#fee2e2',
    info: '#eef2ff',
  },

  // Semantic borders (alerts)
  semanticBorder: {
    success: '#86efac',
    warning: '#fcd34d',
    error: '#fca5a5',
    info: '#c7d2fe',
  },

  // Semantic text — darker for contrast on semantic backgrounds
  semanticText: {
    success: '#14532d',
    warning: '#78350f',
    error: '#7f1d1d',
    info: '#4f46e5',
  },

  white: '#ffffff',
  transparent: 'transparent',
} as const

// ─── Typography ───────────────────────────────────────────────────────────────

export const typography = {
  fontFamily: {
    sans: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },

  // Type scale — all sizes as rem (base 16px)
  fontSize: {
    display: '3.5rem',  // h0 — 56px · 700 · tracking -4px
    h1: '3.5rem',       // h1 — 56px · 800 · tracking -3px
    h2: '3rem',         // h2 — 48px · 700 · tracking -2px
    h3: '2rem',         // h3 — 32px · 700
    h4: '1.5rem',       // h4 — 24px · 700
    medium: '1.125rem', // text-size-medium — 18px · 400
    base: '1rem',       // body — 16px · 400
    small: '0.875rem',  // text-size-small — 14px · 500
    xs: '0.75rem',      // 12px — badge labels, meta
    xxs: '0.6875rem',   // 11px — uppercase labels, code annotations
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
    spacious: 1.65,
    wide: 1.75,
  },

  letterSpacing: {
    tighter: '-4px', // display
    tight: '-3px',   // h1
    snug: '-2px',    // h2
    normal: '0px',
    wide: '1px',     // uppercase labels
    wider: '1.5px',  // section markers
  },
} as const

// ─── Spacing ──────────────────────────────────────────────────────────────────
// Scale: space-N = N × 0.125rem (base unit = 2px)

export const spacing = {
  0: '0px',
  1: '0.125rem',  // 2px
  2: '0.25rem',   // 4px
  4: '0.5rem',    // 8px
  6: '1rem',      // 16px
  8: '1.5rem',    // 24px
  10: '2rem',     // 32px
  12: '2.5rem',   // 40px
  16: '3rem',     // 48px
  20: '5rem',     // 80px
  28: '7rem',     // 112px
} as const

// ─── Border Radius ────────────────────────────────────────────────────────────
// ★ = most common in components

export const radii = {
  sm: '4px',
  md: '8px',    // ★ buttons, inputs, form elements
  lg: '10px',   // color swatches, inner containers
  xl: '16px',   // stat cards
  '2xl': '24px', // ★ large cards, CTA, testimonial
  full: '9999px', // pill badges, avatars
} as const

// ─── Shadows ─────────────────────────────────────────────────────────────────

export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)',
  lg: '0 4px 6px -2px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1)',
  xl: '0 10px 20px -5px rgba(0,0,0,0.06), 0 20px 25px -5px rgba(0,0,0,0.1)',
  brand: '0 4px 6px -2px rgba(79,70,229,0.2), 0 10px 15px -3px rgba(79,70,229,0.3)',
} as const

// ─── Breakpoints ──────────────────────────────────────────────────────────────

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const

// ─── Gradients ────────────────────────────────────────────────────────────────

export const gradients = {
  hero: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
  heroRadial: 'radial-gradient(ellipse at 50% -20%, rgba(99,102,241,0.12) 0%, transparent 60%)',
  ctaCard: 'linear-gradient(20deg, #3730a3 21%, #4f46e5 80%)',
  iconBadge: 'linear-gradient(225deg, #818cf8, #4338ca)',
  navAccent: 'linear-gradient(90deg, #ff6720, #f9db6d 34%, #963cbd 67%, #009bde)',
} as const

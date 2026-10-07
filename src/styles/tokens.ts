/**
 * DISCIPRIN DESIGN SYSTEM — Design Tokens
 * ========================================
 * 
 * A comprehensive token system for the Disciprin UI.
 * All design decisions flow from these primitives.
 * 
 * @architecture Atomic Design
 * @philosophy Dark-first, high-contrast, cyberpunk aesthetic
 * @fonts IBM Plex Mono (body), Cal Sans (display)
 */

// ============================================================================
// COLOR PRIMITIVES
// ============================================================================

/**
 * Core color palette - raw hex values
 * These are the foundational colors from which all semantic tokens derive.
 */
export const colors = {
  // Brand Colors
  green: '#00FF8C',      // Success, completion, positive actions
  magenta: '#FF00B2',    // Accent, warnings, destructive hints
  yellow: '#FBFF00',     // Highlights, in-progress states
  
  // Grayscale (0 = darkest, 100 = lightest)
  grayscale: {
    0: '#010101',        // Background, deepest black
    10: '#111111',       // Elevated surfaces
    25: '#222222',       // Borders (dark theme)
    30: '#333333',       // Subtle borders
    50: '#555555',       // Muted text, disabled states
    75: '#AAAAAA',       // Secondary text, borders (light theme)
    100: '#F1F1F1',      // Primary text (dark theme), backgrounds (light)
  },
  
  // Pure values
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// ============================================================================
// SEMANTIC COLOR TOKENS
// ============================================================================

/**
 * Semantic tokens for consistent meaning across the UI.
 * Use these instead of raw color primitives.
 */
export const semanticColors = {
  // Backgrounds
  background: {
    primary: colors.grayscale[0],
    elevated: colors.grayscale[10],
    muted: colors.grayscale[25],
    inverse: colors.grayscale[100],
  },
  
  // Text
  text: {
    primary: colors.grayscale[100],
    secondary: colors.grayscale[75],
    muted: colors.grayscale[50],
    inverse: colors.grayscale[0],
    accent: colors.green,
  },
  
  // Borders
  border: {
    default: colors.grayscale[25],
    subtle: colors.grayscale[30],
    emphasis: colors.grayscale[75],
    inverse: colors.grayscale[100],
  },
  
  // Interactive states
  interactive: {
    default: colors.grayscale[100],
    hover: colors.white,
    active: colors.green,
    disabled: colors.grayscale[50],
  },
  
  // Feedback
  feedback: {
    success: colors.green,
    warning: colors.yellow,
    error: colors.magenta,
    info: colors.grayscale[75],
  },
  
  // Status indicators (habit tracking)
  status: {
    complete: colors.green,
    partial: colors.yellow,
    missed: colors.magenta,
    pending: colors.grayscale[50],
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

/**
 * Font families - the typographic foundation
 */
export const fontFamily = {
  mono: "'IBM Plex Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
  display: "'Cal Sans', 'Helvetica Neue', 'Arial', sans-serif",
} as const;

/**
 * Font sizes - modular scale (1.25 ratio)
 * All values in rem for accessibility
 */
export const fontSize = {
  '2xs': '0.625rem',   // 10px - Tiny labels
  xs: '0.75rem',       // 12px - Body text (default)
  sm: '0.875rem',      // 14px - Emphasized body
  base: '1rem',        // 16px - Large body
  lg: '1.25rem',       // 20px - Small headings
  xl: '1.5rem',        // 24px - Section headings
  '2xl': '2rem',       // 32px - Page headings
  '3xl': '2.5rem',     // 40px - Hero text
  '4xl': '3rem',       // 48px - Display text
} as const;

/**
 * Font weights
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Line heights
 */
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

/**
 * Letter spacing
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// ============================================================================
// SPACING
// ============================================================================

/**
 * Spacing scale - 4px base unit
 */
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
} as const;

// ============================================================================
// BORDERS & RADII
// ============================================================================

/**
 * Border widths
 */
export const borderWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
} as const;

/**
 * Border radii - Disciprin uses sharp corners (brutalist aesthetic)
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px - subtle rounding
  base: '0.25rem',   // 4px - default (rarely used)
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  full: '9999px',    // Pills, avatars
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

/**
 * Box shadows - subtle depth with neon glow options
 */
export const shadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  
  // Neon glow effects
  glow: {
    green: `0 0 10px ${colors.green}40, 0 0 20px ${colors.green}20`,
    magenta: `0 0 10px ${colors.magenta}40, 0 0 20px ${colors.magenta}20`,
    yellow: `0 0 10px ${colors.yellow}40, 0 0 20px ${colors.yellow}20`,
    white: '0 0 10px rgba(255, 255, 255, 0.5)',
  },
} as const;

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

/**
 * Transition durations (ms)
 */
export const duration = {
  instant: 0,
  fast: 50,
  normal: 150,
  moderate: 200,
  slow: 300,
  slower: 400,
  lazy: 500,
} as const;

/**
 * Easing functions
 */
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Custom easings for Framer Motion
  spring: [0.23, 1, 0.32, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.1, 0.25, 1],
} as const;

/**
 * Transition presets for CSS
 */
export const transition = {
  none: 'none',
  all: `all ${duration.normal}ms ${easing.easeInOut}`,
  colors: `color ${duration.normal}ms ${easing.easeInOut}, background-color ${duration.normal}ms ${easing.easeInOut}, border-color ${duration.normal}ms ${easing.easeInOut}`,
  opacity: `opacity ${duration.normal}ms ${easing.easeInOut}`,
  transform: `transform ${duration.moderate}ms ${easing.easeOut}`,
  shadow: `box-shadow ${duration.normal}ms ${easing.easeInOut}`,
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

/**
 * Z-index scale - maintain stacking order sanity
 */
export const zIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
  max: 9999,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Responsive breakpoints (min-width)
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

/**
 * Button-specific tokens
 */
export const button = {
  height: {
    sm: spacing[8],     // 32px
    md: spacing[10],    // 40px
    lg: spacing[12],    // 48px
  },
  padding: {
    sm: `${spacing[2]} ${spacing[3]}`,
    md: `${spacing[2]} ${spacing[4]}`,
    lg: `${spacing[3]} ${spacing[6]}`,
  },
} as const;

/**
 * Input-specific tokens
 */
export const input = {
  height: {
    sm: spacing[8],
    md: spacing[10],
    lg: spacing[12],
  },
  padding: spacing[4],
} as const;

/**
 * Grid-specific tokens (for the ASCII grid aesthetic)
 */
export const grid = {
  cellSize: '8px',
  gap: '1px',
  dotSize: '1px',
  pattern: `radial-gradient(${colors.white} 1px, transparent 1px)`,
  patternSize: '2px 2px',
  patternOpacity: 0.25,
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get completion color based on percentage
 */
export function getCompletionColor(percentage: number): string {
  if (percentage >= 90) return colors.green;
  if (percentage >= 50) return colors.yellow;
  return colors.magenta;
}

/**
 * Create CSS custom property reference
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}

/**
 * Create rgba from hex with alpha
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// TAILWIND CLASS MAPPINGS
// ============================================================================

/**
 * Maps semantic tokens to Tailwind utility classes.
 * Use these for consistent styling across components.
 */
export const tw = {
  // Colors (use CSS custom properties defined in index.css)
  bg: {
    primary: 'bg-grayscale0',
    elevated: 'bg-grayscale25',
    muted: 'bg-grayscale30',
    inverse: 'bg-grayscale100',
    green: 'bg-green',
    magenta: 'bg-red',
    yellow: 'bg-yellow',
  },
  text: {
    primary: 'text-dark-theme-text',
    secondary: 'text-grayscale75',
    muted: 'text-grayscale50',
    inverse: 'text-grayscale0',
    green: 'text-green',
    magenta: 'text-red',
    yellow: 'text-yellow',
  },
  border: {
    default: 'border-dark-theme-border',
    subtle: 'border-grayscale30',
    emphasis: 'border-grayscale75',
    inverse: 'border-grayscale100',
  },
  font: {
    mono: 'font-mono',
    display: 'font-display',
  },
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

const tokens = {
  colors,
  semanticColors,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  spacing,
  borderWidth,
  borderRadius,
  shadow,
  duration,
  easing,
  transition,
  zIndex,
  breakpoints,
  button,
  input,
  grid,
  tw,
  // Utilities
  getCompletionColor,
  cssVar,
  hexToRgba,
} as const;

export default tokens;

// Type exports for TypeScript consumers
export type Colors = typeof colors;
export type SemanticColors = typeof semanticColors;
export type Spacing = typeof spacing;
export type FontSize = typeof fontSize;

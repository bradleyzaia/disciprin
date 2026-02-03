# Disciprin Design System

A comprehensive design system for the Disciprin habit-tracking application. Built on atomic design principles with a dark-first, high-contrast cyberpunk aesthetic.

## Philosophy

- **Dark-first**: Deep black background (#010101) as the foundation
- **High contrast**: Neon accents against dark surfaces
- **Brutalist typography**: Monospace uppercase body text, geometric display headings
- **Grid-based patterns**: ASCII-inspired dot patterns for overlays and textures
- **Sharp edges**: No rounded corners (rounded-none everywhere)

---

## Color Palette

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `green` | `#00FF8C` | Success, completion, positive feedback |
| `magenta` | `#FF00B2` | Accents, warnings, destructive hints |
| `yellow` | `#FBFF00` | Highlights, in-progress states |

### Grayscale

| Token | Hex | Usage |
|-------|-----|-------|
| `grayscale.0` | `#010101` | Background, deepest surfaces |
| `grayscale.10` | `#111111` | Elevated surfaces |
| `grayscale.25` | `#222222` | Borders (dark theme) |
| `grayscale.30` | `#333333` | Subtle borders |
| `grayscale.50` | `#555555` | Muted text, disabled states |
| `grayscale.75` | `#AAAAAA` | Secondary text |
| `grayscale.100` | `#F1F1F1` | Primary text (dark theme) |

### Semantic Usage

```tsx
import { colors, semanticColors } from "@/styles/tokens"

// Direct access
colors.green           // '#00FF8C'
colors.grayscale[25]   // '#222222'

// Semantic access
semanticColors.feedback.success    // green
semanticColors.status.complete     // green
semanticColors.status.partial      // yellow
semanticColors.status.missed       // magenta
```

---

## Typography

### Font Families

| Token | Font | Usage |
|-------|------|-------|
| `mono` | IBM Plex Mono | Body text, UI elements |
| `display` | Cal Sans | Headings, display text |

### Font Sizes

| Token | Size | Typical Use |
|-------|------|-------------|
| `2xs` | 10px | Tiny labels, metadata |
| `xs` | 12px | Body text (default) |
| `sm` | 14px | Emphasized body |
| `base` | 16px | Large body text |
| `lg` | 20px | Small headings |
| `xl` | 24px | Section headings |
| `2xl` | 32px | Page headings |
| `3xl` | 40px | Hero text |
| `4xl` | 48px | Display text |

### Text Styling

```tsx
// Tailwind classes
className="font-mono uppercase text-xs"    // Standard body
className="font-display text-2xl"          // Headings
```

---

## Spacing

Based on a 4px grid. Use spacing tokens instead of arbitrary values.

```tsx
import { spacing } from "@/styles/tokens"

spacing[4]  // '1rem' (16px)
spacing[8]  // '2rem' (32px)
```

| Token | Value | Pixels |
|-------|-------|--------|
| 1 | 0.25rem | 4px |
| 2 | 0.5rem | 8px |
| 3 | 0.75rem | 12px |
| 4 | 1rem | 16px |
| 6 | 1.5rem | 24px |
| 8 | 2rem | 32px |
| 12 | 3rem | 48px |

---

## Borders

### Border Width

Almost always use 1px borders.

### Border Radius

**Default: None.** Disciprin uses sharp corners for a brutalist aesthetic.

Exception: Pills and circular indicators use `rounded-full`.

### Border Colors

Use semantic border tokens:

```tsx
import { tw } from "@/styles/tokens"

className={tw.border.default}   // border-dark-theme-border
className={tw.border.subtle}    // border-grayscale30
className={tw.border.inverse}   // border-grayscale100
```

---

## Shadows

### Standard Shadows

Use sparingly. The dark theme relies more on borders than shadows.

### Glow Effects

For neon accent effects:

```tsx
import { shadow } from "@/styles/tokens"

style={{ boxShadow: shadow.glow.green }}    // Green neon glow
style={{ boxShadow: shadow.glow.magenta }}  // Magenta neon glow
style={{ boxShadow: shadow.glow.white }}    // White glow (chart indicators)
```

---

## Transitions

### Durations

| Token | Value | Use |
|-------|-------|-----|
| `fast` | 50ms | Instant feedback |
| `normal` | 150ms | Standard transitions |
| `moderate` | 200ms | Color changes |
| `slow` | 300ms | Complex animations |

### Easings

```tsx
import { easing } from "@/styles/tokens"

easing.easeOut     // Standard exit
easing.spring      // Framer Motion spring [0.23, 1, 0.32, 1]
easing.bounce      // Playful interactions
```

---

## Grid Pattern (ASCII Effect)

The signature ASCII dot pattern for overlays and backdrops:

```tsx
import { grid } from "@/styles/tokens"

<div style={{
    backgroundImage: grid.pattern,
    backgroundSize: grid.patternSize,
    opacity: grid.patternOpacity
}} />
```

Values:
- Pattern: `radial-gradient(#ffffff 1px, transparent 1px)`
- Size: `2px 2px`
- Opacity: `0.25`

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `base` | 0 | Normal flow |
| `raised` | 10 | Elevated content |
| `dropdown` | 20 | Dropdowns, selects |
| `sticky` | 30 | Sticky headers |
| `overlay` | 40 | Backdrops |
| `modal` | 50 | Modals, dialogs |
| `popover` | 60 | Popovers |
| `toast` | 70 | Notifications |
| `tooltip` | 80 | Tooltips |

---

## Component Tokens

### Button Heights

| Size | Height |
|------|--------|
| `sm` | 32px |
| `md` | 40px |
| `lg` | 48px |

### Input Heights

| Size | Height |
|------|--------|
| `sm` | 32px |
| `md` | 40px |
| `lg` | 48px |

---

## Utility Functions

### `getCompletionColor(percentage)`

Returns the appropriate status color based on completion:

```tsx
import { getCompletionColor } from "@/styles/tokens"

getCompletionColor(100)  // '#00FF8C' (green)
getCompletionColor(75)   // '#FBFF00' (yellow)
getCompletionColor(25)   // '#FF00B2' (magenta)
```

### `hexToRgba(hex, alpha)`

Convert hex to rgba for transparency:

```tsx
import { hexToRgba } from "@/styles/tokens"

hexToRgba('#00FF8C', 0.5)  // 'rgba(0, 255, 140, 0.5)'
```

---

## Tailwind Mappings

For quick access to semantic Tailwind classes:

```tsx
import { tw } from "@/styles/tokens"

// Backgrounds
tw.bg.primary     // 'bg-grayscale0'
tw.bg.elevated    // 'bg-grayscale25'
tw.bg.green       // 'bg-green'

// Text
tw.text.primary   // 'text-dark-theme-text'
tw.text.muted     // 'text-grayscale50'
tw.text.green     // 'text-green'

// Borders
tw.border.default // 'border-dark-theme-border'

// Fonts
tw.font.mono      // 'font-mono'
tw.font.display   // 'font-display'
```

---

## Usage Examples

### Modal Backdrop

```tsx
import { grid } from "@/styles/tokens"

<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: grid.patternOpacity }}
    exit={{ opacity: 0 }}
    className="absolute inset-0"
    style={{
        backgroundImage: grid.pattern,
        backgroundSize: grid.patternSize
    }}
/>
```

### Status Indicator

```tsx
import { colors, getCompletionColor } from "@/styles/tokens"

const statusColor = getCompletionColor(percentComplete)

<div style={{ backgroundColor: statusColor }}>
    {percentComplete}%
</div>
```

### Glow Effect

```tsx
import { shadow } from "@/styles/tokens"

<div 
    className="bg-white rounded-full"
    style={{ boxShadow: shadow.glow.white }}
/>
```

---

## Migration Guide

When refactoring existing components:

1. Replace hardcoded hex colors with token imports:
   ```tsx
   // Before
   stroke="#ffffff"
   
   // After
   import { colors } from "@/styles/tokens"
   stroke={colors.white}
   ```

2. Replace inline patterns with grid tokens:
   ```tsx
   // Before
   className="bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:2px_2px] opacity-25"
   
   // After
   style={{
       backgroundImage: grid.pattern,
       backgroundSize: grid.patternSize,
       opacity: grid.patternOpacity
   }}
   ```

3. Use semantic tokens for consistency:
   ```tsx
   // Before
   return percentage >= 100 ? '#00FF8C' : '#FF00B2'
   
   // After
   import { getCompletionColor } from "@/styles/tokens"
   return getCompletionColor(percentage)
   ```

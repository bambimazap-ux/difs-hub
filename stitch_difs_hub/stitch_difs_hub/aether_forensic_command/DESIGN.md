---
name: Aether Forensic Command
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#a078ff'
  on-tertiary-container: '#340080'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  headline-xl:
    fontFamily: Rubik
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Rubik
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Rubik
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: '1.1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base-unit: 4px
  container-margin: 24px
  gutter: 16px
  panel-padding: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for high-stakes cyber-forensics and real-time command environments. The brand personality is authoritative, precise, and sophisticated, evoking the feeling of a state-of-the-art digital laboratory. It prioritizes clarity under pressure while maintaining a premium, "next-gen" aesthetic.

The visual style is a refined **Glassmorphism**, moving away from standard flat interfaces toward a multi-layered, immersive experience. The UI utilizes semi-transparent surfaces with high-performance backdrop blurs to simulate depth. Digital "glow" is used sparingly but intentionally to highlight active forensic data points, while subtle neon grid patterns in the background reinforce the technical, structured nature of the work.

**Target Audience:** Cyber-security analysts, forensic investigators, and high-level command personnel who require high information density without cognitive overload.

## Colors

This design system utilizes a "Deep Space" palette to ensure visual comfort during long forensic investigations. 

- **Primary (Electric Blue):** Used for primary actions, active states, and critical paths.
- **Secondary (Tech Cyan):** Reserved for data visualization, secondary indicators, and successful system status.
- **Tertiary (Royal Purple):** Used for deep-analysis tools, encryption statuses, and investigative metadata.
- **Amber:** Strictly used for warnings, high-priority alerts, and forensic anomalies.

The background layers utilize a tiered system: `#030712` for the base canvas and `#090e1a` for container surfaces. All surfaces should implement a subtle 1px border using a low-opacity version of the primary or secondary color to create a "glowing wireframe" effect.

## Typography

The typography strategy is optimized for **RTL (Hebrew)** legibility while maintaining a technical edge. 

**Rubik** is the primary typeface for headlines, chosen for its friendly yet modern geometric construction which translates exceptionally well to Hebrew script. **Outfit** serves as the body face, providing a clean and contemporary feel that aids in reading long forensic reports. **Inter** is used for technical labels, monospaced-adjacent data points, and system status indicators where maximum clarity and compact spacing are required.

All type should be rendered with high contrast against the dark backgrounds. Headers may occasionally use a subtle text-shadow with a 4px blur of the primary color to simulate a terminal-glow effect in high-level dashboard views.

## Layout & Spacing

The layout is a **Right-to-Left (RTL)** fluid grid system built on an 8px rhythmic scale. 

- **Grid:** A 12-column layout for desktop with 16px gutters.
- **Margins:** 24px safe areas on mobile, scaling to 48px or fluid-max on large command center displays.
- **Glass Containers:** Modules are separated by 16px to 24px gaps to allow the background grid pattern to remain visible, reinforcing the "modular" nature of the forensic lab.

On mobile devices, the 12-column grid collapses to a single-column stack, with side-navigation transforming into a bottom-anchored command bar for thumb-optimized access.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional drop shadows.

1.  **Base Layer:** Solid `#030712` with a subtle 5% opacity cyan grid pattern overlay.
2.  **Surface Layer (Panels):** Semi-transparent `#090e1a` (approx 70% opacity) with a `backdrop-filter: blur(12px)`.
3.  **Border Treatment:** Every elevated surface must have a 1px solid border. The top and right borders (in RTL) should be slightly brighter to simulate a top-right light source.
4.  **Ambient Glow:** Active panels or selected forensic nodes utilize an outer `box-shadow` with a 20px spread, 0px offset, and 15% opacity of the primary color to create a soft "inner-glow" environment.

## Shapes

The design system uses a **Soft (0.25rem / 4px)** corner radius. This choice balances the precision of "sharp" industrial interfaces with the modern feel of "rounded" software.

- **Standard Buttons/Inputs:** 4px radius.
- **Cards/Modules:** 8px (rounded-lg) for larger dashboard sections.
- **Active Indicators:** 2px or sharp corners to denote technical "hard" data points.
- **Status Pills:** Fully rounded (pill) to distinguish them from actionable buttons.

## Components

### Buttons
Primary buttons use a solid gradient of Primary-to-Secondary color with a subtle white inner-glow on the top edge. Secondary buttons are "Ghost" style with a 1px Tech Cyan border and a 10% Tech Cyan background hover state.

### Input Fields
Inputs are dark-filled (50% opacity) with a bottom-only 2px border that "activates" by glowing when focused. Labels are placed above the field in **label-md** typography.

### Forensic Cards
Cards feature a header area with a tertiary-colored accent line on the right side (RTL). Content within cards is separated by low-opacity horizontal dividers.

### Data Chips
Small, high-contrast badges used for tagging file types, threat levels, or metadata. Threat levels use a semantic color scale (Amber for High, Cyan for Low).

### Terminal List
A specialized list component for log data. Uses a monospaced variant of **Inter**, alternating row background opacities (2% vs 5%), and timestamp markers in Tech Cyan.

### Additional Components
- **Pulse Indicator:** A localized glow animation for real-time data ingestion.
- **Scanning Bar:** A horizontal cyan line that slowly moves vertically across active "analysis" cards to simulate a forensic scan.
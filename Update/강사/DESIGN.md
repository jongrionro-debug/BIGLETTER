# Design System Strategy: Operational Elegance

This document outlines the visual and structural language for this design system. We are moving beyond the "utility-first" aesthetic to create a high-end, editorial experience that balances the rapid scannability of operational tools with the warmth of premium lifestyle applications.

---

## 1. Overview & Creative North Star: "The Tactile Concierge"

The Creative North Star for this design system is **"The Tactile Concierge."** 

Unlike traditional operational dashboards that feel cold and rigid, this system is designed to feel human, approachable, and meticulously organized. We achieve this through **Organic Sophistication**: breaking the "template" look by utilizing generous corner radii, asymmetric content balancing, and tonal depth. The goal is a UI that doesn't just display data, but "presents" it on a digital tray.

- **Intentional Asymmetry:** Avoid perfectly centered layouts for everything. Use wide margins and offset typography to guide the eye.
- **Operational Warmth:** We use the Kakao-inspired palette not as a "toy" aesthetic, but as a high-contrast tool for clarity.
- **Bespoke Layouts:** Overlapping elements and layered surfaces replace the traditional "boxed-in" grid.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule

Our palette is rooted in warm neutrals and a singular, high-energy accent.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. 
Structure must be achieved through:
1.  **Background Color Shifts:** Moving from `surface` to `surface-container-low`.
2.  **Negative Space:** Using the spacing scale to create clear mental models of grouping.
3.  **Tonal Transitions:** Subtle shifts in hue to denote "active" or "hover" states.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical sheets of fine paper. 
- **Base Layer:** `surface` (#fef9f0) or `surface-container-lowest`.
- **Secondary Content:** `surface-container` (#f2ede4).
- **Floating/Actionable Elements:** `surface-bright` or `surface-container-highest`.
*Nesting Example:* A `surface-container-lowest` card sitting on a `surface-container-low` section provides a soft, natural lift that communicates hierarchy without visual clutter.

### The "Glass & Gradient" Rule
To elevate the "Premium" feel, use **Glassmorphism** for floating headers or navigation rails. Use semi-transparent versions of `surface` with a `backdrop-blur` (20px-40px). 
For CTAs, use a **Signature Texture**: a subtle linear gradient from `primary` (#6a5f00) to `primary-container` (#fee500) at a 135-degree angle. This adds "soul" and prevents the primary action from feeling "flat."

---

## 3. Typography: Editorial Authority

We use **Pretendard Variable** (mapped to the `plusJakartaSans` scale for weight/spacing) to bridge the gap between high-speed legibility and editorial style.

- **Display & Headlines:** Use `display-lg` to `headline-sm` with tight letter-spacing (-0.02em) and a Bold weight. These should feel like magazine headers—authoritative and clear.
- **Body & Captions:** Use `body-md` for operational data. Increase line-height (1.6) to ensure the warm background "breathes" through the text.
- **Micro-Copy:** `label-sm` should always be in `on-surface-variant` (#4b4732) to reduce visual noise while maintaining accessibility.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are often a crutch for poor layout. In this design system, we prioritize **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by "stacking" the surface-container tiers. For instance, a side panel should be `surface-container-high` while the main workspace is `surface`.
- **Ambient Shadows:** If a floating element (like a Modal) requires a shadow, it must be "Ambient":
    - **Blur:** 40px - 60px.
    - **Opacity:** 4% - 6%.
    - **Color:** Use a tinted version of `on-surface` (#1d1c16) rather than pure black to keep the warmth of the `background` (#fef9f0).
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components: Soft & Purposeful

### Buttons
- **Primary:** `primary-container` background with `on-primary-container` text. Roundedness: `full` (9999px). 
- **Secondary:** `surface-container-highest` background. No border.
- **States:** On press, scale the button down to 0.98 to provide haptic-like visual feedback.

### Input Fields
- **Style:** Background `surface-container-low`, no border. 
- **Rounding:** `sm` (0.5rem) to differentiate from the "pill" shape of buttons.
- **Active State:** Change background to `surface-lowest` and add a 2px "Ghost Border" of `primary`.

### Cards & Lists
- **The Divider Ban:** Do not use line dividers between list items. Use 12px–16px of vertical white space or alternating subtle background shifts (`surface` to `surface-container-lowest`).
- **Cards:** Use `lg` (2rem) or `xl` (3rem) rounding for large containers. This "Generous Rounding" is the signature of the brand's friendliness.

### Chips (Operational Tags)
- Use `tertiary-container` for status-based chips. The high-contrast `on-tertiary-container` (#007171) ensures "Fast to Scan" operational use.

---

## 6. Do's and Don'ts

### Do
- **Do** use `primary-fixed` (#fde400) for high-importance highlights like notification badges or active navigation indicators.
- **Do** allow content to bleed to the edges of containers with generous internal padding (min 24px).
- **Do** use `Pretendard Variable`'s weight axis to create hierarchy rather than just changing font sizes.

### Don't
- **Don't** use pure black (#000000) or pure white (#FFFFFF). Always use the provided neutral tokens to maintain the "warm" atmosphere.
- **Don't** use standard 4px or 8px rounding. Stick to the `DEFAULT` (1rem) or higher to maintain the "Generous Rounding" signature.
- **Don't** clutter the screen. If an element isn't essential for the current operation, use a lower `surface-container` tier to "sink" it into the background.

---

## 7. Operational Optimization

For high-density data views, ignore the "Generous Rounding" on individual table cells, but apply `md` (1.5rem) rounding to the **table container itself**. This maintains the system's identity while ensuring data density isn't compromised by excessive corner curves in tight spaces. Use `surface-container-lowest` for the table header to make it pop against the `surface` body.
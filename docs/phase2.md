# Phase 2 — UI/UX Specification (Portfolio Website)

This document defines **Phase 2 (UI/UX only)**.
All architecture, data handling, and integrations are already defined in Phase 1 and must remain unchanged.

---

# Design Principles

1. **Theme**

   * Light theme only (no dark mode, no theme switching)
   * Clean, minimal, professional look
   * Suitable for a **construction portfolio for Abhilash Tiwari**

2. **Visual Style**

   * Avoid “AI-generated look”
   * Use subtle spacing, hierarchy, and typography
   * Maintain a **consistent single theme across entire site**

3. **Images**

   * Do NOT generate AI images
   * Use **solid black placeholders** where images are required
   * Replaceable later with real assets

4. **Animations**

   * Use **light, minimal animations only**:

     * Fade-in on scroll
     * Slight hover transitions
   * Avoid heavy motion or gimmicks

5. **Scrolling**

   * Smooth scrolling enabled (web only)

6. **Branding**

   * Include a **logo** (placeholder allowed)
   * Consistent brand identity across pages

## Business Data Usage

Insert after "Branding":

All displayed business information must be sourced from:
**businessInformation**

Includes:

* Contact section (email, phone, address)
* Google Maps location
* Footer information

Rules:

* Do not manually type or duplicate values
* Ensure consistency across all sections


---

# Important Note on References

Use the provided images strictly as **layout references only**:

* `1.png`
* `2.png`
* `3.png`
* `4.png`
* `5.png`

These images come from **different websites with different color themes**.

### Therefore:

* Do NOT copy colors directly
* Do NOT mix themes
* Extract only **structure and layout**
* Apply a **single consistent light theme**

All content should be:

* Placeholder text (lorem ipsum)
* Placeholder images (black blocks)

---

# Section Breakdown (Based on Provided Images)

---

## 1) Header + Hero Section (1.png)

### Purpose:

* Landing section
* First impression

### Structure:

* Top navigation bar:

  * Logo (left)
  * Navigation links (center/right)
  * CTA button

* Hero section:

  * Left side:

    * Large heading
    * Subtext
    * Primary + secondary CTA buttons
  * Right side:

    * Large image (black placeholder)

---

## 2) Services Section (2.png)

### Purpose:

* Showcase services offered

### Structure:

* Section heading
* Subheading
* Card-based layout (3 or more cards):

  * Icon (placeholder)
  * Title
  * Short description
  * CTA

---

## 3) Projects Section (3.png)

### Purpose:

* Showcase portfolio work

### Structure:

* Section heading
* List of projects:

  * Large image (black placeholder)
  * Overlay or adjacent card:

    * Project title
    * Description
    * CTA
* Staggered or alternating layout allowed

---

## 4) Contact Section (4.png)

### Purpose:

* Capture user inquiries

### Structure:

* Section heading
* Supporting text
* Layout split into:

  * Contact info blocks:

    * Email
    * Address
    * Phone
  * Contact form:

    * Name
    * Email
    * Message
    * Submit button

### Additional Requirement:

* Integrate **Google Maps (iframe embed only)**

  * Show location of **Abhilash Tiwari’s office**
  * Must be responsive and not block UI interaction

---

## 5) Footer (5.png)

### Purpose:

* Closing section with navigation and branding

### Structure:

* Logo
* Navigation links
* Optional social icons
* Copyright text

---

# Interaction & State Requirements (Critical)

## 1) Loading States

Must be present for:

* Project fetching
* Form submission
* Admin actions (add/delete/upload)

### Behavior:

* Show visible loading feedback
* Prevent user interaction during processing

---

## 2) Error States

UI must handle:

* Failed project fetch
* Failed form submission
* Failed admin actions

### Behavior:

* Show user-friendly error messages
* Do not expose technical details

---

## 3) Empty States

Handle:

* No projects available
* No content loaded

### Behavior:

* Show placeholder UI instead of blank screen

---

## 4) Form Validation Feedback

* Inline validation messages required:

  * Required fields missing
  * Invalid email format

---

## 5) Disabled States

* Disable:

  * Submit button during submission
  * Admin actions during processing

---

## 6) Image Upload Feedback (Admin)

* Show:

  * Upload in progress
  * Upload success/failure

---

## 7) Success Feedback

* Provide confirmation for:

  * Successful form submission
  * Successful admin actions

---

# Consistency Requirements

* Maintain consistent:

  * Spacing system
  * Typography scale
  * Component behavior
* Do not mix styles across sections
* Entire site must feel like a **single cohesive product**

---

# Content Rules

* Use **lorem ipsum** for all text
* No real project data
* No real images (only black placeholders)
* Keep content structured and consistent

---

# UX Expectations

* Clean spacing and alignment
* Clear visual hierarchy
* Professional (not flashy)
* Fast and minimal
* No visual clutter

---

# Accessibility (Basic)

* Proper labels for form inputs
* Clickable elements must be clear
* Use semantic HTML structure

---

# Summary

Phase 2 defines:

* Layout and structure (based on references)
* Light theme only
* Minimal animations
* Placeholder-only content
* Google Maps iframe integration
* Required interaction states (loading, error, validation, empty)

No backend or architecture changes are allowed.
SEO and advanced enhancements are deferred to **Phase 3**.

This phase is strictly for **visual and interaction layer implementation**.

---

## Safety & Interaction Constraints

### 1) Destructive Actions

* Deleting a project must require confirmation

---

### 2) Submission Protection

* Disable submit button after form submission
* Prevent multiple rapid submissions

---

### 3) Upload Experience

* Show feedback for:

  * Upload progress
  * Upload success/failure

---

### 4) Error Visibility

* Errors must be visible but non-technical
* Avoid exposing system/internal details

---

### 5) Consistency with Data Source

* All contact and business data must be sourced from:
  **businessInformation**

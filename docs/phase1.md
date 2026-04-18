# Phase 1 — Architecture & Functionality (Updated)

This document defines **Phase 1 (Architecture & Functionality Only)**.

* No UI/UX decisions should be made.
* No design system, layout, or styling assumptions.
* Focus strictly on data flow, integrations, and functional correctness.

A separate **Phase 2 document defines UI/UX**.
SEO and advanced optimizations are deferred to **Phase 3**.

---

# Core Requirements

* Static frontend application only (no backend server, no APIs, no server-side code).
* Use React with plain JavaScript, HTML, and CSS.
* Use Vite as the build tool (mandatory).
* Deploy on Vercel (mandatory).

---

# Why No Separate Backend

1. Cost avoidance (no recurring hosting)
2. Avoid overengineering
3. Firebase replaces backend responsibilities
4. No cold starts (no serverless functions)
5. Simplified deployment (single static host)

---

# Environment & Configuration

* Use **Vite environment variables (`.env`)**
* Store:

  * Firebase config
  * EmailJS keys
  * Admin UID

### Rules:

* Do not hardcode secrets in source code
* Use `import.meta.env` for access

---

## Business Data Source

All business-related identity data must be sourced from:
**businessInformation**

Includes:

* Name
* Email
* Address
* Location

Rules:

* Do not hardcode business data inside components or logic
* This document acts as the single source of truth
* Ensures consistency across Firebase usage, forms, and future integrations

---

# Data & Services

* Firebase Firestore → database
* Cloudinary → file storage
* Firebase Authentication → admin identity
* EmailJS → email notifications

---

# Data Structure

Collections:

* `projects`

  * title
  * description
  * imageUrl
  * link
  * createdAt

* `queries`

  * name
  * email
  * message
  * createdAt

---

# Functional Requirements

## 1) Public Features

* Fetch and display projects from Firestore
* Contact/query form:

  * Store in Firestore
  * Send email via EmailJS

---

## 2) Admin Capabilities (Functional Only)

* Authenticated via Firebase Authentication
* UID must match predefined admin UID (from env)

Admin can:

* Add project
* Delete project
* Upload image to Cloudinary

---

# Security Rules

## projects

* Read: public
* Write: only authenticated owner (UID match)

## queries

* Create: public
* Read/update/delete: denied

---

# System Flow

## Projects

Client ↔ Firestore
Images → Cloudinary → URL → Firestore

## Contact

Client → Firestore
Client → EmailJS

## Admin

Client → Firebase Auth
Client → Firestore
Client → Cloudinary

---

# Client–Service Interaction

Frontend (React + JS + HTML + CSS)

* Firestore
* Firebase Auth
* Cloudinary
* EmailJS

---

# Error Handling Strategy

* All async operations must be wrapped in try/catch
* Handle:

  * Firestore failures
  * Cloudinary upload failures
  * EmailJS failures

### Behavior:

* Show user-safe error message
* Do not expose internal errors
* Prevent duplicate submissions

---

# Loading States

Must be implemented for:

* Project fetching
* Form submission
* Admin actions (add/delete/upload)

### Requirement:

* Disable actions during processing
* Provide visible feedback (state-based, not UI-defined)

---

# Form Validation

Client-side validation required:

* Name → required
* Email → required + valid format
* Message → required

Reject submission if invalid

---

# Spam Protection

Required (at least one):

* Google reCAPTCHA (preferred)
  OR
* Honeypot field (fallback)

---

# Image Upload Constraints

* Allowed formats: jpg, png, webp
* Max size: ~2MB
* Reject invalid uploads before sending

---

# Project Ordering

* Default: sort by `createdAt` (descending)

---

# Empty & Edge States

Handle:

* No projects available
* Network failure
* Empty query submission

---

# Routing

* SPA routing required

Routes:

* `/` → main site
* `/admin` → admin access

---

# Deployment (Vercel + Vite)

* Configure SPA fallback:

  * All routes redirect to `index.html`

Purpose:

* Prevent 404 on refresh

---

# Google Maps Integration (Constraint)

* Use **iframe embed only**
* Do NOT use Maps JS SDK (avoids API cost)

---

# Performance Guidelines

* Lazy load images
* Avoid large bundle size
* Keep dependencies minimal

---

# Accessibility (Basic)

* Use semantic HTML
* Label all form inputs
* Ensure buttons are accessible

---

# Constraints

* No backend (no Express, Node APIs, Cloud Functions)
* No cold-start-dependent services
* Must remain within free tiers
* Fully client-driven architecture

---

# Summary

This phase defines a **complete backend-less system** with:

* Secure data handling via Firebase
* Admin-controlled CRUD
* Contact system with email notifications
* Clear handling of edge cases, validation, and performance

UI/UX remains strictly defined in Phase 2.
SEO and advanced enhancements are deferred to **Phase 3**.

---

## Data Safety & Backup

* Firestore is the primary database and must be treated as a critical data source.

### Requirements:

* Maintain periodic manual backups of Firestore data
* Export `projects` collection regularly (JSON format recommended)

### Purpose:

* Prevent permanent data loss from accidental deletion

---

## Admin Safety Controls

### Requirements:

* Prevent accidental destructive actions

Implement at least one:

* Confirmation step before delete (mandatory)
* OR soft delete approach:

  * Add field: `isDisabled: true`
  * Filter out disabled items in UI but show in admin UI so they can be re-enabled

---

## Rate Limiting (Client-side)

### Requirements:

* Prevent rapid repeated submissions

Implement:

* Disable form submission button temporarily after submit
* Basic client-side throttling

---

## Firestore Cost Guardrails

### Rules:

* Avoid real-time listeners (`onSnapshot`)
* Use one-time fetch (`getDocs`) for project data

### Purpose:

* Reduce unnecessary reads
* Stay within free tier

---

## Image Optimization

### Requirements:

* Compress images before upload
* Resize large images on client-side

### Constraints:

* Maintain quality while reducing file size

---

## Error Logging

### Requirements:

* Log all errors to console (minimum)

### Rules:

* Do not expose internal errors to users
* Logging is for debugging only

---

## Admin Route Protection

### Requirements:

* `/admin` route must not be discoverable via UI navigation

### Notes:

* This is not a security layer (security handled via Firebase rules)
* Acts as an additional obscurity layer

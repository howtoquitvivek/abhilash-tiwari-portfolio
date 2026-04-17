# Phase 3 — SEO Specification (Portfolio Website)

This document defines how the website should rank for relevant queries such as:

* construction contractor
* civil contractor
* building services
* Abhilash Tiwari

Focus: low-cost, static SEO (no backend required)

---

All business-related SEO data must be sourced from:
**businessInformation**

Includes:

* Meta tags (name, description)
* Structured data (LocalBusiness schema)
* Google Maps location
* Business listings

Rules:

* Do not hardcode values
* Maintain exact consistency (Name, Address, Email)
* Ensures correct local SEO (NAP consistency)


---

# 1) Core SEO Strategy

Target intent:

* Local + service-based queries

Examples:

* construction contractor near me
* civil contractor Abhilash Tiwari
* house construction services [city]

---

# 2) Page Structure for SEO

Even though the site is an SPA, structure must behave like a content-rich page:

* Hero → brand + primary keyword
* Services → service keywords
* Projects → proof/portfolio keywords
* Contact → local intent

---

# 3) Meta Tags (Required)

Add inside <head>:

* Title (include name + service)
* Description (clear service summary)
* Keywords (basic set)
* Viewport

---

# 4) Open Graph (Social Sharing)

Include:

* Title
* Description
* Type (website)

---

# 5) Heading Hierarchy

Rules:

* Only one H1
* Logical structure

Example:
H1 → Name + primary service
H2 → Sections (Services, Projects, Contact)
H3 → Cards/items

---

# 6) Content Strategy

Replace placeholder text in production with:

* Service keywords (construction, civil work, building)
* Location keywords (city/region)
* Trust indicators (reliable, experienced, professional)

---

# 7) Image SEO

When real images are added:

* Use descriptive filenames
* Add alt text describing project/service

---

# 8) URL Strategy

Routes:

* / → main site
* /admin → must not be indexed

Admin page must include:

* noindex, nofollow

---

# 9) Sitemap

Create static file:

* /sitemap.xml

Include homepage URL

---

# 10) Robots.txt

Allow public pages, block admin route

---

# 11) Performance SEO

Ensure:

* Fast load time
* Small JS bundle
* Optimized assets

---

# 12) Google Maps (Local SEO)

* Use real business location
* Match business name exactly

---

# 13) Local SEO (External)

Create Google Business Profile:

* Same name, address, phone as website

---

# 14) Structured Data

Add LocalBusiness schema (JSON-LD):

* Name
* Description
* Location

---

# 15) Indexing

After deployment:

* Submit site to Google Search Console
* Submit sitemap

---

# 16) Constraints

* No keyword stuffing
* No fake or AI spam content
* Keep content natural and relevant

---

# Summary

SEO strategy includes:

* Technical SEO (meta, sitemap, robots)
* Content SEO (keywords + structure)
* Local SEO (maps + business profile)
* Performance optimization

This phase ensures the website can rank effectively without requiring a backend.

---

## Data Consistency (NAP)

### Requirement:

* Name, Address, and Email must match exactly across:

  * Website
  * Google Maps
  * Structured data
  * Google Business Profile

### Source:

* **businessInformation**

---

## Indexing Control

### Requirements:

* `/admin` route must not be indexed

### Implementation:

* Add `noindex, nofollow` meta tag on admin page
* Block in `robots.txt`

---

## Analytics (Optional but Recommended)

### Add:

* Basic analytics integration (e.g., Google Analytics)

### Purpose:

* Track:

  * Visitors
  * Page interactions
  * Contact form usage

---

## Content Authenticity

### Rules:

* No AI-generated spam content
* No keyword stuffing
* Content must be natural and relevant

---

## Legal (Minimal)

### Requirement:

* Add basic privacy notice:

Example:

* “We do not share your information with third parties.”

# Functional Requirements: PDF Export Functionality

## Overview

Enable users to export results page as professional PDF document (< 10MB) with all data preserved.

## User Stories

### US-1: Export to PDF

**As a** user
**I want** to download results as PDF
**So that** I can share, print, or archive the reading

**Acceptance Criteria:**

- [ ] "Export to PDF" button on results page
- [ ] Clicking button generates and downloads PDF
- [ ] File named `Pheydrus_Report_[Name]_[Date].pdf`
- [ ] PDF generation completes in < 5 seconds
- [ ] File size < 10MB
- [ ] PDF opens in any PDF viewer

### US-2: PDF Content

**As a** user
**I want** PDF to contain all results
**So that** offline reading is complete

**Acceptance Criteria:**

- [ ] All 5 calculator sections included
- [ ] All results/data preserved
- [ ] User info header with name and date
- [ ] Page numbers included
- [ ] Professional formatting
- [ ] Readable fonts and sizes
- [ ] Proper page breaks between sections

### US-3: PDF Styling

**As a** user
**I want** PDF to look professional
**So that** it's suitable for sharing with others

**Acceptance Criteria:**

- [ ] Professional header with logo/branding
- [ ] Consistent formatting throughout
- [ ] Color scheme simplified for print (if using colors)
- [ ] Tables formatted cleanly
- [ ] Proper margins and spacing
- [ ] Readable without colors (grayscale compatible)
- [ ] Disclaimer or copyright notice included

### US-4: PDF Metadata

**As a** a report user
**I want** PDF to have metadata
**So that** file properties are informative

**Acceptance Criteria:**

- [ ] Title: "Pheydrus Report - [User Name]"
- [ ] Author: "Pheydrus Calculator"
- [ ] Creation date: Report generation date
- [ ] Subject: "Astrological & Numerological Reading"

### US-5: Simplified Presentation

**As a** the system
**I want** PDF simplified vs on-screen
**So that** it prints well and file stays small

**Acceptance Criteria:**

- [ ] Remove interactive elements (buttons, expandable sections)
- [ ] Show all content (as if all sections expanded)
- [ ] Simplified color scheme (optional colors, readable B&W)
- [ ] Remove navigation buttons
- [ ] Remove scroll hints
- [ ] Print-optimized layout

## PDF Contents

```
═══════════════════════════════════════════════════════
                    PHEYDRUS READING
═══════════════════════════════════════════════════════

Name: John Smith
Birth Date: March 15, 1990
Birth Time: 2:30 PM
Birth Location: New York, USA
Current Location: London, UK
Report Generated: February 25, 2026

───────────────────────────────────────────────────────
TRANSITS BY RISING SIGN
───────────────────────────────────────────────────────
[All transits data...]

───────────────────────────────────────────────────────
NATAL CHART
───────────────────────────────────────────────────────
[All natal chart data...]

───────────────────────────────────────────────────────
LIFE PATH
───────────────────────────────────────────────────────
[All life path data...]

───────────────────────────────────────────────────────
RELOCATION
───────────────────────────────────────────────────────
[All relocation data...]

───────────────────────────────────────────────────────
ADDRESS NUMEROLOGY
───────────────────────────────────────────────────────
[All address numerology data...]

───────────────────────────────────────────────────────
© 2026 Pheydrus. All readings for personal use only.
═══════════════════════════════════════════════════════
```

## Filename Convention

`Pheydrus_Report_[FirstName]_[LastName]_[YYYY-MM-DD].pdf`

Example: `Pheydrus_Report_John_Smith_2026-02-25.pdf`

If no name provided: `Pheydrus_Report_[Date].pdf`

## File Size Requirements

- Target: < 5MB
- Maximum: < 10MB
- No embedded images unless necessary
- Compress where possible
- Tables not images

## Testing Scenarios

- Single name vs full name
- No name provided
- Special characters in name
- Different date formats
- All sections with data
- Some sections empty
- Page breaks at section boundaries

# Functional Requirements: Results Dashboard & Output Page

## Overview

Display all 5 calculator results on a single beautiful, organized page that presents data clearly with visual hierarchy and expandable sections.

## User Stories

### US-1: Display All Results

**As a** user
**I want** to see all calculation results on one page
**So that** I can review complete reading at once

**Acceptance Criteria:**

- [ ] Results organized by calculator type
- [ ] Each calculator section clearly labeled
- [ ] All output from original calculators preserved and displayed
- [ ] Nothing hidden (no important data omitted)
- [ ] Page scrollable with logical flow
- [ ] Results readable and scannable

### US-2: Visual Organization

**As a** a user
**I want** results organized logically
**So that** I can find information easily

**Acceptance Criteria:**

- [ ] Results grouped by calculator (5 sections)
- [ ] Each section has clear header with calculator name
- [ ] Within each section, data organized hierarchically
- [ ] Related information grouped together
- [ ] Color-coded sections for visual distinction
- [ ] Visual hierarchy shows importance

### US-3: Expandable Sections

**As a** user
**I want** to expand/collapse sections
**So that** I can focus on information I'm interested in

**Acceptance Criteria:**

- [ ] Each calculator section can be expanded/collapsed
- [ ] Default state: all expanded (show everything)
- [ ] Click header to toggle expand/collapse
- [ ] Smooth animation on expand/collapse
- [ ] State preserved while on page (doesn't reset)
- [ ] Collapse only hides content, not header

### US-4: Beautiful Data Presentation

**As a** user
**I want** results displayed beautifully
**So that** the report looks professional

**Acceptance Criteria:**

- [ ] Result cards/boxes with proper spacing
- [ ] Clear typography with good hierarchy
- [ ] Consistent styling across all sections
- [ ] Color scheme matches brand
- [ ] Proper padding and margins
- [ ] Modern, clean design
- [ ] Dark/light mode support

### US-5: Charts and Visualizations

**As a** user
**I want** complex data visualized when helpful
**So that** patterns are easier to understand

**Acceptance Criteria:**

- [ ] Transits: Table showing planet positions by house
- [ ] Natal Chart: Visual chart of planets/houses (if feasible)
- [ ] Life Path: Number display with description
- [ ] Relocation: Table of angular hits and house activations
- [ ] Address: Numerology levels with numbers clearly shown
- [ ] Charts are optional enhancements (not required)

### US-6: Navigation Options

**As a** user
**I want** options to navigate from results
**So that** I can take next steps

**Acceptance Criteria:**

- [ ] "New Calculation" button (back to form)
- [ ] "Edit Inputs" button (modify and recalculate)
- [ ] "Export to PDF" button (visible and prominent)
- [ ] Buttons clearly labeled and easy to find
- [ ] Buttons stick to top or bottom of page
- [ ] Navigation doesn't block reading results

### US-7: Result Metadata

**As a** user
**I want** to see when results were calculated
**So that** I know the data freshness

**Acceptance Criteria:**

- [ ] Timestamp displayed (when calculated)
- [ ] User name displayed (if provided)
- [ ] Birth date/location displayed
- [ ] Current location displayed
- [ ] All inputs visible for reference

## Section Details

### Transits Section

Display:

- Rising sign selected
- For each planet:
  - Current transit sign and house
  - Past transit sign and house
  - Planet themes/descriptions
  - House descriptions
- Clear table or card layout

### Natal Chart Section

Display:

- Birth chart summary
- Planet positions (all planets)
- Zodiac signs (sun, moon, rising, etc.)
- Aspects between planets
- Houses and angles
- Consider chart graphic if feasible

### Life Path Section

Display:

- Life Path Number (prominent)
- Life Path description/meaning
- Personal Year Number
- Personal Year description
- Chinese Zodiac of birth year
- Chinese Zodiac description/meaning

### Relocation Section

Display:

- Birth location → Current location
- Angular hits (planets on angles)
  - Which planets
  - Which angles
  - Which houses
- House activations
  - Benefic planets in houses
  - Malefic planets in houses
  - House descriptions
- Summary of recommended locations

### Address Numerology Section

Display:

- L1 Number and meaning
- L2 Number and meaning
- Postal Code Number and meaning
- Home Built Year Chinese Zodiac
- Birth Year Chinese Zodiac
- Compatibility between home year and birth year
- All descriptions preserved from original

## Visual Design Guidelines

- Clean, modern aesthetic
- Generous whitespace
- Typography: Large headers, readable body text
- Colors: Brand colors with good contrast
- Cards/boxes with subtle shadows
- Rounded corners for modern feel
- Mobile-responsive layout
- Dark mode: Invert colors appropriately

## Data Preservation

**Critical Requirement**: ALL outputs from original calculators must be displayed

- Do not abbreviate or summarize results
- Include all descriptions and meanings
- Include all numeric values
- Include all supporting information

## Page Layout

```
┌─────────────────────────────────────┐
│    PHEYDRUS READING - John Smith    │
│    Calculated: Feb 25, 2026 3:45 PM │
├─────────────────────────────────────┤
│  [NEW CALC] [EDIT INPUTS] [EXPORT]  │
├─────────────────────────────────────┤
│  Birth Info: 03/15/1990 2:30 PM     │
│  Birth Location: New York, USA      │
│  Current Location: London, UK       │
├─────────────────────────────────────┤
│ ▼ TRANSITS BY RISING SIGN          │
│   Rising: Aries                    │
│   [Planetary transits table...]    │
├─────────────────────────────────────┤
│ ▼ NATAL CHART                      │
│   [Birth chart details...]         │
├─────────────────────────────────────┤
│ ▼ LIFE PATH                        │
│   Life Path: 6 (The Caregiver)    │
│   [Life path details...]           │
├─────────────────────────────────────┤
│ ▼ RELOCATION                       │
│   [Angular hits, house activations...]
├─────────────────────────────────────┤
│ ▼ ADDRESS NUMEROLOGY               │
│   [L1, L2, postal, compatibility...]│
├─────────────────────────────────────┤
│  [NEW CALC] [EDIT INPUTS] [EXPORT]  │
└─────────────────────────────────────┘
```

## Notes

- Page should be printable/PDF-ready
- All content must fit on screen (scrollable acceptable)
- Mobile layout: Stack sections vertically
- No content should be cut off or hidden
- Colors should be meaningful (e.g., benefic vs malefic)

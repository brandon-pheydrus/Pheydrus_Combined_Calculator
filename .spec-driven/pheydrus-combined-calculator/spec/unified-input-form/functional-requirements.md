# Functional Requirements: Unified Input Form

## Overview

Create a single form that collects all inputs needed for the 5 legacy calculators without requiring users to enter duplicate information (like birthdate).

## User Stories

### US-1: Single Entry Point for All Calculations

**As a** user
**I want** to enter all my information one time
**So that** I can generate all 5 calculations with minimal data entry

**Acceptance Criteria:**

- [ ] Form accepts all required fields for all 5 calculators
- [ ] No field is asked twice (e.g., birthdate only asked once)
- [ ] Form is organized in logical sections
- [ ] Form validation prevents incomplete submissions
- [ ] Clear field labels and examples guide users

### US-2: Collect Personal Information

**As a** user
**I want** to enter my basic personal information
**So that** my results are personalized

**Acceptance Criteria:**

- [ ] Name field accepted (for report personalization)
- [ ] Date of birth required (MM/DD/YYYY or similar format)
- [ ] Birth time accepted (HH:MM format, 24-hour)
- [ ] Birth location searchable (city name with autocomplete)
- [ ] Current location searchable (city name with autocomplete)
- [ ] All fields clearly labeled with examples
- [ ] Required vs optional fields clearly marked

### US-3: Collect Astrological Information

**As a** user interested in transits
**I want** to provide my rising sign
**So that** transit calculations are accurate

**Acceptance Criteria:**

- [ ] Rising sign dropdown with all 12 zodiac signs
- [ ] Clear explanation of what rising sign is
- [ ] Link to calculator to find rising sign (or external resource)
- [ ] Field is optional (user can skip if unknown)
- [ ] Default selection is empty until user chooses

### US-4: Collect Address Information

**As a** user interested in address numerology
**I want** to provide my address details
**So that** address calculations are performed

**Acceptance Criteria:**

- [ ] L1 field (unit number) accepted and labeled "L1"
- [ ] L2 field (street name) accepted and labeled "L2"
- [ ] Postal code field accepted
- [ ] Home built year accepted (4-digit year)
- [ ] Birth year pre-filled from date of birth (editable)
- [ ] Explanation that address fields may have empty fields depending on region
- [ ] All fields optional (can be partially filled)
- [ ] Fields labeled exactly as in original calculator

### US-5: Form Organization

**As a** a user
**I want** the form organized logically
**So that** it's easy to navigate and fill out

**Acceptance Criteria:**

- [ ] Form organized into sections:
  - Personal Information
  - Birth Details
  - Current Location
  - Astrological Information (optional)
  - Address Information (optional)
- [ ] Clear section headers
- [ ] Visual separation between sections
- [ ] Sections can be collapsed/expanded (optional UX enhancement)
- [ ] Logical top-to-bottom flow

### US-6: Form Validation

**As a** the system
**I want** to validate user inputs
**So that** calculations don't fail due to bad data

**Acceptance Criteria:**

- [ ] Date of birth is valid date (not Feb 30, etc.)
- [ ] Time of birth is valid time (00:00 - 23:59)
- [ ] Year fields are 4-digit numbers
- [ ] Birth year <= current year
- [ ] Home year <= current year
- [ ] City selections are from valid city database
- [ ] All required fields filled before submission
- [ ] Clear error messages on validation failure
- [ ] Errors shown inline next to problematic fields
- [ ] Form prevents submission with invalid data

### US-7: Location Search with Autocomplete

**As a** user
**I want** to find my city easily
**So that** I can quickly enter location information

**Acceptance Criteria:**

- [ ] Autocomplete triggered as user types
- [ ] Suggests matching cities from database
- [ ] Shows city, state/region, country
- [ ] Coordinates automatically populated when city selected
- [ ] Same functionality for both birth and current location
- [ ] Handles cities with duplicate names (same name in different regions)
- [ ] Clear indication of country/region in results
- [ ] Manual coordinate entry option if city not found

### US-8: Form Persistence

**As a** user
**I want** my form data saved as I type
**So that** I don't lose data if page accidentally closes

**Acceptance Criteria:**

- [ ] Form data auto-saved to localStorage
- [ ] Data persisted when page is closed/reopened
- [ ] Clear button to clear all form data
- [ ] No data stored on server (privacy)
- [ ] Form loads previous data on return visit

### US-9: Clear Submission

**As a** user
**I want** to submit the form and calculate
**So that** I get my results

**Acceptance Criteria:**

- [ ] Large, visible "Calculate" button
- [ ] Button disabled until all required fields valid
- [ ] Clicking calculates all 5 calculators simultaneously
- [ ] Clear feedback that calculation is in progress
- [ ] Results page appears after calculation completes
- [ ] Option to go back and modify inputs

## Input Fields Reference

| Field            | Type        | Required | Calculator(s)                         | Format          | Example       |
| ---------------- | ----------- | -------- | ------------------------------------- | --------------- | ------------- |
| Name             | Text        | No       | All                                   | Any             | John Smith    |
| Date of Birth    | Date        | Yes      | Astro, Life Path, Relocation, Address | MM/DD/YYYY      | 03/15/1990    |
| Time of Birth    | Time        | Yes      | Astro, Relocation                     | HH:MM (24h)     | 14:30         |
| Birth Location   | City Select | Yes      | Astro, Relocation                     | City name       | New York, USA |
| Current Location | City Select | Yes      | Relocation                            | City name       | London, UK    |
| Rising Sign      | Dropdown    | No       | Transits                              | One of 12 signs | Aries         |
| L1 (Unit Number) | Text        | No       | Address                               | Any             | 2000          |
| L2 (Street Name) | Text        | No       | Address                               | Any             | Main Street   |
| Postal Code      | Text        | No       | Address                               | Any             | 10001         |
| Home Built Year  | Year        | No       | Address                               | YYYY            | 1995          |

## Form Sections Structure

```
┌─────────────────────────────────────┐
│  Personal Information               │
├─────────────────────────────────────┤
│ Name:                          [___] │
│ Date of Birth:                 [___] │
│ Time of Birth:                 [___] │
├─────────────────────────────────────┤
│  Birth Location & Current Location  │
├─────────────────────────────────────┤
│ Birth Location:                [___] │
│ Current Location:              [___] │
├─────────────────────────────────────┤
│  Astrological (Optional)       [►]   │
├─────────────────────────────────────┤
│ Rising Sign:                   [___] │
├─────────────────────────────────────┤
│  Address Information (Optional) [►]  │
├─────────────────────────────────────┤
│ L1 (Unit Number):              [___] │
│ L2 (Street Name):              [___] │
│ Postal Code:                   [___] │
│ Home Built Year:               [___] │
│ Birth Year:                    [___] │
├─────────────────────────────────────┤
│           [  CALCULATE  ]            │
└─────────────────────────────────────┘
```

## Validation Rules

**Date of Birth**:

- Must be valid date
- Cannot be in future
- Must be reasonable (not before 1900)

**Time of Birth**:

- Must be 00:00 - 23:59
- Can be 00:00 if time unknown

**Years**:

- Must be 4-digit number
- Birth year <= current year
- Home year <= current year

**Locations**:

- Must select from autocomplete dropdown
- Must have valid coordinates

**Rising Sign**:

- One of 12 zodiac signs
- Optional

**Address Fields**:

- All optional
- Can leave blank if not applicable

## Error Messages

```
"Date of birth is required"
"Please enter a valid date (not Feb 30)"
"Birth date cannot be in the future"
"Time must be between 00:00 and 23:59"
"Please select a birth location from suggestions"
"Please select a current location from suggestions"
"Rising sign must be one of the 12 zodiac signs"
"Please fill in all required fields before calculating"
"Invalid year format (use YYYY)"
"Home year cannot be in the future"
```

## Notes

- Form should feel modern and clean
- Mobile-friendly responsive design
- Clear visual hierarchy
- Helpful error messages
- Encourage but don't require optional fields
- Privacy-first: no server storage

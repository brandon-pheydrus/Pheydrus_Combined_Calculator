# Feature 6: Angular Diagnostic — Functional Requirements

## User Stories

### US-6.1: As a user, I want to see a report card grade (A/B/D/F) based on my birth chart, transits, and environment

**Given** I have submitted my birth data, current location, and address information
**When** the calculator completes
**Then** I see an Angular Diagnostic Report Card showing:

- My final grade (A, B, D, or F)
- Total number of F's and A's
- Breakdown by each of the 3 pillars

### US-6.2: As a user, I want to see which specific planets are causing pressure (F) or support (A)

**Given** the diagnostic has completed
**When** I view the report card
**Then** each pillar shows every evaluated planet, its house, and its grade (F, A, or no grade)

### US-6.3: As a user, I want to understand what each pillar represents

**Given** I view the report card
**Then** I see:

- Pillar 1 "Structure" — What I was born with
- Pillar 2 "Timing" — What is happening now
- Pillar 3 "Environment" — Where I am living

### US-6.4: As a user, I want the report card included in my PDF export

**Given** I export my results as PDF
**Then** the Angular Diagnostic report card appears as the first section

---

## Grading Rules

### Angular Houses (Pheydrus Definition)

Houses 1, 5, 7, 10, and 11 are considered "angular" — these amplify planetary influence.

### Pillar 1: Structure (Natal Chart)

- Check natal planet placements in houses 1, 5, 7, 10, 11
- **Malefics** (Pluto, Saturn, Uranus, Mars, Neptune) in angular houses → **F**
- **Benefics** (Sun, Moon, Venus, Jupiter) in angular houses → **A**
- Planets not in angular houses → no grade

### Pillar 2: Timing (Transits + Life Cycle)

**Section A — Transit Angular Activation:**

- Check transiting planet houses against angular houses 1, 5, 7, 10, 11
- **Malefics only** (Neptune, Pluto, Saturn, Uranus) in angular houses → **F**
- Benefic transits are NOT scored (too short-lived to matter)

**Section B — Life Cycle Timing:**

- Personal year number (1–9) derived from birth month + birth day + current year
- Year 1, 4, 9 → **F**
- Year 5 → **A**
- All other years → **Neutral**

### Pillar 3: Environment (Relocation + Address)

**Section A — Relocation Angular Impact:**

- Check planet houses at current location against angular houses 1, 5, 7, 10, 11
- **Malefics** (Neptune, Pluto, Saturn, Uranus, Mars) in angular houses → **F**
- **Benefics** (Sun, Moon, Venus, Jupiter) in angular houses → **A**
- Planets not in angular houses → no grade

**Section B — Address Numerical Pressure:**

- Grade both L1 (Unit Number) and L3 (Street Name) if available; use whichever exists as fallback
- For each: Numbers 3, 6, 8, 9 → **F**
- For each: Numbers 2, 7 → **A**
- All others → **Neutral**
- Max 2 address grades (one per level)

### Final Report Card

- Count ONLY F's across all pillars
- **A's do NOT offset F's**
- 10+ F's → Grade F
- 7–9 F's → Grade D
- 3–6 F's → Grade B
- 0–2 F's → Grade A

---

## Validation Rules

1. Diagnostic requires natal chart result (Pillar 1 depends on planet house data)
2. Diagnostic requires transit result (Pillar 2A depends on transit house data)
3. Diagnostic requires life path result (Pillar 2B depends on personal year)
4. If relocation data is unavailable, Pillar 3A is skipped (0 F's from that section)
5. If address data is unavailable, Pillar 3B is skipped (0 F's from that section)
6. Diagnostic failure does NOT prevent other results from displaying

---

## Display Requirements

1. Report card section appears at the TOP of results page (before individual calculators)
2. Final grade displayed as large badge with color coding:
   - A = Green
   - B = Blue
   - D = Orange/Amber
   - F = Red
3. Each pillar is a separate collapsible section (expanded by default)
4. Each evaluated planet shows: planet name, house number, grade (F/A/—)
5. F items highlighted in red, A items in green, no-grade items in gray
6. Pillar subtotals shown (F count and A count per pillar)
7. Total F count and final grade shown at top and bottom

# Feature 6: Angular Diagnostic — The Three Pillars Model

## Overview

The Angular Diagnostic is a **new grading layer** built on top of the existing 5 calculators. It evaluates a person across 3 Pillars (Structure, Timing, Environment) by checking whether malefic or benefic planets fall in **Pheydrus Angular Houses** (1, 5, 7, 10, 11). The final output is a report card grade (A/B/D/F) based solely on the total count of F's.

**Critical**: This does NOT modify any existing calculator logic. It is a pure consumer of existing outputs plus one new computation (natal planet-house extraction at destination for Pillar 3A).

---

## Source Documents

- `New_Info/Angular_Diagnostic_Sheet.pdf` — High-level 3-pillar summary
- `New_Info/MASTER CALCULATOR SPECIFICATION.pdf` — Detailed spec with acceptance criteria
- `New_Info/Rising Sign x Outer Planet Transits x Atrocartography.xlsx` — Transit house reference table

---

## Core IP Rules

### Pheydrus Angular Houses

```
{1, 5, 7, 10, 11}
```

**This is NOT the traditional astrology definition** (which is {1, 4, 7, 10}). House 4 is NOT angular in Pheydrus. Houses 5 and 11 ARE angular.

### Grading Rule (All Pillars)

- Malefic planet in angular house → **F** (Pressure)
- Benefic planet in angular house → **A** (Support)
- Planet NOT in angular house → **No grade** (ignored)

### Final Report Card

- Only F's determine the final grade. **A's do NOT offset F's.**

```
Total F's ≥ 10  → Final Grade = F
Total F's 7–9   → Final Grade = D
Total F's 3–6   → Final Grade = B
Total F's ≤ 2   → Final Grade = A
```

---

## Planet Classifications Per Pillar

> **OWNER OVERRIDE**: The following classifications take precedence over the source PDFs.
> Mars is malefic in Pillars 1 and 3. Neptune is malefic in all 3 Pillars.
> Jupiter is benefic in all 3 Pillars. Sun is benefic in all 3 Pillars.

### Pillar 1 — STRUCTURE (Natal)

| Classification            | Planets                              |
| ------------------------- | ------------------------------------ |
| **Malefic** (angular → F) | Pluto, Saturn, Uranus, Mars, Neptune |
| **Benefic** (angular → A) | Sun, Moon, Venus, Jupiter            |

### Pillar 2 — TIMING (Transits)

| Classification                                          | Planets                        |
| ------------------------------------------------------- | ------------------------------ |
| **Malefic** (angular → F)                               | Neptune, Pluto, Saturn, Uranus |
| **Benefic** (captured, **NOT scored** — short duration) | Sun, Moon, Venus, Jupiter      |

Note: Mars is NOT a transit malefic. Transit benefics are displayed but do not contribute to the F count.

### Pillar 3 — ENVIRONMENT (Relocation)

| Classification            | Planets                              |
| ------------------------- | ------------------------------------ |
| **Malefic** (angular → F) | Neptune, Pluto, Saturn, Uranus, Mars |
| **Benefic** (angular → A) | Sun, Moon, Venus, Jupiter            |

---

## Gap Analysis: What Exists vs. What's Needed

### Already Available (no changes needed)

| Data Needed                   | Source                                            | Status                    |
| ----------------------------- | ------------------------------------------------- | ------------------------- |
| Natal planet house placements | `natalChartCalculator` → `planets[].house`        | ✅ Available (whole sign) |
| Transit planet house numbers  | `transitsCalculator` → `transits[].houseNumber`   | ✅ Available              |
| Personal Year (Life Cycle)    | `lifePathCalculator` → `personalYear`             | ✅ Available              |
| Address numerology levels     | `addressNumerologyCalculator` → `levels[].number` | ✅ Available              |

### Gap: Pillar 3A — Planet Houses at Destination Location

The **relocation calculator** internally computes planet-to-house mappings at the destination, but only exposes `angularHits` (planets on traditional angles: houses 1, 4, 7, 10) and `businessHouseActivations` (houses 2, 6, 10). It does NOT expose planets in houses 5 or 11.

**Solution**: Create a small utility function `computePlanetHousesForLocation()` that reuses existing Swiss Ephemeris functions (`getPlanetLongitudes`, `getAngles`, `assignWholeSignHouses`) to compute planet-house mappings for any location. This avoids modifying the tested relocation calculator.

### Note on the Master Spec's "Missing Capability" Claim

The Master Spec states: _"The Natal Chart Calculator does NOT provide natal house placements for planets. Only provides Ascendant sign."_

**This is incorrect for our implementation.** Our natal chart calculator DOES return `house` for each planet via `assignWholeSignHouses()`. Pillar 1 can be fully automated without any new natal computation module.

---

## Resolved Clarifications

### Address Grading — RESOLVED

Grade **both** L1 (Unit Number) and L3 (Street Name) from the existing address calculator output if available. Each contributes its own F/A/Neutral. If only one is available, use that one. The existing address calculator already computes Chaldean numerology for both — the diagnostic just reads the results by level name.

- Find level with `name === "Unit Number"` → grade its `.number`
- Find level with `name === "Street Name"` → grade its `.number`
- Max possible F's from address: 2 (one per level)

### Address Master Numbers (11, 22, 33)

The address grading rules specify numbers 1–9 only. If L1 or L3 reduces to a master number:

- Reduce master numbers to single digit for grading purposes (11→2, 22→4, 33→6)
- This means 11 → 2 → A, 22 → 4 → Neutral, 33 → 6 → F

### Life Cycle Master Numbers

The existing `personalYear` calculator preserves master numbers (11, 22, 33).

- Reduce to single digit (1–9) for Life Cycle grading
- Master number 11 → 2 → Neutral, 22 → 4 → F, 33 → 6 → Neutral

### North Node / South Node in Transits

The transit calculator includes North Node and South Node. The Three Pillars spec does NOT mention them.

- Ignore nodes. Only grade Neptune, Pluto, Saturn, Uranus.

---

## Implementation Plan

### Step 1 — Define Models & Constants

**File**: `src/models/diagnostic.ts`

```typescript
// Grade types
type PillarGrade = 'F' | 'A' | 'Neutral';
type FinalGrade = 'A' | 'B' | 'D' | 'F';

// Individual grade item (one planet/factor evaluated)
interface GradeItem {
  source: string; // e.g., "Natal Pluto in House 10"
  pillar: 1 | 2 | 3;
  section: string; // "Natal Angular" | "Transit Angular" | "Life Cycle" | "Relocation Angular" | "Address"
  planet?: string; // Planet name (if applicable)
  house?: number; // House number (if applicable)
  grade: PillarGrade;
  reason: string; // Human-readable: "Malefic Pluto in angular house 10 → F"
}

// Per-pillar summary
interface PillarSummary {
  pillar: 1 | 2 | 3;
  name: string; // "Structure" | "Timing" | "Environment"
  description: string; // "What you were born with" etc.
  fCount: number;
  aCount: number;
  items: GradeItem[];
}

// Full diagnostic result
interface AngularDiagnosticResult {
  pillars: [PillarSummary, PillarSummary, PillarSummary];
  totalFs: number;
  totalAs: number; // For display only — does NOT affect final grade
  finalGrade: FinalGrade;
  allItems: GradeItem[];
}
```

**File**: `src/utils/data/diagnosticConstants.ts`

```typescript
// Pheydrus Angular Houses (NOT traditional {1,4,7,10})
export const PHEYDRUS_ANGULAR_HOUSES = new Set([1, 5, 7, 10, 11]);

// Planet classifications per pillar (OWNER OVERRIDE — takes precedence over PDFs)
export const PILLAR_1_MALEFICS = new Set(['Pluto', 'Saturn', 'Uranus', 'Mars', 'Neptune']);
export const PILLAR_1_BENEFICS = new Set(['Sun', 'Moon', 'Venus', 'Jupiter']);

export const PILLAR_2_MALEFICS = new Set(['Neptune', 'Pluto', 'Saturn', 'Uranus']);
export const PILLAR_2_BENEFICS = new Set(['Sun', 'Moon', 'Venus', 'Jupiter']); // Captured but NOT scored

export const PILLAR_3_MALEFICS = new Set(['Neptune', 'Pluto', 'Saturn', 'Uranus', 'Mars']);
export const PILLAR_3_BENEFICS = new Set(['Sun', 'Moon', 'Venus', 'Jupiter']);

// Life Cycle grading
export const LIFE_CYCLE_F_YEARS = new Set([1, 4, 9]);
export const LIFE_CYCLE_A_YEARS = new Set([5]);

// Address grading
export const ADDRESS_F_NUMBERS = new Set([3, 6, 8, 9]);
export const ADDRESS_A_NUMBERS = new Set([2, 7]);

// Final grade thresholds
export const GRADE_THRESHOLDS = {
  F: 10, // >= 10 F's
  D: 7, // 7-9 F's
  B: 3, // 3-6 F's
  A: 0, // 0-2 F's
};
```

**Acceptance Criteria**:

- [ ] All types compile with no errors
- [ ] Planet lists match the spec exactly per pillar
- [ ] Angular houses = {1, 5, 7, 10, 11}

---

### Step 2 — Create Destination Planet-House Utility

**File**: `src/utils/astro/destinationHouses.ts`

Purpose: Compute planet-to-house mappings at an arbitrary location using birth date/time. This fills the gap for Pillar 3A where we need planet houses at the user's current city.

```typescript
import { getPlanetLongitudes, getAngles } from './swephClient';
import { assignWholeSignHouses } from './houses';
import { birthLocalToJulianDay } from './time';

interface DestinationHouseInput {
  // Birth date/time (determines planet positions)
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  birthTimeZone: string;
  // Destination coordinates (determines house cusps)
  destinationLatitude: number;
  destinationLongitude: number;
}

interface PlanetHouseResult {
  planet: string;
  house: number; // 1-12
}

export async function computePlanetHousesAtDestination(
  input: DestinationHouseInput
): Promise<PlanetHouseResult[]> {
  // 1. Get Julian Day from birth date/time
  const jdUT = birthLocalToJulianDay(input, input.birthTimeZone);

  // 2. Get planet longitudes (same for any location — only depends on time)
  const planetLons = await getPlanetLongitudes(jdUT);

  // 3. Get angles at DESTINATION (this is what changes with location)
  const angles = await getAngles(jdUT, input.destinationLatitude, input.destinationLongitude, 'W');

  // 4. Assign whole sign houses using destination Ascendant
  const planetsForHouse = Object.entries(planetLons).map(([key, lon]) => ({ key, lon }));
  const withHouses = assignWholeSignHouses(angles.asc, planetsForHouse);

  return withHouses.map((p) => ({ planet: p.key, house: p.house }));
}
```

**Acceptance Criteria**:

- [ ] Returns house (1-12) for all planets at any destination
- [ ] Reuses existing Swiss Ephemeris functions (no new dependencies)
- [ ] Async (Swiss Ephemeris WASM is async)
- [ ] Same planet positions as natal chart calculator (same birth date/time)
- [ ] Different house assignments than natal chart (different coordinates)

---

### Step 3 — Build the Three Pillars Grading Engine

**File**: `src/services/diagnostic/threePillarsGrader.ts`

This is the core engine. It takes consolidated calculator results + destination planet houses and produces the `AngularDiagnosticResult`.

```
Input:
  - NatalChartResult (Pillar 1: planets[].house)
  - TransitsResult (Pillar 2A: transits[].houseNumber)
  - LifePathResult (Pillar 2B: personalYear)
  - PlanetHouseResult[] (Pillar 3A: destination planet houses)
  - AddressNumerologyResult (Pillar 3B: levels[].number)

Output:
  - AngularDiagnosticResult
```

#### Pillar 1 — Structure (Natal Angular)

```
FOR each planet in natalChartResult.planets:
  IF planet.house ∈ PHEYDRUS_ANGULAR_HOUSES:
    IF planet.name ∈ PILLAR_1_MALEFICS → grade = F
    ELSE IF planet.name ∈ PILLAR_1_BENEFICS → grade = A
    ELSE → skip (Mercury, nodes, asteroids, etc.)
```

Evaluated planets: Pluto, Saturn, Uranus, Mars, Neptune, Sun, Moon, Venus, Jupiter (9 total).
Max possible F's from Pillar 1: 5 (all malefics in angular houses).
Max possible A's from Pillar 1: 4 (all benefics in angular houses).

#### Pillar 2A — Timing: Transit Angular

```
FOR each transit in transitsResult.transits:
  IF transit.planet ∈ PILLAR_2_MALEFICS
    AND transit.houseNumber ∈ PHEYDRUS_ANGULAR_HOUSES:
      grade = F
```

Evaluated planets: Neptune, Pluto, Saturn, Uranus (4 total).
Benefic transits are captured for display but NOT graded.
Max possible F's from Pillar 2A: 4.

#### Pillar 2B — Timing: Life Cycle

```
lifecycleYear = personalYear
IF lifecycleYear > 9:
  reduce to single digit (e.g., 11→2, 22→4, 33→6)

IF lifecycleYear ∈ {1, 4, 9} → grade = F
ELSE IF lifecycleYear == 5 → grade = A
ELSE → grade = Neutral
```

Max possible F's from Pillar 2B: 1.

#### Pillar 3A — Environment: Relocation Angular

```
FOR each planetHouse in destinationPlanetHouses:
  IF planetHouse.house ∈ PHEYDRUS_ANGULAR_HOUSES:
    IF planetHouse.planet ∈ PILLAR_3_MALEFICS → grade = F
    ELSE IF planetHouse.planet ∈ PILLAR_3_BENEFICS → grade = A
    ELSE → skip
```

Evaluated planets: Neptune, Pluto, Saturn, Uranus, Mars (malefic), Sun, Moon, Venus, Jupiter (benefic).
Max possible F's from Pillar 3A: 5 (all malefics in angular houses).

#### Pillar 3B — Environment: Address

```
// Grade BOTH L1 (Unit Number) and L3 (Street Name) if available
FOR each level in addressNumerologyResult.levels:
  IF level.name === "Unit Number" OR level.name === "Street Name":
    number = level.number
    IF number > 9: reduce to single digit (master numbers → single digit)
    IF number ∈ {3, 6, 8, 9} → grade = F
    ELSE IF number ∈ {2, 7} → grade = A
    ELSE → grade = Neutral
```

Max possible F's from Pillar 3B: 2 (one from L1, one from L3).

#### Final Grade Calculation

```
totalFs = sum of all F grades across pillars 1 + 2A + 2B + 3A + 3B

IF totalFs >= 10 → "F"
ELSE IF totalFs >= 7 → "D"
ELSE IF totalFs >= 3 → "B"
ELSE → "A"
```

**Theoretical max F's**: 5 (P1) + 4 (P2A) + 1 (P2B) + 5 (P3A) + 2 (P3B) = **17 possible F's**.

**Acceptance Criteria**:

- [ ] Only F counts determine final grade (A's are informational only)
- [ ] Planet classifications match spec exactly per pillar
- [ ] Angular houses checked are {1, 5, 7, 10, 11} (NOT traditional {1, 4, 7, 10})
- [ ] Transit benefics are captured but NOT scored
- [ ] Neptune is malefic in ALL 3 pillars
- [ ] Mars is malefic in Pillar 1 and Pillar 3 (not Pillar 2)
- [ ] Jupiter is benefic in ALL 3 pillars
- [ ] Address grades both L1 (Unit Number) and L3 (Street Name) if available
- [ ] Life cycle reduces master numbers to 1-9 before grading
- [ ] Grade thresholds: ≥10→F, 7-9→D, 3-6→B, ≤2→A

---

### Step 4 — Create the Diagnostic Orchestrator

**File**: `src/services/diagnostic/diagnosticOrchestrator.ts`

This coordinates running the Three Pillars grading after the 5 calculators complete.

```typescript
import { computePlanetHousesAtDestination } from '../../utils/astro/destinationHouses';
import { gradeThreePillars } from './threePillarsGrader';

export async function runAngularDiagnostic(
  consolidatedResults: ConsolidatedResults,
  formData: FormData
): Promise<AngularDiagnosticResult> {
  // 1. Compute destination planet houses (for Pillar 3A)
  const destinationHouses = await computePlanetHousesAtDestination({
    year,
    month,
    day,
    hour,
    minute, // from formData.dateOfBirth + timeOfBirth
    birthTimeZone, // from formData.birthLocation
    destinationLatitude, // from formData.currentLocation
    destinationLongitude, // from formData.currentLocation
  });

  // 2. Run the grading engine
  return gradeThreePillars({
    natalChart: consolidatedResults.calculators.natalChart,
    transits: consolidatedResults.calculators.transits,
    lifePath: consolidatedResults.calculators.lifePath,
    destinationPlanetHouses: destinationHouses,
    addressNumerology: consolidatedResults.calculators.addressNumerology,
  });
}
```

**Integration with existing orchestrator**:
The existing `calculatorOrchestrator` (Feature 3) runs all 5 calculators via `Promise.all`. The diagnostic grading runs AFTER the 5 calculators complete (it consumes their results). The flow becomes:

```
FormData
  → calculatorOrchestrator.runAllCalculators()
    → [5 calculators in parallel]
    → ConsolidatedResults
  → diagnosticOrchestrator.runAngularDiagnostic()
    → computePlanetHousesAtDestination()  (async, ~100ms)
    → gradeThreePillars()                 (sync, instant)
    → AngularDiagnosticResult
  → Final output includes both ConsolidatedResults + AngularDiagnosticResult
```

**Model update**: Add diagnostic result to the consolidated output:

```typescript
// In src/models/calculators.ts — add to ConsolidatedResults:
interface ConsolidatedResults {
  // ... existing fields ...
  diagnostic?: AngularDiagnosticResult; // New field
}
```

**Acceptance Criteria**:

- [ ] Diagnostic runs AFTER all 5 calculators complete (depends on their results)
- [ ] destination planet houses computed using birth date/time + current location coordinates
- [ ] If any required calculator result is null, diagnostic gracefully skips that pillar section
- [ ] Diagnostic failure does NOT fail the entire calculator pipeline (non-blocking)
- [ ] Total added latency < 200ms (only one additional Swiss Ephemeris call)

---

### Step 5 — Results UI: Report Card Component

**File**: `src/components/results/AngularDiagnosticResults.tsx`

Display the Three Pillars report card in the results dashboard.

#### Layout Structure:

```
┌─────────────────────────────────────────────────┐
│  ANGULAR DIAGNOSTIC — REPORT CARD               │
│                                                  │
│  ┌──────────┐  Final Grade: [A/B/D/F]           │
│  │    B     │  Total F's: 5                      │
│  │          │  Total A's: 3 (informational)      │
│  └──────────┘                                    │
│                                                  │
│  ── PILLAR 1: STRUCTURE ──                       │
│  "What you were born with"                       │
│  ┌──────────────────────────────────────┐        │
│  │ Natal Pluto    │ House 10 │ F       │        │
│  │ Natal Saturn   │ House 7  │ F       │        │
│  │ Natal Venus    │ House 1  │ A       │        │
│  │ Natal Jupiter  │ House 3  │ —       │        │
│  └──────────────────────────────────────┘        │
│  Pillar 1 F's: 2 | A's: 1                       │
│                                                  │
│  ── PILLAR 2: TIMING ──                          │
│  "What is happening now"                         │
│  Section A: Transit Angular                      │
│  ┌──────────────────────────────────────┐        │
│  │ Transit Pluto  │ House 11 │ F       │        │
│  │ Transit Neptune│ House 1  │ F       │        │
│  │ Transit Saturn │ House 1  │ F       │        │
│  │ Transit Uranus │ House 3  │ —       │        │
│  └──────────────────────────────────────┘        │
│  Section B: Life Cycle                           │
│  ┌──────────────────────────────────────┐        │
│  │ Personal Year: 4 → F                │        │
│  └──────────────────────────────────────┘        │
│  Pillar 2 F's: 4 | A's: 0                       │
│                                                  │
│  ── PILLAR 3: ENVIRONMENT ──                     │
│  "Where you are living"                          │
│  Section A: Relocation Angular                   │
│  ┌──────────────────────────────────────┐        │
│  │ Env Neptune    │ House 7  │ F       │        │
│  │ Env Saturn     │ House 5  │ F       │        │
│  │ Env Venus      │ House 10 │ A       │        │
│  └──────────────────────────────────────┘        │
│  Section B: Address                              │
│  ┌──────────────────────────────────────┐        │
│  │ Unit Number (L1): 8 → F             │        │
│  │ Street Name (L3): 3 → F             │        │
│  └──────────────────────────────────────┘        │
│  Pillar 3 F's: 3 | A's: 1                       │
│                                                  │
│  ─────────────────────────────────────           │
│  TOTAL: 9 F's → Grade D                         │
└─────────────────────────────────────────────────┘
```

**Visual Design**:

- F grades: Red background/text
- A grades: Green background/text
- Neutral/No grade: Gray
- Final grade: Large badge with color coding (A=green, B=blue, D=orange, F=red)
- Each pillar as a collapsible section (expanded by default)

**Acceptance Criteria**:

- [ ] Shows all 3 pillars with their individual F/A counts
- [ ] Shows every graded item (planet + house + grade)
- [ ] Shows non-angular planets as "—" (no grade)
- [ ] Final grade prominently displayed
- [ ] Color coding for F (red) and A (green)
- [ ] Responsive layout (mobile-friendly)

---

### Step 6 — PDF Integration

Add the Angular Diagnostic report card to the existing PDF export template.

**File**: Update `src/services/pdfExport/pdfTemplate.ts`

Add a new section to the PDF that renders the report card. This section should appear FIRST in the PDF (it's the primary output) before the individual calculator results.

**Acceptance Criteria**:

- [ ] Report card appears in PDF export
- [ ] Positioned as first section (before individual calculator results)
- [ ] Color coding preserved in PDF (red F's, green A's)
- [ ] Grade thresholds table included for reference

---

## File Summary

### New Files

| File                                                  | Purpose                                                  |
| ----------------------------------------------------- | -------------------------------------------------------- |
| `src/models/diagnostic.ts`                            | Types: GradeItem, PillarSummary, AngularDiagnosticResult |
| `src/utils/data/diagnosticConstants.ts`               | Planet lists, angular houses, thresholds per pillar      |
| `src/utils/astro/destinationHouses.ts`                | Compute planet houses at any location                    |
| `src/services/diagnostic/threePillarsGrader.ts`       | Core grading engine                                      |
| `src/services/diagnostic/diagnosticOrchestrator.ts`   | Orchestrates diagnostic after calculator pipeline        |
| `src/services/diagnostic/index.ts`                    | Barrel exports                                           |
| `src/components/results/AngularDiagnosticResults.tsx` | Report card UI component                                 |

### Modified Files

| File                                                   | Change                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| `src/models/calculators.ts`                            | Add `diagnostic?: AngularDiagnosticResult` to `ConsolidatedResults` |
| `src/services/orchestration/calculatorOrchestrator.ts` | Call diagnostic after 5 calculators                                 |
| `src/views/ResultsPage.tsx`                            | Add AngularDiagnosticResults component                              |
| `src/services/pdfExport/pdfTemplate.ts`                | Add report card section to PDF                                      |

### NOT Modified (existing calculator logic preserved)

- `src/services/calculators/natalChartCalculator.ts` — unchanged
- `src/services/calculators/transitsCalculator.ts` — unchanged
- `src/services/calculators/lifePathCalculator.ts` — unchanged
- `src/services/calculators/relocationCalculator.ts` — unchanged
- `src/services/calculators/addressNumerologyCalculator.ts` — unchanged

---

## Implementation Order

```
Step 1: Models & Constants        (no dependencies)
Step 2: Destination House Utility  (depends on existing astro utils)
Step 3: Grading Engine            (depends on Steps 1 + 2)
Step 4: Diagnostic Orchestrator   (depends on Step 3 + existing orchestrator)
Step 5: Results UI                (depends on Step 1 models)
Step 6: PDF Integration           (depends on Step 5)
```

Steps 1 + 2 can be done in parallel.
Steps 5 + 6 can be done in parallel (after Step 3).

---

## Testing Strategy

### Unit Tests

1. **Grading Engine** (`threePillarsGrader.test.ts`):
   - Test each pillar independently with mock data
   - Test planet in angular house (1, 5, 7, 10, 11) produces correct grade
   - Test planet NOT in angular house produces no grade
   - Test correct malefic/benefic classification per pillar
   - Test Neptune is malefic in all 3 pillars
   - Test Mars is malefic in P1 and P3 (not P2)
   - Test Jupiter is benefic in all 3 pillars
   - Test transit benefics are NOT scored
   - Test life cycle: years 1, 4, 9 → F; year 5 → A; others → neutral
   - Test address: numbers 3, 6, 8, 9 → F; 2, 7 → A; others → neutral
   - Test final grade thresholds: 0→A, 2→A, 3→B, 6→B, 7→D, 9→D, 10→F, 14→F
   - Test A's do not offset F's

2. **Destination Houses** (`destinationHouses.test.ts`):
   - Test returns all planets with valid house numbers (1-12)
   - Test different coordinates produce different house assignments
   - Test same birth time produces same planet positions regardless of destination

3. **Constants** (`diagnosticConstants.test.ts`):
   - Test angular houses set contains exactly {1, 5, 7, 10, 11}
   - Test planet sets match spec

### Integration Tests

4. **End-to-end diagnostic flow** with known birth data:
   - Verify against manually computed expected grades
   - Use the transit reference table from the Excel to validate transit house assignments

---

## Appendix: Transit Reference Table (from Excel)

Current outer planet positions (as of 2025):

| Rising Sign | Pluto (Aquarius) | Neptune (Aries) | Saturn (Aries) | Uranus (Gemini) |
| ----------- | ---------------- | --------------- | -------------- | --------------- |
| Aries       | 11th ★           | 1st ★           | 1st ★          | 3rd             |
| Taurus      | 10th ★           | 12th            | 12th           | 2nd             |
| Gemini      | 9th              | 11th ★          | 11th ★         | 1st ★           |
| Cancer      | 8th              | 10th ★          | 10th ★         | 12th            |
| Leo         | 7th ★            | 9th             | 9th            | 11th ★          |
| Virgo       | 6th              | 8th             | 8th            | 10th ★          |
| Libra       | 5th ★            | 7th ★           | 7th ★          | 9th             |
| Scorpio     | 4th              | 6th             | 6th            | 8th             |
| Sagittarius | 3rd              | 5th ★           | 5th ★          | 7th ★           |
| Capricorn   | 2nd              | 4th             | 4th            | 6th             |
| Aquarius    | 1st ★            | 3rd             | 3rd            | 5th ★           |
| Pisces      | 12th             | 2nd             | 2nd            | 4th             |

★ = In Pheydrus Angular House (1, 5, 7, 10, 11) → F for these malefic transits

**Example**: Aries rising has Pluto in 11th (F), Neptune in 1st (F), Saturn in 1st (F), Uranus in 3rd (no grade) = **3 transit F's**.

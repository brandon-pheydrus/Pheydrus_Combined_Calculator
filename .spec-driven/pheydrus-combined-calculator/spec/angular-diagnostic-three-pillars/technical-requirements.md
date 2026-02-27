# Feature 6: Angular Diagnostic — Technical Requirements

## Architecture

The Angular Diagnostic is a **read-only grading layer** that sits on top of the existing 5 calculators. It does NOT modify any existing calculator logic.

```
Existing Pipeline (unchanged):
  FormData → [5 Calculators in parallel] → ConsolidatedResults

New Addition:
  ConsolidatedResults + FormData
    → computePlanetHousesAtDestination() (async, Swiss Ephemeris)
    → gradeThreePillars() (sync)
    → AngularDiagnosticResult
    → Attached to ConsolidatedResults.diagnostic
```

---

## New Files

### 1. `src/models/diagnostic.ts` — Type Definitions

```typescript
export type PillarGrade = 'F' | 'A' | 'Neutral';
export type FinalGrade = 'A' | 'B' | 'D' | 'F';

export interface GradeItem {
  source: string; // Human-readable label, e.g. "Natal Pluto in House 10"
  pillar: 1 | 2 | 3;
  section: 'Natal Angular' | 'Transit Angular' | 'Life Cycle' | 'Relocation Angular' | 'Address';
  planet?: string;
  house?: number;
  grade: PillarGrade;
  reason: string; // e.g. "Malefic in angular house 10"
}

export interface PillarSummary {
  pillar: 1 | 2 | 3;
  name: 'Structure' | 'Timing' | 'Environment';
  description: string;
  fCount: number;
  aCount: number;
  items: GradeItem[];
}

export interface AngularDiagnosticResult {
  pillars: [PillarSummary, PillarSummary, PillarSummary];
  totalFs: number;
  totalAs: number;
  finalGrade: FinalGrade;
  allItems: GradeItem[];
}
```

### 2. `src/utils/data/diagnosticConstants.ts` — Classification Data

All planet classification sets, angular house definition, life cycle grading rules, address grading rules, and final grade thresholds. See IMPLEMENTATION_PLAN.md Step 1 for full listing.

**Key difference from existing constants.ts**:

- Existing `MALEFIC_PLANETS` = Mars, Saturn, Pluto
- Existing `BENEFIC_PLANETS` = Venus, Jupiter, Sun, Moon
- These are NOT used by the diagnostic. Each pillar has its OWN classification:
  - P1 malefics: Pluto, Saturn, Uranus, Mars, Neptune
  - P2 malefics: Neptune, Pluto, Saturn, Uranus
  - P3 malefics: Neptune, Pluto, Saturn, Uranus, Mars
  - All pillar benefics: Sun, Moon, Venus, Jupiter (P2 benefics captured but not scored)

### 3. `src/utils/astro/destinationHouses.ts` — Planet House Computation

Reuses existing Swiss Ephemeris functions:

- `getPlanetLongitudes(jdUT)` — planet ecliptic longitudes (time-dependent only)
- `getAngles(jdUT, lat, lon, hsys)` — house cusps at destination (location-dependent)
- `assignWholeSignHouses(ascLon, planets)` — whole sign house assignment
- `birthLocalToJulianDay(date, time, tz)` — time conversion

Returns `PlanetHouseResult[]` where each entry is `{ planet: string, house: number }`.

### 4. `src/services/diagnostic/threePillarsGrader.ts` — Core Grading Engine

Pure function (no side effects, no async). Takes calculator outputs and returns grades.

```typescript
interface GraderInput {
  natalChart: NatalChartResult | null;
  transits: TransitsResult | null;
  lifePath: LifePathResult | null;
  destinationPlanetHouses: PlanetHouseResult[] | null;
  addressNumerology: AddressNumerologyResult | null;
}

export function gradeThreePillars(input: GraderInput): AngularDiagnosticResult;
```

**Null handling**: If a section's input is null, that section contributes 0 F's and 0 A's.

### 5. `src/services/diagnostic/diagnosticOrchestrator.ts` — Orchestration

Async wrapper that:

1. Computes destination planet houses (async)
2. Calls the grading engine (sync)
3. Returns `AngularDiagnosticResult`

### 6. `src/services/diagnostic/index.ts` — Barrel Export

```typescript
export { runAngularDiagnostic } from './diagnosticOrchestrator';
export { gradeThreePillars } from './threePillarsGrader';
```

### 7. `src/components/results/AngularDiagnosticResults.tsx` — UI Component

React component that takes `AngularDiagnosticResult` as prop and renders the report card. Uses Tailwind CSS consistent with existing results components.

---

## Modified Files

### `src/models/calculators.ts`

Add diagnostic to consolidated results:

```typescript
interface ConsolidatedResults {
  // ... existing fields unchanged ...
  diagnostic?: AngularDiagnosticResult;
}
```

### `src/services/orchestration/calculatorOrchestrator.ts`

After 5 calculators complete, run diagnostic:

```typescript
// After Promise.all completes and results are consolidated:
try {
  const diagnostic = await runAngularDiagnostic(consolidatedResults, formData);
  consolidatedResults.diagnostic = diagnostic;
} catch (e) {
  // Diagnostic failure is non-blocking — log and continue
  console.warn('Angular diagnostic failed:', e);
}
```

### `src/views/ResultsPage.tsx`

Add `<AngularDiagnosticResults />` component, positioned BEFORE existing calculator sections.

### `src/services/pdfExport/pdfTemplate.ts`

Add report card HTML section to PDF template, positioned as first content section.

---

## Data Flow Detail

### Pillar 1 Data Path

```
natalChartResult.planets
  → filter by planet name ∈ (PILLAR_1_MALEFICS ∪ PILLAR_1_BENEFICS)
  → for each: check planet.house ∈ PHEYDRUS_ANGULAR_HOUSES
  → assign grade F or A
```

**Planet name mapping**: The natal chart returns `planet.planet.en` which is "Sun", "Moon", "Pluto", etc. Match directly against the constant sets.

### Pillar 2A Data Path

```
transitsResult.transits
  → filter by transit.planet ∈ PILLAR_2_MALEFICS
  → for each: check transit.houseNumber ∈ PHEYDRUS_ANGULAR_HOUSES
  → assign grade F
```

**Planet name mapping**: Transit calculator uses planet names like "Pluto", "Neptune", etc. Match directly.

### Pillar 2B Data Path

```
lifePathResult.personalYear
  → if > 9: reduce to single digit via reduceToSingleDigitOnly()
  → check against LIFE_CYCLE_F_YEARS / LIFE_CYCLE_A_YEARS
  → assign grade F, A, or Neutral
```

### Pillar 3A Data Path

```
computePlanetHousesAtDestination(formData)
  → returns [{planet: "Pluto", house: 7}, {planet: "Neptune", house: 1}, ...]
  → filter by planet name ∈ (PILLAR_3_MALEFICS ∪ PILLAR_3_BENEFICS)
    PILLAR_3_MALEFICS = Neptune, Pluto, Saturn, Uranus, Mars
    PILLAR_3_BENEFICS = Sun, Moon, Venus, Jupiter
  → for each: check house ∈ PHEYDRUS_ANGULAR_HOUSES
  → assign grade F or A
```

### Pillar 3B Data Path

```
addressNumerologyResult.levels
  → find levels with name === "Unit Number" AND/OR name === "Street Name"
  → for each found level:
    → get its .number property
    → if master number: reduce to single digit
    → check against ADDRESS_F_NUMBERS / ADDRESS_A_NUMBERS
    → assign grade F, A, or Neutral
  → produces 0, 1, or 2 grade items
```

---

## Performance Considerations

- Grading engine is pure computation (~1ms)
- Destination house calculation requires one Swiss Ephemeris call (~100ms)
- Total added latency: ~100-200ms (negligible vs existing calculator pipeline)
- No additional network calls or data loading

---

## Error Handling

- If natal chart result is null → Pillar 1 produces 0 grades, warns user
- If transit result is null → Pillar 2A produces 0 grades, warns user
- If life path result is null → Pillar 2B produces 0 grades, warns user
- If destination house computation fails → Pillar 3A produces 0 grades, warns user
- If address numerology result is null → Pillar 3B produces 0 grades, warns user
- **Diagnostic failure never blocks the rest of the results from displaying**

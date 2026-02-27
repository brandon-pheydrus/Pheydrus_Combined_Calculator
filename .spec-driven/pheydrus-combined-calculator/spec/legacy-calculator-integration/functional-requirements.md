# Functional Requirements: Legacy Calculator Integration

## Overview

Migrate all calculator functions from the existing Pheydrus Calculators repository (Next.js/CRA) to the new Vite + React + TypeScript architecture while maintaining 100% backward compatibility with calculation results and outputs.

## Scope of Integration

Five existing calculators must be integrated:

1. **Transits Calculator** - Planetary transits by rising sign
2. **Natal Chart Calculator** - Birth chart analysis (from astro app)
3. **Life Path Calculator** - Numerological life path number
4. **Relocation Calculator** - Astrocartography analysis for location changes
5. **Address Numerology Calculator** - Numerological analysis of address fields

## User Stories

### US-1: Import Transits Calculator Logic

**As a** developer
**I want** the transits calculation logic migrated to the new project
**So that** planetary transit data is available for the unified calculator

**Acceptance Criteria:**

- [ ] Rising sign input accepted (12 zodiac signs)
- [ ] Current planetary transits calculated for each planet
- [ ] Past planetary transits calculated for each planet
- [ ] House placement determined based on rising sign
- [ ] Output format matches original: {planet, current sign, past sign, house}
- [ ] All planet data (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) included
- [ ] Results are identical to original calculator within rounding tolerance

**Example:**

- Input: Rising sign = "Aries"
- Output: Planetary positions for each planet in current houses and past houses

### US-2: Import Natal Chart Calculator Logic

**As a** developer
**I want** the natal chart calculation logic available
**So that** birth chart analysis is included in unified results

**Acceptance Criteria:**

- [ ] Birth date (YYYY-MM-DD) accepted
- [ ] Birth time (HH:MM) accepted
- [ ] Birth location/coordinates accepted
- [ ] Natal chart positions calculated for all planets
- [ ] Aspects between planets calculated
- [ ] Angular houses (1st, 4th, 7th, 10th) identified
- [ ] Rising sign determined from birth data
- [ ] Output includes: {planets with positions, aspects, houses, rising sign}
- [ ] Results are identical to original calculator

**Example:**

- Input: Birth date: 1990-03-15, Time: 14:30, Location: New York
- Output: Natal chart with all planet positions, aspects, houses

### US-3: Import Life Path Calculator Logic

**As a** developer
**I want** the life path calculation available
**So that** numerological life path numbers are calculated

**Acceptance Criteria:**

- [ ] Birth date (DD/MM/YYYY format or similar) accepted
- [ ] Life Path Number calculated using Chaldean numerology
- [ ] Personal Year Number calculated
- [ ] Chinese Zodiac for birth year determined
- [ ] Output includes: {life path number, personal year, chinese zodiac, descriptions}
- [ ] Results are identical to original calculator

**Example:**

- Input: Birth date: 15/03/1990
- Output: Life Path: 6, Personal Year: [current year calculation], Chinese Zodiac: Horse

### US-4: Import Relocation Calculator Logic

**As a** developer
**I want** the relocation/astrocartography logic available
**So that** location analysis is provided

**Acceptance Criteria:**

- [ ] Birth date (YYYY-MM-DD) accepted
- [ ] Birth time (HH:MM) accepted
- [ ] Birth location coordinates determined
- [ ] Destination location coordinates accepted
- [ ] Angular hits calculated (planets on angles in new location)
- [ ] House activations identified (benefic/malefic)
- [ ] Output includes: {angular hits, house activations, planet effects}
- [ ] Results are identical to original calculator

**Example:**

- Input: Birth: 1990-03-15 14:30 New York → Destination: London
- Output: Angular activations, house placements, planet effects in new location

### US-5: Import Address Numerology Calculator Logic

**As a** developer
**I want** the address numerology calculation available
**So that** address analysis is included

**Acceptance Criteria:**

- [ ] L1 field accepted (unit number)
- [ ] L2 field accepted (street name)
- [ ] Postal code accepted
- [ ] Home built year accepted
- [ ] Birth year accepted
- [ ] Chaldean numerology calculations performed for each level
- [ ] Chinese zodiac compatibility calculated between home year and birth year
- [ ] Output includes: {L1 number, L2 number, postal code number, home/birth zodiac, compatibility}
- [ ] Results are identical to original calculator
- [ ] All outputs preserved exactly as they appear in original

**Example:**

- Input: L1: 2000, L2: Main Street, Postal: 10001, Home year: 1995, Birth year: 1990
- Output: L1 number, L2 number, postal analysis, zodiac compatibility

## Shared Data & Dependencies

### Common Required Data

- **Planetary Data**: All planet positions, aspects, zodiac placements
- **House System**: Whole sign houses (or as per original implementation)
- **Zodiac Signs**: All 12 zodiac signs with degrees and characteristics
- **Numerological Constants**: Chaldean numerology system, number meanings
- **Chinese Zodiac Data**: 12-year cycle animals and compatibility

### Database/Lookup Files

- Any existing data files used in original calculators must be preserved
- Lookup tables for numerological meanings
- Planet characteristics and aspects rules
- Chinese zodiac information

## Calculation Accuracy & Quality

### Precision Requirements

- All calculations must produce identical results to the original
- Rounding: Use same rounding methodology as original
- Tolerance: Any minor differences (< 0.01%) must be documented
- Test with known birthdate examples to verify accuracy

### Error Scenarios

- Invalid date (non-existent date like Feb 30)
- Missing required fields
- Impossible time values
- Invalid location coordinates
- Invalid year values

Each should be handled with graceful error messages consistent with original.

## Data Output Format

All calculator outputs must be structured as:

```
{
  calculatorName: string,
  inputData: { [key: string]: any },
  results: {
    [resultKey]: {
      label: string,
      value: string | number | object,
      unit?: string,
      description?: string
    }
  },
  timestamp: ISO8601 string,
  isValid: boolean,
  errors?: string[]
}
```

## Performance Requirements

- Individual calculation time: < 200ms
- All 5 calculators in parallel: < 500ms total
- No blocking operations
- Memory-efficient for repeated calculations

## Testing Strategy

- Unit tests for each calculator logic
- Input validation tests
- Output accuracy tests (compare with original)
- Edge case tests
- Performance benchmarks

## Notes

- Prioritize exact replication of results over code optimization
- Document any differences from original
- Keep original logic intact, wrap if needed
- Do not modify calculation methods unless bug is found
- All existing outputs must be preserved and displayed in results

---

**Important:** The data accuracy is critical. Users trust these results. If in doubt, replicate the original exactly.

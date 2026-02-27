# Functional Requirements: All-in-One Calculator Engine

## Overview

Create a unified calculation service that triggers all 5 calculators simultaneously with form inputs and consolidates results.

## User Stories

### US-1: Execute All Calculations

**As a** user
**I want** all 5 calculations to run when I click "Calculate"
**So that** I get complete results instantly

**Acceptance Criteria:**

- [ ] All 5 calculators triggered simultaneously
- [ ] Calculations complete within 2 seconds total
- [ ] Progress indicator shown while calculating
- [ ] Results display once all complete
- [ ] No partial results displayed

### US-2: Map Form Data to Calculators

**As a** the system
**I want** form inputs mapped to each calculator's requirements
**So that** data flows correctly

**Acceptance Criteria:**

- [ ] Birth date mapped to: Astro, Life Path, Relocation, Address
- [ ] Birth time mapped to: Astro, Relocation
- [ ] Birth location mapped to: Astro, Relocation
- [ ] Current location mapped to: Relocation
- [ ] Rising sign mapped to: Transits
- [ ] Address fields mapped to: Address Calculator
- [ ] All mappings are exact matches (no transformations needed)

### US-3: Error Handling

**As a** the system
**I want** to handle calculator failures gracefully
**So that** users know what went wrong

**Acceptance Criteria:**

- [ ] If ANY calculator fails, all calculations stop
- [ ] Clear error message displayed showing which calculator failed
- [ ] Error includes reason (invalid input, calculation error, etc.)
- [ ] User can return to form and try again
- [ ] No partial results displayed on failure
- [ ] Logging captures all errors for debugging

### US-4: Result Consolidation

**As a** the system
**I want** to consolidate all results in unified format
**So that** output page can display them properly

**Acceptance Criteria:**

- [ ] All calculator results normalized to unified format
- [ ] Each result tagged with calculator name
- [ ] Results include original calculator outputs (100% preserved)
- [ ] Results include input data for reference
- [ ] Timestamp added for audit trail
- [ ] Results exportable (to pass to PDF/output page)

## Data Flow

```
Form Submission
    ↓
Validate Form Data
    ↓
Create Calculator Inputs (transform form → calculator format)
    ↓
Execute in Parallel:
  ├─ Transits Calculator
  ├─ Natal Chart Calculator
  ├─ Life Path Calculator
  ├─ Relocation Calculator
  └─ Address Numerology Calculator
    ↓
(If any fails → Stop & return error)
    ↓
Consolidate Results
    ↓
Return Unified Result Object
    ↓
Display on Results Page
```

## Result Structure

```typescript
interface ConsolidatedResults {
  success: boolean;
  timestamp: string;
  userInfo: {
    name: string;
    dateOfBirth: string;
  };
  calculators: {
    transits: TransitsResult;
    natalChart: NatalChartResult;
    lifePath: LifePathResult;
    relocation: RelocationResult;
    addressNumerology: AddressNumerologyResult;
  };
  errors?: {
    calculatorName: string;
    errorMessage: string;
  }[];
}
```

## Requirements

- All 5 calculators must complete successfully
- No partial results on failure
- Results preserve 100% of original calculator outputs
- Processing time < 2 seconds
- Clear feedback during processing
- Error handling is mandatory

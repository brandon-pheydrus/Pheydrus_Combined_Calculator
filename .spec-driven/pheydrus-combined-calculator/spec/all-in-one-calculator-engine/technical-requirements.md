# Technical Requirements: All-in-One Calculator Engine

## Architecture

```
src/
├── services/
│   └── orchestration/
│       ├── calculatorOrchestrator.ts (main orchestrator)
│       ├── resultConsolidator.ts (merge results)
│       └── inputMapper.ts (form → calculator)
└── models/
    └── ConsolidatedResults.ts
```

## Input Mapping

```typescript
// Map FormData to individual calculator inputs
function mapFormToCalculatorInputs(formData: FormData) {
  return {
    transits: {
      risingSign: formData.risingSign,
    },
    natalChart: {
      year: parseInt(formData.dateOfBirth.split('-')[0]),
      month: parseInt(formData.dateOfBirth.split('-')[1]),
      day: parseInt(formData.dateOfBirth.split('-')[2]),
      hour: parseInt(formData.timeOfBirth.split(':')[0]),
      minute: parseInt(formData.timeOfBirth.split(':')[1]),
      latitude: formData.birthLocation.latitude,
      longitude: formData.birthLocation.longitude,
    },
    lifePath: {
      birthDate: formData.dateOfBirth, // Format as needed
    },
    relocation: {
      year,
      month,
      day,
      hour,
      minute, // from dateOfBirth & timeOfBirth
      birthLocation: formData.birthLocation.coordinates,
      destinationLocation: formData.currentLocation.coordinates,
    },
    addressNumerology: {
      unitNumber: formData.l1,
      streetName: formData.l2,
      postalCode: formData.postalCode,
      homeYear: formData.homeBuiltYear,
      birthYear: formData.birthYear,
    },
  };
}
```

## Orchestrator Service

```typescript
export class CalculatorOrchestrator {
  async executeAll(formData: FormData): Promise<ConsolidatedResults> {
    // 1. Map inputs
    const inputs = mapFormToCalculatorInputs(formData);

    // 2. Execute in parallel
    try {
      const results = await Promise.all([
        transitsCalculator.calculate(inputs.transits),
        natalChartCalculator.calculate(inputs.natalChart),
        lifePathCalculator.calculate(inputs.lifePath),
        relocationCalculator.calculate(inputs.relocation),
        addressNumerologyCalculator.calculate(inputs.addressNumerology),
      ]);

      // 3. Consolidate
      return consolidateResults(results, formData);
    } catch (error) {
      return handleCalculationError(error, formData);
    }
  }
}
```

## Result Consolidation

```typescript
function consolidateResults(
  results: [
    TransitsResult,
    NatalChartResult,
    LifePathResult,
    RelocationResult,
    AddressNumerologyResult,
  ],
  formData: FormData
): ConsolidatedResults {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    userInfo: {
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      timeOfBirth: formData.timeOfBirth,
      birthLocation: formData.birthLocation.name,
      currentLocation: formData.currentLocation.name,
    },
    calculators: {
      transits: results[0],
      natalChart: results[1],
      lifePath: results[2],
      relocation: results[3],
      addressNumerology: results[4],
    },
  };
}
```

## Error Handling

```typescript
function handleCalculationError(error: Error, formData: FormData) {
  const calculatorName = identifyFailedCalculator(error);

  return {
    success: false,
    timestamp: new Date().toISOString(),
    userInfo: extractUserInfo(formData),
    error: {
      calculatorName,
      message: error.message,
      details: error.stack,
    },
  };
}
```

## Performance

- Parallel execution: All 5 calculators run simultaneously
- Target: < 2 seconds total
- No sequential dependencies (all can run at same time)
- Timeout: 10 seconds max (fail if takes longer)

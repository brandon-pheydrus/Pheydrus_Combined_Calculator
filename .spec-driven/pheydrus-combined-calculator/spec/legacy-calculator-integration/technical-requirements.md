# Technical Requirements: Legacy Calculator Integration

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js (for calculation logic)
- **Build**: Vite
- **Testing**: Vitest
- **Source**: Existing code from `/c/Work/Pheydrus/Calculators/PheydrusCalculators/`

## Architecture

```
src/
├── services/
│   └── calculators/
│       ├── transitsCalculator.ts
│       ├── natalChartCalculator.ts
│       ├── lifePathCalculator.ts
│       ├── relocationCalculator.ts
│       └── addressNumerologyCalculator.ts
├── models/
│   ├── CalculatorInput.ts
│   ├── CalculatorResult.ts
│   ├── AstroData.ts
│   └── NumerologyData.ts
├── utils/
│   ├── astro/
│   │   ├── planets.ts
│   │   ├── houses.ts
│   │   ├── aspects.ts
│   │   ├── time.ts
│   │   └── angular.ts
│   ├── numerology/
│   │   ├── chaldean.ts
│   │   ├── chineseZodiac.ts
│   │   └── compatibility.ts
│   └── data/
│       ├── planets.json
│       ├── zodiacSigns.json
│       └── numerologyMappings.json
└── __tests__/
    ├── transitsCalculator.test.ts
    ├── natalChartCalculator.test.ts
    ├── lifePathCalculator.test.ts
    ├── relocationCalculator.test.ts
    └── addressNumerologyCalculator.test.ts
```

## Imported Code Organization

### 1. Transits Calculator

**Source**: `/PheydrusCalculators/src/app/transits/page.tsx` (planet data)

**Extracted Functions**:

```typescript
// Get planetary transits for a given rising sign
function getPlanetaryTransits(risingSign: string): {
  planet: string;
  current: { sign: string; house: number };
  past: { sign: string; house: number };
}[];

// Get house number for a sign given rising sign
function getHouseForSign(risingSign: string, sign: string): number;

// Determine house classification (benefic/malefic)
function classifyPlanetEffects(planet: string): 'benefic' | 'malefic' | 'neutral';
```

**Data Structure**:

```typescript
interface PlanetaryTransit {
  planet: string;
  current: {
    sign: string;
    house: number;
  };
  past: {
    sign: string;
    house: number;
  };
  theme: string;
}

interface TransitsResult {
  calculatorName: 'transits';
  risingSign: string;
  transits: PlanetaryTransit[];
  timestamp: string;
}
```

### 2. Natal Chart Calculator

**Source**: `/PheydrusCalculators/lib/astro/natalChart.ts`

**Extracted Functions**:

```typescript
function calculateNatalChart(input: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
}): NatalChartResult;

interface NatalChartResult {
  planets: PlanetPosition[];
  aspects: Aspect[];
  houses: House[];
  risingSign: string;
  sunSign: string;
}
```

**Dependencies**: Ephemeris data, Julian day calculations, house calculations

### 3. Life Path Calculator

**Source**: `/PheydrusCalculators/src/app/life-path/` and `/src/app/numerology/utils.ts`

**Extracted Functions**:

```typescript
function chaldeanNumerologyCalculator(input: string[]): number;

function personalYearNumber(birthDate: string): number;

function getChineseZodiac(year: number): string;
```

**Data Structure**:

```typescript
interface LifePathResult {
  calculatorName: 'lifePath';
  birthDate: string;
  lifePathNumber: number;
  personalYear: number;
  chineseZodiac: string;
  timestamp: string;
}
```

### 4. Relocation Calculator

**Source**: `/PheydrusCalculators/src/app/relocation/page.tsx`

**Extracted Functions**:

```typescript
function calculateRelocation(input: {
  birthDate: string;
  birthTime: string;
  birthLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
}): RelocationResult;

function findAngularHits(natalChart: NatalChartResult, destinationCoords: Coords): AngularHit[];

function classifyBusinessHouses(
  chart: NatalChartResult
): { house: number; planet: string; nature: 'benefic' | 'malefic' }[];
```

**Data Structure**:

```typescript
interface RelocationResult {
  calculatorName: 'relocation';
  birthLocation: string;
  destinationLocation: string;
  angularHits: AngularHit[];
  businessHouseActivations: HouseActivation[];
  timestamp: string;
}

interface AngularHit {
  planet: string;
  angle: string;
  house: number;
}

interface HouseActivation {
  house: number;
  planet: string;
  nature: 'benefic' | 'malefic';
}
```

### 5. Address Numerology Calculator

**Source**: `/PheydrusCalculators/src/app/numerology/page.tsx` and `utils.ts`

**Extracted Functions**:

```typescript
function calculateAddressNumerology(input: {
  unitNumber: string;
  streetName: string;
  postalCode: string;
  homeYear: string;
  birthYear: string;
}): AddressNumerologyResult;

function getLevelsArrayPublic(formData: FormData): Level[];

function areZodiacsCompatible(zodiac1: string, zodiac2: string): boolean;
```

**Data Structure**:

```typescript
interface AddressNumerologyResult {
  calculatorName: 'addressNumerology';
  levels: {
    level: string;
    description: string;
    value: string;
    number: number;
  }[];
  homeZodiac: string;
  birthZodiac: string;
  compatibility: string;
  timestamp: string;
}
```

## Database & Data Files

### Required Files (from old project)

1. **Ephemeris Data** - For natal chart calculations
2. **City Database** - `/lib/data/cities.ts` or similar
3. **Numerology Mappings** - Character to number mappings
4. **Constants Files** - All constellation, planet, aspect data
5. **Life Path Database** - `/life-path-database.txt`

### Data Import Strategy

```typescript
// Import as JSON when possible
import planetaryData from '../data/planets.json';
import zodiacData from '../data/zodiac.json';
import cities from '../data/cities.json';

// Or import TypeScript modules
import { cities } from '../lib/data/cities';
```

## API Interfaces

### Calculator Input Types

```typescript
// Transits Input
interface TransitsInput {
  risingSign: string; // One of 12 zodiac signs
}

// Natal Chart Input
interface NatalChartInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
}

// Life Path Input
interface LifePathInput {
  birthDate: string; // DD/MM/YYYY
}

// Relocation Input
interface RelocationInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  birthLocation: { latitude: number; longitude: number };
  destinationLocation: { latitude: number; longitude: number };
}

// Address Numerology Input
interface AddressNumerologyInput {
  unitNumber: string; // L1
  streetName: string; // L2
  postalCode: string;
  homeYear: string;
  birthYear: string;
}
```

### Unified Output Type

```typescript
interface CalculatorResult<T> {
  success: boolean;
  calculatorName: string;
  inputs: T;
  results: ResultItem[];
  timestamp: string;
  errors?: string[];
}

interface ResultItem {
  id: string;
  label: string;
  value: string | number | object;
  unit?: string;
  description?: string;
  category?: string;
}
```

## Import Strategy

### Step 1: Copy Core Logic

Copy astro calculation files:

- `/lib/astro/planets.ts`
- `/lib/astro/houses.ts`
- `/lib/astro/aspects.ts`
- `/lib/astro/time.ts`
- `/lib/astro/angular.ts`

Copy numerology utilities:

- Extract from `/src/app/numerology/utils.ts`
- Extract from `/src/app/life-path/page.tsx`

### Step 2: Create Service Wrappers

Create new service files that:

- Import extracted logic
- Normalize inputs to match Vite project types
- Format outputs consistently
- Add error handling

### Step 3: Data Integration

- Copy/import planetary data
- Copy/import city database
- Copy/import numerology reference tables
- Ensure data format compatibility

## Testing Strategy

### Unit Tests

Each calculator needs:

- Happy path test (valid inputs)
- Edge case tests
- Error handling tests
- Accuracy verification (compare to known results)

### Test Data

```typescript
// Example test cases with known outputs
const testCases = [
  {
    name: 'Transits - Aries Rising',
    input: { risingSign: 'Aries' },
    expectedOutput: {
      /* known result */
    },
  },
  {
    name: 'Natal Chart - Famous Birth',
    input: { year: 1990, month: 3, day: 15, hour: 14, minute: 30, lat: 40.7128, lng: -74.006 },
    expectedOutput: {
      /* known result */
    },
  },
];
```

## Migration Checklist

- [ ] All astro utilities copied and tested
- [ ] All numerology utilities copied and tested
- [ ] Planetary and zodiac data imported
- [ ] City database integrated
- [ ] Each calculator wrapped in service
- [ ] Unified output format implemented
- [ ] Type definitions created
- [ ] Error handling standardized
- [ ] All unit tests passing
- [ ] Results match original calculator ± 0.01%

## Performance Notes

- Planetary calculations are CPU-intensive
- Consider caching ephemeris calculations if repeated
- City lookup should use efficient search (indexed)
- Numerology calculations are fast, minimal optimization needed

## Files to Create

1. `src/services/calculators/transitsCalculator.ts`
2. `src/services/calculators/natalChartCalculator.ts`
3. `src/services/calculators/lifePathCalculator.ts`
4. `src/services/calculators/relocationCalculator.ts`
5. `src/services/calculators/addressNumerologyCalculator.ts`
6. `src/utils/astro/` (imported from old project)
7. `src/utils/numerology/` (extracted from old project)
8. `src/models/calculator*.ts` (type definitions)
9. `src/data/` (database files)

---

**Important Note**: Source of truth is the existing calculator functions. Do not modify calculation logic, only wrap and integrate.

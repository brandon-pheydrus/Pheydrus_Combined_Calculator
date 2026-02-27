# Implementation Plan: Pheydrus Combined Calculator — All 5 Features

## Context

The Pheydrus Combined Calculator consolidates 5 legacy Next.js calculators (Transits, Natal Chart, Life Path, Relocation, Address Numerology) into a single modern Vite + React + TypeScript app. Specs are complete. This plan coordinates all 5 features so their interfaces, file locations, and state flows are consistent with zero conflicts.

---

## Critical Design Decisions (applies to ALL features)

### 1. Shared Model Ownership

All cross-feature TypeScript interfaces are defined once in Feature 1 and imported by F2–F5:

- `src/models/calculators.ts` — all calculator input/output types + `ConsolidatedResults`
- `src/models/form.ts` — `FormData`, `CityData`, `UserInfo`
- `src/models/index.ts` — re-exports both

### 2. State Passing Strategy (F3 → F4 → F5)

Use React Router `navigate('/results', { state: { results } })` and `useLocation()` in ResultsPage. No Redux or Context needed. ResultsPage redirects to `/calculator` if `location.state` is empty (guards against direct URL access).

### 3. Tailwind CSS

Added in Feature 2. Used by F2, F4, F5. F1 has no UI components.

### 4. Route Structure (final after all features)

```
/               → HomePage
/calculator     → CalculatorPage  (Feature 2 form)
/results        → ResultsPage     (Feature 4 dashboard)
```

`App.tsx` gets `/results` route added in Feature 4.

### 5. Final Folder Structure

```
src/
├── models/
│   ├── calculators.ts        ← F1 (all calc interfaces + ConsolidatedResults)
│   ├── form.ts               ← F2 (FormData, CityData, UserInfo)
│   └── index.ts              ← re-exports
├── services/
│   ├── calculators/          ← F1 (5 calculator service wrappers)
│   ├── orchestration/        ← F3 (inputMapper, orchestrator, consolidator)
│   └── pdfExport/            ← F5 (pdfExporter, pdfTemplate)
├── controllers/
│   ├── useCalculatorController.ts  ← F3 refactors this (calls orchestrator)
│   └── useResultsController.ts     ← F4 (navigation logic)
├── views/
│   ├── HomePage.tsx          ← existing (no change)
│   ├── CalculatorPage.tsx    ← F2 replaces placeholder content
│   └── ResultsPage.tsx       ← F4 new
├── components/
│   ├── form/                 ← F2 (UnifiedInputForm, CityAutocomplete, FormSection)
│   └── results/              ← F4 (ResultSection + 5 per-calculator display components)
│   └── ExportButton.tsx      ← F5
├── hooks/
│   ├── useFormState.ts       ← F2
│   ├── useFormValidation.ts  ← F2
│   └── useLocationAutocomplete.ts ← F2
└── utils/
    ├── astro/                ← F1 (ported: swephClient, time, houses, angular, planets)
    ├── numerology/           ← F1 (ported: chaldean, chineseZodiac, compatibility)
    └── data/                 ← F1 (constants.ts, cities.generated.json)
```

---

## Feature 1: Legacy Calculator Integration

### Goal

Port all 5 calculator functions, utility code, and data assets into the new project. Define all shared TypeScript interfaces.

### Dependencies to Install

```bash
npm install @js-temporal/polyfill
```

(Swiss Ephemeris WASM is loaded at runtime; no npm package needed — copy the WASM loader from legacy)

### Steps

**Step 1.1 — Define All Interfaces**
Create `src/models/calculators.ts`:

```typescript
// Calculator input types
interface TransitsInput { risingSign: string }
interface NatalChartInput { year: number; month: number; day: number; hour: number; minute: number; latitude: number; longitude: number; timeZone: string }
interface LifePathInput { birthDate: string }  // YYYY-MM-DD
interface RelocationInput { year: number; month: number; day: number; hour: number; minute: number; birthLatitude: number; birthLongitude: number; birthTimeZone: string; destinationLatitude: number; destinationLongitude: number }
interface AddressNumerologyInput { unitNumber: string; streetName: string; postalCode: string; homeYear: string; birthYear: string }

// Calculator result types (mirror legacy output structures)
interface PlanetaryTransit { planet: string; currentSign: string; pastSign: string; houseNumber: number; houseTheme: string; ... }
interface TransitsResult { risingSign: string; transits: PlanetaryTransit[] }

interface NatalChartResult { planets: AstrologyPlanet[]; aspects: AstrologyAspect[]; risingSign: string }

interface LifePathResult { lifePathNumber: number; personalYear: number; chineseZodiac: string; meanings: { lifePath: string; personalYear: string } }

interface RelocationResult { angularHits: AngularHit[]; businessHouseActivations: HouseActivation[] }

interface AddressNumerologyResult { levels: NumerologyLevel[]; homeZodiac: string; birthZodiac: string; compatibility: string }

// Shared orchestrator output (used by F3, F4, F5)
interface ConsolidatedResults {
  success: boolean;
  timestamp: string;
  userInfo: UserInfo;
  calculators: {
    transits: TransitsResult;
    natalChart: NatalChartResult;
    lifePath: LifePathResult;
    relocation: RelocationResult;
    addressNumerology: AddressNumerologyResult;
  };
  errors?: { calculatorName: string; errorMessage: string }[];
}
interface UserInfo { name: string; dateOfBirth: string; timeOfBirth: string; birthLocation: string; currentLocation: string }
```

**Step 1.2 — Copy Utility Files** (from `PheydrusCalculators/src/lib/astro/` and `numerology/`)

- `src/utils/astro/swephClient.ts` — Swiss Ephemeris WASM client (dynamic import, client-side only)
- `src/utils/astro/time.ts` — `birthLocalToUtcDate`, `toJulianDay`, `birthLocalToJulianDay` (uses `@js-temporal/polyfill`)
- `src/utils/astro/houses.ts` — `assignWholeSignHouses`
- `src/utils/astro/angular.ts` — `computeAngularHits`, `getAngularByHouse`
- `src/utils/astro/planets.ts` — `PLANETS` constant array
- `src/utils/numerology/chaldean.ts` — `chaldeanNumerologyCalculator`, Chaldean letter map
- `src/utils/numerology/chineseZodiac.ts` — `getChineseZodiac`
- `src/utils/numerology/compatibility.ts` — `areZodiacsCompatible`, `IsZodiacCompatible` matrix
- `src/utils/data/constants.ts` — numerology meanings (1-9, 11, 22, 33), house themes, planet themes, level labels

**Step 1.3 — Copy Assets**

- `public/ephe/seas_18.se1`, `sepl_18.se1`, `semo_18.se1` — ephemeris files (copy from PheydrusCalculators/public/ephe/)
- `src/utils/data/cities.generated.json` — city database (copy from PheydrusCalculators/public/ or src/data/)

**Step 1.4 — Create Calculator Services** (wrap legacy logic in typed service functions)

- `src/services/calculators/transitsCalculator.ts`
  - Export: `calculateTransits(input: TransitsInput): TransitsResult`
  - Port `getHouses`, `planetTransits[]`, `houseThemes[]`, `planetThemes`, `signColors` from legacy `transits/page.tsx`
  - Pure function, no side effects

- `src/services/calculators/natalChartCalculator.ts`
  - Export: `calculateNatalChart(input: NatalChartInput): Promise<NatalChartResult>`
  - Port `calculateNatalChart` from legacy `src/lib/astro/natalChart.ts`
  - Use `swephClient.ts` (dynamic import, async)
  - Fix: use `input.latitude`/`input.longitude` (not hardcoded coordinates)
  - Include `findRisingSign` to extract rising sign from planets

- `src/services/calculators/lifePathCalculator.ts`
  - Export: `calculateLifePath(input: LifePathInput): LifePathResult`
  - Port `chaldeanNumerologyCalculator`, `personalYearNumber`, `getChineseZodiac` from `numerology/utils.ts`

- `src/services/calculators/relocationCalculator.ts`
  - Export: `calculateRelocation(input: RelocationInput): Promise<RelocationResult>`
  - Port relocation logic using `swephClient`, `time.ts`, `houses.ts`, `angular.ts`
  - Uses `@js-temporal/polyfill` via `time.ts`

- `src/services/calculators/addressNumerologyCalculator.ts`
  - Export: `calculateAddressNumerology(input: AddressNumerologyInput): AddressNumerologyResult`
  - Port `getLevelsArrayPublic` and all Chaldean utilities from `numerology/utils.ts` and `numerology/page.tsx`
  - Include all level labels from `constants.ts`

**Step 1.5 — Update `src/models/index.ts`**
Re-export everything from `calculators.ts`; do NOT remove existing exports yet (keep backward compat until F2 replaces them).

**Step 1.6 — Tests**

- `src/services/calculators/transitsCalculator.test.ts` — verify `getHouses` rotation, house number assignment
- `src/services/calculators/lifePathCalculator.test.ts` — verify known birth dates return expected life path numbers
- `src/services/calculators/addressNumerologyCalculator.test.ts` — verify Chaldean sums, level labels, master number preservation (11, 22, 33)
- Async calculator tests (natalChart, relocation): mock `swephClient.ts` using `vi.mock`

---

## Feature 2: Unified Input Form

**Depends on:** Feature 1 (for `CityData`, `TransitsInput` rising sign options, `FormData` types used by F3)

### Dependencies to Install

```bash
npm install tailwindcss @tailwindcss/vite
```

Configure `vite.config.ts` to add `@tailwindcss/vite` plugin. Add `@import "tailwindcss"` to `src/index.css`.

### Steps

**Step 2.1 — Create `src/models/form.ts`**

```typescript
interface CityData {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  admin1?: string;
}
interface FormData {
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM 24-hour
  birthLocation: CityData | null;
  currentLocation: CityData | null;
  risingSign: string; // '' means not provided
  l1: string; // unit number
  l2: string; // street name
  postalCode: string;
  homeBuiltYear: string; // YYYY
  // birthYear derived from dateOfBirth, NOT stored in form (computed in F3 inputMapper)
}
const EMPTY_FORM: FormData = {
  name: '',
  dateOfBirth: '',
  timeOfBirth: '',
  birthLocation: null,
  currentLocation: null,
  risingSign: '',
  l1: '',
  l2: '',
  postalCode: '',
  homeBuiltYear: '',
};
const FORM_STORAGE_KEY = 'pheydrus_form_data';
```

**Step 2.2 — Create Custom Hooks**

- `src/hooks/useFormState.ts` — manages `FormData` state; loads/saves from `localStorage` under `FORM_STORAGE_KEY`; exports `{ formData, setField, resetForm }`
- `src/hooks/useFormValidation.ts` — validates required fields (`dateOfBirth`, `timeOfBirth`, `birthLocation`, `currentLocation`); validates date not in future; validates `homeBuiltYear` is YYYY or empty; exports `{ errors, validate, isValid }`
- `src/hooks/useLocationAutocomplete.ts` — wraps city search logic; lazy-loads `cities.generated.json`; normalizes diacritics; sorts by prefix match then population; exports `{ query, setQuery, suggestions, isLoading }`

**Step 2.3 — Create Form Components**

- `src/components/form/CityAutocomplete.tsx` — port of `CitySelect.tsx` from legacy; accepts `onSelect: (city: CityData) => void`; uses `useLocationAutocomplete` hook
- `src/components/form/FormSection.tsx` — collapsible section wrapper using Tailwind
- `src/components/form/UnifiedInputForm.tsx` — main form; uses `useFormState`, `useFormValidation`; has 4 sections:
  - Personal Info (name, DOB, time of birth)
  - Location (birth location, current location, rising sign)
  - Address Numerology (L1, L2, postal code, home built year)
  - Submit button (disabled until required fields valid)
- Address fields labeled exactly as original: "L1" and "L2"

**Step 2.4 — Replace `CalculatorPage.tsx` Content**
Replace placeholder content. On form submit: call `useCalculatorController.calculate(formData)` which will navigate to `/results`. The submit handler is wired through the controller (separation of concerns).

**Step 2.5 — Tests**

- `useFormValidation.test.ts` — all validation rules
- `useFormState.test.ts` — localStorage save/load/reset

---

## Feature 3: All-in-One Calculator Engine

**Depends on:** Feature 1 (calculator functions), Feature 2 (`FormData` type + `CityData`)

### Steps

**Step 3.1 — Create `src/services/orchestration/inputMapper.ts`**
Maps `FormData` to each calculator's specific input:

```typescript
function mapToTransitsInput(f: FormData): TransitsInput;
function mapToNatalChartInput(f: FormData): NatalChartInput;
// birthYear derived: parseInt(f.dateOfBirth.split('-')[0])
// birthLocation.latitude/longitude used
function mapToLifePathInput(f: FormData): LifePathInput;
function mapToRelocationInput(f: FormData): RelocationInput;
// uses birthLocation + currentLocation coords + timeZone
function mapToAddressNumerologyInput(f: FormData): AddressNumerologyInput;
// birthYear derived from dateOfBirth
```

**Step 3.2 — Create `src/services/orchestration/resultConsolidator.ts`**
Merges 5 results + `FormData` into `ConsolidatedResults`:

```typescript
function consolidateResults(
  formData: FormData,
  results: [
    TransitsResult,
    NatalChartResult,
    LifePathResult,
    RelocationResult,
    AddressNumerologyResult,
  ]
): ConsolidatedResults;
```

**Step 3.3 — Create `src/services/orchestration/calculatorOrchestrator.ts`**

```typescript
async function runAllCalculators(formData: FormData): Promise<ConsolidatedResults> {
  // Validate inputs via inputMapper
  // Execute all 5 via Promise.all (fail-all on any rejection)
  // Wrap in 10-second timeout
  // Call resultConsolidator on success
}
```

IMPORTANT: Wrap in try/catch. If ANY calculator throws, re-throw so the fail-all contract is honored.

**Step 3.4 — Refactor `useCalculatorController.ts`**
Replace placeholder `calculatorService.calculate()` call with `runAllCalculators(formData)`. On success, call `navigate('/results', { state: { results: consolidatedResults } })`. On error, set `error` state shown in CalculatorPage.

**Step 3.5 — Tests**

- `calculatorOrchestrator.test.ts` — mock all 5 calculator services using `vi.mock`; test success case, single failure triggers fail-all, timeout
- `inputMapper.test.ts` — verify birthYear derivation, coordinate mapping, all edge cases

---

## Feature 4: Results Dashboard & Output Page

**Depends on:** Feature 3 (`ConsolidatedResults` interface and router state shape)

### Steps

**Step 4.1 — Add `/results` Route**
In `src/App.tsx`, add:

```tsx
<Route path="results" element={<ResultsPage />} />
```

**Step 4.2 — Create `src/views/ResultsPage.tsx`**

- Read `ConsolidatedResults` from `useLocation().state.results`
- Guard: if no state, `navigate('/calculator')`
- Renders `ResultsHeader` + 5 `ResultSection` components + `NavigationButtons`

**Step 4.3 — Create Result Components**
All in `src/components/results/`:

- `ResultSection.tsx` — collapsible wrapper (expanded by default); accepts `title`, `children`
- `TransitsResults.tsx` — renders `TransitsResult`; table of planet, sign, house, theme; sign colors
- `NatalChartResults.tsx` — renders planets list + aspects table
- `LifePathResults.tsx` — renders life path number, personal year, Chinese zodiac + their descriptions
- `RelocationResults.tsx` — renders angular hits table (planet, angle, house, type) + business activations
- `AddressNumerologyResults.tsx` — renders L1–L4 levels with full meaning descriptions, zodiac compatibility

**Step 4.4 — Create Navigation Components**

- `src/components/results/NavigationButtons.tsx` — 3 buttons: "New Calculation" (clears form + navigate `/calculator`), "Edit Inputs" (navigate `/calculator` preserving form), "Export to PDF" (wired in F5)
- `src/controllers/useResultsController.ts` — manages "Edit Inputs" vs "New Calculation" logic (Edit preserves localStorage; New clears it)

**Step 4.5 — Styling**
`src/styles/results.css` — section borders, expand/collapse animation, table layout. Use Tailwind utilities primarily.

**Step 4.6 — Tests**

- `ResultsPage.test.tsx` — redirects to `/calculator` when no state; renders all 5 sections with mock data
- `ResultSection.test.tsx` — expand/collapse toggle

---

## Feature 5: PDF Export Functionality

**Depends on:** Feature 4 (knows component structure); Feature 3 (`ConsolidatedResults` type)

### Dependencies to Install

```bash
npm install html2pdf.js
npm install --save-dev @types/html2pdf.js
```

### Steps

**Step 5.1 — Create `src/services/pdfExport/pdfTemplate.ts`**

- `generatePDFTemplate(results: ConsolidatedResults): string` — builds full HTML string with all 5 calculator sections
- Inline CSS (from spec `pdfStyles.css` content) to ensure PDF renders correctly
- Simplified layout: no interactive elements, tables for structured data, all descriptions included
- `generateFilename(results: ConsolidatedResults): string` — `Pheydrus_Report_[First]_[Last]_[YYYY-MM-DD].pdf`

**Step 5.2 — Create `src/services/pdfExport/pdfExporter.ts`**

```typescript
async function exportToPDF(results: ConsolidatedResults): Promise<void> {
  const html = generatePDFTemplate(results);
  const el = document.createElement('div');
  el.innerHTML = html;
  const options = {
    margin: 10,
    filename: generateFilename(results),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
  };
  await html2pdf().set(options).from(el).save();
}
```

**Step 5.3 — Create `src/components/ExportButton.tsx`**

- `isExporting` state with loading message
- Error state with user-friendly message
- Calls `exportToPDF(results)` from service
- Passes `results: ConsolidatedResults` prop (received from ResultsPage)

**Step 5.4 — Wire into ResultsPage**
In `ResultsPage.tsx`, add `ExportButton` to `NavigationButtons` area. Pass `results` prop down.

**Step 5.5 — Tests**

- `pdfExporter.test.ts` — mock `html2pdf` library; verify `exportToPDF` calls save; verify filename format with/without name
- `pdfTemplate.test.ts` — verify all 5 sections present in generated HTML, all data fields rendered

---

## Dependency & Sequencing Summary

```
Feature 1 (Calculator Logic + Models)
    ↓
Feature 2 (Form + FormData model)
    ↓
Feature 3 (Orchestrator — uses F1 calculators + F2 FormData)
    ↓
Feature 4 (Results Dashboard — uses F3 ConsolidatedResults)
    ↓
Feature 5 (PDF Export — uses F3 ConsolidatedResults + F4 component structure)
```

No feature can begin implementation before its dependency is complete. Interfaces shared across features are defined in Feature 1 and Feature 2 — these must be finalized before Feature 3.

---

## Packages to Install (all features combined)

| Package                         | Feature | Purpose                                 |
| ------------------------------- | ------- | --------------------------------------- |
| `@js-temporal/polyfill`         | F1      | Timezone-aware date math for relocation |
| `tailwindcss @tailwindcss/vite` | F2      | UI styling                              |
| `html2pdf.js`                   | F5      | PDF generation                          |
| `@types/html2pdf.js`            | F5      | TypeScript types                        |

---

## Cross-Feature Interface Contract

These interfaces must NOT change after they are defined (doing so is a breaking change for downstream features):

| Interface                                                                                             | Defined In                      | Consumed By          |
| ----------------------------------------------------------------------------------------------------- | ------------------------------- | -------------------- |
| `TransitsResult`, `NatalChartResult`, `LifePathResult`, `RelocationResult`, `AddressNumerologyResult` | F1 `models/calculators.ts`      | F3, F4, F5           |
| `ConsolidatedResults`                                                                                 | F1 `models/calculators.ts`      | F3, F4, F5           |
| `FormData`, `CityData`                                                                                | F2 `models/form.ts`             | F3 (inputMapper)     |
| Router state shape `{ results: ConsolidatedResults }`                                                 | F3 `useCalculatorController.ts` | F4 `ResultsPage.tsx` |

---

## Verification Plan

After all 5 features are implemented:

1. **Unit tests**: `npm test` — all tests pass, >80% coverage
2. **Build**: `npm run build` — no TypeScript errors, no unused imports
3. **E2E smoke test** (manual):
   - Fill in form with known data (e.g., test birthdate, real city)
   - Click Calculate — loading state appears
   - Results page loads — all 5 sections visible, expandable/collapsible
   - Export PDF — file downloads, opens in PDF reader, all data present
   - Edit Inputs — returns to form with data pre-filled
   - New Calculation — returns to form with blank fields
4. **Lint**: `npm run lint` — no errors
5. **Data accuracy check**: Compare outputs against legacy calculator outputs with identical inputs — results must be identical

---

## Files to Modify (existing)

| File                                         | Modified By | Change                                             |
| -------------------------------------------- | ----------- | -------------------------------------------------- |
| `src/models/index.ts`                        | F1          | Add re-exports from `calculators.ts`               |
| `src/App.tsx`                                | F4          | Add `/results` route                               |
| `src/views/CalculatorPage.tsx`               | F2          | Replace placeholder with UnifiedInputForm          |
| `src/controllers/useCalculatorController.ts` | F3          | Replace placeholder with orchestrator call         |
| `src/services/calculatorService.ts`          | F3          | Deprecate/remove (replaced by orchestration layer) |
| `vite.config.ts`                             | F2          | Add Tailwind plugin                                |
| `src/index.css`                              | F2          | Add Tailwind import                                |
| `package.json`                               | F1/F2/F5    | Add new dependencies                               |

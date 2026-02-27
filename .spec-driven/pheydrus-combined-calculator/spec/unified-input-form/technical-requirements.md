# Technical Requirements: Unified Input Form

## Architecture

```
src/
├── components/
│   ├── UnifiedForm.tsx (main form container)
│   ├── FormSection.tsx (reusable section component)
│   ├── PersonalInfoSection.tsx
│   ├── LocationSection.tsx
│   ├── AstrologicalSection.tsx
│   ├── AddressSection.tsx
│   └── __tests__/
├── hooks/
│   ├── useFormState.ts (state management)
│   ├── useFormValidation.ts (validation logic)
│   └── useLocationAutocomplete.ts (city search)
├── models/
│   ├── FormData.ts
│   └── ValidationError.ts
└── utils/
    ├── formValidation.ts
    └── locationSearch.ts
```

## State Management

```typescript
interface FormData {
  // Personal
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM (24-hour)

  // Locations
  birthLocation: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  } | null;
  currentLocation: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  } | null;

  // Astrological
  risingSign: string; // One of 12 zodiac signs or empty

  // Address
  l1: string; // Unit number
  l2: string; // Street name
  postalCode: string;
  homeBuiltYear: string; // YYYY

  // Derived/Auto-filled
  birthYear?: string; // Auto-filled from dateOfBirth
}

interface FormState {
  data: FormData;
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  isSubmitting: boolean;
}
```

## Custom Hooks

### useFormState

```typescript
function useFormState() {
  // Initialize from localStorage
  // Provide setters for each field
  // Auto-save to localStorage on change
  // Return { state, updateField, reset, getValues }
}
```

### useFormValidation

```typescript
function useFormValidation(formData: FormData) {
  // Validate all fields
  // Return { isValid, errors, validateField }

  const validateField = (fieldName: string, value: any) => {
    // Validate single field
    // Return error string or null
  };
}
```

### useLocationAutocomplete

```typescript
function useLocationAutocomplete(query: string) {
  // Search city database
  // Return matching cities
  // Debounce search queries
  // Return { results, isLoading, error }
}
```

## Form Components

### UnifiedForm.tsx

```typescript
export function UnifiedForm({ onSubmit: (data: FormData) => void }) {
  const { state, updateField, reset } = useFormState();
  const { isValid, errors } = useFormValidation(state.data);

  const handleSubmit = (e: FormEvent) => {
    // Prevent default
    // Validate all fields
    // If valid, call onSubmit(state.data)
    // If invalid, show errors
  };

  return (
    <form onSubmit={handleSubmit}>
      <PersonalInfoSection />
      <LocationSection />
      <AstrologicalSection />
      <AddressSection />
      <button disabled={!isValid}>CALCULATE</button>
    </form>
  );
}
```

### FormSection.tsx

```typescript
interface FormSectionProps {
  title: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  children: ReactNode;
}

export function FormSection({ title, collapsible, defaultCollapsed, children }: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(!defaultCollapsed);

  return (
    <div className="form-section">
      <h2 onClick={() => collapsible && setIsOpen(!isOpen)}>
        {title}
        {collapsible && <ChevronIcon />}
      </h2>
      {isOpen && children}
    </div>
  );
}
```

### Location Autocomplete Component

```typescript
interface LocationInputProps {
  label: string;
  value: string;
  onChange: (location: Location) => void;
  error?: string;
}

export function LocationInput({ label, value, onChange, error }: LocationInputProps) {
  const [query, setQuery] = useState(value);
  const { results, isLoading } = useLocationAutocomplete(query);
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="location-input">
      <label>{label}</label>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search cities..."
      />
      {showSuggestions && (
        <ul className="suggestions">
          {results.map((city) => (
            <li key={city.id} onClick={() => onChange(city)}>
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

## Validation Rules (Code)

```typescript
const ValidationRules = {
  dateOfBirth: [
    (value: string) => (!value ? 'Date of birth is required' : null),
    (value: string) => (!isValidDate(value) ? 'Please enter a valid date' : null),
    (value: string) => (isFutureDate(value) ? 'Birth date cannot be in the future' : null),
    (value: string) => {
      const year = parseInt(value.split('-')[0]);
      return year < 1900 ? 'Birth year must be after 1900' : null;
    },
  ],

  timeOfBirth: [
    (value: string) => (!value ? 'Time of birth is required' : null),
    (value: string) => (!/^\d{2}:\d{2}$/.test(value) ? 'Time must be HH:MM' : null),
    (value: string) => {
      const [h, m] = value.split(':').map(Number);
      return h < 0 || h > 23 || m < 0 || m > 59 ? 'Time must be between 00:00 and 23:59' : null;
    },
  ],

  birthLocation: [(value: Location | null) => (!value ? 'Birth location is required' : null)],

  currentLocation: [(value: Location | null) => (!value ? 'Current location is required' : null)],

  homeBuiltYear: [
    (value: string) => (!value ? null : null), // Optional
    (value: string) => (value && !/^\d{4}$/.test(value) ? 'Year must be YYYY format' : null),
    (value: string) => {
      const year = parseInt(value);
      return year > new Date().getFullYear() ? 'Year cannot be in the future' : null;
    },
  ],

  postalCode: [
    (value: string) => (!value ? null : null), // Optional
    (value: string) => (value && value.length > 20 ? 'Postal code too long' : null),
  ],

  l1: [(value: string) => (!value ? null : null)], // Optional
  l2: [(value: string) => (!value ? null : null)], // Optional
  risingSign: [
    (value: string) => {
      const validSigns = [
        'Aries',
        'Taurus',
        'Gemini',
        'Cancer',
        'Leo',
        'Virgo',
        'Libra',
        'Scorpio',
        'Sagittarius',
        'Capricorn',
        'Aquarius',
        'Pisces',
      ];
      return value && !validSigns.includes(value) ? 'Invalid zodiac sign' : null;
    },
  ],
};
```

## Data Persistence

```typescript
const STORAGE_KEY = 'pheydrus_form_data';

function saveToLocalStorage(data: FormData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage(): FormData | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
```

## City Database Integration

```typescript
interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  region?: string;
}

// Import from old project
import { cities } from '@/data/cities'; // From PheydrusCalculators

function searchCities(query: string): City[] {
  const q = query.toLowerCase();
  return cities
    .filter((city) => city.name.toLowerCase().includes(q) || city.country.toLowerCase().includes(q))
    .slice(0, 10); // Limit to 10 results
}
```

## Styling Approach

- **CSS Framework**: Tailwind CSS (existing in project)
- **Color Scheme**: Match existing app theme (dark/light mode)
- **Responsive**: Mobile-first responsive design
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## Error Display

```typescript
interface FormErrorProps {
  fieldName: string;
  error?: string;
}

export function FormError({ fieldName, error }: FormErrorProps) {
  if (!error) return null;
  return (
    <div className="form-error" role="alert">
      <span className="error-icon">⚠</span>
      <span className="error-text">{error}</span>
    </div>
  );
}
```

## Auto-fill Behavior

```typescript
// When dateOfBirth changes, auto-fill birth year in address section
useEffect(() => {
  if (formData.dateOfBirth) {
    const year = formData.dateOfBirth.split('-')[0];
    updateField('birthYear', year);
  }
}, [formData.dateOfBirth]);
```

## Performance Considerations

- Debounce location search (300ms)
- Memoize form sections to prevent unnecessary re-renders
- Lazy load address section (only load when needed)
- LocalStorage operations are synchronous but fast

## Testing

- Form validation unit tests
- Location autocomplete tests
- LocalStorage persistence tests
- Form submission tests
- Error display tests
- Responsive layout tests

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- LocalStorage fallback if not available

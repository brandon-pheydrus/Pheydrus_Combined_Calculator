# Technical Requirements: Results Dashboard & Output Page

## Architecture

```
src/
├── views/
│   └── ResultsPage.tsx (main page)
├── components/
│   ├── ResultsHeader.tsx
│   ├── ResultSection.tsx
│   ├── TransitsResults.tsx
│   ├── NatalChartResults.tsx
│   ├── LifePathResults.tsx
│   ├── RelocationResults.tsx
│   ├── AddressNumerologyResults.tsx
│   └── NavigationButtons.tsx
├── hooks/
│   └── useResultsNavigation.ts
└── styles/
    └── results.css
```

## Component Structure

```typescript
// ResultsPage.tsx - Main container
export function ResultsPage({ results: ConsolidatedResults }) {
  const [expandedSections, setExpandedSections] = useState({
    transits: true,
    natalChart: true,
    lifePath: true,
    relocation: true,
    addressNumerology: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="results-page">
      <ResultsHeader results={results} />
      <NavigationButtons />

      <ResultSection
        title="Transits by Rising Sign"
        isExpanded={expandedSections.transits}
        onToggle={() => toggleSection('transits')}
      >
        <TransitsResults results={results.calculators.transits} />
      </ResultSection>

      {/* Similar sections for other calculators */}

      <NavigationButtons />
    </div>
  );
}
```

## Styling

- Color scheme: Dark/light mode support
- Sections: Card-based with borders/shadows
- Typography: Semantic HTML with proper hierarchy
- Spacing: 1.5rem padding, 1rem margins
- Border radius: 8px for modern look
- Expandable: Smooth transitions

## Data Rendering

Each calculator section renders its data exactly as returned from calculator service, preserving all information:

```typescript
// TransitsResults - Example
export function TransitsResults({ results }: { results: TransitsResult }) {
  return (
    <div className="transits-results">
      <div className="rising-sign">
        <h3>Rising Sign: <span>{results.risingSign}</span></h3>
      </div>

      <table className="planets-table">
        <thead>
          <tr>
            <th>Planet</th>
            <th>Current Transit</th>
            <th>Current House</th>
            <th>Past Transit</th>
            <th>Past House</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {results.transits.map(t => (
            <tr key={t.planet}>
              <td>{t.planet}</td>
              <td>{t.current.sign}</td>
              <td>{t.current.house}</td>
              <td>{t.past.sign}</td>
              <td>{t.past.house}</td>
              <td>{t.theme}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Mobile Responsiveness

- Desktop: Card layout, 2-3 columns where applicable
- Tablet: 1-2 columns
- Mobile: Full width, stacked vertically
- Tables convert to cards on mobile if needed
- Navigation buttons always visible (sticky if needed)

## Export Preparation

- Page must be CSS-stable (no JavaScript-generated content)
- All content must be visible (no lazy loading)
- Images/charts must be properly sized
- Colors must export well to PDF
- Spacing must scale properly

## Performance

- Efficient rendering of all data
- Memoize large result sections
- Lazy load images/charts if used
- Fast expand/collapse animations
- Page load time < 1 second

## Accessibility

- Proper semantic HTML
- ARIA labels for sections
- Keyboard navigation for expand/collapse
- Color not sole indicator of meaning
- Sufficient contrast ratios

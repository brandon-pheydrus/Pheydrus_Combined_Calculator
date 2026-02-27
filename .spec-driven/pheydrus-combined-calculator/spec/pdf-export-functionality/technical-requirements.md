# Technical Requirements: PDF Export Functionality

## PDF Generation Library

**Options**:

1. **html2pdf.js** (Simple, lightweight, < 100KB)
2. **jsPDF** + html2canvas (More control, ~300KB)
3. **PDFKit** (Node.js, better quality)

**Recommendation**: html2pdf.js for simplicity and small bundle size

## Architecture

```
src/
├── services/
│   └── pdfExport/
│       ├── pdfExporter.ts (main export logic)
│       └── pdfTemplate.ts (HTML template)
├── components/
│   └── ExportButton.tsx
└── utils/
    └── pdfStyles.css
```

## Implementation

### Export Function

```typescript
async function exportToPDF(results: ConsolidatedResults) {
  try {
    // 1. Generate HTML content
    const htmlContent = generatePDFTemplate(results);

    // 2. Generate PDF using html2pdf
    const element = document.createElement('div');
    element.innerHTML = htmlContent;

    const options = {
      margin: 10,
      filename: generateFilename(results),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    await html2pdf().set(options).from(element).save();
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
}
```

### Filename Generation

```typescript
function generateFilename(results: ConsolidatedResults): string {
  const date = new Date(results.timestamp);
  const dateStr = date.toISOString().split('T')[0];

  if (results.userInfo.name) {
    const [first, ...rest] = results.userInfo.name.split(' ');
    const last = rest.join('_') || 'Report';
    return `Pheydrus_Report_${first}_${last}_${dateStr}.pdf`;
  }

  return `Pheydrus_Report_${dateStr}.pdf`;
}
```

### PDF Template

```typescript
function generatePDFTemplate(results: ConsolidatedResults): string {
  return `
    <html>
      <head>
        <style>${getPDFStyles()}</style>
      </head>
      <body>
        <div class="pdf-container">
          <div class="pdf-header">
            <h1>PHEYDRUS READING</h1>
            <p>${results.userInfo.name || 'Your Reading'}</p>
          </div>

          <div class="pdf-meta">
            <p><strong>Generated:</strong> ${formatDate(results.timestamp)}</p>
            <p><strong>Birth:</strong> ${results.userInfo.dateOfBirth} at ${results.userInfo.timeOfBirth}</p>
            <p><strong>Location:</strong> ${results.userInfo.birthLocation}</p>
            <p><strong>Current Location:</strong> ${results.userInfo.currentLocation}</p>
          </div>

          ${generateTransitsSection(results.calculators.transits)}
          ${generateNatalChartSection(results.calculators.natalChart)}
          ${generateLifePathSection(results.calculators.lifePath)}
          ${generateRelocationSection(results.calculators.relocation)}
          ${generateAddressNumerologySection(results.calculators.addressNumerology)}

          <div class="pdf-footer">
            <p>© 2026 Pheydrus. For personal use only.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

### PDF Styles

```css
.pdf-container {
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
}

.pdf-header {
  text-align: center;
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.pdf-header h1 {
  margin: 0;
  font-size: 28px;
  color: #1a1a2e;
}

.pdf-section {
  margin-bottom: 40px;
  page-break-inside: avoid;
}

.pdf-section h2 {
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.pdf-section table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

.pdf-section table th,
.pdf-section table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.pdf-section table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.pdf-meta {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 30px;
  font-size: 12px;
}

.pdf-footer {
  text-align: center;
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  font-size: 11px;
  color: #666;
}

@media print {
  body {
    margin: 0;
  }
  .pdf-section {
    page-break-inside: avoid;
  }
}
```

## Export Button Component

```typescript
export function ExportButton({ results }: { results: ConsolidatedResults }) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      await exportToPDF(results);
      // Success - file downloaded
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="export-button"
    >
      {isExporting ? 'Generating PDF...' : 'Export to PDF'}
    </button>
  );
}
```

## Size Optimization

- No embedded images
- Use text-based tables instead of images
- Minimal styling
- Compress text
- Target: < 5MB (easy to achieve without images)

## Browsers Compatibility

- Chrome, Firefox, Safari, Edge
- html2pdf requires modern browser
- Fallback: Link to download PDF from server (if needed)

## Performance

- PDF generation: < 5 seconds
- No blocking on UI
- Loading indicator shown during export
- Error handling for failed exports

## Testing

- Export with and without user name
- Various result data volumes
- Different date formats
- File size verification
- PDF opens in multiple readers
- Page breaks work correctly
- All content visible in PDF

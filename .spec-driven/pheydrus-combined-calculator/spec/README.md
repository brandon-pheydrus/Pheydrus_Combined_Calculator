# Pheydrus Combined Calculator - Feature Specifications

All functional and technical requirements for the 5 features are documented here.

## 📋 Specifications by Feature

### Feature 1: Legacy Calculator Integration

Importing and integrating the 5 existing calculators into the new Vite project.

- 📄 [Functional Requirements](./legacy-calculator-integration/functional-requirements.md)
  - User stories for each calculator type
  - Input/output format requirements
  - Data accuracy verification
  - Testing strategy

- 🔧 [Technical Requirements](./legacy-calculator-integration/technical-requirements.md)
  - Architecture and folder structure
  - Extracted function specifications
  - Data model definitions
  - Migration checklist

---

### Feature 2: Unified Input Form

Single form that collects all inputs without duplication.

- 📄 [Functional Requirements](./unified-input-form/functional-requirements.md)
  - Form field definitions
  - Validation rules
  - City autocomplete functionality
  - Form persistence (localStorage)
  - Error messaging

- 🔧 [Technical Requirements](./unified-input-form/technical-requirements.md)
  - Component architecture
  - State management hooks
  - Form validation code examples
  - City database integration
  - Responsive design approach

---

### Feature 3: All-in-One Calculator Engine

Orchestrates all 5 calculators to run in parallel.

- 📄 [Functional Requirements](./all-in-one-calculator-engine/functional-requirements.md)
  - Calculator execution flow
  - Input mapping from form to calculators
  - Error handling (fail-all approach)
  - Result consolidation format

- 🔧 [Technical Requirements](./all-in-one-calculator-engine/technical-requirements.md)
  - Orchestrator service design
  - Parallel execution with Promise.all
  - Result consolidation logic
  - Error handling implementation

---

### Feature 4: Results Dashboard & Output Page

Beautiful, organized single-page results display.

- 📄 [Functional Requirements](./results-dashboard-output/functional-requirements.md)
  - Results organization by calculator
  - Expandable/collapsible sections
  - Visual design guidelines
  - Data preservation requirement
  - Navigation buttons and options

- 🔧 [Technical Requirements](./results-dashboard-output/technical-requirements.md)
  - Component structure
  - Responsive layout approach
  - Styling guidelines (Tailwind CSS)
  - Mobile optimization
  - Accessibility requirements

---

### Feature 5: PDF Export Functionality

Export results as professional PDF file.

- 📄 [Functional Requirements](./pdf-export-functionality/functional-requirements.md)
  - PDF content requirements
  - File naming convention
  - Professional styling
  - Size limits (< 10MB)
  - Metadata requirements

- 🔧 [Technical Requirements](./pdf-export-functionality/technical-requirements.md)
  - PDF library choice (html2pdf recommended)
  - Export function implementation
  - HTML template generation
  - CSS styling for PDF
  - File size optimization

---

## 🎯 Key Requirements Summary

### Data Accuracy (CRITICAL)

✅ **All original calculator outputs must be preserved exactly**

- No summarization
- No abbreviation
- 100% backward compatibility
- Nothing omitted from original output

### User Experience

✅ Single form (no duplicate entries)
✅ City autocomplete from database
✅ Address fields labeled exactly as original (L1, L2)
✅ Beautiful, modern interface
✅ Expandable result sections
✅ PDF export functionality

### Technical Standards

✅ React 19 + TypeScript + Vite
✅ MVC architecture (controllers, services, models, views)
✅ Comprehensive tests (> 80% coverage)
✅ GitHub Actions CI/CD
✅ Vercel deployment ready

### Implementation Order

1. **Feature 1** - Legacy Calculator Integration (foundation)
2. **Feature 2** - Unified Input Form (inputs)
3. **Feature 3** - All-in-One Calculator (orchestration)
4. **Feature 4** - Results Dashboard (output)
5. **Feature 5** - PDF Export (enhancement)

Each feature depends on the previous ones.

---

## 📊 Specifications Checklist

- ✅ Roadmap created with 5 features
- ✅ Feature 1: Functional + Technical requirements
- ✅ Feature 2: Functional + Technical requirements
- ✅ Feature 3: Functional + Technical requirements
- ✅ Feature 4: Functional + Technical requirements
- ✅ Feature 5: Functional + Technical requirements
- ✅ Skill instructions updated with clarifying question guidance
- ✅ All specifications stored in .spec-driven folder

---

## 🚀 Ready for Next Phase

**Status**: ✅ SPECIFICATIONS COMPLETE

Next phases:

1. Implementation Planning (/plan for each feature)
2. Development (Dev skill)
3. Testing & Validation (Test skill)

See [SPECIFICATIONS_SUMMARY.md](../SPECIFICATIONS_SUMMARY.md) for complete overview.

---

## 📌 Important Notes

- All specifications drafted based on clarifying questions asked
- City autocomplete matches existing calculator functionality
- Address fields (L1, L2) match original labels exactly
- PDF export simplified but includes all data
- Error handling: fail-all approach if any calculator fails
- Privacy-first: no server storage, localStorage only
- Performance targets: < 2 seconds for all calculations

---

**Created**: February 25, 2026
**Project**: Pheydrus Combined Calculator
**Version**: 1.0 - Complete Specifications

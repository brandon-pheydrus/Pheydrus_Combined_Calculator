# Pheydrus Combined Calculator - Product Roadmap

## Project Vision

Create a unified, modern calculator platform that consolidates Pheydrus's astrological and numerological calculation tools into a single elegant application. Users can perform all calculations (transits, natal path, life path, relocation, and address numerology) in one seamless flow with unified inputs, combined results visualization, and PDF export capabilities.

## Problem Statement

Currently, users must navigate between separate calculator applications, enter the same information multiple times (like birthdate for each calculator), and manually consolidate results across pages. The Pheydrus Combined Calculator solves this by:

- Eliminating duplicate data entry
- Providing a single source of truth for all calculations
- Creating beautiful, organized output
- Enabling easy sharing and archiving via PDF

## Target Users

- **Spiritual Practitioners** - Astrologers, numerologists, life coaches seeking comprehensive client readings
- **Curious Individuals** - People exploring numerology and astrology for personal insight
- **Gift Givers** - Users creating personalized reports for friends/family
- **Professional Consultants** - Those building custom client presentations

## Success Metrics

- Users can complete all 5 calculations with a single set of inputs
- Output page loads in < 2 seconds
- PDF export generates in < 5 seconds
- Users spend < 3 minutes per session (quick, efficient workflow)
- 95%+ code coverage on calculator functions
- Zero duplicate data entry for common fields

## Features (Priority Order)

### 1. Legacy Calculator Integration - [HIGH Priority]

**Description**: Import and integrate the existing Pheydrus calculator functions (transits, natal path, life path, relocation, address numerology) into the new Vite + React + TypeScript architecture.

**Key Activities**:

- Migrate calculator logic from old CRA/Next.js to new Vite project
- Create service layer for each calculator type
- Ensure 100% backward compatibility with old calculation results
- Set up comprehensive test suite for all migrated functions

**Complexity**: HIGH
**Estimated Hours**: 16-20 hours
**Depends On**: None
**User Impact**: High - Foundation for all other features

---

### 2. Unified Input Form - [HIGH Priority]

**Description**: Create a single-page form that accepts all inputs needed for all 5 calculators (birth date, birth location, current location, name, address, etc.) without asking for duplicate information.

**Key Activities**:

- Design unified form with grouped sections (Personal Info, Birth Details, Locations)
- Implement smart form fields (date picker, location search with autocomplete)
- Add form validation with helpful error messages
- Create form state management system
- Implement form persistence (auto-save to localStorage)

**Complexity**: MEDIUM
**Estimated Hours**: 12-16 hours
**Depends On**: Feature 1 (Legacy Calculator Integration)
**User Impact**: High - Creates seamless user experience

---

### 3. All-in-One Calculator Engine - [HIGH Priority]

**Description**: Create a unified calculation service that triggers all 5 calculators simultaneously with the same input set and consolidates results.

**Key Activities**:

- Create master calculator service that calls all 5 sub-calculators
- Handle data transformation between form input and individual calculator requirements
- Implement error handling and validation
- Add performance optimization (parallel calculation execution)
- Create logging system for debugging

**Complexity**: MEDIUM
**Estimated Hours**: 10-12 hours
**Depends On**: Features 1 & 2
**User Impact**: Critical - Core functionality

---

### 4. Results Dashboard & Output Page - [HIGH Priority]

**Description**: Create a beautiful, organized single-page results display that shows all calculation outputs in an intuitive, scannable format with proper visual hierarchy and grouping.

**Key Activities**:

- Design responsive results layout (desktop, tablet, mobile)
- Create result cards/sections for each calculator type
- Implement color-coded result categories
- Add expandable/collapsible sections for detailed information
- Create visualization elements (charts, tables, key insights)
- Add "back to calculator" and "save results" options

**Complexity**: MEDIUM
**Estimated Hours**: 14-18 hours
**Depends On**: Feature 3
**User Impact**: Critical - First impression matters

---

### 5. PDF Export Functionality - [MEDIUM Priority]

**Description**: Enable users to export the results page as a professional PDF document that preserves formatting, layout, and all information in a shareable format.

**Key Activities**:

- Integrate PDF generation library (PDFKit or similar)
- Create PDF template matching results page design
- Implement PDF styling and formatting
- Add metadata (generation date, user name, etc.)
- Optimize PDF file size and generation speed
- Add download and email options

**Complexity**: MEDIUM
**Estimated Hours**: 8-12 hours
**Depends On**: Feature 4
**User Impact**: High - Enables sharing and archiving

---

## Release Timeline

### Phase 1: Foundation (Weeks 1-2)

- ✅ Legacy Calculator Integration (Feature 1)
- ✅ Comprehensive testing of all migrated functions
- **Deliverable**: Core calculation engine working

### Phase 2: User Interface (Weeks 3-4)

- ✅ Unified Input Form (Feature 2)
- ✅ All-in-One Calculator Engine (Feature 3)
- **Deliverable**: Users can input data and get calculations

### Phase 3: Results & Export (Weeks 5-6)

- ✅ Results Dashboard (Feature 4)
- ✅ PDF Export (Feature 5)
- **Deliverable**: Complete, production-ready application

### Phase 4: Polish (Week 7+)

- Performance optimization
- Mobile responsiveness refinement
- User testing and feedback implementation
- Documentation and deployment

## Technical Architecture Overview

```
Frontend (React + TypeScript + Vite)
├── Input Layer
│   └── Unified Form Component
├── Calculation Layer
│   ├── Transit Calculator Service
│   ├── Natal Path Calculator Service
│   ├── Life Path Calculator Service
│   ├── Relocation Calculator Service
│   └── Address Calculator Service
├── Output Layer
│   ├── Results Dashboard
│   └── PDF Export
└── Data Layer
    ├── Form State Management
    ├── Results Cache
    └── LocalStorage Persistence
```

## Key Dependencies & Integrations

- **Existing Calculator Code**: From `/c/Work/Pheydrus/Calculators/PheydrusCalculators/lib/`
- **PDF Generation**: (To be chosen - PDFKit, jsPDF, html2pdf, etc.)
- **Form Validation**: (To be chosen - Zod, Yup, Valibot, etc.)
- **Charting Library**: (Optional - for visualization: Chart.js, Recharts, etc.)

## Risks & Mitigation

| Risk                                                | Probability | Impact | Mitigation                                          |
| --------------------------------------------------- | ----------- | ------ | --------------------------------------------------- |
| Legacy code incompatibility                         | Medium      | High   | Early integration testing, wrapper functions        |
| Performance issues with 5 simultaneous calculations | Medium      | Medium | Implement caching, parallel execution, lazy loading |
| Complex state management                            | Medium      | High   | Use React Context or state management library early |
| PDF styling/layout issues                           | Low         | Medium | Test PDF generation early with multiple templates   |
| User input validation complexity                    | Low         | Medium | Implement thorough validation rules in spec phase   |

## Success Criteria for MVP

- [ ] All 5 calculators functioning and producing correct results
- [ ] Form accepts all required inputs without duplication
- [ ] Calculate button triggers all calculators simultaneously
- [ ] Results display on single page in organized manner
- [ ] PDF export generates successfully with correct formatting
- [ ] Unit tests > 80% coverage
- [ ] Application responsive on mobile/tablet/desktop
- [ ] No console errors in production build
- [ ] Page load time < 3 seconds
- [ ] Calculation time < 2 seconds for all 5 calculators

## Post-MVP Features (Future Roadmap)

- Save calculation history
- Compare multiple calculations
- Integration with other astrological tools
- API for programmatic access
- Mobile app (React Native)
- Chatbot for question answering based on results
- Subscription-based advanced features
- Social sharing capabilities
- Custom branding for professional consultants

## Notes

- All existing calculator code should be preserved and tested thoroughly
- User experience should feel modern and polished, not just functional
- Mobile responsiveness is critical - many users will access on phones
- PDF export should look professional enough for client deliverables
- This is a consolidation/upgrade project, not a complete rewrite

---

**Created**: February 25, 2026
**Version**: 1.0
**Status**: Ready for Feature Specification

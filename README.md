# Pet Rescue - Missing Pet Tracker

A React TypeScript application for reporting and tracking missing pets with an interactive map interface, built with Crumb branding and design system.

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/paulbrownsmith/pet-rescue.git
cd pet-rescue
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Running Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

```bash
npm test -- --coverage
```

Generates a test coverage report.

### Build for Production

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Technology Choices

### Core Technologies

- **React 19.2.0 with TypeScript 4.9.5**: Chosen for type safety, modern features, and excellent developer experience. TypeScript helps catch errors early and improves code maintainability.

- **Material-UI (MUI) v6**: Provides a comprehensive component library with consistent design, accessibility features, and theming capabilities. Enables rapid UI development while maintaining professional appearance.

- **React Leaflet 4.2.1**: Industry-standard mapping library with excellent React integration. Offers customizable markers, popups, and interactive features essential for location-based pet tracking.

- **React Testing Library & Jest**: Standard testing tools for React applications. Focus on testing user interactions and component behavior rather than implementation details.

### Design Decisions

- **Custom Crumb Theme**: Implemented custom Material-UI theme with Crumb's brand colors (#fd5b2e primary, #fff1ed background) and Afacad font family for consistent branding.

- **Local Storage Persistence**: Simple, no-backend solution for data storage. Perfect for a prototype/demo while maintaining data between sessions.

- **Component-Based Architecture**: Modular design with separate components for each feature (Map, Form, List, Card, Dialog) for maintainability and reusability.

- **Custom Hooks Pattern**: `usePets` hook centralizes pet data management, making state logic reusable and testable.

- **TypeScript Interfaces with Extends**: Used interface composition to eliminate code duplication while maintaining type safety (BasePetInfo, ContactInfo, etc.).

### Why These Choices?

1. **Developer Experience**: TypeScript + React provides excellent autocomplete, refactoring tools, and error detection
2. **User Experience**: Material-UI ensures responsive design and accessibility out of the box
3. **Maintainability**: Modular components and clear separation of concerns make the codebase easy to understand and extend
4. **Testing**: React Testing Library encourages best practices and makes tests more resilient to implementation changes
5. **Performance**: React 19's latest optimizations and efficient re-rendering
6. **No Backend Required**: Local storage makes deployment simple while still providing data persistence

## Features Implemented

### Core Features

- ✅ **Interactive Map View**
  - Leaflet map showing all reported pets
  - Custom red markers for missing pets
  - Custom green markers for found pets
  - Click markers to view detailed pet information in dialog
  - Auto-centering based on pet locations
  - Fallback to London coordinates when no pets exist

- ✅ **Report Missing Pet Form**
  - Comprehensive form with all pet details
  - Real-time validation for all fields
  - UK phone number validation (mobile and landline formats)
  - Date validation (prevents future dates)
  - Pet name minimum length validation (2+ characters)
  - Dual location input methods:
    - Manual address entry
    - Click-to-select on interactive map
  - Optional notes field for distinguishing features
  - Geolocation support to center map on user's location
  - Form reset after successful submission
  - Success notification after submission

- ✅ **Pet Listing View**
  - Separate sections for missing and found pets
  - Dynamic pet counts in section headers
  - Card-based layout with all pet details
  - "Days missing" calculation
  - Clickable address links to view on map
  - "Mark as Found" functionality with confirmation snackbar
  - "View Photo" button (disabled when no photo available)
  - Direct phone call links
  - Empty state with helpful message

- ✅ **Pet Cards & Dialogs**
  - Reusable MissingPetCard component
  - Status chips (missing/found) with color coding
  - Photo viewing in modal dialog
  - Image error handling with fallback message
  - Contact information display
  - Conditional "Mark as Found" button (hidden for found pets)

### UI/UX Features

- ✅ **Branding & Design**
  - Custom Crumb theme with brand colors
  - Afacad font family integration
  - Consistent color palette throughout
  - Footer with Crumb logo and social links
  - Header with branding

- ✅ **Pet Type Filtering**
  - Toggle buttons for All/Dogs/Cats
  - Real-time filtering of map and list views
  - Maintains filter across tab switches

- ✅ **Tab Navigation**
  - Three main views: Map, Report Pet, All Reports
  - Deep linking support with selected pet ID
  - Auto-switch to map when viewing specific pet

- ✅ **Data Persistence**
  - Local storage integration
  - Pre-seeded with sample pet data
  - CRUD operations (Create, Read, Update, Delete)
  - Automatic updates across all views

### Technical Features

- ✅ **TypeScript Type Safety**
  - Comprehensive type definitions
  - Interface composition with extends pattern
  - No 'any' types in production code
  - Separate interfaces for form data, stored data, and JSON data

- ✅ **Component Architecture**
  - Modular, reusable components
  - Extracted sub-components (Header, Footer, MissingPetCard, MissingPetDialog)
  - Props-based communication
  - Controlled components with proper state management

- ✅ **Testing**
  - Unit tests for all major components
  - 50+ test cases covering:
    - Component rendering
    - User interactions
    - Form validation
    - Edge cases
    - Accessibility
  - Proper mocking of external dependencies
  - React Testing Library best practices

## Known Limitations & TODOs

### Current Limitations

1. **No Backend/Database**: Data is stored in browser's local storage only
   - Data doesn't sync across devices or browsers
   - Clearing browser data loses all information
   - No user authentication or multi-user support

2. **UK-Only Phone Validation**: Phone number validation is specific to UK formats
   - Would need internationalization for global use
   - No auto-formatting of phone numbers

3. **Map Markers**: When multiple pets are at the same location, markers overlap
   - Could implement marker clustering
   - Could add small offset to nearby markers

4. **Image Hosting**: Pet photos must be externally hosted URLs
   - No image upload functionality
   - No image optimization or compression

5. **Location Input**: Map location selection doesn't reverse geocode to address
   - Users must manually enter address even when selecting on map
   - Could integrate geocoding API

6. **No Pet Search**: No search or filter by pet name, breed, or other attributes
   - Only filters by type (Dog/Cat)

7. **Date Handling**: All dates use browser's local timezone
   - Could cause confusion for international users

### Future Enhancements (TODOs)

- [ ] Add backend API with database (PostgreSQL/MongoDB)
- [ ] Implement user authentication and accounts
- [ ] Add image upload with cloud storage (e.g., AWS S3, Cloudinary)
- [ ] Implement reverse geocoding for map selections
- [ ] Add search and advanced filtering
- [ ] Email/SMS notifications for nearby missing pets
- [ ] Social media sharing functionality
- [ ] Pet found/reunited success stories section
- [ ] Export pet reports as PDF
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] PWA capabilities for offline use
- [ ] Integration with pet microchip databases
- [ ] Marker clustering for map performance
- [ ] Edit/update existing pet reports
- [ ] Delete pet reports
- [ ] Pet report expiration/archiving

## Time Spent

**Total Time: Approximately 12-15 hours**

Breakdown:
- **Initial Setup & Planning (1-2 hours)**: Project setup, dependencies, initial structure
- **Core Features Development (6-8 hours)**: 
  - Map implementation with React Leaflet
  - Form with validation
  - Pet list views
  - State management and data flow
- **UI/UX & Branding (2-3 hours)**:
  - Crumb theme implementation
  - Component styling
  - Header/Footer components
  - Responsive design adjustments
- **Component Refactoring (1-2 hours)**:
  - Extracting reusable components
  - Type safety improvements
  - Interface consolidation
- **Testing (2-3 hours)**:
  - Writing comprehensive unit tests for all components
  - Setting up mocks and test utilities
  - Coverage improvements

## Project Structure

```
src/
├── components/
│   ├── Footer/
│   │   └── Footer.tsx              # Footer with Crumb branding
│   ├── Header/
│   │   └── Header.tsx              # Header with logo and title
│   ├── MissingPetCard/
│   │   ├── MissingPetCard.tsx      # Reusable pet card component
│   │   └── MissingPetCard.test.tsx # Unit tests
│   ├── MissingPetDialog/
│   │   ├── MissingPetDialog.tsx    # Pet details modal dialog
│   │   └── MissingPetDialog.test.tsx
│   ├── MissingPetMap/
│   │   ├── MissingPetMap.tsx       # Interactive map with markers
│   │   └── MissingPetMap.test.tsx
│   ├── PetList/
│   │   ├── PetList.tsx             # List view of all pets
│   │   └── PetList.test.tsx
│   └── ReportPetForm/
│       ├── ReportPetForm.tsx       # Pet reporting form
│       └── ReportPetForm.test.tsx
├── hooks/
│   └── usePets.ts                  # Pet data management hook
├── types/
│   └── Pet.ts                      # TypeScript interfaces
├── utils/
│   └── storage.ts                  # Local storage utilities
├── theme/
│   └── theme.ts                    # MUI theme configuration
├── data/
│   └── petData.json                # Sample pet data
├── App.tsx                         # Main application
├── App.css
├── Footer.css
└── index.tsx
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## License

This project is open source and available under the MIT License.

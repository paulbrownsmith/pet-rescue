# Pet Rescue - Missing Pet Tracker

A React TypeScript application for reporting and tracking missing pets with an interactive map interface.

## Features

- 🗺️ **Interactive Map View**: Visualize all missing pets on an interactive Leaflet map
- 📝 **Report Missing Pets**: Comprehensive form with validation for reporting lost pets
- 📋 **View All Reports**: See all missing and found pets with detailed information
- 💾 **Local Storage**: Data persists in browser's local storage
- 📱 **Responsive Design**: Material-UI components ensure great UX across devices
- ✅ **Form Validation**: Robust validation for all required fields
- 🎯 **Location Selection**: Click on map to select last seen location

## Tech Stack

- **React 19** with TypeScript
- **Material-UI (MUI) v6** for UI components
- **Leaflet & React-Leaflet** for interactive maps
- **Create React App** for build tooling
- **Local Storage** for data persistence

## Project Structure

```
src/
├── components/          # React components
│   ├── MissingPetMap.tsx       # Interactive map component
│   ├── ReportPetForm.tsx       # Pet reporting form
│   └── PetList.tsx             # List view of all pets
├── hooks/              # Custom React hooks
│   └── usePets.ts             # State management hook
├── types/              # TypeScript type definitions
│   └── Pet.ts                 # Pet data types
├── utils/              # Utility functions
│   └── storage.ts             # Local storage helpers
└── App.tsx             # Main application component
```

## Getting Started

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

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Features in Detail

### Map View
- Interactive Leaflet map showing all missing pets
- Click markers to view pet details
- Mark pets as found directly from the map

### Report Pet Form
- Complete pet information (name, type, breed, color)
- Last seen date and location
- Contact information with validation
- Location can be selected on map

### All Reports
- Separate sections for missing and found pets
- Card-based layout with all pet details
- Quick action buttons

## License

This project is open source and available under the MIT License.

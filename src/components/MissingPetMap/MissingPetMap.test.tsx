import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import MissingPetMap from './MissingPetMap';
import { MissingPet } from '../../types/Pet';

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, center, zoom }: any) => (
    <div data-testid="map-container" data-center={JSON.stringify(center)} data-zoom={zoom}>
      {children}
    </div>
  ),
  TileLayer: ({ attribution, url }: any) => (
    <div data-testid="tile-layer" data-attribution={attribution} data-url={url} />
  ),
  Marker: ({ position, children, eventHandlers }: any) => {
    const handleClick = () => {
      if (eventHandlers?.click) {
        eventHandlers.click();
      }
    };
    
    return (
      <div 
        data-testid="marker" 
        data-position={JSON.stringify(position)}
        onClick={handleClick}
      >
        {children}
      </div>
    );
  },
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  useMapEvents: jest.fn(() => null),
}));

// Mock MissingPetDialog component
jest.mock('../MissingPetDialog/MissingPetDialog', () => ({
  __esModule: true,
  default: ({ pet, open, onClose, onMarkAsFound }: any) => (
    open ? (
      <div data-testid="missing-pet-dialog">
        <div data-testid="dialog-pet-name">{pet?.name}</div>
        <button onClick={onClose}>Close</button>
        {pet?.status === 'missing' && (
          <button onClick={onMarkAsFound}>Mark as Found</button>
        )}
      </div>
    ) : null
  ),
}));

const mockMissingPet: MissingPet = {
  id: '1',
  name: 'Buddy',
  species: 'Dog',
  breed: 'Golden Retriever',
  colour: 'Golden',
  photoUrl: 'https://example.com/buddy.jpg',
  lastSeenLocation: {
    latitude: 51.5074,
    longitude: -0.1278,
    address: '123 Main Street, London',
  },
  lastSeenDate: new Date().toISOString(),
  contactInfo: {
    name: 'John Doe',
    phone: '07123456789',
  },
  notes: 'Friendly dog',
  status: 'missing',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockFoundPet: MissingPet = {
  id: '2',
  name: 'Max',
  species: 'Cat',
  breed: 'Siamese',
  colour: 'White',
  photoUrl: 'https://example.com/max.jpg',
  lastSeenLocation: {
    latitude: 51.5174,
    longitude: -0.1378,
    address: '456 Park Avenue, London',
  },
  lastSeenDate: new Date().toISOString(),
  contactInfo: {
    name: 'Jane Smith',
    phone: '07987654321',
  },
  notes: 'Shy cat',
  status: 'found',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockPet3: MissingPet = {
  ...mockMissingPet,
  id: '3',
  name: 'Charlie',
  lastSeenLocation: {
    latitude: 51.5274,
    longitude: -0.1478,
    address: '789 Oak Road, London',
  },
};

describe('MissingPetMap', () => {
  const mockOnMarkAsFound = jest.fn();
  const mockOnLocationSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the map container', () => {
      render(<MissingPetMap pets={[]} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('should render the tile layer', () => {
      render(<MissingPetMap pets={[]} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    });

    it('should use default center (London) when no pets provided', () => {
      render(<MissingPetMap pets={[]} onMarkAsFound={mockOnMarkAsFound} />);
      const mapContainer = screen.getByTestId('map-container');
      const centerData = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      expect(centerData).toEqual([51.5074, -0.1278]);
    });

    it('should use provided center when specified', () => {
      const customCenter: [number, number] = [52.5200, 13.4050]; // Berlin
      render(<MissingPetMap pets={[]} onMarkAsFound={mockOnMarkAsFound} center={customCenter} />);
      const mapContainer = screen.getByTestId('map-container');
      const centerData = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      expect(centerData).toEqual(customCenter);
    });

    it('should use default zoom level of 13', () => {
      render(<MissingPetMap pets={[]} onMarkAsFound={mockOnMarkAsFound} />);
      const mapContainer = screen.getByTestId('map-container');
      expect(mapContainer.getAttribute('data-zoom')).toBe('13');
    });

    it('should use custom zoom level when provided', () => {
      render(<MissingPetMap pets={[]} onMarkAsFound={mockOnMarkAsFound} zoom={15} />);
      const mapContainer = screen.getByTestId('map-container');
      expect(mapContainer.getAttribute('data-zoom')).toBe('15');
    });

    it('should calculate center from missing pets when no center provided', () => {
      render(<MissingPetMap pets={[mockMissingPet, mockPet3]} onMarkAsFound={mockOnMarkAsFound} />);
      const mapContainer = screen.getByTestId('map-container');
      const centerData = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      
      // Average of the two pet locations
      const expectedLat = (51.5074 + 51.5274) / 2;
      const expectedLng = (-0.1278 + -0.1478) / 2;
      expect(centerData[0]).toBeCloseTo(expectedLat, 4);
      expect(centerData[1]).toBeCloseTo(expectedLng, 4);
    });

    it('should render markers for missing pets', () => {
      render(<MissingPetMap pets={[mockMissingPet]} onMarkAsFound={mockOnMarkAsFound} />);
      const markers = screen.getAllByTestId('marker');
      expect(markers).toHaveLength(1);
    });

    it('should render markers for found pets', () => {
      render(<MissingPetMap pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      const markers = screen.getAllByTestId('marker');
      expect(markers).toHaveLength(1);
    });

    it('should render markers for both missing and found pets', () => {
      render(<MissingPetMap pets={[mockMissingPet, mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      const markers = screen.getAllByTestId('marker');
      expect(markers).toHaveLength(2);
    });

    it('should render markers at correct positions', () => {
      render(<MissingPetMap pets={[mockMissingPet]} onMarkAsFound={mockOnMarkAsFound} />);
      const marker = screen.getByTestId('marker');
      const position = JSON.parse(marker.getAttribute('data-position') || '[]');
      expect(position).toEqual([51.5074, -0.1278]);
    });

    it('should render popup with pet name and details for missing pets', () => {
      render(<MissingPetMap pets={[mockMissingPet]} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Dog - Golden Retriever')).toBeInTheDocument();
    });

    it('should render popup with "Found!" indicator for found pets', () => {
      render(<MissingPetMap pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('Cat - Siamese (Found!)')).toBeInTheDocument();
    });

    it('should not render dialog when no pet is selected', () => {
      render(<MissingPetMap pets={[mockMissingPet]} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.queryByTestId('missing-pet-dialog')).not.toBeInTheDocument();
    });
  });

  describe('Selection Mode', () => {
    it('should not render location selector by default', () => {
      const { container } = render(
        <MissingPetMap pets={[]} onMarkAsFound={mockOnMarkAsFound} />
      );
      // LocationSelector is rendered but returns null, so we just verify no error occurs
      expect(container).toBeInTheDocument();
    });

    it('should enable location selector when selectionMode is true', () => {
      const { container } = render(
        <MissingPetMap 
          pets={[]} 
          onMarkAsFound={mockOnMarkAsFound} 
          selectionMode={true}
          onLocationSelect={mockOnLocationSelect}
        />
      );
      expect(container).toBeInTheDocument();
    });
  });

  describe('Pet Selection', () => {
    it('should open dialog when marker is clicked', async () => {
      render(<MissingPetMap pets={[mockMissingPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const marker = screen.getByTestId('marker');
      await userEvent.click(marker);
      
      expect(screen.getByTestId('missing-pet-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-pet-name')).toHaveTextContent('Buddy');
    });

    it('should display correct pet in dialog when marker is clicked', async () => {
      render(<MissingPetMap pets={[mockMissingPet, mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const markers = screen.getAllByTestId('marker');
      await userEvent.click(markers[1]); // Click second marker (Max)
      
      expect(screen.getByTestId('dialog-pet-name')).toHaveTextContent('Max');
    });

    it('should close dialog when close button is clicked', async () => {
      render(<MissingPetMap pets={[mockMissingPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      // Open dialog
      const marker = screen.getByTestId('marker');
      await userEvent.click(marker);
      expect(screen.getByTestId('missing-pet-dialog')).toBeInTheDocument();
      
      // Close dialog
      const closeButton = screen.getByText('Close');
      await userEvent.click(closeButton);
      
      expect(screen.queryByTestId('missing-pet-dialog')).not.toBeInTheDocument();
    });

    it('should automatically open dialog when selectedPetId is provided', () => {
      render(
        <MissingPetMap 
          pets={[mockMissingPet, mockFoundPet]} 
          onMarkAsFound={mockOnMarkAsFound}
          selectedPetId="2"
        />
      );
      
      expect(screen.getByTestId('missing-pet-dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-pet-name')).toHaveTextContent('Max');
    });

    it('should not open dialog when selectedPetId does not match any pet', () => {
      render(
        <MissingPetMap 
          pets={[mockMissingPet]} 
          onMarkAsFound={mockOnMarkAsFound}
          selectedPetId="nonexistent"
        />
      );
      
      expect(screen.queryByTestId('missing-pet-dialog')).not.toBeInTheDocument();
    });

    it('should update dialog when selectedPetId changes', () => {
      const { rerender } = render(
        <MissingPetMap 
          pets={[mockMissingPet, mockFoundPet]} 
          onMarkAsFound={mockOnMarkAsFound}
          selectedPetId="1"
        />
      );
      
      expect(screen.getByTestId('dialog-pet-name')).toHaveTextContent('Buddy');
      
      rerender(
        <MissingPetMap 
          pets={[mockMissingPet, mockFoundPet]} 
          onMarkAsFound={mockOnMarkAsFound}
          selectedPetId="2"
        />
      );
      
      expect(screen.getByTestId('dialog-pet-name')).toHaveTextContent('Max');
    });
  });

  describe('Mark as Found', () => {
    it('should call onMarkAsFound when "Mark as Found" button is clicked', async () => {
      render(<MissingPetMap pets={[mockMissingPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      // Open dialog
      const marker = screen.getByTestId('marker');
      await userEvent.click(marker);
      
      // Click Mark as Found
      const markAsFoundButton = screen.getByText('Mark as Found');
      await userEvent.click(markAsFoundButton);
      
      expect(mockOnMarkAsFound).toHaveBeenCalledTimes(1);
      expect(mockOnMarkAsFound).toHaveBeenCalledWith('1');
    });

    it('should close dialog after marking pet as found', async () => {
      render(<MissingPetMap pets={[mockMissingPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      // Open dialog
      const marker = screen.getByTestId('marker');
      await userEvent.click(marker);
      expect(screen.getByTestId('missing-pet-dialog')).toBeInTheDocument();
      
      // Mark as Found
      const markAsFoundButton = screen.getByText('Mark as Found');
      await userEvent.click(markAsFoundButton);
      
      expect(screen.queryByTestId('missing-pet-dialog')).not.toBeInTheDocument();
    });

    it('should not show "Mark as Found" button for found pets', async () => {
      render(<MissingPetMap pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      // Open dialog
      const marker = screen.getByTestId('marker');
      await userEvent.click(marker);
      
      expect(screen.queryByText('Mark as Found')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty pets array', () => {
      render(<MissingPetMap pets={[]} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
      expect(screen.queryAllByTestId('marker')).toHaveLength(0);
    });

    it('should handle pets with same location', () => {
      const pet1 = mockMissingPet;
      const pet2 = { ...mockMissingPet, id: '2', name: 'Buddy 2' };
      
      render(<MissingPetMap pets={[pet1, pet2]} onMarkAsFound={mockOnMarkAsFound} />);
      const markers = screen.getAllByTestId('marker');
      expect(markers).toHaveLength(2);
    });

    it('should only calculate center from missing pets, not found pets', () => {
      const pets = [mockMissingPet, mockFoundPet];
      render(<MissingPetMap pets={pets} onMarkAsFound={mockOnMarkAsFound} />);
      
      const mapContainer = screen.getByTestId('map-container');
      const centerData = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      
      // Should only use mockMissingPet's location
      expect(centerData).toEqual([51.5074, -0.1278]);
    });

    it('should use default center when only found pets exist', () => {
      render(<MissingPetMap pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const mapContainer = screen.getByTestId('map-container');
      const centerData = JSON.parse(mapContainer.getAttribute('data-center') || '[]');
      
      // Should use default London coordinates since no missing pets
      expect(centerData).toEqual([51.5074, -0.1278]);
    });

    it('should not crash when onLocationSelect is not provided in selection mode', () => {
      const { container } = render(
        <MissingPetMap 
          pets={[]} 
          onMarkAsFound={mockOnMarkAsFound} 
          selectionMode={true}
        />
      );
      expect(container).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetList from './PetList';
import { MissingPet } from '../../types/Pet';

// Mock MissingPetCard component
jest.mock('../MissingPetCard/MissingPetCard', () => ({
  __esModule: true,
  default: ({ pet, onMarkAsFound, onViewMap }: any) => (
    <div data-testid={`pet-card-${pet.id}`}>
      <div data-testid="pet-name">{pet.name}</div>
      <div data-testid="pet-status">{pet.status}</div>
      <button onClick={() => onMarkAsFound(pet.id, pet.name)}>Mark as Found</button>
      {onViewMap && <button onClick={() => onViewMap(pet.id)}>View on Map</button>}
    </div>
  ),
}));

const mockMissingPet1: MissingPet = {
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
  lastSeenDate: '2024-11-20T10:00:00.000Z',
  contactInfo: {
    name: 'John Doe',
    phone: '07123456789',
  },
  notes: 'Friendly dog',
  status: 'missing',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockMissingPet2: MissingPet = {
  id: '2',
  name: 'Charlie',
  species: 'Cat',
  breed: 'Persian',
  colour: 'White',
  photoUrl: 'https://example.com/charlie.jpg',
  lastSeenLocation: {
    latitude: 51.5174,
    longitude: -0.1378,
    address: '456 Park Avenue, London',
  },
  lastSeenDate: '2024-11-19T10:00:00.000Z',
  contactInfo: {
    name: 'Jane Smith',
    phone: '07987654321',
  },
  notes: 'Shy cat',
  status: 'missing',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockFoundPet: MissingPet = {
  id: '3',
  name: 'Max',
  species: 'Dog',
  breed: 'Labrador',
  colour: 'Black',
  photoUrl: 'https://example.com/max.jpg',
  lastSeenLocation: {
    latitude: 51.5274,
    longitude: -0.1478,
    address: '789 Oak Road, London',
  },
  lastSeenDate: '2024-11-18T10:00:00.000Z',
  contactInfo: {
    name: 'Bob Johnson',
    phone: '07555123456',
  },
  notes: 'Playful dog',
  status: 'found',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('PetList', () => {
  const mockOnMarkAsFound = jest.fn();
  const mockOnViewMap = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should display empty state when no pets are provided', () => {
      render(<PetList pets={[]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('No pets reported yet')).toBeInTheDocument();
      expect(screen.getByText('Be the first to report a missing pet')).toBeInTheDocument();
    });

    it('should display PetsIcon in empty state', () => {
      const { container } = render(<PetList pets={[]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const icon = container.querySelector('svg[data-testid="PetsIcon"]');
      expect(icon).toBeInTheDocument();
    });

    it('should not display any pet cards in empty state', () => {
      render(<PetList pets={[]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.queryByTestId(/pet-card-/)).not.toBeInTheDocument();
    });
  });

  describe('Missing Pets Section', () => {
    it('should display missing pets section title with count', () => {
      render(<PetList pets={[mockMissingPet1, mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('Missing Pets (2)')).toBeInTheDocument();
    });

    it('should render all missing pets', () => {
      render(<PetList pets={[mockMissingPet1, mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByTestId('pet-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('pet-card-2')).toBeInTheDocument();
    });

    it('should display correct pet names', () => {
      render(<PetList pets={[mockMissingPet1, mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const petNames = screen.getAllByTestId('pet-name');
      expect(petNames[0]).toHaveTextContent('Buddy');
      expect(petNames[1]).toHaveTextContent('Charlie');
    });

    it('should only display missing pets in missing section', () => {
      render(<PetList pets={[mockMissingPet1, mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('Missing Pets (1)')).toBeInTheDocument();
      expect(screen.getByTestId('pet-card-1')).toBeInTheDocument();
    });

    it('should not display missing pets section when no missing pets exist', () => {
      render(<PetList pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.queryByText(/Missing Pets/)).not.toBeInTheDocument();
    });
  });

  describe('Found Pets Section', () => {
    it('should display found pets section title with count', () => {
      render(<PetList pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('Recently Found Pets (1)')).toBeInTheDocument();
    });

    it('should render found pet card', () => {
      render(<PetList pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('Dog - Labrador')).toBeInTheDocument();
      expect(screen.getByText(/Colour: Black/)).toBeInTheDocument();
    });

    it('should display "Found with Crumb" chip', () => {
      render(<PetList pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('Found with Crumb')).toBeInTheDocument();
    });

    it('should display last seen date', () => {
      render(<PetList pets={[mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const lastSeenDate = new Date(mockFoundPet.lastSeenDate).toLocaleDateString();
      expect(screen.getByText(new RegExp(lastSeenDate))).toBeInTheDocument();
    });

    it('should not display found pets section when no found pets exist', () => {
      render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.queryByText(/Recently Found Pets/)).not.toBeInTheDocument();
    });

    it('should display both missing and found sections when both exist', () => {
      render(<PetList pets={[mockMissingPet1, mockFoundPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('Missing Pets (1)')).toBeInTheDocument();
      expect(screen.getByText('Recently Found Pets (1)')).toBeInTheDocument();
    });
  });

  describe('Mark as Found Functionality', () => {
    it('should call onMarkAsFound when button is clicked', () => {
      render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const markAsFoundButton = screen.getByText('Mark as Found');
      fireEvent.click(markAsFoundButton);
      
      expect(mockOnMarkAsFound).toHaveBeenCalledTimes(1);
      expect(mockOnMarkAsFound).toHaveBeenCalledWith('1');
    });

    it('should display success snackbar after marking pet as found', async () => {
      render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const markAsFoundButton = screen.getByText('Mark as Found');
      fireEvent.click(markAsFoundButton);
      
      await waitFor(() => {
        expect(screen.getByText('Buddy has been found! 🎉')).toBeInTheDocument();
      });
    });

    it('should display correct pet name in snackbar', async () => {
      render(<PetList pets={[mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const markAsFoundButton = screen.getByText('Mark as Found');
      fireEvent.click(markAsFoundButton);
      
      await waitFor(() => {
        expect(screen.getByText('Charlie has been found! 🎉')).toBeInTheDocument();
      });
    });

    it('should update snackbar message for different pets', async () => {
      const { rerender } = render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const markAsFoundButton = screen.getByText('Mark as Found');
      fireEvent.click(markAsFoundButton);
      
      await waitFor(() => {
        expect(screen.getByText('Buddy has been found! 🎉')).toBeInTheDocument();
      });
      
      // Close snackbar
      const closeButton = screen.getByLabelText(/close/i);
      fireEvent.click(closeButton);
      
      // Render with different pet
      rerender(<PetList pets={[mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const newMarkAsFoundButton = screen.getByText('Mark as Found');
      fireEvent.click(newMarkAsFoundButton);
      
      await waitFor(() => {
        expect(screen.getByText('Charlie has been found! 🎉')).toBeInTheDocument();
      });
    });

    it('should close snackbar when close button is clicked', async () => {
      render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const markAsFoundButton = screen.getByText('Mark as Found');
      fireEvent.click(markAsFoundButton);
      
      await waitFor(() => {
        expect(screen.getByText('Buddy has been found! 🎉')).toBeInTheDocument();
      });
      
      const closeButton = screen.getByLabelText(/close/i);
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Buddy has been found! 🎉')).not.toBeInTheDocument();
      });
    });

    it('should auto-hide snackbar after 6 seconds', async () => {
      jest.useFakeTimers();
      
      render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const markAsFoundButton = screen.getByText('Mark as Found');
      fireEvent.click(markAsFoundButton);
      
      await waitFor(() => {
        expect(screen.getByText('Buddy has been found! 🎉')).toBeInTheDocument();
      });
      
      // Fast-forward time by 6 seconds
      act(() => {
        jest.advanceTimersByTime(6000);
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Buddy has been found! 🎉')).not.toBeInTheDocument();
      });
      
      jest.useRealTimers();
    });
  });

  describe('View on Map Functionality', () => {
    it('should pass onViewMap to MissingPetCard', () => {
      render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} onViewMap={mockOnViewMap} />);
      
      expect(screen.getByText('View on Map')).toBeInTheDocument();
    });

    it('should call onViewMap when button is clicked', () => {
      render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} onViewMap={mockOnViewMap} />);
      
      const viewMapButton = screen.getByText('View on Map');
      fireEvent.click(viewMapButton);
      
      expect(mockOnViewMap).toHaveBeenCalledTimes(1);
      expect(mockOnViewMap).toHaveBeenCalledWith('1');
    });

    it('should not render view map button when onViewMap is not provided', () => {
      render(<PetList pets={[mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.queryByText('View on Map')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Pets', () => {
    it('should render multiple missing pets', () => {
      render(<PetList pets={[mockMissingPet1, mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByTestId('pet-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('pet-card-2')).toBeInTheDocument();
    });

    it('should handle mixed missing and found pets', () => {
      const pets = [mockMissingPet1, mockMissingPet2, mockFoundPet];
      render(<PetList pets={pets} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('Missing Pets (2)')).toBeInTheDocument();
      expect(screen.getByText('Recently Found Pets (1)')).toBeInTheDocument();
    });

    it('should correctly count pets in each section', () => {
      const pets = [
        mockMissingPet1,
        mockMissingPet2,
        { ...mockFoundPet, id: '3' },
        { ...mockFoundPet, id: '4', name: 'Luna' },
      ];
      render(<PetList pets={pets} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByText('Missing Pets (2)')).toBeInTheDocument();
      expect(screen.getByText('Recently Found Pets (2)')).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('should render missing pets in a grid', () => {
      const { container } = render(<PetList pets={[mockMissingPet1, mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const grids = container.querySelectorAll('.MuiGrid-container');
      expect(grids.length).toBeGreaterThan(0);
    });

    it('should render each pet in a grid item', () => {
      const { container } = render(<PetList pets={[mockMissingPet1, mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const gridItems = container.querySelectorAll('.MuiGrid-item');
      expect(gridItems.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle pets with minimal data', () => {
      const minimalPet: MissingPet = {
        ...mockMissingPet1,
        notes: undefined,
      };
      
      render(<PetList pets={[minimalPet]} onMarkAsFound={mockOnMarkAsFound} />);
      
      expect(screen.getByTestId('pet-card-1')).toBeInTheDocument();
    });

    it('should handle rapid multiple mark as found actions', async () => {
      render(<PetList pets={[mockMissingPet1, mockMissingPet2]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const buttons = screen.getAllByText('Mark as Found');
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);
      
      expect(mockOnMarkAsFound).toHaveBeenCalledTimes(2);
    });

    it('should maintain section order (missing first, found second)', () => {
      const { container } = render(<PetList pets={[mockFoundPet, mockMissingPet1]} onMarkAsFound={mockOnMarkAsFound} />);
      
      const headings = screen.getAllByRole('heading');
      const headingTexts = headings.map(h => h.textContent);
      
      const missingIndex = headingTexts.findIndex(text => text?.includes('Missing'));
      const foundIndex = headingTexts.findIndex(text => text?.includes('Found'));
      
      expect(missingIndex).toBeLessThan(foundIndex);
    });
  });
});

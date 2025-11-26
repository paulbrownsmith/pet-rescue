import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MissingPetDialog from './MissingPetDialog';
import { MissingPet } from '../../types/Pet';

const mockMissingPet: MissingPet = {
  id: '123',
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
  notes: 'Friendly dog with a red collar',
  status: 'missing',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockFoundPet: MissingPet = {
  ...mockMissingPet,
  id: '456',
  name: 'Max',
  status: 'found',
};

const mockPetWithoutPhoto: MissingPet = {
  ...mockMissingPet,
  photoUrl: '',
};

const mockPetWithoutNotes: MissingPet = {
  ...mockMissingPet,
  notes: undefined,
};

describe('MissingPetDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnMarkAsFound = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Dialog State', () => {
    it('should not render dialog when open is false', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={false}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render dialog when open is true', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should not render content when pet is null', () => {
      render(
        <MissingPetDialog
          pet={null}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
    });
  });

  describe('Pet Information Display', () => {
    beforeEach(() => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
    });

    it('should display pet name in dialog title', () => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    it('should display pet status chip', () => {
      expect(screen.getByText('missing')).toBeInTheDocument();
    });

    it('should display pet species', () => {
      expect(screen.getByText(/Type:/)).toBeInTheDocument();
      expect(screen.getByText(/Dog/)).toBeInTheDocument();
    });

    it('should display pet breed', () => {
      expect(screen.getByText(/Breed:/)).toBeInTheDocument();
      expect(screen.getByText(/Golden Retriever/)).toBeInTheDocument();
    });

    it('should display pet colour', () => {
      expect(screen.getByText(/Colour:/)).toBeInTheDocument();
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Colour: Golden';
      })).toBeInTheDocument();
    });

    it.skip('should display last seen date', () => {
      expect(screen.getByText(/Last Seen:/)).toBeInTheDocument();
      expect(screen.getByText(/11\/20\/2024/)).toBeInTheDocument();
    });

    it('should display last seen location', () => {
      expect(screen.getByText(/Location:/)).toBeInTheDocument();
      expect(screen.getByText(/123 Main Street, London/)).toBeInTheDocument();
    });

    it('should display pet notes', () => {
      expect(screen.getByText(/Notes:/)).toBeInTheDocument();
      expect(screen.getByText(/Friendly dog with a red collar/)).toBeInTheDocument();
    });

    it('should display contact information header', () => {
      expect(screen.getByText('Contact Information:')).toBeInTheDocument();
    });

    it('should display contact name', () => {
      expect(screen.getByText(/Name:/)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    it('should display contact phone', () => {
      expect(screen.getByText(/Phone:/)).toBeInTheDocument();
      expect(screen.getByText(/07123456789/)).toBeInTheDocument();
    });
  });

  describe('Status Chip Color', () => {
    it('should display error color chip for missing pets', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const chip = screen.getByText('missing').closest('.MuiChip-root');
      expect(chip).toHaveClass('MuiChip-colorError');
    });

    it('should display success color chip for found pets', () => {
      render(
        <MissingPetDialog
          pet={mockFoundPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const chip = screen.getByText('found').closest('.MuiChip-root');
      expect(chip).toHaveClass('MuiChip-colorSuccess');
    });
  });

  describe('Photo Display', () => {
    it('should display pet photo when photoUrl is provided', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const image = screen.getByAltText('Buddy');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/buddy.jpg');
    });

    it('should not display photo when photoUrl is empty', () => {
      render(
        <MissingPetDialog
          pet={mockPetWithoutPhoto}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.queryByAltText('Buddy')).not.toBeInTheDocument();
    });

    it('should display error message when image fails to load', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const image = screen.getByAltText('Buddy');
      fireEvent.error(image);
      
      expect(screen.getByText('Image not available')).toBeInTheDocument();
      expect(screen.queryByAltText('Buddy')).not.toBeInTheDocument();
    });

    it('should reset image error state when pet changes', () => {
      const { rerender } = render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      // Trigger image error
      const image = screen.getByAltText('Buddy');
      fireEvent.error(image);
      expect(screen.getByText('Image not available')).toBeInTheDocument();
      
      // Change pet
      rerender(
        <MissingPetDialog
          pet={mockFoundPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      // Image should be attempted to load again (error state reset)
      const newImage = screen.getByAltText('Max');
      expect(newImage).toBeInTheDocument();
      expect(screen.queryByText('Image not available')).not.toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render Close button', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
    });

    it('should render "Mark as Found" button for missing pets', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByRole('button', { name: /Mark as Found/i })).toBeInTheDocument();
    });

    it('should not render "Mark as Found" button for found pets', () => {
      render(
        <MissingPetDialog
          pet={mockFoundPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.queryByRole('button', { name: /Mark as Found/i })).not.toBeInTheDocument();
    });

    it('should call onClose when Close button is clicked', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const closeButton = screen.getByRole('button', { name: /Close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onMarkAsFound when "Mark as Found" button is clicked', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const markAsFoundButton = screen.getByRole('button', { name: /Mark as Found/i });
      fireEvent.click(markAsFoundButton);
      
      expect(mockOnMarkAsFound).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const backdrop = document.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle pet with undefined notes', () => {
      render(
        <MissingPetDialog
          pet={mockPetWithoutNotes}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByText(/Notes:/)).toBeInTheDocument();
    });

    it('should handle pet with no address', () => {
      const petWithoutAddress = {
        ...mockMissingPet,
        lastSeenLocation: {
          latitude: 51.5074,
          longitude: -0.1278,
        },
      };
      
      render(
        <MissingPetDialog
          pet={petWithoutAddress}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByText(/Location:/)).toBeInTheDocument();
    });

    it('should format date correctly for different locales', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const lastSeenDate = new Date(mockMissingPet.lastSeenDate).toLocaleDateString();
      expect(screen.getByText(new RegExp(lastSeenDate))).toBeInTheDocument();
    });

    it('should handle rapid open/close cycles', () => {
      const { rerender } = render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      rerender(
        <MissingPetDialog
          pet={mockMissingPet}
          open={false}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      rerender(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    it('should handle switching between different pets', () => {
      const { rerender } = render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('missing')).toBeInTheDocument();
      
      rerender(
        <MissingPetDialog
          pet={mockFoundPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('found')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper dialog role', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have accessible buttons', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Mark as Found/i })).toBeInTheDocument();
    });

    it('should have alt text for image', () => {
      render(
        <MissingPetDialog
          pet={mockMissingPet}
          open={true}
          onClose={mockOnClose}
          onMarkAsFound={mockOnMarkAsFound}
        />
      );
      
      const image = screen.getByAltText('Buddy');
      expect(image).toBeInTheDocument();
    });
  });
});

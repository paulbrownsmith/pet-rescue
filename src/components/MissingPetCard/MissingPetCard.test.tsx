import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MissingPetCard from './MissingPetCard';
import { MissingPet } from '../../types/Pet';

const mockPet: MissingPet = {
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
  lastSeenDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  contactInfo: {
    name: 'John Doe',
    phone: '07123456789',
  },
  notes: 'Friendly dog with a red collar',
  status: 'missing',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockPetWithoutPhoto: MissingPet = {
  ...mockPet,
  photoUrl: '',
};

describe('MissingPetCard', () => {
  const mockOnMarkAsFound = jest.fn();
  const mockOnViewMap = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render pet name in the card header', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    it('should render pet status chip', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('missing')).toBeInTheDocument();
    });

    it('should render pet species and breed', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('Dog - Golden Retriever')).toBeInTheDocument();
    });

    it('should render pet colour', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText(/Colour: Golden/)).toBeInTheDocument();
    });

    it('should render days missing calculation', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText(/5 days missing/)).toBeInTheDocument();
    });

    it('should render last seen date', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText(/Last Seen:/)).toBeInTheDocument();
    });

    it('should render last seen address', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('123 Main Street, London')).toBeInTheDocument();
    });

    it('should render pet notes', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('Friendly dog with a red collar')).toBeInTheDocument();
    });

    it('should render contact information', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('07123456789')).toBeInTheDocument();
    });

    it('should render "Mark as Found" button', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByRole('button', { name: /Mark as Found/i })).toBeInTheDocument();
    });

    it('should render "View Photo" button when photoUrl exists', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      const viewPhotoButton = screen.getByRole('button', { name: /View Buddy's Photo/i });
      expect(viewPhotoButton).toBeInTheDocument();
      expect(viewPhotoButton).not.toBeDisabled();
    });

    it('should render "View Photo" button disabled when photoUrl is empty', () => {
      render(<MissingPetCard pet={mockPetWithoutPhoto} onMarkAsFound={mockOnMarkAsFound} />);
      const viewPhotoButton = screen.getByRole('button', { name: /View.*Photo/i });
      expect(viewPhotoButton).toBeInTheDocument();
      expect(viewPhotoButton).toBeDisabled();
    });

    it('should render phone number as a tel link', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      const phoneLink = screen.getByRole('link', { name: '07123456789' });
      expect(phoneLink).toHaveAttribute('href', 'tel:07123456789');
    });
  });

  describe('Interactions', () => {
    it('should call onMarkAsFound with correct parameters when "Mark as Found" is clicked', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      const button = screen.getByRole('button', { name: /Mark as Found/i });
      fireEvent.click(button);
      expect(mockOnMarkAsFound).toHaveBeenCalledTimes(1);
      expect(mockOnMarkAsFound).toHaveBeenCalledWith('123', 'Buddy');
    });

    it('should call onViewMap when address is clicked', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} onViewMap={mockOnViewMap} />);
      const address = screen.getByText('123 Main Street, London');
      fireEvent.click(address);
      expect(mockOnViewMap).toHaveBeenCalledTimes(1);
      expect(mockOnViewMap).toHaveBeenCalledWith('123');
    });

    it('should not call onViewMap when address is clicked if onViewMap is not provided', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      const address = screen.getByText('123 Main Street, London');
      fireEvent.click(address);
      // Should not throw an error
      expect(mockOnViewMap).not.toHaveBeenCalled();
    });

    it('should open dialog when "View Photo" button is clicked', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      const viewButton = screen.getByRole('button', { name: /View Buddy's Photo/i });
      fireEvent.click(viewButton);
      
      // Dialog should be open and show the pet's name in the title
      const dialogTitle = screen.getAllByText('Buddy');
      expect(dialogTitle.length).toBeGreaterThan(1); // One in card header, one in dialog title
    });

    it('should display image in dialog when opened', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      const viewButton = screen.getByRole('button', { name: /View Buddy's Photo/i });
      fireEvent.click(viewButton);
      
      const image = screen.getByAltText('Buddy');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/buddy.jpg');
    });

    it('should close dialog when "Close" button is clicked', async () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      
      // Open dialog
      const viewButton = screen.getByRole('button', { name: /View Buddy's Photo/i });
      fireEvent.click(viewButton);
      
      // Close dialog
      const closeButton = screen.getByRole('button', { name: /Close/i });
      fireEvent.click(closeButton);
      
      // Dialog should be closed - the close button should not be visible anymore
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Close/i })).not.toBeInTheDocument();
      });
    });

    it('should display error message when image fails to load', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      
      // Open dialog
      const viewButton = screen.getByRole('button', { name: /View Buddy's Photo/i });
      fireEvent.click(viewButton);
      
      // Simulate image error
      const image = screen.getByAltText('Buddy');
      fireEvent.error(image);
      
      // Should show error message
      expect(screen.getByText('Image not available')).toBeInTheDocument();
    });

    it('should reset image error state when dialog is reopened', () => {
      render(<MissingPetCard pet={mockPet} onMarkAsFound={mockOnMarkAsFound} />);
      
      // Open dialog
      const viewButton = screen.getByRole('button', { name: /View Buddy's Photo/i });
      fireEvent.click(viewButton);
      
      // Simulate image error
      let image = screen.getByAltText('Buddy');
      fireEvent.error(image);
      expect(screen.getByText('Image not available')).toBeInTheDocument();
      
      // Close dialog
      const closeButton = screen.getByRole('button', { name: /Close/i });
      fireEvent.click(closeButton);
      
      // Reopen dialog
      fireEvent.click(viewButton);
      
      // Image should be attempted to load again (error state reset)
      image = screen.getByAltText('Buddy');
      expect(image).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle pet with no notes', () => {
      const petWithoutNotes = { ...mockPet, notes: undefined };
      render(<MissingPetCard pet={petWithoutNotes} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('Contact:')).toBeInTheDocument();
    });

    it('should handle pet with empty notes', () => {
      const petWithEmptyNotes = { ...mockPet, notes: '' };
      render(<MissingPetCard pet={petWithEmptyNotes} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText('Contact:')).toBeInTheDocument();
    });

    it('should calculate 0 days missing for pet reported today', () => {
      const petReportedToday = { ...mockPet, lastSeenDate: new Date().toISOString() };
      render(<MissingPetCard pet={petReportedToday} onMarkAsFound={mockOnMarkAsFound} />);
      expect(screen.getByText(/0 days missing/)).toBeInTheDocument();
    });

    it('should handle pet with no address', () => {
      const petWithoutAddress = {
        ...mockPet,
        lastSeenLocation: {
          latitude: 51.5074,
          longitude: -0.1278,
        },
      };
      render(<MissingPetCard pet={petWithoutAddress} onMarkAsFound={mockOnMarkAsFound} />);
      // Should still render the component without crashing
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });
  });
});

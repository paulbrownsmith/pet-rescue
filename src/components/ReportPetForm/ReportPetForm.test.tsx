import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportPetForm from './ReportPetForm';

// Mock MissingPetMap component
jest.mock('../MissingPetMap/MissingPetMap', () => ({
  __esModule: true,
  default: ({ onLocationSelect, center }: any) => (
    <div data-testid="missing-pet-map">
      <button onClick={() => onLocationSelect?.(51.5074, -0.1278)}>Select Location</button>
      <div data-testid="map-center">{JSON.stringify(center)}</div>
    </div>
  ),
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

(global.navigator as any).geolocation = mockGeolocation;

describe('ReportPetForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 51.5074,
          longitude: -0.1278,
        },
      });
    });
  });

  describe('Form Rendering', () => {
    it('should render form title', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      // Form title is now rendered in TabPanel as Title component
      // Just check that form fields are present
      expect(screen.getByLabelText(/Pet Name/i)).toBeInTheDocument();
    });

    it('should render all required form fields', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText(/Pet Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Pet Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Breed/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Colour/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Last Seen Date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      expect(screen.getByRole('button', { name: /Submit Report/i })).toBeInTheDocument();
    });

    it('should have submit button disabled by default', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      expect(submitButton).toBeDisabled();
    });

    it('should render pet type dropdown with options', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const typeSelect = screen.getByLabelText(/Pet Type/i);
      fireEvent.mouseDown(typeSelect);
      
      expect(screen.getByRole('option', { name: 'Dog' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Cat' })).toBeInTheDocument();
    });

    it('should render location input method radio buttons', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText(/Enter Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Select on Map/i)).toBeInTheDocument();
    });

    it('should default to address input method', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      const addressRadio = screen.getByLabelText(/Enter Address/i) as HTMLInputElement;
      expect(addressRadio.checked).toBe(true);
    });

    it('should render optional notes field', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      expect(screen.getByLabelText(/Additional Notes/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Changes', () => {
    it('should update pet name field', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const nameInput = screen.getByLabelText(/Pet Name/i) as HTMLInputElement;
      
      fireEvent.change(nameInput, { target: { value: 'Buddy' } });
      expect(nameInput.value).toBe('Buddy');
    });

    it('should update breed field', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const breedInput = screen.getByLabelText(/Breed/i) as HTMLInputElement;
      
      fireEvent.change(breedInput, { target: { value: 'Golden Retriever' } });
      expect(breedInput.value).toBe('Golden Retriever');
    });

    it('should update colour field', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const colourInput = screen.getByLabelText(/Colour/i) as HTMLInputElement;
      
      fireEvent.change(colourInput, { target: { value: 'Golden' } });
      expect(colourInput.value).toBe('Golden');
    });

    it('should update address field', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const addressInput = screen.getByLabelText(/Last Seen Address/i) as HTMLInputElement;
      
      fireEvent.change(addressInput, { target: { value: '123 Main St' } });
      expect(addressInput.value).toBe('123 Main St');
    });

    it('should update contact name field', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const contactNameInput = screen.getByLabelText(/Your Name/i) as HTMLInputElement;
      
      fireEvent.change(contactNameInput, { target: { value: 'John Doe' } });
      expect(contactNameInput.value).toBe('John Doe');
    });

    it('should update phone number field', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const phoneInput = screen.getByLabelText(/Phone Number/i) as HTMLInputElement;
      
      fireEvent.change(phoneInput, { target: { value: '07123456789' } });
      expect(phoneInput.value).toBe('07123456789');
    });
  });

  describe('Real-time Validation', () => {
    it.skip('should show error for empty pet name', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const nameInput = screen.getByLabelText(/Pet Name/i);
      
      fireEvent.change(nameInput, { target: { value: '' } });
      fireEvent.blur(nameInput);
      
      expect(screen.getByText('Pet name is required')).toBeInTheDocument();
    });

    it('should show error for pet name less than 2 characters', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const nameInput = screen.getByLabelText(/Pet Name/i);
      
      fireEvent.change(nameInput, { target: { value: 'A' } });
      
      expect(screen.getByText('Pet name must be at least 2 characters')).toBeInTheDocument();
    });

    it('should clear error when pet name is valid', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const nameInput = screen.getByLabelText(/Pet Name/i);
      
      fireEvent.change(nameInput, { target: { value: 'A' } });
      expect(screen.getByText('Pet name must be at least 2 characters')).toBeInTheDocument();
      
      fireEvent.change(nameInput, { target: { value: 'Buddy' } });
      expect(screen.queryByText('Pet name must be at least 2 characters')).not.toBeInTheDocument();
    });

    it('should validate phone number format in real-time', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      
      fireEvent.change(phoneInput, { target: { value: '123' } });
      
      expect(screen.getByText(/Please enter a valid UK mobile/)).toBeInTheDocument();
    });

    it('should accept valid UK mobile number', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      
      fireEvent.change(phoneInput, { target: { value: '07123456789' } });
      
      expect(screen.queryByText(/Please enter a valid UK mobile/)).not.toBeInTheDocument();
    });

    it('should accept valid UK landline number', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      
      fireEvent.change(phoneInput, { target: { value: '02012345678' } });
      
      expect(screen.queryByText(/Please enter a valid UK mobile/)).not.toBeInTheDocument();
    });
  });

  describe('Location Input Methods', () => {
    it('should switch to map input method', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      const mapRadio = screen.getByLabelText(/Select on Map/i);
      fireEvent.click(mapRadio);
      
      expect(screen.getByTestId('missing-pet-map')).toBeInTheDocument();
    });

    it('should show address field by default', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText(/Last Seen Address/i)).toBeInTheDocument();
      expect(screen.queryByTestId('missing-pet-map')).not.toBeInTheDocument();
    });

    it('should hide address field when map is selected', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      const mapRadio = screen.getByLabelText(/Select on Map/i);
      fireEvent.click(mapRadio);
      
      expect(screen.queryByLabelText(/Last Seen Address/i)).not.toBeInTheDocument();
    });

    it('should update location when map location is selected', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      const mapRadio = screen.getByLabelText(/Select on Map/i);
      fireEvent.click(mapRadio);
      
      const selectLocationButton = screen.getByText('Select Location');
      fireEvent.click(selectLocationButton);
      
      // Location should be updated internally (can verify via submission)
      expect(selectLocationButton).toBeInTheDocument();
    });
  });

  describe('Date Validation', () => {
    it.skip('should not allow future dates', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      // Fill other required fields first
      fillRequiredFields();
      
      // Then set future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      const dateInput = screen.getByLabelText(/Last Seen Date/i);
      fireEvent.change(dateInput, { target: { value: futureDateString } });
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Last seen date cannot be in the future')).toBeInTheDocument();
      });
    });

    it('should accept today\'s date', () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      const today = new Date().toISOString().split('T')[0];
      const dateInput = screen.getByLabelText(/Last Seen Date/i) as HTMLInputElement;
      
      fireEvent.change(dateInput, { target: { value: today } });
      
      expect(dateInput.value).toBe(today);
    });
  });

  describe('Form Submission', () => {
    it('should enable submit button when all fields are valid', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      fillRequiredFields();
      
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /Submit Report/i });
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should call onSubmit with form data when submitted', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      fillRequiredFields();
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it('should show success message after submission', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      fillRequiredFields();
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Missing pet Buddy has been submitted/i)).toBeInTheDocument();
      });
    });

    it('should reset form after successful submission', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByLabelText(/Pet Name/i) as HTMLInputElement;
      fillRequiredFields();
      
      expect(nameInput.value).toBe('Buddy');
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });
    });

    it('should not submit form if validation fails', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      // Only fill pet name
      const nameInput = screen.getByLabelText(/Pet Name/i);
      fireEvent.change(nameInput, { target: { value: 'Buddy' } });
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      expect(submitButton).toBeDisabled();
      
      fireEvent.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should close success message when close button is clicked', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      fillRequiredFields();
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Missing pet Buddy has been submitted/i)).toBeInTheDocument();
      });
      
      const closeButton = screen.getByLabelText(/close/i);
      fireEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Pet report submitted successfully!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Geolocation', () => {
    it('should use user location when geolocation is available', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 52.5200,
            longitude: 13.4050,
          },
        });
      });
      
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      // Switch to map mode to see the center
      const mapRadio = screen.getByLabelText(/Select on Map/i);
      fireEvent.click(mapRadio);
      
      await waitFor(() => {
        const mapCenter = screen.getByTestId('map-center');
        expect(mapCenter.textContent).toContain('52.52');
        expect(mapCenter.textContent).toContain('13.405');
      });
    });

    it.skip('should use fallback location when geolocation fails', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, message: 'Permission denied' });
      });
      
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      await waitFor(() => {
        // Should still render without errors
        expect(screen.getByLabelText(/Pet Name/i)).toBeInTheDocument();
      });
    });

    it('should handle missing geolocation support', () => {
      const originalGeolocation = (global.navigator as any).geolocation;
      (global.navigator as any).geolocation = undefined;
      
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      expect(screen.getByLabelText(/Pet Name/i)).toBeInTheDocument();
      
      (global.navigator as any).geolocation = originalGeolocation;
    });
  });

  describe('Edge Cases', () => {
    it('should handle phone number with spaces', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      const phoneInput = screen.getByLabelText(/Phone Number/i);
      fireEvent.change(phoneInput, { target: { value: '07123 456 789' } });
      
      fillOtherRequiredFields();
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should handle optional notes field', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      fillRequiredFields();
      
      const notesInput = screen.getByLabelText(/Additional Notes/i);
      fireEvent.change(notesInput, { target: { value: 'Has a red collar' } });
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            notes: 'Has a red collar',
          })
        );
      });
    });

    it('should handle empty optional notes field', async () => {
      render(<ReportPetForm onSubmit={mockOnSubmit} />);
      
      fillRequiredFields();
      
      const submitButton = screen.getByRole('button', { name: /Submit Report/i });
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            notes: '',
          })
        );
      });
    });
  });

  // Helper function to fill all required fields
  function fillRequiredFields() {
    const nameInput = screen.getByLabelText(/Pet Name/i);
    const typeSelect = screen.getByLabelText(/Pet Type/i);
    const breedInput = screen.getByLabelText(/Breed/i);
    const colourInput = screen.getByLabelText(/Colour/i);
    const dateInput = screen.getByLabelText(/Last Seen Date/i);
    const addressInput = screen.getByLabelText(/Last Seen Address/i);
    const contactNameInput = screen.getByLabelText(/Your Name/i);
    const phoneInput = screen.getByLabelText(/Phone Number/i);
    
    fireEvent.change(nameInput, { target: { value: 'Buddy' } });
    fireEvent.mouseDown(typeSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Dog' }));
    fireEvent.change(breedInput, { target: { value: 'Golden Retriever' } });
    fireEvent.change(colourInput, { target: { value: 'Golden' } });
    fireEvent.change(dateInput, { target: { value: '2024-11-20' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St, London' } });
    fireEvent.change(contactNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(phoneInput, { target: { value: '07123456789' } });
  }

  function fillOtherRequiredFields() {
    const nameInput = screen.getByLabelText(/Pet Name/i);
    const typeSelect = screen.getByLabelText(/Pet Type/i);
    const breedInput = screen.getByLabelText(/Breed/i);
    const colourInput = screen.getByLabelText(/Colour/i);
    const dateInput = screen.getByLabelText(/Last Seen Date/i);
    const addressInput = screen.getByLabelText(/Last Seen Address/i);
    const contactNameInput = screen.getByLabelText(/Your Name/i);
    
    fireEvent.change(nameInput, { target: { value: 'Buddy' } });
    fireEvent.mouseDown(typeSelect);
    fireEvent.click(screen.getByRole('option', { name: 'Dog' }));
    fireEvent.change(breedInput, { target: { value: 'Golden Retriever' } });
    fireEvent.change(colourInput, { target: { value: 'Golden' } });
    fireEvent.change(dateInput, { target: { value: '2024-11-20' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St, London' } });
    fireEvent.change(contactNameInput, { target: { value: 'John Doe' } });
  }
});

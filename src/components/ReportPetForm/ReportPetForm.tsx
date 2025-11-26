import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PetFormData } from '../../types/Pet';
import MissingPetMap from '../MissingPetMap/MissingPetMap';

interface ReportPetFormProps {
  onSubmit: (data: PetFormData) => void;
}

interface FormErrors {
  [key: string]: string;
}

const PET_TYPES = ['Dog', 'Cat'];

const ReportPetForm: React.FC<ReportPetFormProps> = ({ onSubmit }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    species: 'Dog',
    type: '',
    breed: '',
    colour: '',
    lastSeenLocation: {
      lat: 40.7128,
      lng: -74.006,
      address: '',
    },
    lastSeenDate: new Date().toISOString().split('T')[0],
    description: '',
    photoUrl: '',
    notes: '',
    contactInfo: {
      name: '',
      phone: '',
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedPetName, setSubmittedPetName] = useState<string>('');
  const [locationInputMethod, setLocationInputMethod] = useState<'address' | 'map'>('address');

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          // Update form data with user's location
          setFormData((prev) => ({
            ...prev,
            lastSeenLocation: {
              ...prev.lastSeenLocation,
              lat: latitude,
              lng: longitude,
            },
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location (London)
          setUserLocation({ lat: 51.5074, lng: -0.1278 });
        }
      );
    } else {
      // Geolocation not supported, use default
      setUserLocation({ lat: 51.5074, lng: -0.1278 });
    }
  }, []);

  const isFormValid = (): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastSeenDate = new Date(formData.lastSeenDate);
    const isDateValid = lastSeenDate <= today;

    const phone = formData.contactInfo.phone.replace(/\s+/g, '');
    const ukMobileRegex = /^(\+44|0044|0)7\d{9}$/;
    const ukLandlineRegex = /^(\+44|0044|0)[1-3]\d{9,10}$/;
    const isPhoneValid = ukMobileRegex.test(phone) || ukLandlineRegex.test(phone);

    // Address is only required when using address input method
    const isAddressValid = locationInputMethod === 'map' || formData.lastSeenLocation.address.trim() !== '';

    return (
      formData.name.trim() !== '' &&
      formData.name.trim().length >= 2 &&
      formData.type !== '' &&
      formData.breed.trim() !== '' &&
      formData.colour.trim() !== '' &&
      isAddressValid &&
      formData.contactInfo.name.trim() !== '' &&
      formData.contactInfo.phone.trim() !== '' &&
      isPhoneValid &&
      isDateValid
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Pet name must be at least 2 characters';
    }

    if (!formData.type) {
      newErrors.type = 'Pet type is required';
    }

    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed is required';
    }

    if (!formData.colour.trim()) {
      newErrors.colour = 'Colour is required';
    }

    // Address is only required when using address input method
    if (locationInputMethod === 'address' && !formData.lastSeenLocation.address.trim()) {
      newErrors.address = 'Last seen address is required';
    }

    if (!formData.contactInfo.name.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.contactInfo.phone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else {
      const phone = formData.contactInfo.phone.replace(/\s+/g, '');
      // UK mobile: starts with 07 (with optional +44 or 0044)
      // UK landline: starts with 01, 02, or 03 (with optional +44 or 0044)
      const ukMobileRegex = /^(\+44|0044|0)7\d{9}$/;
      const ukLandlineRegex = /^(\+44|0044|0)[1-3]\d{9,10}$/;
      
      if (!ukMobileRegex.test(phone) && !ukLandlineRegex.test(phone)) {
        newErrors.contactPhone = 'Please enter a valid UK mobile (07...) or landline (01/02/03...) number';
      }
    }

    // Validate last seen date is not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastSeenDate = new Date(formData.lastSeenDate);
    if (lastSeenDate > today) {
      newErrors.lastSeenDate = 'Last seen date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PetFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Validate pet name in real-time
    if (field === 'name') {
      if (value.trim() === '') {
        setErrors({
          ...errors,
          name: 'Pet name is required',
        });
      } else if (value.trim().length < 2) {
        setErrors({
          ...errors,
          name: 'Pet name must be at least 2 characters',
        });
      } else {
        setErrors({
          ...errors,
          name: '',
        });
      }
    } else if (errors[field]) {
      // Clear error for other fields
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const handleLocationChange = (field: 'lat' | 'lng' | 'address') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      lastSeenLocation: {
        ...formData.lastSeenLocation,
        [field]: field === 'address' ? e.target.value : parseFloat(e.target.value) || 0,
      },
    });
    if (field === 'address' && errors.address) {
      setErrors({
        ...errors,
        address: '',
      });
    }
  };

  const handleContactChange = (field: 'name' | 'phone') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      contactInfo: {
        ...formData.contactInfo,
        [field]: value,
      },
    });
    
    const errorKey = field === 'name' ? 'contactName' : 'contactPhone';
    
    // Validate phone in real-time
    if (field === 'phone') {
      if (value.trim() === '') {
        setErrors({
          ...errors,
          contactPhone: 'Contact phone is required',
        });
      } else {
        const phone = value.replace(/\s+/g, '');
        const ukMobileRegex = /^(\+44|0044|0)7\d{9}$/;
        const ukLandlineRegex = /^(\+44|0044|0)[1-3]\d{9,10}$/;
        
        if (!ukMobileRegex.test(phone) && !ukLandlineRegex.test(phone)) {
          setErrors({
            ...errors,
            contactPhone: 'Please enter a valid UK mobile (07...) or landline (01/02/03...) number',
          });
        } else {
          setErrors({
            ...errors,
            contactPhone: '',
          });
        }
      }
    } else if (errors[errorKey]) {
      setErrors({
        ...errors,
        [errorKey]: '',
      });
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      lastSeenLocation: {
        ...formData.lastSeenLocation,
        lat,
        lng,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const petName = formData.name;
      onSubmit(formData);
      setSubmittedPetName(petName);
      setShowSuccess(true);
      setFormData({
        name: '',
        species: 'Dog',
        type: '',
        breed: '',
        colour: '',
        lastSeenLocation: {
          lat: 40.7128,
          lng: -74.006,
          address: '',
        },
        lastSeenDate: new Date().toISOString().split('T')[0],
        description: '',
        photoUrl: '',
        notes: '',
        contactInfo: {
          name: '',
          phone: '',
        },
      });
    }
  };

  return (
    <Box sx={{ p: 1.5, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Report a Missing Pet
      </Typography>

      <Snackbar
        open={showSuccess}
        onClose={(event, reason) => {
          // Only allow closing via the close button, not by clicking away or timeout
          if (reason === 'clickaway') {
            return;
          }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          onClose={() => setShowSuccess(false)}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setShowSuccess(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{ width: '100%' }}
        >
          Missing pet {submittedPetName} has been submitted
        </Alert>
      </Snackbar>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pet Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Pet Type"
              value={formData.type}
              onChange={handleInputChange('type')}
              error={!!errors.type}
              helperText={errors.type}
              required
            >
              {PET_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Breed"
              value={formData.breed}
              onChange={handleInputChange('breed')}
              error={!!errors.breed}
              helperText={errors.breed}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Colour"
              value={formData.colour}
              onChange={handleInputChange('colour')}
              error={!!errors.colour}
              helperText={errors.colour}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Seen Date"
              type="date"
              value={formData.lastSeenDate}
              onChange={handleInputChange('lastSeenDate')}
              inputProps={{
                max: new Date().toISOString().split('T')[0]
              }}
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.lastSeenDate}
              helperText={errors.lastSeenDate}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">How would you like to specify the location?</FormLabel>
              <RadioGroup
                row
                value={locationInputMethod}
                onChange={(e) => setLocationInputMethod(e.target.value as 'address' | 'map')}
              >
                <FormControlLabel value="address" control={<Radio />} label="Enter Address" />
                <FormControlLabel value="map" control={<Radio />} label="Select on Map" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {locationInputMethod === 'address' ? (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Seen Address"
                value={formData.lastSeenLocation.address}
                onChange={handleLocationChange('address')}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Box sx={{ height: '400px', border: '1px solid #ccc', borderRadius: 1 }}>
                <MissingPetMap
                  pets={formData.lastSeenLocation.lat && formData.lastSeenLocation.lng ? [{
                    id: 'temp-marker',
                    name: 'Selected Location',
                    species: 'Dog',
                    breed: '',
                    colour: '',
                    photoUrl: '',
                    lastSeenLocation: {
                      latitude: formData.lastSeenLocation.lat,
                      longitude: formData.lastSeenLocation.lng,
                      address: formData.lastSeenLocation.address,
                    },
                    lastSeenDate: new Date().toISOString(),
                    contactInfo: {
                      name: '',
                      phone: '',
                    },
                    notes: '',
                    status: 'missing',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }] : []}
                  onMarkAsFound={() => {}}
                  onLocationSelect={handleLocationSelect}
                  center={userLocation ? [userLocation.lat, userLocation.lng] : [formData.lastSeenLocation.lat, formData.lastSeenLocation.lng]}
                  zoom={13}
                  selectionMode={true}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Click on the map to select the last seen location. Selected coordinates: {formData.lastSeenLocation.lat.toFixed(4)}, {formData.lastSeenLocation.lng.toFixed(4)}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Additional Notes/Distinguishing Features (Optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleInputChange('notes')}
              placeholder="Any unique markings, scars, collar details, or other features that would help identify your pet"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Contact Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Your Name"
              value={formData.contactInfo.name}
              onChange={handleContactChange('name')}
              error={!!errors.contactName}
              helperText={errors.contactName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.contactInfo.phone}
              onChange={handleContactChange('phone')}
              error={!!errors.contactPhone}
              helperText={errors.contactPhone}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large" 
              fullWidth
              disabled={!isFormValid()}
            >
              Submit Report
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ReportPetForm;

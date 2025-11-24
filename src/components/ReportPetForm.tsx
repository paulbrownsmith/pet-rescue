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
} from '@mui/material';
import { PetFormData } from '../types/Pet';
import MissingPetMap from './MissingPetMap';

interface ReportPetFormProps {
  onSubmit: (data: PetFormData) => void;
}

interface FormErrors {
  [key: string]: string;
}

const PET_TYPES = ['Dog', 'Cat', 'Other'];

const ReportPetForm: React.FC<ReportPetFormProps> = ({ onSubmit }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [formData, setFormData] = useState<PetFormData>({
    name: '',
    type: '',
    breed: '',
    color: '',
    lastSeenLocation: {
      lat: 40.7128,
      lng: -74.006,
      address: '',
    },
    lastSeenDate: new Date().toISOString().split('T')[0],
    description: '',
    photoUrl: '',
    contactInfo: {
      name: '',
      phone: '',
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMapSelector, setShowMapSelector] = useState(false);

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
    return (
      formData.name.trim() !== '' &&
      formData.type !== '' &&
      formData.breed.trim() !== '' &&
      formData.color.trim() !== '' &&
      formData.lastSeenLocation.address.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.contactInfo.name.trim() !== '' &&
      formData.contactInfo.phone.trim() !== '' &&
      /^\+?[\d\s\-()]+$/.test(formData.contactInfo.phone)
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pet name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Pet type is required';
    }

    if (!formData.breed.trim()) {
      newErrors.breed = 'Breed is required';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    if (!formData.lastSeenLocation.address.trim()) {
      newErrors.address = 'Last seen address is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.contactInfo.name.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.contactInfo.phone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.contactInfo.phone)) {
      newErrors.contactPhone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PetFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    // Clear error for this field
    if (errors[field]) {
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
    setFormData({
      ...formData,
      contactInfo: {
        ...formData.contactInfo,
        [field]: e.target.value,
      },
    });
    const errorKey = field === 'name' ? 'contactName' : 'contactPhone';
    if (errors[errorKey]) {
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
    setShowMapSelector(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setShowSuccess(true);
      // Reset form
      setFormData({
        name: '',
        type: '',
        breed: '',
        color: '',
        lastSeenLocation: {
          lat: 40.7128,
          lng: -74.006,
          address: '',
        },
        lastSeenDate: new Date().toISOString().split('T')[0],
        description: '',
        photoUrl: '',
        contactInfo: {
          name: '',
          phone: '',
        },
      });
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <Box component={Paper} elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Report a Missing Pet
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setShowSuccess(false)}>
          Pet report submitted successfully!
        </Alert>
      )}

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
              label="Color"
              value={formData.color}
              onChange={handleInputChange('color')}
              error={!!errors.color}
              helperText={errors.color}
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
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              value={formData.lastSeenLocation.lat}
              onChange={handleLocationChange('lat')}
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              value={formData.lastSeenLocation.lng}
              onChange={handleLocationChange('lng')}
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowMapSelector(!showMapSelector)}
              sx={{ height: '56px' }}
            >
              {showMapSelector ? 'Hide Map' : 'Select on Map'}
            </Button>
          </Grid>
          {showMapSelector && (
            <Grid item xs={12}>
              <Box sx={{ height: '300px', border: '1px solid #ccc', borderRadius: 1 }}>
                <MissingPetMap
                  pets={[]}
                  onMarkAsFound={() => {}}
                  onLocationSelect={handleLocationSelect}
                  center={[formData.lastSeenLocation.lat, formData.lastSeenLocation.lng]}
                  zoom={13}
                  selectionMode={true}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Click on the map to select the last seen location
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe your pet, any distinguishing features, behavior, etc."
              required
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

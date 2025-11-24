import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Pet } from '../types/Pet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface MissingPetMapProps {
  pets: Pet[];
  onMarkAsFound: (id: string) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  center?: LatLngExpression;
  zoom?: number;
  selectionMode?: boolean;
  selectedPetId?: string | null;
}

const LocationSelector: React.FC<{ onLocationSelect: (lat: number, lng: number) => void }> = ({
  onLocationSelect,
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MissingPetMap: React.FC<MissingPetMapProps> = ({
  pets,
  onMarkAsFound,
  onLocationSelect,
  center,
  zoom = 13,
  selectionMode = false,
  selectedPetId,
}) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (selectedPetId) {
      const pet = pets.find(p => p.id === selectedPetId);
      if (pet) {
        setSelectedPet(pet);
        setImageError(false);
      }
    }
  }, [selectedPetId, pets]);

  const handleMarkerClick = (pet: Pet) => {
    setSelectedPet(pet);
    setImageError(false);
  };

  const handleClose = () => {
    setSelectedPet(null);
    setImageError(false);
  };

  const handleMarkAsFound = () => {
    if (selectedPet) {
      onMarkAsFound(selectedPet.id);
      handleClose();
    }
  };

  const missingPets = pets.filter((pet) => pet.status === 'missing');

  // Calculate center from missing pets or use provided center or default to London
  const mapCenter: LatLngExpression = center || (() => {
    if (missingPets.length > 0) {
      const avgLat = missingPets.reduce((sum, pet) => sum + pet.lastSeenLocation.latitude, 0) / missingPets.length;
      const avgLng = missingPets.reduce((sum, pet) => sum + pet.lastSeenLocation.longitude, 0) / missingPets.length;
      return [avgLat, avgLng];
    }
    return [51.5074, -0.1278]; // Default to London
  })();

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectionMode && onLocationSelect && (
          <LocationSelector onLocationSelect={onLocationSelect} />
        )}
        {missingPets.map((pet) => (
          <Marker
            key={pet.id}
            position={[pet.lastSeenLocation.latitude, pet.lastSeenLocation.longitude]}
            eventHandlers={{
              click: () => handleMarkerClick(pet),
            }}
          >
            <Popup>
              <Typography variant="subtitle2" fontWeight="bold">
                {pet.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pet.species} - {pet.breed}
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <Dialog open={!!selectedPet} onClose={handleClose} maxWidth="sm" fullWidth>
        {selectedPet && (
          <>
            <DialogTitle>
              {selectedPet.name}
              <Chip
                label={selectedPet.status}
                color={selectedPet.status === 'missing' ? 'error' : 'success'}
                size="small"
                sx={{ ml: 1 }}
              />
            </DialogTitle>
            <DialogContent>
              {selectedPet.photoUrl && !imageError && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <img 
                    src={selectedPet.photoUrl} 
                    alt={selectedPet.name}
                    onError={() => setImageError(true)}
                    style={{ 
                      width: '100%', 
                      maxHeight: '300px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}
              {selectedPet.photoUrl && imageError && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Image not available
                  </Typography>
                </Box>
              )}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    <strong>Type:</strong> {selectedPet.species}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Breed:</strong> {selectedPet.breed}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Colour:</strong> {selectedPet.colour}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Last Seen:</strong> {new Date(selectedPet.lastSeenDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Location:</strong> {selectedPet.lastSeenLocation.address}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Notes:</strong> {selectedPet.notes}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Contact Information:
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedPet.contactInfo.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedPet.contactInfo.phone}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={handleClose}>Close</Button>
              {selectedPet.status === 'missing' && (
                <Button onClick={handleMarkAsFound} variant="contained" color="success">
                  Mark as Found
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MissingPetMap;

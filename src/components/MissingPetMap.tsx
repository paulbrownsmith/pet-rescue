import React, { useState } from 'react';
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
  center = [40.7128, -74.006], // Default to NYC
  zoom = 12,
  selectionMode = false,
}) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const handleMarkerClick = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const handleClose = () => {
    setSelectedPet(null);
  };

  const handleMarkAsFound = () => {
    if (selectedPet) {
      onMarkAsFound(selectedPet.id);
      handleClose();
    }
  };

  const missingPets = pets.filter((pet) => pet.status === 'missing');

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
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
            position={[pet.lastSeenLocation.lat, pet.lastSeenLocation.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(pet),
            }}
          >
            <Popup>
              <Typography variant="subtitle2" fontWeight="bold">
                {pet.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pet.type} - {pet.breed}
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
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    <strong>Type:</strong> {selectedPet.type}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Breed:</strong> {selectedPet.breed}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Color:</strong> {selectedPet.color}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Last Seen:</strong> {new Date(selectedPet.lastSeenDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Location:</strong> {selectedPet.lastSeenLocation.address}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {selectedPet.description}
                  </Typography>
                  <Box mt={2}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Contact Information:
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedPet.contactName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedPet.contactPhone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedPet.contactEmail}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions>
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

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import {
  Typography,
  Box,
} from '@mui/material';
import { MissingPet } from '../../types/Pet';
import MissingPetDialog from '../MissingPetDialog/MissingPetDialog';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

// Create custom icon for found pets (green marker)
const foundPetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create custom icon for missing pets (red marker)
const missingPetIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MissingPetMapProps {
  pets: MissingPet[];
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
  const [selectedPet, setSelectedPet] = useState<MissingPet | null>(null);

  useEffect(() => {
    if (selectedPetId) {
      const pet = pets.find(p => p.id === selectedPetId);
      if (pet) {
        setSelectedPet(pet);
      }
    }
  }, [selectedPetId, pets]);

  const handleMarkerClick = (pet: MissingPet) => {
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
  const foundPets = pets.filter((pet) => pet.status === 'found');

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
            icon={missingPetIcon}
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
        {foundPets.map((pet) => (
          <Marker
            key={pet.id}
            position={[pet.lastSeenLocation.latitude, pet.lastSeenLocation.longitude]}
            icon={foundPetIcon}
            eventHandlers={{
              click: () => handleMarkerClick(pet),
            }}
          >
            <Popup>
              <Typography variant="subtitle2" fontWeight="bold">
                {pet.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pet.species} - {pet.breed} (Found!)
              </Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <MissingPetDialog
        pet={selectedPet}
        open={!!selectedPet}
        onClose={handleClose}
        onMarkAsFound={handleMarkAsFound}
      />
    </Box>
  );
};

export default MissingPetMap;

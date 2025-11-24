import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CardActions,
} from '@mui/material';
import { Pet } from '../types/Pet';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';

interface PetListProps {
  pets: Pet[];
  onMarkAsFound: (id: string) => void;
}

const PetList: React.FC<PetListProps> = ({ pets, onMarkAsFound }) => {
  if (pets.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <PetsIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No pets reported yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Be the first to report a missing pet
        </Typography>
      </Box>
    );
  }

  const missingPets = pets.filter((pet) => pet.status === 'missing');
  const foundPets = pets.filter((pet) => pet.status === 'found');

  return (
    <Box px={2}>
      {missingPets.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Missing Pets ({missingPets.length})
          </Typography>
          <Grid container spacing={2}>
            {missingPets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} key={pet.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="h6" component="div">
                        {pet.name}
                      </Typography>
                      <Chip
                        label={pet.status}
                        color="error"
                        size="medium"
                        sx={{ textTransform: 'uppercase' }}
                        icon={<WarningIcon />}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <PetsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {pet.species} - {pet.breed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Colour: {pet.colour}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <CalendarTodayIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Last Seen: {new Date(pet.lastSeenDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {pet.lastSeenLocation.address}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }} noWrap>
                      {pet.notes}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography color="primary" fontWeight="bold">
                        Contact:
                      </Typography>
                      <Typography display="block">
                        {pet.contactInfo.name}
                      </Typography>
                      <Typography display="block">
                        <a href={`tel:${pet.contactInfo.phone}`} style={{ color: '#fd5b2e', textDecoration: 'none' }}>
                          {pet.contactInfo.phone}
                        </a>
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => onMarkAsFound(pet.id)}
                    >
                      Mark as Found
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {foundPets.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Found Pets ({foundPets.length})
          </Typography>
          <Grid container spacing={2}>
            {foundPets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} key={pet.id}>
                <Card elevation={1} sx={{ opacity: 0.8 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography variant="h6" component="div">
                        {pet.name}
                      </Typography>
                      <Chip
                        label={pet.status}
                        color="success"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <PetsIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {pet.species} - {pet.breed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Colour: {pet.colour}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <CalendarTodayIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Last Seen: {new Date(pet.lastSeenDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default PetList;

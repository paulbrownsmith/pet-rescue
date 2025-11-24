import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CardActions,
  CardHeader,
  Snackbar,
  Alert,
} from '@mui/material';
import { MissingPet } from '../types/Pet';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';

interface PetListProps {
  pets: MissingPet[];
  onMarkAsFound: (id: string) => void;
  onViewMap?: (petId: string) => void;
}

const PetList: React.FC<PetListProps> = ({ pets, onMarkAsFound, onViewMap }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [foundPetName, setFoundPetName] = useState('');

  const handleMarkAsFound = (petId: string, petName: string) => {
    onMarkAsFound(petId);
    setFoundPetName(petName);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
                  <CardHeader
                    sx={{ backgroundColor: '#fff1ed', '& .MuiCardHeader-action': { alignSelf: 'center', marginTop: 0 } }}
                    title={pet.name}
                    action={
                      <Chip
                        label={pet.status}
                        color="error"
                        size="medium"
                        sx={{ textTransform: 'uppercase' }}
                        icon={<WarningIcon />}
                      />
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`${pet.species} - ${pet.breed}`}
                        icon={<PetsIcon />}
                        variant="outlined"
                        size="medium"
                        sx={{ color: 'text.secondary', borderColor: 'text.secondary', width: '100%' }}
                      />
                      <Chip
                        label={`${Math.floor((new Date().getTime() - new Date(pet.lastSeenDate).getTime()) / (1000 * 60 * 60 * 24))} days missing`}
                        icon={<CalendarTodayIcon />}
                        variant="outlined"
                        size="medium"
                        sx={{ color: 'text.secondary', borderColor: 'text.secondary', width: '100%' }}
                      />
                    </Box>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Colour: {pet.colour}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      <CalendarTodayIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Last Seen: {new Date(pet.lastSeenDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      <span
                        onClick={() => onViewMap?.(pet.id)}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {pet.lastSeenLocation.address}
                      </span>
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }} noWrap>
                      {pet.notes}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography color="primary" fontWeight="bold">
                        Contact:
                      </Typography>
                      <Typography display="block">
                        {pet.contactInfo.name}
                      </Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="medium"
                        href={`tel:${pet.contactInfo.phone}`}
                        sx={{ mt: 1 }}
                      >
                        {pet.contactInfo.phone}
                      </Button>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ padding: 2, pt: 0}}>
                    <Button
                      fullWidth
                      size="medium"
                      variant="contained"
                      color="success"
                      onClick={() => handleMarkAsFound(pet.id, pet.name)}
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

      {/* this is very much optional */}
      {foundPets.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Recently Found Pets ({foundPets.length})
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
                        label="Found with Crumb"
                        color="success"
                        size="medium"
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ width: '90%' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', backgroundColor: 'success.light' }} variant='outlined' icon={<PetsIcon />}>
          <Typography variant='h6'>{foundPetName} has been found! 🎉</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PetList;

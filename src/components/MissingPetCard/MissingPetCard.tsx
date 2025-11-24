import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CardActions,
  CardHeader,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import { MissingPet } from '../../types/Pet';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface MissingPetCardProps {
  pet: MissingPet;
  onMarkAsFound: (petId: string, petName: string) => void;
  onViewMap?: (petId: string) => void;
}

const MissingPetCard: React.FC<MissingPetCardProps> = ({ pet, onMarkAsFound, onViewMap }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setImageError(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
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
          {pet.photoUrl && (
            <Button
              fullWidth
              size="medium"
              variant="outlined"
              color="primary"
              startIcon={<VisibilityIcon />}
              onClick={handleOpenDialog}
            >
              View {pet.name}'s Photo
            </Button>
          )}
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
      <CardActions sx={{ padding: 2, pt: 0, display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Button
          fullWidth
          size="medium"
          variant="contained"
          color="success"
          onClick={() => onMarkAsFound(pet.id, pet.name)}
        >
          Mark as Found
        </Button>
      </CardActions>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{pet.name}</DialogTitle>
        <DialogContent>
          {pet.photoUrl && !imageError ? (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={pet.photoUrl}
                alt={pet.name}
                onError={() => setImageError(true)}
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Image not available
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MissingPetCard;

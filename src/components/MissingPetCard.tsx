import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CardActions,
  CardHeader,
} from '@mui/material';
import { MissingPet } from '../types/Pet';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';

interface MissingPetCardProps {
  pet: MissingPet;
  onMarkAsFound: (petId: string, petName: string) => void;
  onViewMap?: (petId: string) => void;
}

const MissingPetCard: React.FC<MissingPetCardProps> = ({ pet, onMarkAsFound, onViewMap }) => {
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
          onClick={() => onMarkAsFound(pet.id, pet.name)}
        >
          Mark as Found
        </Button>
      </CardActions>
    </Card>
  );
};

export default MissingPetCard;

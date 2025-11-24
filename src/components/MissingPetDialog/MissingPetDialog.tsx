import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { MissingPet } from '../../types/Pet';

interface MissingPetDialogProps {
  pet: MissingPet | null;
  open: boolean;
  onClose: () => void;
  onMarkAsFound: () => void;
}

const MissingPetDialog: React.FC<MissingPetDialogProps> = ({
  pet,
  open,
  onClose,
  onMarkAsFound,
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (pet) {
      setImageError(false);
    }
  }, [pet]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {pet && (
        <>
          <DialogTitle>
            {pet.name}
            <Chip
              label={pet.status}
              color={pet.status === 'missing' ? 'error' : 'success'}
              size="small"
              sx={{ ml: 1 }}
            />
          </DialogTitle>
          <DialogContent>
            {pet.photoUrl && !imageError && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img 
                  src={pet.photoUrl} 
                  alt={pet.name}
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
            {pet.photoUrl && imageError && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Image not available
                </Typography>
              </Box>
            )}
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body1" gutterBottom>
                  <strong>Type:</strong> {pet.species}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Breed:</strong> {pet.breed}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Colour:</strong> {pet.colour}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Last Seen:</strong> {new Date(pet.lastSeenDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Location:</strong> {pet.lastSeenLocation.address}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Notes:</strong> {pet.notes}
                </Typography>
                <Box mt={2}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Contact Information:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {pet.contactInfo.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {pet.contactInfo.phone}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={onClose}>Close</Button>
            {pet.status === 'missing' && (
              <Button onClick={onMarkAsFound} variant="contained" color="success">
                Mark as Found
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default MissingPetDialog;

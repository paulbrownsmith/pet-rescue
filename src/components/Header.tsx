import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: '#ffffff' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="https://static.crumb.pet/build/0.3.164/static/images/crumb-logo-black.png" 
            style={{ height: '30px' }} 
            alt="crumb logo black"
          />
        </Box>
        <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
          Missing Pet Tracker
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

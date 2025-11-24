import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { usePets } from './hooks/usePets';
import ReportPetForm from './components/ReportPetForm';
import MissingPetMap from './components/MissingPetMap';
import PetList from './components/PetList';
import './Footer.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fd5b2e',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fff1ed',
    },
    text: {
      primary: '#313131',
      secondary: '#313131',
    },
  },
  typography: {
    fontFamily: '"Afacad", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const { pets, addPet, markAsFound } = usePets();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleViewPetOnMap = (petId: string) => {
    setSelectedPetId(petId);
    setCurrentTab(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#fff1ed' }}>
        <AppBar position="static" sx={{ bgcolor: '#ffffff' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="https://static.crumb.pet/build/0.3.164/static/images/crumb-logo-black.png" style={{ height: '30px' }} alt="crumb logo black"></img>
            </Box>
            <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
              Missing Pet Tracker
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={2}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              centered
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Map View" />
              <Tab label="Report Pet" />
              <Tab label="All Reports" />
            </Tabs>

            <TabPanel value={currentTab} index={0}>
              <Box sx={{ height: '600px', width: '100%' }}>
                <MissingPetMap pets={pets} onMarkAsFound={markAsFound} selectedPetId={selectedPetId} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Click on markers to view pet details. {pets.filter(p => p.status === 'missing').length} missing pets currently displayed.
              </Typography>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <ReportPetForm onSubmit={addPet} />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <PetList pets={pets} onMarkAsFound={markAsFound} onViewMap={handleViewPetOnMap} />
            </TabPanel>
          </Paper>
        </Container>

        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: 'background.paper' }}>
          <div className="bottom-footer wrap">
            <div className="bottom-footer__left">
              <img src="https://static.crumb.pet/build/0.3.164/static/images/crumb-logo-black.png" alt="logo" height={'30px'} />
              <div>
                <a href="https://facebook.com/crumb.pet" target="_blank" rel="noreferrer">
                  <img src="https://static.crumb.pet/build/0.3.164/static/images/facebook-icon.webp" alt="facebook" />
                </a>
                <a href="https://www.instagram.com/crumb_pet" target="_blank" rel="noreferrer">
                  <img src="https://static.crumb.pet/build/0.3.164/static/images/instagram-icon.webp" alt="instagram" />
                </a>
                <a href="https://twitter.com/crumb_pet" target="_blank" rel="noreferrer">
                  <img src="https://static.crumb.pet/build/0.3.164/static/images/twitter-icon.webp" alt="twitter" />
                </a>
                <a href="https://tiktok.com/@crumbpet" target="_blank" rel="noreferrer">
                  <img src="https://static.crumb.pet/build/0.3.164/static/images/tiktok-icon.webp" alt="tiktok" />
                </a>
              </div>
            </div>
            <div className="bottom-footer__right">
              <div className="bottom-footer__right__item">
                <p>Products</p>
                <a href="/en/order">Tag</a>
                <a href="/en/vet">Crumb Vet</a>
              </div>
              <div className="bottom-footer__right__item">
                <p>Legal</p>
                <a href="/en/terms">Terms</a>
                <a href="/en/privacy">Privacy</a>
              </div>
              <div className="bottom-footer__right__item">
                <p>Help</p>
                <a href="https://help.crumb.pet">Help centre</a>
              </div>
            </div>
          </div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

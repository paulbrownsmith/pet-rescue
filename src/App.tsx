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
import PetsIcon from '@mui/icons-material/Pets';
import { usePets } from './hooks/usePets';
import ReportPetForm from './components/ReportPetForm';
import MissingPetMap from './components/MissingPetMap';
import PetList from './components/PetList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <PetsIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pet Rescue - Missing Pet Tracker
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
                <MissingPetMap pets={pets} onMarkAsFound={markAsFound} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Click on markers to view pet details. {pets.filter(p => p.status === 'missing').length} missing pets currently displayed.
              </Typography>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <ReportPetForm onSubmit={addPet} />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <PetList pets={pets} onMarkAsFound={markAsFound} />
            </TabPanel>
          </Paper>
        </Container>

        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Pet Rescue © 2025 - Help reunite lost pets with their families
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

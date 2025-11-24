import React, { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { usePets } from './hooks/usePets';
import ReportPetForm from './components/ReportPetForm/ReportPetForm';
import MissingPetMap from './components/MissingPetMap/MissingPetMap';
import PetList from './components/PetList/PetList';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import theme from './theme/theme';

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
  const [petTypeFilter, setPetTypeFilter] = useState<string>('all');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleFilterChange = (_event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setPetTypeFilter(newFilter);
    }
  };

  const filteredPets = petTypeFilter === 'all' 
    ? pets 
    : pets.filter(pet => pet.species.toLowerCase() === petTypeFilter);

  const handleViewPetOnMap = (petId: string) => {
    setSelectedPetId(petId);
    setCurrentTab(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#fff1ed' }}>
        <Header />

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={2}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
              <ToggleButtonGroup
                value={petTypeFilter}
                exclusive
                onChange={handleFilterChange}
                aria-label="pet type filter"
                size="small"
              >
                <ToggleButton value="all" aria-label="all pets" sx={{ px: 4 }}>
                  All Pets
                </ToggleButton>
                <ToggleButton value="dog" aria-label="dogs only" sx={{ px: 4 }}>
                  Dogs
                </ToggleButton>
                <ToggleButton value="cat" aria-label="cats only" sx={{ px: 4 }}>
                  Cats
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
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
                <MissingPetMap pets={filteredPets} onMarkAsFound={markAsFound} selectedPetId={selectedPetId} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Click on markers to view pet details. {filteredPets.filter(p => p.status === 'missing').length} missing pets currently displayed.
              </Typography>
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <ReportPetForm onSubmit={addPet} />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <PetList pets={filteredPets} onMarkAsFound={markAsFound} onViewMap={handleViewPetOnMap} />
            </TabPanel>
          </Paper>
        </Container>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;

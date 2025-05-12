import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Container, Box, Typography } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[600],
    },
    background: {
      default: grey[50],
    },
  },
});

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleHabitAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Streaks
          </Typography>
          <HabitForm onHabitAdded={handleHabitAdded} />
          <HabitList key={refreshKey} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

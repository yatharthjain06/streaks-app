import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Container, Box, Typography } from '@mui/material';
import { deepPurple, orange, red } from '@mui/material/colors';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[500],
      light: deepPurple[300],
      dark: deepPurple[700],
    },
    secondary: {
      main: orange[500],
      light: orange[300],
      dark: orange[700],
    },
    error: {
      main: red[500],
    },
    background: {
      default: deepPurple[50],
      paper: '#fff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
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
        <Box sx={{ 
          my: 4,
          '& > *': {
            mb: 3,
          }
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
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

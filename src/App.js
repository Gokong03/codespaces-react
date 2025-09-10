import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box, Paper, BottomNavigation, BottomNavigationAction, IconButton } from '@mui/material';
import { History, Assessment } from '@mui/icons-material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

// Import pages
import DigitalPage from './components/DigitalPage';
import PhysicalPage from './components/PhysicalPage';
import HistoryPage from './components/HistoryPage';
import RecapPage from './components/RecapPage';
import AdminPage from './components/AdminPage';

// Custom theme to match the screenshot
const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#81b2ff', // Blue for buttons and highlights
    },
    background: {
      default: '#1a1a2e', // Dark navy background
      paper: '#242444',   // Slightly lighter card background
    },
  },
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#242444',
        },
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#81b2ff', // Highlight color for selected icon
          },
        },
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
      }
    },
     MuiSelect: {
      defaultProps: {
        variant: 'filled',
      }
    }
  }
});

function App() {
  const [currentPage, setCurrentPage] = useState('Digital');

  const renderPage = () => {
    switch (currentPage) {
      case 'Fisik': return <PhysicalPage />;
      case 'Digital': return <DigitalPage />;
      case 'History': return <HistoryPage />;
      case 'Rekap': return <RecapPage />;
      case 'Admin': return <AdminPage />;
      default: return <DigitalPage />;
    }
  };

  // Map page names to their corresponding value for the BottomNavigation
  const pageToValue = {
    'Fisik': 0,
    'Digital': 1,
    'History': 2,
    'Rekap': 3,
  };
  const valueToPage = {
    0: 'Fisik',
    1: 'Digital',
    2: 'History',
    3: 'Rekap',
  };

  const handleNavChange = (event, newValue) => {
    setCurrentPage(valueToPage[newValue]);
  };

  const currentNavValue = pageToValue[currentPage] ?? 1;


  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: 'background.paper' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Kasir Multi Saldo
            </Typography>
            <Typography variant="caption" sx={{ mr: 2 }}>Offline • localStorage</Typography>
            <IconButton color="inherit" onClick={() => setCurrentPage('Admin')}>
              <AdminPanelSettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container component="main" sx={{ flexGrow: 1, py: 3, overflowY: 'auto' }}>
          {renderPage()}
        </Container>

        <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={currentNavValue}
            onChange={handleNavChange}
          >
            <BottomNavigationAction label="Fisik" icon={<StorefrontIcon />} />
            <BottomNavigationAction label="Digital" icon={<ReceiptLongIcon />} />
            <BottomNavigationAction label="History" icon={<History />} />
            <BottomNavigationAction label="Rekap" icon={<Assessment />} />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;

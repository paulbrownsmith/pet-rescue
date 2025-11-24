import { createTheme } from '@mui/material';

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

export default theme;

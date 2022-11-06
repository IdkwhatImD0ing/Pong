import * as React from 'react'
import * as MuiComponents from '../components/MuiComponents.js'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export function Lobby(props) {
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
          <MuiComponents.RoomAppBar/>
      </ThemeProvider>
    </div>
  );
}

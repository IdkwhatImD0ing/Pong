import * as React from 'react';
import * as MuiComponents from '../components/MuiComponents.js';
import {Box} from '@mui/material';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Stack} from '@mui/system';
import {UserContext} from '../App.js';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export function Landing() {
  return (
    <UserContext.Consumer>
      {({name}) => (
        <div>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <MuiComponents.PongAppBar />
            <Box height={'10vh'} />
            {name === 'Guest' ? (
              <MuiComponents.WelcomePrompt />
            ) : (
              <Stack direction="column" spacing={3}>
                <MuiComponents.JoinPrompt />

                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                  <div />
                  <MuiComponents.CardPlayLocal />
                  <MuiComponents.CardPlayOnline />
                  <div />
                </Box>
              </Stack>
            )}
          </ThemeProvider>
        </div>
      )}
    </UserContext.Consumer>
  );
}

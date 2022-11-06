import * as React from 'react'
import * as MuiComponents from '../components/MuiComponents.js'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Typography, Box, Button, Toolbar, Paper, Slider, Stack } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export function Lobby() {
  const paddleHeightMarks = [
    {value: 0, label: 'Min: 0'},
    {value: 80,label: 'Max: 80'}
  ]

  function valuetext(value) {
    return String(value);
  }
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
          <MuiComponents.RoomAppBar/>
          <Toolbar />
          <Stack direction='column'
           alignItems='center'
           spacing={3}>
            <Typography variant='h5'>
                Game Settings - Local Game
            </Typography>
            {/* paddle height
                diameter
                x ball speed
                and y ball speed */}
            <Box sx={{width: 300, height: 100}}>
                <Typography variant='h8'>
                    Paddle Height
                </Typography>
                <Slider
                    defaultValue={20}
                    getAriaValueText={valuetext}
                    step={10}
                    valueLabelDisplay="auto"
                    marks={paddleHeightMarks}
                />
            </Box>
            <Paper sx={{display: 'inline-block'}}>
                <Button>
                    Start Game
                </Button>
            </Paper>
          </Stack>
      </ThemeProvider>
    </div>
  );
}

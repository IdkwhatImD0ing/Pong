import * as React from 'react'
import PropTypes from 'prop-types';
import * as MuiComponents from '../components/MuiComponents.js'
import { Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Stack } from '@mui/system';

export const UserContext = React.createContext();
export const RoomContext = React.createContext();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export function Landing(props) {
  const [name, setName] = props.nameState;
  const [room, setRoom] = props.roomState;

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <UserContext.Provider value={{name, setName}}>
          <MuiComponents.PongAppBar />
          <Box height={'10vh'} />
          {name === null ? (<MuiComponents.WelcomePrompt/>) :
          (
            <Stack direction='column' spacing={3}>
              <RoomContext.Provider value={{room, setRoom}}>
                <MuiComponents.JoinPrompt />
              </RoomContext.Provider>

              <Box sx={{ display:'flex', justifyContent:'space-between'}}>
                <div/>
                    <MuiComponents.CardPlayLocal />
                    <MuiComponents.CardPlayOnline />
                <div/>
              </Box>
            </Stack>
          )}
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}

Landing.propTypes = {
    roomState: PropTypes.array,
    nameState: PropTypes.array,
}

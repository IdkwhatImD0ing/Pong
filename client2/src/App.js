import * as React from 'react'
import './App.css';
import * as MuiComponents from './components/MuiComponents.js'
import { Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Stack } from '@mui/system';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const UserContext = React.createContext();
const RoomContext = React.createContext();

function App() {
  const [name, setName] = React.useState(null);
  const [room, setRoom] = React.useState(null);
  return (
    <div className="App">
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

export {UserContext, RoomContext};
export default App;

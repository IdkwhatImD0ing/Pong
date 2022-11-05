import * as React from 'react'
import './App.css';
import * as MuiComponents from './MuiComponents.js'
import { Box } from '@mui/material'
// import { Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const UserContext = React.createContext();

function App() {
  const [name, setName] = React.useState(null);
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <UserContext.Provider value={{name, setName}}>
          <MuiComponents.PongAppBar />
        </UserContext.Provider>
        <Box height={'20vh'} />
        <Box sx={{ display:'flex', justifyContent:'space-between'}}>
        {name === null ? (<MuiComponents.WelcomePrompt/>) : (
          <div >
          <MuiComponents.CardPlayLocal />
          <MuiComponents.CardPlayOnline />
          </div>)
        }
        </Box>
      </ThemeProvider>
    </div>
  );
}

export {UserContext};
export default App;

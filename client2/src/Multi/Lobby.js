import React, {useEffect, useRef, useState, useContext} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useReadChannelState} from '@onehop/react';
import {useBeforeunload} from 'react-beforeunload';
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Paper,
  CssBaseline,
} from '@mui/material';
import {UserContext} from '../App.js';
import PongComponent from './Pong.js';
import {useNavigate} from 'react-router-dom';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import * as MuiComponents from '../components/MuiComponents.js';

const loadingUrl =
  'https://images.unsplash.com/photo-1591302418462-eb55463b49d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2502&q=80';

export default function Lobby() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const {name, userId} = useContext(UserContext);
  const playerId = userId;
  //console.log(params.get("channelId"));
  const channelId = params.get('channelId');
  const [gameNotFound, setGameNotFound] = useState(false);
  const navigate = useNavigate();

  const {state} = useReadChannelState(channelId);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  //Tells the server the player has left the channel
  useBeforeunload(() => {
    fetch('https://pongo.hop.sh/leaveChannel', {
      headers: {channelId: channelId},
      keepalive: true,
    }).then((res) => res.json());
  });

  useEffect(() => {
    if (name) {
      fetch('https://pongo.hop.sh/joingame', {
        headers: {name: name, id: playerId, channelId: channelId},
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          if (data.response < 0) {
            setGameNotFound(true);
          }
        });
    }
    window.addEventListener('keydown', keyInput);
    return () => {
      window.removeEventListener('keydown', keyInput);
    };
  }, []);

  function onclick() {
    fetch('https://pongo.hop.sh/ready', {
      headers: {name: name, id: playerId, channelId: channelId},
    }).then((res) => res.json());
  }

  let keyInput = (event) => {
    const {keyCode} = event;
    if (!stateRef) {
      return;
    }
    if (
      (stateRef.current.gameStarted &&
        !stateRef.current.gameEnded &&
        stateRef.current.playerOneId === playerId) ||
      stateRef.current.playerTwoId === playerId
    ) {
      fetch('https://pongo.hop.sh/keypress', {
        headers: {
          keyCode: keyCode,
          name: name,
          id: playerId,
          channelId: channelId,
        },
      });
    }
  };

  if (gameNotFound) {
    return (
      <>
        <Box
          component="section"
          sx={{
            display: 'flex',
            backgroundImage: `url(${loadingUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Stack direction="column" spacing={4} alignItems="center">
            <Typography variant="h3">Lobby not Found</Typography>
            <Button
              onClick={() => {
                navigate('/');
              }}
            >
              {' '}
              <Typography variant="h4" sx={{color: 'black'}}>
                Go Home
              </Typography>
            </Button>
          </Stack>
        </Box>
      </>
    );
  }
  if (loading) {
    return (
      <>
        <Box
          component="section"
          sx={{
            display: 'flex',
            backgroundImage: `url(${loadingUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Stack direction="column" spacing={4} alignItems="center">
            <Typography variant="h2">Loading...</Typography>
            <CircularProgress sx={{color: 'black'}} />
          </Stack>
        </Box>
      </>
    );
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  if (state && !state.gameStarted) {
    return (
      <>
        <Box>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <MuiComponents.RoomAppBar />
            <Stack
              direction="column"
              spacing={2}
              sx={{display: 'inline-block'}}
            >
              <Box /> {/* empty box for spacing*/}
              <Paper sx={{padding: 3}}>
                <Typography variant="h5">Room Code: {channelId}</Typography>
                <Button
                  onClick={() => {
                    console.log(channelId);
                    navigator.clipboard.writeText(channelId);
                  }}
                >
                  Copy Room Code
                </Button>
              </Paper>
              <Paper sx={{padding: 3}}>
                <Typography variant="h5">
                  You can also use the link to join:
                </Typography>
                <Button
                  onClick={() => {
                    console.log(window.location.href);
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Copy Link
                </Button>
              </Paper>
              <Paper sx={{padding: 3}}>
                <Stack direction="row" justifyContent="center" spacing={2}>
                  <Box>
                    <Typography variant="h2">{state.playerOneName}</Typography>
                    <Button
                      onClick={onclick}
                      sx={{
                        backgroundColor: state.playerOneReady ? 'green' : 'red',
                        '&:hover': {
                          backgroundColor: 'white',
                          color: 'black',
                        },
                      }}
                    >
                      Ready
                    </Button>
                  </Box>
                  {state.playerTwo && (
                    <Box>
                      <Typography variant="h2">
                        {state.playerTwoName}
                      </Typography>
                      <Button
                        onClick={onclick}
                        sx={{
                          backgroundColor: state.playerTwoReady
                            ? 'green'
                            : 'red',
                          '&:hover': {
                            backgroundColor: 'white',
                            color: 'black',
                          },
                        }}
                      >
                        Ready
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </ThemeProvider>
        </Box>
      </>
    );
  }

  if (state && state.gameStarted) {
    return (
      <Box height="100vh" width="100vw" sx={{bgcolor: '#5A5A5A'}}>
        <PongComponent channelId={channelId} />
      </Box>
    );
  }
}

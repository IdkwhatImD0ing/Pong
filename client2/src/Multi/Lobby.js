import React, {useEffect, useRef, useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSearchParams} from 'react-router-dom';
import {useReadChannelState} from '@onehop/react';
import {useBeforeunload} from 'react-beforeunload';
import {Box, Stack, Typography, Button, CircularProgress} from '@mui/material';
import {UserContext} from '../App.js';

const url =
  'https://images.unsplash.com/photo-1592035659284-3b39971c1107?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1726&q=80';
const loadingUrl =
  'https://images.unsplash.com/photo-1591302418462-eb55463b49d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2502&q=80';

export default function Lobby(props) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const {name, setName, userId, setUserId} = useContext(UserContext);
  const playerId = userId;
  //console.log(params.get("channelId"));
  const channelId = params.get('channelId');
  const [gameNotFound, setGameNotFound] = useState(false);

  const {state} = useReadChannelState(channelId);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  //Tells the server the player has left the channel
  useBeforeunload(() => {
    fetch('http://localhost:3001/leaveChannel', {
      headers: {channelId: channelId},
      keepalive: true,
    }).then((res) => res.json());
  });

  useEffect(() => {
    if (name) {
      fetch('http://localhost:3001/joingame', {
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
    fetch('http://localhost:3001/ready', {
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
      fetch('http://localhost:3001/keypress', {
        headers: {
          keyCode: keyCode,
          name: name,
          id: playerId,
          channelId: channelId,
        },
      }).then((res) => res.json());
    }
  };

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

  if (state && !state.gameStarted) {
    return (
      <>
        <Box
          component="section"
          sx={{
            backgroundImage: `url(${url})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            justifyItems="center"
            spacing={5}
            sx={{height: '20vh'}}
          >
            <Typography variant="h5" sx={{color: 'white'}}>
              Room Code: {channelId}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                console.log(channelId);
                navigator.clipboard.writeText(channelId);
              }}
              sx={{
                backgroundColor: 'black',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                },
              }}
            >
              Copy Room Code
            </Button>
            <Typography variant="h5" sx={{color: 'white'}}>
              You can also use the link to join:
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                console.log(window.location.href);
                navigator.clipboard.writeText(window.location.href);
              }}
              sx={{
                backgroundColor: 'black',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                },
              }}
            >
              Copy Link
            </Button>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            justifyItems="center"
            spacing={10}
            sx={{height: '20vh'}}
          >
            <Box
              padding="3%"
              sx={{
                marginTop: 0,
                display: 'flex',
                backdropFilter: 'blur(10px)',
                boxShadow: '0px 0px 10px #000000',
                backgroundColor: 'rgba(255, 255, 255, 0.275)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Stack
                drection="column"
                justifyContent="center"
                alignItems="center"
                spacing={3}
              >
                <Typography variant="h2">{state.playerOneName}</Typography>
                <Button
                  variant="contained"
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
              </Stack>
            </Box>
            {state.playerTwo && (
              <Box
                padding="3%"
                sx={{
                  marginTop: 0,
                  display: 'flex',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0px 0px 10px #000000',
                  backgroundColor: 'rgba(255, 255, 255, 0.275)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Stack
                  drection="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                >
                  <Typography variant="h2">{state.playerTwoName}</Typography>
                  <Button
                    variant="contained"
                    onClick={onclick}
                    sx={{
                      backgroundColor: state.playerTwoReady ? 'green' : 'red',
                      '&:hover': {
                        backgroundColor: 'white',
                        color: 'black',
                      },
                    }}
                  >
                    Ready
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </>
    );
  }
}

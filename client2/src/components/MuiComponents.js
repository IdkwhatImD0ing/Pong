import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
  Stack,
  Popper,
  Fade,
} from '@mui/material';
import JoinRightIcon from '@mui/icons-material/JoinRight';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {useNavigate} from 'react-router-dom';

import CheckIcon from '@mui/icons-material/Check';

import {UserContext} from '../App.js';

export function JoinPrompt() {
  const [temp, setTemp] = React.useState(null);

  const fieldChange = (e) => {
    e.preventDefault();
    setTemp(e.target.value);
  };
  const handleJoinSubmit = () => {
    // Navigate to room page
    console.log(temp);
  };

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Typography variant="h6">Trying to join a room?</Typography>
      <Stack direction={'row'}>
        <TextField
          label="Room code"
          variant="outlined"
          onChange={fieldChange}
        />
        <Button onClick={handleJoinSubmit}>
          Join
          <PlayArrowIcon />
        </Button>
      </Stack>
    </Stack>
  );
}

export function WelcomePrompt() {
  const [temp, setTemp] = React.useState(null);

  const fieldChange = (e) => {
    e.preventDefault();
    setTemp(e.target.value);
  };

  return (
    <UserContext.Consumer>
      {({setName}) => (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h4"> Welcome to Pong! </Typography>
          <Stack direction={'row'}>
            <TextField
              label="Enter username"
              variant="outlined"
              onChange={fieldChange}
            />
            <Button
              onClick={() => {
                setName(temp);
              }}
            >
              Done
              <CheckIcon />
            </Button>
          </Stack>
        </Stack>
      )}
    </UserContext.Consumer>
  );
}

export function CardPlayLocal() {
  const navigate = useNavigate();
  return (
    <Card sx={{maxWidth: 345}}>
      <CardMedia
        component="img"
        height="140"
        image="https://cf.geekdo-images.com/6AbhHmK41mA6tZ1hehRsIg__imagepage/img/Ke69bpiKsSNgoz8hoO9ui96bvJY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5050643.jpg"
        alt="playing together"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Play Local
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Play with a buddy next to you!
        </Typography>
      </CardContent>
      <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
        <Button
          size="small"
          onClick={() => {
            navigate('/game');
          }}
        >
          Create Game
        </Button>
      </CardActions>
    </Card>
  );
}

export function CardPlayOnline() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const createGame = () => {
    setLoading(true);
    fetch('http://localhost:3001/createGame')
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        navigate(`/multi?channelId=${data.channelId}`);
      });
  };
  return (
    <Card sx={{maxWidth: 345}}>
      <CardMedia
        component="img"
        height="140"
        image="https://media.istockphoto.com/id/1332002332/photo/global-communication-network.jpg?s=612x612&w=0&k=20&c=peu8U_wCmrnpQDfPHdZL7UGCY3oapnSBPvKi9kVCh7w="
        alt="playing with people online"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Play Online
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Play with a friend online!
        </Typography>
      </CardContent>
      <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
        <Button
          size="small"
          onClick={() => {
            createGame();
          }}
        >
          Create Game
        </Button>
      </CardActions>
    </Card>
  );
}

export function PongAppBar() {
  const [open, setOpen] = React.useState(false);
  const [temp, setTemp] = React.useState(null);

  const divRef = React.useRef();

  const toggleOpen = () => {
    setOpen(open ? false : true);
  };
  const fieldChange = (e) => {
    e.preventDefault();
    setTemp(e.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  React.useEffect(() => {
    setAnchorEl(divRef.current);
  }, [divRef]);

  return (
    <UserContext.Consumer>
      {({name, setName}) => (
        <Box sx={{flexGrow: 1}}>
          <AppBar position="static">
            <Toolbar sx={{justifyContent: 'space-between'}}>
              <Typography variant="h4" component="div">
                Pong
                <JoinRightIcon />
              </Typography>
              <div />
              <Button
                color="inherit"
                ref={divRef}
                onClick={toggleOpen}
                sx={{textTransform: 'none'}}
              >
                <Typography variant="h6" component="div">
                  {name}
                </Typography>
              </Button>
              {/* Popper here to change name */}
              <Popper
                placement="bottom"
                anchorEl={anchorEl}
                open={open}
                transition
              >
                {({TransitionProps}) => (
                  <Fade {...TransitionProps}>
                    <Box sx={{bgcolor: 'background.paper'}}>
                      <Stack direction={'row'}>
                        <TextField
                          label="Change username"
                          variant="outlined"
                          onChange={fieldChange}
                        />
                        <Button
                          onClick={() => {
                            if (temp) {
                              setName(temp);
                            }
                            toggleOpen();
                          }}
                        >
                          Done
                          <CheckIcon />
                        </Button>
                      </Stack>
                    </Box>
                  </Fade>
                )}
              </Popper>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </UserContext.Consumer>
  );
}

export function RoomAppBar() {
  return (
    <UserContext.Consumer>
      {({name}) => (
        <Box sx={{flexGrow: 1}}>
          <AppBar position="static">
            <Toolbar sx={{justifyContent: 'space-between'}}>
              <Typography variant="h4" component="div">
                Pong
                <JoinRightIcon />
              </Typography>
              <div />
              <Typography variant="h6" component="div">
                {name}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </UserContext.Consumer>
  );
}

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import JoinRightIcon from '@mui/icons-material/JoinRight';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';

import { UserContext } from '../App.js';

function WelcomePrompt() {
  const [temp, setTemp] = React.useState(null);
  
  const fieldChange = (e) => {
    e.preventDefault();
    setTemp(e.target.value);
  }

  return (
    <UserContext.Consumer>
      {({setName}) => (
        <Stack 
        direction='column'
        justifyContent='center' 
        alignItems='center'
        spacing={2}>
          <Typography variant='h4'> Welcome to Pong! </Typography>
          <Stack direction={'row'}>
            <TextField label="Enter username" variant="outlined"
            onChange={fieldChange}/>
            <Button onClick={() => {setName(temp)}}>
              Done
              <CheckIcon />
            </Button>
          </Stack>
        </Stack>
      )}
    </UserContext.Consumer>
  );
}

function CardPlayLocal() {
  return (
    <Card sx={{ maxWidth: 345}}>
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
        <Button size="small">Create Game</Button>
      </CardActions>
    </Card>
  );
}

function CardPlayOnline() {
  return (
    <Card sx={{ maxWidth: 345}}>
      <CardMedia
        component="img"
        height="140"
        image='https://media.istockphoto.com/id/1332002332/photo/global-communication-network.jpg?s=612x612&w=0&k=20&c=peu8U_wCmrnpQDfPHdZL7UGCY3oapnSBPvKi9kVCh7w='
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
        <Button size="small">Create Game</Button>
        <Button size="small">Join Game</Button>
      </CardActions>
    </Card>
  );
}

function PongAppBar() {
  const [open, setOpen] = React.useState(false);
  const [temp, setTemp] = React.useState(null);

  const divRef = React.useRef();

  const toggleOpen = () => {
    setOpen(open ? false : true);
  }
  const fieldChange = (e) => {
    e.preventDefault();
    setTemp(e.target.value);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  React.useEffect(() => {
    setAnchorEl(divRef.current);
  }, [divRef]);

  return (
    <UserContext.Consumer>
      {({name, setName}) => (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" >
          <Toolbar sx={{justifyContent: 'space-between'}}>
            <Typography variant="h4" component="div">
              Pong 
              <JoinRightIcon />
            </Typography>
            <div />
            <Button color="inherit" ref={divRef}
            onClick={toggleOpen}
            sx={{textTransform: 'none'}}>
              <Typography variant="h6" component="div">
                {name}
              </Typography>
            </Button>
            {/* Popper here to change name */}
            <Popper placement='bottom' anchorEl={anchorEl} open={open} transition>
              {({ TransitionProps }) => (
                <Fade {...TransitionProps}>
                  <Box sx={{bgcolor: 'background.paper'}}>
                    <Stack direction={'row'}>
                      <TextField label="Change username" variant="outlined"
                      onChange={fieldChange}/>
                      <Button onClick={() => {
                          if (temp) {
                            setName(temp);
                          }
                          toggleOpen();
                        }
                      }>
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

export {PongAppBar, CardPlayLocal, CardPlayOnline, WelcomePrompt};
var express = require('express');
var router = express();

require('dotenv').config();
const {Hop, ChannelType} = require('@onehop/js');
const cors = require('cors');
const getInitialState = require('../games/init');

const {Pong} = require('../games/pong');

const PORT = 3001;
const hop = new Hop(process.env.REACT_APP_HOP_PROJECT_ENV);

const ESC = 27;
const SPACEBAR = 32;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const W_KEY = 87;
const S_KEY = 83;

const GAMES = new Map();

const createChannelId = () => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

router.use(cors());
router.get('/api', (req, res) => {
  res.json({
    message: 'Hello from Pong Backend created in ExpressJS!',
  });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'ExpressJs Server for Pong'});
});

router.get('/id', async (req, res) => {
  const {id} = await hop.channels.tokens.create();
  res.json({message: 'Successfully Generated ID!', id: id});
});

router.get('/leaveChannel', async (req, res) => {
  const channelId = req.get('channelId');
  if (!channelId || !GAMES.get(channelId)) {
    res.json({message: 'Channel ID not provided!'});
    return;
  }
  const stats = await hop.channels.getStats(channelId);
  if (stats.online_count === 0) {
    const room = await hop.channels.delete(channelId);
    console.log('Deleted channel');
    GAMES.delete(channelId);
    res.json({message: 'Successfully Deleted Channel'});
    return;
  }
  res.json({message: 'Did not delete channel'});
});

router.get('/createGame', async (req, res) => {
  const channelId = createChannelId();
  const channel = await hop.channels.create(
    ChannelType.UNPROTECTED,
    `${channelId}`,
    // Creation Options
    {
      // Initial Channel state object
      state: getInitialState(),
    },
  );

  const g = new Pong(channelId, getInitialState());
  GAMES.set(channelId, g);
  res.json({message: 'Successfully Generated Lobby!', channelId: channelId});
});

router.get('/joingame', (req, res) => {
  const name = req.get('name');
  const id = req.get('id');
  const channelId = req.get('channelId');
  const game = GAMES.get(channelId);
  if (!game) {
    res.json({message: 'Game not found!', response: -1});
    return;
  }
  if (
    game.state.gameStarted &&
    game.state.playerOneId !== name &&
    game.state.playerTwoId !== name
  ) {
    res.json({message: 'You are spectator!', response: 1});
    return;
  }
  if (game) {
    game.joinGame(name, id);
  }
  res.json({message: 'Successfully Joined Game!', response: 1});
});

router.get('/ready', (req, res) => {
  const id = req.get('id');
  const channelId = req.get('channelId');
  const game = GAMES.get(channelId);
  if (
    (game.state.playerOneId !== id && game.state.playerTwoId !== id) ||
    game.state.gameStarted ||
    game.state.gameEnded
  ) {
    res.json({message: 'Not allowed!!', channelId: channelId});
    return;
  }
  if (game) {
    game.ready(id);
  }
  res.json({message: 'Successfully Ready!', channelId: channelId});
});

router.get('/keypress', (req, res) => {
  const keyCode = req.get('keyCode');
  const id = req.get('id');
  const name = req.get('name');
  const channelId = req.get('channelId');
  const game = GAMES.get(channelId);
  if (
    (game.state.playerOneId !== id && game.state.playerTwoId !== id) ||
    !game.state.gameStarted ||
    game.state.gameEnded
  ) {
    res.json({message: 'Not Allowed!', channelId: channelId});
    return;
  }
  if (game) {
    game.keyPressed(keyCode, id);
  }
  res.json({message: 'Successfully Pressed Key!', channelId: channelId});
});

router.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.error(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});

module.exports = router;

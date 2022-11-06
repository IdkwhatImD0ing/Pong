var express = require('express');
var router = express();

require('dotenv').config();
const {Hop, ChannelType} = require('@onehop/js');
const cors = require('cors');
const {default: getInitialState} = require('../games/init');
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

GAMES = new Map();

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

app.get('/id', async (req, res) => {
  const {id} = await hop.channels.tokens.create();
  res.json({message: 'Successfully Generated ID!', id: id});
});

app.get('/leaveChannel', async (req, res) => {
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

app.get('/createCoopChannel', async (req, res) => {
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

  res.json({message: 'Successfully Generated Lobby!', channelId: channelId});
});

app.get('/joingame', (req, res) => {
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

app.get('/ready', (req, res) => {
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

app.get('/keypress', (req, res) => {
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
    game.keyPressed(keyCode);
  }
  res.json({message: 'Successfully Pressed Key!', channelId: channelId});
});

router.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = router;

var express = require('express');
var router = express();

require('dotenv').config();
const {Hop, ChannelType} = require('@onehop/js');
const cors = require('cors');
const PORT = 3001;
const hop = new Hop(process.env.REACT_APP_HOP_PROJECT_ENV);

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
      state: 
    },
  );

  res.json({message: 'Successfully Generated Lobby!', channelId: channelId});
});

router.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = router;

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
  res.render('index', {title: 'Express'});
});

router.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = router;

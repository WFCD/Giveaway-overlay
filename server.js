const express = require('express');
const bodyParser = require('body-parser')
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

const secret = process.env.SECRET;

if (!secret) {
  console.error('You really really need to provide a secret.');
  process.exit(1);
}

const settings = {
  channel: process.env.CHANNEL,
  oauth: {
    user: process.env.OAUTH_USER,
    pass: process.env.OAUTH_SECRET,
  },
  defaultUsers: process.env.VIEWERS
    ? process.env.VIEWERS.split(',').map(n => n.toLowerCase())
    : [],
  allowedCallers: process.env.CALLERS
    ? process.env.CALLERS.split(',').map(n => n.toLowerCase())
    : [],
  keyword: process.env.KEYWORD,
  noMods: process.env.RESTRICT_FROM_MODS === 'true',
  trigger: process.env.TRIGGER || '!gstart',
  announce: {
    onjoin: process.env.ANNOUNCE_ON_JOIN === 'true',
    rolls: process.env.ANNOUNCE_ROLLS === 'true',
    winner: process.env.ANNOUNCE_WINNER === 'true',
  },
  styles: {
    icon: process.env.ICON_URL || 'icon.png',
  }
};

const host = process.env.host || process.env.HOST || '127.0.0.1';
const port = process.env.port || process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/static', express.static('static'));

app.get('/settings', (req, res) => {
  if (req.query.secret && req.query.secret === secret) {
    res.status(200).json(settings);
  } else {
    res.status(401).json('Unauthorized');
  }
  
});

app.post('/data', (req,res) => {
  if (!req.body) {
    console.log(req.body);
    fs.writeFile('data.json', JSON.stringify(req.body));
    console.log("File written");
    res.status(200).json('File written');
  } else {
    res.status(400).json('Bad Request');
  }
});

app.listen(port, host);
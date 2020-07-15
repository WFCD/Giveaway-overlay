# Giveaway-overlay
Giveaway overlay used on RSB Streams

[![Created by Monskiller](https://raw.githubusercontent.com/Monskiller/banner/master/banner.png)](https://github.com/Monskiller "Created by Monskiller")

Simple Webscript overlay we used on our first giveaway event and might use it again in the future.
Node.js is needed.

## Setting up Node.js
- [Download](https://nodejs.org/dist/v12.18.2/node-v12.18.2-x64.msi) and install Node.js
- Open command prompt window inside the project directory with `Shift + Right Click`
- Run the following command `npm i`

## Setting up the overlay
- Create a .env file in the root, it should have a structure like...
```
CHANNEL=YourTwitchChannel
OAUTH_USER=yourTwitchUsername
OAUTH_SECRET=###OUAHTSECRET###
VIEWERS=
KEYWORD=plat
RESTRICT_FROM_MODS=true
CALLERS=yourTwitchUsername
TRIGGER=!gstart
ANNOUNCE_ON_JOIN=false
ANNOUNCE_ROLLS=false
ANNOUNCE_WINNER=false
ICON_URL=https://path.to.your.logo.ml
SECRET=reallyreallyreallySECUREPIECEofLoTsOFTEXt!!one!1!!
```
- Change `OAUTH_USER` to your Twitch username, `OAUTH_SECRET` to your oath2 key which you can get [here](https://twitchapps.com/tmi/) and `CHANNEL` to your own Twitch channel.
- Change `SECRET` to something you choose.

## Adding rewards
- Edit the JSON file `data.json` and add your rewards in `prizes:[]` just as a regular JavaScript array

## Using it
- Open command window in the project directory
- Run the overlay server with `node server.js`
- Run OBS and add a new Browser Source, linking `http://localhost:3000/static/index.html?secret=SECRET` (SECRET will be whatever you put in further up)
- When you want to roll it: 
  - Right click the source, select Interact then press your spacebar
  - Or use the configured `TRIGGER` phrase. This is configurable.


## Contact
You can find me on Discord `Monskiller#8879`.

Tobiah#0001 did a bunch of changes to make it more modular without touching code.
Feel free to reach out to me too.


## Developing
- Do all of the main setup steps
- Run `npm run dev` in your terminal to start a dev session with automated restarts.

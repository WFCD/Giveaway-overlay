# Giveaway-overlay
Giveaway overlay used on RSB Streams

[![Created by Monskiller](https://raw.githubusercontent.com/Monskiller/banner/master/banner.png)](https://github.com/Monskiller "Created by Monskiller")

Simple Webscript overlay we used on our first giveaway event and might use it again in the future.
Node.js is needed.

## Setting up Node.js
- [Download](https://nodejs.org/dist/v6.9.2/node-v6.9.2-x64.msi) and install Node.js
- Open command prompt window inside the project directory with `Shift + Right Click`
- Run the following command `npm install`

## Setting up the overlay
- Open `main.js` and look for the first block
```
var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
    },
    identity: {
        username: "yourTwitchUsername",
        password: "oath2"
    },
    channels: ["#twitchChannel"]
};
```
- Change `username:` to your Twitch username, `password:` to your oath2 key which you can get [here](https://twitchapps.com/tmi/) and `channels:` to your own Twitch channel.

## Adding rewards
- Edit the JSON file `data.json` and add your rewards in `prizes:[]` just as a regular JavaScript array

## Using it
- Open command window in the project directory
- Run the overlay server with `node server.js`
- Run OBS and add a new Browser Source, linking `http://localhost:8080/`
- When you want to roll it: Right click the source, select Interact then press your spacebar


## Contact
You can find me on Discord `Monskiller#8879` 

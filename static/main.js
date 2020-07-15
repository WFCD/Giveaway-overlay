/* globals $, window */

const secret = (new URLSearchParams(window.location.search)).get('secret');

let settings;

const viewerList = [];
let keyword;

const initializeTwitch = async () => {
  if (!settings.oauth) return;

  const options = {
      options: {
          debug: true
      },
      connection: {
          reconnect: true,
      },
      identity: {
          username: settings.oauth.user,
          password: `oauth:${settings.oauth.pass}`,
      },
      channels: [`#${settings.channel}`],
  };
  
  viewerList.push(...settings.defaultUsers);
  keyword = settings.keyword || 'plat';
  
  const client = new tmi.client(options);
  
  client.on("chat", (channel, user, message, self) => {
    console.log(`received "${message}" from ${JSON.stringify(user)}`)
    if (settings.allowedCallers.includes(user.username.toLowerCase()) && message === settings.trigger) {
      giveawayRoulete();
    }
    
    if (user.mod && settings.noMods) {
      return;
    }
    
    if ((settings.keyword && message.toLowerCase() === settings.keyword) || !settings.keyword) {
      viewerList.push(user.username.toLowerCase());
    }
  });
  
  await client.connect();
  
  if (settings.announce.onJoin && settings.keyword) {
    client.action(`#${settings.channel}`, `Giveaway roll starts soon! Be sure to type >> ${settings.keyword} << in the chat!`);
  }
}

const initializeStyles = () => {
  if (!settings.styles) return;
  $('.icon').css('background-image', `url('${settings.styles.icon}')`);
}

const init = async () => {
  settings = await fetch(`${window.location.origin}/settings?secret=${encodeURIComponent(secret)}`).then(b => b.json());
  await initializeTwitch();
  initializeStyles();
}

function removeA(prizes, prize) {
  let index;
  prizes.forEach((p, i) => {
    if (p.toLowerCase() === prize.toLowerCase()) { 
      index = i;
    }
  });
  prizes.splice(index, 1);
  return prizes;
}

function hideAway() {
  setTimeout(function () {
    $(document.body).css('color', 'rgba(167,12,12,0)');
    $('#viewers').css("text-shadow", "0 0 rgba(0,0,0,0)").attr('data-content',"");
    $('#prize').css("text-shadow", "0 0 rgba(0,0,0,0)").attr('data-content',"")
    .delay(500)
    .queue(function (next) {
      $(".winnerBox").css('width', '0px');
      $(".prizeBox").css('width', '0px');
      next();
    })
    .delay(200)
    .queue(function (next) {
      $(".box").css('width', '0px');
      next();
    })
    .delay(1000)
    .queue(function (next) {
      $(".icon").css("transform", "scale(0.0)")
      //window.setTimeout('location.reload()', 3000);
      next();
    });
  }, 10000)
}

function giveawayRoulete() {
  if (!viewerList.length) {
    console.error('no viewers');
    return;
  }
  var iW = 0,
    iP = 0,
    winner = "",
    prize = "";
  prizeData = new Array();
  prizeList = new Array();
  prizeArray = new Array();

  if (settings.announce.rolls) {
    client.action(`#${settings.channel}`, "Rolling now...");
  }
  fetch(new Request('data.json'))
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      prizeData = data;
      console.log(`prizes: ${JSON.stringify(data)}`);
      prizeList = prizeData['prizes'].slice(0);
      console.log(prizeList)
      if(parseInt(prizeList[0]) >= 1000){
        prizeList[0] = "1000 Platinum";
      } else {
        // prizeList.splice(0,1);
      }
      scaleThings();
    });

  const scaleThings = () => {
    console.log('scaling');
    $(".icon").css("transform", "scale(1.0)")
      .delay(500)
      .queue(function (next) {
        $(".box").css('width', '500px');
        next();
      })
      .delay(200)
      .queue(function (next) {
        $(".winnerBox").css('width', '480px');
        next();
      })
      .delay(100)
      .queue(function (next) {
        $(".prizeBox").css('width', '480px');
        next();
      })
      .delay(600)
      .queue(function (next) {
        $(document.body).css('color', 'rgba(167,12,12,1)');
        next();
        pickWinner();
      });
  };

  function pickWinner(){
    var rollWinners = $(viewerList).not(prizeData['past_winners']).get();
    setTimeout(function () {
      randomNumber = Math.round( Math.random() * ( rollWinners.length - 1 ) );
      winner = rollWinners[randomNumber];
      $('#viewers').text(winner).attr('data-content',winner);
      iW++;
      if (iW < 50) {
        pickWinner();
      } else {
        $('#viewers').css("text-shadow", "0 0 16px rgba(167,12,12, 1)");
        iW = 0;
        pickPrize();
      }
    }, 50 + Math.pow(600, iW/50))
  }
  function pickPrize() {
    setTimeout(function () {
      randomNumber = Math.round( Math.random() * ( prizeList.length - 1 ) );
      prize = prizeList[randomNumber];

      $('#prize').text(prize).attr('data-content',prize);
      iP++;
      if (iP < 50) {
        pickPrize();
      }
      else
      {
        $('#prize').css("text-shadow", "0 0 16px rgba(167,12,12, 1)");
        if(prize == "1000 Platinum"){
          prizeData['prizes'][0] = (parseInt(prizeData['prizes'][0]) - 1000).toString();
        }
        removeA(prizeData['prizes'], prize);
        prizeData['past_winners'].push(winner);
        $.ajax({
          url: `${window.location.origin}/data`,
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(prizeData)
        })
        if(settings.announce.winner) client.action(`#${settings.channel}`, `Congratulations to @${winner}! They have won: ${prize}!`);
        hideAway();
      }
    }, 50 + Math.pow(600, iP/50))
  }
}

function onDocumentReady () {
  init();
  $(window).keypress((e) => {
    if (e.keyCode === 0 || e.keyCode === 32) {
      e.preventDefault()
      giveawayRoulete();
    }
  });
}

$(document).ready(onDocumentReady);

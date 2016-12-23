var viewerList = [],
	keyword = "keyword";

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

var client = new tmi.client(options);

client.on("chat", function (channel, user, message, self) {
    if ( message.toLowerCase() == keyword && !user.mod )
	{	
		if ( $.inArray( user.username, viewerList ) <= -1 ){
			viewerList.push(user.username);
		}
		else return;
	}
	else return;
});

client.connect().then(function() {
    //client.action("#warframersb", "Giveaway roll starts soon! Be sure to type >> rsbgiveaway << in the chat!");
});

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function hideAway() {
	setTimeout(function () {
		$(document.body).css('color', 'rgba(255, 176, 25, 0)');
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
	var iW = 0,
		iP = 0,
		winner = "",
		prize = "";
	prizeData = new Array();
	prizeList = new Array();
	prizeArray = new Array();
	
	//client.action("#warframersb", "Rolling now...");
	
	$.ajax({
		type: 'GET',
		url: "data.json",
		dataType: "json",
		success: function( response ) {
			prizeData = response;
			prizeList = prizeData['prizes'].slice(0);
			if(parseInt(prizeList[0]) >= 1000){
				prizeList[0] = "1000 Platinum";
			}else{
				prizeList.splice(0,1);
			}
		}
	});
	
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
			$(document.body).css('color', 'rgba(255, 176, 25, 1)'); 
			next(); 
			pickWinner();
		});
	
	function pickWinner(){
		var rollWinners = $(viewerList).not(prizeData['past_winners']).get();
		setTimeout(function () {
			randomNumber = Math.round( Math.random() * ( rollWinners.length - 1 ) );
			winner = rollWinners[randomNumber];
			$('#viewers').text(winner).attr('data-content',winner);
			iW++;
			if (iW < 50) {
				pickWinner();
			}else
			{
				//$('#click').get(0).play();
				$('#viewers').css("text-shadow", "0 0 16px rgba(255, 176, 25, 1)");
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
				//$('#click').get(0).play();
				$('#prize').css("text-shadow", "0 0 16px rgba(255, 176, 25, 1)");
				if(prize == "1000 Platinum"){
					prizeData['prizes'][0] = (parseInt(prizeData['prizes'][0]) - 1000).toString();
				}
				removeA(prizeData['prizes'], prize);
				prizeData['past_winners'].push(winner);
				$.ajax({
					url: 'http://localhost/data', 
					type: 'POST', 
					contentType: 'application/json', 
					data: JSON.stringify(prizeData)
				})
					client.action("#warframersb", "Congratulations to @" + winner + " They have won: " + prize + "!");
					hideAway();
			}
		}, 50 + Math.pow(600, iP/50))
	}
}

function onDocumentReady () {
  $(window).keypress(function (e) {
  if (e.keyCode === 0 || e.keyCode === 32) {
    e.preventDefault()
    giveawayRoulete();
  }
})
}

$(document).ready(function(){onDocumentReady();});

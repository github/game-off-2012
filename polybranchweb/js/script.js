var firstPlaythrough = true;
var playing = false;

var bells = new Array();
var bellsIndex = randomXToY(0,4);
var endSound = ((new Audio()).canPlayType("audio/ogg; codecs=vorbis") != "") ? new Audio("sound/end.ogg") : new Audio("sound/end.mp3");

for(var i = 0; i < 10; i++){
	var index = (i < 5) ? i : i - 5;
    if((new Audio()).canPlayType("audio/ogg; codecs=vorbis") != ""){
        bells[i] = new Audio("sound/_bell"+index+".ogg");
    }else{
        bells[i] = new Audio("sound/_bell"+index+".mp3");
    }
}


$(document).ready(function(){
	$("#main-menu #start").click(function(){
		if(!playing){
			jsStartGame(false);
			playing = true;
		}
	});

	$("#gameover-menu #retry").click(function(){
		if(!playing){
			jsNewGame();
			playing = true;
		}
	});

	$(document).bind("keydown",function(){
		if($("#arrowkeys:visible").length > 0){
			$("#arrowkeys").fadeOut(300);
		}
	});
});



// function start(){
// 	if(pjs!=null) {
//     	pjs.pause();
//     }
// }
function processingIsReady(){
	$("#loading").fadeOut(300);
}

function jsStartGame(fromProcessing){
	if(!fromProcessing){
		pjs.pause();
	}
	$("#main-menu .content").fadeOut(300,function(){
		if(firstPlaythrough){
			firstPlaythrough = false;
			$("#arrowkeys").fadeIn(300);
		}
		$("#hud").fadeIn(300);
		$("#main-menu").fadeOut(300,function(){
			
		});
	});
}

function jsNewGame(){
	pjs.newGame();
	$("#hud #score").html("0");
	$("#hud #level span").html("1");
	$("#gameover-menu .content").animate({"opacity":"0"},300,function(){
		$("#gameover-menu .content").hide();
		$("#gameover-menu").animate({"opacity":"0"},300,function(){
			$("#gameover-menu").hide();
			$("#hud").fadeIn(300);
			pjs.pause();
		});
	});
}

function jsTriggerBell(){
	var newIndex = randomXToY(0,4);
	if(newIndex == bellsIndex){
		jsTriggerBell();
	}else{
		bellsIndex = newIndex;
		if(bells[bellsIndex].paused){
			bells[bellsIndex].currentTime=0;
		    bells[bellsIndex].play();
		}else{
			bells[bellsIndex+5].currentTime=0;
		    bells[bellsIndex+5].play();
		}
	}
}

function jsUpdateScore(score){
	$("#hud #score").html(addCommas(score));
}

function jsIncrementLevel(){
	$("#hud #level span").html((parseInt($("#hud #level span").html())+1));
}

function jsGameOver(score){
	playing = false;
	$("#flash").show();
	endSound.currentTime=0;
	endSound.play();
	$("#hud").hide();
	$("#flash").delay(1000).animate({"opacity":0}, 1000,function(){
		$(this).hide();
		$(this).css("opacity","1");
		$("#gameover-menu #score").html(addCommas(score)+"<span id='L'>L"+$("#hud #level span").html()+"</span>");
		if(localStorage["highScore"] == undefined || score > parseInt(localStorage["highScore"])){
			$("#gameover-menu #highscore").html("NEW RECORD!");
			localStorage["highScore"] = score;
			localStorage["highLevel"] = $("#hud #level span").html();
		}else{
			$("#gameover-menu #highscore").html("PERSONAL BEST: "+addCommas(parseInt(localStorage["highScore"]))+"<span id='L'>L"+localStorage["highLevel"]+"</span>");
		}
		$("#gameover-menu #nextlevel span").html(addCommas((pjs.getNextScore(parseInt($("#hud #level span").html())))+1000));
		$("#gameover-menu").show();
		$("#gameover-menu").animate({"opacity":"1"},300,function(){
			$("#gameover-menu .content").show();
			$("#gameover-menu .content").animate({"opacity":"1"},300);
		});
	});
}

//function to get random number upto m
function randomXToY(minVal,maxVal,floatVal)
{
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
var firstPlaythrough = true;

$(document).ready(function(){
	$("#main-menu #start").click(function(){
		jsStartGame(false);
	});

	$("#gameover-menu #retry").click(function(){
		jsNewGame();
	});

	$(document).bind("keydown",function(){
		if($("#arrowkeys:visible").length > 0){
			$("#arrowkeys").fadeOut(300);
		}
	});
});



function start(){
	if(pjs!=null) {
    	pjs.pause();
    }
}
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
	$("#gameover-menu .content").fadeOut(300,function(){
		$("#hud").fadeIn(300);
		$("#gameover-menu").fadeOut(300,function(){
			pjs.pause();
		});
	});
}

function jsUpdateScore(score){
	$("#hud #score").html(addCommas(score));
}

function jsIncrementLevel(){
	$("#hud #level span").html((parseInt($("#hud #level span").html())+1));
}

function jsGameOver(score){
	$("#flash").show();
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
		$("#gameover-menu").fadeIn(300,function(){
			$("#gameover-menu .content").fadeIn(300);
		});
	});
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
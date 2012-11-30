$(document).ready(function(){
	$("#main-menu #start").click(function(){
		$("#main-menu .content").fadeOut(300,function(){
			$("#main-menu").fadeOut(300,function(){
				pjs.pause();
			});
		});
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

function jsGameOver(){
	$("#flash").show();
	$("#flash").delay(500).animate({"opacity":0}, 1000,function(){
		$(this).hide();
		$(this).css("opacity","1");
	});
}
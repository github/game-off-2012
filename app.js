window.game = {};
game.events = _.clone(Backbone.Events);
var activeView;

game.events.on("start", function() {
  console.log('insert song select view');
  var song = new SongView({
    model: songs.first()
  });
  $('.container').html(song.el);
});

game.events.on("howto", function() {
  activeView.destroy();
  var howto = new HowtoView();
  activeView = howto;
  $('.container').html(howto.el);
});

game.events.on("highscores", function() {
  activeView.destroy();
  var highscore = new HighScoreView();
  activeView = highscore;
  $('.container').html(highscore.el);
});

game.events.on("credits", function() {
  activeView.destroy();
  var credits = new CreditsView();
  activeView = credits;
  $('.container').html(credits.el);
});

game.events.on("menu", function() {
  if(activeView) {
    activeView.destroy();
  }
  var menu = new MenuView();
  activeView = menu;
  $('.container').html(menu.el);
});

game.events.trigger('menu');

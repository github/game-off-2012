window.game = {};
game.events = _.clone(Backbone.Events);

game.events.on("start", function() {
  console.log('insert song select view');
  var song = new SongView({
    model: songs.first()
  });
  $('.container').html(song.el);
});

game.events.on("howto", function() {
  game.activeView.destroy();
  var howto = new HowtoView();
  game.activeView = howto;
  $('.container').html(howto.el);
});

game.events.on("highscores", function() {
  game.activeView.destroy();
  var highscore = new HighScoreView();
  game.activeView = highscore;
  $('.container').html(highscore.el);
});

game.events.on("credits", function() {
  game.activeView.destroy();
  var credits = new CreditsView();
  game.activeView = credits;
  $('.container').html(credits.el);
});

game.events.on("menu", function() {
  if(game.activeView) {
    game.activeView.destroy();
  }
  var menu = new MenuView();
  game.activeView = menu;
  $('.container').html(menu.el);
});

game.events.trigger('menu');

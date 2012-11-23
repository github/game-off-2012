window.game = {};
game.events = _.clone(Backbone.Events);

game.refreshView = function(view) {
  $('.container').html(game.activeView.el);
};

game.events.on("start", function() {
  game.activeView.destroy();
  game.activeView = new SongsView({
    collection: songs
  });
  game.refreshView();
});

game.events.on("howto", function() {
  game.activeView.destroy();
  game.activeView = new HowtoView();
  game.refreshView();
});

game.events.on("highscores", function() {
  game.activeView.destroy();
  game.activeView = new HighScoreView();
  game.refreshView();
});

game.events.on("credits", function() {
  game.activeView.destroy();
  game.activeView = new CreditsView();
  game.refreshView();
});

game.events.on("menu", function() {
  if(game.activeView) game.activeView.destroy();
  game.activeView = new MenuView();
  game.refreshView();
});

game.events.on("loadSong", function(song) {
  game.activeView.destroy();
  game.activeView = new SongView({
    model : song
  });
  game.refreshView();
});

game.events.trigger('menu');

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
  console.log('insert how to play view');
});

game.events.on("highscores", function() {
  console.log('insert highscores view');
});

game.events.on("credits", function() {
  console.log('insert credits view');
  activeView.destroy();
  var credits = new CreditsView();
  activeView = credits;
  $('.container').html(credits.el);
});

game.events.on("menu", function() {
  console.log('menu view');
  if(activeView) {
    activeView.destroy();
  }
  var menu = new MenuView();
  activeView = menu;
  $('.container').html(menu.el);
});

game.events.trigger('menu');

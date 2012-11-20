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
  console.log('insert how to play view');
});

game.events.on("highscores", function() {
  console.log('insert highscores view');
});

game.events.on("credits", function() {
  console.log('insert credits view');
});

var menu = new MenuView();

$('.container').append(menu.el);

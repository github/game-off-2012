var song = new SongView({
  model: songs.first()
});

var menu = new MenuView();

//$('body').append(song.el);

$('body').append(menu.el);

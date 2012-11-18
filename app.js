var song = new SongView({
  model: songs.first()
});

$('body').append(song.el);

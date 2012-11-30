window.game = {};
game.events = _.clone(Backbone.Events);
game.audio = {
  effects : {
    click : $('audio.click')[0],
    whip  : $('audio.whip')[0]
  }
};

var Router = Backbone.Router.extend({

  routes: {
    "" : "choctopus",
    "choose_song" : "choose_song",
    "song/:name"    : "song",
    "howto"        : "howto",
    "highscores"   : "highscores",
    "credits"      : "credits",
    "menu"         : "menu",
    "choctopus"    : "choctopus"
  },

  choose_song: function() {
    game.chooseSong();
  },

  howto: function() {
    game.howTo();
  },

  highscores: function() {
    game.highScores();
  },

  credits: function() {
    game.credits();
  },

  menu: function() {
    game.menu();
  },

  song: function(name) {
    game.loadSong(songs.where({filename: name})[0]);
  },

  choctopus: function() {
    game.choctopus();
  }

});

game.router = new Router;

game.mute = false;

game.refreshView = function(view) {
  $('.container').html(game.activeView.el);
};

game.chooseSong = function() {
  game.router.navigate("choose_song");
  if(game.activeView) game.activeView.destroy();
  game.activeView = new SongsView({
    collection: songs
  });
  game.refreshView();
};

game.howTo = function() {
  game.router.navigate("howto");
  if(game.activeView) game.activeView.destroy();
  game.activeView = new HowtoView();
  game.refreshView();
};

game.highScores = function() {
  game.router.navigate("highscores");
  if(game.activeView) game.activeView.destroy();
  game.activeView = new HighScoreView({
    collection : songs
  });
  game.refreshView();
};

game.credits = function() {
  game.router.navigate("credits");
  if(game.activeView) game.activeView.destroy();
  game.activeView = new CreditsView({
    collection: songs
  });
  game.refreshView();
};

game.choctopus = function() {
  if(game.activeView) game.activeView.destroy();
  game.activeView = new ChoctopusView();
  game.refreshView();
  window.setTimeout(game.menu, 2500);
};

game.menu = function() {
  game.router.navigate("menu");
  if(game.activeView) game.activeView.destroy();
  game.activeView = new MenuView();
  game.refreshView();
  game.events.trigger('playSound', 'whip');
};

game.loadSong = function(song) {
  game.router.navigate("song/" + song.get('filename'));
  if(game.activeView) game.activeView.destroy();
  game.activeView = new SongView({
    model : song
  });
  game.refreshView();
};

game.events.on("start", function() {
  game.chooseSong();
});

game.events.on("howto", function() {
  game.howTo();
});

game.events.on("highscores", function() {
  game.highScores();
});

game.events.on("credits", function() {
  game.credits();
});

game.events.on("menu", function() {
  game.menu();
});

game.events.on("loadSong", function(song) {
  game.loadSong(song);
});

game.events.on("choctopus", function() {
  game.choctopus();
});

game.events.on("playSound", function(sound) {
  if(!game.mute){
    game.audio.effects[sound].play();
  }
});

Backbone.history.start();

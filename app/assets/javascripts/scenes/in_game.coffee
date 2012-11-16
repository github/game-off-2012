Crafty.scene("in_game", ->

  Crafty.viewport.x = Config.viewport.center.x
  Crafty.viewport.y = Config.viewport.center.y

  Crafty.background("#000")


  game = Crafty.e("Game")
  music = new Music()

  center = Crafty.e("ActionCenter").game(game)

  player = Crafty.e("2D, DOM, Color, MoveInCircle, Player, Collision").onHit("Obstacle", ->
    @crash()
    game.stop()
  )
  track  = Crafty.e("Track").player(player).Track().color(Config.cycle.colors.base)

  Crafty.e("Mute")

  player.bind("LevelUp", ->
    game.levelUp()
  )

  Crafty.bind("Restart", =>
    player.reset()
    track.reset()
    game.reset().start()
  )


  music.play()

  game.onAction( (action) =>
    Crafty.audio.play("#{action.toLowerCase()}.mp3", 1, Settings.get("narratorVolume"))
    track.currentSegment(Config.obstacles.changeWhere.initial + Config.obstacles.changeWhere.increaseBy * game.cycles).perform(action)
  ).start()
)


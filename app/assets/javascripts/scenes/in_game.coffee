Crafty.scene("in_game", ->

  Crafty.viewport.x = Config.viewport.center.x
  Crafty.viewport.y = Config.viewport.center.y

  Crafty.background("#000")

  Crafty.audio.add("music", Crafty.math.randomElementOfArray(Config.music))

  game = Crafty.e("Game")

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

  Crafty.audio.play("music")

  game.onAction( (action) =>
    track.currentSegment(Config.obstacles.changeWhere.initial + Config.obstacles.changeWhere.increaseBy * game.cycles).perform(action)
  ).start()

#  Crafty.e("GFXText").text("Release 1!").Start()
)


Crafty.scene("in_game", ->
  Crafty.background("#000")

  Crafty.audio.add("music", Crafty.math.randomElementOfArray(Config.music))

  game = Crafty.e("Game")
  center = Crafty.e("ActionCenter").pivot(Config.viewport.center).game(game)


  player = Crafty.e("2D, DOM, Color, MoveInCircle, Player, Collision").pivot(Config.viewport.center).onHit("Obstacle",
      ->
        @crash()
        game.stop()
  )
  track  = Crafty.e("Track").pivot(Config.viewport.center).player(player).Track().color(Config.cycle.colors.base)

  player.bind("LevelUp", ->
    game.levelUp()
  )

  Crafty.bind("Restart", =>
    player.reset()
    track.reset()
    game.reset().start()
  )

  Crafty.audio.play("music")

  game.onAction( (action)->
    track.currentSegment(Config.obstacles.changeAhead).perform(action)
  ).start()


)


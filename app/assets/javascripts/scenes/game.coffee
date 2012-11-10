Crafty.scene("game", ->
  Crafty.background("#000")

  Crafty.audio.add("music", Crafty.math.randomElementOfArray(Config.music))


  player = Crafty.e("2D, DOM, Color, MoveInCircle, Collision").pivot(Config.viewport.center).onHit("Obstacle",
      -> @crash()
  )
  track  = Crafty.e("Track").pivot(Config.viewport.center).color("#ff0000").player(player).Track()

  Crafty.e("2D, Canvas, ActionCenter").pivot(Config.viewport.center).onAction( (action)->
    track.currentSegment(10).perform(action)
  )

  Crafty.bind("GameOver", =>
    player.reset()
    track.reset()
  )

  Crafty.audio.play("music")
)


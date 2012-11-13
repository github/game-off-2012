Crafty.scene("game", ->
  Crafty.background("#000")

  Crafty.audio.add("music", Crafty.math.randomElementOfArray(Config.music))


  start_line = Crafty.e("2D, DOM, Color").color("#222").attr(x: Config.viewport.center.x + 5 , y: 40 , h: Config.cycle.outerRadius - Config.cycle.innerRadius - 30, w: 2)
  player = Crafty.e("2D, DOM, Color, MoveInCircle, Collision").pivot(Config.viewport.center).onHit("Obstacle",
      -> @crash()
  )
  track  = Crafty.e("Track").pivot(Config.viewport.center).player(player).Track().color(Config.cycle.colors.base)

  track._segments[Config.cycle.segments * 0.75]._inner.attach(start_line) #Hack for start_line

  actions = Crafty.e("2D, Canvas, ActionCenter").pivot(Config.viewport.center).onAction( (action)->
    track.currentSegment(Config.obstacles.changeAhead).perform(action)
  ).start()

  Crafty.bind("Restart", =>
    player.reset()
    track.reset()
    actions.reset()
  )

  Crafty.audio.play("music")
)


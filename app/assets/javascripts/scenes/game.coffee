Crafty.scene("game", ->
  Crafty.background("#000")

  Crafty.audio.add("music", Crafty.math.randomElementOfArray(Config.music))


  start_line = Crafty.e("2D, DOM, Color, Line, Collision").color("#222").attr(x: Config.viewport.center.x + 5 , y: 40 , h: Config.cycle.outerRadius.base - Config.cycle.innerRadius.base - 30, w: 2)
  player = Crafty.e("2D, DOM, Color, MoveInCircle,Player, Collision").pivot(Config.viewport.center).onHit("Obstacle",
      -> @crash()
  )
  track  = Crafty.e("Track").pivot(Config.viewport.center).player(player).Track().color(Config.cycle.colors.base)

  track._segments[Config.cycle.segments * 0.75]._inner.attach(start_line) #Hack for start_line

  counter = Crafty.e("2D, DOM, Text, Color").attr(x: 0, y: 10, color: "white", h: 20, w:50)
  round = 0
  counter.text((round+1))
  player.bind("LevelUp", ->
    round += 1
    counter.text((round+1))
  )

  actions = Crafty.e("2D, Canvas, ActionCenter").pivot(Config.viewport.center).onAction( (action)->
    track.currentSegment(Config.obstacles.changeAhead).perform(action)
  ).start()

  Crafty.bind("Restart", =>
    player.reset()
    track.reset()
    actions.reset()
    round = 0
    counter.text((round+1))
  )

  Crafty.audio.play("music")
)


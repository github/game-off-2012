Crafty.scene("game", ->
  Crafty.background("#000")

  Crafty.audio.add("music", Crafty.math.randomElementOfArray(Config.music))


  player = Crafty.e("2D, DOM, Color, MoveInCircle, Player, Collision").attr(h:10, w:10).color("#Fff").pivot(Config.viewport.center).onHit("Collision",
      -> @crash()
  )
  track  = Crafty.e("Track").pivot(Config.viewport.center).color("#ff0000").player(player).Track()

  window.actionQueue = Crafty.e("2D, DOM, ActionBag, Text").attr({ actions: [], x: 500, y: 0, w: 200, h: 300 }).actionBag("gameModifiers", ["Pull", "Push", "Fork", "Merge"], ((action) ->
    @actions.push(action)
    if (@actions.length == 4)
      topAction = @actions.shift()
      track.currentSegment(10).perform(topAction)

    @text(@actions.join("\r\n"))
  ), 1000)

  Crafty.bind("GameOver", =>
    player.reset()
    track.reset()
  )

  Crafty.audio.play("music")
)


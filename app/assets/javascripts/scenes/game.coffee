Crafty.scene("game", ->
  Crafty.background("#000")

  Crafty.audio.add("music", Crafty.math.randomElementOfArray(Config.music))


  player = Crafty.e("2D, DOM, Color, MoveInCircle, Player, Collision").attr(h:10, w:10).color("#Fff").pivot(Config.viewport.center).onHit("Obstacle",
      -> @crash()
  )
  track  = Crafty.e("Track").pivot(Config.viewport.center).color("#ff0000").player(player).Track()

#  Crafty.e("2D, DOM, Color").attr(origin: "CENTER", x: Config.viewport.center.x, y: Config.viewport.center.x, w: 50, h: 50, color: "#fff")
#  Crafty.circle(Config.viewport.center.x, Config.viewport.center.y, 20)
  Crafty.e("2D, DOM, Color, ActionBag, Text").attr(x: Config.viewport.center.x, y: Config.viewport.center.y, w: 50, h: 50, actions: []).color("#800").actionBag("gameModifiers", ["Pull", "Push", "Fork", "Merge"], ((action) ->
    @actions.push(action)
    if (@actions.length == 2)
      topAction = @actions.shift()
      track.currentSegment(10).perform(topAction)

    @text(@actions.join("\r\n"))
  ), 2000)

  Crafty.bind("GameOver", =>
    player.reset()
    track.reset()
  )

  Crafty.audio.play("music")
)


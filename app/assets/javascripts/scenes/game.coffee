Crafty.scene("game", ->
  Crafty.background("#000")

  Crafty.audio.add("music", "sounds/music/04 - Bullcactus.mp3")

  window.player = Crafty.e("2D, DOM, Color, MoveInCircle, Player, Collision").attr(h:10, w:10).color("#Fff").pivot(Config.viewport.center).onHit("Collision",
      -> @crash()
  )
  window.track  = Crafty.e("Track").pivot(Config.viewport.center).color("#ff0000").player(player).Track()

  window.actionQueue = Crafty.e("2D, DOM, ActionBag, Text").attr({ actions: [], x: 500, y: 0, w: 200, h: 300 }).actionBag("gameModifiers", ["Pull", "Push", "Fork", "Merge"], ((action) ->
    @actions.push(action)
    if (@actions.length == 5)
      topAction = @actions.shift()
      window.track.currentSegment(-5).perform(topAction)

    @text(@actions.join("\r\n"))
  ), 1000)

  Crafty.audio.play("music")
)


Crafty.scene("game", ->
  Crafty.background("#000")

  origin = {x: Crafty.viewport.width / 2, y: Crafty.viewport.height / 2}

  window.player = Crafty.e("2D, DOM, Color, MoveInCircle, Collision").attr(h:10, w:10).color("#Fff").origin(origin)
  window.track  = Crafty.e("Track").attrs(
                    origin: origin
                    innerRadius: Config.cycleInnerRadius
                    outerRadius: Config.cycleOuterRadius
                    segments: Config.cycleSegments
                  ).color("#ff0000").prepare()

  window.actionQueue = Crafty.e("2D, DOM, ActionBag, Text").attr({ actions: [], x: 500, y: 0, w: 200, h: 300 }).actionBag("gameModifiers", ["Pull", "Push", "Fork", "Merge"], ((action) ->
    @actions.push(action)
    if (@actions.length == 5)
      topAction = @actions.shift()
      # dispatch action to other component
    @text(@actions.join("\r\n"))
  ), 1000)
)


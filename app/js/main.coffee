window.onload = ->
  Crafty.init(400, 336)
  Crafty.scene("game", ->
    Crafty.background("#000")

    Crafty.c("LeftControls",
      init: ->
        this.requires('Multiway')

      leftControls: (speed) ->
        this.multiway(speed, {W: -90, S: 90, D: 0, A: 180})
    )

    Crafty.e("2D, Canvas, Color, LeftControls")
    .attr({ x: 16, y: 304, w: 5, h: 5})
    .color("#969696")
    .leftControls(5)
  )

  Crafty.scene("game")






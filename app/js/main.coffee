window.onload = ->
  Crafty.init(480, 320)
  Crafty.scene("game", ->
    Crafty.background("#000")
#
#    Crafty.e("2D, Canvas, Color, Velocity, SimpleVelocityControls")
#    .attr({ x: 16, y: 250, w: 20, h: 20})
#    .color("#969696")
#    .initialAcceleration(0, 0)
#    .initialAccelerationStep(0.02)
  )

  Crafty.scene("game")
window.onload = ->

  Crafty.init(480, 320)

  Crafty.scene("game", ->
    Crafty.background("#000")
    window.e1 = Crafty.e("2D, Canvas, GreenCodeBlock, Tween").attr(x: 100, y:50)
    window.e2 = Crafty.e("2D, Canvas, GreenCodeBlock, Tween").attr(x: 100, y:150)
    window.e3 = Crafty.e("2D, Canvas, RedCodeBlock, Tween, Velocity, SimpleVelocityControls").attr(x: 100, y:250)

  )

  Crafty.scene("game")
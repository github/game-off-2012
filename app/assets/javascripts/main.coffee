window.onload = ->

  Crafty.init(480, 320)

  Crafty.scene("game", ->
    Crafty.background("#000")
    window.e1 = Crafty.e("2D, Canvas, GreenCodeBlock, Tween, Collision").attr(x: 100, y:50)
    window.e2 = Crafty.e("2D, Canvas, GreenCodeBlock, Tween, Collision").attr(x: 100, y:150)
    window.e3 = Crafty.e("2D, Canvas, RedCodeBlock, Tween, Collision").attr(x: 100, y:250).tween({x: 480, rotation: 100}, 1000)

    window.player = Crafty.e("2D, Canvas, Color, Velocity, SimpleVelocityControls, Collision").attr(x: 480/2, y:320/2, h:10, w:10).color("#Fff").onHit("CodeBlock", ->
      @_acceleration.x = 0
      @_acceleration.y = 0
      @_velocity.x *= -1
      @_velocity.y *= -1
    )

  )

  Crafty.scene("game")
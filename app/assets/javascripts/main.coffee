window.onload = ->

  Crafty.init(640, 480)

  Crafty.scene("game", ->
    Crafty.background("#000")
    window.e1 = Crafty.e("2D, Canvas, GreenCodeBlock, Tween, Collision").attr(x: 100, y:50).attr(rotation: 45)
#    window.d1 = Crafty.e("2D, Canvas, Color, Collision").attr(x: 100, y:50, h:50, w:50, color:"#ffffff", rotation: e1.rotation + 45).origin("center")
    window.e2 = Crafty.e("2D, Canvas, GreenCodeBlock, Tween, Collision").attr(x: 100, y:150)
    window.e3 = Crafty.e("2D, Canvas, RedCodeBlock, Tween, Collision").attr(x: 100, y:250).tween({x: 480, rotation: 100}, 1000)

    window.player = Crafty.e("2D, Canvas, Color, Multiway, Collision").attr(x: 480/2, y:320/2, h:10, w:10).color("#Fff")
      .multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
      .bind('Moved', (from) ->
        if @hit("CodeBlock")
          @attr(x: from.x, y:from.y)
      )

  )

  Crafty.scene("game")
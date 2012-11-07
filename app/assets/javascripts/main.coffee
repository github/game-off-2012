window.onload = ->

  Crafty.init(640, 480)

  radius = 50

  Crafty.scene("game", ->
    Crafty.background("#000")

    window.player = Crafty.e("2D, DOM, Color, Multiway,MoveInCircle, Collision").attr(x: 480/2, y:320/2, h:10, w:10)
      .color("#Fff")

#      .multiway(3, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
#      .bind('Moved', (from) ->
#        if @hit("CodeBlock")
#          @attr(x: from.x, y:from.y)
#      )

  )

  Crafty.scene("game")
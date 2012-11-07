Crafty.c("Obstacle",
  init: ->
    @requires("2D, DOM, Color, Collision")

  attrs: (index, pivot, radius, segments) ->
    angle = (index * 360 / segments)
    @x = pivot.x + (radius * Math.cos(angle * Math.PI / 180))
    @y = pivot.y + (radius * Math.sin(angle * Math.PI / 180))
    @w =  30
    @h =  5
    @origin = 'center'
    @rotation = angle
    @
)

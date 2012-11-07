Crafty.c("Obstacle",
  init: ->
    @requires("2D, DOM, Color, Collision")

  attrs: (index, pivot, radius, segments) ->
    angle = (index * 360 / segments)
    coords = window.Utils.polarCnv(radius, angle)
    @x = pivot.x + coords.x
    @y = pivot.y + coords.y
    @w =  30
    @h =  5
    @origin = 'center'
    @rotation = angle
    @

  paint: (baseColor, index) ->
    @color(Utils.increase_brightness(baseColor, index))
)

Crafty.c "Obstacle",
  _startRadius: 0

  init: ->
    @requires("2D, DOM, Color, Tween, Collision")

  radius: (radius) ->
    @_startRadius = radius
    @radius = radius
    @

  pivot: (pivot)->
    @attr('pivot', pivot)
    @

  angle: (angle)->
    @attr('angle', angle)
    @

  _position: ->
    coords = Utils.polarCnv(@radius, @angle)
    @x = @pivot.x + coords.x
    @y = @pivot.y + coords.y

  shiftRadius: (radiusChange)->
    @radius += radiusChange
    coords = Utils.polarCnv(@radius, @angle)
    @tween({x:@pivot.x + coords.x, y: @pivot.y + coords.y}, 30)

  Obstacle: ->
    @_position()
    @w =  30
    @h =  10
    @origin = 'center'
    @rotation = @angle

    @color(Utils.increase_brightness("#770000", Math.abs(180 - @angle) / 180 *20))
    @

  reset: ->
    @radius = @_startRadius
    @_position()

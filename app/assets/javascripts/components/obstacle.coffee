Crafty.c "Obstacle",
  _startRadius: 0

  init: ->
    @requires("2D, DOM, Color, Tween")

  radius: (radius, type) ->
    @_startRadius = radius
    @h = Config.obstacles.width[type]
    @w = Config.obstacles.height[type]
    @radius = radius
    @requires("Collision")
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
    @tween({x:@pivot.x + coords.x, y: @pivot.y + coords.y}, @_speed)

  upgrade: ->
    @_speed -= Config.obstacles.tweenDuration.change
    @_speed = Math.max(@_speed, Config.obstacles.tweenDuration.minimum)

  reset: ->
    @_speed = Config.obstacles.tweenDuration.inital
    @radius = @_startRadius
    @_position()

  Obstacle: ->
    @_position()
    @rotation = @angle
    @origin = 'center'
    @reset()
    @


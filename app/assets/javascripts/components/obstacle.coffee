Crafty.c "Obstacle",
  _startRadius: 0
  _baseColor: Config.cycle.colors.base

  init: ->
    @requires("2D, DOM, Color, Delay, Tweener")

  radius: (radius, type) ->
    @_startRadius = radius
    @h = Config.obstacles.width[type]
    @w = Config.obstacles.height[type]
    @_min = Config.cycle[type].minimum
    @_max = Config.cycle[type].maximum
    @radius = radius
    @requires("Collision")
    @

  angle: (angle)->
    @attr('angle', angle)
    @

  _position: ->
    coords = Utils.polarCnv(@radius, @angle)
    @x = coords.x
    @y = coords.y

  shiftRadius: (radiusChange)->
    @radius += radiusChange
    @radius = Math.min(@_max, Math.max(@_min, @radius))
    change = 1 + ((Math.abs(radiusChange) / Config.actionValues.MAX) / 10)

    coords = Utils.polarCnv(@radius, @angle)
    setTimeout((=> @color(Utils.change_hue(@_color, change))), 1)
    @addTween({x:coords.x, y:coords.y}, 'easeInOutCubic', @_speed)

  upgrade: ->
    @_speed -= Config.obstacles.tweenDuration.change
    @_speed = Math.max(@_speed, Config.obstacles.tweenDuration.minimum)

  reset: ->
    @_speed = Config.obstacles.tweenDuration.inital
    @radius = @_startRadius
    @_position()
    @color(@_baseColor)

  Obstacle: ->
    @_position()
    @rotation = @angle
    @origin = 'center'
    @reset()
    @


Crafty.c "Obstacle",
  _startRadius: 0

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

    coords = Utils.polarCnv(@radius, @angle)
    @color(Utils.increase_brightness(Config.cycle.colors.base, Math.abs(radiusChange)))
    @addTween({x:coords.x, y:coords.y}, 'easeInOutCubic', @_speed)
    clearTimeout(@timeout) if @timeout
    @timeout = setTimeout((-> @color(Config.cycle.colors.base)), @_speed * 20)

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


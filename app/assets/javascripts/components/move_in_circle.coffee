Crafty.c "MoveInCircle",
  _initialSpeed: Config.player.angularSpeed
  _initialAngle: Config.player.initialAngle
  _radius: Config.cycleCenterRadius
  _speed: null
  _speedIncrease: Config.player.angularSpeedIncrease
  _angle: 0
  _pivot:
    x: 0
    y: 0
  _movement: 0

  _keys:
    RIGHT_ARROW: -Config.player.controlSpeed
    LEFT_ARROW: +Config.player.controlSpeed

  init: ->
    @requires('Delay')
    @reset()
    @_setKeys()
    @origin("center")
    Crafty.audio.add("faster", "sounds/faster.wav")
    Crafty.audio.add("crash", "sounds/die.wav")
    @disableControl()
    @enableControl()
    @color(Config.player.color)
    @attr(h:Config.player.size, w:Config.player.size)

  reset: ->
    @disableControls = false
    @_angle = @_initialAngle
    @_speed = @_initialSpeed
    @_radius = Config.cycle.centerRadius

  pivot: (hsh) ->
    @_pivot = hsh
    @

  angle: ->
    @_angle % 360

  _keydown: (e) ->
    if @_keys[e.key]
      @_movement = @_keys[e.key]
      @trigger "NewDirection", @_movement

  _keyup: (e) ->
    @_movement = 0

  disableControl: ->
     @unbind("KeyDown", @_keydown).unbind("KeyDown", @_keydown).unbind "EnterFrame", @_enterframe
     @

  enableControl: ->
    @bind("KeyDown", @_keydown).bind("KeyUp", @_keyup).bind "EnterFrame", @_enterframe
    @

  _enterframe: ->
    return if @disableControls
    @_angle += @_speed
    if @_angle > 360 + @_initialAngle
      @_angle -= 360
      @_speed += @_speedIncrease
      Crafty.trigger('LevelUp')
    @_radius += @_movement
    @rotation = @_angle - @_initialAngle
    coords = Utils.polarCnv(@_radius, @_angle)
    old = {x:@x, y:@y}
    @x = @_pivot.x + coords.x
    @y = @_pivot.y  + coords.y
    @trigger("Moved",
      x: old.x
      y: old.y
    )
    @_generateTrail()

  _setKeys: ->
    newKeys = {}
    _.each(@_keys, (v,k) ->
      newKeys[Crafty.keys[k]] = v
    )
    @_keys = newKeys

  _generateTrail: ->
    return unless Crafty.frame() % Config.gfx.trail.interval == 0
    Crafty.e("Trail").attr(rotation: @rotation, x: @_x, y: @_y).Trail()

  crash: ->
    return if @disableControls
    Crafty.audio.play("crash")
    @disableControls = true
    @crashed = true
    @delay((-> Crafty.trigger("GameOver")), Config.flow.restartDelay)
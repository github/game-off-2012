Crafty.c "MoveInCircle",
  _initialSpeed: 3
  _initialAngle: 270
  _radius: window.Config.cycleCenterRadius
  _speed: 2
  _speedIncrease: 0.1
  _angle: 0
  _pivot:
    x: 0
    y: 0
  _movement: 0

  _keys:
    RIGHT_ARROW: -1
    LEFT_ARROW: +1

  init: ->
    @reset()
    @_setKeys()
    @origin("center")
    @disableControl()
    @enableControl()
    Crafty.audio.add("faster", "sounds/faster.wav")
    Crafty.audio.add("crash", "sounds/die.wav")

  reset: ->
    @_angle = @_initialAngle
    @_speed = @_initialSpeed
    @_radius = window.Config.cycleCenterRadius

  pivot: (hsh) ->
    @_pivot = hsh
    @

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
      Crafty.audio.play("faster")
    @_radius += @_movement
    @rotation = @_angle - @_initialAngle
    degrees = @_angle * Math.PI/180
    old = {x:@x, y:@y}
    @x = @_pivot.x + (@_radius * Math.cos(degrees))
    @y = @_pivot.y  + (@_radius * Math.sin(degrees))
    @trigger("Moved",
      x: old.x
      y: old.y
    )

  _setKeys: ->
    newKeys = {}
    _.each(@_keys, (v,k) ->
      newKeys[Crafty.keys[k]] = v
    )
    @_keys = newKeys

  crash: ->
    Crafty.audio.play("crash")
    @reset()

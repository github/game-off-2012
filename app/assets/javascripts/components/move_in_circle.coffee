Crafty.c "MoveInCircle",
  _speed: 3
  _radius: window.Config.cycleCenterRadius
  _angle: 0
  _origin:
    x: 0
    y: 0
  _movement: 0

  _keys:
    RIGHT_ARROW: -1
    LEFT_ARROW: +1

  init: ->
    @_setKeys()
    @disableControl()
    @enableControl()
    @

  origin: (hsh) ->
    @_origin = hsh

  _keydown: (e) ->
#    console.log("KEYDOWN",e.key)
    if @_keys[e.key]
#      console.log("radius",@_keys[e.key])
      @_movement = @_keys[e.key]
      @trigger "NewDirection", @_movement

    if e.key == Crafty.keys["UP_ARROW"]
      @_speed += 1

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
    @_radius += @_movement
    degrees = @_angle * Math.PI/180
    old = {x:@x, y:@y}
    @x = @_origin.x - @w/2 + (@_radius * Math.cos(degrees))
    @y = @_origin.y - @h/2  + (@_radius * Math.sin(degrees))
    @trigger("Moved",
      x: old.x
      y: old.y
    )

  _setKeys: ->
    newKeys = {}
    _.each(@_keys, (v,k) ->
      newKeys[Crafty.keys[k]] = v
    )
    console.log(@_keys)
    @_keys = newKeys
    console.log(@_keys)
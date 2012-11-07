Crafty.c "MoveInCircle",
  _speed: 5
  _radius: window.Config.cycleCenterRadius
  _angle: 0
  _origin:
    x: 100
    y: 100

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
    console.log("KEYDOWN",e.key)
    if @_keys[e.key]
      console.log("radius",@_keys[e.key])
      @_radius += @_keys[e.key]
      @trigger "NewDirection", @_movement

  disableControl: ->
     @unbind("KeyDown", @_keydown).unbind "EnterFrame", @_enterframe
     @

  enableControl: ->
    @bind("KeyDown", @_keydown).bind "EnterFrame", @_enterframe
    @

  _enterframe: ->
    return if @disableControls
    @_angle += @_speed
    degrees = @_angle * Math.PI/180
    old = {x:@x, y:@y}
    @x = @_origin.x + (@_radius * Math.cos(degrees))
    @y = @_origin.y + (@_radius * Math.sin(degrees))
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
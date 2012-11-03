Crafty.c("Velocity",
  _velocity:     {x:0.0, y:0.0}
  _acceleration: {x:0.0, y:0.0}

  init: ->
    @requires('2D')

    @bind('EnterFrame', ->
      @_modifyVelocity()
      @_modifyPosition()
    )

  initialVelocity: (x, y) ->
    @_velocity.x = x
    @_velocity.y = y
    @

  initialAcceleration: (x, y) ->
    @_acceleration.x = x
    @_acceleration.y = y
    @

  _modifyVelocity: ->
    @_velocity.x += @_acceleration.x
    @_velocity.y += @_acceleration.y

  _modifyPosition: ->
    @x += @_velocity.x
    @y += @_velocity.y
)

Crafty.c("SimpleVelocityControls",
  _accelerationSteps: 0.01

  init: ->
    @requires('Velocity')
    @requires('Keyboard')

    @bind('KeyDown', ->
      if @isDown('A')
        @_acceleration.x -= @_accelerationSteps
      else if @isDown('D')
        @_acceleration.x += @_accelerationSteps

      if @isDown('W')
        @_acceleration.y -= @_accelerationSteps
      else if @isDown('S')
        @_acceleration.y += @_accelerationSteps

    )

  initialAccelerationStep: (step) ->
    @_accelerationSteps = step
    @
)
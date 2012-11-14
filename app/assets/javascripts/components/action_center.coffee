Crafty.c "ActionCenter",

  _images: []
  radius: Config.cycle.innerRadius - 20
  _blinkColor: "#ffffff"

  init: ->
    @requires("Color, Image, Delay")
    @color = "#75BEEB"
    @w = @radius * 2
    @h = @radius * 2
    @_loadImages()
    @reset()
    @bind("GameOver", => @stop())
    @bind("Restart", => @start())
    @

  reset: ->
    @_currentAction = null
    @_actions = Config.actions
    @_delay = Config.obstacles.intervals.initial

  pivot: (hsh)->
    @_pivot = hsh
    @x = @_pivot.x - @radius/2
    @y = @_pivot.y - @radius/2
    @

  start: ->
    @_on = true
    @setTimeout(Config.obstacles.intervals.atStart)
    @

  stop: ->
    @_on = false
    @reset()
    @draw()
    @

  draw: ->
    @ctx ||= Crafty.canvas.context
    @ctx.fillStyle = @color
    @ctx.beginPath()
    @ctx.arc(
       @x + @radius / 2,
       @y + @radius / 2,
       @radius,
       0,
       Math.PI * 2
    )
    @ctx.closePath()
    @ctx.fill()

  drawAction: ->
    img  = Crafty.assets[@_imgForAction(@_currentAction)];
    if !!img
      @ctx.drawImage(img,@x - @radius/2 + 8 , @y- @radius/2 + 5 );

  blink: ->
    @_color = @color
    @color = @_blinkColor
    @draw()
    @delay( (-> @back()), 100)

  back: ->
    @color = @_color
    @draw()
    @drawAction()

  setTimeout: (delayOverride = null) ->
    @delay((=> @rollAction()), delayOverride || @_delay)

  rollAction: ->
    return unless @_on
    @_currentAction = _.shuffle(@_actions)[0]
    @_callback(@_currentAction)
    @blink()
    @drawAction()
    @setTimeout()

  onAction: (callback)->
    @_callback = callback
    @

  _imgForAction: (action) ->
    "/assets/#{action.toLowerCase()}.png"

  _loadImages: ->
    Crafty.load(_.map(Config.actions, (action) => @_imgForAction(action)))


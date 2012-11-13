Crafty.c "ActionCenter",

  _actions: ["Pull", "Push", "Fork", "Merge"]
  _images: []
  _bag: "gameModifiers"
  radius: Config.cycle.innerRadius - 20
  actions: []
  _delay: Config.obstacles.interval
  _blinkColor: "#ff5555"

  init: ->
    @requires("Color, Image, Delay, ActionBag")
    @color = "#75BEEB"
    @w = @radius * 2
    @h = @radius * 2
    @_loadImages()
    @

  pivot: (hsh)->
    @_pivot = hsh
    @x = @_pivot.x - @radius/2
    @y = @_pivot.y - @radius/2
    @

  draw: ->
    ctx = Crafty.canvas.context
    ctx.save()
    ctx.fillStyle = @color
    ctx.beginPath()
    ctx.arc(
       @x + @radius / 2,
       @y + @radius / 2,
       @radius,
       0,
       Math.PI * 2
    )
    ctx.closePath()
    ctx.fill()

    action = @actions[0]
    if !!action
      img  = Crafty.assets[@_imgForAction(action)];
      if !!img
        ctx.drawImage(img,@x - @radius/2 + 8 , @y- @radius/2 + 5 );

  blink: ->
    @_color = @color
    @color = @_blinkColor
    @delay( (-> @back()), 100)

  back: ->
    @color = @_color
    @trigger("Change");

  onAction: (callback)->
    @actionBag(@_bag, @_actions, ((newAction) =>
      @actions.push(newAction)
      @blink()
      @trigger("Change")
      if @actions.length > 1
        callback(@actions.shift())

    ), @_delay)
    @

  reset: ->
    @actions = []


  _imgForAction: (action) ->
    "/assets/#{action.toLowerCase()}.png"

  _loadImages: ->
    Crafty.load(_.map(@_actions, (action) => @_imgForAction(action)))


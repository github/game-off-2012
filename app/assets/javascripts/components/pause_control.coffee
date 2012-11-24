Crafty.c "Pause",
  init: ->
    @requires("2D, DOM, Text, Pause, Mouse")
    @attr(x: - Config.viewport.width / 2 + 5 , y: - Config.viewport.height / 2 , h: 30, w: 30,z: 1000)
    @text("❚❚")
    @enable()
    @attr("paused", false)

    @bind('Click', (e) -> @pauseToggle())

  bindKeyboard: ->
    @bind('KeyDown', (e) => @pauseToggle() if e.key == Crafty.keys.ESC)

  pauseToggle: ->
    return if @disabled
    if @paused
      @unpause()
    else
      @pause()

  disable: ->
    @attr(disabled: true)
    @visible = false

  enable: ->
    @attr(disabled: false)
    @visible = true

  pause: ->
    mixpanel.track("game paused")
    @addComponent("paused")
    @attr("paused", true)
    @trigger("DoPause")

  unpause: ->
    mixpanel.track("game unpaused")
    @removeComponent("paused")
    @attr("paused", false)
    @trigger("DoUnpause")


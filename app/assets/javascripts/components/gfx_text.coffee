Crafty.c "GFXText",

  init: ->
    @requires("2D, DOM, Text, Delay")
    @attr(w: Config.viewport.width, h: Config.viewport.height, x: -Config.viewport.center.x)

  Start: ->
    @addComponent("StartGFXTitle")
    @delay((=> @destroy()), Config.gfx.text.duration)
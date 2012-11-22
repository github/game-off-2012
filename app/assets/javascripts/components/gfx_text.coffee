Crafty.c "GFXText",

  init: ->
    @requires("2D, DOM, Text, Delay")
    @attr(x: -Config.viewport.center.x, z: Config.gfx.segmentsInitialIndex + 2)

  Start: ->
    @delay((=> @addComponent("WithTransition")), 1)
    @delay((=> @addComponent("StartGFXTitle")), 50)
    @delay((=> @destroy()), Config.gfx.text.duration)

Utils.showText = (text) ->
  Crafty.e("GFXText").text(text).Start()
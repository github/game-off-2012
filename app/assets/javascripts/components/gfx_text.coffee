Crafty.c "GFXText",

  init: ->
    @requires("2D, DOM, Text")
    @attr(x: -Config.viewport.center.x)

  Start: ->
    setTimeout((=> @addComponent("WithTransition")), 1)
    setTimeout((=> @addComponent("StartGFXTitle")), 100)
    setTimeout((=> @destroy()), Config.gfx.text.duration)

Utils.showText = (text) ->
  Crafty.e("GFXText").text(text).Start()
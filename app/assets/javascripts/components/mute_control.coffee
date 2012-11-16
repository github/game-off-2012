Crafty.c "Mute",
  init: ->
    @requires("2D, DOM, Text, typicn, mute, Mouse")
    @attr(x: Config.viewport.width / 2 - 40, y: - Config.viewport.height / 2, h: 40, w: 40)

    if store.get('mute')
      @mute()
    else
      @unmute()

    @bind('Click', (e) ->
      if Crafty.audio.muted
        @unmute()
      else
        @mute()

    )

  mute: ->
    @addComponent("muted")
    Crafty.audio.mute()
    store.set('mute', true)

  unmute: ->
    @removeComponent("muted")
    Crafty.audio.unmute()
    store.set('mute', false)


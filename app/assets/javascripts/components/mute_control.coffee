Crafty.c "Mute",
  init: ->
    @requires("2D, DOM, Text, typicn, mute, Mouse")
    @attr(
      x: Config.viewport.width / 2 - 40,
      y: - Config.viewport.height / 2,
      h: 40,
      w: 40
      z: 10000
    )

    if Settings.get('mute')
      @mute()
    else
      @unmute()

    @bind('Click', (e) ->
      if Crafty.audio.muted
        mixpanel.track("sound unmuted", mute: true)
        @unmute()
      else
        mixpanel.track("sound unmuted", mute: false)
        @mute()

    )

  mute: ->
    @addComponent("muted")
    Crafty.audio.mute()
    Settings.set('mute', true)

  unmute: ->
    @removeComponent("muted")
    Crafty.audio.unmute()
    Settings.set('mute', false)


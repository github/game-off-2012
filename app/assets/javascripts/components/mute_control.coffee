Crafty.c "Mute",
  init: ->
    @requires("2D, DOM, Text, typicn, mute, Mouse")
    @attr(x: Config.viewport.width / 2 - 40, y: - Config.viewport.height / 2, h: 40, w: 40)
    if store.get('mute')
      Crafty.audio.mute()
      console.log("X")
      debugger
      @_element.classList.add("muted")
    else
      Crafty.audio.unmute()
      @_element.classList.remove("muted")

    @bind('Click', (e) ->
      if Crafty.audio.muted
        e.target.classList.remove("muted")
        Crafty.audio.unmute()
        store.set('mute', false)
      else
        e.target.classList.add("muted")
        Crafty.audio.mute()
        store.set('mute', true)
    )


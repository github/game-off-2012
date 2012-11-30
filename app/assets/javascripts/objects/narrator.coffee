class window.Narrator
  @play: (action, cb = null) ->
    track = "#{action.toLowerCase()}.#{Config.soundExtension}"
    Crafty.audio.play(track, 1, Settings.get("narratorVolume"))
    jQuery(Crafty.audio.sounds[track].obj).one("ended", cb) if cb

class window.SFX
  @play: (action) ->
    track = "#{action.toLowerCase()}.#{Config.soundExtension}"
    Crafty.audio.play(track, 1, Settings.get("sfxVolume"))
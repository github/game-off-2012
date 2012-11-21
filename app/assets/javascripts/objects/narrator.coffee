class window.Narrator
  @play: (action, cb = null) ->
    track = "#{action.toLowerCase()}.mp3"
    Crafty.audio.play(track, 1, Settings.get("narratorVolume"))
    Crafty.audio.sounds[track].obj.addEventListener("ended", cb) if cb
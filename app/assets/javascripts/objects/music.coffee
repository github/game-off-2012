class window.Music

  @heardFirstTrack: ->
    Settings.get("heardFirstTrack") == true

  constructor: ->
    @firstTrack()

  firstTrack: ->
    if not Music.heardFirstTrack()
      Settings.set("heardFirstTrack", true)
      @track = Config.sounds.music[0]
    else
      @randomTrack()
    @

  randomTrack: ->
    @track = Crafty.math.randomElementOfArray(Config.sounds.music)
    @

  play: ->
    track = @track.substr(@track.lastIndexOf('/') + 1).toLowerCase()
    Crafty.audio.play(track, 1, Settings.get("musicVolume"))
    Crafty.audio.sounds[track].obj.addEventListener "ended", _.once =>
      setTimeout((=> @randomTrack().play()), 10)
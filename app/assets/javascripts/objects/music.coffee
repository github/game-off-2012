class window.Music
  constructor: ->
    @firstTrack()

  firstTrack: ->
    if Settings.get("firstTrack")
      Settings.set("firstTrack", false)
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
    jQuery(Crafty.audio.sounds[track].obj).one("ended", setTimeout(
        (=> @randomTrack().play())
      , 10)
    )
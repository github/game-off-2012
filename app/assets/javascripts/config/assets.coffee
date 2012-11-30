Config.sounds =
  music:
    [
      "sounds/music/04 - Bullcactus.mp3"
      "sounds/music/05 - Soft commando.mp3"
      "sounds/music/06 - Monster.mp3"
      "sounds/music/10 - Datahell beta.mp3"
    ]

  announcer:
    [
      "sounds/pull.mp3"
      "sounds/push.mp3"
      "sounds/merge.mp3"
      "sounds/fork.mp3"
      "sounds/conflict.mp3"
      "sounds/ready.mp3"
      "sounds/code.mp3"
    ]

  sfx:
    [
      "sounds/crash.mp3"
    ]

Config.soundExtension = "mp3"

unless Modernizr.audio.mp3
  _.each(Config.sounds, (array, groupKey) ->
    Config.sounds[groupKey] = _.map(array, (o)->o.replace(".mp3",".ogg"))
  )
  Config.soundExtension = "ogg"

Config.allAssets = _.flatten(Config.sounds)
Config.seconderyAssets = _.rest(Config.sounds.music)
Config.initialAssets = _.difference(Config.allAssets, Config.seconderyAssets)
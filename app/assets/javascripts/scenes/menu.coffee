Crafty.scene "menu", ->

  Crafty.viewport.x = Config.viewport.center.x
  Crafty.viewport.y = Config.viewport.center.y
  Crafty.background("#000")

  showButton = ->
    Crafty.e("2D, Mouse, DOM, Text, Button").text("Start Game").attr(x: -130, y: 50, w: 260, h:42).bind('Click', ->
      start()
    )

  start = =>
    @unbind('KeyDown', startWithEnter)
    Crafty.scene "in_game"

  startWithEnter = (e) =>
    return unless e.key == Crafty.keys['ENTER']
    start()

  loaded = =>
    showButton()
    @bind('KeyDown', startWithEnter)
    loading.visible = false


  p = Crafty.e("Player").attr(_speed: 1, _radius: 200)
  p.upgrade().upgrade().upgrade().upgrade().upgrade().upgrade().upgrade().upgrade()
  Crafty.e("2D, DOM, Text, Title").text("Release Cycles").attr(x: -160, y: -100, w: 320, h: 100)
  loading = Crafty.e("2D, DOM, Text").text("Loading...").attr(x: -30, y: 50)


  Crafty.e("Controls").attr(x: -50, y: 120)
  Crafty.e("Mute")

  Crafty.audio.add("crash.#{Config.soundExtension}", "sounds/crash.#{Config.soundExtension}") #hack to fix loading of audio
  mixpanel.track("view menu")
  started_loading = Date.now()
  assets = if Music.heardFirstTrack() then Config.allAssets else Config.initialAssets
  mixpanel.track("start loading", smallAssets: !Music.heardFirstTrack(), audioFormat: Config.soundExtension)
  Crafty.load(assets, =>
    mixpanel.track("finished loading", load_time: Date.now() - started_loading)
    loaded()
  )
  if assets == Config.initialAssets
    Crafty.load(Config.seconderyAssets)

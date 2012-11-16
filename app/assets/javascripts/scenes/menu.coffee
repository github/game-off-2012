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
    return if e.key == Crafty.keys['ENTER'] and not e == null
    start()

  @bind('KeyDown', startWithEnter)

  Crafty.audio.play(Crafty.math.randomElementOfArray(Config.music))
  Crafty.e("2D, DOM, Color, MoveInCircle, Player, Collision").attr(_speed: 1, _radius: 200)
  Crafty.e("2D, DOM, Text, Title").text("Release Cycles").attr(x: -160, y: -100, w: 320, h: 100)
  loading = Crafty.e("2D, DOM, Text").text("Loading...").attr(x: -30, y: 50)

  Crafty.e("Mute")
  Crafty.load(Config.music, ->
    showButton()
    loading.visible = false
  )

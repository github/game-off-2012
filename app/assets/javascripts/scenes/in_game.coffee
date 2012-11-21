Crafty.scene("in_game", ->

  Crafty.viewport.x = Config.viewport.center.x
  Crafty.viewport.y = Config.viewport.center.y

  Crafty.background("#000")


  game = Crafty.e("Game")
  music = new Music()

  center = Crafty.e("ActionCenter").game(game)

  player = Crafty.e("2D, DOM, Color, MoveInCircle, Player, Collision").onHit("Obstacle", ->
    @crash()
    game.stop()
  ).disableControl()

  track  = Crafty.e("Track").player(player).Track().color(Config.cycle.colors.base)

  Crafty.e("Mute")
  pause = Crafty.e("Pause")

  player.bind("LevelUp", ->
    game.levelUp()
  )

  Crafty.bind("Restart", =>
    player.reset()
    track.reset()
    game.reset().start()
  )

  pauseWithEscape = =>


  start = =>
    music.play()

    player.enableControl()
    game.onAction( (action) =>
      Narrator.play(action)
      track.currentSegment(Config.obstacles.changeWhere.initial + Config.obstacles.changeWhere.increaseBy * game.cycles).perform(action)
    ).start()
    pause.bindKeyboard()


  Utils.showText("Ready?")
  Narrator.play "ready", ->
    Utils.showText("Code!")
    Narrator.play "code", ->
      start()

)


Crafty.scene("in_game", ->

  Crafty.viewport.x = Config.viewport.center.x
  Crafty.viewport.y = Config.viewport.center.y

  Crafty.background("#000")


  game = Crafty.e("Game")
  music = new Music()

  center = Crafty.e("ActionCenter").game(game)

  player = Crafty.e("Player").disableControl().onHit("Obstacle", ->
    gameover()
  )

  track  = Crafty.e("Track").player(player).Track().color(Config.gfx.track.baseColor)

  Crafty.e("Mute")

  player.bind("LevelUp", ->
    game.levelUp()
  )

  restart = =>
    track.reset()
    game.reset()
    center.show()
    player.reset()
    ready_go  ->
      game.start()
      player.enableControl()
    mixpanel.track("restart game", tries: game.tries)

  gameover = =>
    center.hide()
    game.stop()
    player.reset().disableControl()
    SFX.play("crash")
    Narrator.play("conflict")
    mixpanel.track("game over", score: game.score(), cycles: game.cycles)
    Crafty.e("GameOver").game(game).bind("Restart", => restart()).show()

  start = =>
    music.play()
    player.enableControl()
    game.onAction( (action) =>
      Narrator.play(action)
      segmentsAheadToChange = Config.obstacles.changeWhere.initial + (Math.random() * Config.obstacles.changeWhere.randomBy) + (Config.obstacles.changeWhere.increaseBy * game.cycles)
      track.currentSegment(Math.floor(segmentsAheadToChange)).perform(action)
    ).start()

  ready_go = (cb) =>
    Utils.showText("Ready?")
    Narrator.play "ready", ->
      Utils.showText("Code!")
      Narrator.play "code", ->
        cb()


  ready_go( -> start())
  mixpanel.track("started game", first: true)

)


Crafty.c "GameOver"
  margin:
    x: 50
    y: 50

  init: ->
    @requires("2D, DOM, Keyboard, Text,Mouse, Delay")
    @delay((=> @show()), Config.flow.restartDelay)

  restart: ->
    @trigger("Restart")
    @button.destroy()
    @destroy()

  show: ->
    @attr(
      x: - Config.viewport.width / 2  + @margin.x
      y: - Config.viewport.height/ 2  + @margin.y
      w:   Config.viewport.width      - @margin.x * 2
      h:   Config.viewport.height     - @margin.y * 2
      z: 50000
    )
    @text("<div><h1>Conflict!</h1><h2>Game Over!</h2><h3>Best score: #{Settings.get('score')}</h3></div>")
    @button = Crafty.e("2D, Mouse, DOM, Text, Button").text("Try Again").attr(x: -130, y: 50, w: 260, h:42, z: 50001).bind('Click', =>
      @restart()
    )
    @bind('KeyDown', (e) => @restart() if e.key == Crafty.keys.ENTER)
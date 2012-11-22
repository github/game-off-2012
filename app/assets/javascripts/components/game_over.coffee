Crafty.c "GameOver"
  margin:
    x: 50
    y: 50

  init: ->
    @requires("2D, DOM, Keyboard, Text,Mouse, Delay, KnowsGame")

  restart: ->
    return unless @canRestart
    @trigger("Restart")
    @button.destroy()
    @destroy()

  nowCanRestart: ->
    @button.css("display","block")
    @attr(canRestart: true)

  show: ->
    @attr(
      x: - Config.viewport.width / 2  + @margin.x
      y: - Config.viewport.height/ 2  + @margin.y
      w:   Config.viewport.width      - @margin.x * 2
      h:   Config.viewport.height     - @margin.y * 2
      z: 50000
      canRestart: false
    )
    isNewHighScore = HighScore.updateHighScore(@game.score())
    highScoreContent = if isNewHighScore then "<em>NEW HIGH SCORE!</em>" else "<h3><strong>High score:</strong> #{Settings.get('score')}</h3>"
    content = """
              <div>
                <h1>Conflict!</h1>
                <h2>Game Over!</h2>
                <br>
                <h3><strong>Score:</strong> #{@game.score()} (#{@game.cycles} cycles)</h3>
                #{highScoreContent}
              </div>
              """
    @text(content)
    @button = Crafty.e("2D, Mouse, DOM, Text, Button").text("Try Again").attr(x: -130, y: 95, w: 260, h:42, z: 50001).bind('Click', =>
      @restart()
    )
    @button.css("display","none")
    @bind('KeyDown', (e) => @restart() if e.key == Crafty.keys.ENTER)
    @delay((=> @nowCanRestart()), Config.flow.restartDelay)
class window.HighScore

  @currentHighScore: ->
    (Settings.get('score') || 0)

  @isHighScore: (score) ->
    score > @currentHighScore()

  @updateHighScore: (score)->
    if @isHighScore(score)
      @setHighScore(score)
      return true
    else
      return false

  @setHighScore: (score) ->
    Settings.set('score', score)
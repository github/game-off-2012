Crafty.c "ActionCenter",

  refreshDelay: 10

  init: ->
    @requires("2D, DOM, Color, Text, KnowsGame")
    @bind("EnterFrame", ->
      @tick()
    )
    @z = Config.gfx.segmentsInitialIndex + 1

  tick: ->
    @x = -70/2
    @y = -36/2

    text = "<strong>Score:</strong><span>#{@game.time}</span><br>" +
           "<strong>Cycles:</strong><span>#{@game.cycles}</span><br>"
    text += "<br><strong class='current-action'>#{@game.currentAction}!<br>" if @game.currentAction

    @text(text)

Crafty.c "ActionCenter",

  refreshDelay: 10
  content: """
           <strong>Score:</strong><span>{0}</span><br>
           <strong>Cycles:</strong><span>{1}</span><br>
           """
  actionContent: "<br><strong class='current-action'>{0}!"

  init: ->
    @requires("2D, DOM, Color, Text, Hideable, KnowsGame")
    @bind("EnterFrame", @tick)
    @z = Config.gfx.segmentsInitialIndex + 1

  tick: ->
    @x = -70/2
    @y = -36/2

    text = @content.format(@game.time, @game.cycles)
    text += @actionContent.format(@game.currentAction) if @game.currentAction

    @text(text)
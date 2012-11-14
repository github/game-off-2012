Crafty.c "ActionCenter",

  refreshDelay: 10

  init: ->
    @requires("2D, DOM, Color, Text, KnowsGame, Delay")
    @delay(@tick, @refreshDelay)

  pivot: (hsh)->
    @_pivot = hsh
    @

  tick: ->
    @x = @_pivot.x - 70/2
    @y = @_pivot.y - 36/2

    text = "<strong>Score:</strong><span>#{@game.time}</span><br>" +
           "<strong>Cycles:</strong><span>#{@game.cycles}</span><br>"

    @text(text)
    @delay(@tick, @refreshDelay)
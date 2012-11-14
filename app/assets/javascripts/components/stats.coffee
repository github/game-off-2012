Crafty.c "Stats",
  _delay: 1


  init: ->
    @requires("2D, DOM, Color, Text, Delay")
    @reset()


  start: ->
    @tick()
    @

  stop: ->
    @attr(
      stopped: true
    )

  pivot: (hsh)->
    @_pivot = hsh
    @

  tick: ->
    @time += @_delay

    @x = @_pivot.x - 70/2
    @y = @_pivot.y - 36/2

    text = "<strong>Score:</strong><span>#{@time}</span><br>" +
    "<strong>Cycles:</strong><span>#{@cycles}</span><br>"


    @text(text)
    @delay((-> @tick()), @_delay) unless @stopped

  levelUp: ->
    @attr(cycles: @cycles + 1)

  reset: ->
    @attr(
      time: 0
      cycles: 0
      currentAction: ""
      stopped: false
    )
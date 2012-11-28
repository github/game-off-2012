Crafty.c "Game",

  _delay: 1
  _actions: Config.actions
  time: 0

  init: ->
    @requires("Delay")
    @attr(tries: 0)
    @reset()

  start: ->
    @attr(stopped: false)
    @tries += 1
    @tick()
    @rollActionIn(Config.obstacles.intervals.atStart)
    @

  stop: ->
    @time++
    @attr(
      stopped: true
    )

  tick: ->
    @time += @_delay * (@cycles + 1)
    Crafty.trigger("tick")
    @delay((-> @tick()), @_delay) unless @stopped

  levelUp: ->
    Utils.showText(Config.gfx.cyclesTitles[@cycles])
    @_actionDelay = Math.max(Config.obstacles.intervals.minimum, @_actionDelay - Config.obstacles.intervals.reduceBy)
    @attr(cycles: @cycles + 1)

  rollActionIn: ->
    @delay((=> @currentAction = null), @_actionDelay * 3/4)
    @delay((=> @rollAction()), @_actionDelay)

  rollAction: ->
    return if @stopped
    @currentAction = _.shuffle(@_actions)[0]
    @trigger("action", @currentAction)
    @rollActionIn()

  onAction: (cb) ->
    @bind("action", cb)

  score: ->
    @time

  reset: ->
    @attr(time: 0, cycles: 0, currentAction: "")
    @_actionDelay = Config.obstacles.intervals.initial
    @
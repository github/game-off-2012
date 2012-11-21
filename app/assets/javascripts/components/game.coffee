Crafty.c "Game",

  _delay: 1
  _actionDelay: Config.obstacles.intervals.initial
  _actions: Config.actions
  time: 0

  init: ->
    @requires("Delay")
    @reset()

  start: ->
    @tick()
    @rollActionIn(Config.obstacles.intervals.atStart)
    @

  stop: ->
    @attr(
      stopped: true
    )

  tick: ->
    @time += @_delay
    Crafty.trigger("tick")
    @delay((-> @tick()), @_delay) unless @stopped

  levelUp: ->
    Utils.showText(Config.gfx.cyclesTitles[@cycles])
    @attr(cycles: @cycles + 1)

  crash: ->

  rollActionIn: (delayOverride = @_actionDelay) ->
    @delay((=> @currentAction = null), delayOverride * 3/4)
    @delay((=> @rollAction()), delayOverride)

  rollAction: ->
    return if @stopped
    @currentAction = _.shuffle(@_actions)[0]
    @trigger("action", @currentAction)
    @rollActionIn()

  onAction: (cb) ->
    @bind("action", cb)

  reset: ->
    @attr(
      time: 0
      cycles: 0
      currentAction: ""
      stopped: false
    )


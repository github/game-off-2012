Crafty.c("Timer",
  init: ->
    @_timers = {};
    @bind("EnterFrame", =>
      now = new Date().getTime()
      for name of @_timers
        item = @_timers[name]
        if (item.start + item.delay + item.pauseDuration < now)
          item.func.call(@)
          item.start = now
          item.pauseDuration = 0
    )
    @bind("Pause", =>
      now = new Date().getTime()
      for name of @_timers
        @_timers[name].pausedAt = now
    )
    @bind("Unpause", =>
      now = new Date().getTime()
      for name of @_timers
        item = @_timers[name]
        item.pauseDuration += now - item.pausedAt
    )

  timer: (name, func, delay) ->
    @_timers[name] = {
      start: new Date().getTime(),
      func: func,
      delay: delay,
      pausedAt: 0,
      pauseDuration: 0
    }
    @

  setTimerDelay: (name, delay) ->
    @_timers[name].delay = delay
    @

  disableTimer: (name) ->
    delete @_timers[name]
    @
)

Crafty.c("ActionBag",
  init: ->
    @requires("Timer")
    @_bags = {}
    @_timerFired = (bagName) ->
      action = Crafty.math.randomElementOfArray(@_bags[bagName].actions)
      @_bags[bagName].func.call(@, action)

  actionBag: (name, actions, func, delay) ->
    @_bags[name] = {
      actions: actions,
      func: func
    }
    @timer(name, (=> @_timerFired(name)), delay)

  setActionBagDelay: (name, delay) ->
    @setTimerDelay(name, delay)

  disableActionBag: (name) ->
    @disableTimer(name)
    delete @_bags[name]
    @
)

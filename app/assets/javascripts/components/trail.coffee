Crafty.c "Trail",

  init: ->
    @requires('2D, DOM, Color, Tween')
    @color(Config.gfx.trail.color)
    @attr(h:Config.player.size, w:Config.player.size)

  Trail: ->
    reduceTo = Config.player.size * Config.gfx.trail.reduceBy
    @tween({alpha: 0, h: reduceTo, w: reduceTo}, Config.gfx.trail.duration)
    @bind("TweenEnd", @destroy)
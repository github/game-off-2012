Crafty.c("Segment",
  attrs: (index, attrs) ->
    console.log(index, attrs)
    @_inner = Crafty.e("Obstacle").attrs(index, attrs.pivot, attrs.innerRadius, attrs.segments)
    @_outer = Crafty.e("Obstacle").attrs(index, attrs.pivot, attrs.outerRadius, attrs.segments)
    @

  paint: (baseColor, index) ->
    @_inner.paint(baseColor, index)
    @_outer.paint(baseColor, index)
    @
)

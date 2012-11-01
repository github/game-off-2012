class Entity 

  constructor: (@x, @y) ->
    
class TestEntity extends Entity
  render:(screen)->
    screen.render @x, @y, 2

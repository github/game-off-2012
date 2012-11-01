class Entity 
  constructor: (@x, @y) ->
  render:(screen)->
  tick:->
    
class TestEntity extends Entity
  render:(screen)->
    screen.render @x, @y, 2
  tick:->

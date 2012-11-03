class Entity 
  constructor: (@x, @y) ->
  render:(screen)->
  tick:->
    
class TestEntity extends Entity
  render:(screen)->
    screen.render @x, @y, 2
  tick:->
  
  
class Model
  constructor:(@world) ->
    
class GroundModel extends Model
  constructor:(@world, @game) ->
    @width = @game.width
    @height = @game.height
    @scale = @game.scale
    
    @fixDef = new b2FixtureDef;
    @fixDef.density = 0.1;
    @fixDef.friction = 0.3;
    @fixDef.restitution = 0.2;
    
    @bodyDef = new b2BodyDef;
    @bodyDef.type = b2Body.b2_staticBody;
    @bodyDef.position.x = @width/@scale/2
    @bodyDef.position.y = 300/@scale/2

    @fixDef.shape = new b2PolygonShape;
    @fixDef.shape.SetAsBox((@width/@scale)/2, (8/@scale)/2)
    @world.CreateBody(@bodyDef).CreateFixture(@fixDef)
    
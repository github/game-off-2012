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
    @body
  
  getX:->
    @body.GetPosition().x
    
  getY:->
    @body.GetPosition().y
    
  setPosition:(x, y)->
    @body.SetPosition(new b2Vec2(x, y), 0)
    
    
class PlayerModel extends Model
  constructor:(@world, @game, @x, @y) ->
    @scale = @game.scale
    
    @fixDef = new b2FixtureDef;
    @fixDef.density = 0.1;
    @fixDef.friction = 0.3;
    @fixDef.restitution = 0.2;
    
    @bodyDef = new b2BodyDef;
    @bodyDef.type = b2Body.b2_dynamicBody;
    @bodyDef.position.x = @x/@scale-10/@scale
    @bodyDef.position.y = @y/@scale

    @fixDef.shape = new b2PolygonShape
    @fixDef.shape.SetAsBox((20/@scale)/2, (20/@scale)/2)
    
    @sensor = new b2FixtureDef
    @sensor.shape = new b2PolygonShape
    @sensor.shape.SetAsBox((25/@scale)/2, (25/@scale)/2)
    @sensor.isSensor = true
    
    @body = @world.CreateBody(@bodyDef)
    
    @fixDef = @body.CreateFixture(@fixDef)
    @sensor = @body.CreateFixture(@sensor)


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
    @fixDef.shape.SetAsBox((2000/@scale)/2, (8/@scale)/2)
    @body = @world.CreateBody(@bodyDef)
    @body.CreateFixture(@fixDef)
    
    
class TeleporterModel extends Model
  constructor:(@world, @game, @x, @y) ->
    @scale = @game.scale
    
    @sensor = new b2FixtureDef
    
    @sensor.shape = new b2PolygonShape
    @sensor.shape.SetAsBox((25/@scale)/2, (10/@scale)/2)
    @sensor.isSensor = true
    
    @bodyDef = new b2BodyDef;
    @bodyDef.type = b2Body.b2_staticBody;
    @bodyDef.position.x = 160/@scale/2
    @bodyDef.position.y = (300-20)/@scale/2
    
    @body = @world.CreateBody(@bodyDef)
    
    @sensor = @body.CreateFixture(@sensor)
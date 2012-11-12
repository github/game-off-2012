class Entity
  constructor: (@x, @y) ->
  
  render:(screen)->
  
  tick:->
  
  setX:(x)->
    @x = x
    
  setY:(y)->
    @y = y
    
class TestEntity extends Entity
  constructor:(@x, @y)->
    super(@x, @y)
    @tile = 16
    
  render:(screen)->
    screen.render @x, @y, @tile
    
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
    
  getBody:->
    @body
    
    
class PlayerModel extends Model
  constructor:(@world, @game, @x, @y) ->
    @scale = @game.scale
    
    @height = 12/@scale
    @width = 12/@scale
    
    @fixDef = new b2FixtureDef
    @fixDef.density = 0.1
    @fixDef.friction = 0.3
    @fixDef.restitution = 0.4
    
    @bodyDef = new b2BodyDef
    @bodyDef.type = b2Body.b2_dynamicBody
    @bodyDef.position.x = @x/@scale-10/@scale
    @bodyDef.position.y = @y/@scale

    @fixDef.shape = new b2PolygonShape
    @fixDef.shape.SetAsBox(@width, @height)
    
    @body = @world.CreateBody(@bodyDef)
    
    @fixDef = @body.CreateFixture(@fixDef)
    
  getScreenX:->
    (@body.GetPosition().x-@width)*@scale
    
  getScreenY:->
    (@body.GetPosition().y-@height)*@scale


class GroundModel extends Model
  constructor:(@world, @game) ->
    @width = @game.width
    @height = @game.height
    @scale = @game.scale
    
    @fixDef = new b2FixtureDef
    @fixDef.density = 0.1
    @fixDef.friction = 0.3
    @fixDef.restitution = 0.4
    
    @bodyDef = new b2BodyDef
    @bodyDef.type = b2Body.b2_staticBody
    @bodyDef.position.x = @width/@scale/2
    @bodyDef.position.y = 250/@scale/2
    
    @fixDef.shape = new b2PolygonShape
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
    
    @bodyDef = new b2BodyDef
    @bodyDef.type = b2Body.b2_staticBody
    @bodyDef.position.x = 160/@scale/2
    @bodyDef.position.y = (300-20)/@scale/2
    
    @body = @world.CreateBody(@bodyDef)
    
    @sensor = @body.CreateFixture(@sensor)
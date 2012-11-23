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
    
  setUserData:(data)->
    @body.UserData = data
  
  getUserData:->
    @body.UserData  
    
class PlayerModel extends Model
  
  constructor:(@world, @x, @y) ->
    @scale = SCALE
    
    @height = 12/@scale
    @width = 12/@scale
    
    @fixDef = new b2FixtureDef
    @fixDef.density = 0.1
    @fixDef.friction = 0.3
    @fixDef.restitution = 0.4
    
    #Collision-Filtering == AWESOME
    @fixDef.filter.categoryBits = 0x02
    @fixDef.filter.maskBits = 0x01
    
    @bodyDef = new b2BodyDef
    @bodyDef.type = b2Body.b2_dynamicBody
    @bodyDef.position.x = @x/@scale-6/@scale
    @bodyDef.position.y = @y/@scale

    @fixDef.shape = new b2PolygonShape
    @fixDef.shape.SetAsBox(@width, @height)
    
    
    @body = @world.CreateBody(@bodyDef)
    @body.SetFixedRotation(true)
    @body.ShouldCollide(false)
    
    
    @fixDef = @body.CreateFixture(@fixDef)
    
  getScreenX:->
    (@body.GetPosition().x-@width)*@scale
    
  getScreenY:->
    (@body.GetPosition().y-@height)*@scale
    
  tick:->
    @body.SetLinearVelocity(new b2Vec2(5, @body.GetLinearVelocity().y));
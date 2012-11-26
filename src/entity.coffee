class Entity
  constructor: () ->
    @died = false
  
  render:(screen)->
  
  tick:->
  
  setX:(x)->
    @x = x
    
  setY:(y)->
    @y = y
  
  hurt:(damage)->
    
  hasDied:->
    @died
    
  die:->
    @died = true
    

class Tower extends Entity
  constructor:(@hp)->super
  
  hurt:(damage)->
    @hp -= damage
    if @hp <= 0
      @die()

class TestEntity extends Entity
  constructor:->
    super()  
    @tile = 16
    @stop =  false
    @ap = 2
    @tickcount = 0
    
  collide:(entity)->
    if entity instanceof Tower
        entity.hurt(@ap)
        @attackE = entity
        @stop = true
    
  render:(screen)->
    screen.render @x, @y, @tile
    
  tick:->
    @tickcount++
    if @attackE?
      
      if @attackE.hasDied()
        @stop = false
        @attackE = null
        
      if @tickcount % 60 == 0 and @attackE? 
        @attackE.hurt(@ap)
  
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
    
    @sensorDef = new b2FixtureDef
    @sensorDef.shape = new b2PolygonShape
    @sensorDef.shape.SetAsBox(@width+20/@scale, @height+20/@scale)
    @sensorDef.isSensor = true
    
    @body = @world.CreateBody(@bodyDef)
    @body.SetFixedRotation(true)
    
    
    @fixDef = @body.CreateFixture(@fixDef)
    @body.CreateFixture(@sensorDef)
    
  getScreenX:->
    (@body.GetPosition().x-@width)*@scale
    
  getScreenY:->
    (@body.GetPosition().y-@height)*@scale
    
  tick:->
    @body.SetLinearVelocity(new b2Vec2(5, @body.GetLinearVelocity().y));
  
  wakeUp:->
    @body.SetAwake(true)  
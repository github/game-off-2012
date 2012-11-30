#base-entity-class
class Entity
  constructor:()->@died = false
  render:(screen)->
  tick:->
  setX:(@x)->    
  setY:(@y)->
  hurt:(damage)->
    @hp -= damage
    if @hp <= 0
      @die()
  collide:(entity)->
  hasDied:->@died
  die:->@died = true
  hasStopped:->@stop

class Tower extends Entity
  constructor:(@hp, @img)->super
  
  render:(ctx)->
    ctx.drawImage(@img, @x, @y)

class Archer extends Entity
  constructor:->
    super()  
    @tile = 16
    @stop = false
    @ap = 3
    @hp = 2
    @tickcount = 0
    
  collide:(entity)->
    if entity instanceof Entity and entity !instanceof Warrior and entity !instanceof Archer 
        @tickcount = 0
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
        
class Warrior extends Entity
  constructor:->
    super()  
    @tile = 17
    @stop = false
    @ap = 2
    @hp = 4
    @tickcount = 0
    
  collide:(entity)->
    if entity instanceof Entity and entity !instanceof Warrior and entity !instanceof Archer
        console.log("colided")
        @tickcount = 0
        entity.hurt(@ap)
        @attackE = entity
        @stop = true
        console.log(@stop)
        
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

class BadWarrior extends Entity
  constructor:->
    super()  
    @tile = 19
    @stop = false
    @ap = 2
    @hp = 4
    @tickcount = 0
    
  collide:(entity)->
    if entity instanceof Entity and entity !instanceof BadWarrior and entity !instanceof BadArcher
        @tickcount = 0
        entity.hurt(@ap)
        @attackE = entity
        @stop = true
        console.log(@stop)
        
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

class BadArcher extends Entity
  constructor:->
    super()  
    @tile = 18
    @stop = false
    @ap = 3
    @hp = 2
    @tickcount = 0
    
  collide:(entity)->
    if entity instanceof Entity and entity !instanceof BadWarrior and entity !instanceof BadArcher
        @tickcount = 0
        entity.hurt(@ap)
        @attackE = entity
        @stop = true
        console.log(@stop)
        
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
#base-model-class
class Model
  constructor:(@world)->
  getX:->@body.GetPosition().x
  getY:->@body.GetPosition().y
  setPosition:(x, y)->@body.SetPosition(new b2Vec2(x, y), 0)
  getBody:->@body
  setUserData:(data)->@body.UserData = data  
  getUserData:->@body.UserData  
  setStopped:(@stopped)->
  hasStopped:->@stopped

class EntityModel extends Model
  constructor:(@world, @x, @y, @seewidth, @speed, @category, @mask) ->
    @scale = SCALE
    
    @height = 12/@scale
    @width = 12/@scale
    
    @stopped = false
    
    fixDef = new b2FixtureDef
    fixDef.density = 1
    fixDef.friction = 1
    fixDef.restitution = 0
    
    #Collision-Filtering == AWESOME
    fixDef.filter.categoryBits = @category
    fixDef.filter.maskBits = @mask
    
    bodyDef = new b2BodyDef
    bodyDef.type = b2Body.b2_dynamicBody
    bodyDef.position.x = @x/@scale-6/@scale
    bodyDef.position.y = @y/@scale

    fixDef.shape = new b2PolygonShape
    fixDef.shape.SetAsBox(@width, @height)
    
    sensorDef = new b2FixtureDef
    sensorDef.shape = new b2PolygonShape
    sensorDef.shape.SetAsBox(@seewidth/@scale, @seewidth/@scale)
    sensorDef.isSensor = true
    
    @body = @world.CreateBody(bodyDef)
    @body.SetFixedRotation(true)
    
    
    fixDef = @body.CreateFixture(fixDef)
    @body.CreateFixture(sensorDef)
    
  getScreenX:->(@body.GetPosition().x-@width)*@scale
  getScreenY:->(@body.GetPosition().y-@height)*@scale
  tick:->
    #@body.SetTransform(new b2Vec2(0, @body.GetPosition().y))
    if @stopped == false
      @body.SetPosition(new b2Vec2(@body.GetPosition().x+(@speed/30), @body.GetPosition().y))
      
  wakeUp:->@body.SetAwake(true)
$ = Zepto 

$ ->
   @b2Vec2 = Box2D.Common.Math.b2Vec2;
   @b2BodyDef = Box2D.Dynamics.b2BodyDef;
   @b2Body = Box2D.Dynamics.b2Body;
   @b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
   @b2Fixture = Box2D.Dynamics.b2Fixture;
   @b2World = Box2D.Dynamics.b2World;
   @b2MassData = Box2D.Collision.Shapes.b2MassData;
   @b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
   @b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
   @b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
   
   list = new List()
   list.add(1)
   list.add(2)
   list.add(3)
   
   game = new Game()
   game.run()

class Game
  
  constructor: ->
    @width = 600.0
    @height = 400.0
    @scale = 30.0
    
    @screen = new Screen(@width, @height)
    @world = new b2World(new b2Vec2(0, 10), true)
    @debugDraw = new b2DebugDraw()
    @debugDraw.SetSprite(document.getElementById("board").getContext("2d"))
    @debugDraw.SetDrawScale(@scale)
    @debugDraw.SetFillAlpha(0.3)
    @debugDraw.SetLineThickness(1.0)
    @debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
    
    @world.SetDebugDraw(@debugDraw)
    
    @contactListener = new Box2D.Dynamics.b2ContactListener;
    @contactListener.BeginContact = @beginContacts
    @world.SetContactListener(@contactListener);
    
    @player = new PlayerModel @world , this, 40, 40
    
    @e1 = new PlayerModel @world, this, 100, 80
    @e2 = new PlayerModel @world, this, 900, 80
    
    @init()
  
  init: ->
    @xOffset = 0
    @ground = new GroundModel @world , this
    
    @canvas = @screen.canvas
    window.addEventListener("keydown", @keys)   
    window.addEventListener("keyup", @keysup)   
  
  keysup:(e)=>
    console.log(e.keyCode)
    if e.keyCode is 68
      body = @player.body
      console.log(body)
      body.GetLinearVelocity().x = 0
      
    if e.keyCode is 65
      body = @player.body
      console.log(body.GetLinearVelocity().x)
      body.GetLinearVelocity().x = 0  
    
  keys:(e)=>
    console.log(e.keyCode)
    if e.keyCode is 32 or e.keyCode is 87
       body = @player.body
       impulse = body.GetMass()*20
       body.ApplyImpulse(new b2Vec2(0, impulse), body.GetWorldCenter())
       
    if e.keyCode is 68
      body = @player.body
      console.log(body)
      body.GetLinearVelocity().x = 5
      
    if e.keyCode is 65
      body = @player.body
      console.log(body.GetLinearVelocity().x)
      body.GetLinearVelocity().x = -5
      
      
  beginContacts:(begin, manifold)=>
    if begin.m_fixtureA is @player.sensor or begin.m_fixtureB is @player.sensor 
      console.log("sensor hit something")
    #console.log(begin)
    #console.log("contact")
    
  run: ->
    @e = new TestEntity(10, 10)
    @render()
  
  render: =>
      @world.Step(1 / 60, 10, 10);
      
      @checkCamera()
      
      @world.DrawDebugData();
      @world.ClearForces();
      window.requestAnimFrame(@render)
      #@e.render(@screen)
      
  checkCamera:=>
    position = @player.body.GetPosition()
    
    @xOffset =0
    
    if (position.x*@scale) > 240
      @xOffset = -(5/@scale)   
      @player.body.SetPosition(new b2Vec2(240/@scale, position.y), 0)
      
    if (position.x*@scale) < 40
      @xOffset = +(5/@scale)   
      @player.body.SetPosition(new b2Vec2(40/@scale, position.y), 0)
      
      
    gbody = @ground.body.GetBody()
    gbody.SetPosition(new b2Vec2(gbody.GetPosition().x+@xOffset, gbody.GetPosition().y), 0)
    ebody = @e1.body
    ebody.SetPosition(new b2Vec2(ebody.GetPosition().x+@xOffset, ebody.GetPosition().y), 0)
    ebody = @e2.body
    ebody.SetPosition(new b2Vec2(ebody.GetPosition().x+@xOffset, ebody.GetPosition().y), 0)
    

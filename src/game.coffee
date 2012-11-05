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
    
    @teleports= new List
    
    @contactListener = new Box2D.Dynamics.b2ContactListener;
    @contactListener.BeginContact = @beginContacts
    @world.SetContactListener(@contactListener);
    
    @modelList = new List
    
    @player = new PlayerModel @world , this, 40, 40

    @camera = new Camera(@)
    

    @ground = new GroundModel @world , this
    
    @modelList.add @ground
    @modelList.add new PlayerModel @world, this, 200, 80
    @modelList.add new PlayerModel @world, this, 920, 80
    
    @tp1 = new TeleporterModel @world, this, 300, 80
    
    @modelList.add @tp1
    
    @init()
  
  init: ->
    @xOffset = 0
    
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
    if begin.m_fixtureA is @player.sensor
      if begin.m_fixtureB is @tp1.sensor        
        @teleports.add([@player,@tp1])
        #@player.setPosition(400/@scale, @player.getY()) 
      
    #console.log(begin)
    #console.log("contact")
    
  run: ->
    @e = new TestEntity(10, 10)
    @render()
  
  render: =>
      @world.Step(1 / 60, 10, 10);
      
      if @teleports.size() > 0
        for i in [0..@teleports.size()-1]    
          e = @teleports.get(i)[0]
          e.setPosition(600/@scale, 60/@scale)
          @camera.setXoffset(-700/@scale)
          @teleports.del(i--)
      
      @camera.tick()
      
      @world.DrawDebugData();
      @world.ClearForces();
      window.requestAnimFrame(@render)
      #@e.render(@screen)

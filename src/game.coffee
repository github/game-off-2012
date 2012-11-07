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
   
   game = new Game()
   game.run()

class Game
  constructor: ->
    @width = 640.0
    @height = 480.0
    @phScale = 30.0
    
    @canvas = document.getElementById("board");
    @canvas.width = 640
    @canvas.height = 480
    
    @ctx = @canvas.getContext('2d');
    #Actual Pixels
    @pixels = @ctx.getImageData(0, 0, @width, @height)
    #InputHandler
    @inputHandler = new InputHandler
    #Screen for drawings
    @screen = new Screen(@width, @height, @ctx)
    #box2dweb-world for physics
    @world = new b2World(new b2Vec2(0, 10), true)
    #debugdraw for physics
    @debugDraw = new b2DebugDraw()
    @debugDraw.SetSprite(document.getElementById("board").getContext("2d"))
    @debugDraw.SetDrawScale(@phScale)
    @debugDraw.SetFillAlpha(0.3)
    @debugDraw.SetLineThickness(1.0)
    @debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
    @world.SetDebugDraw(@debugDraw)
    
    
    #@contactListener = new Box2D.Dynamics.b2ContactListener;
    #@world.SetContactListener(@contactListener);

    @camera = new Camera(@)
      
  beginContacts:(begin, manifold)=>
    #console.log("contact")
    
  run: =>
    @tick()
    @render()
    window.requestAnimFrame(@run)
    
  tick: ->
      @world.Step(1 / 60, 10, 10);
      @world.ClearForces();
      #entities.tick()
      @camera.tick()
      
      #if @inputHandler.LEFT.isPressed() is true
      #  @player.getBody().GetLinearVelocity().x  = -5
      #  @player.getBody().SetAwake(true)
      #  console.log(@player.getBody())
        
        
      #if @inputHandler.RIGHT.isPressed() is true
      #  @player.getBody().GetLinearVelocity().x  = 5
      #  @player.getBody().SetAwake(true)
      
      
      #if @teleports.size() > 0
      #  for i in [0..@teleports.size()-1]    
      #    e = @teleports.get(i)[0]
      #    e.setPosition(600/@phScale, 60/@phScale)
      #    @camera.setXoffset(-700/@phScale)
      #   @teleports.del(i--)
     
  render: =>
      #Method with scale functionality
      pix = @screen.pixels
      for row in [0..pix.height-1]
        for col in [0..pix.width-1]
          index = (col + row * 64);
          r = pix.data[index*4+0]
          g = pix.data[index*4+1]
          b = pix.data[index*4+2]
          a = pix.data[index*4+3]
        
          for y in [0..10]
            destRow = row * 10 + y
            for x in [0..10]
              desCol = col * 10 + x
              @pixels.data[(destRow * 640 + desCol)*4+0] = r
              @pixels.data[(destRow * 640 + desCol)*4+1] = g
              @pixels.data[(destRow * 640 + desCol)*4+2] = b
              @pixels.data[(destRow * 640 + desCol)*4+3] = a
      
       @ctx.putImageData(@pixels, 0, 0)
       #@world.DrawDebugData();
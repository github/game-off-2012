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

class Game
  constructor: ->
    @width = 640.0
    @height = 480.0
    @scale = 30.0
    
    @canvas = document.getElementById("board");
    @canvas.width = 640
    @canvas.height = 480
    
    @ctx = @canvas.getContext('2d');
    #Webkit no nearest-neighbor
    @ctx.webkitImageSmoothingEnabled = false
    @ctx.mozImageSmoothingEnabled= false
    
    #Actual Pixels
    #@pixels = @ctx.getImageData(0, 0, @width, @height)
    #InputHandler
    @inputHandler = new InputHandler
    #Screen for drawings
    @screen = new Screen(@width, @height, @ctx)
    #box2dweb-world for physics
    @world = new b2World(new b2Vec2(0, 10), true)
    #debugdraw for physics
    @debugDraw = new b2DebugDraw()
    @debugDraw.SetSprite(document.getElementById("board").getContext("2d"))
    @debugDraw.SetDrawScale(@scale)
    @debugDraw.SetFillAlpha(0.8)
    @debugDraw.SetAlpha(1)
    @debugDraw.SetLineThickness(1.0)
    @debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
    @world.SetDebugDraw(@debugDraw)
    
    @ticks = 0
    @screen.clear()
    @xOff = 0
    
    #A bundle looks like that {sheet:--, img:--}
    @ll = new LevelLoader {sheet:"level/sheet.json", img:"img/sprites.png"}, @world, @
    new PlayerModel @world, @, 20, 88
    
    #Not used at the moment
    @camera = new Camera(@)
      
  beginContacts:(begin, manifold)=>
    console.log("contact")
    
  run: =>
    @tick()
    @render()
    window.requestAnimFrame(@run)
    
  tick: ->
      @world.Step(1 / 60, 10, 10);
      @world.ClearForces();
      #entities.tick()
      @camera.tick()
      
      if @inputHandler.RIGHT.isPressed() is true
        if @xOff != 128
          @xOff += 1
        
      if @inputHandler.LEFT.isPressed() is true
        if @xOff != 0
          @xOff -= 1
        
        
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
      @screen.clear()
      #render entities
      @world.DrawDebugData();
      @ctx.drawImage(@ll.background,0+@xOff, 0, 128, 128, 0, 0, 640, 480)
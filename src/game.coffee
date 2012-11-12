$ = Zepto

$ ->
  @b2Vec2 = Box2D.Common.Math.b2Vec2
  @b2BodyDef = Box2D.Dynamics.b2BodyDef
  @b2Body = Box2D.Dynamics.b2Body
  @b2FixtureDef = Box2D.Dynamics.b2FixtureDef
  @b2Fixture = Box2D.Dynamics.b2Fixture
  @b2World = Box2D.Dynamics.b2World
  @b2MassData = Box2D.Collision.Shapes.b2MassData
  @b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
  @b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
  @b2DebugDraw = Box2D.Dynamics.b2DebugDraw
  
  game = new Game()

class Game
  constructor: ->
    @width = 640.0
    @height = 480.0
    @scale = 30
    
    @canvas = document.getElementById("board")
    @canvas.width = 640
    @canvas.height = 480
    
    @ctx = @canvas.getContext('2d')
    #Webkit no nearest-neighbor
    @ctx.webkitImageSmoothingEnabled = false
    @ctx.mozImageSmoothingEnabled= false
    
    #Actual Pixels
    #@pixels = @ctx.getImageData(0, 0, @width, @height)
    #InputHandler
    @inputHandler = new InputHandler
    #Screen for drawings
    @screen = new Screen(new SpriteSheet("img/sprites.png", 8))
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
    
    @e = new TestEntity(50, 0)
    
    @ticks = 0
    
    @xOff = 0
    
    #A bundle looks like that {sheet:--, img:--}
    bundle = {sheet:"level/sheet.json", img:"img/sprites.png"}
    @ll = new LevelLoader bundle, @world, @
    @model = new PlayerModel @world, @, 200, 88
    
    #640/(8*16)
    @screenscale = 5
    
    @camera = new Camera(@world,@scale,@screenscale,@inputHandler)
      
  beginContacts:(begin, manifold)=>
    console.log("contact")
    
  run: =>
    @tick()
    @render()
    window.requestAnimFrame(@run)
    
  tick: ->
    @world.Step(1 / 60, 10, 10)
    @world.ClearForces()
    
    #entities.tick()
    @e.setX(@model.getScreenX())
    @e.setY(@model.getScreenY())
    @camera.tick()
  
  render: =>
    #render entities
    @ctx.clearRect(0, 0, 640, 480)
    @world.DrawDebugData()
    @ctx.drawImage(@ll.background,@camera.getXoffset(), 0, 128, 128, 0, 0, 640, 480)
    @screen.clear()
    @e.render(@screen)
    @ctx.drawImage(@screen.draw(),0, 0, 640, 480)

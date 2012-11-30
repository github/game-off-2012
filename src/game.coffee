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
  
  @WIDTH = 640.0
  @HEIGHT = 480.0
  @SCALE = 30
  #GLOABAL Storage
  @STORAGE = new Storage()
  
  #Short-Aliases
  il = SimpleImageLoader
  jl = SimpleJSONLoader
  
  #Register some Loaders
  STORAGE.register(new il("img/sprites.png", "spritesheet"),
    new jl("level/test.json", "test"),
    new jl("level/level2.json", "test2"),
    new jl("img/towermodel.json", "towermodel"))
  
  game = new Game()
  @STORAGE.setOnFinish(game.init)
  
class Game
  constructor: ->
    console.log("CREATE Game")
    @scale = 30
  
  init:=>
    console.log("INIT Game")
    @running = false
    
    #box2dweb-world for physics
    @world = new b2World(new b2Vec2(0, 10), true)
    
    #Init DebugDraw
    debugDraw = new b2DebugDraw()
    debugDraw.SetSprite(document.getElementById("board").getContext("2d"))
    debugDraw.SetDrawScale(@scale)
    debugDraw.SetFillAlpha(0.8)
    debugDraw.SetAlpha(1)
    debugDraw.SetLineThickness(1.0)
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
    @world.SetDebugDraw(debugDraw)
    
    @screen = new Screen("board", STORAGE.getRessource("spritesheet"))
    
    #InputHandler
    @inputHandler = new InputHandler
    
    #The Camera
    @camera = new Camera('undefined',30 ,5,@inputHandler)
    
    @level = new TestLevel("board", STORAGE.getRessource("test"), @camera, @)
    @camera.setWorld(@level.getWorld())
    @camera.setActive(true)
  
  loadLevel:(index)->
    @level = @levels[index]
    impress().goto("game")
  
  win: ->
    @running = false
    impress().goto("won")
    
  lose:->
    @running = false
    impress().goto("lost")
  
  run: =>
    @tick() if @running
    @render() if @running
    window.requestAnimFrame(@run) if @running
    
  tick: ->
    @level.tick() if @level?
    @camera.tick() if @camera.isActive()
  
  render: ->
    #@screen.clear()
    @level.draw(@camera.getXoffset(), 0) if @level?
    #@screen.draw()

